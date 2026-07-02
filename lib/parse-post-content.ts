export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "image"; alt: string; src: string }
  | { type: "video"; title: string; src: string };

const imagePattern = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const videoPattern = /^::video\[([^\]]*)\]\(([^)]+)\)$/;
const videoUrlPattern = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;

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

export function parsePostContent(content: string): ContentBlock[] {
  return content
    .split("\n\n")
    .map((block) => block.trim())
    .filter(Boolean)
    .map(parseBlock);
}
