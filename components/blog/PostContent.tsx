import { AnnotatedCodeBlock } from "@/components/blog/blocks/AnnotatedCodeBlock";
import { BenchmarkBlock } from "@/components/blog/blocks/BenchmarkBlock";
import { CasesCodeBlock } from "@/components/blog/blocks/CasesCodeBlock";
import { PlaygroundEmbed } from "@/components/blog/blocks/PlaygroundEmbed";
import { StepsCodeBlock } from "@/components/blog/blocks/StepsCodeBlock";
import { TraceBlock } from "@/components/blog/blocks/TraceBlock";
import { CodePanel } from "@/components/ui/CodePanel";
import { resolvePlaygroundSnippet } from "@/lib/playground/snippets";
import { parsePostContent } from "@/lib/parse-post-content";
import type { PostPlayground } from "@/lib/posts";

type PostContentProps = {
  content: string;
  playground?: PostPlayground;
};

export function PostContent({ content, playground }: PostContentProps) {
  const blocks = parsePostContent(content);
  const snippet = playground?.slug ? resolvePlaygroundSnippet(playground.slug) : null;

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

          case "code":
            return (
              <CodePanel
                key={index}
                code={block.text}
                language={block.language}
              />
            );

          case "annotate":
            return (
              <AnnotatedCodeBlock
                key={index}
                title={block.title}
                code={block.code}
                language={block.language}
                notes={block.notes}
              />
            );

          case "steps":
            return (
              <StepsCodeBlock
                key={index}
                title={block.title}
                code={block.code}
                language={block.language}
                steps={block.steps}
              />
            );

          case "cases":
            return (
              <CasesCodeBlock
                key={index}
                title={block.title}
                language={block.language}
                cases={block.cases}
              />
            );

          case "trace":
            return (
              <TraceBlock
                key={index}
                title={block.title}
                phases={block.phases}
                stdout={block.stdout}
              />
            );

          case "bench":
            return (
              <BenchmarkBlock
                key={index}
                title={block.title}
                rows={block.rows}
              />
            );

          case "playground":
            return (
              <PlaygroundEmbed
                key={index}
                lang={block.lang}
                source={block.source}
                stdin={block.stdin}
                readonly={block.readonly}
                title={block.title}
              />
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

      {snippet ? (
        <PlaygroundEmbed
          lang={snippet.lang}
          source={snippet.source}
          stdin={snippet.stdin}
          readonly={playground?.readonly}
          title={snippet.title}
        />
      ) : null}
    </div>
  );
}
