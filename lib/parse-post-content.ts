export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "image"; alt: string; src: string }
  | { type: "video"; title: string; src: string }
  | { type: "code"; text: string; language?: string }
  | {
      type: "annotate";
      title?: string;
      code: string;
      language?: string;
      notes: { line: number; text: string }[];
    }
  | {
      type: "steps";
      title?: string;
      code: string;
      language?: string;
      steps: { label: string; line: number }[];
    }
  | {
      type: "cases";
      title?: string;
      language?: string;
      cases: { label: string; code: string }[];
    }
  | {
      type: "trace";
      title?: string;
      phases: { name: string; durationMs: number }[];
      stdout?: string;
    }
  | {
      type: "bench";
      title?: string;
      rows: { variant: string; timeMs: number }[];
    }
  | {
      type: "playground";
      lang: "c" | "cpp";
      readonly?: boolean;
      source: string;
      stdin?: string;
      title?: string;
    };

const imagePattern = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const videoPattern = /^::video\[([^\]]*)\]\(([^)]+)\)$/;
const videoUrlPattern = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;
const fencedCodePattern = /```(\w*)\n?([\s\S]*?)```/g;
const directivePattern = /^:::(\w+)(?:\{([^}]*)\})?\r?\n([\s\S]*?)\r?\n:::\s*(?:\r?\n|$)/gm;

function parseDirectiveAttrs(raw?: string): Record<string, string> {
  if (!raw?.trim()) {
    return {};
  }

  const attrs: Record<string, string> = {};
  const pattern = /(\w+)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;

  for (const match of raw.matchAll(pattern)) {
    const key = match[1];
    const value = match[2] ?? match[3] ?? match[4] ?? "true";
    attrs[key] = value;
  }

  return attrs;
}

function extractFencedCode(body: string): { language?: string; code: string; rest: string } {
  const match = body.match(/```(\w*)\n?([\s\S]*?)```/);
  if (!match) {
    return { code: body.trim(), rest: "" };
  }

  const rest = body.slice((match.index ?? 0) + match[0].length).trim();
  return {
    language: match[1] || undefined,
    code: match[2].replace(/\n$/, ""),
    rest,
  };
}

function parseLineNotes(rest: string): { line: number; text: string }[] {
  const notes: { line: number; text: string }[] = [];

  for (const line of rest.split("\n")) {
    const trimmed = line.trim();
    const bulletMatch = trimmed.match(/^-\s*line\s+(\d+)\s*:\s*(.+)$/i);
    if (bulletMatch) {
      notes.push({ line: Number(bulletMatch[1]), text: bulletMatch[2].trim() });
    }
  }

  return notes;
}

function parseSteps(rest: string): { label: string; line: number }[] {
  const steps: { label: string; line: number }[] = [];

  for (const line of rest.split("\n")) {
    const trimmed = line.trim();
    const numbered = trimmed.match(/^\d+\.\s+(.+?)(?:\s+\(line\s+(\d+)\))?$/i);
    if (numbered) {
      steps.push({
        label: numbered[1].trim(),
        line: numbered[2] ? Number(numbered[2]) : steps.length + 1,
      });
    }
  }

  return steps;
}

function parseCases(body: string, defaultLanguage?: string): { label: string; code: string }[] {
  const cases: { label: string; code: string }[] = [];
  const sections = body.split(/^###\s+/m).filter(Boolean);

  for (const section of sections) {
    const [headerLine, ...restLines] = section.split("\n");
    const label = headerLine.trim();
    const sectionBody = restLines.join("\n").trim();
    const extracted = extractFencedCode(sectionBody);
    cases.push({ label, code: extracted.code });
  }

  if (cases.length > 0) {
    return cases;
  }

  const labelSections = body.split(/^(\w[\w-]*):\s*$/m).filter(Boolean);
  for (let index = 0; index < labelSections.length; index += 2) {
    const label = labelSections[index]?.trim();
    const sectionBody = labelSections[index + 1]?.trim();
    if (!label || !sectionBody) {
      continue;
    }
    const extracted = extractFencedCode(sectionBody);
    cases.push({ label, code: extracted.code });
  }

  if (cases.length === 0 && defaultLanguage) {
    const extracted = extractFencedCode(body);
    if (extracted.code) {
      cases.push({ label: "code", code: extracted.code });
    }
  }

  return cases;
}

function parseDurationMs(value: string): number | null {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*ms$/i);
  return match ? Math.round(Number(match[1])) : null;
}

function parseTraceBody(body: string): { phases: { name: string; durationMs: number }[]; stdout?: string } {
  const phases: { name: string; durationMs: number }[] = [];
  let stdout: string | undefined;
  let inStdout = false;
  const stdoutLines: string[] = [];

  for (const line of body.split("\n")) {
    if (inStdout) {
      stdoutLines.push(line);
      continue;
    }

    const stdoutMatch = line.match(/^stdout:\s*\|\s*$/i);
    if (stdoutMatch) {
      inStdout = true;
      continue;
    }

    const phaseMatch = line.match(/^([\w-]+):\s*(.+)$/);
    if (phaseMatch) {
      const durationMs = parseDurationMs(phaseMatch[2]);
      if (durationMs !== null) {
        phases.push({ name: phaseMatch[1], durationMs });
      }
    }
  }

  if (stdoutLines.length > 0) {
    stdout = stdoutLines.join("\n").trim();
  }

  return { phases, stdout };
}

function parseBenchBody(body: string): { variant: string; timeMs: number }[] {
  const rows: { variant: string; timeMs: number }[] = [];

  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || trimmed.includes("---")) {
      continue;
    }

    const cells = trimmed
      .split("|")
      .map((cell) => cell.trim())
      .filter(Boolean);

    if (cells.length < 2 || cells[0].toLowerCase() === "variant") {
      continue;
    }

    const durationMs = parseDurationMs(cells[1]);
    if (durationMs !== null) {
      rows.push({ variant: cells[0], timeMs: durationMs });
    }
  }

  return rows;
}

function parseDirective(name: string, attrsRaw: string | undefined, body: string): ContentBlock | null {
  const attrs = parseDirectiveAttrs(attrsRaw);

  switch (name) {
    case "annotate": {
      const extracted = extractFencedCode(body);
      return {
        type: "annotate",
        title: attrs.title,
        language: extracted.language,
        code: extracted.code,
        notes: parseLineNotes(extracted.rest),
      };
    }

    case "steps": {
      const extracted = extractFencedCode(body);
      return {
        type: "steps",
        title: attrs.title,
        language: extracted.language,
        code: extracted.code,
        steps: parseSteps(extracted.rest),
      };
    }

    case "cases": {
      const extracted = extractFencedCode(body);
      return {
        type: "cases",
        title: attrs.title,
        language: extracted.language,
        cases: parseCases(body, extracted.language),
      };
    }

    case "trace": {
      const parsed = parseTraceBody(body);
      return {
        type: "trace",
        title: attrs.title,
        phases: parsed.phases,
        stdout: parsed.stdout,
      };
    }

    case "bench": {
      return {
        type: "bench",
        title: attrs.title,
        rows: parseBenchBody(body),
      };
    }

    case "playground": {
      const extracted = extractFencedCode(body);
      const lang = attrs.lang === "c" ? "c" : "cpp";
      return {
        type: "playground",
        lang,
        readonly: attrs.readonly === "true" || attrs.readonly === "1",
        source: extracted.code,
        stdin: attrs.stdin,
        title: attrs.title,
      };
    }

    default:
      return null;
  }
}

function parseBlock(block: string): ContentBlock {
  const trimmed = block.trim();

  if (trimmed.startsWith("## ")) {
    return { type: "heading", text: trimmed.slice(3) };
  }

  if (trimmed.startsWith("- ")) {
    return {
      type: "ul",
      items: trimmed.split("\n").filter(Boolean).map((item) => item.replace(/^- /, "")),
    };
  }

  if (/^\d+\.\s/.test(trimmed)) {
    return {
      type: "ol",
      items: trimmed
        .split("\n")
        .filter(Boolean)
        .map((item) => item.replace(/^\d+\.\s/, "")),
    };
  }

  const videoMatch = trimmed.match(videoPattern);
  if (videoMatch) {
    return { type: "video", title: videoMatch[1], src: videoMatch[2] };
  }

  const imageMatch = trimmed.match(imagePattern);
  if (imageMatch) {
    const [, alt, src] = imageMatch;
    if (alt.toLowerCase() === "video" || videoUrlPattern.test(src)) {
      return { type: "video", title: alt === "video" ? "" : alt, src };
    }
    return { type: "image", alt, src };
  }

  return { type: "paragraph", text: trimmed };
}

function parseTextBlocks(text: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(fencedCodePattern)) {
    const index = match.index ?? 0;
    const before = text.slice(lastIndex, index).trim();

    if (before) {
      blocks.push(
        ...before
          .split("\n\n")
          .map((block) => block.trim())
          .filter(Boolean)
          .map(parseBlock),
      );
    }

    blocks.push({
      type: "code",
      language: match[1] || undefined,
      text: match[2].replace(/\n$/, ""),
    });

    lastIndex = index + match[0].length;
  }

  const tail = text.slice(lastIndex).trim();
  if (tail) {
    blocks.push(
      ...tail
        .split("\n\n")
        .map((block) => block.trim())
        .filter(Boolean)
        .map(parseBlock),
    );
  }

  return blocks;
}

export function parsePostContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(directivePattern)) {
    const index = match.index ?? 0;
    const before = content.slice(lastIndex, index).trim();

    if (before) {
      blocks.push(...parseTextBlocks(before));
    }

    const directive = parseDirective(match[1], match[2], match[3]);
    if (directive) {
      blocks.push(directive);
    } else {
      blocks.push({ type: "paragraph", text: match[0].trim() });
    }

    lastIndex = index + match[0].length;
  }

  const tail = content.slice(lastIndex).trim();
  if (tail) {
    blocks.push(...parseTextBlocks(tail));
  }

  return blocks;
}
