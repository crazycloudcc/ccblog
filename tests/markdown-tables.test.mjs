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
const { parsePostContent } = await jiti.import("../lib/parse-post-content.ts");
const { PostContent } = await jiti.import("../components/blog/PostContent.tsx");
const render = async (content) => renderToStaticMarkup(await PostContent({ content }));

test("the real scanf article has a four-column table with accurate exit codes", async () => {
  const content = await readFile(new URL("../content/notes/scanf-stdin.md", import.meta.url), "utf8");
  const tables = parsePostContent(content).filter((block) => block.type === "table");
  assert.equal(tables.length, 1);
  assert.deepEqual(tables[0].headers, ["stdin", "stdout", "退出码", "含义"]);
  assert.deepEqual(tables[0].rows, [
    ["空", "`scanf=-1 value=0`", "1", "文件结束"],
    ["`42` 加换行", "`scanf=1 value=42`", "0", "读到整数"],
    ["`abc` 加换行", "`scanf=0 value=0`", "1", "有输入，但不是整数"],
  ]);
  assert.equal(parsePostContent(content).filter((block) => block.type === "playground").length, 2);
});

test("renders semantic headers, body cells and an accessible scroll region", async () => {
  const html = await render("| stdin | stdout | 退出码 |\n| --- | --- | --- |\n| 空 | `scanf=-1` | 1 |\n| `42` | `scanf=1` | 0 |");
  assert.equal((html.match(/<table\b/g) ?? []).length, 1);
  assert.equal((html.match(/<th\b/g) ?? []).length, 3);
  assert.equal((html.match(/<td\b/g) ?? []).length, 6);
  assert.match(html, /<thead\b/);
  assert.match(html, /<tbody>/);
  assert.match(html, /<th[^>]*scope="col"/);
  assert.match(html, /role="region"[^>]*aria-label="[^"]+"[^>]*tabindex="0"/);
  assert.match(html, /<code[^>]*>scanf=-1<\/code>/);
  assert.doesNotMatch(html, /<p[^>]*>\|/);
});

test("accepts optional outer pipes, alignment, empty and uneven rows, and CRLF", async () => {
  const content = [
    "left | center | right",
    ":--- | :---: | ---:",
    "one | | three",
    "short | row",
    "x | y | z | ignored",
  ].join("\r\n");
  const [table] = parsePostContent(content);
  assert.equal(table.type, "table");
  assert.deepEqual(table.alignments, ["left", "center", "right"]);
  assert.deepEqual(table.rows, [["one", "", "three"], ["short", "row", ""], ["x", "y", "z"]]);
  const html = await render(content);
  for (const align of ["left", "center", "right"]) {
    assert.match(html, new RegExp(`<th[^>]*style="text-align:${align}"`));
    assert.match(html, new RegExp(`<td[^>]*style="text-align:${align}"`));
  }
  assert.doesNotMatch(html, /ignored/);
});

test("escaped pipes inside text and inline code preserve cells and existing inline formatting", async () => {
  const content = [
    "| **Title** | code | link | literal |",
    "| --- | --- | --- | --- |",
    "| a\\|b | `a\\|b` | [**Guide** and `stdin`](/blog/scanf-stdin) | \\*literal\\* |",
    "| c | ``a ` b \\| c`` | *emphasis* | end |",
  ].join("\n");
  const [table] = parsePostContent(content);
  assert.equal(table.type, "table");
  assert.equal(table.headers.length, 4);
  assert.equal(table.rows[0].length, 4);
  assert.equal(table.rows[0][0], "a|b");
  const html = await render(content);
  assert.match(html, /<strong>Title<\/strong>/);
  assert.match(html, /<td[^>]*>a\|b<\/td>/);
  assert.match(html, /<code[^>]*>a\|b<\/code>/);
  assert.match(html, /<code[^>]*>a ` b \| c<\/code>/);
  assert.match(html, /<a href="\/blog\/scanf-stdin"[^>]*><strong>Guide<\/strong> and <code[^>]*>stdin<\/code><\/a>/);
  assert.match(html, /<td[^>]*>\*literal\*<\/td>/);
  assert.match(html, /<em>emphasis<\/em>/);
});

test("separates multiple tables from surrounding text and headings", () => {
  const content = "Before.\n| a | b |\n| --- | --- |\n| 1 | 2 |\n\n## After\n\nMore.\n\nname | value\n--- | ---\nx | y\n\nLast.";
  const blocks = parsePostContent(content);
  assert.deepEqual(blocks.map((block) => block.type), ["paragraph", "table", "heading", "paragraph", "table", "paragraph"]);
  assert.equal(blocks[0].text, "Before.");
  assert.equal(blocks[2].text, "After");
  assert.equal(blocks.at(-1).text, "Last.");
});

test("invalid table separators and ordinary pipe text remain paragraphs", () => {
  for (const content of ["a | b\n--- | invalid\nx | y", "a | b\n---\nx | y", "a | b\nx | y", "a | b\n--- | --- | ---\nx | y"]) {
    const blocks = parsePostContent(content);
    assert.equal(blocks.length, 1);
    assert.equal(blocks[0].type, "paragraph");
    assert.equal(blocks[0].text, content);
  }
});

test("table-like fenced code and all custom directives retain their existing blocks", async () => {
  const demo = await readFile(new URL("../content/notes/content-blocks.md", import.meta.url), "utf8");
  const blocks = parsePostContent(demo);
  for (const type of ["annotate", "steps", "cases", "trace", "bench", "playground"]) {
    assert(blocks.some((block) => block.type === type), type);
  }
  assert.deepEqual(blocks.find((block) => block.type === "bench").rows, [
    { variant: "O0", timeMs: 15 }, { variant: "O2", timeMs: 12 }, { variant: "O3", timeMs: 11 },
  ]);
  const source = "| raw | code |\n| --- | --- |\n| `x` | **y** |";
  assert.deepEqual(parsePostContent("```text\n" + source + "\n```"), [{ type: "code", language: "text", text: source }]);
});

test("table cells reuse safe inline rendering for raw HTML and unsafe links", async () => {
  const html = await render([
    "| <script>alert(1)</script> | [unsafe](javascript:alert(1)) |",
    "| --- | --- |",
    "| <img src=x onerror=alert(1)> | [file](file:///etc/passwd) |",
    "| [safe](/blog/scanf-stdin) | `<b>literal</b>` |",
  ].join("\n"));
  assert.match(html, /<table\b/);
  assert.doesNotMatch(html, /<(script|img|b)\b/);
  assert.doesNotMatch(html, /href="(?:javascript|file):/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&lt;img/);
  assert.match(html, /<a href="\/blog\/scanf-stdin"/);
  assert.match(html, /<code[^>]*>&lt;b&gt;literal&lt;\/b&gt;<\/code>/);
});

test("existing published articles expose their ordinary Markdown tables", async () => {
  for (const [slug, count] of [
    ["quicksort", 2], ["binary-search", 2], ["longest-increasing-subsequence", 2],
    ["clang-diagnostics", 1], ["nextjs-blog-setup", 3], ["playground", 3],
  ]) {
    const content = await readFile(new URL(`../content/notes/${slug}.md`, import.meta.url), "utf8");
    assert.equal(parsePostContent(content).filter((block) => block.type === "table").length, count, slug);
  }
});
