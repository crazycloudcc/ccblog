import Link from "next/link";
import { formatDateParts } from "@/lib/blog-utils";
import type { Post } from "@/lib/posts";

export function SchemeTerminal({ posts }: { posts: Post[] }) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-lavender-mist bg-[#fafaff] font-mono text-sm shadow-[var(--elevation-code-block)]">
      <div className="flex items-center gap-2 border-b border-lavender-mist bg-lavender-mist/50 px-4 py-2 text-xs text-fog">
        <span className="h-2.5 w-2.5 rounded-full bg-code-rust/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-code-plum/50" />
        <span className="h-2.5 w-2.5 rounded-full bg-code-teal/60" />
        <span className="ml-2">crazycloudcc@blog — tail -f writing.log</span>
      </div>

      <div className="space-y-0 p-4 md:p-6">
        {posts.map((post) => {
          const { year, month, day, weekday } = formatDateParts(post.date);

          return (
            <article
              key={post.slug}
              className="grid gap-4 border-b border-lavender-mist/80 py-5 last:border-b-0 md:grid-cols-[220px_minmax(0,1fr)]"
            >
              <div className="text-xs leading-6 text-fog">
                <div>
                  <span className="text-code-plum">[</span>
                  <span className="text-ink">{year}-{month}-{day}</span>
                  <span className="text-code-plum">]</span>
                  <span className="text-code-cobalt"> {weekday.toLowerCase()}</span>
                </div>
                <div
                  className="mt-2 h-16 w-full rounded-[4px] border border-lavender-mist"
                  style={{
                    background: `linear-gradient(135deg, ${post.cover.from}, ${post.cover.to})`,
                  }}
                />
              </div>

              <div>
                <div>
                  <span className="text-mist">{"> "}</span>
                  <Link href={`/blog/${post.slug}`} className="font-semibold text-ink hover:text-code-cobalt">
                    {post.slug}
                  </Link>
                </div>
                <h3 className="mt-2 font-sans text-lg font-semibold text-ink">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="mt-2 font-sans text-sm leading-[1.8] text-slate">{post.excerpt}</p>
                <div className="mt-3 text-xs text-code-teal">
                  // status: published · bytes: {post.excerpt.length * 12}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
