import Link from "next/link";
import { estimateReadingTime, formatReadingTime, groupPostsByYear } from "@/lib/blog-utils";
import type { Post } from "@/lib/posts";

type TerminalFeedProps = {
  posts: Post[];
  limit?: number;
  activeTag?: string;
  activeSeries?: string;
};

export function TerminalFeed({ posts, limit, activeTag, activeSeries }: TerminalFeedProps) {
  const visiblePosts = limit ? posts.slice(0, limit) : posts;
  const groups = groupPostsByYear(visiblePosts);

  if (visiblePosts.length === 0) {
    return (
      <p className="font-mono text-sm text-fog">
        {activeSeries
          ? `No notes in series "${activeSeries}".`
          : activeTag
            ? `No notes tagged #${activeTag}.`
            : "No notes yet."}
      </p>
    );
  }

  return (
    <div className="font-mono text-sm">
      {groups.map((group) => (
        <div key={group.year}>
          <div className="border-b border-lavender-mist/80 py-3 text-xs text-code-teal">
            {"// "}
            {"─".repeat(6)} {group.year} {"─".repeat(6)} {group.posts.length} entries
          </div>

          <ul className="divide-y divide-lavender-mist/80">
            {group.posts.map((post) => (
              <li key={post.slug}>
                <div className="py-3 leading-relaxed transition-colors hover:bg-lavender-mist/20">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div>
                      <span className="text-code-plum">[</span>
                      <time dateTime={post.date} className="text-ink">
                        {post.date}
                      </time>
                      <span className="text-code-plum">]</span>
                      <span className="text-mist"> - </span>
                      <span className="font-semibold text-ink">{post.title}</span>
                      <span className="text-mist"> · </span>
                      <span className="text-xs text-fog">
                        {formatReadingTime(estimateReadingTime(post.content))}
                      </span>
                    </div>
                    <p className="prose-terminal mt-1.5 pl-0 text-base leading-[1.7] text-slate">
                      {post.excerpt}
                    </p>
                  </Link>
                  {post.series ? (
                    <div className="mt-2">
                      <Link
                        href={`/blog?series=${encodeURIComponent(post.series)}`}
                        className="rounded-[4px] border border-code-cobalt/30 px-2 py-0.5 text-[11px] text-code-cobalt hover:text-ink"
                      >
                        series:{post.series}
                      </Link>
                    </div>
                  ) : null}
                  {post.tags.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="rounded-[4px] border border-lavender-mist px-2 py-0.5 text-[11px] text-fog hover:text-ink"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
