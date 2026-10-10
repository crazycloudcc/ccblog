"use client";
import { useEffect, useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { shadowModel, measure, similarityCode, type Point } from "@/lib/visualizations/similar-triangles";
import s from "./SimilarityExperience.module.css";

export function SimilarityExperience({children}: {children?:ReactNode}) {
  const id=useId();
  const [H,setH]=useState(6),[h,setHsmall]=useState(2),[x,setX]=useState(4),[phase,setPhase]=useState(0),[progress,setProgress]=useState(0),[playing,setPlaying]=useState(false),[playFrom,setPlayFrom]=useState(0),[reduced,setReduced]=useState(false);
  const m=shadowModel(H,h,x,progress/100);
  useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{setReduced(media.matches);if(media.matches)setPlaying(false);};update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
  useEffect(()=>{if(!playing||reduced)return;let frame=0;let previous=0;let current=playFrom;const tick=(time:number)=>{if(previous)current=Math.min(100,current+Math.min(time-previous,100)/24);previous=time;setProgress(current);if(current>=100){setPlaying(false);return;}frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[playing,reduced,playFrom]);
  const change=(setter:(value:number)=>void,value:number)=>{setPlaying(false);setProgress(0);setter(value);};
  const step=(p:number)=>{setPlaying(false);setPhase(p);setProgress(p===2?100:0);};
  const reset=()=>{setPlaying(false);setH(6);setHsmall(2);setX(4);setPhase(0);setProgress(0);};
  const unit=Math.min(490/m.maxQ,260/H), left=65, ground=302;
  const rightBig=Math.min(12,m.q*unit/4,H*unit/4), rightSmall=Math.min(9,m.s*unit/4,h*unit/4), arc=Math.min(22,m.s*unit*0.65);
  const project=([a,b]:Point)=>`${left+a*unit},${ground-b*unit}`;
  const pts=(points:Point[])=>points.map(project).join(' ');
  const tip=left+m.q*unit, foot=left+x*unit, head=ground-h*unit, top=ground-H*unit;
  const iu=Math.min(225/m.q,220/H), ix=30, iy=255;
  const inset=(points:Point[])=>points.map(([a,b])=>`${ix+a*iu},${iy-b*iu}`).join(' ');
  const captions=['两个直角，加上同一个影尖角','围绕影尖放大，找到对应的边','先写对应边，再解出影长'];
  return <article className={s.lab} lang="zh-CN" data-pagefind-body>
    <header className={s.header}><div><p className={s.eyebrow}>几何 / 相似与比例</p><h1 data-pagefind-meta="title">相似三角形 <span>Similar triangles</span></h1><p>路灯下，影长和距离怎样变化？</p></div><p className={s.tagline}>先认对应边，<br/>再写比例式。</p></header>
    <nav className={s.controls} aria-label="推导步骤">{['1 找到对应角','2 对齐三角形','3 写出比例'].map((name,i)=><button key={name} aria-pressed={phase===i} onClick={()=>step(i)}>{name}</button>)}<button onClick={reset}>重置</button></nav>
    <div className={s.sliders}>{([['灯高 H',H,setH,4,10],['身高 h',h,setHsmall,1,3],['离灯 x',x,setX,1,8]] as const).map(([name,value,setter,min,max])=><label key={name}><strong>{name} = {value} m</strong><input aria-label={name} type="range" min={min} max={max} step="0.5" value={value} onChange={e=>change(setter,Number(e.target.value))}/><small>{min}–{max}</small></label>)}</div>
    <section className={s.stage} aria-label="路灯下的相似三角形实验">
      <figure className={s.scene}><figcaption><strong>一束光，两组三边</strong><span>同一米制比例尺</span></figcaption><svg viewBox="0 0 620 414" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>灯、人和影尖形成的两个相似直角三角形</title><desc id={`${id}-desc`}>{`灯高${H}米，身高${h}米，人离灯${x}米，影长${measure(m.s)}米，影尖距灯底${measure(m.q)}米。大三角形的底边是x+s，小三角形底边是s。`}</desc>
        <defs><pattern id={`${id}-grid`} width={unit} height={unit} patternUnits="userSpaceOnUse" x={left} y={ground}><path d={`M ${unit} 0 L 0 0 0 ${unit}`} className={s.gridline}/></pattern></defs>
        <rect x="45" y="25" width="540" height="277" fill={`url(#${id}-grid)`}/>
        <polygon points={pts(m.big)} className={s.big}/><polygon points={pts(m.small)} className={s.small}/>
        <path d={`M${left} ${top} L${tip} ${ground}`} className={s.ray}/><path d={`M40 ${ground} H585`} className={s.ground}/>
        <path d={`M${left} ${ground}V${top}`} className={s.lamp}/><circle cx={left} cy={top} r="6" className={s.light}/>
        <path d={`M${foot} ${ground}V${head+9}`} className={s.person}/><circle cx={foot} cy={head+4} r="4" className={s.head}/>
        <path d={`M${left} ${ground-rightBig}h${rightBig}v${rightBig} M${foot} ${ground-rightSmall}h${rightSmall}v${rightSmall}`} className={s.angle}/>
        <circle cx={tip} cy={ground} r="4" className={s.head}/>
        {phase===0&&<path d={`M${tip-arc} ${ground} A${arc} ${arc} 0 0 1 ${tip-arc*Math.cos(Math.atan2(H,m.q))} ${ground-arc*Math.sin(Math.atan2(H,m.q))}`} className={s.angle}/>}
        <text x={left-10} y={(top+ground)/2} textAnchor="end" className={s.label}>H={H}</text><text x={foot-10} y={head+Math.max(15,(ground-head)/2)} textAnchor="end" className={s.blueLabel}>h={h}</text>
        <text x={left} y={top-12} className={s.label}>点光源</text><text x={tip+7} y={ground-12} className={s.label}>影尖 T</text>
        <path d={`M${left} 326H${foot} M${left} 321v10 M${foot} 321v10`} className={s.dimension}/><text x={(left+foot)/2} y="349" textAnchor="middle" className={s.label}>x = {x} m</text>
        <path d={`M${foot} 360H${tip} M${foot} 355v10 M${tip} 355v10`} className={s.shadowLine}/><text x={Math.min(535,Math.max(foot+35,(foot+tip)/2))} y="384" textAnchor="middle" className={s.blueLabel}>s {measure(m.s)} m</text>
        <text x="310" y="409" textAnchor="middle" className={s.label}>q = x + s {measure(m.q)} m（灯底到影尖）</text>
      </svg><p className={s.hint}>网格每格 1 m。只调 x 时视野固定；换 H、h 后自动适配。影长 s 从脚下开始量。</p></figure>
      <figure className={s.inset}><figcaption><strong>把对应边对齐</strong><span>以 T 为中心</span></figcaption><svg viewBox="0 0 310 294" role="img" aria-label={`小三角形围绕影尖放大${measure(m.scale)}倍，最终放大H/h${measure(m.ratio)}倍后覆盖大三角形`}>
        <polygon points={inset(m.big)} className={s.outline}/><polygon points={inset(m.small)} className={s.smallGhost}/><polygon points={inset(m.transformed)} className={s.moving}/>
        <text x="20" y="25" className={s.label}>H ↔ h</text><text x="20" y="281" className={s.label}>x+s ↔ s</text><circle cx={ix+m.q*iu} cy={iy} r="5" className={s.head}/><text x={ix+m.q*iu+10} y={iy+4} className={s.label}>T</text>
      </svg><label className={s.progress}>放大进度 {Math.round(progress)}%<input aria-label="放大进度" type="range" min="0" max="100" value={progress} onChange={e=>{setPlaying(false);setPhase(1);setProgress(Number(e.target.value));}}/></label><div className={s.controls}><button disabled={reduced} onClick={()=>{setPhase(1);setPlayFrom(progress>=100?0:progress);if(progress>=100)setProgress(0);setPlaying(!playing);}}>{playing?'暂停':'播放放大'}</button><button onClick={()=>{setPhase(1);setPlaying(false);setProgress(p=>Math.min(100,p+25));}}>单步 +25%</button></div><p className={s.hint}>{reduced?'已减少动画；使用滑块或单步查看。':'只有彩色三角形在变换，灯和人没有移动。'} 终点放大 H/h {measure(m.ratio)} 倍。</p></figure>
    </section>
    <section className={s.conclusion} aria-live="polite"><h2>{captions[phase]}</h2><p className={s.equation}>{phase===0?'直角相等 + 共同角 → AA 相似':phase===1?'H / h = (x + s) / s':'s = hx / (H − h)'}</p><p>{phase===0?'两个三角形在地面处都是直角，共享影尖处的锐角。相似是根据角度判定，不是因为看起来像。':phase===1?'小三角形的身高 h 对应灯高 H；小底边 s 对应大底边 x+s，而不是离灯距离 x。':`Hs = h(x+s) → (H−h)s = hx。代入：${h} × ${x} / (${H} − ${h}) ${measure(m.s)} m。`}</p><p><strong>固定 H、h 时：s / x = h / (H−h) {measure(m.coefficient)}。</strong>只把 x 翻倍，s 也翻倍；改变 H 或 h，就换了比例系数。</p></section>
    <section className={s.code}><div><h2>跟着图计算</h2><p>数值使用米；x 是人离灯距离，q 是影尖离灯距离。代码只计算，不证明相似；当前实验范围保证差值和结果可表示。</p><p>当前：H={H}，h={h}，x={x}；s {measure(m.s)}，q {measure(m.q)}。</p></div><pre aria-label="与图形同步的 JavaScript 计算代码"><code>{`const H = ${H}, h = ${h}, x = ${x};\n`}{similarityCode.join('\n')}</code></pre></section>
    <details className={s.quiz}><summary>先预测：灯高 6 m、身高 2 m，人从 4 m 走到 8 m，影长和影尖距离各是多少？</summary><p>影长从 2 m 变成 4 m；影尖距灯底从 6 m 变成 12 m。两者不同，不能把影长当成影尖的位置。</p></details>
    {children}<footer className={s.footer}><Link href="/learn">← 图解实验室</Link><p>教学结构参考 <a href="https://github.com/andyhuo520/aetherviz-master">AetherViz Master（MIT）</a>；本站原创 SVG 相似变换，无新增外部脚本。</p></footer>
  </article>;
}
