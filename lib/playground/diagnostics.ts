export type CompileDiagnostic = {
  file: string;
  line: number;
  column?: number;
  message: string;
  raw: string;
  hints: string[];
};

const ERROR_LINE =
  /^(?:[^:]+:\/)?([^:\s]+):(\d+):(\d+):\s*(error|fatal error):\s*(.+)$/;

export function lookupErrorHints(message: string): string[] {
  const hints: string[] = [];
  const lower = message.toLowerCase();

  if (lower.includes("undefined reference")) {
    hints.push("Check that all functions are declared before use and linked correctly.");
  }
  if (lower.includes("expected ';'")) {
    hints.push("A semicolon may be missing at the end of the previous statement.");
  }
  if (lower.includes("no member named")) {
    hints.push("Verify the class or struct has that member; check #include headers.");
  }
  if (lower.includes("iostream") && lower.includes("file not found")) {
    hints.push("C++ standard headers require compiling as C++ (clang++), not C.");
  }
  if (lower.includes("use of undeclared identifier")) {
    hints.push("Declare the variable or include the header that defines it.");
  }
  if (lower.includes("cannot convert")) {
    hints.push("Check types on both sides of the assignment or function call.");
  }
  if (lower.includes("expected unqualified-id")) {
    hints.push("Look for a stray token, missing brace, or macro issue near this line.");
  }
  if (lower.includes("main must return")) {
    hints.push("Ensure main() returns int (C++) or int/void (C) as required.");
  }
  if (lower.includes("with exceptions disabled")) {
    hints.push("WASI has no C++ exception runtime, so throw/try/catch are disabled. Rework with return codes or std::optional.");
  }

  return hints;
}

export function parseCompileDiagnostics(
  compileOutput: string,
  defaultFile: string,
): CompileDiagnostic[] {
  const diagnostics: CompileDiagnostic[] = [];
  const seen = new Set<string>();

  for (const line of compileOutput.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const match = trimmed.match(ERROR_LINE);
    if (!match) {
      continue;
    }

    const [, fileRaw, lineRaw, columnRaw, severity, messageRaw] = match;
    if (severity !== "error" && severity !== "fatal error") {
      continue;
    }

    const file = fileRaw || defaultFile;
    const lineNumber = Number(lineRaw);
    const message = messageRaw.trim();
    const key = `${file}:${lineNumber}:${message}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    diagnostics.push({
      file,
      line: lineNumber,
      column: Number(columnRaw),
      message,
      raw: trimmed,
      hints: lookupErrorHints(message),
    });
  }

  return diagnostics;
}

/** @deprecated Use parseCompileDiagnostics */
export function parseCompileErrorLine(compileOutput: string, fileName: string): number | null {
  const first = parseCompileDiagnostics(compileOutput, fileName)[0];
  return first?.line ?? null;
}
