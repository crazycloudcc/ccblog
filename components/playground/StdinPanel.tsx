"use client";

import { useRef, useState, type RefObject } from "react";
import type { PlaygroundTemplate } from "@/lib/playground/templates";

type StdinPanelProps = {
  template?: PlaygroundTemplate;
  stdin: string;
  readonly: boolean;
  onChange: (stdin: string) => void;
};

type StdinInputProps = StdinPanelProps & {
  sampleButtonRef?: RefObject<HTMLButtonElement | null>;
  pendingReplacement: string | null;
  onPendingReplacementChange: (stdin: string | null) => void;
};

// Kept controlled so the confirmation and input-protection flows can be tested
// without loading Monaco or the compiler. The parent keys this panel by example.
export function StdinInput({ template, stdin, readonly, onChange, pendingReplacement, onPendingReplacementChange, sampleButtonRef }: StdinInputProps) {
  const sample = template?.sampleStdin;
  const hasSample = sample !== undefined;
  const confirming = !readonly && hasSample && pendingReplacement !== null && pendingReplacement === stdin;
  const loadSample = () => {
    if (readonly || sample === undefined) return;
    if (stdin !== "" && stdin !== sample) {
      onPendingReplacementChange(stdin);
      return;
    }
    onPendingReplacementChange(null);
    if (stdin !== sample) onChange(sample);
  };
  const buttonClass = "rounded-[4px] border border-code-teal/40 px-2 py-1 text-code-teal hover:bg-code-teal/10 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex shrink-0 flex-col rounded-[8px] border border-lavender-mist">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lavender-mist/40 px-3 py-2 font-mono text-[11px] text-code-teal">
        <label htmlFor="playground-stdin">stdin <span className="text-fog">{hasSample ? `(${template?.label} 需要输入)` : "(for cin / scanf)"}</span></label>
        {hasSample ? <button ref={sampleButtonRef} type="button" disabled={readonly} onClick={loadSample} className={buttonClass}>载入示例输入</button> : null}
      </div>
      {hasSample ? <p id="playground-input-hint" className="px-3 pt-2 font-mono text-[11px] leading-5 text-fog">{template?.inputHint}</p> : null}
      {confirming ? (
        <div role="group" aria-live="polite" aria-label="替换 stdin 确认" className="flex flex-wrap items-center gap-2 px-3 pt-2 font-mono text-[11px] text-fog">
          <span>替换现有 stdin？</span>
          <button type="button" className={buttonClass} onClick={() => {
            if (readonly || sample === undefined || pendingReplacement !== stdin) return;
            onPendingReplacementChange(null);
            onChange(sample);
            sampleButtonRef?.current?.focus();
          }}>替换</button>
          <button type="button" className={buttonClass} onClick={() => {
            onPendingReplacementChange(null);
            sampleButtonRef?.current?.focus();
          }}>取消</button>
        </div>
      ) : null}
      <textarea
        id="playground-stdin"
        aria-describedby={hasSample ? "playground-input-hint" : undefined}
        value={stdin}
        onChange={(event) => {
          if (readonly) return;
          onPendingReplacementChange(null);
          onChange(event.target.value);
        }}
        readOnly={readonly}
        placeholder={hasSample ? sample : "程序需要输入时，在运行前填入"}
        className="min-h-[72px] resize-y bg-terminal-bg px-3 py-3 font-mono text-[12px] leading-6 text-ink outline-none placeholder:text-mist disabled:opacity-70"
        spellCheck={false}
      />
    </div>
  );
}

export function StdinPanel(props: StdinPanelProps) {
  const sampleButtonRef = useRef<HTMLButtonElement | null>(null);
  const [pendingReplacement, setPendingReplacement] = useState<string | null>(null);
  return <StdinInput {...props} sampleButtonRef={sampleButtonRef} pendingReplacement={pendingReplacement} onPendingReplacementChange={setPendingReplacement} />;
}
