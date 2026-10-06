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

function statusLabel(status: OutputPanelProps["status"], exitCode?: number): string {
  switch (status) {
    case "success":
    case "nonzero_exit":
      return exitCode === undefined ? "exited" : `exit ${exitCode}`;
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
  const hasProgramResult = ["success", "nonzero_exit", "runtime_error", "timeout"].includes(status);
  const showStdout = hasProgramResult || stdout.length > 0;
  // The worker repeats compiler failures in stderr; they are not program output.
  const showStderr = stderr.length > 0 && !(status === "compile_error" && stderr === compileOutput);
  const command = metadata
    ? `$ ${metadata.compilerProgram} ${metadata.fileName} ${metadata.flags.join(" ")}`
    : "";
  const showTimeoutHint =
    status === "timeout" && stdout.length === 0 && stderr.length === 0 && compileOutput.length === 0;

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
        <div className="border-b border-lavender-mist/40 px-3 py-2 font-mono text-[11px] text-code-teal">
          output · <span className="text-paper/70">{statusLabel(status, metrics?.exitCode)}</span>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          {command ? (
            <pre aria-label="Compiler command" className="overflow-auto px-3 py-2 font-mono text-[11px] text-paper/70">
              {command}
            </pre>
          ) : null}
          {compileOutput.length > 0 ? <OutputStream label="compiler" text={compileOutput} /> : null}
          {showStdout ? <OutputStream label="stdout" text={stdout} /> : null}
          {showStderr ? <OutputStream label="stderr" text={stderr} /> : null}
          {!command && !compileOutput && !showStdout && !stderr ? (
            <p className="px-3 py-3 font-mono text-[12px] leading-6 text-paper/70">
              {status === "compiling" || status === "running"
                ? "Waiting for output…"
                : "Run your code to see output here."}
            </p>
          ) : null}
        </div>
        {status === "timeout" ? (
          <p className="border-t border-lavender-mist/30 px-3 py-2 font-mono text-[11px] text-code-plum">
            [timeout] execution stopped after 5s — check for infinite loops or input loops that ignore EOF
          </p>
        ) : null}
        {timing?.totalMs !== undefined ? (
          <p className="border-t border-lavender-mist/30 px-3 py-2 font-mono text-[11px] text-paper/70">
            $ done in {timing.totalMs}ms
          </p>
        ) : null}
        {showTimeoutHint ? (
          <div className="border-t border-lavender-mist/30 px-3 py-2 font-mono text-[11px] text-code-plum">
            // hint: stdin is preloaded and ends at EOF — check that input loops stop at EOF
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Keep program bytes separate from UI status, commands, and other streams. */
function OutputStream({ label, text }: { label: string; text: string }) {
  return (
    <section aria-label={`${label} output`} className="border-t border-lavender-mist/30">
      <div className="flex items-center justify-between gap-2 px-3 py-2 font-mono text-[11px]">
        <span className="text-code-teal">{label}</span>
        {text.length > 0 ? (
          <CopyButton
            text={text}
            label={`copy ${label}`}
            copiedLabel={`${label} copied`}
            className="shrink-0 border-lavender-mist/40 text-paper/70 hover:text-paper"
          />
        ) : null}
      </div>
      {text.length > 0 ? (
        <pre aria-label={`${label} contents`} className="min-h-9 overflow-auto px-3 pb-3 font-mono text-[12px] leading-6 text-paper/90">
          {text}
        </pre>
      ) : (
        <p className="px-3 pb-3 font-mono text-[11px] text-paper/60">No {label} output.</p>
      )}
    </section>
  );
}
