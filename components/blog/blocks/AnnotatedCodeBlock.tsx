"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";

type AnnotatedCodeBlockProps = {
  title?: string;
  code: string;
  language?: string;
  notes: { line: number; text: string }[];
};

export function AnnotatedCodeBlock({ title, code, language, notes }: AnnotatedCodeBlockProps) {
  const lines = useMemo(() => code.split("\n"), [code]);
  const [activeLine, setActiveLine] = useState<number | null>(notes[0]?.line ?? null);

  return (
    <div className="overflow-hidden rounded-[4px] border border-lavender-mist bg-paper">
      <div className="flex items-center justify-between border-b border-lavender-mist/40 px-3 py-2 font-mono text-[11px]">
        <span className="text-code-teal">{title ?? language ?? "annotate"}</span>
        <CopyButton text={code} />
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <pre className="overflow-x-auto border-b border-lavender-mist/40 px-3 py-3 font-mono text-[12px] leading-6 text-ink lg:border-b-0 lg:border-r">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const highlighted = activeLine === lineNumber;

            return (
              <div
                key={lineNumber}
                className={`flex gap-3 ${highlighted ? "bg-code-teal/10" : ""}`}
                onMouseEnter={() => setActiveLine(lineNumber)}
              >
                <span className="w-6 shrink-0 select-none text-right text-fog">{lineNumber}</span>
                <code className="min-w-0 flex-1 whitespace-pre">{line || " "}</code>
              </div>
            );
          })}
        </pre>

        <ul className="space-y-2 px-3 py-3 font-mono text-[11px]">
          {notes.map((note) => (
            <li key={`${note.line}:${note.text}`}>
              <button
                type="button"
                onClick={() => setActiveLine(note.line)}
                className={`text-left ${activeLine === note.line ? "text-ink" : "text-slate hover:text-ink"}`}
              >
                <span className="text-code-teal">line {note.line}</span>
                <span className="text-mist"> — </span>
                {note.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
