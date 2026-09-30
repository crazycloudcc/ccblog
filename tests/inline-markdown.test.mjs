import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { jsx: { runtime: "automatic" }, alias: { "@": fileURLToPath(new URL("..", import.meta.url)) } });
const { InlineMarkdown } = await jiti.import("../components/blog/InlineMarkdown.tsx");
const render = (text) => renderToStaticMarkup(createElement(InlineMarkdown, { text }));

test("renders real contextual links and nested inline formatting", () => {
  const html = render("系列入口在 [**C++** 与 `stdin`](/blog/liulanqi-bianyi-cpp)，*继续*。");
  assert.match(html, /<a href="\/blog\/liulanqi-bianyi-cpp"[^>]*><strong>C\+\+<\/strong> 与 <code[^>]*>stdin<\/code><\/a>/);
  assert.match(html, /<em>继续<\/em>/);
  assert.doesNotMatch(html, /<p>/);
});

test("handles parentheses, titles, escaped markup and literal code", () => {
  assert.match(render('[reference](https://example.com/a_(b) "Title")'), /href="https:\/\/example.com\/a_\(b\)" title="Title"/);
  assert.equal(render('\\*literal\\*'), '*literal*');
  assert.match(render('``a ` b **c**``'), /<code[^>]*>a ` b \*\*c\*\*<\/code>/);
  assert.equal(render('unfinished [link and **bold'), 'unfinished [link and **bold');
});

test("allows web, email, relative and fragment links", () => {
  for (const href of ["https://example.com", "http://example.com", "mailto:a@example.com", "/blog/test", "../test", "#section", "?page=2"]) {
    assert.match(render(`[link](${href})`), /<a href=/);
  }
});

test("never renders raw HTML or unsafe URL schemes", () => {
  const html = render('<img src=x onerror=alert(1)> <script>alert(1)</script>');
  assert.doesNotMatch(html, /<(img|script)/);
  assert.match(html, /&lt;img/);
  for (const href of ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "jav&#x61;script:alert(1)", "vbscript:msgbox(1)", "data:text/html;base64,WA==", "data:image/png;base64,WA==", "file:///etc/passwd", "custom:command", "java&#x09;script:alert(1)"]) {
    assert.doesNotMatch(render(`[unsafe](${href})`), /<a\b/, href);
  }
});


test("integrates into headings, paragraphs and lists without changing fenced code", async () => {
  const { PostContent } = await jiti.import("../components/blog/PostContent.tsx");
  const tree = await PostContent({ content: "## **Heading**\n\n[guide](/blog/test)\n\n- `unordered`\n\n1. *ordered*\n\n```cpp\n[raw](/not-a-link) **raw**\n```" });
  const blocks = tree.props.children[0];
  assert.deepEqual(blocks.slice(0, 4).map((block) => block.type), ["h2", "p", "ul", "ol"]);
  for (const block of blocks.slice(0, 2)) assert.equal(block.props.children.type, InlineMarkdown);
  for (const block of blocks.slice(2, 4)) assert.equal(block.props.children[0].props.children.type, InlineMarkdown);
  assert.equal(blocks[4].props.code, "[raw](/not-a-link) **raw**");
  assert.equal(blocks[4].props.language, "cpp");
});
