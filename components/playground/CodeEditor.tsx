"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "@/components/terminal/ThemeProvider";

type CodeEditorProps = {
  language: string;
  fileName: string;
  value: string;
  onChange: (value: string) => void;
};

export function CodeEditor({ language, fileName, value, onChange }: CodeEditorProps) {
  const { resolved } = useTheme();

  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-[8px] border border-lavender-mist">
      <div className="flex shrink-0 items-center justify-between border-b border-lavender-mist/60 bg-lavender-mist/20 px-3 py-2 font-mono text-[11px]">
        <span className="text-code-cobalt">{fileName}</span>
        <span className="text-fog">Monaco · {language.toUpperCase()}</span>
      </div>
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language={language}
          value={value}
          theme={resolved === "dark" ? "vs-dark" : "vs"}
          onChange={(nextValue) => onChange(nextValue ?? "")}
          options={{
            fontFamily: "IBM Plex Mono, ui-monospace, monospace",
            fontSize: 13,
            lineNumbers: "on",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "off",
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
}
