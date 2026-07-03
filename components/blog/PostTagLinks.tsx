import Link from "next/link";

type PostTagLinksProps = {
  tags: string[];
};

export function PostTagLinks({ tags }: PostTagLinksProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
      <span className="text-code-teal">tags</span>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          className="rounded-[4px] border border-lavender-mist px-2 py-0.5 text-fog transition-colors hover:border-fog/40 hover:text-code-cobalt"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
