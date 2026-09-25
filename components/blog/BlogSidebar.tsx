import Link from "next/link";
import type { Post, PublicSeries } from "@/lib/posts";

type BlogSidebarProps = {
  tags: string[];
  series: PublicSeries[];
  recentPosts: Post[];
  activeTag?: string;
  activeSeries?: string;
  activeSeriesSlug?: string;
};

export function BlogSidebar({
  tags,
  series,
  recentPosts,
  activeTag,
  activeSeries,
  activeSeriesSlug,
}: BlogSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-4 space-y-6 font-mono text-xs">
      {tags.length > 0 ? (
        <nav aria-label="Filter by tag">
          <div className="mb-2 text-code-teal">// tags</div>
          <div className="flex flex-wrap gap-1.5">
            <Link
              href="/blog"
              className={`rounded-[4px] border px-2 py-1 transition-colors ${
                !activeTag && !activeSeries && !activeSeriesSlug
                  ? "border-ink/20 bg-ink text-paper"
                  : "border-lavender-mist text-fog hover:border-fog/40 hover:text-ink"
              }`}
            >
              all
            </Link>
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className={`rounded-[4px] border px-2 py-1 transition-colors ${
                  activeTag === tag
                    ? "border-ink/20 bg-ink text-paper"
                    : "border-lavender-mist text-fog hover:border-fog/40 hover:text-ink"
                }`}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}

      {series.length > 0 ? (
        <nav aria-label="Filter by series">
          <div className="mb-2 text-code-teal">// series</div>
          <div className="flex flex-wrap gap-1.5">
            {series.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/series/${item.slug}`}
                className={`rounded-[4px] border px-2 py-1 transition-colors ${
                  activeSeriesSlug === item.slug ||
                  (activeSeries !== undefined && activeSeries.toLowerCase() === item.title.toLowerCase())
                    ? "border-ink/20 bg-ink text-paper"
                    : "border-lavender-mist text-fog hover:border-fog/40 hover:text-ink"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}

      {recentPosts.length > 0 ? (
        <div>
          <div className="mb-2 text-code-teal">// recent</div>
          <ul className="space-y-2">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block text-fog transition-colors hover:text-ink"
                >
                  <span className="text-mist">{post.date.slice(5)}</span>
                  {" "}
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
