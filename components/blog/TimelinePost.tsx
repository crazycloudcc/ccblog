import Link from "next/link";
import { PostCover } from "@/components/blog/PostCover";
import { formatDateParts } from "@/lib/blog-utils";
import type { Post } from "@/lib/posts";

type TimelinePostProps = {
  post: Post;
};

export function TimelinePost({ post }: TimelinePostProps) {
  const { month, day, weekday } = formatDateParts(post.date);

  return (
    <article className="relative grid grid-cols-1 gap-0 md:grid-cols-[88px_minmax(0,1fr)] md:gap-8">
      <div className="relative hidden md:flex md:flex-col md:items-center md:pt-8">
        <div className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-ink bg-paper">
          <div className="h-1.5 w-1.5 rounded-full bg-ink" />
        </div>
        <time className="mt-4 text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-fog">
            {weekday}
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold leading-none text-ink">
            {day}
          </div>
          <div className="mt-1 font-mono text-xs uppercase tracking-[0.08em] text-fog">
            {month}
          </div>
        </time>
      </div>

      <Link
        href={`/blog/${post.slug}`}
        className="group grid overflow-hidden rounded-[8px] border border-lavender-mist bg-paper transition-all hover:border-fog/40 hover:shadow-[0_8px_24px_rgba(48,48,85,0.08)] md:grid-cols-[minmax(220px,36%)_minmax(0,1fr)]"
        style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.02)" }}
      >
        <PostCover cover={post.cover} className="min-h-[200px] md:min-h-[220px]" />

        <div className="flex flex-col justify-center p-5 md:p-7">
          <time className="mb-3 font-mono text-xs text-fog md:hidden">
            {post.date}
          </time>
          <h3 className="font-sans text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-code-cobalt md:text-2xl">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-3 font-sans text-sm leading-[1.8] text-slate">
            {post.excerpt}
          </p>
          <span className="mt-5 inline-flex items-center gap-1 font-sans text-sm font-medium text-ink">
            Read article
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            >
              {">"}
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
