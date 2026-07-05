"use client";

import type { CompileMetadata, CompileTiming } from "@/lib/playground/types";

type CompileTimelineProps = {
  timing: CompileTiming | null;
  metadata: CompileMetadata | null;
  activePhase?: string;
};

const STAGES = [
  { key: "toolchainMs", label: "toolchain" },
  { key: "compileMs", label: "compile" },
  { key: "linkMs", label: "link" },
  { key: "runMs", label: "run" },
] as const;

export function CompileTimeline({ timing, metadata, activePhase }: CompileTimelineProps) {
  if (!timing && !metadata) {
    return null;
  }

  const maxMs = Math.max(
    timing?.toolchainMs ?? 0,
    timing?.compileMs ?? 0,
    timing?.linkMs ?? 0,
    timing?.runMs ?? 0,
    1,
  );

  return (
    <div className="rounded-[8px] border border-lavender-mist/60 bg-terminal-bg/80 px-3 py-2 font-mono text-[11px]">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-code-teal">compile pipeline</span>
        {timing?.totalMs !== undefined ? (
          <span className="text-fog">total {timing.totalMs}ms</span>
        ) : activePhase ? (
          <span className="text-fog">{activePhase}…</span>
        ) : null}
      </div>

      {metadata ? (
        <details className="mb-2 text-fog">
          <summary className="cursor-pointer text-code-cobalt hover:text-ink">
            {metadata.compilerProgram} {metadata.fileName} {metadata.flags.join(" ")}
          </summary>
          {metadata.driverSummary ? (
            <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all text-[10px] leading-5 text-slate">
              {metadata.driverSummary}
            </pre>
          ) : null}
        </details>
      ) : null}

      {timing ? (
        <div className="space-y-1.5">
          {STAGES.map(({ key, label }) => {
            const value = timing[key];
            if (value === undefined) {
              return null;
            }

            const width = Math.max(8, Math.round((value / maxMs) * 100));

            return (
              <div key={key} className="flex items-center gap-2">
                <span className="w-14 shrink-0 text-fog">{label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-lavender-mist/50">
                  <div className="h-full bg-code-teal/80" style={{ width: `${width}%` }} />
                </div>
                <span className="w-12 shrink-0 text-right tabular-nums text-ink">{value}ms</span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
