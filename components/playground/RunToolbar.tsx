"use client";

import type { PlaygroundLanguage } from "@/lib/playground/types";
import { templates } from "@/lib/playground/templates";

type RunToolbarProps = {
  language: PlaygroundLanguage;
  fileName: string;
  running: boolean;
  status: "idle" | "running" | "compiling" | "success" | "compile_error" | "runtime_error" | "timeout";
  ready: boolean;
  sharing?: boolean;
  shareMessage?: string | null;
  readonly?: boolean;
  onLanguageChange: (language: PlaygroundLanguage) => void;
  onExampleChange: (source: string) => void;
  onRun: () => void;
  onClear: () => void;
  onShare: () => void;
};

export function RunToolbar({
  language,
  fileName,
  running,
  status,
  ready,
  sharing = false,
  shareMessage,
  readonly = false,
  onLanguageChange,
  onExampleChange,
  onRun,
  onClear,
  onShare,
}: RunToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
      <div className="inline-flex overflow-hidden rounded-[4px] border border-lavender-mist">
        {(["c", "cpp"] as const).map((item) => (
          <button
            key={item}
            type="button"
            disabled={readonly}
            onClick={() => onLanguageChange(item)}
            className={`px-3 py-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              language === item
                ? "bg-ink text-paper"
                : "bg-terminal-bg text-fog hover:text-ink"
            }`}
          >
            {item === "c" ? "C" : "C++"}
          </button>
        ))}
      </div>

      <span className="text-fog">
        <span className="text-code-teal">file</span>: {fileName}
      </span>

      <label className="text-fog">
        <span className="text-code-teal">example</span>
        <select
          disabled={readonly}
          className="ml-2 rounded-[4px] border border-lavender-mist bg-terminal-bg px-2 py-1.5 text-ink disabled:cursor-not-allowed disabled:opacity-50"
          defaultValue=""
          onChange={(event) => {
            if (!event.target.value) {
              return;
            }
            const example = templates[language].find((item) => item.label === event.target.value);
            if (example) {
              onExampleChange(example.source);
            }
            event.target.value = "";
          }}
        >
          <option value="">load example…</option>
          {templates[language].map((template) => (
            <option key={template.label} value={template.label}>
              {template.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={onRun}
        disabled={!ready || running}
        className="rounded-[4px] border border-code-teal/40 bg-code-teal/10 px-3 py-1.5 text-code-teal transition-colors hover:bg-code-teal/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {running ? (status === "compiling" ? "compiling..." : "running...") : "run"}
      </button>

      {!readonly ? (
        <>
          <button
            type="button"
            onClick={onClear}
            className="rounded-[4px] border border-lavender-mist px-3 py-1.5 text-fog transition-colors hover:text-ink"
          >
            clear
          </button>

          <button
            type="button"
            onClick={onShare}
            disabled={sharing}
            className="rounded-[4px] border border-lavender-mist px-3 py-1.5 text-fog transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sharing ? "sharing..." : "share"}
          </button>
        </>
      ) : (
        <span className="rounded-[4px] border border-code-plum/40 bg-code-plum/10 px-3 py-1.5 text-code-plum">
          readonly
        </span>
      )}

      {shareMessage ? <span className="text-code-teal">{shareMessage}</span> : null}

      <span className="text-fog">
        <span className="text-code-teal">toolchain</span>: {ready ? "ready" : "loading"}
      </span>
    </div>
  );
}
