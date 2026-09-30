import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, {
  jsx: { runtime: "automatic" },
  alias: { "@": fileURLToPath(new URL("..", import.meta.url)) },
});
const { default: Page, generateMetadata } = await jiti.import("../app/playground/page.tsx");
const props = (params = {}) => ({ searchParams: Promise.resolve(params) });

test("playground metadata names both languages and keeps the clean canonical", async () => {
  const metadata = await generateMetadata(props());
  assert.match(metadata.title, /C\/C\+\+ 在线编译器.*C Playground/);
  assert.match(metadata.description, /C11.*C\+\+17.*stdin/);
  assert.match(metadata.alternates.canonical, /\/playground$/);
  assert.equal(metadata.robots, undefined);
  assert.equal(metadata.openGraph.title, metadata.title);
  assert.equal(metadata.twitter.description, metadata.description);
});

test("shared and embedded playgrounds remain noindex with the same canonical", async () => {
  for (const params of [{ z: "shared-code" }, { embed: "1" }, { z: "shared-code", embed: "1" }]) {
    const metadata = await generateMetadata(props(params));
    assert.deepEqual(metadata.robots, { index: false, follow: true });
    assert.match(metadata.alternates.canonical, /\/playground$/);
    const page = await Page(props(params));
    assert.equal(page.props.children[0], null);
  }
});

test("server-rendered introduction explains supported use and links existing guides", async () => {
  const page = await Page(props());
  const html = renderToStaticMarkup(page.props.children[0]);
  assert.match(html, /<h1[^>]*>C\/C\+\+ 在线编译器<\/h1>/);
  for (const text of ["C Playground", "C11", "C++17", "stdin", "不能追加输入", "5 秒", "不支持异常", "WebAssembly"]) {
    assert.ok(html.includes(text), text);
  }
  for (const slug of ["liulanqi-bianyi-cpp", "scanf-stdin", "clang-diagnostics"]) {
    assert.ok(html.includes(`href="/blog/${slug}"`), slug);
  }
});
