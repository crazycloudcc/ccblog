"use client";

import { useEffect, useState } from "react";
import type { SessionGeo } from "@/lib/session-geo";
import { SITE_LOCALE } from "@/lib/site";

type TerminalTitleBarProps = {
  title: string;
};

type ClockState = {
  time: string;
  zone: string;
};

function formatClock(date: Date): ClockState {
  const time = date.toLocaleTimeString(SITE_LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const zone =
    new Intl.DateTimeFormat(SITE_LOCALE, {
      timeZoneName: "shortOffset",
    })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ??
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  return { time, zone };
}

export function TerminalTitleBar({ title }: TerminalTitleBarProps) {
  const [geo, setGeo] = useState<SessionGeo | null>(null);
  const [clock, setClock] = useState<ClockState>(() => formatClock(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(formatClock(new Date()));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

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

  const geoLabel = geo ? `${geo.ip} (${geo.location})` : null;

  return (
    <div className="terminal-chrome flex shrink-0 items-center gap-2 border-b border-lavender-mist bg-lavender-mist/60 px-4 py-2.5 font-mono text-xs text-fog">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-code-rust/80" />
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-code-plum/60" />
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-code-teal/70" />
        <span className="ml-2 truncate text-ink/80">{title}</span>
      </div>

      <div
        className="ml-3 flex max-w-[55%] shrink-0 flex-wrap items-center justify-end gap-x-2 gap-y-1 text-[11px] sm:max-w-none sm:gap-x-3"
        title={[clock.time, clock.zone, geoLabel].filter(Boolean).join(" · ")}
      >
        <span className="whitespace-nowrap tabular-nums text-ink/80">{clock.time}</span>
        <span className="whitespace-nowrap text-code-teal">{clock.zone}</span>
        {geoLabel ? (
          <>
            <span className="text-mist">·</span>
            <span className="max-w-[180px] truncate whitespace-nowrap sm:max-w-none">
              {geoLabel}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}
