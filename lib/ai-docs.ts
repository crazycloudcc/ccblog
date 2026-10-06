import { getPostBySlug, getPostModified, type Post } from "@/lib/posts";
import { features, SITE_NAME, SITE_URL } from "@/lib/site";

/** Deliberately curated: no private drafts, unlisted notes, or full-site dump. */
export const AI_DOC_SLUGS = ["liulanqi-bianyi-cpp", "scanf-stdin", "clang-diagnostics"] as const;
export const AI_PROMPT_SLUG = AI_DOC_SLUGS[0];

export function getAiDoc(slug: string): Post | undefined {
  if (!features.blog || !features.playground || !AI_DOC_SLUGS.some((item) => item === slug)) return undefined;
  const post = getPostBySlug(slug);
  return post?.index ? post : undefined;
}

export function aiDocPath(slug: string): string {
  return `/blog/${slug}/index.md`;
}

/** Remove presentation-only directive wrappers; retain examples byte-for-byte. */
export function plainPostMarkdown(content: string): string {
  let fence = false;
  return content.split("\n").map((line) => {
    if (/^\s*```/.test(line)) {
      fence = !fence;
      return line;
    }
    if (fence) return line;
    if (/^:::\s*$/.test(line)) return "";
    if (/^:::\w+/.test(line)) {
      const title = line.match(/\btitle="([^"]*)"/);
      const stdin = line.match(/\bstdin="([^"]*)"/);
      const heading = title ? `### ${title[1]}` : "";
      return stdin ? `${heading}\n\n示例 stdin（转义表示）: \`${stdin[1]}\`\n` : heading;
    }
    return line.replace(/\]\((\/[^\s)]*)\)/g, (_, path: string) => `](${SITE_URL}${path})`);
  }).join("\n");
}

export function renderAiDoc(post: Post): string {
  return `# ${post.title}\n\n> ${post.excerpt}\n\n原文 / Canonical: ${SITE_URL}/blog/${post.slug}\n更新 / Updated: ${getPostModified(post)}\n语言 / Language: ${post.lang ?? "zh-CN"}\n\n本文与网页共用同一篇笔记的内容源；交互示例在这里以代码展示，请到原文运行。\n\n${plainPostMarkdown(post.content)}\n`;
}

export function renderLlmsIndex(): string {
  const docs = AI_DOC_SLUGS.map(getAiDoc).filter((post): post is Post => Boolean(post));
  return `# ${SITE_NAME}\n\n> 浏览器内 C11 / C++17 Playground 与中文实践笔记。clang / lld 编译为 WebAssembly，程序通过 WASI 在浏览器 Worker 中运行。\n\n这是精选阅读索引，不是完整站点导出。文档由现有公开笔记生成；引用时请使用文档内的原文地址。不能访问来源或来源没有说明时，请明确说明未知，不要猜测支持范围。此索引不改变抓取、训练或内容使用权限，也不承诺搜索收录、排名或 AI 引用。\n\n## 使用与限制\n\n${docs.map((post) => `- [${post.title}](${SITE_URL}${aiDocPath(post.slug)}): ${post.excerpt}`).join("\n")}\n`;
}
