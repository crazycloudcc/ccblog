import type { MetadataRoute } from "next";
import { getLatestContentDate, getPostModified, getPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/metadata";
import { isRouteEnabled } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const latest = getLatestContentDate();
  const staticRoutes = ["", "/blog", "/apps", "/playground", "/about"].filter((route) =>
    isRouteEnabled(route),
  );

  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: latest,
    changeFrequency: route === "" || route === "/blog" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(`${getPostModified(post)}T00:00:00.000Z`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...postPages];
}
