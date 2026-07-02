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
};

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

const basePosts: Post[] = [
  {
    slug: "hello-world",
    title: "Hello, World",
    excerpt: "Launching crazycloudcc's blog — a place for notes on code and cloud.",
    date: "2026-07-02",
    cover: pickCover(0, "launch"),
    content: `Welcome to crazycloudcc's blog.

This is where I write about software, infrastructure, and the things I'm learning along the way.

![Terminal-style blog layout](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop)

## What to expect

- Cloud and DevOps notes
- Project write-ups and retrospectives
- Occasional tooling tips

::video[Cloud deploy walkthrough](https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4)

Thanks for reading.`,
  },
  {
    slug: "monospace-on-the-web",
    title: "Monospace on the Web",
    excerpt:
      "Why code blocks and terminal-inspired layouts still work well for developer blogs.",
    date: "2026-06-15",
    cover: pickCover(1, "design"),
    content: `Developer blogs benefit from a visual language readers already trust: monospace type for code, clean prose for everything else, and a restrained palette that stays out of the way.

A code snippet on the homepage isn't decoration — it's a signal about who the site is for and what kind of writing lives here.`,
  },
  {
    slug: "nextjs-blog-setup",
    title: "Setting Up a Next.js Blog",
    excerpt: "A minimal App Router setup with static pages and markdown-style posts.",
    date: "2026-05-28",
    cover: pickCover(2, "nextjs"),
    content: `This site runs on Next.js with the App Router, TypeScript, and Tailwind CSS.

The structure is intentionally simple:

1. Static pages for home, about, and contact
2. A blog index and per-post routes
3. Post content stored in TypeScript for now — easy to migrate to MDX later`,
  },
];

const mockTopics = [
  "Kubernetes",
  "Docker",
  "Terraform",
  "AWS Lambda",
  "CI/CD",
  "Observability",
  "PostgreSQL",
  "Redis",
  "GraphQL",
  "TypeScript",
  "React Server Components",
  "Edge Functions",
  "DNS",
  "TLS",
  "Monitoring",
  "Logging",
  "GitOps",
  "Helm",
  "Serverless",
  "API Design",
];

const mockVerbs = [
  "Notes on",
  "Debugging",
  "Lessons from",
  "A practical guide to",
  "Thoughts on",
  "Migrating to",
  "Optimizing",
  "Understanding",
  "Building with",
  "Reviewing",
];

function createMockPosts(count: number): Post[] {
  return Array.from({ length: count }, (_, index) => {
    const topic = mockTopics[index % mockTopics.length];
    const verb = mockVerbs[index % mockVerbs.length];
    const day = String((index % 28) + 1).padStart(2, "0");
    const month = String((index % 12) + 1).padStart(2, "0");
    const year = index < 24 ? 2025 : 2024;
    const slug = `mock-${index + 1}-${topic.toLowerCase().replace(/\s+/g, "-")}`;

    return {
      slug,
      title: `${verb} ${topic}`,
      excerpt: `Temporary preview post #${index + 1} about ${topic.toLowerCase()} — placeholder content for layout testing.`,
      date: `${year}-${month}-${day}`,
      cover: pickCover(index + 3, topic.toLowerCase().replace(/\s+/g, "-").slice(0, 12)),
      content: `This is temporary mock post #${index + 1}.

It exists only to preview how the blog list and detail pages handle a larger volume of content.

## Topic

${topic}

## Summary

Placeholder body copy for layout testing. Remove mock posts in \`lib/posts.ts\` when done reviewing.`,
    };
  });
}

// TODO: remove mock posts after layout review
const mockPosts = createMockPosts(47);

export const posts: Post[] = [...basePosts, ...mockPosts];

export function getPosts(): Post[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
