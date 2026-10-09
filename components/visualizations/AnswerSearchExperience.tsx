"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/home/usePrefersReducedMotion";
import { ANSWER_CODE, completed, parseMachines, searchAnswer } from "@/lib/visualizations/answer-search";
import s from "./AnswerSearchExperience.module.css";

export function AnswerSearchExperience({ children }: { children: ReactNode }) {
  const [periods, setPeriods] = useState([2, 3, 7]);
  const [target, setTarget] = useState(8);
  const [draft, setDraft] = useState("2, 3, 7"), [goal, setGoal] = useState("8");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"explore" | "search">("explore");
  const [time, setTime] = useState(9), [step, setStep] = useState(0), [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1), [counter, setCounter] = useState(false);
  const reduced = usePrefersReducedMotion();
  const timeRef = useRef(time);
  const frames = useMemo(() => searchAnswer(periods, target), [periods, target]);
  const frame = frames[step], answer = frames.at(-1)!.lo;
  const limit = Math.max(1, Math.min(...periods) * target);
  const count = completed(periods, time), enough = count >= target;
  const displayTime = (Math.floor(time * 10) / 10).toFixed(1);
  // Only visual time interpolates. The code/search state changes at integer frames.
  useEffect(() => {
    const destination = mode === "search" ? (frame.mid ?? frame.lo) : timeRef.current;
    if (mode !== "search") return;
    const origin = timeRef.current;
    let id = 0, start: number | null = null;
    function tick(now: number) {
      start ??= now;
      const p = reduced ? 1 : Math.min(1, (now - start) / 420);
      const value = p === 1 ? destination : origin + (destination - origin) * p;
      timeRef.current = value; setTime(value);
      if (p < 1) id = requestAnimationFrame(tick);
    }
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [frame, mode, reduced]);
  useEffect(() => {
    if (!playing) return;
    function advance() {
      if (document.hidden) { setPlaying(false); return; }
      if (step >= frames.length - 1) { setPlaying(false); return; }
      setStep(step + 1);
    }
    const id = setTimeout(advance, 1100 / speed);
    const hide = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", hide);
    return () => { clearTimeout(id); document.removeEventListener("visibilitychange", hide); };
  }, [playing, step, frames.length, speed]);
  function explore(value: number) { value = Math.floor(value * 10) / 10; setPlaying(false); setMode("explore"); timeRef.current = value; setTime(value); }
  function move(value: number) { setPlaying(false); setMode("search"); setStep(Math.max(0, Math.min(frames.length - 1, value))); }
  function load(p: number[], t: number) {
    setPlaying(false); setPeriods(p); setTarget(t); setDraft(p.join(", ")); setGoal(String(t)); setError(""); setStep(0); setMode("explore");
    const a = searchAnswer(p, t).at(-1)!.lo; timeRef.current = a; setTime(a);
  }
  function apply() {
    const input = parseMachines(draft, goal);
    if (input.error || !input.periods || input.target === undefined) { setError(input.error ?? "输入无效"); return; }
    load(input.periods, input.target);
  }
  const left = 106, right = 614, width = right - left;
  const x = (t: number) => left + t / limit * width;
  const chartTop = 260, chartBottom = 362;
  const chartMax = Math.max(1, completed(periods, limit), target);
  const y = (v: number) => chartBottom - v / chartMax * (chartBottom - chartTop);
  const path = Array.from({ length: limit + 1 }, (_, t) => `${t ? "H" : "M"}${x(t)}${t ? "V" : ","}${y(completed(periods, t))}`).join(" ");
  const ticks = [...new Set([0, Math.round(limit / 4), Math.round(limit / 2), Math.round(limit * 3 / 4), limit])];
  return <article lang="zh-CN" className={s.lab}>
    <header className={s.header} data-pagefind-body>
      <nav><Link href="/learn">← 图解实验室</Link><span>算法 / OPTIMIZATION</span></nav>
      <h1 data-pagefind-meta="title">二分答案：最早什么时候够用？</h1>
      <p>不在数组里找数字，而在时间轴上找第一个可行答案。</p>
    </header>
    <section aria-label="机器生产与二分答案交互实验" data-pagefind-ignore>
      <div className={s.toolbar}>
        <button aria-pressed={mode === "explore"} onClick={() => explore(time)}>探索时间</button>
        <button aria-pressed={mode === "search"} onClick={() => move(0)}>看二分过程</button>
        <span className={s.divider} />
        <button onClick={() => { setMode("search"); if (step === frames.length - 1) setStep(0); setPlaying(!playing); }}>{playing ? "暂停" : "播放二分"}</button>
        <button onClick={() => move(step - 1)} disabled={mode !== "search" || step === 0}>上一步</button>
        <button onClick={() => move(step + 1)} disabled={mode === "search" && step === frames.length - 1}>下一步</button>
        <button onClick={() => load([2, 3, 7], 8)}>重置全部</button>
        <label>速度<select aria-label="播放速度" value={speed} onChange={e => setSpeed(Number(e.target.value))}><option value={.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label>
      </div>
      <div className={s.workspace}>
        <figure className={s.figure}>
          <figcaption><strong>01 / 同时开工，同一条时间轴</strong><span>{mode === "explore" ? "拖动时间，观察产量" : `二分状态 ${step + 1} / ${frames.length}`}</span></figcaption>
          <label className={s.timeSlider}>探索时间 <strong>{displayTime} 秒</strong><input aria-label="探索时间" type="range" min="0" max={limit} step="0.1" value={Number(displayTime)} onChange={e => explore(Number(e.target.value))} /></label>
          <svg className={s.graph} viewBox="0 0 640 430" role="img" aria-labelledby="answer-graph-title answer-graph-desc">
            <title id="answer-graph-title">{`${displayTime} 秒，完成 ${count} 件，需求 ${target} 件，${enough ? "已够用" : "还不够"}`}</title>
            <desc id="answer-graph-desc">每行是一台机器，圆环表示正在制作的进度，圆点表示完成的产品。下图阶梯只在产品完成时上升。青色可行时间从最早答案开始；橙色虚线是探索时间。动画中的非整数时刻不是二分代码的一次执行。</desc>
            <defs><pattern id="answer-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="currentColor" strokeOpacity=".08" /></pattern></defs>
            <rect x="0" y="0" width="640" height="430" fill="url(#answer-grid)" />
            {ticks.map(t => <g key={t}><line x1={x(t)} x2={x(t)} y1="30" y2="365" className={s.gridline} /><text x={x(t)} y="22" textAnchor="middle" className={s.small}>{t}s</text></g>)}
            {periods.map((k, i) => { const cy = 54 + i * 46; const n = Math.floor(time / k); const progress = time / k - n; return <g key={i}>
              <text x="4" y={cy + 5} className={s.label}>{k}秒/件</text>
              <circle cx="83" cy={cy} r="13" className={s.dialBase} />
              <circle cx="83" cy={cy} r="13" className={s.dial} strokeDasharray={`${progress * 81.68} 81.68`} transform={`rotate(-90 83 ${cy})`} />
              <line x1={left} x2={right} y1={cy} y2={cy} className={s.track} />
              {Array.from({ length: Math.floor(limit / k) }, (_, j) => <circle key={j} cx={x((j + 1) * k)} cy={cy} r={Math.floor(limit / k) > 35 ? 2.5 : 5} className={(j + 1) * k <= time ? s.product : s.future} />)}
              <text x={right} y={cy + 22} textAnchor="end" className={s.small}>{n} 件完成</text>
            </g>; })}
            <text x="4" y="241" className={s.label}>总产量</text>
            <line x1={left} x2={right} y1={y(target)} y2={y(target)} className={s.target} />
            <text x="4" y={Math.max(266, y(target) + 5)} className={s.small}>需求 {target}</text>
            <path d={path} className={s.staircase} />
            <circle cx={x(time)} cy={y(count)} r="6" className={s.cursorPoint} />
            <rect x={left} y="377" width={x(answer) - left} height="19" className={s.noBand} />
            <rect x={x(answer)} y="377" width={right - x(answer)} height="19" className={s.yesBand} />
            <text x={left} y="419" className={s.small}>{answer > 0 ? `0–${answer - 1}秒：不够` : "0秒起就够用"}</text>
            <text x={right} y="419" textAnchor="end" className={s.small}>从 {answer} 秒起：够用 →</text>
            <line x1={x(time)} x2={x(time)} y1="28" y2="400" className={s.cursor} />
            {mode === "search" && <g><path d={`M${x(frame.lo)} 369v-8H${x(frame.hi)}v8`} className={s.bracket} /><text x={(x(frame.lo) + x(frame.hi)) / 2} y="350" textAnchor="middle" className={s.interval}>[{frame.lo}, {frame.hi}]</text></g>}
          </svg>
          <p className={s.legend}><span>● 已完成</span><span>○ 尚未完成</span><span>◌ 圆环：下一件进度</span></p>
          <p className={s.note}>机器并行、从 0 秒开工；只计算完整产品。连续动画，整数二分。可行色带是教学参考答案，算法只查询 mid。</p>
        </figure>
        <aside className={s.side}>
          <div className={s.answer}>
            <span>当前观察 / {enough ? "可行" : "不可行"}</span><strong>{displayTime}<small> 秒</small></strong>
            <p>{periods.map(k => Math.floor(time / k)).join(" + ")} = <b>{count} 件</b> {enough ? "≥" : "<"} {target}</p>
            <p className={s.boundary}>最早边界：<b>{answer} 秒</b><br />{target ? `${answer - 1} 秒只有 ${completed(periods, answer - 1)} 件` : "不需要生产任何产品"}</p>
          </div>
          <div className={s.codeHeader}>02 / 查找第一个 true <span>C++</span></div>
          <pre className={s.code} tabIndex={0} aria-label="二分答案核心代码">{ANSWER_CODE.map((line, i) => <code key={line} className={mode === "search" && i + 1 === frame.line ? s.activeLine : ""}><i>{i + 1}</i>{line}</code>)}</pre>
          <p className={s.status} role="status" aria-live="polite">{mode === "search" ? frame.message : "先拖动时间：产量只会上升，不会下降。因此，“够用”之后不会再变回“不够”。"}</p>
          <p className={s.note}>动画经过的时刻不执行代码；高亮对应已提交的整数二分状态。enough 的完整实现与整数范围见下文。</p>
        </aside>
      </div>
      <form className={s.inputs} onSubmit={e => { e.preventDefault(); apply(); }}>
        <label>每台耗时（秒/件）<input aria-label="每台机器耗时" value={draft} maxLength={28} onChange={e => setDraft(e.target.value)} aria-describedby="answer-input-help answer-input-error" /></label>
        <label>需要多少件<input aria-label="目标产量" value={goal} maxLength={3} inputMode="numeric" onChange={e => setGoal(e.target.value)} aria-describedby="answer-input-help answer-input-error" /></label>
        <button type="submit">应用实验</button>
        <button type="button" onClick={() => load([3], 5)}>单台机器</button><button type="button" onClick={() => load([4, 4], 7)}>相同速度</button><button type="button" onClick={() => load([2, 3, 7], 0)}>零需求</button>
      </form>
      <p id="answer-input-help" className={s.note}>实验范围：1–4 台，耗时 1–12 秒整数，需求 0–24 件。输入改好后按“应用实验”；非法输入不改变当前有效实验。</p>
      <p id="answer-input-error" role="alert" className={s.error}>{error}</p>
      <div className={s.counter}>
        <button onClick={() => setCounter(!counter)} aria-expanded={counter} aria-controls="answer-counterexample">{counter ? "收起" : "如果真假来回变化呢？"}</button>
        {counter && <div id="answer-counterexample"><h2>不是所有 yes / no 都能二分</h2><svg viewBox="0 0 640 75" role="img" aria-label="非单调反例：false true false false true true true true，二分可能错过左边的true"><path d="M30 48H610" stroke="currentColor" />{[false,true,false,false,true,true,true,true].map((v,i)=><g key={i}><circle cx={45+i*77} cy="30" r="18" fill={v?"#245b50":"#914a2e"}/><text x={45+i*77} y="35" fill="white" textAnchor="middle" fontSize="14">{v?"T":"F"}</text><text x={45+i*77} y="68" fill="currentColor" textAnchor="middle" fontSize="13">{i}</text></g>)}</svg><p>例如 [F,T,F,F,T,T,T,T]，在下标 3 看到 F，不能推出左边都是 F；直接丢掉左半会错过下标 1。这个反例不是生产模型。先证明单调性，再选择二分。</p></div>}
      </div>
    </section>
    <nav className={s.readingNav}><Link href="/learn/binary-search">前置：有序数组里的二分查找 →</Link><Link href="/learn">查看全部实验</Link></nav>
    <noscript><p>交互需启用 JavaScript；下方完整原理、例子和代码仍可阅读。</p></noscript>
    {children}
    <section className={s.fullCode} data-pagefind-body><h2>enough：尽早返回，避免累计溢出</h2><p>下例适用 1 ≤ n ≤ 200000、1 ≤ kᵢ ≤ 10⁹、0 ≤ target ≤ 10⁹，参数已经校验，机器非空。fastest 与 target 都用 long long，上界最多 10¹⁸。累加前先比较剩余需求，避免把所有机器的产量直接相加。超出这些范围需要重新验证整数表示，不可盲目照搬。</p><pre tabIndex={0}><code>{`bool enough(long long sec) {
  long long made = 0;
  for (long long k : periods) {
    long long add = sec / k;
    if (add >= target - made) return true;
    made += add;
  }
  return made >= target;
}
// fastest = *min_element(periods.begin(), periods.end());
${ANSWER_CODE.join("\n")}`}</code></pre></section>
    <footer className={s.note}>教学结构参考 <a href="https://github.com/andyhuo520/aetherviz-master">AetherViz Master（MIT）</a>，本站独立原生 SVG 实现，无新增图形库。图解强调连续观察；正确性来自单调性与区间不变量。</footer>
  </article>;
}
