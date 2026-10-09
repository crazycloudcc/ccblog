import { lessons, lessonExtensions, type LessonSlug } from "./lessons";
import { absoluteUrl } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export function lessonAuthor(aboutEnabled = siteConfig.features.about, origin = absoluteUrl()) {
  return { "@type": "Person", name: siteConfig.author, ...(aboutEnabled ? { url: `${origin.replace(/\/$/, "")}/about` } : {}) };
}

export const latestLessonUpdate = Object.values(lessons).map((lesson) => lesson.updated).sort().at(-1)!;
export function lessonStructuredData(slug: LessonSlug) {
  const lesson = lessons[slug];
  const url = absoluteUrl(`/learn/${slug}`);
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", "@id": `${url}#article`, url, mainEntityOfPage: url,
      headline: lesson.title, description: lesson.description, inLanguage: "zh-CN",
      author: lessonAuthor(),
      datePublished: lesson.published, dateModified: lesson.updated,
      image: absoluteUrl(lesson.ogImage), articleSection: "图解实验室" },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "图解实验室", item: absoluteUrl("/learn") },
      { "@type": "ListItem", position: 3, name: lesson.title, item: url },
    ] },
  ] };
}
export function renderLessonMarkdown(slug: LessonSlug) {
  const l = lessons[slug];
  const extension = lessonExtensions[slug];
  return `# ${l.title}\n\n${l.description}\n\n原文 / Canonical: ${absoluteUrl(`/learn/${slug}`)}\n作者: ${siteConfig.author}\n首次发布: ${l.published}\n更新: ${l.updated}\n\n本阅读版与网页共用课程数据；互动请访问原文。\n\n## 一句话答案\n\n${l.shortAnswer}\n\n## 适用条件与边界\n\n${l.conditions}\n\n## 不变量\n\n${l.invariant}\n\n## 逐步例子\n\n${l.steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}\n\n## ${l.complexityLabel}\n\n${l.complexity}\n\n## 常见误区\n\n${l.mistakes.map((item) => `- ${item}`).join("\n")}\n\n## 自测\n\n${l.question}\n\n${l.answer}${extension ? `\n\n## 延伸学习\n\n${extension.explanation}\n\n[${extension.label}](${absoluteUrl(`/learn/${extension.slug}`)})` : ""}\n\n## 参考资料\n\n${l.references.map((ref) => `- [${ref.label}](${ref.url})`).join("\n")}\n\n${l.notesSlug ? `[推导与 C++ 代码](${absoluteUrl(`/blog/${l.notesSlug}`)})` : `[返回图解实验室](${absoluteUrl("/learn")})`}\n`;
}
