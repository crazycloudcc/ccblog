"use client";

import type { CompileDiagnostic } from "@/lib/playground/diagnostics";
import type { CompileMetadata, CompileTiming, RunResultStatus, SandboxMetrics } from "@/lib/playground/types";
import { CompileTimeline } from "@/components/playground/CompileTimeline";
import { CopyButton } from "@/components/ui/CopyButton";

type OutputPanelProps = {
  compileOutput: string;
  stdout: string;
  stderr: string;
  status: RunResultStatus | "idle" | "running" | "compiling";
  timing: CompileTiming | null;
  metadata: CompileMetadata | null;
  metrics: SandboxMetrics | null;
  diagnostics: CompileDiagnostic[];
  activePhase?: string;
  onDiagnosticClick?: (diagnostic: CompileDiagnostic) => void;
};

function statusLabel(status: OutputPanelProps["status"]): string {
  switch (status) {
    case "success":
      return "exit 0";
    case "compile_error":
      return "compile error";
    case "runtime_error":
      return "runtime error";
    case "timeout":
      return "timeout";
    case "compiling":
      return "compiling";
    case "running":
      return "running";
    default:
      return "idle";
  }
}

export function OutputPanel({
  compileOutput,
  stdout,
  stderr,
  status,
  timing,
  metadata,
  metrics,
  diagnostics,
  activePhase,
  onDiagnosticClick,
}: OutputPanelProps) {
  const lines = [
    metadata ? `$ ${metadata.compilerProgram} ${metadata.fileName} ${metadata.flags.join(" ")}` : "",
    compileOutput.trim(),
    stdout.trim(),
    stderr.trim(),
    status === "timeout" ? "[timeout] execution stopped after 5s — check for infinite loops or blocking stdin reads" : "",
    metrics?.timedOut ? "[timeout]" : "",
    timing?.totalMs !== undefined ? `$ done in ${timing.totalMs}ms` : "",
    metrics?.exitCode !== undefined && status === "success" ? `[exit ${metrics.exitCode}]` : "",
  ].filter(Boolean);

  const outputText = lines.length > 0 ? lines.join("\n") : "";
  const placeholder = "Run your code to see output here.";
  const showStdinHint =
    status === "timeout" && !stdout.trim() && !stderr.trim() && compileOutput.trim() === "";

  return (
    <div className="flex h-full min-h-[220px] flex-col gap-2">
      <CompileTimeline timing={timing} metadata={metadata} activePhase={activePhase} />

      {diagnostics.length > 0 ? (
        <div className="max-h-28 overflow-auto rounded-[8px] border border-code-rust/30 bg-code-rust/5 px-2 py-2 font-mono text-[11px]">
          <div className="mb-1 text-code-rust">
            {diagnostics.length} error{diagnostics.length > 1 ? "s" : ""}
          </div>
          <ul className="space-y-1.5">
            {diagnostics.map((diagnostic) => (
              <li key={`${diagnostic.file}:${diagnostic.line}:${diagnostic.message}`}>
                <button
                  type="button"
                  onClick={() => onDiagnosticClick?.(diagnostic)}
                  className="w-full text-left hover:text-ink"
                >
                  <span className="text-code-rust">
                    {diagnostic.file}:{diagnostic.line}
                    {diagnostic.column ? `:${diagnostic.column}` : ""}
                  </span>
                  <span className="text-mist"> — </span>
                  <span className="text-ink">{diagnostic.message}</span>
                </button>
                {diagnostic.hints[0] ? (
                  <div className="mt-0.5 pl-2 text-fog">// {diagnostic.hints[0]}</div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col rounded-[8px] border border-lavender-mist bg-obsidian/95">
        <div className="flex items-center justify-between border-b border-lavender-mist/40 px-3 py-2 font-mono text-[11px]">
          <span className="text-code-teal">
            stdout / stderr · <span className="text-fog">{statusLabel(status)}</span>
          </span>
          {outputText ? (
            <CopyButton text={outputText} className="border-lavender-mist/40 text-paper/70 hover:text-paper" />
          ) : null}
        </div>
        <pre className="flex-1 overflow-auto px-3 py-3 font-mono text-[12px] leading-6 text-paper/90">
          {outputText || placeholder}
        </pre>
        {showStdinHint ? (
          <div className="border-t border-lavender-mist/30 px-3 py-2 font-mono text-[11px] text-code-plum">
            // hint: program may be waiting for stdin — add input in the panel above
          </div>
        ) : null}
      </div>
    </div>
  );
}
