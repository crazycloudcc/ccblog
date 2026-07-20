"use client";

import type { ReactNode } from "react";
import { DevToolsRoot } from "@/components/dev/DevToolsRoot";
import { TerminalMobileNav } from "@/components/terminal/TerminalMobileNav";
import { TerminalPageEntry } from "@/components/terminal/TerminalPageEntry";
import { TerminalSidebar } from "@/components/terminal/TerminalSidebar";
import { TerminalStatusBar } from "@/components/terminal/TerminalStatusBar";
import { TerminalTitleBar } from "@/components/terminal/TerminalTitleBar";
import { useWindowDrag } from "@/components/terminal/useWindowDrag";

type TerminalShellProps = {
  children: ReactNode;
  postCount: number;
};

export function TerminalShell({ children, postCount }: TerminalShellProps) {
  const {
    windowRef,
    titleBarRef,
    style,
    resizeCursor,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    resetPosition,
  } = useWindowDrag();

  return (
    <div
      className="terminal-desk relative h-screen overflow-hidden px-3 py-4 md:px-6 md:py-8"
      onPointerMove={onPointerMove as unknown as React.PointerEventHandler}
      onPointerUp={onPointerUp as unknown as React.PointerEventHandler}
    >
      <div
        ref={windowRef}
        className={`terminal-window terminal-crt mx-auto flex h-full max-w-[1340px] flex-col overflow-hidden ${resizeCursor}`}
        style={style}
        onPointerDown={onPointerDown as unknown as React.PointerEventHandler}
      >
        <TerminalTitleBar ref={titleBarRef} onDoubleClick={resetPosition} />
        <TerminalMobileNav />
        <div className="flex min-h-0 flex-1">
          <TerminalSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <main className="terminal-main flex-1 overflow-auto">
              <TerminalPageEntry>{children}</TerminalPageEntry>
            </main>
            <TerminalStatusBar postCount={postCount} />
          </div>
        </div>
        <DevToolsRoot />
      </div>
    </div>
  );
}
