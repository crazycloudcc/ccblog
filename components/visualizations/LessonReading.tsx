import Link from "next/link";
import { lessons, type LessonSlug } from "@/lib/visualizations/lessons";
import { siteConfig } from "@/lib/site";
import s from "./LessonReading.module.css";

/** Server-rendered companion: the answer never depends on playback or disclosure. */
export function LessonReading({ slug }: { slug: LessonSlug }) {
  const lesson = lessons[slug];
  return <section className={s.reading} aria-labelledby="lesson-answer" data-pagefind-body>
    <p className={s.byline}>作者：{siteConfig.author} · 首次发布 <time dateTime={lesson.published}>{lesson.published}</time> · 更新 <time dateTime={lesson.updated}>{lesson.updated}</time></p>
    <h2 id="lesson-answer">看完图，带走这些结论</h2>
    <p>{lesson.shortAnswer}</p>
    <div className={s.columns}>
      <div><h3>适用条件与边界</h3><p>{lesson.conditions}</p><h3>始终保持的规律</h3><p>{lesson.invariant}</p><h3>逐步例子</h3><ol>{lesson.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
      <div><h3>复杂度</h3><p>{lesson.complexity}</p><h3>常见误区</h3><ul>{lesson.mistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul><h3>自测与答案</h3><p>{lesson.question}</p><p>{lesson.answer}</p></div>
    </div>
    <h3>参考资料</h3><ul>{lesson.references.map((ref) => <li key={ref.url}><a href={ref.url}>{ref.label}</a></li>)}</ul>
    <p><Link href={`/blog/${slug}`}>阅读 Notes：推导与 C++ 代码</Link> · <a href={`/learn/${slug}/index.md`}>纯文字 Markdown 阅读版</a></p>
  </section>;
}
