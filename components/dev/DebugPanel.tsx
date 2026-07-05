"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "@/components/terminal/ThemeProvider";
import { useSiteStatus } from "@/components/terminal/SiteStatusProvider";
import { getMetricsSnapshot } from "@/lib/observability/client-metrics";
import { getSiteStatus } from "@/lib/site-status";
import { getFilesystemPath, getTerminalCwd } from "@/lib/terminal-paths";
import { resolveToolchainBase } from "@/lib/playground/toolchain";

export function DebugPanel() {
  const pathname = usePathname();
  const { preference, resolved } = useTheme();
  const siteStatus = useSiteStatus();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isBacktick = event.key === "`" && !event.metaKey && !event.ctrlKey && !event.altKey;
      const isShortcut = event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d";

      if (isBacktick || isShortcut) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const buildSnapshot = useCallback(() => {
    return {
      pathname,
      cwd: getTerminalCwd(pathname),
      filesystemPath: getFilesystemPath(pathname),
      theme: { preference, resolved },
      siteStatus: getSiteStatus(),
      toolchainBase: resolveToolchainBase(),
      metrics: getMetricsSnapshot(),
      userAgent: typeof navigator === "undefined" ? null : navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
  }, [pathname, preference, resolved]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(JSON.stringify(buildSnapshot(), null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }, [buildSnapshot]);

  if (!open) {
    return null;
  }

  const snapshot = buildSnapshot();

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-[6px] border border-lavender-mist bg-terminal-bg shadow-lg">
      <div className="flex items-center justify-between border-b border-lavender-mist/60 bg-lavender-mist/30 px-3 py-2 font-mono text-[11px]">
        <span className="text-code-teal">debug panel</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="text-fog hover:text-ink"
          >
            {copied ? "copied" : "copy snapshot"}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="text-fog hover:text-ink">
            close
          </button>
        </div>
      </div>

      <div className="max-h-[min(420px,60vh)] overflow-auto px-3 py-3 font-mono text-[11px] leading-5 text-slate">
        <div>
          <span className="text-code-teal">pathname</span>: {pathname}
        </div>
        <div>
          <span className="text-code-teal">cwd</span>: {snapshot.cwd}
        </div>
        <div>
          <span className="text-code-teal">theme</span>: {preference} → {resolved}
        </div>
        <div>
          <span className="text-code-teal">version</span>: v{siteStatus.buildVersion}
        </div>
        <div>
          <span className="text-code-teal">toolchain</span>: {siteStatus.toolchainSource} ·{" "}
          {siteStatus.toolchainReady ? "ready" : "loading"}
        </div>
        <div>
          <span className="text-code-teal">toolchainBase</span>: {snapshot.toolchainBase}
        </div>
        <div>
          <span className="text-code-teal">pagefind</span>:{" "}
          {siteStatus.pagefindReady ? "loaded" : "missing"}
        </div>
        <pre className="mt-3 overflow-x-auto rounded-[4px] border border-lavender-mist/60 bg-obsidian/5 p-2 text-[10px] text-fog">
          {JSON.stringify(snapshot.metrics, null, 2)}
        </pre>
      </div>
    </div>
  );
}
