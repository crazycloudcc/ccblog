/// <reference lib="webworker" />

import { compileSource, runModule } from "@/lib/playground/compile-run";
import type { CompileDone, RunRequest, RunResult } from "@/lib/playground/types";

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (event: MessageEvent<RunRequest>) => {
  if (event.data.type !== "run") {
    return;
  }

  const startedAt = performance.now();
  const { language, source, stdin, toolchainBase } = event.data;

  try {
    const compiled = await compileSource(toolchainBase, language, source);
    const compileDone: CompileDone = {
      type: "compiled",
      compileOutput: compiled.compileOutput,
    };
    self.postMessage(compileDone);

    if (!compiled.module) {
      const payload: RunResult = {
        type: "result",
        status: "compile_error",
        compileOutput: compiled.compileOutput,
        stdout: "",
        stderr: compiled.compileOutput,
        durationMs: Math.round(performance.now() - startedAt),
      };
      self.postMessage(payload);
      return;
    }

    const executed = await runModule(compiled.module, stdin);
    const payload: RunResult = {
      type: "result",
      status: executed.status,
      compileOutput: compiled.compileOutput,
      stdout: executed.stdout,
      stderr: executed.stderr,
      durationMs: Math.round(performance.now() - startedAt),
    };
    self.postMessage(payload);
  } catch (error) {
    const payload: RunResult = {
      type: "result",
      status: "runtime_error",
      compileOutput: "",
      stdout: "",
      stderr: error instanceof Error ? error.message : "Unknown worker error",
      durationMs: Math.round(performance.now() - startedAt),
    };
    self.postMessage(payload);
  }
};

export {};
