import Link from "next/link";
import { groupPostsByYear } from "@/lib/blog-utils";
import type { Post } from "@/lib/posts";

export function SchemeEditorial({ posts }: { posts: Post[] }) {
  const groups = groupPostsByYear(posts);

  return (
    <div className="grid gap-10 lg:grid-cols-[180px_minmax(0,1fr)]">
      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        {groups.map((group) => (
          <div key={group.year} className="border-l-2 border-ink pl-4">
            <div className="font-mono text-4xl font-semibold leading-none text-ink">
              {group.year}
            </div>
            <div className="mt-1 font-sans text-xs text-fog">{group.posts.length} entries</div>
          </div>
        ))}
      </aside>

      <div className="space-y-0 divide-y divide-lavender-mist border-y border-lavender-mist">
        {posts.map((post) => {
          const month = post.date.slice(5, 7);
          const day = post.date.slice(8, 10);

          return (
            <article
              key={post.slug}
              className="grid gap-4 py-8 md:grid-cols-[120px_minmax(0,1fr)] md:gap-8"
            >
              <div className="font-mono leading-none text-ink">
                <div className="text-5xl font-semibold">{day}</div>
                <div className="mt-2 text-sm uppercase tracking-[0.12em] text-fog">
                  {month} / {post.date.slice(0, 4)}
                </div>
              </div>
              <div>
                <h3 className="font-sans text-2xl font-semibold text-ink">
                  <Link href={`/blog/${post.slug}`} className="hover:text-code-cobalt">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 max-w-2xl font-sans text-sm leading-[1.9] text-slate">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block font-mono text-xs text-fog hover:text-ink"
                >
                  continue reading _
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
