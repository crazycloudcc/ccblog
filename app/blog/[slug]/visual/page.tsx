import Link from "next/link";
import { notFound } from "next/navigation";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { AlgorithmLesson } from "@/components/visualizations/AlgorithmLesson";
import { getLesson, lessons, type LessonSlug } from "@/lib/visualizations/lessons";
import { createPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(lessons).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return createPageMetadata({ title: lesson.title, description: lesson.description, path: `/blog/${slug}/visual`, lang: "zh-CN" });
}
export default async function VisualLessonPage({ params }: Props) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return <article lang="zh-CN">
    <TerminalPanel title={`${slug} / visual`}>
      <nav aria-label="配套阅读" className="flex flex-wrap gap-4 text-sm">
        <Link href={`/blog/${slug}`} className="text-code-cobalt underline underline-offset-4">← 回到原文与 C++ 代码</Link>
        <Link href={`/blog/${slug === "binary-search" ? "longest-increasing-subsequence" : "binary-search"}/visual`} className="text-code-cobalt underline underline-offset-4">{slug === "binary-search" ? "下一个实验：LIS" : "前置实验：二分查找"}</Link>
      </nav>
      <header className="mt-7" data-pagefind-body>
        <p className="text-sm text-code-teal">INTERACTIVE NOTE / 配套交互笔记</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink" data-pagefind-meta="title">{lesson.title}</h1>
        <p className="mt-4 text-base leading-8 text-slate">{lesson.description}</p>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-slate">{lesson.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
        <p className="mt-5 border-l-2 border-code-teal pl-4 text-sm leading-7 text-slate">{lesson.invariant}</p>
      </header>
      <noscript><p className="mt-6 text-code-rust">交互实验需要 JavaScript。下方的文字推演与原文链接仍可阅读。</p></noscript>
      <AlgorithmLesson key={slug} slug={slug as LessonSlug} />
      <section className="mt-8 space-y-4 text-sm leading-7 text-slate" aria-labelledby="takeaway-title" data-pagefind-body>
        <h2 id="takeaway-title" className="text-xl font-semibold text-ink">03 / 带走这个规律</h2>
        <p>{lesson.summary}</p>
        <details className="rounded-lg border border-mist p-4">
          <summary className="cursor-pointer font-semibold text-ink">想一想：{lesson.question}</summary>
          <p className="mt-3">{lesson.answer}</p>
        </details>
        {slug === "binary-search" && <p>中点溢出是另一类问题：C++ 有符号整数溢出属于未定义行为，不能保证卷回某个负数。本页的有限小整数不会触发它。原文讨论的安全中点公式适用于合法、非负的数组下标。</p>}
        <p>继续阅读 <Link href={`/blog/${slug}`} className="text-code-cobalt underline underline-offset-4">原文、边界条件与可运行的 C++</Link>，再把观察到的状态和代码逐行对照。</p>
      </section>
      <footer className="mt-8 border-t border-mist pt-4 text-xs leading-6 text-fog">
        教学布局参考 <a href="https://github.com/andyhuo520/aetherviz-master" className="underline underline-offset-4">AetherViz Master</a>（MIT）：学习目标、实时状态、单步实验与可展开自测。本站独立实现，沿用博客主题，无新增外部脚本或图形库。
      </footer>
    </TerminalPanel>
  </article>;
}
