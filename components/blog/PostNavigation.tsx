import Link from "next/link";
import type { Post } from "@/lib/posts";
import { TerminalComment } from "@/components/terminal/TerminalCommand";

type PostNavigationProps = {
  prev: Post | null;
  next: Post | null;
  related: Post[];
};

export function PostNavigation({ prev, next, related }: PostNavigationProps) {
  return (
    <div className="mt-10 space-y-8 border-t border-lavender-mist/80 pt-8">
      {(prev || next) && (
        <nav
          className="grid gap-3 font-mono text-sm sm:grid-cols-2"
          aria-label="Post navigation"
        >
          {prev ? (
            <Link
              href={`/blog/${prev.slug}`}
              className="rounded-[4px] border border-lavender-mist px-4 py-3 transition-colors hover:border-fog/40 hover:bg-lavender-mist/20"
            >
              <div className="text-xs text-code-teal">prev</div>
              <div className="mt-1 text-ink">{prev.title}</div>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="rounded-[4px] border border-lavender-mist px-4 py-3 text-right transition-colors hover:border-fog/40 hover:bg-lavender-mist/20 sm:col-start-2"
            >
              <div className="text-xs text-code-teal">next</div>
              <div className="mt-1 text-ink">{next.title}</div>
            </Link>
          ) : null}
        </nav>
      )}

      {related.length > 0 ? (
        <section>
          <TerminalComment>// related notes</TerminalComment>
          <ul className="mt-3 space-y-2 font-mono text-sm">
            {related.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="text-ink hover:text-code-cobalt hover:underline">
                  {post.title}
                </Link>
                {post.tags.length > 0 ? (
                  <span className="ml-2 text-xs text-fog">
                    ({post.tags.map((tag) => `#${tag}`).join(" ")})
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
