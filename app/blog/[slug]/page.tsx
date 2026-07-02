import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCover } from "@/components/blog/PostCover";
import { formatDateParts } from "@/lib/blog-utils";
import { getPostBySlug, getPosts } from "@/lib/posts";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found — crazycloudcc's blog" };
  }

  return {
    title: `${post.title} — crazycloudcc's blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { month, day, weekday, year } = formatDateParts(post.date);
  const paragraphs = post.content.split("\n\n");

  return (
    <article>
      <div className="mx-auto max-w-[960px] px-6 pt-10 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 font-sans text-sm font-medium text-fog hover:text-ink hover:underline"
        >
          <span aria-hidden="true">{"<"}</span>
          Back to timeline
        </Link>

        <PostCover
          cover={post.cover}
          className="mt-8 min-h-[280px] rounded-[8px] md:min-h-[360px]"
        />
      </div>

      <div className="mx-auto max-w-[720px] px-6 py-12 md:py-16">
        <div className="flex items-center gap-4 border-b border-lavender-mist pb-6">
          <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-ink bg-paper">
            <div className="h-1.5 w-1.5 rounded-full bg-ink" />
          </div>
          <time className="font-mono text-sm text-fog">
            {weekday}, {month} {day}, {year}
          </time>
        </div>

        <h1 className="mt-8 font-sans text-[40px] font-medium leading-[1.1] tracking-[-0.021em] text-ink sm:text-[48px]">
          {post.title}
        </h1>
        <p className="mt-4 font-sans text-lg leading-[1.65] text-slate">
          {post.excerpt}
        </p>

        <div className="mt-12 space-y-6">
          {paragraphs.map((block, index) => {
            if (block.startsWith("## ")) {
              return (
                <h2
                  key={index}
                  className="font-sans text-xl font-semibold text-ink"
                >
                  {block.replace("## ", "")}
                </h2>
              );
            }

            if (block.startsWith("- ")) {
              const items = block.split("\n").filter(Boolean);
              return (
                <ul
                  key={index}
                  className="list-disc space-y-2 pl-5 font-sans text-sm leading-[1.8] text-slate"
                >
                  {items.map((item) => (
                    <li key={item}>{item.replace("- ", "")}</li>
                  ))}
                </ul>
              );
            }

            if (/^\d+\.\s/.test(block)) {
              const items = block.split("\n").filter(Boolean);
              return (
                <ol
                  key={index}
                  className="list-decimal space-y-2 pl-5 font-sans text-sm leading-[1.8] text-slate"
                >
                  {items.map((item) => (
                    <li key={item}>{item.replace(/^\d+\.\s/, "")}</li>
                  ))}
                </ol>
              );
            }

            return (
              <p
                key={index}
                className="font-sans text-sm leading-[1.8] text-slate"
              >
                {block}
              </p>
            );
          })}
        </div>
      </div>
    </article>
  );
}
