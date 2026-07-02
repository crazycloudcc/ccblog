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
    flags: ["-std=c++17", "-Wall", "-O0"],
  };
}
