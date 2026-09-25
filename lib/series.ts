export type SeriesEntry = {
  slug: string;
  title: string;
  description: string;
};

export const seriesCatalog: SeriesEntry[] = [
  {
    slug: "browser-cpp",
    title: "浏览器里的 C++",
    description:
      "clang 在浏览器本地编译 C 和 C++。每篇都能跑，每篇只讲一个坑。",
  },
];

export function getSeriesBySlug(slug: string): SeriesEntry | undefined {
  return seriesCatalog.find((series) => series.slug === slug);
}
