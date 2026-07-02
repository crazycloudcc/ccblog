import Link from "next/link";
import { PostCover } from "@/components/blog/PostCover";
import { formatDateParts } from "@/lib/blog-utils";
import type { Post } from "@/lib/posts";

export function SchemeAlternating({ posts }: { posts: Post[] }) {
  return (
    <div className="relative mx-auto max-w-[900px]">
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-ink to-transparent md:block"
      />

      <div className="space-y-20">
        {posts.map((post, index) => {
          const isLeft = index % 2 === 0;
          const { month, day, year } = formatDateParts(post.date);

          return (
            <article
              key={post.slug}
              className={`group relative grid items-center gap-8 md:grid-cols-2 ${isLeft ? "" : "md:[&>*:first-child]:order-2"}`}
            >
              <div className="absolute left-1/2 top-1/2 z-10 hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-paper bg-ink md:block" />

              <Link
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-[8px] border border-lavender-mist shadow-[0_12px_40px_rgba(48,48,85,0.08)] transition-transform hover:-translate-y-1"
              >
                <PostCover cover={post.cover} className="min-h-[220px]" />
              </Link>

              <div className={`${isLeft ? "md:pr-10" : "md:pl-10"}`}>
                <time className="font-mono text-sm text-fog">
                  {year}.{month}.{day}
                </time>
                <h3 className="mt-3 font-sans text-2xl font-semibold text-ink group-hover:text-code-cobalt">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="mt-3 font-sans text-sm leading-[1.8] text-slate">{post.excerpt}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
