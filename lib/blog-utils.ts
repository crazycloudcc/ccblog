import type { Post } from "@/lib/posts";
import { SITE_LANG, SITE_LOCALE } from "@/lib/site";

export type YearGroup = {
  year: string;
  posts: Post[];
};

const WORDS_PER_MINUTE = 200;
const CJK_CHARS_PER_MINUTE = 400;
// CJK + Hiragana/Katakana + Hangul (common ranges; sufficient for zh/ja/ko).
const CJK_RE = /[㐀-鿿豈-﫿぀-ヿ가-힯]/g;

/** Count "word units" in a CJK-aware way: each CJK char counts as one, latin runs split on whitespace. */
export function countWords(content: string): number {
  const cjkChars = (content.match(CJK_RE) ?? []).length;
  const latin = content.replace(CJK_RE, " ").trim();
  const latinWords = latin ? latin.split(/\s+/).filter(Boolean).length : 0;
  return cjkChars + latinWords;
}

export function estimateReadingTime(content: string): number {
  const cjkChars = (content.match(CJK_RE) ?? []).length;
  const latin = content.replace(CJK_RE, " ").trim();
  const latinWords = latin ? latin.split(/\s+/).filter(Boolean).length : 0;
  const minutes = cjkChars / CJK_CHARS_PER_MINUTE + latinWords / WORDS_PER_MINUTE;
  return Math.max(1, Math.ceil(minutes));
}

export function formatReadingTime(minutes: number, lang?: string): string {
  const isZh = (lang ?? SITE_LANG).toLowerCase().startsWith("zh");
  return isZh ? `${minutes} 分钟阅读` : `${minutes} min read`;
}

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

export function formatDateParts(date: string, locale: string = SITE_LOCALE) {
  const parsed = new Date(`${date}T00:00:00`);

  return {
    year: parsed.getFullYear().toString(),
    month: parsed.toLocaleString(locale, { month: "short" }),
    day: parsed.getDate().toString().padStart(2, "0"),
    weekday: parsed.toLocaleString(locale, { weekday: "short" }),
  };
}
