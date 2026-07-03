import type { ReactNode } from "react";
import { CopyButton } from "@/components/ui/CopyButton";

const SITE_SNIPPET = `export const site = {
  name: "crazycloudcc's blog",
  author: "crazycloudcc",
  topics: ["cloud", "code", "notes"],
  url: "https://crazycloud.cc",
}`;

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
          <Token className="text-code-plum">&quot;crazycloudcc&apos;s blog&quot;</Token>
          <Token className="text-ink">,</Token>
        </Line>
        <Line indent={1}>
          <Token className="text-code-cobalt">author</Token>
          <Token className="text-ink">: </Token>
          <Token className="text-code-plum">&quot;crazycloudcc&quot;</Token>
          <Token className="text-ink">,</Token>
        </Line>
        <Line indent={1}>
          <Token className="text-code-cobalt">topics</Token>
          <Token className="text-ink">: [</Token>
          <Token className="text-code-plum">&quot;cloud&quot;</Token>
          <Token className="text-ink">, </Token>
          <Token className="text-code-plum">&quot;code&quot;</Token>
          <Token className="text-ink">, </Token>
          <Token className="text-code-plum">&quot;notes&quot;</Token>
          <Token className="text-ink">],</Token>
        </Line>
        <Line indent={1}>
          <Token className="text-code-cobalt">url</Token>
          <Token className="text-ink">: </Token>
          <Token className="text-code-plum">&quot;https://crazycloud.cc&quot;</Token>
        </Line>
        <Line>
          <Token className="text-ink">{"}"}</Token>
        </Line>
      </div>
    </div>
  );
}
