"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { pythagoreanModel, nonRightModel, formatMeasure as fmt } from "@/lib/visualizations/pythagorean";
import s from "./PythagoreanExperience.module.css";

type Model = ReturnType<typeof pythagoreanModel>;
function SquareDiagram({ model: m, progress, reference = false }: { model: Model; progress: number; reference?: boolean }) {
  const id = useId(), scale = 280 / m.side;
  const pts = (vertices: readonly (readonly [number, number])[]) => vertices.map(([x,y]) => `${50+x*scale},${45+y*scale}`).join(" ");
  const triangles = reference ? m.initial : m.triangles;
  const final = !reference && progress === 100, start = reference || progress === 0;
  const title = reference ? "摆法一：斜边上的正方形" : final ? "摆法二：两个直角边上的正方形" : progress === 0 ? "相同起点：准备平移四块三角形" : "正在平移：三角形大小和形状不变";
  return <svg viewBox="0 0 370 362" role="img" aria-labelledby={`${id}-title ${id}-desc`} className={s.diagram}>
    <title id={`${id}-title`}>{title}</title>
    <desc id={`${id}-desc`}>{`外框边长 ${m.side}、面积 ${m.outer}。四个全等直角三角形各有直角边 ${m.a} 和 ${m.b}，总面积 ${m.piecesArea}。${start ? `中间正方形边长为斜边 c，面积 ${m.c2}。` : final ? `左上正方形面积 ${m.a2}，右下正方形面积 ${m.b2}，合计 ${m.c2}。` : "中途可能重叠；此时不把空白当作证明中的剩余面积。"}`}</desc>
    <path d="M50 22H330M50 16V28M330 16V28" className={s.dimension} />
    <text x="190" y="14" textAnchor="middle" className={s.dimensionText}>{`a + b = ${m.side}`}</text>
    <rect x="50" y="45" width="280" height="280" className={s.outer} />
    {start && <polygon points={pts(m.center)} className={s.cSquare} />}
    {final && <><rect x="50" y="45" width={m.a*scale} height={m.a*scale} className={s.aSquare} /><rect x={50+m.a*scale} y={45+m.a*scale} width={m.b*scale} height={m.b*scale} className={s.bSquare} /></>}
    {triangles.map((tri,i) => {
      const cx = 50 + tri.reduce((v,p)=>v+p[0],0)/3*scale, cy = 45 + tri.reduce((v,p)=>v+p[1],0)/3*scale;
      return <g key={i} data-piece={i+1}><polygon points={pts(tri)} className={s.triangle} /><text x={cx} y={cy+4} textAnchor="middle" className={s.pieceLabel}>{i+1}</text></g>;
    })}
    {start && <><text x="190" y="181" textAnchor="middle" className={s.areaLabel}>{`c² = ${m.c2}`}</text><text x="190" y="205" textAnchor="middle" className={s.smallLabel}>{`c ${Number.isInteger(m.c) ? "=" : "≈"} ${fmt(m.c)}`}</text><text x={50+m.a*scale/2} y="39" textAnchor="middle" className={s.sideLabel}>{`a=${m.a}`}</text><text x="40" y={45+m.b*scale/2} textAnchor="end" className={s.sideLabel}>{`b=${m.b}`}</text><path d="M50 55H60V45M320 45V55H330M330 315H320V325M60 325V315H50" className={s.rightAngle} /></>}
    {final && <><text x={50+m.a*scale/2} y={45+m.a*scale/2+5} textAnchor="middle" className={m.a < m.b/2 ? s.smallAreaLabel : s.areaLabel}>{`a²=${m.a2}`}</text><text x={50+m.a*scale+m.b*scale/2} y={45+m.a*scale+m.b*scale/2+5} textAnchor="middle" className={m.b < m.a/2 ? s.smallAreaLabel : s.areaLabel}>{`b²=${m.b2}`}</text><text x={50+m.a*scale/2} y="39" textAnchor="middle" className={s.sideLabel}>{`a=${m.a}`}</text><text x={50+m.a*scale+m.b*scale/2} y="343" textAnchor="middle" className={s.sideLabel}>{`b=${m.b}`}</text></>}
    {!reference && progress > 0 && progress < 100 && <text x="190" y="349" textAnchor="middle" className={s.smallLabel}>平移中 · 允许重叠，终点再比较剩余面积</text>}
    <text x="190" y="361" textAnchor="middle" className={s.visuallyHiddenText}>{title}</text>
  </svg>;
}

export function PythagoreanExperience({ children }: { children?: ReactNode }) {
  const id = useId();
  const [a,setA]=useState(3), [b,setB]=useState(4), [progress,setProgress]=useState(100), [angle,setAngle]=useState(60);
  const m = pythagoreanModel(a,b,progress/100), counter = nonRightModel(angle);
  const phase = progress === 0 ? 0 : progress === 100 ? 2 : 1;
  const captions = ["先看斜边 c 围出的正方形", "只移动，不拉伸、不剪开", "去掉相同部分，余下面积相等"];
  const reset = () => { setA(3); setB(4); setProgress(0); setAngle(60); };
  return <article lang="zh-CN" className={s.lab} data-pagefind-body>
    <header className={s.header}><div><p className={s.eyebrow}>几何 / 面积拼补</p><h1 data-pagefind-meta="title">勾股定理 <span>Pythagorean theorem</span></h1></div><p>同样的四块三角形，<br />留下相等的面积。</p></header>
    <nav className={s.controls} aria-label="证明步骤">{["1 观察斜边平方","2 移动三角形","3 比较两块平方"].map((label,i)=><button key={label} aria-pressed={phase===i} onClick={()=>setProgress([0,50,100][i])}>{label}</button>)}<button onClick={reset}>重置</button></nav>
    <div className={s.sliders}>{([["a",a,setA],["b",b,setB]] as const).map(([label,value,setter])=><label key={label} htmlFor={`${id}-${label}`}><strong>{label} = {value}</strong><input id={`${id}-${label}`} aria-label={`直角边 ${label}`} type="range" min="1" max="8" step="1" value={value} onChange={e=>setter(Number(e.target.value))} /><span>1–8</span></label>)}</div>
    <section className={s.stage} aria-label="同一外框的两种摆法"><figure><figcaption><strong>摆法一 · c²</strong><span>保留参照</span></figcaption><SquareDiagram model={m} progress={0} reference /></figure><figure><figcaption><strong>{phase===2?"摆法二 · a² + b²":phase===1?"平移四块三角形":"从相同摆法开始"}</strong><span>{progress}%</span></figcaption><SquareDiagram model={m} progress={progress} /></figure></section>
    <div className={s.progress}><label htmlFor={`${id}-progress`}>移动进度</label><input id={`${id}-progress`} type="range" min="0" max="100" step="1" value={progress} onChange={e=>setProgress(Number(e.target.value))} /><span>{progress}%</span></div>
    <section className={s.conclusion} aria-live="polite" aria-atomic="true"><h2>{captions[phase]}</h2><p className={s.equation}>{phase===2?<><span className={s.teal}>{m.c2}</span><small>c²</small><b>=</b><span className={s.teal}>{m.a2}</span><small>a²</small><b>+</b><span className={s.blue}>{m.b2}</span><small>b²</small></>:phase===0?`c² = ${m.outer} − ${m.piecesArea} = ${m.c2}`:`四块总面积 = 4 × ${a} × ${b} ÷ 2 = ${m.piecesArea}`}</p><p>{phase===1?"每块只有平移，大小和形状都不变。中途可能重叠，不用此时的空白面积作证明；拖到终点看两块完整正方形。":`相同外框 (a+b)² = ${m.outer}，减去同样四块三角形 4×ab/2 = ${m.piecesArea}，剩余面积都是 ${m.c2}。`}</p></section>
    <p className={s.hint}>调节 a、b，图形与算式同步变化。所有滑块支持方向键；Home / End 到两端。颜色之外，也用 a²、b²、c² 与 1–4 编号区分区域。</p>
    <section className={s.reason}><h2>中间看起来像正方形，为什么它真的是？</h2><p>四条边都是三角形的斜边 c，所以等长。任一内角加上相邻两个锐角等于 180°；直角三角形的两个锐角之和是 90°，所以这个内角也是 90°。等边且四个直角，才让中间面积确实等于 c²。</p><p>证明不靠 3、4、5 的巧合：a 和 b 是任意正的直角边。图形滑块的 1–8 范围只是为了方便观察。</p></section>
    <section className={s.counterexample} aria-labelledby={`${id}-counter-title`}><div><p className={s.eyebrow}>反例实验 / 别漏掉直角</p><h2 id={`${id}-counter-title`}>把夹角改变，还会相等吗？</h2><p>两边仍为 3 和 4，让它们的夹角 θ 改变。第三边 c 跟着改变；只有 θ = 90° 时，c² 才等于 25。</p><label htmlFor={`${id}-angle`}>夹角 θ = {angle}°<input id={`${id}-angle`} aria-label="两边夹角" type="range" min="30" max="150" step="15" value={angle} onChange={e=>setAngle(Number(e.target.value))} /></label><p className={s.counterAnswer} aria-live="polite">{`c² ${Number.isInteger(counter.c2)?"=":"≈"} ${fmt(counter.c2)} ${counter.isRight?"=":"≠"} 3² + 4² = 25`}</p><p className={s.hint}>这里用余弦定理计算：c² = 3² + 4² − 2×3×4×cos θ。90° 时 cos θ = 0，才回到勾股定理。</p></div><svg viewBox="0 0 360 300" role="img" aria-label={`两边为3和4、夹角${angle}度的三角形，第三边平方为${fmt(counter.c2)}`}><polygon points={`180,245 306,245 ${180+counter.vertex[0]*42},${245-counter.vertex[1]*42}`} className={s.counterTriangle} /><text x="242" y="272" textAnchor="middle" className={s.sideLabel}>3</text><text x={165+counter.vertex[0]*21} y={235-counter.vertex[1]*21} textAnchor="end" className={s.sideLabel}>4</text><text x={260+counter.vertex[0]*21} y={235-counter.vertex[1]*21} className={s.sideLabel}>c</text><path d={`M210 245 A30 30 0 0 0 ${180+Math.cos(angle*Math.PI/180)*30} ${245-Math.sin(angle*Math.PI/180)*30}`} className={s.angleArc}/><text x="183" y="221" className={s.smallLabel}>{angle}°</text>{counter.isRight&&<path d="M180 229H196V245" className={s.rightAngle}/>}</svg></section>
    <details className={s.quiz}><summary>先想一想：直角边是 5 和 12，斜边是 17 吗？</summary><p>不是。斜边 c = √(5²+12²) = √169 = 13。先加平方，再开平方；不是把两条边直接相加。</p></details>
    {children}
    <footer className={s.footer}><Link href="/learn">← 图解实验室</Link><p>教学结构参考 <a href="https://github.com/andyhuo520/aetherviz-master">AetherViz Master（MIT）</a>，本站独立实现 SVG 面积实验。</p></footer>
  </article>;
}
