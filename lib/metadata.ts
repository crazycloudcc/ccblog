import type { Metadata } from "next";
import type { Post } from "@/lib/posts";
import { getPostOgImage } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_LANG, SITE_NAME, SITE_URL, siteConfig } from "@/lib/site";

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  lang?: string;
  robots?: Metadata["robots"];
};

export function absoluteUrl(path = ""): string {
  if (!path) {
    return SITE_URL;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function defaultOgImageUrl(): string {
  return absoluteUrl("/opengraph-image");
}

/** Map a BCP-47 lang (e.g. "zh-CN", "en") to an OpenGraph locale (e.g. "zh_CN", "en_US"). */
export function ogLocale(lang?: string): string {
  const base = (lang ?? SITE_LANG).toLowerCase();
  if (base.startsWith("zh")) return "zh_CN";
  if (base.startsWith("en")) return "en_US";
  return base.replace("-", "_");
}

export function resolvePostOgImage(post: Post): string {
  if (post.ogImage) {
    return post.ogImage.startsWith("http") ? post.ogImage : absoluteUrl(post.ogImage);
  }

  return getPostOgImage(post.content) ?? defaultOgImageUrl();
}

export function createPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  image,
  type = "website",
  publishedTime,
  lang,
  robots,
}: PageMetadataOptions = {}): Metadata {
  const pageTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} · terminal blog & in-browser C/C++`;
  const url = absoluteUrl(path);
  const ogImage = image ?? defaultOgImageUrl();

  const logo = siteConfig.logo;

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(SITE_URL),
    // app/icon.* and app/apple-icon.* are picked up automatically; also
    // declare logo when present so tabs/bookmarks stay consistent after forks.
    ...(logo
      ? {
          icons: {
            icon: [{ url: logo }, { url: "/icon.png", type: "image/png", sizes: "192x192" }],
            apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
          },
        }
      : {}),
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": absoluteUrl("/feed.xml"),
      },
    },
    openGraph: {
      type,
      locale: ogLocale(lang),
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
    ...(robots ? { robots } : {}),
  };
}

export function createPostMetadata(post: Post): Metadata {
  const path = `/blog/${post.slug}`;

  return createPageMetadata({
    title: post.title,
    description: post.excerpt,
    path,
    image: resolvePostOgImage(post),
    type: "article",
    publishedTime: `${post.date}T00:00:00.000Z`,
    lang: post.lang,
  });
}
