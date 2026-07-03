"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/home/usePrefersReducedMotion";
import { TerminalCommand } from "@/components/terminal/TerminalCommand";
import { getPageCdCommand } from "@/lib/terminal-paths";

type TerminalPageEntryProps = {
  children: ReactNode;
};

export function TerminalPageEntry({ children }: TerminalPageEntryProps) {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  const cdCommand = getPageCdCommand(pathname);

  if (!cdCommand) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="border-b border-lavender-mist/80 px-4 py-4 md:px-6">
        <TerminalCommand command={cdCommand} />
      </div>
      <div className={reducedMotion ? undefined : "hero-fade-in"}>{children}</div>
    </>
  );
}
