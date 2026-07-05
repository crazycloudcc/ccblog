import Link from "next/link";

type SeriesFilterProps = {
  series: string[];
  activeSeries?: string;
};

export function SeriesFilter({ series, activeSeries }: SeriesFilterProps) {
  if (series.length === 0) {
    return null;
  }

  return (
    <nav className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs" aria-label="Filter by series">
      <span className="text-code-teal">series</span>
      {series.map((item) => (
        <Link
          key={item}
          href={`/blog?series=${encodeURIComponent(item)}`}
          className={`rounded-[4px] border px-2 py-1 transition-colors ${
            activeSeries === item
              ? "border-ink/20 bg-ink text-paper"
              : "border-lavender-mist text-fog hover:border-fog/40 hover:text-ink"
          }`}
        >
          {item}
        </Link>
      ))}
    </nav>
  );
}
