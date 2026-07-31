import type { ReactNode } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { siteConfig } from "@/lib/site";

function buildSnippet(): string {
  const topics = siteConfig.topics.map((topic) => `"${topic}"`).join(", ");
  return `export const site = {
  name: "${siteConfig.name}",
  author: "${siteConfig.author}",
  topics: [${topics}],
  url: "${siteConfig.url}",
}`;
}

const SITE_SNIPPET = buildSnippet();

function Token({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}

function Line({ children, indent = 0 }: { children: ReactNode; indent?: number }) {
  return (
    <div className="whitespace-pre" style={{ paddingLeft: indent * 16 }}>
      {children}
    </div>
  );
}

export function CodeBlock() {
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between font-mono text-sm text-ink">
        <span>site.ts</span>
        <CopyButton text={SITE_SNIPPET} />
      </div>
      <div
        className="rounded-[8px] border border-lavender-mist bg-paper p-4 font-mono text-[13px] leading-[1.8] sm:p-5 sm:text-sm"
        style={{ boxShadow: "var(--elevation-code-block)" }}
      >
        <Line>
          <Token className="text-code-cobalt">export const</Token>
          <Token className="text-ink"> site = {"{"}</Token>
        </Line>
        <Line indent={1}>
          <Token className="text-code-cobalt">name</Token>
          <Token className="text-ink">: </Token>
          <Token className="text-code-plum">&quot;{siteConfig.name}&quot;</Token>
          <Token className="text-ink">,</Token>
        </Line>
        <Line indent={1}>
          <Token className="text-code-cobalt">author</Token>
          <Token className="text-ink">: </Token>
          <Token className="text-code-plum">&quot;{siteConfig.author}&quot;</Token>
          <Token className="text-ink">,</Token>
        </Line>
        <Line indent={1}>
          <Token className="text-code-cobalt">topics</Token>
          <Token className="text-ink">: [</Token>
          {siteConfig.topics.map((topic, index) => (
            <span key={topic}>
              <Token className="text-code-plum">&quot;{topic}&quot;</Token>
              {index < siteConfig.topics.length - 1 ? (
                <Token className="text-ink">, </Token>
              ) : null}
            </span>
          ))}
          <Token className="text-ink">],</Token>
        </Line>
        <Line indent={1}>
          <Token className="text-code-cobalt">url</Token>
          <Token className="text-ink">: </Token>
          <Token className="text-code-plum">&quot;{siteConfig.url}&quot;</Token>
        </Line>
        <Line>
          <Token className="text-ink">{"}"}</Token>
        </Line>
      </div>
    </div>
  );
}
