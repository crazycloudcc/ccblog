import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, {
  jsx: { runtime: "automatic" },
  alias: { "@": fileURLToPath(new URL("..", import.meta.url)) },
});
const { default: Link } = await jiti.import("next/link");
const { QuickStartLink } = await jiti.import("../components/playground/QuickStartLink.tsx");
const { quickStartExamples } = await jiti.import("../lib/playground/quick-start.ts");
const { templates } = await jiti.import("../lib/playground/templates.ts");
const { QuickStartExamples } = await jiti.import("../components/playground/QuickStartExamples.tsx");
const { default: Page } = await jiti.import("../app/playground/page.tsx");
const { decodeSharePayload } = await jiti.import("../lib/playground/share.ts");
const { compileSource, runModule } = await jiti.import("../lib/playground/compile-run.ts");

function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== "object") return [];
  return [node, ...elements(node.props?.children)];
}

test("quick-start examples use the editor's exact source and input", () => {
  assert.equal(quickStartExamples.length, 3);
  assert.deepEqual(quickStartExamples.map(({ label }) => label), ["hello.c", "a+b.c", "sort.cpp"]);
  for (const example of quickStartExamples) {
    const template = templates[example.language].find(({ label }) => label === example.label);
    assert.equal(example.source, template.source);
    assert.equal(example.stdin, template.sampleStdin ?? "");
  }
});

test("SSR gallery exposes code, stdin, stdout and safe host-relative runnable links", async () => {
  const gallery = await QuickStartExamples();
  const html = renderToStaticMarkup(gallery);
  assert.match(html, /id="quick-start"/);
  assert.match(html, /Run your first program/);
  assert.match(html, /saved code and input intact/);
  assert.equal((html.match(/<article/g) ?? []).length, 3);
  const links = elements(gallery).filter(({ props }) => props?.href);
  assert.equal(links.length, 3);
  for (const [index, link] of links.entries()) {
    assert.ok(link.props.href.startsWith("/playground?"));
    assert.equal(link.props.prefetch, false);
    const payload = await decodeSharePayload(new URL(link.props.href, "https://preview.example").searchParams);
    const example = quickStartExamples[index];
    assert.equal(payload.lang, example.language);
    assert.equal(payload.source, example.source);
    assert.equal(payload.stdin ?? "", example.stdin);
    assert.equal(payload.readonly, true);
    assert.equal(payload.title, example.title);
    assert.ok(html.includes(example.label));
  }
});

test("only the ordinary landing page includes quick-start content and its jump link", async () => {
  const page = await Page({ searchParams: Promise.resolve({}) });
  assert.match(renderToStaticMarkup(page.props.children[0]), /href="#quick-start"/);
  assert.ok(elements(page.props.children[0]).some(({ type }) => type === QuickStartLink));
  const jump = QuickStartLink();
  // Native fragment anchors leave App Router history stale when returning from a shared example.
  assert.equal(jump.type, Link);
  assert.equal(jump.props.prefetch, false);
  assert.match(renderToStaticMarkup(page.props.children[2]), /Run your first program/);
  for (const params of [{ z: "payload" }, { embed: "1" }, { z: "payload", embed: "1" }]) {
    const embedded = await Page({ searchParams: Promise.resolve(params) });
    assert.equal(embedded.props.children[2], null);
  }
});

test("every advertised output is produced by the bundled clang and WASI runtime", async () => {
  const toolchainBase = fileURLToPath(new URL("../node_modules/browsercc/dist", import.meta.url));
  const sysroot = await readFile(`${toolchainBase}/sysroot.tar`);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert.equal(url, `${toolchainBase}/sysroot.tar`);
    return new Response(sysroot);
  };
  try {
    for (const example of quickStartExamples) {
      const compiled = await compileSource(toolchainBase, example.language, example.source);
      assert.ok(compiled.module, compiled.compileOutput);
      const result = await runModule(compiled.module, example.stdin);
      assert.equal(result.status, "success", example.label);
      assert.equal(result.exitCode, 0, example.label);
      assert.equal(result.stdout, example.expectedOutput, example.label);
      assert.equal(result.stderr, "", example.label);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});


test("repeated quick-start clicks still scroll when the URL already has the fragment", () => {
  const previousDocument = globalThis.document;
  let calls = 0;
  globalThis.document = {
    getElementById(id) {
      assert.equal(id, "quick-start");
      return { scrollIntoView() { calls++; } };
    },
  };
  try {
    const jump = QuickStartLink();
    jump.props.onNavigate();
    jump.props.onNavigate();
    assert.equal(calls, 2);
    globalThis.document.getElementById = () => null;
    assert.doesNotThrow(() => jump.props.onNavigate());
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});
