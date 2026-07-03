import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostCover = {
  from: string;
  to: string;
  label: string;
  caption: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  cover: PostCover;
  tags: string[];
  ogImage?: string;
};

type PostFrontmatter = {
  title: string;
  excerpt: string;
  date: string;
  coverLabel?: string;
  slug?: string;
  tags?: string[] | string;
  ogImage?: string;
};

const NOTES_DIR = path.join(process.cwd(), "content/notes");

const coverPalettes: PostCover[] = [
  { from: "#303055", to: "#8844ae", label: "cloud", caption: "infra / deploy" },
  { from: "#3b61b0", to: "#096e72", label: "runtime", caption: "systems / code" },
  { from: "#403f53", to: "#767682", label: "notes", caption: "journal / build" },
  { from: "#096e72", to: "#303055", label: "devops", caption: "pipeline / ops" },
  { from: "#8844ae", to: "#3b61b0", label: "stack", caption: "tools / craft" },
  { from: "#984e4d", to: "#303055", label: "debug", caption: "trace / fix" },
];

function pickCover(index: number, label: string): PostCover {
  const palette = coverPalettes[index % coverPalettes.length];
  return { ...palette, label: label.slice(0, 12) };
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

function normalizeTags(value: unknown): string[] {
  if (!value) {
    return [];
  }

  const tags = Array.isArray(value) ? value : [value];
  return [...new Set(tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean))].sort();
}

function readPostFile(fileName: string, index: number): Post {
  const filePath = path.join(NOTES_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as PostFrontmatter;
  const slug = frontmatter.slug ?? fileName.replace(/\.md$/, "");

  return {
    slug,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    date: normalizeDate(frontmatter.date),
    content: content.trim(),
    cover: pickCover(index, frontmatter.coverLabel ?? slug),
    tags: normalizeTags(frontmatter.tags),
    ogImage: frontmatter.ogImage,
  };
}

function loadPosts(): Post[] {
  if (!fs.existsSync(NOTES_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(NOTES_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b));

  return files.map((file, index) => readPostFile(file, index));
}

export function getPosts(): Post[] {
  return loadPosts().sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  return loadPosts().find((post) => post.slug === slug);
}

export function getPostsByTag(tag: string): Post[] {
  const normalized = tag.trim().toLowerCase();
  return getPosts().filter((post) => post.tags.includes(normalized));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();

  for (const post of loadPosts()) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }

  return [...tags].sort();
}

export function getAdjacentPosts(slug: string): {
  prev: Post | null;
  next: Post | null;
} {
  const posts = getPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const current = getPostBySlug(slug);

  if (!current || current.tags.length === 0) {
    return [];
  }

  const tagSet = new Set(current.tags);

  return getPosts()
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => tagSet.has(tag)).length,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return b.post.date.localeCompare(a.post.date);
    })
    .slice(0, limit)
    .map((item) => item.post);
}

export function getPostOgImage(content: string): string | undefined {
  const match = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  return match?.[1];
}
