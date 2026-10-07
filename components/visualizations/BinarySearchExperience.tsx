"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { binaryTrace, parseValues, type BinaryState } from "@/lib/visualizations/traces";
import { usePrefersReducedMotion } from "@/components/home/usePrefersReducedMotion";
import s from "./BinarySearchExperience.module.css";

const examples = [
  { label: "寻找右端 · 看区间逐步收缩", values: [1, 3, 5, 7, 9, 11, 13], target: 13 },
  { label: "最小反例 · 两格就能卡住", values: [1, 3], target: 3 },
  { label: "没有答案 · 窗口最终为空", values: [1, 3, 5, 7, 9, 11, 13], target: 6 },
  { label: "寻找左端 · 对照 hi 的更新", values: [1, 3, 5, 7, 9, 11, 13], target: 1 },
];
const statusNames = { compare: "比较中", found: "已找到", missing: "不存在", stalled: "窗口停滞" };

function SearchDiagram({ values, state, broken }: { values: number[]; state: BinaryState; broken: boolean }) {
  const id = useId();
  const width = Math.max(440, values.length * 72 + 48);
  const left = (width - values.length * 72) / 2;
  const x = (i: number) => left + i * 72 + 36;
  const color = broken ? "#fda4af" : "#5eead4";
  const length = Math.max(0, state.hi - state.lo + 1);
  return <svg style={{ minWidth: width }} viewBox={`0 0 ${width} 230`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
    <title id={`${id}-title`}>{broken ? "错误更新" : "正确更新"}的搜索区间</title>
    <desc id={`${id}-desc`}>数组 {values.join("、")}。lo 为 {state.lo}，hi 为 {state.hi}，mid 为 {state.mid ?? "无"}。{state.message}</desc>
    <defs><pattern id={`${id}-hatch`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#53657c" strokeWidth="1" /></pattern></defs>
    <line x1={left + 5} y1="111" x2={width - left - 5} y2="111" stroke="#30445e" strokeWidth="1" />
    {length > 0 && <rect className={s.move} x="0" y="66" width={length * 72 - 4} height="86" rx="12" fill={color} fillOpacity=".09" stroke={color} strokeOpacity=".5" strokeDasharray={broken && state.status === "stalled" ? "6 5" : undefined} style={{ transform: `translateX(${left + state.lo * 72 + 2}px)` }} />}
    {values.map((value, i) => {
      const excluded = i < state.lo || i > state.hi;
      const mid = i === state.mid;
      return <g key={i}>
        <rect className={s.cell} x={x(i) - 27} y="81" width="54" height="60" rx="8" fill={excluded ? `url(#${id}-hatch)` : mid ? (state.status === "found" ? "#164f48" : "#574520") : "#172d41"} fillOpacity={excluded ? .65 : 1} stroke={mid ? (state.status === "found" ? "#5eead4" : "#fbbf24") : excluded ? "#43526a" : "#48647c"} strokeWidth={mid ? 2 : 1} />
        <text x={x(i)} y="120" textAnchor="middle" fill={excluded ? "#9cabc0" : "#f1f6ff"} fontSize={String(value).length >= 4 ? 19 : 25} fontFamily="monospace" fontWeight="600">{value}</text>
        <text x={x(i)} y="168" textAnchor="middle" fill="#93a9c5" fontSize="15" fontFamily="monospace">{i}</text>
      </g>;
    })}
    {state.mid !== null && <g className={s.move} style={{ transform: `translateX(${x(state.mid)}px)` }}>
      <text x="0" y="33" textAnchor="middle" fill="#fbbf24" fontSize="20" fontFamily="monospace">mid</text>
      <path d="M0 43 V66 M-5 60 L0 66 L5 60" fill="none" stroke="#fbbf24" strokeWidth="2" />
    </g>}
    {length > 0 ? <>
      <g className={s.move} style={{ transform: `translateX(${x(state.lo)}px)` }}><path d="M-14 183 V149 M-19 154 L-14 149 L-9 154" fill="none" stroke="#8cbcff" strokeWidth="2" /><text x="-14" y="207" textAnchor="middle" fill="#8cbcff" fontFamily="monospace" fontSize="20">lo</text></g>
      <g className={s.move} style={{ transform: `translateX(${x(state.hi)}px)` }}><path d="M14 183 V149 M9 154 L14 149 L19 154" fill="none" stroke={color} strokeWidth="2" /><text x="14" y="207" textAnchor="middle" fill={color} fontFamily="monospace" fontSize="20">hi</text></g>
    </> : <text x={width / 2} y="207" textAnchor="middle" fill="#8cbcff" fontSize="19">lo &gt; hi · 搜索窗口已空</text>}
  </svg>;
}

function Lane({ values, trace, step, broken }: { values: number[]; trace: BinaryState[]; step: number; broken: boolean }) {
  const index = Math.min(step, trace.length - 1);
  const state = trace[index];
  return <section className={`${s.lane} ${broken ? s.broken : ""}`} aria-label={broken ? "错误更新轨道" : "正确更新轨道"}>
    <div className={s.laneHead}>
      <div><h3 className={s.laneName}><span className={s.number}>{broken ? "B" : "A"}</span>{broken ? "留下 mid，窗口会停滞" : "跳过 mid，继续缩小"}</h3><p className={`${s.rule} mt-2`}>{broken ? "lo = mid  /  hi = mid" : "lo = mid + 1  /  hi = mid - 1"}</p></div>
      <span className={`${s.badge} ${state.status === "found" ? s.found : state.status === "stalled" ? s.stalled : ""}`}>{statusNames[state.status]}</span>
    </div>
    <div className={s.graph} tabIndex={0} role="region" aria-label={`${broken ? "错误" : "正确"}轨道图示，可左右滚动`}><SearchDiagram values={values} state={state} broken={broken} /></div>
    <p className={s.graphHint}>窄屏可左右滑动图示；下方数值显示完整区间</p>
    <div className={s.laneFooter}>
      <p className={s.message}>{state.message}{step > index ? "（本轨道已结束，保持结果。）" : ""}</p>
      <div className={s.metrics}><span>lo<strong>{state.lo}</strong></span><span>hi<strong>{state.hi}</strong></span><span>剩余<strong>{Math.max(0, state.hi - state.lo + 1)}</strong></span></div>
    </div>
  </section>;
}

export function BinarySearchExperience() {
  const [values, setValues] = useState(examples[0].values);
  const [target, setTarget] = useState(examples[0].target);
  const [draft, setDraft] = useState(examples[0].values.join(" "));
  const [targetDraft, setTargetDraft] = useState(String(examples[0].target));
  const [selected, setSelected] = useState("0");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState("1");
  const [motion, setMotion] = useState(true);
  const [error, setError] = useState("");
  const reducedMotion = usePrefersReducedMotion();
  const correct = binaryTrace(values, target);
  const broken = binaryTrace(values, target, true);
  const last = Math.max(correct.length, broken.length) - 1;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setStep((current) => Math.min(current + 1, last));
      if (step + 1 >= last) setPlaying(false);
    }, 1800 / Number(speed));
    return () => window.clearTimeout(timer);
  }, [playing, step, last, speed]);

  function reset() { setStep(0); setPlaying(false); }
  function choose(index: number) {
    const example = examples[index];
    setValues(example.values); setTarget(example.target); setDraft(example.values.join(" ")); setTargetDraft(String(example.target)); setSelected(String(index)); setError(""); reset();
  }
  function apply() {
    const result = parseValues(draft);
    if (result.error) { setError(result.error); return; }
    if (result.values.length > 8) { setError("图形实验最多使用 8 个数，让每一格都清楚可见。"); return; }
    if (result.values.some((v, i) => i > 0 && v < result.values[i - 1])) { setError("二分查找要求有序：请按从小到大排列，允许重复值。"); return; }
    if (!/^[+-]?\d+$/.test(targetDraft.trim()) || Math.abs(Number(targetDraft)) > 999) { setError("目标必须是 -999 到 999 的整数。"); return; }
    setValues(result.values); setTarget(Number(targetDraft)); setError(""); setSelected(""); reset();
  }
  const a = correct[Math.min(step, correct.length - 1)];
  const b = broken[Math.min(step, broken.length - 1)];
  const result = b.status === "stalled" ? "同一个 mid，被反复比较。" : a.status === "found" ? "答案找到后，正确轨道停止。" : a.status === "missing" ? "窗口为空，也是一种明确答案。" : "每一步，都要让问题变小。";

  return <article className={`${s.lab} ${!motion || reducedMotion ? s.noMotion : ""}`} lang="zh-CN">
    <nav className={s.nav} aria-label="实验室导航"><Link href="/blog/binary-search">← 返回文章</Link><span className={s.brand}>CC / ALGORITHM LAB</span><Link href="/blog/longest-increasing-subsequence/visual">下一课：LIS →</Link></nav>
    <header className={s.header} data-pagefind-body>
      <div><p className={s.eyebrow}>EXPERIMENT 01 · BINARY SEARCH</p><h1 data-pagefind-meta="title">二分查找，<span>看见收缩。</span></h1><p className={s.subtitle}>同一组数字，两种更新规则。看一个窗口抵达答案，另一个停在原地。</p></div>
      <div className={s.target}><div><span>本次寻找</span><strong>{target}</strong></div><span>有序数组<br />0 起始下标</span></div>
    </header>
    <div className={s.layout}>
      <aside className={s.sidebar} aria-label="教学与实验设置">
        <section className={s.section} data-pagefind-body><p className={s.eyebrow}>THE IDEA</p><h2 className="mt-3">比较过，就让它离开。</h2><p>目标若存在，始终留在 <code>[lo, hi]</code>。当中点不是答案，排除它以及不可能的一半，下一轮才会更接近答案。</p><div className={s.history} aria-label="正确轨道各状态剩余元素个数">{correct.map((v, i) => <div key={i}><i style={{ height: `${Math.max(0, v.hi - v.lo + 1) / values.length * 38}px`, opacity: i <= step ? 1 : .35 }} /><span>{Math.max(0, v.hi - v.lo + 1)} 格</span></div>)}</div><p className="mt-3">上图：正确轨道的窗口长度，不是耗时。</p></section>
        <section className={s.section}>
          <h2>换一组实验</h2>
          <label className={s.label}>预设<select value={selected} onChange={(e) => choose(Number(e.target.value))}><option value="" disabled>自定义</option>{examples.map((e, i) => <option key={e.label} value={i}>{e.label}</option>)}</select></label>
          <form className={`${s.form} mt-4`} onSubmit={(e) => { e.preventDefault(); apply(); }}>
            <label className={s.label}>有序数组<input value={draft} maxLength={60} onChange={(e) => setDraft(e.target.value)} aria-describedby="lab-help lab-error" /></label>
            <label className={s.label}>查找目标<input value={targetDraft} inputMode="numeric" maxLength={5} onChange={(e) => setTargetDraft(e.target.value)} aria-describedby="lab-error" /></label>
            <button className={s.button} type="submit">应用并重新开始 ↗</button>
          </form>
          <p id="lab-help" className="mt-3">1–8 个整数，范围 ±999，以空格或逗号分隔。修改后点击应用。</p><p id="lab-error" role="alert" className={s.error}>{error}</p>
        </section>
        <section className={s.section}><h2>这一步，在判断什么？</h2><p>当前正确轨道：<code>{a.mid === null ? "lo > hi → return -1" : a.status === "found" ? `a[${a.mid}] == ${target} → return ${a.mid}` : values[a.mid] < target ? `a[${a.mid}] < ${target} → lo = ${a.mid + 1}` : `a[${a.mid}] > ${target} → hi = ${a.mid - 1}`}</code></p><p className="mt-3">画面先显示本轮比较，点击下一步后执行更新。已结束的轨道保持结果。</p></section>
      </aside>
      <div className={s.stage}>
        <div className={s.stageHead}><h2>同步对照 / SAME INPUT, TWO RULES</h2><span>FRAME {String(step + 1).padStart(2, "0")} / {String(last + 1).padStart(2, "0")}</span></div>
        <Lane values={values} trace={correct} step={step} broken={false} />
        <Lane values={values} trace={broken} step={step} broken />
        <div className={s.controls} aria-label="播放控制">
          <button className={`${s.button} ${s.primary}`} onClick={() => { if (step === last) setStep(0); setPlaying(!playing); }} aria-pressed={playing}>{playing ? "Ⅱ 暂停" : step === last ? "↻ 重播" : "▶ 播放"}</button>
          <button className={s.button} disabled={step === 0} onClick={() => { setPlaying(false); setStep((v) => Math.max(0, v - 1)); }} aria-label="上一步">←</button>
          <button className={s.button} disabled={step === last} onClick={() => { setPlaying(false); setStep((v) => Math.min(last, v + 1)); }} aria-label="下一步">→</button>
          <button className={s.button} onClick={reset}>重置</button>
          <input className={s.progress} aria-label="实验进度" aria-valuetext={`第 ${step + 1} 步，共 ${last + 1} 步`} type="range" min="0" max={last} value={step} onChange={(e) => { setPlaying(false); setStep(Number(e.target.value)); }} />
          <label>速度<select value={speed} onChange={(e) => setSpeed(e.target.value)}><option value="0.5">0.5×</option><option value="1">1×</option><option value="1.5">1.5×</option></select></label>
          <label><input type="checkbox" checked={motion && !reducedMotion} disabled={reducedMotion} onChange={(e) => setMotion(e.target.checked)} />过渡动画{reducedMotion ? "（系统已减少）" : ""}</label>
        </div>
        <div className={s.legend}><span><i style={{ background: "#5eead4" }} />剩余搜索区间</span><span><i style={{ background: "#fbbf24" }} />正在比较的 mid</span><span><i style={{ background: "repeating-linear-gradient(45deg,#53657c 0 1px,transparent 1px 4px)", border: "1px solid #53657c" }} />已排除</span><span>数字下方的小字是下标</span></div>
        <p role="status" aria-live={playing ? "off" : "polite"} aria-atomic="true" className="sr-only">第 {step + 1} 步。正确轨道：{a.message} 错误轨道：{b.message}</p>
        <section className={s.insight} data-pagefind-body><div><p className={s.eyebrow}>TAKEAWAY</p><h2>{result}</h2><p>保留 mid 并不一定每次都失败，但一旦新区间与旧区间相同，下一轮会重复同一次比较。本演示识别停滞后停止，不实际执行无限循环。</p></div><div><p className={s.eyebrow}>TRY TO EXPLAIN</p><details className="mt-3"><summary>[1, 3] 找 3，为什么 lo = mid 会卡住？</summary><p className="mt-3">第一次 mid = 0，a[0] = 1。lo = mid 使窗口仍为 [0, 1]；正确的 lo = mid + 1 将窗口变为 [1, 1]，下一轮命中 3。</p></details></div></section>
        <noscript><p>交互控制需要 JavaScript。静态图展示第一轮；[1, 3] 查找 3 的完整文字推演仍在上面的自测中。</p></noscript>
      </div>
    </div>
    <footer className={s.footer}><p>这是闭区间版本：lo ≤ hi 时比较，lo &gt; hi 时不存在。中点为 lo + floor((hi − lo) / 2)。小整数图形不模拟 C++ 有符号溢出；溢出是另一类问题。</p><p><Link href="/blog/binary-search">继续阅读原文与可运行 C++ →</Link> · 教学视觉参考 <a href="https://github.com/andyhuo520/aetherviz-master">AetherViz Master（MIT）</a>，本站独立实现 SVG 实验。</p></footer>
  </article>;
}
