import { Hero } from "@/components/home/Hero";
import { TerminalFeed } from "@/components/blog/TerminalFeed";
import { TerminalCommand } from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import Link from "next/link";
import { getPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getPosts();

  return (
    <>
      <Hero />
      <TerminalPanel title="recent log stream">
        <TerminalCommand command="tail -n 4 writing.log" />
        <div className="mt-4">
          <TerminalFeed posts={posts} limit={4} />
        </div>
        <div className="mt-6 font-mono text-sm">
          <span className="text-mist">{"> "}</span>
          <Link href="/blog" className="font-semibold text-ink hover:text-code-cobalt">
            tail -f writing.log
          </Link>
        </div>
      </TerminalPanel>
    </>
  );
}
