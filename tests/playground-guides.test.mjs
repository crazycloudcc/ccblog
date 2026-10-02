import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, {
  jsx: { runtime: "automatic" },
  alias: { "@": fileURLToPath(new URL("..", import.meta.url)) },
});
const { getPostBySlug, getIndexedPosts } = await jiti.import("../lib/posts.ts");
const { PostContent } = await jiti.import("../components/blog/PostContent.tsx");
const { OutputPanel } = await jiti.import("../components/playground/OutputPanel.tsx");
const { createPostMetadata } = await jiti.import("../lib/metadata.ts");

test("the playground tour opens with a usable link to the clean tool route", async () => {
  const post = getPostBySlug("playground");
  const introduction = post.content.split("## How it runs")[0];
  const html = renderToStaticMarkup(await PostContent({ content: introduction }));
  assert.match(html, /<a href="\/playground"[^>]*>Open the C\/C\+\+ Playground<\/a>/);
  assert.ok(html.includes("C11 or C++17"));
  assert.equal(post.index, false);
  assert.equal(getIndexedPosts().some((item) => item.slug === post.slug), false);
  const metadata = createPostMetadata(post);
  assert.deepEqual(metadata.robots, { index: false, follow: true });
  assert.match(metadata.alternates.canonical, /\/blog\/playground$/);
});

test("both indexed input guides quote the rendered timeout guidance accurately", () => {
  const html = renderToStaticMarkup(createElement(OutputPanel, {
    compileOutput: "", stdout: "", stderr: "Execution timed out after 5 seconds.",
    status: "timeout", timing: null, metadata: null, metrics: null, diagnostics: [],
  }));
  for (const slug of ["liulanqi-bianyi-cpp", "scanf-stdin"]) {
    const post = getPostBySlug(slug);
    const quote = post.content.match(/`(\[timeout\] execution stopped[^`]+)`/)?.[1];
    assert.ok(quote, `${slug} has the timeout message`);
    assert.ok(html.includes(quote), `${slug} agrees with the actual output panel`);
    assert.doesNotMatch(post.content, /blocking stdin reads|waiting for stdin/);
  }
});
