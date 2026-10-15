import Link from "next/link";
import { createPageMetadata, absoluteUrl } from "@/lib/metadata";
import { lessons } from "@/lib/visualizations/lessons";
import s from "./learn.module.css";

export const metadata = createPageMetadata({
  title: "图解实验室",
  description: "用图形、步进和反例理解算法与几何。探索二分查找、最长递增子序列、二分答案、勾股定理的面积拼补、相似三角形、弧度、GCD、最小公倍数、前缀和与两点坐标距离。",
  path: "/learn",
  lang: "zh-CN",
});

function LessonPreview({ slug }: { slug: string }) {
  if (slug === "prefix-sum") return <svg viewBox="0 0 480 220" role="img" aria-label="两个前缀对齐相减，留下区间3加0加5等于8"><rect x="40" y="50" width="350" height="30" fill="#c9d7ee"/><rect x="40" y="100" width="140" height="30" fill="none" stroke="#914a2e" strokeDasharray="5 3"/><rect x="180" y="150" width="210" height="30" fill="#cadbd5"/><path d="M180 42V187M390 42V187" stroke="#245b50" strokeDasharray="3 3"/><text x="40" y="31" fill="currentColor" fontSize="19">P[r] − P[l]：消去共同前缀</text><text x="45" y="72" fill="currentColor" fontSize="18">4 − 6 + 3 + 0 + 5</text><text x="45" y="122" fill="#914a2e" fontSize="18">− (4 − 6)</text><text x="196" y="172" fill="#245b50" fontSize="18">3 + 0 + 5 = 8</text><text x="40" y="210" fill="currentColor" fontSize="16">条长表示项的位置，不表示和</text></svg>;
  if (slug === "least-common-multiple") return <svg viewBox="0 0 480 220" role="img" aria-label="6和8的正倍数在24第一次相遇"><path d="M50 80H420M50 150H420" stroke="currentColor"/><rect x="408" y="47" width="24" height="129" rx="4" fill="#cadbd5"/>{[6,12,18,24].map(v=><g key={v}><circle cx={50+370*v/24} cy="80" r="6" fill="#245b50"/><text x={50+370*v/24} y="107" textAnchor="middle" fill="currentColor" fontSize="16">{v}</text></g>)}{[8,16,24].map(v=><g key={v}><circle cx={50+370*v/24} cy="150" r="6" fill="#914a2e"/><text x={50+370*v/24} y="177" textAnchor="middle" fill="currentColor" fontSize="16">{v}</text></g>)}<text x="30" y="33" fontSize="19" fill="#245b50">首次共同正落点：24</text><text x="30" y="207" fontSize="16" fill="currentColor">6 ÷ gcd(6,8) × 8 = 24</text></svg>;
  if (slug === "coordinate-distance") return <svg viewBox="0 0 480 220" role="img" aria-label="两点坐标差3和负4，距离5"><path d="M30 100H245M135 20V200" stroke="currentColor" strokeWidth="1"/><path d="M85 75H160V175Z" fill="#cadbd5" stroke="#245b50" strokeWidth="3"/><path d="M85 75H160" stroke="#914a2e" strokeWidth="3"/><path d="M160 75V175" stroke="#35598a" strokeWidth="3"/><text x="70" y="62" fill="currentColor" fontSize="17">A</text><text x="165" y="195" fill="currentColor" fontSize="17">B</text><text x="265" y="78" fill="#245b50" fontSize="23">Δx=3 · Δy=−4</text><text x="265" y="122" fill="#245b50" fontSize="29">d=5</text><text x="265" y="159" fill="currentColor" fontSize="16">方向有正负，距离非负</text></svg>;
  if (slug === "euclidean-algorithm") return <svg viewBox="0 0 480 220" role="img" aria-label="48乘18矩形切分，最大公约数6"><rect x="32" y="40" width="288" height="108" fill="#cadbd5" stroke="#245b50"/><path d="M140 40V148M248 40V148M248 112H320M284 112V148" fill="none" stroke="#245b50" strokeWidth="2"/><text x="40" y="185" fill="#245b50" fontSize="22">48 = 2 × 18 + 12</text><text x="340" y="100" fill="#914a2e" fontSize="24">gcd</text><text x="355" y="133" fill="#914a2e" fontSize="24">6</text></svg>;
  const binary = slug === "binary-search";
  if (slug === "radians") return <svg viewBox="0 0 480 220" role="img" aria-label="直角弧度π/2，弧长除以半径保持不变"><circle cx="110" cy="110" r="70" fill="none" stroke="#bac8c3" strokeWidth="2"/><path d="M180 110A70 70 0 0 0 110 40" fill="none" stroke="#245b50" strokeWidth="5"/><path d="M110 40V110H180" fill="none" stroke="#914a2e" strokeWidth="2"/><path d="M250 160H360" stroke="#245b50" strokeWidth="5"/><text x="250" y="80" fontSize="28" fill="#245b50">θ = s / r</text><text x="230" y="115" fontSize="16" fill="currentColor">弧长里有几个半径？</text><text x="250" y="193" fontSize="16" fill="currentColor">展开同一段弧</text></svg>;
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
          <p className={s.eyebrow}>实验 {String(entries.findIndex(([key]) => key === slug) + 1).padStart(2, "0")} · {lesson.category}</p>
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
