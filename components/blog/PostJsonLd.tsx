import type { Post } from "@/lib/posts";
import { absoluteUrl, resolvePostOgImage } from "@/lib/metadata";
import { countWords, estimateReadingTime } from "@/lib/blog-utils";
import { SITE_AUTHOR, SITE_LANG, SITE_URL } from "@/lib/site";

type PostJsonLdProps = {
  post: Post;
};

export function PostJsonLd({ post }: PostJsonLdProps) {
  const payload = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: `${post.date}T00:00:00.000Z`,
    dateModified: `${post.updated ?? post.date}T00:00:00.000Z`,
    author: {
      "@type": "Person",
      name: SITE_AUTHOR,
    },
    publisher: {
      "@type": "Person",
      name: SITE_AUTHOR,
      url: SITE_URL,
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    url: absoluteUrl(`/blog/${post.slug}`),
    image: resolvePostOgImage(post),
    inLanguage: post.lang ?? SITE_LANG,
    keywords: post.tags.join(", "),
    wordCount: countWords(post.content),
    timeRequired: `PT${estimateReadingTime(post.content)}M`,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: absoluteUrl(`/blog/${post.slug}`) },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
