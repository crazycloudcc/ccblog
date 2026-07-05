"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";

type StepsCodeBlockProps = {
  title?: string;
  code: string;
  language?: string;
  steps: { label: string; line: number }[];
};

export function StepsCodeBlock({ title, code, language, steps }: StepsCodeBlockProps) {
  const lines = code.split("\n");
  const [activeStep, setActiveStep] = useState(0);
  const activeLine = steps[activeStep]?.line ?? null;

  return (
    <div className="overflow-hidden rounded-[4px] border border-lavender-mist bg-paper">
      <div className="flex items-center justify-between border-b border-lavender-mist/40 px-3 py-2 font-mono text-[11px]">
        <span className="text-code-teal">{title ?? "steps"}</span>
        <CopyButton text={code} />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-lavender-mist/40 px-3 py-2">
        {steps.map((step, index) => (
          <button
            key={step.label}
            type="button"
            onClick={() => setActiveStep(index)}
            className={`rounded-[4px] border px-2 py-1 font-mono text-[11px] transition-colors ${
              activeStep === index
                ? "border-code-teal/40 bg-code-teal/10 text-code-teal"
                : "border-lavender-mist text-fog hover:text-ink"
            }`}
          >
            {index + 1}. {step.label}
          </button>
        ))}
      </div>

      <pre className="overflow-x-auto px-3 py-3 font-mono text-[12px] leading-6 text-ink">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const highlighted = activeLine === lineNumber;

          return (
            <div key={lineNumber} className={`flex gap-3 ${highlighted ? "bg-code-teal/10" : ""}`}>
              <span className="w-6 shrink-0 select-none text-right text-fog">{lineNumber}</span>
              <code className="min-w-0 flex-1 whitespace-pre">{line || " "}</code>
            </div>
          );
        })}
      </pre>
      {language ? (
        <div className="border-t border-lavender-mist/40 px-3 py-2 font-mono text-[10px] text-fog">
          // {language}
        </div>
      ) : null}
    </div>
  );
}
