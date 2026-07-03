export function parseCompileErrorLine(compileOutput: string, fileName: string): number | null {
  const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const specific = new RegExp(`${escaped}:(\\d+):\\d+:`, "m");
  const specificMatch = compileOutput.match(specific);

  if (specificMatch) {
    return Number(specificMatch[1]);
  }

  const generic = compileOutput.match(/:(\d+):\d+:\s*error:/m);
  return generic ? Number(generic[1]) : null;
}
