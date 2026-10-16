"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/components/home/usePrefersReducedMotion";
import { differenceModel, differenceExamples } from "@/lib/visualizations/difference-array";
import s from "./DifferenceArrayExperience.module.css";
const base = [2,-1,3,0,2,-2];
export function DifferenceArrayExperience({children}:{children:ReactNode}) {
  const [l,setL]=useState(1),[r,setR]=useState(4),[value,setValue]=useState(3),[overlap,setOverlap]=useState(false);
  const [step,setStep]=useState(0),[playing,setPlaying]=useState(false);
  const reduced=usePrefersReducedMotion();
  const graph=useRef<HTMLDivElement>(null);
  const updates=[{l,r,value},...(overlap?[{l:3,r:6,value:-2}]:[])];
  const m=differenceModel(base,updates), n=base.length, x=(i:number)=>100+i*90;
  useEffect(()=>{if(!playing||reduced||step===n+1)return;const t=setTimeout(()=>setStep(v=>v+1),1000);return()=>clearTimeout(t);},[playing,reduced,step,n]);
  useEffect(()=>{const stop=()=>{if(document.hidden)setPlaying(false);};document.addEventListener("visibilitychange",stop);return()=>document.removeEventListener("visibilitychange",stop);},[]);
  useEffect(()=>{
    const el=graph.current, svg=el?.querySelector("svg");
    if(!el||!svg)return;
    // Keep the discrete scan cell visible; never animate or move the page itself.
    const scale=svg.getBoundingClientRect().width/760;
    const center=(100+(step-2)*90+45)*scale;
    el.scrollTo({left:step<2?0:Math.max(0,center-el.clientWidth/2),behavior:"instant"});
  },[step]);
  function restart(){setStep(0);setPlaying(false);}
  function choose(i:number){const p=differenceExamples[i];setL(p.l);setR(p.r);setValue(p.value);setOverlap(p.overlap);restart();}
  const cursor=step-2;
  const caption=step===0?`先圈出 [${l},${r})，每项都加 ${value}。${overlap?"再叠加 [3,6) 每项减 2。":""}`:step===1?`只记录起止边界：D[${l}] += ${value}，D[${r}] -= ${value}。${overlap?"另记 D[3]−=2、D[6]+=2；同一位置的事件相加。":""}${l===r?"同一位置加减抵消，空区间不变。":"在 r 处取消增量，因此不影响 r 及后方。"}`:`扫描 i=${cursor}：extra=${cursor?m.extra[cursor-1]:0} + D[${cursor}](${m.delta[cursor]}) = ${m.extra[cursor]}；B[${cursor}] = ${base[cursor]} + (${m.extra[cursor]}) = ${m.result[cursor]}。`;
  return <article lang="zh-CN" className={s.lesson}>
    <header className={s.header}><p>入门 · 算法 · 约 12 分钟</p><h1>差分数组 <span>在左边开始，在右边停止</span></h1><p>一次区间加法，只记两个边界；最后累加，还原每一项。</p></header>
    <noscript><p>图中初始范围与下方完整推导无需 JavaScript；交互需开启脚本。</p></noscript>
    <div className={s.controls}>
      <label>左边界 l = {l}<input aria-label="左边界 l" type="range" min="0" max={r} value={l} onChange={e=>{setL(+e.target.value);restart();}}/></label>
      <label>右边界 r = {r}<input aria-label="右边界 r" type="range" min={l} max={n} value={r} onChange={e=>{setR(+e.target.value);restart();}}/></label>
      <label>增量 v = {value}<input aria-label="增量 v" type="range" min="-4" max="4" value={value} onChange={e=>{setValue(+e.target.value);restart();}}/></label>
    </div>
    <div className={s.actions}><button disabled={step===0} onClick={()=>{setPlaying(false);setStep(v=>v-1);}}>上一步</button><button disabled={step===n+1} onClick={()=>{setPlaying(false);setStep(v=>v+1);}}>下一步</button><button disabled={reduced} onClick={()=>{if(step===n+1)setStep(0);setPlaying(!playing||step===n+1);}}>{reduced?"减动画：请单步":playing&&step<n+1?"暂停":"播放还原"}</button><button onClick={restart}>回到第一步</button></div>
    <section className={s.stage} aria-label="差分边界与前缀还原图形">
      <p className={s.formula}>D[{l}] += {value}；D[{r}] −= {value} {overlap&&<span>D[3] −= 2；D[6] += 2</span>}<span>extra[i] = Σ D[0..i]</span></p>
      <div ref={graph} className={s.graph} tabIndex={0} aria-label="六个元素与第六号哨兵，窄屏可左右滚动"><svg viewBox="0 0 760 370" role="img" aria-label={`第${step+1}步，区间[${l},${r})加${value}${overlap?"，另给[3,6)减2":""}，边界标记${m.delta.join(',')}，最终结果${m.result.join(',')}`}>
        <title>区间带、边界事件与逐格累加</title><desc>绿色范围覆盖要修改的格子，虚线框是结束标记哨兵，不是第七个元素。扫描到哪里，下方结果就显示到哪里。条宽表示位置而非增量大小。</desc>
        {Array.from({length:n+1},(_,i)=><g key={i}><text x={x(i)} y="24" textAnchor="middle" className={s.small}>{i}</text><path d={`M${x(i)} 30V44`} className={s.axis}/></g>)}
        <text x="10" y="24" className={s.small}>边界</text>
        <rect x={x(l)} y="44" width={(r-l)*90} height="34" className={s.cover}/><text x="10" y="67" className={s.small}>加 {value}</text>
        {overlap&&<><rect x={x(3)} y="83" width="270" height="27" className={s.remove}/><text x="10" y="103" className={s.small}>再减 2</text></>}
        {m.delta.map((d,i)=><g key={i} style={{opacity:step>=1?1:.35}}><rect x={x(i)-23} y="126" width="46" height="40" className={i===n?s.sentinel:s.cell}/><text x={x(i)} y="152" textAnchor="middle">{d>0?`+${d}`:d}</text></g>)}
        <text x="10" y="151" className={s.small}>D</text><text x={x(n)} y="184" textAnchor="middle" className={s.small}>哨兵 D[n]</text>
        {base.map((a,i)=><g key={i}>
          {i===cursor&&<rect x={x(i)+2} y="195" width="86" height="162" className={s.active}/>}
          <text x={x(i)+45} y="218" textAnchor="middle" className={s.small}>i={i}</text>
          <text x={x(i)+45} y="249" textAnchor="middle">{a}</text>
          <text x={x(i)+45} y="290" textAnchor="middle">{i<=cursor?m.extra[i]:"·"}</text>
          <rect x={x(i)+4} y="307" width="82" height="43" className={s.selected}/><text x={x(i)+45} y="336" textAnchor="middle">{i<=cursor?m.result[i]:"?"}</text>
        </g>)}
        <text x="10" y="249" className={s.small}>原值 A</text><text x="10" y="290" className={s.small}>累加增量</text><text x="10" y="336" className={s.small}>结果 B</text>
        {cursor>=0&&<path d={`M${x(cursor)} 169V190H${x(cursor)+45}V202`} className={s.boundaries}/>}
      </svg></div>
    </section>
    <p className={s.status} aria-live="polite">{step+1}/{n+2} · {caption}</p>
    <div className={s.actions}>{differenceExamples.map((p,i)=><button key={p.label} aria-pressed={l===p.l&&r===p.r&&value===p.value&&overlap===p.overlap} onClick={()=>choose(i)}>{p.label}</button>)}</div>
    <p className={s.caption}>方向键 / Home / End 调整滑块。改变输入会回到第一步；两段重叠的增量相加。D 是“额外增量”的差分，初始全 0；原数组 A 单独保存。</p>
    <section className={s.proof}><h2>同一组输入，完整代码与结果</h2><pre tabIndex={0} aria-label="同步 JavaScript 代码"><code>{`const a = [${base.join(', ')}];\nconst d = Array(a.length + 1).fill(0);\n${updates.map(u=>`d[${u.l}] += ${u.value}; d[${u.r}] -= ${u.value}; // [${u.l},${u.r})`).join('\n')}\nlet extra = 0;\nconst b = a.map((value, i) => {\n  extra += d[i];\n  return value + extra;\n});\n// d = [${m.delta.join(', ')}]\n// b = [${m.result.join(', ')}]`}</code></pre><p>右端 r=n 时，取消标记写入 D[n]；还原只扫描 i=0 到 n−1，不输出哨兵。完整代码展示最终结果，上方逐步观察它怎样得到。</p></section>
    {children}<footer className={s.footer}><Link href="/learn/prefix-sum">← 前置：前缀和</Link><Link href="/learn">图解实验室</Link></footer>
  </article>;
}
