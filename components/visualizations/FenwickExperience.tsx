"use client";
import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePrefersReducedMotion } from '@/components/home/usePrefersReducedMotion';
import { fenwickModel, fenwickValues, lowbit } from '@/lib/visualizations/fenwick';
import s from './FenwickExperience.module.css';
export function FenwickExperience({children}:{children:ReactNode}) {
  const [mode,setMode]=useState<'query'|'update'>('query'),[index,setIndex]=useState(7),[delta,setDelta]=useState(3),[step,setStep]=useState(0),[playing,setPlaying]=useState(false);
  const reduced=usePrefersReducedMotion(),m=fenwickModel(fenwickValues,mode,index,delta),done=m.path.slice(0,step),current=m.path[step],n=m.values.length;
  useEffect(()=>{if(!playing||reduced||step>=m.path.length)return;const t=setTimeout(()=>{setStep(v=>v+1);if(step+1>=m.path.length)setPlaying(false);},1000);return()=>clearTimeout(t);},[playing,reduced,step,m.path.length]);
  useEffect(()=>{const stop=()=>{if(document.hidden)setPlaying(false);};document.addEventListener('visibilitychange',stop);return()=>document.removeEventListener('visibilitychange',stop);},[]);
  function reset(){setStep(0);setPlaying(false);}
  function select(next:'query'|'update'){setMode(next);setIndex(next==='query'?7:3);reset();}
  const x=(boundary:number)=>130+boundary*65,y=(i:number)=>110+(i-1)*39;
  const partial=done.reduce((sum,i)=>sum+m.bit[i],0);
  const caption=current ? mode==='query'?`接下来取 T[${current}]，覆盖 ${current-lowbit(current)+1}…${current}；然后 i 从 ${current} 减去 lowbit=${lowbit(current)}。`:`接下来给 T[${current}] 加 ${delta}；它覆盖被修改的位置 ${index}。然后 i 从 ${current} 加 lowbit=${lowbit(current)}。`:mode==='query'?`已到 i=0，查询结束。前 ${index} 项之和为 ${partial}。`:`下一下标超过 n=${n}，更新结束。所有覆盖位置 ${index} 的条带均已增加 ${delta}。`;
  const code=mode==='query'?`let sum = 0;\nfor (let i = ${index}; i > 0; i -= i & -i) {\n  sum += bit[i];\n}\n// 已累加 ${done.length} 个块：${partial}`:`// 单点增加，不是赋值；每次演示从原数组开始\nfor (let i = ${index}; i <= ${n}; i += i & -i) {\n  bit[i] += ${delta};\n}\na[${index}] += ${delta}; // a 使用一基下标\n// 已更新 T[${done.join('], T[') || '无'}]`;
  return <article lang="zh-CN" className={s.lesson}>
    <header className={s.header}><p>进阶 · 算法 · 前置：前缀和、二进制 · 约 18 分钟</p><h1 data-pagefind-meta="title">树状数组：把前缀拆成不重叠的块</h1><p>条带位置表示覆盖范围，长度表示项数，不表示和值。查询向左剥离，修改沿覆盖关系向上走。</p></header>
    <noscript>交互需要 JavaScript；初始范围图和下方完整推导可静态阅读。</noscript>
    <div className={s.actions}><button aria-pressed={mode==='query'} onClick={()=>select('query')}>查询前缀</button><button aria-pressed={mode==='update'} onClick={()=>select('update')}>单点增加</button></div>
    <div className={s.controls}><label>{mode==='query'?'前缀项数 k':'修改位置 p'} = {index}<input aria-label={mode==='query'?'前缀项数 k':'修改位置 p'} type="range" min={mode==='query'?0:1} max={n} value={index} onChange={e=>{setIndex(Number(e.target.value));reset();}}/></label>{mode==='update'&&<label>增量 Δ = {delta}<input aria-label="增量" type="range" min="-5" max="5" value={delta} onChange={e=>{setDelta(Number(e.target.value));reset();}}/></label>}</div>
    <div className={s.actions}><button disabled={step===0} onClick={()=>{setPlaying(false);setStep(v=>v-1);}}>上一步</button><button disabled={step===m.path.length} onClick={()=>{setPlaying(false);setStep(v=>v+1);}}>下一步</button><button disabled={reduced||!m.path.length} onClick={()=>{if(step===m.path.length)setStep(0);setPlaying(!playing||step===m.path.length);}}>{reduced?'减少动画：请单步':playing&&step<m.path.length?'暂停':'播放'}</button><button onClick={reset}>重置步骤</button></div>
    <section className={s.stage} aria-label="树状数组覆盖区间舞台"><p className={s.formula}>{mode==='query'?`prefix(${index})：已累加 ${partial}`:`A[${index}]：${m.values[index-1]} → ${m.after[index-1]}（增量 ${delta}）`}</p>
    <div className={s.graph} tabIndex={0} aria-label="树状数组区间图，窄屏可左右滚动"><svg viewBox="0 0 800 490" role="img" aria-label={`${mode==='query'?'前缀查询':'单点增加'}，下标${index}，已处理${step}个块，路径${m.path.join('、')||'空'}`}><title>Fenwick 树的连续覆盖条带</title><desc>第i行T[i]覆盖一基下标i-lowbit(i)+1到i。绿色为已处理块，橙色边框为下一个块；底部显示查询已拼出的互不重叠范围。</desc>
      <text x="15" y="30">一基下标</text>{m.values.map((v,i)=><g key={i}><text x={x(i)+32.5} y="30" textAnchor="middle">{i+1}</text><text x={x(i)+32.5} y="60" textAnchor="middle">{v}</text><path className={s.axis} d={`M${x(i)} 75V430`}/></g>)}<path className={s.axis} d={`M${x(n)} 75V430`}/><text x="15" y="60">原数组 A</text>
      {m.ranges.map(({i,l,r})=><g key={i}><text x="10" y={y(i)+20}>T[{i}] · {lowbit(i)}项</text><rect className={`${s.bar} ${done.includes(i)?s.visited:''} ${current===i?s.active:''}`} x={x(l-1)} y={y(i)} width={(r-l+1)*65} height="28" rx="4"/><text x={x(l-1)+(r-l+1)*32.5} y={y(i)+20} textAnchor="middle">{m.bit[i]+(mode==='update'&&done.includes(i)?delta:0)}</text>{mode==='update'&&done.includes(i)&&<text x="675" y={y(i)+20}>{delta>=0?'+':''}{delta} ✓</text>}</g>)}
      {current!==undefined&&step>0&&<path className={s.arrow} d={`M720 ${y(m.path[step-1])+14}V${y(current)+14}H665`}/>}
      {mode==='update'&&<path className={s.arrow} d={`M${x(index-1)+32.5} 70V426`}/>}
      <text x="10" y="464">{mode==='query'?'已拼出':'被改位置'}</text>
      {mode==='query'?m.path.map((i,j)=><g key={i} className={s.result} style={{opacity:step>j?1:0,transform:step>j?'translateY(0)':'translateY(-10px)'}}><rect x={x(i-lowbit(i))} y="442" width={lowbit(i)*65} height="30"/><text x={x(i-lowbit(i))+lowbit(i)*32.5} y="463" textAnchor="middle">{i-lowbit(i)+1}…{i}</text></g>):<rect className={s.result} x={x(index-1)} y="442" width="65" height="30"/>}
    </svg></div></section>
    <p aria-live="polite" className={s.status}>{step}/{m.path.length} · {caption}</p><p className={s.hint}>滑块支持方向键及 Home / End；切换模式或输入会重置演示，不会累计修改。窄屏保持最小图宽，可横向滚动。减动画模式关闭自动播放，可逐步查看所有状态。</p>
    <section className={s.proof}><h2>当前节点明细</h2><ul>{m.path.map((i,j)=><li key={i}>T[{i}]：覆盖 [{i-lowbit(i)+1},{i}]，{mode==='query'?`和值 ${m.bit[i]}`:`原值 ${m.bit[i]} → 当前值 ${m.bit[i]+(j<step?delta:0)}`}；{j<step?'已处理':j===step?'下一步':'尚未处理'}</li>)}</ul>{!m.path.length&&<p>空前缀，不访问任何节点，和为0。</p>}</section>
    <section className={s.proof}><h2>同一步，对照代码</h2><pre tabIndex={0}><code>{code}</code></pre><p className={s.hint}>T[i] = sum(A[i-lowbit(i)+1…i])。当前路径：{m.path.join(' → ')||'不访问任何块'}。此演示输入限 8 个固定整数；适用条件与复杂度见下方。</p></section>
    {children}<footer className={s.footer}><Link href="/learn/prefix-sum">前置：前缀和</Link><Link href="/learn/difference-array">对比：批量差分</Link><Link href="/learn">图解实验室</Link><span>教学布局参考 AetherViz Master（MIT），本站原生 SVG 实现。</span></footer>
  </article>;
}
