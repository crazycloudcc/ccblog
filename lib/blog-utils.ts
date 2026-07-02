import type { Post } from "@/lib/posts";

export type YearGroup = {
  year: string;
  posts: Post[];
};

export function groupPostsByYear(posts: Post[]): YearGroup[] {
  const groups = new Map<string, Post[]>();

  for (const post of posts) {
    const year = post.date.slice(0, 4);
    const bucket = groups.get(year) ?? [];
    bucket.push(post);
    groups.set(year, bucket);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, yearPosts]) => ({ year, posts: yearPosts }));
}

export function formatDateParts(date: string) {
  const parsed = new Date(`${date}T00:00:00`);

  return {
    year: parsed.getFullYear().toString(),
    month: parsed.toLocaleString("en-US", { month: "short" }),
    day: parsed.getDate().toString().padStart(2, "0"),
    weekday: parsed.toLocaleString("en-US", { weekday: "short" }),
  };
}
