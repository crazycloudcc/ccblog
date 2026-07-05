/// <reference lib="webworker" />

import { compileSource, runModule } from "@/lib/playground/compile-run";
import type {
  CompileDone,
  PhaseMessage,
  RunRequest,
  RunResult,
} from "@/lib/playground/types";

declare const self: DedicatedWorkerGlobalScope;

function postPhase(phase: PhaseMessage["phase"]) {
  const message: PhaseMessage = { type: "phase", phase };
  self.postMessage(message);
}

self.onmessage = async (event: MessageEvent<RunRequest>) => {
  if (event.data.type !== "run") {
    return;
  }

  const startedAt = performance.now();
  const { language, source, stdin, toolchainBase } = event.data;

  try {
    postPhase("fetching_toolchain");
    postPhase("compiling");

    const compiled = await compileSource(toolchainBase, language, source);

    postPhase("linking");

    const compileDone: CompileDone = {
      type: "compiled",
      compileOutput: compiled.compileOutput,
      timing: compiled.timing,
      metadata: compiled.metadata,
    };
    self.postMessage(compileDone);

    if (!compiled.module) {
      const payload: RunResult = {
        type: "result",
        status: "compile_error",
        compileOutput: compiled.compileOutput,
        stdout: "",
        stderr: compiled.compileOutput,
        timing: {
          ...compiled.timing,
          totalMs: Math.round(performance.now() - startedAt),
        },
        metrics: { exitCode: 1 },
        metadata: compiled.metadata,
      };
      postPhase("done");
      self.postMessage(payload);
      return;
    }

    postPhase("running");
    const runStarted = performance.now();
    const executed = await runModule(compiled.module, stdin);
    const runMs = Math.round(performance.now() - runStarted);

    const payload: RunResult = {
      type: "result",
      status: executed.status,
      compileOutput: compiled.compileOutput,
      stdout: executed.stdout,
      stderr: executed.stderr,
      timing: {
        ...compiled.timing,
        runMs,
        totalMs: Math.round(performance.now() - startedAt),
      },
      metrics: { exitCode: executed.exitCode },
      metadata: compiled.metadata,
    };
    postPhase("done");
    self.postMessage(payload);
  } catch (error) {
    const payload: RunResult = {
      type: "result",
      status: "runtime_error",
      compileOutput: "",
      stdout: "",
      stderr: error instanceof Error ? error.message : "Unknown worker error",
      timing: { totalMs: Math.round(performance.now() - startedAt) },
      metrics: { exitCode: 1 },
    };
    postPhase("done");
    self.postMessage(payload);
  }
};

export {};
