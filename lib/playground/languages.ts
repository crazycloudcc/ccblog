import type { PlaygroundLanguage } from "@/lib/playground/types";

export type LanguageConfig = {
  fileName: string;
  compilerProgram: "clang" | "clang++";
  monacoLanguage: string;
  flags: string[];
};

export function getLanguageConfig(language: PlaygroundLanguage): LanguageConfig {
  if (language === "c") {
    return {
      fileName: "main.c",
      compilerProgram: "clang",
      monacoLanguage: "c",
      flags: ["-std=c11", "-Wall", "-O0"],
    };
  }

  return {
    fileName: "main.cpp",
    compilerProgram: "clang++",
    monacoLanguage: "cpp",
    // -fno-exceptions: browsercc is a WASI toolchain with no C++ EH runtime,
    // so __cxa_allocate_exception/__cxa_throw are unavailable. Anything that
    // can throw (std::vector alloc, std::regex, explicit throw/try/catch) would
    // otherwise fail at link time with "undefined symbol: __cxa_*".
    flags: ["-std=c++17", "-Wall", "-O0", "-fno-exceptions"],
  };
}
