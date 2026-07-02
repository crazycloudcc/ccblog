import { TimelinePost } from "@/components/blog/TimelinePost";
import { groupPostsByYear } from "@/lib/blog-utils";
import type { Post } from "@/lib/posts";

type BlogTimelineProps = {
  posts: Post[];
  limit?: number;
};

export function BlogTimeline({ posts, limit }: BlogTimelineProps) {
  const visiblePosts = limit ? posts.slice(0, limit) : posts;
  const groups = groupPostsByYear(visiblePosts);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-[43px] top-0 hidden w-px bg-lavender-mist md:block"
      />

      <div className="space-y-16">
        {groups.map((group) => (
          <section key={group.year}>
            <div className="mb-8 flex items-center gap-4 md:pl-0">
              <div className="hidden w-[88px] shrink-0 md:block" />
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <h2 className="font-mono text-3xl font-semibold tracking-tight text-ink">
                  {group.year}
                </h2>
                <div className="h-px flex-1 bg-lavender-mist" />
                <span className="shrink-0 font-sans text-xs uppercase tracking-[0.08em] text-fog">
                  {group.posts.length} posts
                </span>
              </div>
            </div>

            <div className="space-y-8">
              {group.posts.map((post) => (
                <TimelinePost key={post.slug} post={post} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
