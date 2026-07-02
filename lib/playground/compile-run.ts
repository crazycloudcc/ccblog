import Clang from "browsercc/dist/clang.js";
import LLD from "browsercc/dist/lld.js";
import { WASI, File, OpenFile, ConsoleStdout } from "@bjorn3/browser_wasi_shim";
import { setUpSysroot } from "browsercc";
import type { PlaygroundLanguage } from "@/lib/playground/types";
import { getLanguageConfig } from "@/lib/playground/languages";

type EmscriptenModule = {
  FS: {
    writeFile: (path: string, data: string | Uint8Array) => void;
    readFile: (path: string, opts: { encoding: "binary" }) => Uint8Array;
    mkdirTree: (path: string) => void;
    analyzePath: (path: string) => { exists: boolean };
  };
  callMain: (args: string[]) => number;
};

type Invocation = {
  compilerArgs: string[];
  compilerArtifact: string;
  linkerArgs: string[];
  linerArtifact: string;
};

export type CompileResult = {
  compileOutput: string;
  module: WebAssembly.Module | null;
};

export type ExecuteResult = {
  stdout: string;
  stderr: string;
  status: "success" | "runtime_error";
};

function createLocateFile(toolchainBase: string) {
  return (path: string) => `${toolchainBase}/${path}`;
}

async function fetchToolchainFile(toolchainBase: string, file: string): Promise<ArrayBuffer> {
  const response = await fetch(`${toolchainBase}/${file}`);
  if (!response.ok) {
    throw new Error(`Failed to load toolchain file ${file}: ${response.status}`);
  }

  return response.arrayBuffer();
}

async function getCompilerInvocation(
  toolchainBase: string,
  compilerProgram: "clang" | "clang++",
  inputName: string,
  inputFile: string,
  flags: string[],
): Promise<Invocation> {
  let stderr = "";
  const locateFile = createLocateFile(toolchainBase);
  const clang = (await Clang({
    thisProgram: compilerProgram,
    locateFile,
    printErr: (data: string) => {
      stderr += `${data}\n`;
    },
  })) as EmscriptenModule;

  clang.FS.writeFile(inputName, inputFile);
  clang.FS.mkdirTree("/lib/wasm32-wasi");
  clang.FS.mkdirTree("/include/c++/v1");
  clang.FS.writeFile("/lib/wasm32-wasi/crt1-command.o", new Uint8Array(0));
  clang.FS.writeFile("/lib/wasm32-wasi/crt1-reactor.o", new Uint8Array(0));

  const ret = clang.callMain([inputName, ...flags, "-###"]);
  if (ret !== 0) {
    throw new Error(stderr || `Clang driver failed with code ${ret}`);
  }

  const lines = stderr.split("\n");
  const getArgs = (key: string) => {
    const line = lines.find((entry) => entry.includes(key)) ?? "";
    const matches = line.match(/"([^"]*)"/g) ?? [];
    const args = matches.map((value) => value.slice(1, -1)).slice(1);
    const outputIndex = args.findIndex((arg) => arg === "-o");
    return { args, outputFileName: args[outputIndex + 1] };
  };

  const cc1Line = getArgs("-cc1");
  const linkerLine = getArgs("wasm-ld");

  return {
    compilerArgs: cc1Line.args,
    compilerArtifact: cc1Line.outputFileName,
    linkerArgs: linkerLine.args,
    linerArtifact: linkerLine.outputFileName,
  };
}

export async function compileSource(
  toolchainBase: string,
  language: PlaygroundLanguage,
  source: string,
): Promise<CompileResult> {
  const { fileName, compilerProgram, flags } = getLanguageConfig(language);
  const locateFile = createLocateFile(toolchainBase);
  let stderr = "";

  const clangPromise = Clang({
    thisProgram: compilerProgram,
    locateFile,
    printErr: (data: string) => {
      stderr += `${data}\n`;
    },
  });

  const lldPromise = LLD({
    thisProgram: "wasm-ld",
    locateFile,
    printErr: (data: string) => {
      stderr += `${data}\n`;
    },
  });

  const sysroot = await fetchToolchainFile(toolchainBase, "sysroot.tar");
  const invocation = await getCompilerInvocation(
    toolchainBase,
    compilerProgram,
    fileName,
    source,
    flags,
  );

  const clang = (await clangPromise) as EmscriptenModule;
  clang.FS.writeFile(fileName, source);
  setUpSysroot(clang, sysroot);

  let exitCode = clang.callMain(invocation.compilerArgs);
  if (exitCode !== 0) {
    return {
      compileOutput: stderr,
      module: null,
    };
  }

  const binary = clang.FS.readFile(invocation.compilerArtifact, { encoding: "binary" });
  const lld = (await lldPromise) as EmscriptenModule;
  lld.FS.writeFile(invocation.compilerArtifact, binary);
  setUpSysroot(lld, sysroot);

  exitCode = lld.callMain(invocation.linkerArgs);
  if (exitCode !== 0) {
    return {
      compileOutput: stderr,
      module: null,
    };
  }

  const output = lld.FS.readFile(invocation.linerArtifact, { encoding: "binary" });
  const wasmBytes = Uint8Array.from(output);
  const module = await WebAssembly.compile(wasmBytes);

  return {
    compileOutput: stderr,
    module,
  };
}

export async function runModule(
  module: WebAssembly.Module,
  stdin: string,
): Promise<ExecuteResult> {
  let stdout = "";
  let stderr = "";
  const stdinBytes = new TextEncoder().encode(stdin);
  const fds = [
    new OpenFile(new File(stdinBytes)),
    new ConsoleStdout((data: Uint8Array) => {
      stdout += new TextDecoder().decode(data);
    }),
    new ConsoleStdout((data: Uint8Array) => {
      stderr += new TextDecoder().decode(data);
    }),
  ];

  const wasi = new WASI([], [], fds);
  const instance = await WebAssembly.instantiate(module, {
    wasi_snapshot_preview1: wasi.wasiImport,
  });

  try {
    wasi.start(
      instance as WebAssembly.Instance & {
        exports: { memory: WebAssembly.Memory; _start: () => unknown };
      },
    );
  } catch (error) {
    return {
      status: "runtime_error",
      stdout,
      stderr: error instanceof Error ? error.message : "Program execution failed",
    };
  }

  return {
    status: "success",
    stdout,
    stderr,
  };
}

export async function preloadToolchain(toolchainBase: string): Promise<void> {
  await Promise.all(
    ["sysroot.tar", "clang.wasm", "lld.wasm"].map(async (file) => {
      const response = await fetch(`${toolchainBase}/${file}`);
      if (!response.ok) {
        throw new Error(`Failed to preload ${file}`);
      }
      await response.arrayBuffer();
    }),
  );
}
