"use client";

type OutputPanelProps = {
  compileOutput: string;
  stdout: string;
  stderr: string;
  status: "idle" | "running" | "compiling" | "success" | "compile_error" | "runtime_error" | "timeout";
  durationMs: number | null;
};

export function OutputPanel({
  compileOutput,
  stdout,
  stderr,
  status,
  durationMs,
}: OutputPanelProps) {
  const lines = [
    "$ g++ main.cpp -o a.out && ./a.out",
    compileOutput.trim(),
    stdout.trim(),
    stderr.trim(),
    status === "timeout" ? "[timeout] execution stopped after 5s" : "",
    durationMs !== null ? `$ done in ${durationMs}ms` : "",
  ].filter(Boolean);

  return (
    <div className="flex h-full min-h-[220px] flex-col rounded-[8px] border border-lavender-mist bg-obsidian/95">
      <div className="border-b border-lavender-mist/40 px-3 py-2 font-mono text-[11px] text-code-teal">
        stdout / stderr
      </div>
      <pre className="flex-1 overflow-auto px-3 py-3 font-mono text-[12px] leading-6 text-paper/90">
        {lines.length > 1 ? lines.join("\n") : "Run your code to see output here."}
      </pre>
    </div>
  );
}
