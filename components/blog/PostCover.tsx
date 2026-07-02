import type { PostCover } from "@/lib/posts";

type PostCoverProps = {
  cover: PostCover;
  className?: string;
};

export function PostCover({ cover, className = "" }: PostCoverProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${cover.from} 0%, ${cover.to} 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,17,0.35),transparent_55%)]" />

      <div className="relative flex h-full min-h-[180px] flex-col justify-between p-5 md:min-h-full">
        <span className="inline-flex w-fit rounded-[4px] border border-white/25 bg-white/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-white/90 backdrop-blur-sm">
          {cover.label}
        </span>
        <span className="font-mono text-[11px] text-white/70">{cover.caption}</span>
      </div>
    </div>
  );
}
