export type PlaygroundLanguage = "c" | "cpp";

export type CompileDone = {
  type: "compiled";
  compileOutput: string;
};

export type RunRequest = {
  type: "run";
  language: PlaygroundLanguage;
  source: string;
  stdin: string;
  toolchainBase: string;
};

export type RunResult = {
  type: "result";
  status: "success" | "compile_error" | "runtime_error";
  compileOutput: string;
  stdout: string;
  stderr: string;
  durationMs: number;
};

export type WorkerMessage = RunRequest | CompileDone | RunResult;
