type TraceBlockProps = {
  title?: string;
  phases: { name: string; durationMs: number }[];
  stdout?: string;
};

export function TraceBlock({ title, phases, stdout }: TraceBlockProps) {
  if (phases.length === 0) {
    return null;
  }

  const maxMs = Math.max(...phases.map((phase) => phase.durationMs), 1);
  const totalMs = phases.reduce((sum, phase) => sum + phase.durationMs, 0);

  return (
    <div className="overflow-hidden rounded-[4px] border border-lavender-mist bg-terminal-bg/50">
      <div className="border-b border-lavender-mist/40 px-3 py-2 font-mono text-[11px] text-code-teal">
        {title ?? "trace"} <span className="text-fog">· total {totalMs}ms</span>
      </div>

      <div className="space-y-2 px-3 py-3">
        {phases.map((phase) => {
          const width = Math.max(8, Math.round((phase.durationMs / maxMs) * 100));

          return (
            <div key={phase.name} className="flex items-center gap-3 font-mono text-[11px]">
              <span className="w-20 shrink-0 text-fog">{phase.name}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-lavender-mist/50">
                <div className="h-full bg-code-cobalt/80" style={{ width: `${width}%` }} />
              </div>
              <span className="w-12 shrink-0 text-right tabular-nums text-ink">{phase.durationMs}ms</span>
            </div>
          );
        })}
      </div>

      {stdout ? (
        <pre className="border-t border-lavender-mist/40 px-3 py-3 font-mono text-[12px] leading-6 text-paper/90">
          <span className="text-code-teal">stdout</span>
          {"\n"}
          {stdout}
        </pre>
      ) : null}
    </div>
  );
}
