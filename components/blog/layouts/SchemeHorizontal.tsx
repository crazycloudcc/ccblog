import Link from "next/link";
import { PostCover } from "@/components/blog/PostCover";
import { formatDateParts } from "@/lib/blog-utils";
import type { Post } from "@/lib/posts";

export function SchemeHorizontal({ posts }: { posts: Post[] }) {
  return (
    <div className="-mx-6 overflow-x-auto px-6 pb-4 lg:mx-0 lg:px-0">
      <div className="flex w-max gap-5 md:gap-6">
        {posts.map((post, index) => {
          const { month, day } = formatDateParts(post.date);

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group relative w-[300px] shrink-0 overflow-hidden rounded-[8px] border border-lavender-mist bg-paper transition-transform hover:-translate-y-1 sm:w-[340px]"
              style={{
                transform: `rotate(${index % 2 === 0 ? -1.2 : 1.2}deg)`,
              }}
            >
              <div className="absolute right-4 top-4 z-10 rounded-full border border-white/30 bg-ink/80 px-3 py-1 font-mono text-[11px] text-white backdrop-blur-sm">
                {month} {day}
              </div>
              <PostCover cover={post.cover} className="min-h-[180px]" />
              <div className="p-5">
                <h3 className="line-clamp-2 font-sans text-lg font-semibold text-ink group-hover:text-code-cobalt">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 font-sans text-sm leading-[1.7] text-slate">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <p className="mt-4 font-mono text-xs text-fog">← 横向滑动预览 →</p>
    </div>
  );
}
