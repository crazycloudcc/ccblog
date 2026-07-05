export type PlaygroundLanguage = "c" | "cpp";

export type CompilePhase =
  | "idle"
  | "fetching_toolchain"
  | "compiling"
  | "linking"
  | "running"
  | "done";

export type CompileTiming = {
  toolchainMs?: number;
  compileMs?: number;
  linkMs?: number;
  runMs?: number;
  totalMs?: number;
};

export type SandboxMetrics = {
  exitCode?: number;
  timedOut?: boolean;
  peakMemoryBytes?: number;
};

export type CompileMetadata = {
  flags: string[];
  compilerProgram: string;
  fileName: string;
  driverSummary?: string;
};

export type PhaseMessage = {
  type: "phase";
  phase: CompilePhase;
};

export type CompileDone = {
  type: "compiled";
  compileOutput: string;
  timing: CompileTiming;
  metadata: CompileMetadata;
};

export type RunRequest = {
  type: "run";
  language: PlaygroundLanguage;
  source: string;
  stdin: string;
  toolchainBase: string;
};

export type RunResultStatus = "success" | "compile_error" | "runtime_error" | "timeout";

export type RunResult = {
  type: "result";
  status: RunResultStatus;
  compileOutput: string;
  stdout: string;
  stderr: string;
  timing: CompileTiming;
  metrics: SandboxMetrics;
  metadata?: CompileMetadata;
};

export type WorkerOutboundMessage = PhaseMessage | CompileDone | RunResult;
