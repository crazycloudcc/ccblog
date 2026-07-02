import { parsePostContent } from "@/lib/parse-post-content";

type PostContentProps = {
  content: string;
};

export function PostContent({ content }: PostContentProps) {
  const blocks = parsePostContent(content);

  return (
    <div className="prose-terminal space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={index} className="text-xl font-semibold text-ink">
                {block.text}
              </h2>
            );

          case "ul":
            return (
              <ul
                key={index}
                className="list-disc space-y-2 pl-5 text-sm leading-[1.8] text-slate"
              >
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol
                key={index}
                className="list-decimal space-y-2 pl-5 text-sm leading-[1.8] text-slate"
              >
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            );

          case "image":
            return (
              <figure key={index} className="overflow-hidden rounded-[4px] border border-lavender-mist">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.src}
                  alt={block.alt}
                  className="w-full object-cover"
                  loading="lazy"
                />
                {block.alt ? (
                  <figcaption className="border-t border-lavender-mist bg-lavender-mist/30 px-4 py-2 font-mono text-xs text-fog">
                    // {block.alt}
                  </figcaption>
                ) : null}
              </figure>
            );

          case "video":
            return (
              <figure key={index} className="overflow-hidden rounded-[4px] border border-lavender-mist">
                <video
                  src={block.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full bg-obsidian/5"
                />
                {block.title ? (
                  <figcaption className="border-t border-lavender-mist bg-lavender-mist/30 px-4 py-2 font-mono text-xs text-fog">
                    // {block.title}
                  </figcaption>
                ) : null}
              </figure>
            );

          case "paragraph":
            return (
              <p key={index} className="text-sm leading-[1.8] text-slate">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
