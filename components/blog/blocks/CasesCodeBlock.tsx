"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";

type CasesCodeBlockProps = {
  title?: string;
  language?: string;
  cases: { label: string; code: string }[];
};

export function CasesCodeBlock({ title, language, cases }: CasesCodeBlockProps) {
  const [activeCase, setActiveCase] = useState(0);
  const current = cases[activeCase];

  if (!current) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-[4px] border border-lavender-mist bg-paper">
      <div className="flex items-center justify-between border-b border-lavender-mist/40 px-3 py-2 font-mono text-[11px]">
        <span className="text-code-teal">{title ?? "cases"}</span>
        <CopyButton text={current.code} />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-lavender-mist/40 px-3 py-2">
        {cases.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setActiveCase(index)}
            className={`rounded-[4px] border px-2 py-1 font-mono text-[11px] transition-colors ${
              activeCase === index
                ? "border-code-teal/40 bg-code-teal/10 text-code-teal"
                : "border-lavender-mist text-fog hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <pre className="overflow-x-auto px-3 py-3 font-mono text-[12px] leading-6 text-ink">
        <code>{current.code}</code>
      </pre>
      {language ? (
        <div className="border-t border-lavender-mist/40 px-3 py-2 font-mono text-[10px] text-fog">
          // {language} · {current.label}
        </div>
      ) : null}
    </div>
  );
}
