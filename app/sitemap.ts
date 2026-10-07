import { latestLessonUpdate } from "@/lib/visualizations/lesson-publication";
import { lessons } from "@/lib/visualizations/lessons";
import type { MetadataRoute } from "next";
import {
  getIndexedPosts,
  getLatestContentDate,
  getPostModified,
  getPostsBySeriesSlug,
  getPublicSeries,
} from "@/lib/posts";
import { absoluteUrl } from "@/lib/metadata";
import { isRouteEnabled } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getIndexedPosts();
  const latest = getLatestContentDate();
  const staticRoutes = ["", "/blog", "/learn", "/apps", "/playground", "/about"].filter((route) =>
    isRouteEnabled(route),
  );

  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: route === "/learn" ? new Date(`${latestLessonUpdate}T00:00:00.000Z`) : latest,
    changeFrequency: route === "" || route === "/blog" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(`${getPostModified(post)}T00:00:00.000Z`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const seriesPages: MetadataRoute.Sitemap = isRouteEnabled("/blog")
    ? getPublicSeries().map((series) => {
        const seriesPosts = getPostsBySeriesSlug(series.slug);
        const latestModified = seriesPosts.reduce((max, post) => {
          const modified = getPostModified(post);
          return modified > max ? modified : max;
        }, "1970-01-01");

        return {
          url: absoluteUrl(`/blog/series/${series.slug}`),
          lastModified: new Date(`${latestModified}T00:00:00.000Z`),
          changeFrequency: "monthly" as const,
          priority: 0.8,
        };
      })
    : [];

  const visualPages: MetadataRoute.Sitemap = isRouteEnabled("/learn")
    ? Object.entries(lessons).map(([slug, lesson]) => ({
        url: absoluteUrl(`/learn/${slug}`),
        lastModified: new Date(`${lesson.updated}T00:00:00.000Z`),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    : [];

  return [...pages, ...seriesPages, ...postPages, ...visualPages];
}
