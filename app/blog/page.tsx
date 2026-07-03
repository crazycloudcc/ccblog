import { TerminalFeed } from "@/components/blog/TerminalFeed";
import { TagFilter } from "@/components/blog/TagFilter";
import { TerminalCommand } from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { createPageMetadata } from "@/lib/metadata";
import { getAllTags, getPosts, getPostsByTag } from "@/lib/posts";

export const metadata = createPageMetadata({
  title: "Blog",
  description: "Writing log from crazycloudcc's blog",
  path: "/blog",
});

type BlogPageProps = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { tag } = await searchParams;
  const activeTag = tag?.trim().toLowerCase();
  const posts = activeTag ? getPostsByTag(activeTag) : getPosts();
  const tags = getAllTags();
  const command = activeTag ? `grep -R "#${activeTag}" notes/` : "tail -f notes";

  return (
    <TerminalPanel title="notes">
      <TerminalCommand command={command} />
      <p className="mt-3 font-mono text-xs text-code-teal">
        // streaming {posts.length} entries · ctrl+c to stop (just kidding)
      </p>
      <TagFilter tags={tags} activeTag={activeTag} />
      <div className="mt-6">
        <TerminalFeed posts={posts} activeTag={activeTag} />
      </div>
    </TerminalPanel>
  );
}
