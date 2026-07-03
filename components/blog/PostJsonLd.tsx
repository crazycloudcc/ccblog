import type { Post } from "@/lib/posts";
import { absoluteUrl, resolvePostOgImage } from "@/lib/metadata";
import { estimateReadingTime } from "@/lib/blog-utils";
import { SITE_AUTHOR, SITE_NAME, SITE_URL } from "@/lib/site";

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
    dateModified: `${post.date}T00:00:00.000Z`,
    author: {
      "@type": "Person",
      name: SITE_AUTHOR,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    url: absoluteUrl(`/blog/${post.slug}`),
    image: resolvePostOgImage(post),
    keywords: post.tags.join(", "),
    wordCount: post.content.trim().split(/\s+/).filter(Boolean).length,
    timeRequired: `PT${estimateReadingTime(post.content)}M`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
