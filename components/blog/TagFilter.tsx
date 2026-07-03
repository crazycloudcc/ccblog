import Link from "next/link";

type TagFilterProps = {
  tags: string[];
  activeTag?: string;
};

export function TagFilter({ tags, activeTag }: TagFilterProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <nav className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs" aria-label="Filter by tag">
      <span className="text-code-teal">tags</span>
      <Link
        href="/blog"
        className={`rounded-[4px] border px-2 py-1 transition-colors ${
          !activeTag
            ? "border-ink/20 bg-ink text-paper"
            : "border-lavender-mist text-fog hover:border-fog/40 hover:text-ink"
        }`}
      >
        all
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          className={`rounded-[4px] border px-2 py-1 transition-colors ${
            activeTag === tag
              ? "border-ink/20 bg-ink text-paper"
              : "border-lavender-mist text-fog hover:border-fog/40 hover:text-ink"
          }`}
        >
          #{tag}
        </Link>
      ))}
    </nav>
  );
}
