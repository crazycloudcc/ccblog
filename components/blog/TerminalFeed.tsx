import Link from "next/link";
import { groupPostsByYear } from "@/lib/blog-utils";
import type { Post } from "@/lib/posts";

type TerminalFeedProps = {
  posts: Post[];
  limit?: number;
  activeTag?: string;
};

export function TerminalFeed({ posts, limit, activeTag }: TerminalFeedProps) {
  const visiblePosts = limit ? posts.slice(0, limit) : posts;
  const groups = groupPostsByYear(visiblePosts);

  if (visiblePosts.length === 0) {
    return (
      <p className="font-mono text-sm text-fog">
        {activeTag ? `No notes tagged #${activeTag}.` : "No notes yet."}
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
                <Link
                  href={`/blog/${post.slug}`}
                  className="block py-3 leading-relaxed transition-colors hover:bg-lavender-mist/20"
                >
                  <div>
                    <span className="text-code-plum">[</span>
                    <time dateTime={post.date} className="text-ink">
                      {post.date}
                    </time>
                    <span className="text-code-plum">]</span>
                    <span className="text-mist"> - </span>
                    <span className="font-semibold text-ink">{post.title}</span>
                  </div>
                  <p className="prose-terminal mt-1.5 pl-0 text-sm leading-[1.7] text-slate">
                    {post.excerpt}
                  </p>
                  {post.tags.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-[4px] border border-lavender-mist px-2 py-0.5 text-[11px] text-fog"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
