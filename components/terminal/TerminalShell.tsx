import type { ReactNode } from "react";
import { TerminalNav } from "@/components/terminal/TerminalNav";
import { TerminalPageEntry } from "@/components/terminal/TerminalPageEntry";
import { TerminalStatusBar } from "@/components/terminal/TerminalStatusBar";
import { TerminalTitleBar } from "@/components/terminal/TerminalTitleBar";

type TerminalShellProps = {
  children: ReactNode;
  postCount: number;
};

export function TerminalShell({ children, postCount }: TerminalShellProps) {
  return (
    <div className="terminal-desk min-h-screen px-3 py-4 md:px-6 md:py-8">
      <div className="terminal-window terminal-crt mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1100px] flex-col overflow-hidden md:min-h-[calc(100vh-4rem)]">
        <TerminalTitleBar />
        <TerminalNav />
        <main className="terminal-main flex-1 overflow-auto">
          <TerminalPageEntry>{children}</TerminalPageEntry>
        </main>
        <TerminalStatusBar postCount={postCount} />
      </div>
    </div>
  );
}
