"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/components/home/usePrefersReducedMotion";
import { TerminalCommand } from "@/components/terminal/TerminalCommand";
import { recordMetric } from "@/lib/observability/client-metrics";
import { getPageCdCommand } from "@/lib/terminal-paths";

type TerminalPageEntryProps = {
  children: ReactNode;
};

export function TerminalPageEntry({ children }: TerminalPageEntryProps) {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  const cdCommand = getPageCdCommand(pathname);
  const routeStartRef = useRef(0);
  const previousPathRef = useRef("");

  useEffect(() => {
    const now = performance.now();

    if (previousPathRef.current && previousPathRef.current !== pathname) {
      recordMetric("routeTransitionMs", Math.round(now - routeStartRef.current));
      recordMetric("lastRoute", pathname);
    }

    routeStartRef.current = now;
    previousPathRef.current = pathname;
  }, [pathname]);

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
