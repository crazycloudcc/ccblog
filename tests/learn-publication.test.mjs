import test from "node:test";
import assert from "node:assert/strict";
import { createJiti } from "jiti";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as jsxRuntime from "react/jsx-runtime";
const jiti = createJiti(import.meta.url, { alias: { "@": new URL("..", import.meta.url).pathname } });
const data = await jiti.import("../lib/visualizations/lessons.ts");
const site = await jiti.import("../lib/site.ts");
const { lessonStructuredData, renderLessonMarkdown } = await jiti.import("../lib/visualizations/lesson-publication.ts");
const { GET, generateStaticParams } = await jiti.import("../app/learn/[slug]/index.md/route.ts");
const { default: sitemap } = await jiti.import("../app/sitemap.ts");
const { binaryTrace, lisTrace } = await jiti.import("../lib/visualizations/traces.ts");
const component = {};
const source = ts.transpileModule(readFileSync(new URL("../components/visualizations/LessonReading.tsx", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const imports = { "react/jsx-runtime": jsxRuntime, "next/link": { default: ({ children, ...props }) => createElement("a", props, children) }, "@/lib/visualizations/lessons": data, "@/lib/site": site, "./LessonReading.module.css": { default: {} } };
new Function("exports", "require", source)(component, (id) => { assert.ok(id in imports, id); return imports[id]; });

test("every lesson renders its complete answer without scripts or disclosures", () => {
  for (const [slug, l] of Object.entries(data.lessons)) {
    const html = renderToStaticMarkup(createElement(component.LessonReading, { slug }));
    assert.doesNotMatch(html, /<details|<script|hidden=/);
    for (const value of [l.shortAnswer, l.conditions, l.complexity, l.answer, ...l.steps, ...l.mistakes]) {
      const escaped = renderToStaticMarkup(createElement("span", null, value)).slice(6,-7);
      assert.ok(html.includes(escaped), value);
      assert.ok(renderLessonMarkdown(slug).includes(value));
    }
    assert.ok(html.includes(site.siteConfig.author));
    assert.ok(html.includes(`/blog/${slug}`));
    assert.ok(html.includes(`/learn/${slug}/index.md`));
  }
});
test("lesson publication identity, actual dates and PNG cards stay aligned", () => {
  for (const [slug, l] of Object.entries(data.lessons)) {
    const [article, breadcrumb] = lessonStructuredData(slug)["@graph"];
    const url = `${site.SITE_URL}/learn/${slug}`;
    assert.equal(article.url, url); assert.equal(article.mainEntityOfPage, url);
    assert.equal(article.headline, l.title); assert.equal(article.datePublished, l.published); assert.equal(article.dateModified, l.updated);
    assert.equal(article.author.name, site.siteConfig.author);
    assert.equal(breadcrumb.itemListElement.at(-1).item, url);
    assert.equal(sitemap().find((entry) => entry.url === url).lastModified.toISOString().slice(0,10), l.updated);
    const png = readFileSync(new URL(`../public${l.ogImage}`, import.meta.url));
    assert.equal(png.readUInt32BE(16),1200); assert.equal(png.readUInt32BE(20),630);
  }
  assert.equal(new Set(Object.values(data.lessons).map(l=>l.ogImage)).size,2);
});
test("learn Markdown routes expose only known lessons with canonical headers", async () => {
  assert.equal(generateStaticParams().length,2);
  for (const slug of Object.keys(data.lessons)) {
    const response = await GET(new Request("https://example.com"), { params: Promise.resolve({ slug }) });
    assert.equal(response.headers.get("Content-Type"),"text/markdown; charset=utf-8");
    assert.ok(response.headers.get("Link").includes(`<${site.SITE_URL}/learn/${slug}>; rel="canonical"`));
    assert.equal(await response.text(),renderLessonMarkdown(slug));
  }
  for (const slug of ["absent","constructor","__proto__"]) assert.equal((await GET(new Request("https://example.com"),{params:Promise.resolve({slug})})).status,404);
});
test("published examples and boundary statements match the algorithm traces", () => {
  assert.deepEqual(binaryTrace([1,3,5,7,9],9).map(s=>[s.lo,s.hi]),[[0,4],[3,4],[4,4]]);
  assert.equal(binaryTrace([],9).at(-1).status,"missing");
  assert.equal(binaryTrace([2],2).at(-1).mid,0);
  assert.equal(binaryTrace([2],1).at(-1).status,"missing");
  assert.equal(binaryTrace([2,2,2],2).at(-1).status,"found");
  assert.equal(binaryTrace([1,3],3,true).at(-1).status,"stalled");
  for (const [values, strict, relaxed] of [[[],0,0],[[2],1,1],[[2,2,2],1,3],[[3,2,1],1,1],[[1,2,3],3,3],[[3,5,7,1,2,8],4,4]]) {
    assert.equal(lisTrace(values).at(-1).tails.length,strict);
    assert.equal(lisTrace(values,true).at(-1).tails.length,relaxed);
  }
  assert.deepEqual(lisTrace([3,5,7,1,2,8]).at(-1).tails,[1,2,7,8]);
});
