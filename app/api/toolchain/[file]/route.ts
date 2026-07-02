import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  GITHUB_REPO,
  TOOLCHAIN_FILES,
  TOOLCHAIN_TAG,
  type ToolchainFile,
} from "@/lib/playground/toolchain";

const MIME_TYPES: Record<ToolchainFile, string> = {
  "clang.wasm": "application/wasm",
  "lld.wasm": "application/wasm",
  "sysroot.tar": "application/x-tar",
  "stdc++.h.pch": "application/octet-stream",
};

function isToolchainFile(file: string): file is ToolchainFile {
  return (TOOLCHAIN_FILES as readonly string[]).includes(file);
}

async function readLocalToolchainFile(file: ToolchainFile): Promise<Buffer> {
  const localPath = path.join(process.cwd(), "node_modules/browsercc/dist", file);
  return readFile(localPath);
}

async function readGithubToolchainFile(file: ToolchainFile): Promise<Buffer | null> {
  const url = `https://github.com/${GITHUB_REPO}/releases/download/${TOOLCHAIN_TAG}/${file}`;
  const response = await fetch(url, { redirect: "follow" });

  if (!response.ok) {
    return null;
  }

  return Buffer.from(await response.arrayBuffer());
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ file: string }> },
) {
  const { file } = await context.params;

  if (!isToolchainFile(file)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const githubFile = await readGithubToolchainFile(file);
    const payload = githubFile ?? (await readLocalToolchainFile(file));

    return new Response(new Uint8Array(payload), {
      headers: {
        "Content-Type": MIME_TYPES[file],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Toolchain file unavailable", { status: 503 });
  }
}

export async function HEAD(
  request: Request,
  context: { params: Promise<{ file: string }> },
) {
  const response = await GET(request, context);
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  });
}
