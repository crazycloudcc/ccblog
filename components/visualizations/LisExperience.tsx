"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { parseValues } from "@/lib/visualizations/traces";
import { lisWitnessTrace, type LisWitnessState } from "@/lib/visualizations/lis-witness";
import s from "./LisExperience.module.css";

const examples = [
  { label: "原例 · tails 不是答案路径", values: [3, 5, 7, 1, 2, 8] },
  { label: "重复 · [2, 2, 2]", values: [2, 2, 2] },
  { label: "递减 · 一直替换结尾", values: [8, 6, 4, 2, 1] },
];

function axis(values: number[]) {
  const low = Math.min(0, ...values);
  const high = Math.max(0, ...values);
  const rough = Math.max(1, (high - low) / 5);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = ([1, 2, 5, 10].find((factor) => factor * magnitude >= rough) ?? 10) * magnitude;
  const min = Math.floor(low / step) * step;
  const max = Math.max(min + step, Math.ceil(high / step) * step);
  return { min, max, ticks: Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => min + i * step) };
}

function InputDiagram({ values, state, nondecreasing }: { values: number[]; state: LisWitnessState; nondecreasing: boolean }) {
  const id = useId();
  const width = Math.max(520, values.length * 58 + 62);
  const left = 56, right = width - 30, top = 32, bottom = 208;
  const domain = axis(values);
  const x = (index: number) => values.length === 1 ? (left + right) / 2 : left + index * (right - left) / (values.length - 1);
  const y = (value: number) => bottom - (value - domain.min) / (domain.max - domain.min) * (bottom - top);
  const selected = new Set(state.witnessIndices);
  const points = state.witnessIndices.map((index) => `${x(index)},${y(values[index])}`).join(" ");
  return <svg className={s.inputSvg} style={{ minWidth: Math.max(400, values.length * 50 + 60) }} viewBox={`0 0 ${width} 260`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
    <title id={`${id}-title`}>{`原数组与一条真实的最长${nondecreasing ? "非下降" : "递增"}子序列`}</title>
    <desc id={`${id}-desc`}>横轴为原数组下标，纵轴为数值。已读 {state.processed} 个元素。真实子序列下标为 {state.witnessIndices.join("、") || "空"}，数值为 {state.witnessIndices.map((i) => values[i]).join("、") || "空"}。圆环标记本步输入；空心点尚未读取。</desc>
    {domain.ticks.map((tick) => <g key={tick}><line className={s.gridLine} x1={left} y1={y(tick)} x2={right} y2={y(tick)} /><text className={s.axisText} x={left - 12} y={y(tick) + 5} textAnchor="end">{tick}</text></g>)}
    {values.map((_, i) => <line key={i} className={s.gridLine} x1={x(i)} y1={top} x2={x(i)} y2={bottom} />)}
    <path className={s.axisLine} d={`M${left} ${top - 15}V${bottom}H${right + 12}`} />
    <text className={s.axisText} x="12" y="21">值</text>
    <text className={s.axisText} x={(left + right) / 2} y="251" textAnchor="middle">原数组下标 i</text>
    {state.witnessIndices.length > 1 && <polyline className={s.witnessPath} points={points} data-witness-indices={state.witnessIndices.join(",")} />}
    {values.map((value, index) => {
      const read = index < state.processed;
      const current = index === state.processed - 1;
      return <g key={index} data-input-index={index}>
        {current && <circle className={s.currentRing} cx={x(index)} cy={y(value)} r="12" />}
        <circle className={!read ? s.unreadPoint : selected.has(index) ? s.witnessPoint : s.otherPoint} cx={x(index)} cy={y(value)} r="6.5" />
        <text className={selected.has(index) ? s.valueSelected : s.valueText} x={x(index)} y={y(value) - 17} textAnchor="middle">{value}</text>
        <text className={s.axisText} x={x(index)} y={bottom + 23} textAnchor="middle">{index}</text>
      </g>;
    })}
  </svg>;
}

function TailsDiagram({ values, state }: { values: number[]; state: LisWitnessState }) {
  const id = useId();
  const width = Math.max(430, state.tails.length * 68 + 78);
  const left = 54, right = width - 18, top = 22, bottom = 88;
  const domain = axis(values);
  const y = (value: number) => bottom - (value - domain.min) / (domain.max - domain.min) * (bottom - top);
  const cell = (right - left) / Math.max(4, state.tails.length);
  return <svg className={s.tailsSvg} style={{ minWidth: Math.max(330, state.tails.length * 58 + 70) }} viewBox={`0 0 ${width} 144`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
    <title id={`${id}-title`}>每种长度的最小结尾，独立的 tails 分布</title>
    <desc id={`${id}-desc`}>{state.tails.length ? state.tails.map((value, i) => `长度 ${i + 1} 的最小结尾是 ${value}，来自原数组下标 ${state.tailIndices[i]}`).join("；") : "尚未读取，tails 为空"}。柱条不是一条原数组路径，负值从零线向下延伸。</desc>
    {domain.ticks.filter((tick, i) => tick === 0 || i % 2 === 0 || i === domain.ticks.length - 1).map((tick) => <g key={tick}><line className={tick === 0 ? s.zeroLine : s.gridLine} x1={left} y1={y(tick)} x2={right} y2={y(tick)} /><text className={s.axisText} x={left - 10} y={y(tick) + 4} textAnchor="end">{tick}</text></g>)}
    {state.tails.map((value, i) => {
      const cx = left + cell * (i + .5);
      return <g key={i} data-tail-length={i + 1}>
        <rect className={i === state.position ? s.activeBar : s.tailBar} x={cx - Math.min(20, cell * .3)} y={Math.min(y(value), y(0))} width={Math.min(40, cell * .6)} height={Math.max(2, Math.abs(y(value) - y(0)))} rx="2" />
        <text className={s.barValue} x={cx} y={value >= 0 ? y(value) - 9 : y(value) + 16} textAnchor="middle">{value}</text>
        <text className={s.axisText} x={cx} y="119" textAnchor="middle">长度 {i + 1}</text>
        <text className={s.sourceText} x={cx} y="137" textAnchor="middle">来自 i={state.tailIndices[i]}</text>
      </g>;
    })}
    {!state.tails.length && <text className={s.axisText} x={(left + right) / 2} y="60" textAnchor="middle">tails = [] · 等待第一个数</text>}
  </svg>;
}

function Code({ state, nondecreasing }: { state: LisWitnessState; nondecreasing: boolean }) {
  const bound = nondecreasing ? "upper_bound" : "lower_bound";
  const lines = ["vector<int> tails;", "for (int x : nums) {", `  auto it = ${bound}(`, "    tails.begin(), tails.end(), x);", "  if (it == tails.end())", "    tails.push_back(x);", "  else *it = x;", "}"];
  const active = state.action === "initial" ? 0 : state.action === "append" ? 5 : 6;
  return <section className={s.codeSection} aria-label="同步 C++ 核心代码">
    <h3><span>C++</span> 维护最小结尾</h3>
    <pre tabIndex={0} role="region" aria-label="C++ 代码，可左右滚动"><code>{lines.map((line, index) => <span key={index} className={index === active ? s.activeCode : s.codeLine} aria-current={index === active ? "step" : undefined}><span className={s.lineNumber} aria-hidden="true">{index + 1}</span>{line}</span>)}</code></pre>
    <p>高亮行对应本步更新。这里只求长度；上图另记前驱下标，恢复真实子序列。</p>
  </section>;
}

export function LisExperience({ children }: { children?: ReactNode }) {
  const id = useId();
  const [values, setValues] = useState(examples[0].values);
  const [draft, setDraft] = useState(examples[0].values.join(", "));
  const [selected, setSelected] = useState("0");
  const [nondecreasing, setNondecreasing] = useState(false);
  // Start with the full counterexample: the distinction is visible at first paint.
  const [step, setStep] = useState(examples[0].values.length);
  const [error, setError] = useState("");
  const trace = lisWitnessTrace(values, nondecreasing);
  const state = trace[step];
  const kind = nondecreasing ? "非下降" : "严格递增";
  const witness = state.witnessIndices.map((index) => values[index]);
  const heading = state.action === "initial" ? "还未读取，从空开始" : state.action === "append" ? "追加结尾，长度 +1" : "替换结尾，长度不变";

  function choose(index: number) {
    const example = examples[index];
    setValues(example.values); setDraft(example.values.join(", ")); setSelected(String(index)); setStep(0); setError("");
  }
  function apply() {
    const result = parseValues(draft);
    if (result.error) { setError(result.error); return; }
    setValues(result.values); setSelected(""); setStep(0); setError("");
  }

  return <article className={s.lab} lang="zh-CN">
    <header className={s.header} data-pagefind-body>
      <h1 data-pagefind-meta="title">最长递增子序列 <span>LIS</span></h1>
      <p>让最小结尾，一步步生长</p>
    </header>
    <p className={s.predictionHint} id={`${id}-prediction`}><strong>先预测，再验证：</strong>先点重置。每次读入前，判断待读值会替换 tails 的哪一项，还是追加到末尾；点“下一步”对照，并说明为什么长度不变或增加 1。</p>
    <div className={s.controls} role="group" aria-label="单步控制" aria-describedby={`${id}-prediction`}>
      <button type="button" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>上一步</button>
      <button type="button" className={s.primary} disabled={step === values.length} onClick={() => setStep((current) => Math.min(values.length, current + 1))}>下一步</button>
      <button type="button" onClick={() => setStep(0)}>重置</button>
      <label className={s.progress}>步骤 {step} / {values.length}<input type="range" min="0" max={values.length} value={step} aria-label="实验进度" aria-valuetext={`已读 ${step} 个，共 ${values.length} 个元素`} onChange={(event) => setStep(Number(event.target.value))} /></label>
    </div>
    <div className={s.stage}>
      <div className={s.graphs}>
        <section className={s.card} aria-label="真实子序列图">
          <div className={s.cardHead}><h2>原数组：真实子序列</h2><span>nums = [{values.join(", ")}]</span></div>
          <div className={s.graphScroll} tabIndex={0} role="region" aria-label="原数组图，可左右滚动"><InputDiagram values={values} state={state} nondecreasing={nondecreasing} /></div>
          <div className={s.legend}><span><i className={s.tealKey} />最长路径</span><span><i className={s.orangeKey} />已读、未入路径</span><span><i className={s.ringKey} />本步输入</span><span><i className={s.hollowKey} />未读</span></div>
          <p className={s.witnessSummary}>真实路径 <strong>[{witness.join(", ")}]</strong><span> · 下标 [{state.witnessIndices.join(", ")}]</span></p>
        </section>
        <section className={`${s.card} ${s.tailsCard}`} aria-label="最小结尾分布">
          <div className={s.cardHead}><h2>最小结尾分布</h2><strong>tails = [{state.tails.join(", ")}]</strong></div>
          <div className={s.graphScroll} tabIndex={0} role="region" aria-label="tails 柱图，可左右滚动"><TailsDiagram values={values} state={state} /></div>
          <p className={s.graphNote}>横轴：子序列长度。每根柱条独立记录最小结尾。</p>
        </section>
      </div>
      <aside className={`${s.card} ${s.narrative}`} aria-label="当前步骤与代码">
        <div className={s.narrativeHead}><h2>{heading}</h2><span>步骤 {step} / {values.length}</span></div>
        <p role="status" aria-live="polite" aria-atomic="true" className={s.message}>已读 {step} / {values.length}。{state.message}</p>
        <div className={s.operation} aria-label="本步变化"><strong>{state.action === "initial" ? "∅" : state.action === "append" ? `+ ${state.value}` : `${state.previousTail} → ${state.value}`}</strong><span>{state.action === "initial" ? "tails 为空" : `长度 ${state.position! + 1} 的最小结尾`}<br />当前答案长度 <b>{state.tails.length}</b></span></div>
        <div className={s.insight}><span aria-hidden="true">!</span><div><h3>tails 不一定是一条真实子序列</h3><p>它只记录每个长度的最小结尾。看柱条下的来源下标，它们可能不按原顺序排列。</p></div></div>
        <Code state={state} nondecreasing={nondecreasing} />
        <p className={s.modeNote}>{kind}：找第一个 {nondecreasing ? "> x（upper_bound）" : "≥ x（lower_bound）"} 的结尾。{nondecreasing ? "相等也能延长。" : "相等不会延长。"}</p>
      </aside>
    </div>
    <p className={s.controlHint}>{step === values.length ? "完整结果。点击重置，从第一个数重新推演。" : "每一步读取一个数，图形、结尾和代码同步更新。"} 窄屏图形可左右滑动；聚焦进度条后可用方向键调节。</p>
    <section className={s.settings} aria-labelledby={`${id}-settings`}>
      <h2 id={`${id}-settings`}>换一组，验证你的理解</h2>
      <div className={s.settingsRow}>
        <label>预设<select value={selected} onChange={(event) => choose(Number(event.target.value))}><option value="" disabled>自定义数组</option>{examples.map((example, index) => <option key={example.label} value={index}>{example.label}</option>)}</select></label>
        <label>递增规则<select value={String(nondecreasing)} onChange={(event) => { setNondecreasing(event.target.value === "true"); setStep(0); }}><option value="false">严格递增 · 相等不延长</option><option value="true">非下降 · 允许相等</option></select></label>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); apply(); }}>
        <label htmlFor={`${id}-input`}>自定义数组</label><div className={s.inputRow}><input id={`${id}-input`} value={draft} maxLength={100} onChange={(event) => setDraft(event.target.value)} aria-describedby={`${id}-help ${id}-error`} aria-invalid={Boolean(error)} /><button type="submit">应用并重置</button></div>
        <p id={`${id}-help`}>1–12 个整数，范围 −999 到 999，以空格或逗号分隔，无需排序。</p>
        <p id={`${id}-error`} className={s.error} role="alert">{error}</p>
      </form>
    </section>
    <noscript><p>交互控制需要 JavaScript。上图已展示完整例子的结果，下方文字推演可直接阅读。</p></noscript>
    {children}
    <footer className={s.footer}><Link href="/learn">← 图解实验室</Link><Link href="/blog/longest-increasing-subsequence">阅读 Notes：推导与可运行 C++ →</Link><Link href="/learn/binary-search">前置实验：二分查找 →</Link></footer>
  </article>;
}
