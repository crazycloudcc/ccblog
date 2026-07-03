export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "image"; alt: string; src: string }
  | { type: "video"; title: string; src: string }
  | { type: "code"; text: string; language?: string };

const imagePattern = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const videoPattern = /^::video\[([^\]]*)\]\(([^)]+)\)$/;
const videoUrlPattern = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;
const fencedCodePattern = /```(\w*)\n?([\s\S]*?)```/g;

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
  return text
    .split("\n\n")
    .map((block) => block.trim())
    .filter(Boolean)
    .map(parseBlock);
}

export function parsePostContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(fencedCodePattern)) {
    const index = match.index ?? 0;
    const before = content.slice(lastIndex, index).trim();

    if (before) {
      blocks.push(...parseTextBlocks(before));
    }

    blocks.push({
      type: "code",
      language: match[1] || undefined,
      text: match[2].replace(/\n$/, ""),
    });

    lastIndex = index + match[0].length;
  }

  const tail = content.slice(lastIndex).trim();
  if (tail) {
    blocks.push(...parseTextBlocks(tail));
  }

  return blocks;
}
