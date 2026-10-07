import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
const jiti = createJiti(import.meta.url, { jsx: { runtime: "automatic" }, alias: { "@": fileURLToPath(new URL("..", import.meta.url)) } });
const docs = await jiti.import("../lib/ai-docs.ts");
const { SITE_URL, features } = await jiti.import("../lib/site.ts");
const { buildAiReadingPrompt, copyAiReadingPrompt } = await jiti.import("../lib/ai-reading-prompt.ts");
const { GET: indexGET } = await jiti.import("../app/llms.txt/route.ts");
const { GET: docGET, generateStaticParams } = await jiti.import("../app/blog/[slug]/index.md/route.ts");
const { AiReadingPrompt } = await jiti.import("../components/blog/AiReadingPrompt.tsx");

test("curated index is small and all entries resolve to original public notes", () => {
  const index = docs.renderLlmsIndex();
  assert.ok(Buffer.byteLength(index) < 4000);
  assert.equal((index.match(/^- \[/gm) ?? []).length, 5);
  assert.match(index, /不改变抓取、训练/);
  for (const slug of docs.AI_DOC_SLUGS) {
    const post = docs.getAiDoc(slug);
    assert.equal(post.index, true);
    assert.ok(index.includes(`${SITE_URL}${docs.aiDocPath(slug)}`));
    const md = docs.renderAiDoc(post);
    assert.ok(md.includes(docs.plainPostMarkdown(post.content)));
    assert.ok(md.includes(`${SITE_URL}/blog/${slug}`));
    assert.doesNotMatch(md, /^:::/m);
  }
  for (const slug of ["playground", "hello-world", "../README", "absent"]) assert.equal(docs.getAiDoc(slug), undefined);
});

test("exports preserve fenced code and resolve root-relative prose links", () => {
  const input = ':::playground{title="test" stdin="42\\n"}\n```cpp\n// [raw](/keep)\n:::literal\n```\n:::\n[guide](/blog/scanf-stdin)';
  const md = docs.plainPostMarkdown(input);
  assert.ok(md.includes('```cpp\n// [raw](/keep)\n:::literal\n```'));
  assert.ok(md.includes(`[guide](${SITE_URL}/blog/scanf-stdin)`));
  assert.ok(md.startsWith('### test\n'));
  assert.ok(md.includes('示例 stdin（转义表示）: `42\\n`'));
});

test("route responses use correct UTF-8 types, canonical source, and bounded params", async () => {
  const index = indexGET();
  assert.equal(index.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.equal(await index.text(), docs.renderLlmsIndex());
  assert.equal(generateStaticParams().length, 3);
  for (const slug of docs.AI_DOC_SLUGS) {
    const res = await docGET(new Request("https://example.com"), { params: Promise.resolve({ slug }) });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("content-type"), "text/markdown; charset=utf-8");
    assert.ok(res.headers.get("link").includes('rel="canonical"'));
    assert.equal(await res.text(), docs.renderAiDoc(docs.getAiDoc(slug)));
  }
  assert.equal((await docGET(new Request("https://example.com"), { params: Promise.resolve({ slug: "playground" }) })).status, 404);
});

test("disabled features expose no selected note bodies", () => {
  for (const key of ["blog", "playground"]) {
    const old = features[key];
    try {
      features[key] = false;
      assert.equal(docs.getAiDoc(docs.AI_PROMPT_SLUG), undefined);
      assert.deepEqual(generateStaticParams(), []);
      assert.doesNotMatch(docs.renderLlmsIndex(), /\/blog\/[^\s]+\/index\.md/);
    } finally { features[key] = old; }
  }
});

test("prompt is deterministic public reading guidance and has accessible manual fallback", () => {
  const article = `${SITE_URL}/blog/${docs.AI_PROMPT_SLUG}`;
  const md = `${SITE_URL}${docs.aiDocPath(docs.AI_PROMPT_SLUG)}`;
  const prompt = buildAiReadingPrompt(article, md);
  assert.match(prompt, /引用原文链接/);
  assert.match(prompt, /明确说不知道/);
  assert.doesNotMatch(prompt, /\?z=|stdin=|chatgpt.com|localStorage/);
  const html = renderToStaticMarkup(createElement(AiReadingPrompt, { prompt, markdownUrl: md }));
  assert.match(html, /role="status"/);
  assert.match(html, /<textarea[^>]*readOnly/);
  assert.match(html, /<summary/);
  assert.match(html, /不含编辑器代码或 stdin/);
});

test("clipboard success, repeated copies, and denied writes report their actual outcome", async () => {
  const calls = [];
  for (let i = 0; i < 2; i++) assert.match(await copyAiReadingPrompt("public prompt", async (text) => { calls.push(text); }), /^已复制/);
  assert.deepEqual(calls, ["public prompt", "public prompt"]);
  assert.match(await copyAiReadingPrompt("public prompt", async () => { throw new Error("denied"); }), /^复制未成功/);
});
