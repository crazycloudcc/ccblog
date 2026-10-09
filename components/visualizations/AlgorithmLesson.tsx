"use client";

import { useState } from "react";
import { binaryTrace, lisTrace, parseValues } from "@/lib/visualizations/traces";
import styles from "./AlgorithmLesson.module.css";

const presets = {
  "binary-search": [
    { label: "命中右端：找 9", values: [1, 3, 5, 7, 9], target: 9 },
    { label: "目标不存在：找 6", values: [1, 3, 5, 7, 9], target: 6 },
    { label: "两格窗口：找 3", values: [1, 3], target: 3 },
    { label: "只剩一格：找 5", values: [5], target: 5 },
  ],
  "longest-increasing-subsequence": [
    { label: "相等的 2：严格与非下降", values: [2, 2, 2], target: 0 },
    { label: "原文示例：最小结尾", values: [10, 9, 2, 5, 3, 7, 101], target: 0 },
    { label: "tails 不是原子序列", values: [3, 5, 7, 1, 2, 8], target: 0 },
    { label: "递减：不断替换", values: [6, 5, 4, 3, 2, 1], target: 0 },
  ],
};

export function AlgorithmLesson({ slug }: { slug: keyof typeof presets }) {
  const binary = slug === "binary-search";
  const first = presets[slug][0];
  const [values, setValues] = useState<number[]>([...first.values]);
  const [draft, setDraft] = useState(first.values.join(" "));
  const [target, setTarget] = useState(first.target);
  const [targetDraft, setTargetDraft] = useState(String(first.target));
  const [alternative, setAlternative] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [preset, setPreset] = useState("0");
  const search = binaryTrace(binary ? values : [], target, alternative);
  const lis = lisTrace(binary ? [] : values, alternative);
  const count = binary ? search.length : lis.length;
  const index = Math.min(step, count - 1);
  const state = search[index];
  const tail = lis[index];

  function apply() {
    const parsed = parseValues(draft);
    if (parsed.error) { setError(parsed.error); return; }
    if (binary && parsed.values.some((v, i) => i > 0 && v < parsed.values[i - 1])) {
      setError("二分查找需要非递减的有序数组，请先把数字从小到大排列。"); return;
    }
    if (binary && (!/^-?\d+$/.test(targetDraft.trim()) || !Number.isSafeInteger(Number(targetDraft)) || Math.abs(Number(targetDraft)) > 999)) {
      setError("查找目标必须是 -999 到 999 的整数。"); return;
    }
    setValues(parsed.values); setTarget(Number(targetDraft)); setStep(0); setError(""); setPreset("");
  }
  function choose(value: string) {
    const selected = presets[slug][Number(value)];
    setPreset(value); setValues([...selected.values]); setDraft(selected.values.join(" "));
    setTarget(selected.target); setTargetDraft(String(selected.target)); setStep(0); setError("");
  }

  return <section className={styles.lesson} aria-label="交互实验" data-pagefind-ignore>
    <div className={styles.card}>
      <h2 className="text-xl font-semibold">01 / 选一个实验</h2>
      <div className={`${styles.controls} mt-4`}>
        <label className={styles.field}>示例<select value={preset} onChange={(e) => choose(e.target.value)}>
          <option value="" disabled>自定义输入</option>
          {presets[slug].map((p, i) => <option key={p.label} value={String(i)}>{p.label}</option>)}
        </select></label>
        <label className={styles.field}>{binary ? "更新规则" : "子序列规则"}<select value={String(alternative)} onChange={(e) => { setAlternative(e.target.value === "true"); setStep(0); }}>
          <option value="false">{binary ? "正确：跳过 mid" : "严格递增：第一个 ≥ x"}</option>
          <option value="true">{binary ? "错误：保留 mid（观察停滞）" : "非下降：第一个 > x"}</option>
        </select></label>
      </div>
      <form className={`${styles.controls} mt-4`} onSubmit={(e) => { e.preventDefault(); apply(); }}>
        <label className={styles.field}>数组<input value={draft} onChange={(e) => setDraft(e.target.value)} aria-describedby="input-help input-error" maxLength={100} /></label>
        {binary && <label className={styles.field}>查找目标<input value={targetDraft} onChange={(e) => setTargetDraft(e.target.value)} inputMode="numeric" maxLength={5} aria-describedby="input-error" /></label>}
        <button className={styles.button} type="submit">应用输入</button>
      </form>
      <p id="input-help" className={styles.caption}>1–12 个整数，范围 -999 到 999，以空格或英文逗号分隔。修改后点击“应用输入”，图中才会更新。</p>
      <p id="input-error" role="alert" className={styles.error}>{error}</p>
    </div>

    <div className={styles.card}>
      <h2 className="text-xl font-semibold">02 / {binary ? "让搜索窗口走一步" : "读入一个数，更新最小结尾"}</h2>
      {binary ? <>
        <div className={styles.metrics}><span>target = {target}</span><span>lo = {state.lo}</span><span>hi = {state.hi}</span><span>mid = {state.mid ?? "—"}</span><span>窗口长度 = {Math.max(0, state.hi - state.lo + 1)}</span></div>
        <ol className={styles.cells} aria-label="数组与当前搜索窗口">{values.map((v, i) => <li key={i} className={`${styles.cell} ${i < state.lo || i > state.hi ? styles.outside : styles.active} ${i === state.mid ? styles.current : ""}`}>
          <small>下标 {i}</small><strong>{v}</strong><span className={styles.label}>{[i === state.lo ? "lo" : "", i === state.mid ? "mid" : "", i === state.hi ? "hi" : ""].filter(Boolean).join(" · ") || (i < state.lo || i > state.hi ? "已排除" : "待查")}</span>
        </li>)}</ol>
        <p className={styles.caption}>实线框是本轮闭区间，mid 标出本次比较的位置；虚线与“已排除”表示不再搜索。每个下标从 0 开始。</p>
      </> : <>
        <p className="mt-4">输入顺序（已读 {index} / {values.length}）</p>
        <ol className={styles.cells} aria-label="输入数组与读取进度">{values.map((v, i) => <li key={i} className={`${styles.cell} ${i === index - 1 ? styles.current : ""}`}><small>下标 {i}</small><strong>{v}</strong><span className={styles.label}>{i === index - 1 ? "刚读入" : i < index ? "已读" : "未读"}</span></li>)}</ol>
        <div className={styles.metrics}><span>当前 x = {tail.value ?? "—"}</span><span>{alternative ? "非下降" : "严格 LIS"} 长度 = {tail.tails.length}</span></div>
        <p>tails：每个长度的最小结尾</p>
        {tail.tails.length ? <ol className={styles.cells} aria-label="最小结尾数组">{tail.tails.map((v, i) => <li key={i} className={`${styles.cell} ${styles.active} ${i === tail.position ? styles.current : ""}`}><small>长度 {i + 1}</small><strong>{v}</strong><span className={styles.label}>{i === tail.position ? "本步更新" : "保留"}</span></li>)}</ol> : <p className="py-4">空数组：还没有读入元素</p>}
        <p className={styles.caption}>结尾替换不会缩短已找到的长度。tails 不保存一条完整子序列，也不能直接当作原数组中的答案路径。</p>
      </>}
      <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">{binary ? state.message : tail.message}</p>
      <div className={styles.step}>
        <button className={styles.button} onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={index === 0}>上一步</button>
        <button className={styles.button} onClick={() => setStep((s) => Math.min(count - 1, s + 1))} disabled={index === count - 1}>下一步</button>
        <button className={styles.button} onClick={() => setStep(0)} disabled={index === 0}>回到开头</button>
        <label htmlFor="trace-step">步骤 {index + 1} / {count}</label>
        <input id="trace-step" type="range" min="0" max={count - 1} value={index} onChange={(e) => setStep(Number(e.target.value))} />
      </div>
      <p className={styles.caption}>{binary ? "错误规则会在第一次重复窗口时停止演示，不会真的运行无限循环。这里使用小整数演示更新规则，不模拟 C++ 有符号溢出。" : "本页按原文的二分更新规则计算 tails；展示的是每次读入后的状态，不展开二分内部的每一次比较。"} 手动单步，无自动播放。</p>
    </div>
  </section>;
}
