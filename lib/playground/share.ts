import type { PlaygroundLanguage } from "@/lib/playground/types";

export type PlaygroundSharePayload = {
  lang: PlaygroundLanguage;
  source: string;
  stdin?: string;
  readonly?: boolean;
  title?: string;
  id?: string;
};

const MAX_SHARE_URL_LENGTH = 7500;

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function gzipText(text: string): Promise<Uint8Array> {
  const input = new TextEncoder().encode(text);
  const stream = new CompressionStream("gzip");
  const writer = stream.writable.getWriter();
  await writer.write(input);
  await writer.close();
  const buffer = await new Response(stream.readable).arrayBuffer();
  return new Uint8Array(buffer);
}

async function gunzipText(bytes: Uint8Array): Promise<string> {
  const stream = new DecompressionStream("gzip");
  const writer = stream.writable.getWriter();
  const payload = new Uint8Array(bytes);
  await writer.write(payload);
  await writer.close();
  const buffer = await new Response(stream.readable).arrayBuffer();
  return new TextDecoder().decode(buffer);
}

async function encodeParam(text: string): Promise<string> {
  return bytesToBase64Url(await gzipText(text));
}

async function decodeParam(value: string): Promise<string> {
  return gunzipText(base64UrlToBytes(value));
}

export async function buildPlaygroundShareUrl(
  payload: PlaygroundSharePayload,
  origin = typeof window === "undefined" ? "https://crazycloud.cc" : window.location.origin,
): Promise<string> {
  const url = new URL("/playground", origin);
  url.searchParams.set("lang", payload.lang);
  url.searchParams.set("z", await encodeParam(payload.source));

  if (payload.stdin?.trim()) {
    url.searchParams.set("in", await encodeParam(payload.stdin));
  }

  if (payload.readonly) {
    url.searchParams.set("readonly", "1");
  }

  if (payload.title?.trim()) {
    url.searchParams.set("title", payload.title.trim());
  }

  if (payload.id?.trim()) {
    url.searchParams.set("id", payload.id.trim());
  }

  const href = url.toString();
  if (href.length > MAX_SHARE_URL_LENGTH) {
    throw new Error("Share link is too long. Try shortening your code or stdin.");
  }

  return href;
}

/** Path + query only, so embeds work on preview hosts and localhost. */
export async function buildPlaygroundSharePath(payload: PlaygroundSharePayload): Promise<string> {
  const url = new URL(await buildPlaygroundShareUrl(payload, "https://ccblog.local"));
  return `${url.pathname}${url.search}`;
}

export async function buildPlaygroundEmbedUrl(
  payload: PlaygroundSharePayload,
  origin = typeof window === "undefined" ? "https://crazycloud.cc" : window.location.origin,
): Promise<string> {
  const url = new URL(await buildPlaygroundShareUrl(payload, origin));
  url.searchParams.set("embed", "1");
  return url.toString();
}

export async function decodeSharePayload(
  params: URLSearchParams,
): Promise<PlaygroundSharePayload | null> {
  const lang = params.get("lang");
  const compressed = params.get("z");

  if (!lang || !compressed || (lang !== "c" && lang !== "cpp")) {
    return null;
  }

  try {
    const source = await decodeParam(compressed);
    const stdinParam = params.get("in");
    const stdin = stdinParam ? await decodeParam(stdinParam) : undefined;

    return {
      lang,
      source,
      stdin,
      readonly: params.get("readonly") === "1",
      title: params.get("title") ?? undefined,
      id: params.get("id") ?? undefined,
    };
  } catch {
    return null;
  }
}

export function hasShareParams(params: URLSearchParams): boolean {
  return params.has("z") && params.has("lang");
}
