"use client";

import { useEffect, useState } from "react";
import type { SessionGeo } from "@/lib/session-geo";

type TerminalTitleBarProps = {
  title: string;
};

export function TerminalTitleBar({ title }: TerminalTitleBarProps) {
  const [geo, setGeo] = useState<SessionGeo | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGeo() {
      try {
        const response = await fetch("/api/session/geo");
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as SessionGeo;
        if (!cancelled) {
          setGeo(data);
        }
      } catch {
        // ignore geo lookup failures
      }
    }

    void loadGeo();

    return () => {
      cancelled = true;
    };
  }, []);

  const geoLabel = geo ? ` · ${geo.ip} (${geo.location})` : "";

  return (
    <div className="terminal-chrome flex shrink-0 items-center gap-2 border-b border-lavender-mist bg-lavender-mist/60 px-4 py-2.5 font-mono text-xs text-fog">
      <span className="h-2.5 w-2.5 rounded-full bg-code-rust/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-code-plum/60" />
      <span className="h-2.5 w-2.5 rounded-full bg-code-teal/70" />
      <span className="ml-2 min-w-0 truncate text-ink/80" title={geo ? `${geo.ip} · ${geo.location}` : title}>
        {title}
        {geoLabel ? <span className="text-fog">{geoLabel}</span> : null}
      </span>
    </div>
  );
}
