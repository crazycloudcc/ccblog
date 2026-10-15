"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/components/home/usePrefersReducedMotion";
import { prefixModel, prefixExamples } from "@/lib/visualizations/prefix-sum";
import s from "./PrefixSumExperience.module.css";

export function PrefixSumExperience({ children }: { children: ReactNode }) {
  const [example, setExample] = useState(0), [l, setL] = useState(2), [r, setR] = useState(5);
  const [step, setStep] = useState(2), [playing, setPlaying] = useState(false);
  const reduced = usePrefersReducedMotion(), m = prefixModel(prefixExamples[example].values, l, r);
  const n = m.values.length, width = 600 / n, x = (i: number) => 100 + i * width;
  useEffect(() => {
    if (!playing || reduced || step === 2) return;
    const timer = setTimeout(() => setStep(v => v + 1), 1200);
    return () => clearTimeout(timer);
  }, [playing, reduced, step]);
  useEffect(() => { const stop = () => { if (document.hidden) setPlaying(false); }; document.addEventListener("visibilitychange", stop); return () => document.removeEventListener("visibilitychange", stop); }, []);
  function choose(index: number) { const p = prefixExamples[index]; setExample(index); setL(p.l); setR(p.r); setStep(2); setPlaying(false); }
  const signed = (v: number) => v < 0 ? `(${v})` : String(v);
  const captions = [`先取边界 r=${r} 之前的所有项，共 ${r} 项：P[${r}]=${m.prefix[r]}。`, `再对齐要减去的共同前缀 [0,${l})，其和 P[${l}]=${m.prefix[l]}。斜纹表示这些项将被消去。`, l === r ? `两段完全相同，消去后没有元素：[${l},${r}) 是空区间，和为 0。` : `相同项消去后，只留下下标 ${l} 到 ${r-1}，即 [${l},${r})；和为 ${m.sum}。`];
  return <article lang="zh-CN" className={s.lesson}>
    <header className={s.header}><p>入门 · 算法 · 约 12 分钟</p><h1>前缀和 <span>减去共同前缀，留下区间</span></h1><p>边界不是元素：P[k] 累加边界 k 左边的项，右端 r 不包含。</p></header>
    <noscript><p>交互需要 JavaScript；图形初始示例和下方完整文字推导仍可阅读。</p></noscript>
    <div className={s.controls}><label>左边界 l = {l}<input aria-label="左边界 l" type="range" min="0" max={r} value={l} onChange={e => {setL(Number(e.target.value));setPlaying(false);}} /></label><label>右边界 r = {r}<input aria-label="右边界 r" type="range" min={l} max={n} value={r} onChange={e => {setR(Number(e.target.value));setPlaying(false);}} /></label></div>
    <div className={s.actions}><button disabled={step===0} onClick={()=>{setPlaying(false);setStep(v=>v-1);}}>上一步</button><button disabled={step===2} onClick={()=>{setPlaying(false);setStep(v=>v+1);}}>下一步</button><button disabled={reduced} onClick={()=>{if(step===2)setStep(0);setPlaying(!playing||step===2);}}>{reduced?"减动画：请单步":playing&&step<2?"暂停":"播放相减"}</button><button onClick={()=>{setStep(0);setPlaying(false);}}>回到第一步</button></div>
    <section className={s.stage} aria-label="前缀相减图形实验">
      <p className={s.formula}>sum[{l},{r}) = P[{r}] − P[{l}] = {m.prefix[r]} − {signed(m.prefix[l])} = <strong>{m.sum}</strong></p>
      <div className={s.graph} tabIndex={0} aria-label="数组、前缀范围与有符号数值；窄屏可左右滚动"><svg viewBox="0 0 800 400" role="img" aria-label={`数组 ${m.values.join(', ')}；边界 ${l} 到 ${r}，和 ${m.sum}，第 ${step+1} 步`}>
        <title>两段从零开始的前缀对齐相减</title><desc>每个格子对应一项；顶端是边界，下方条形向上为正、向下为负。范围条的长度表示覆盖多少项，不表示和的大小。</desc>
        <defs><pattern id="prefix-cancel" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8L8 0" stroke="currentColor" strokeWidth="1.5"/></pattern></defs>
        <text x="14" y="35" className={s.small}>边界 k</text>
        {m.prefix.map((p,i)=><g key={i}><text x={x(i)} y="35" textAnchor="middle" className={s.small}>{i}</text><path d={`M${x(i)} 43V55`} className={s.axis}/><text x={x(i)} y="375" textAnchor="middle" className={s.small}>P[{i}]</text><text x={x(i)} y="396" textAnchor="middle">{p}</text></g>)}
        {m.values.map((v,i)=><g key={i} className={s.term} style={{opacity: step===2 && (i<l || i>=r) ? .35 : 1}}>
          <rect x={x(i)} y="55" width={width} height="48" className={i>=l&&i<r?s.selected:s.cell}/><text x={x(i)+width/2} y="86" textAnchor="middle">{v}</text><text x={x(i)+width/2} y="122" textAnchor="middle" className={s.small}>A[{i}]</text>
          <rect x={x(i)+width*.32} y={v>=0 ? 285-v*5 : 285} width={width*.36} height={Math.max(1,Math.abs(v)*5)} className={v>=0?s.positive:s.negative}/>
        </g>)}
        <text x="14" y="157" className={s.small}>P[r]</text><rect x="100" y="138" width={r*width} height="27" className={s.cover}/>
        <g style={{opacity:step>=1?1:0}} className={s.term}><text x="14" y="195" className={s.small}>− P[l]</text><rect x="100" y="176" width={l*width} height="27" className={s.remove}/></g>
        <g className={s.moving} style={{transform:step===2?"translateY(-38px)":"translateY(0px)",opacity:step>=1?1:0}}><rect x="100" y="176" width={l*width} height="27" fill="url(#prefix-cancel)" className={s.hatch}/></g>
        <rect x={x(l)} y="138" width={(r-l)*width} height="27" className={s.result} style={{opacity:step===2?1:0}}/>
        <path d={`M${x(l)} 48V214 M${x(r)} 48V214`} className={s.boundaries}/><text x={x(l)} y="231" textAnchor="middle" className={s.small}>{l===r?"l = r":"l"}</text>{l!==r&&<text x={x(r)} y="231" textAnchor="middle" className={s.small}>r</text>}
        <path d="M100 285H700" className={s.axis}/><text x="14" y="289" className={s.small}>数值 0</text><text x="100" y="348" className={s.small}>柱高表示有符号数值；上方范围条只表示项的位置</text>
      </svg></div>

    </section>

    <p className={s.status} aria-live="polite">{step+1}/3 · {captions[step]}</p>
    <div className={s.actions}>{prefixExamples.map((p,i)=><button key={p.label} aria-pressed={example===i && l===p.l && r===p.r} onClick={()=>choose(i)}>{p.label}</button>)}</div>
    <p className={s.caption}>方向键或 Home / End 调整滑块；左边界最多到 r，右边界最少到 l。相等允许空区间。负数不会破坏相减公式，也不保证前缀和递增。动画中答案保持可读。</p>
    <section className={s.proof}><h2>同一组状态，对照同一段代码</h2><pre tabIndex={0} aria-label="同步 JavaScript 代码"><code>{`const a = [${m.values.join(', ')}];\nconst p = [0];\nfor (const value of a) p.push(p[p.length - 1] + value);\nconst l = ${l}, r = ${r}; // 左闭右开\nconst sum = p[r] - p[l]; // ${m.prefix[r]} - ${signed(m.prefix[l])} = ${m.sum}`}</code></pre><p>P = [{m.prefix.join(', ')}]。P[0] = 0 让 l = 0 时仍用同一条公式。共有 n + 1 个前缀边界。</p><p>当前保留项：{m.selected.length ? m.selected.map(signed).join(' + ') : "没有元素"}，结果 {m.sum}。相同前缀值不意味着区间为空，例如六项示例 [4,−6,3,0,5,−2] 的 [1,6) 非空，和仍是 0。</p></section>
    {children}<footer className={s.footer}><Link href="/learn">← 图解实验室</Link></footer>
  </article>;
}
