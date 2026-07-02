import Link from "next/link";
import { PostCover } from "@/components/blog/PostCover";
import { formatDateParts } from "@/lib/blog-utils";
import type { Post } from "@/lib/posts";

export function SchemeBento({ posts }: { posts: Post[] }) {
  const [featured, ...rest] = posts;

  return (
    <div className="space-y-4">
      {featured ? (
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid overflow-hidden rounded-[8px] border border-lavender-mist bg-paper md:grid-cols-[1.2fr_1fr]"
        >
          <PostCover cover={featured.cover} className="min-h-[280px]" />
          <div className="flex flex-col justify-center p-8">
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-code-teal">
              Featured
            </span>
            <h3 className="mt-3 font-sans text-3xl font-semibold text-ink group-hover:text-code-cobalt">
              {featured.title}
            </h3>
            <p className="mt-4 font-sans text-sm leading-[1.8] text-slate">{featured.excerpt}</p>
          </div>
        </Link>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {rest.map((post, index) => {
          const wide = index === 0 || index === 3;
          const { month, day } = formatDateParts(post.date);

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`group overflow-hidden rounded-[8px] border border-lavender-mist bg-paper ${wide ? "md:col-span-2 md:grid md:grid-cols-2" : ""}`}
            >
              <PostCover
                cover={post.cover}
                className={wide ? "min-h-[160px]" : "min-h-[140px]"}
              />
              <div className="p-4">
                <time className="font-mono text-[11px] text-fog">
                  {month} {day}
                </time>
                <h3 className="mt-2 font-sans text-lg font-semibold text-ink group-hover:text-code-cobalt">
                  {post.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
