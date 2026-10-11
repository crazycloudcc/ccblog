"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/components/home/usePrefersReducedMotion";
import { radianModel, unrolledPoints } from "@/lib/visualizations/radians";
import s from "./RadianExperience.module.css";
const fmt=(n:number)=>n.toFixed(3).replace(/\.?0+$/,"") || "0";
const SCALE=46;
export function RadianExperience({children}:{children:ReactNode}) {
  const [radius,setRadius]=useState(1),[degrees,setDegrees]=useState(90),[progress,setProgress]=useState(0),[playing,setPlaying]=useState(false);
  const reduced=usePrefersReducedMotion();const frame=useRef(0);
  const m=radianModel(radius,degrees);
  useEffect(()=>{
    if(reduced){const id=requestAnimationFrame(()=>setPlaying(false));return()=>cancelAnimationFrame(id);}
    if(!playing)return;
    const start=performance.now();
    const tick=(now:number)=>{const next=Math.min(1,progress+(now-start)/2200);setProgress(next);if(next>=1)setPlaying(false);else frame.current=requestAnimationFrame(tick);};
    frame.current=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame.current);
  },[playing,reduced,progress]);
  useEffect(()=>{const stop=()=>{if(document.hidden)setPlaying(false);};document.addEventListener("visibilitychange",stop);return()=>document.removeEventListener("visibilitychange",stop);},[]);
  function changeRadius(r:number){setPlaying(false);setRadius(r);}
  function changeAngle(d:number){setPlaying(false);setDegrees(d);}
  const cx=175,cy=170,R=radius*SCALE;
  const arc=Array.from({length:181},(_,i)=>{const a=m.theta*i/180;return `${cx+R*Math.cos(a)},${cy-R*Math.sin(a)}`;}).join(" ");
  const points=unrolledPoints(radius,m.theta,progress).map(([x,y])=>`${140+x*SCALE},${460-y*SCALE}`).join(" ");
  const endX=cx+R*Math.cos(m.theta),endY=cy-R*Math.sin(m.theta);
  const message=degrees===0?"0°：弧退化为起点，s=0，θ=0。":degrees===360?"360°：完整一圈，起终点重合；弧长是整周长，不是0。":`逆时针转过 ${degrees}°，弧长包含约 ${fmt(m.theta)} 个半径。`;
  return <article lang="zh-CN" className={s.lesson}>
    <header className={s.header}><p>几何 / 角度与比例</p><h1>弧度 <span>Radians</span></h1><p className={s.subtitle}>一段弧，有几个半径长？</p><p>改变半径，保留角度。展开同一段弧，看见 θ = s / r。</p></header>
    <nav className={s.actions} aria-label="实验预设"><button onClick={()=>{changeAngle(180/Math.PI);setProgress(0);}}>1 rad</button><button onClick={()=>changeAngle(90)}>直角 90°</button><button onClick={()=>changeAngle(360)}>完整一圈</button><button onClick={()=>{setPlaying(false);setRadius(1);setDegrees(90);setProgress(0);}}>重置</button></nav>
    <div className={s.controls}>
      <label>半径 r <strong>{fmt(radius)} cm</strong><input aria-label="半径 r" type="range" min="0.5" max="2" step="0.1" value={radius} onChange={e=>changeRadius(Number(e.target.value))}/><span>0.5–2 cm · 固定画面比例</span></label>
      <label>圆心角 <strong>{fmt(degrees)}° = {fmt(m.theta)} rad</strong><input aria-label="圆心角" type="range" min="0" max="360" step="0.001" value={degrees} onChange={e=>changeAngle(Number(e.target.value))}/><span>0–360° · 逆时针单圈</span></label>
    </div>
    <section tabIndex={0} className={s.stage} aria-label="弧度与保长展开实验">
      <div className={s.stageTitle}><strong>同一段弧，两种形状</strong><span>所有长度：cm · 同一比例尺</span></div>
      <svg viewBox="0 0 760 340" role="img" aria-label={`半径${fmt(radius)}厘米，圆心角${fmt(m.theta)}弧度，弧长${fmt(m.length)}厘米；展开${Math.round(progress*100)}%`}>
        <title>圆弧与等长展开曲线</title><desc>青色是所选圆弧，橙色是一个半径长。下方曲线逐渐变直，每一帧保持同样弧长。图形是解析曲线的采样显示。</desc>
        <defs><pattern id="radian-grid" width={SCALE} height={SCALE} patternUnits="userSpaceOnUse"><path d={`M ${SCALE} 0 L 0 0 0 ${SCALE}`} fill="none" stroke="currentColor" strokeOpacity=".06"/></pattern></defs>
        <rect width="760" height="340" fill="url(#radian-grid)"/>
        <text x="32" y="30" className={s.small}>01 / 圆上量弧</text>
        <circle cx={cx} cy={cy} r={R} className={s.circle}/><path d={`M${cx},${cy}L${cx+R},${cy} M${cx},${cy}L${endX},${endY}`} className={s.radius}/>
        <polyline points={arc} className={s.arc}/><circle cx={endX} cy={endY} r="5" className={s.endpoint}/>
        <text x={cx-12} y={cy+22} className={s.small}>O</text><text x={cx+R/2} y={cy+23} textAnchor="middle" className={s.orange}>r</text>
        <text x={cx} y={cy+R+49} textAnchor="middle">{degrees===360?"完整一圈：2π rad":degrees===0?"零角：0 rad":`θ ≈ ${fmt(m.theta)} rad`}</text>
        <g transform="translate(370 68)"><text className={s.formula}>θ = s / r</text><text y="44">{fmt(m.theta)} rad ≈ {fmt(m.length)} / {fmt(radius)}</text><text y="86" className={s.small}>s ≈ {fmt(m.length)} cm</text><text y="117" className={s.small}>同角度下，半径翻倍，弧长也翻倍。</text><text y="148" className={s.small}>这个比值不变，角度就不变。</text></g>
      </svg>
      <label className={s.progress}>展开进度 <strong>{Math.round(progress*100)}%</strong><input aria-label="展开进度" type="range" min="0" max="1" step="0.01" value={progress} onChange={e=>{setPlaying(false);setProgress(Number(e.target.value));}}/></label>
      <div className={s.actions}><button onClick={()=>{if(reduced){setProgress(progress>=1?0:1);return;}if(progress>=1)setProgress(0);setPlaying(!playing);}}>{reduced?"切换起点 / 终点":playing?"暂停展开":"播放展开"}</button><button onClick={()=>{setPlaying(false);setProgress(p=>Math.min(1,p+0.25));}}>单步 +25%</button><button onClick={()=>changeRadius(1)}>单位圆 r=1</button><button onClick={()=>changeRadius(2)}>比较 r=2</button></div>
      <svg viewBox="0 0 760 540" role="img" aria-label={`同长曲线展开${Math.round(progress*100)}%，解析长度${fmt(m.length)}厘米`}>
        <title>保长展开：完整过程固定比例尺</title><desc>整个动画都保留同样长度；曲线可能向左弯或向上伸展，视野包含全过程。</desc>
        <rect width="760" height="540" fill="url(#radian-grid)"/>
        <text x="32" y="24" className={s.small}>02 / 展开弧，长度不变</text>
        <path d="M140 460H730" className={s.guide}/>
        {Array.from({length:7},(_,i)=><g key={i}><path d={`M${140+i*radius*SCALE} 466v8`} className={s.tick}/><text x={140+i*radius*SCALE} y="494" textAnchor="middle" className={s.small}>{i}r</text></g>)}
        <polyline points={points} className={s.arc}/><circle cx="140" cy="460" r="4" className={s.endpoint}/>
        <path d={`M140 518h${radius*SCALE}`} className={s.radius}/><text x={145+radius*SCALE} y="528" className={s.orange}>一个半径长 r = {fmt(radius)} cm</text>
      </svg>
      <p className={s.status} aria-live="polite">{message}</p>
      <p className={s.caption}>下图是圆上所选弧旋转后的同长副本。展开只改变弯曲程度，不改变这段弧的长度。窄屏可横向滚动图形。下方刻度以当前半径为一格；完全展开后，终点在 θ 个半径处。圆与展开图共用固定比例尺。减动画偏好下用单步或直接切换。</p>
    </section>
    <section className={s.explain}><h2>{radius===1?"单位圆：数值相同，量不同":"半径不是1，弧长数值就不等于弧度"}</h2><p>当前 r={fmt(radius)} cm，s≈{fmt(m.length)} cm，θ≈{fmt(m.theta)} rad。{radius===1?"在厘米作长度单位、半径数值为1时，s与θ数值相同；厘米与弧度仍表示不同的量。":"先用弧长除以半径，再把这个比值作为弧度值。"}</p><h3>图形与代码同步</h3><pre aria-label="与图形同步的计算代码"><code>{`const radiusCm = ${fmt(radius)};\nconst degrees = ${degrees};\nconst theta = degrees * Math.PI / 180;\nconst arcCm = radiusCm * theta;\n// theta ≈ ${fmt(m.theta)} rad; arcCm ≈ ${fmt(m.length)} cm\n// 先转换为弧度，再用 s = r * theta。`}</code></pre></section>
    <noscript><p>图形初始例为 r=1 cm、90°=π/2 rad、s=π/2 cm。滑杆与播放需要JavaScript，下方推导与自测答案仍可直接阅读。</p></noscript>
    {children}
    <nav className={s.footer}><Link href="/learn">← 图解实验室</Link><Link href="/learn/similar-triangles">前置：相似与比例 →</Link></nav>
    <p className={s.caption}>教学结构参考 <a href="https://github.com/andyhuo520/aetherviz-master">AetherViz Master（MIT）</a>。本站原创原生 SVG 实现；不加入外部图形脚本。动画辅助观察，定义与相似比例支撑结论。</p>
  </article>;
}
