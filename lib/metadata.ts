import type { Metadata } from "next";
import type { Post } from "@/lib/posts";
import { getPostOgImage } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop";

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
};

export function absoluteUrl(path = ""): string {
  if (!path) {
    return SITE_URL;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  image,
  type = "website",
  publishedTime,
}: PageMetadataOptions = {}): Metadata {
  const pageTitle = title ? `${title} — ${SITE_NAME}` : SITE_TITLE;
  const url = absoluteUrl(path);
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": absoluteUrl("/feed.xml"),
      },
    },
    openGraph: {
      type,
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: pageTitle,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
    },
  };
}

export function createPostMetadata(post: Post): Metadata {
  const path = `/blog/${post.slug}`;
  const image = getPostOgImage(post.content) ?? DEFAULT_OG_IMAGE;

  return createPageMetadata({
    title: post.title,
    description: post.excerpt,
    path,
    image,
    type: "article",
    publishedTime: `${post.date}T00:00:00.000Z`,
  });
}
