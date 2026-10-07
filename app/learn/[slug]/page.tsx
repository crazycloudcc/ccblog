import { BinarySearchExperience } from "@/components/visualizations/BinarySearchExperience";
import { LisExperience } from "@/components/visualizations/LisExperience";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { AlgorithmLesson } from "@/components/visualizations/AlgorithmLesson";
import { getLesson, lessons, type LessonSlug } from "@/lib/visualizations/lessons";
import { LessonReading } from "@/components/visualizations/LessonReading";
import { lessonStructuredData } from "@/lib/visualizations/lesson-publication";
import { absoluteUrl, createPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(lessons).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return createPageMetadata({ title: lesson.title, description: lesson.description, path: `/learn/${slug}`, image: absoluteUrl(lesson.ogImage), type: "article", publishedTime: lesson.published, lang: "zh-CN" });
}
export default async function VisualLessonPage({ params }: Props) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  const schema = <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lessonStructuredData(slug as LessonSlug)).replace(/</g, "\\u003c") }} />;
  if (slug === "binary-search") return <>{schema}<BinarySearchExperience><LessonReading slug={slug} /></BinarySearchExperience></>;
  if (slug === "longest-increasing-subsequence") return <>{schema}<LisExperience><LessonReading slug={slug} /></LisExperience></>;
  return <article lang="zh-CN">
    {schema}
    <TerminalPanel title={`${slug} / learn`}>
      <nav aria-label="配套阅读" className="flex flex-wrap gap-4 text-sm">
        <Link href="/learn" className="text-code-cobalt underline underline-offset-4">← 图解实验室</Link>
        <Link href={`/blog/${slug}`} className="text-code-cobalt underline underline-offset-4">← 回到原文与 C++ 代码</Link>
        <Link href={`/learn/${slug === "binary-search" ? "longest-increasing-subsequence" : "binary-search"}`} className="text-code-cobalt underline underline-offset-4">{slug === "binary-search" ? "下一个实验：LIS" : "前置实验：二分查找"}</Link>
      </nav>
      <header className="mt-7" data-pagefind-body>
        <p className="text-sm text-code-teal">VISUAL LAB / 图解实验室</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink" data-pagefind-meta="title">{lesson.title}</h1>
        <p className="mt-4 text-base leading-8 text-slate">{lesson.description}</p>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-slate">{lesson.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
        <p className="mt-5 border-l-2 border-code-teal pl-4 text-sm leading-7 text-slate">{lesson.invariant}</p>
      </header>
      <noscript><p className="mt-6 text-code-rust">交互实验需要 JavaScript。下方的文字推演与原文链接仍可阅读。</p></noscript>
      <AlgorithmLesson key={slug} slug={slug as LessonSlug} />
      <LessonReading slug={slug as LessonSlug} />
      <footer className="mt-8 border-t border-mist pt-4 text-xs leading-6 text-fog">
        教学布局参考 <a href="https://github.com/andyhuo520/aetherviz-master" className="underline underline-offset-4">AetherViz Master</a>（MIT）：学习目标、实时状态、单步实验与可展开自测。本站独立实现，沿用博客主题，无新增外部脚本或图形库。
      </footer>
    </TerminalPanel>
  </article>;
}
