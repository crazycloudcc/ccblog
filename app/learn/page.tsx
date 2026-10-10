import Link from "next/link";
import { createPageMetadata, absoluteUrl } from "@/lib/metadata";
import { lessons } from "@/lib/visualizations/lessons";
import s from "./learn.module.css";

export const metadata = createPageMetadata({
  title: "图解实验室",
  description: "用图形、步进和反例理解算法与几何。探索二分查找、最长递增子序列、二分答案、勾股定理的面积拼补与相似三角形。",
  path: "/learn",
  lang: "zh-CN",
});

function LessonPreview({ slug }: { slug: string }) {
  const binary = slug === "binary-search";
  if (slug === "similar-triangles") return <svg viewBox="0 0 480 220" role="img" aria-label="灯高6、身高2、离灯4：相似三角形给出影长2">
    <polygon points="110,30 110,180 260,180" fill="#c9ded6" stroke="#245b50" strokeWidth="2"/><polygon points="210,130 210,180 260,180" fill="#c9d7ee" stroke="#35598a" strokeWidth="2"/>
    <path d="M80 180H390 M110 168H122V180 M210 170H220V180" fill="none" stroke="currentColor"/><text x="76" y="110" fill="currentColor" fontSize="17">H=6</text><text x="218" y="151" fill="#35598a" fontSize="15">h=2</text><text x="145" y="205" fill="currentColor" fontSize="15">x=4</text><text x="221" y="205" fill="#35598a" fontSize="15">s=2</text><text x="286" y="75" fill="#245b50" fontSize="21">对应角相等</text><text x="286" y="107" fill="#245b50" fontSize="18">对应边成比例</text>
  </svg>;
  if (slug === "binary-search-on-answer") return <svg viewBox="0 0 480 220" role="img" aria-label="产量阶梯在9秒跨过8件需求线，找到第一个可行时刻">
    <path d="M40 180H440 M40 180V32" fill="none" stroke="currentColor" /><path d="M40 180H90V158H140V130H190V108H240V82H290V58H340V32H440" fill="none" stroke="#245b50" strokeWidth="4" />
    <path d="M40 82H440" stroke="#914a2e" strokeDasharray="6 5" /><circle cx="240" cy="82" r="8" fill="#914a2e"/><text x="252" y="77" fill="currentColor" fontSize="16">9秒：8件，首次够用</text><text x="40" y="208" fill="currentColor" fontSize="14">搜索时间 / 先证明单调，再缩小区间</text>
  </svg>;
  if (slug === "pythagorean-theorem") return <svg viewBox="0 0 480 220" role="img" aria-label="勾股定理面积拼补：斜边平方25等于两块直角边平方9加16">
    <polygon points="90,32 186,104 114,200 18,128" fill="#bad8ce" stroke="#245b50" strokeWidth="2" />
    <text x="102" y="120" textAnchor="middle" fill="#245b50" fontSize="23">c² = 25</text><text x="220" y="122" textAnchor="middle" fill="currentColor" fontSize="26">=</text>
    <rect x="254" y="30" width="72" height="72" fill="#bad8ce" stroke="#245b50" strokeWidth="2" /><text x="290" y="72" textAnchor="middle" fill="#245b50" fontSize="17">a² = 9</text>
    <rect x="326" y="102" width="96" height="96" fill="#c9d7ee" stroke="#35598a" strokeWidth="2" /><text x="374" y="155" textAnchor="middle" fill="#35598a" fontSize="17">b² = 16</text>
  </svg>;
  return <svg viewBox="0 0 480 220" role="img" aria-label={binary ? "二分查找 9：窗口从五格缩到两格，再命中最后一格" : "相同的 2：严格递增只保留一个结尾，非下降延长到三个"}>
    <text x="24" y="30" fill="currentColor" fontSize="13">{binary ? "查找 9 / 每轮排除已经比较的中点" : "输入 2, 2, 2 / 相等元素去哪里？"}</text>
    {(binary ? [[1,3,5,7,9], [7,9], [9]] : [[2], [2,2,2]]).map((row, ri) => <g key={ri}>
      <text x="24" y={68+ri*56} fill="currentColor" fontSize="12">{binary ? `0${ri+1}` : ri === 0 ? "严格" : "非降"}</text>
      {row.map((value, i) => <g key={i}>
        <rect x={80+(binary ? 5-row.length+i : i)*68} y={44+ri*56} width="56" height="40" rx="8" fill={binary && value===9 ? "#245b50" : "#e8e6ee"} />
        <text x={108+(binary ? 5-row.length+i : i)*68} y={70+ri*56} textAnchor="middle" fill={binary && value===9 ? "#fff" : "#383646"} fontSize="17">{value}</text>
      </g>)}
    </g>)}
    {!binary && <text x="80" y="194" fill="currentColor" fontSize="13">长度 1 ↔ 长度 3：先比较，再决定</text>}
  </svg>;
}

export default function LearnPage() {
  const entries = Object.entries(lessons);
  const categories = [...new Set(entries.map(([, lesson]) => lesson.category))];
  const data = { "@context": "https://schema.org", "@type": "CollectionPage", name: "图解实验室", url: absoluteUrl("/learn"), inLanguage: "zh-CN", mainEntity: { "@type": "ItemList", itemListElement: entries.map(([slug, lesson], i) => ({ "@type": "ListItem", position: i + 1, name: lesson.title, url: absoluteUrl(`/learn/${slug}`) })) } };
  return <article lang="zh-CN" className={s.lab} data-pagefind-body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
    <header className={s.header}>
      <p className={s.eyebrow}>CC / VISUAL LAB</p>
      <h1 data-pagefind-meta="title">图解实验室</h1>
      <p className={s.intro}>让抽象的规律，变成看得见的变化。</p>
      <p className={s.description}>先观察图形，再动手改变输入。用单步、对比与反例，弄清每一步为什么这样走。</p>
      <nav className={s.categories} aria-label="实验分类">{categories.map(category => <a key={category} href={`#${category === "算法" ? "algorithms" : "geometry"}`}>{category}</a>)}</nav>
    </header>
    {categories.map(category => <section key={category} id={category === "算法" ? "algorithms" : "geometry"} aria-labelledby={`${category}-title`} className={s.categorySection}>
      <div className={s.sectionTitle}><h2 id={`${category}-title`}>{category}</h2><span>从边界到规律</span></div>
      <div className={s.grid}>{entries.filter(([, lesson]) => lesson.category === category).map(([slug, lesson]) => <article key={slug} className={s.card}>
        <Link href={`/learn/${slug}`} className={s.preview} aria-label={`开始实验：${lesson.title}`}><LessonPreview slug={slug} /></Link>
        <div className={s.cardBody}>
          <p className={s.eyebrow}>实验 0{entries.findIndex(([key]) => key === slug) + 1} · {lesson.category}</p>
          <h3><Link href={`/learn/${slug}`}>{lesson.title}</Link></h3>
          <p className={s.description}>{lesson.description}</p>
          <dl className={s.facts}><div><dt>难度</dt><dd>{lesson.difficulty}</dd></div><div><dt>学习时长</dt><dd>约 {lesson.estimatedMinutes} 分钟（估计）</dd></div><div><dt>前置知识</dt><dd>{lesson.prerequisites}</dd></div></dl>
          <div className={s.actions}><Link href={`/learn/${slug}`}>开始实验 →</Link>{lesson.notesSlug && <Link href={`/blog/${lesson.notesSlug}`}>阅读相关笔记</Link>}</div>
        </div>
      </article>)}</div>
    </section>)}
    <footer className={s.footer}>图解实验室适合动手探索；<Link href="/blog">Notes 笔记</Link>保留完整推导与可运行代码。学习时长包含尝试示例与自测，按自己的节奏来。</footer>
  </article>;
}
