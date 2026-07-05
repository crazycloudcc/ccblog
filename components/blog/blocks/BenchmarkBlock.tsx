type BenchmarkBlockProps = {
  title?: string;
  rows: { variant: string; timeMs: number }[];
};

export function BenchmarkBlock({ title, rows }: BenchmarkBlockProps) {
  if (rows.length === 0) {
    return null;
  }

  const maxMs = Math.max(...rows.map((row) => row.timeMs), 1);

  return (
    <div className="overflow-hidden rounded-[4px] border border-lavender-mist bg-terminal-bg/50">
      <div className="border-b border-lavender-mist/40 px-3 py-2 font-mono text-[11px] text-code-teal">
        {title ?? "bench"}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full font-mono text-[11px]">
          <thead>
            <tr className="border-b border-lavender-mist/40 text-left text-fog">
              <th className="px-3 py-2 font-normal">variant</th>
              <th className="px-3 py-2 font-normal">time</th>
              <th className="px-3 py-2 font-normal">bar</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const width = Math.max(8, Math.round((row.timeMs / maxMs) * 100));

              return (
                <tr key={row.variant} className="border-b border-lavender-mist/20">
                  <td className="px-3 py-2 text-ink">{row.variant}</td>
                  <td className="px-3 py-2 tabular-nums text-fog">{row.timeMs}ms</td>
                  <td className="px-3 py-2">
                    <div className="h-2 w-full max-w-[180px] overflow-hidden rounded-full bg-lavender-mist/50">
                      <div className="h-full bg-code-plum/80" style={{ width: `${width}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
