import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { alias: { "@": fileURLToPath(new URL("..", import.meta.url)) } });
const { templates } = await jiti.import("../lib/playground/templates.ts");
const { buildPlaygroundShareUrl, buildPlaygroundSharePath, buildPlaygroundEmbedUrl, decodeSharePayload } = await jiti.import("../lib/playground/share.ts");

async function roundtrip(payload, build = buildPlaygroundShareUrl) {
  const url = new URL(await build(payload, "https://preview.example"));
  const decoded = await decodeSharePayload(url.searchParams);
  assert.ok(decoded);
  assert.equal(decoded.lang, payload.lang);
  assert.equal(decoded.source, payload.source);
  assert.equal(decoded.stdin, payload.stdin);
  assert.equal(decoded.readonly, payload.readonly ?? false);
  return { url, decoded };
}

test("each small example roundtrips with its sample stdin and readonly", { timeout: 10000 }, async () => {
  for (const [lang, examples] of Object.entries(templates)) {
    for (const example of examples) {
      await roundtrip({ lang, source: example.source, stdin: example.sampleStdin, readonly: true });
    }
  }
});

const shareBuilders = [
  ["URL", buildPlaygroundShareUrl],
  ["embed", buildPlaygroundEmbedUrl],
  ["relative path", buildPlaygroundSharePath],
];

for (const [name, build] of shareBuilders) {
  test(`${name} roundtrips whitespace-only stdin and surrounding whitespace`, async () => {
    for (const stdin of [" ", "\n", "\t\r\n", "\n\n", "  42\t\r\n", "\u00a0\u3000"]) {
      const payload = { lang: "c", source: "int main(void) { return 0; }", stdin };
      const url = new URL(await build(payload, "https://preview.example"), "https://preview.example");
      assert.equal(url.searchParams.has("in"), true, `${name}: ${JSON.stringify(stdin)}`);
      const decoded = await decodeSharePayload(url.searchParams);
      assert.ok(decoded);
      assert.equal(decoded.stdin, stdin, `${name}: ${JSON.stringify(stdin)}`);
    }
  });

  test(`${name} preserves leading, repeated, and internal BOM characters in source and stdin`, async () => {
    for (const text of ["\uFEFF", "\uFEFF42\n", "\uFEFF\uFEFF42", "a\uFEFFb", "\n\uFEFF42"]) {
      const payload = { lang: "c", source: text, stdin: text, readonly: true };
      const url = new URL(await build(payload, "https://preview.example"), "https://preview.example");
      const decoded = await decodeSharePayload(url.searchParams);
      assert.ok(decoded);
      assert.equal(decoded.source, text, `${name} source: ${JSON.stringify(text)}`);
      assert.equal(decoded.stdin, text, `${name} stdin: ${JSON.stringify(text)}`);
      assert.equal(decoded.readonly, true);
    }
  });

  test(`${name} keeps empty and omitted stdin absent from the URL`, async () => {
    for (const input of [{}, { stdin: undefined }, { stdin: "" }]) {
      const payload = { lang: "c", source: "int main(void) { return 0; }", ...input };
      const url = new URL(await build(payload, "https://preview.example"), "https://preview.example");
      assert.equal(url.searchParams.has("in"), false);
      const decoded = await decodeSharePayload(url.searchParams);
      assert.ok(decoded);
      assert.equal(decoded.stdin, undefined);
    }
  });
}

test("large compressible code and stdin roundtrip without stream backpressure deadlock", { timeout: 10000 }, async () => {
  await roundtrip({
    lang: "cpp",
    source: "// 大输入 regression\n".repeat(20000) + "int main() { return 0; }",
    stdin: "42 你好\n".repeat(20000),
    readonly: true,
  });
});

test("embed and relative paths preserve payload flags, title, id, and current origin", async () => {
  const payload = { lang: "c", source: templates.c[1].source, stdin: "3 4\n", readonly: true, title: "只读 示例", id: "sample-c" };
  const { url, decoded } = await roundtrip(payload, buildPlaygroundEmbedUrl);
  assert.equal(url.origin, "https://preview.example");
  assert.equal(url.searchParams.get("embed"), "1");
  assert.equal(url.searchParams.get("readonly"), "1");
  assert.equal(decoded.title, payload.title);
  assert.equal(decoded.id, payload.id);
  const path = await buildPlaygroundSharePath(payload);
  assert.ok(path.startsWith("/playground?"));
  assert.deepEqual(await decodeSharePayload(new URL(path, "https://another-preview.example").searchParams), decoded);
});

test("existing gzip/base64url links remain compatible including readonly and embed", async () => {
  const source = "#include <stdio.h>\nint main(void) { puts(\"旧链接\"); }";
  const stdin = "3 4\n";
  const params = new URLSearchParams({
    lang: "c", z: gzipSync(source).toString("base64url"), in: gzipSync(stdin).toString("base64url"),
    readonly: "1", embed: "1",
  });
  const decoded = await decodeSharePayload(params);
  assert.equal(decoded.source, source);
  assert.equal(decoded.stdin, stdin);
  assert.equal(decoded.readonly, true);
});

test("invalid or damaged payloads return null instead of leaving decoding pending", { timeout: 10000 }, async () => {
  for (const query of ["", "lang=rust&z=abc", "lang=cpp&z=%%%", "lang=c&z=YWJj", `lang=cpp&z=${gzipSync("hello").toString("base64url")}&in=YWJj`]) {
    assert.equal(await decodeSharePayload(new URLSearchParams(query)), null);
  }
});

test("legacy gzip/base64url payloads retain leading BOM in both fields", async () => {
  const source = "\uFEFF#include <stdio.h>\nint main(void) { return 0; }";
  const stdin = "\uFEFF42\n";
  const params = new URLSearchParams({
    lang: "c", z: gzipSync(source).toString("base64url"), in: gzipSync(stdin).toString("base64url"),
    readonly: "1", embed: "1",
  });
  const decoded = await decodeSharePayload(params);
  assert.ok(decoded);
  assert.equal(decoded.source, source);
  assert.equal(decoded.stdin, stdin);
  assert.equal(decoded.readonly, true);
});
