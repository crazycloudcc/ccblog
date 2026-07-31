"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/terminal/ThemeToggle";
import { SITE_AUTHOR, SITE_BRANCH } from "@/lib/site";

type TerminalStatusBarProps = {
  postCount: number;
};

export function TerminalStatusBar({ postCount }: TerminalStatusBarProps) {
  const year = new Date().getFullYear();

  return (
    <div className="terminal-chrome flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-lavender-mist bg-lavender-mist/40 px-4 py-2 font-mono text-[11px] text-fog">
      <div className="flex flex-wrap items-center gap-3">
        <span>
          <span className="text-code-teal">branch</span>: {SITE_BRANCH}
        </span>
        <span>
          <span className="text-code-teal">posts</span>: {postCount}
        </span>
        <span className="lg:hidden"><ThemeToggle /></span>
        <span>
          <span className="text-code-teal">encoding</span>: utf-8
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/blog" className="transition-colors hover:text-ink">
          tail -f notes
        </Link>
        <span>© {year} {SITE_AUTHOR}</span>
      </div>
    </div>
  );
}
