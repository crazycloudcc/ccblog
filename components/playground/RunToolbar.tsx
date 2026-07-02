"use client";

import type { PlaygroundLanguage } from "@/lib/playground/types";
import { templates } from "@/lib/playground/templates";

type RunToolbarProps = {
  language: PlaygroundLanguage;
  fileName: string;
  running: boolean;
  status: "idle" | "running" | "compiling" | "success" | "compile_error" | "runtime_error" | "timeout";
  ready: boolean;
  onLanguageChange: (language: PlaygroundLanguage) => void;
  onExampleChange: (source: string) => void;
  onRun: () => void;
  onClear: () => void;
};

export function RunToolbar({
  language,
  fileName,
  running,
  status,
  ready,
  onLanguageChange,
  onExampleChange,
  onRun,
  onClear,
}: RunToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
      <div className="inline-flex overflow-hidden rounded-[4px] border border-lavender-mist">
        {(["c", "cpp"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onLanguageChange(item)}
            className={`px-3 py-1.5 transition-colors ${
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
          className="ml-2 rounded-[4px] border border-lavender-mist bg-terminal-bg px-2 py-1.5 text-ink"
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

      <button
        type="button"
        onClick={onClear}
        className="rounded-[4px] border border-lavender-mist px-3 py-1.5 text-fog transition-colors hover:text-ink"
      >
        clear
      </button>

      <span className="text-fog">
        <span className="text-code-teal">toolchain</span>: {ready ? "ready" : "loading"}
      </span>
    </div>
  );
}
