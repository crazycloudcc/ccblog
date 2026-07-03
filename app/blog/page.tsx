import { TerminalFeed } from "@/components/blog/TerminalFeed";
import { TerminalCommand } from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog — crazycloudcc's blog",
  description: "Writing log from crazycloudcc's blog",
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <TerminalPanel title="notes">
      <TerminalCommand command="tail -f notes" />
      <p className="mt-3 font-mono text-xs text-code-teal">
        // streaming {posts.length} entries · ctrl+c to stop (just kidding)
      </p>
      <div className="mt-6">
        <TerminalFeed posts={posts} />
      </div>
    </TerminalPanel>
  );
}
