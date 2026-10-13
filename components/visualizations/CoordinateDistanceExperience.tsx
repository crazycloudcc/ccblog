"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/components/home/usePrefersReducedMotion";
import { coordinateDistance, coordinateScreen, translateCoordinates, type CoordinatePoint } from "@/lib/visualizations/coordinate-distance";
import s from "./CoordinateDistanceExperience.module.css";
const initialA: CoordinatePoint = [-2,1], initialB: CoordinatePoint = [1,-3];
const fmt=(v:number)=>Number(v.toFixed(3)).toString();
export function CoordinateDistanceExperience({children}:{children:ReactNode}) {
  const [a,setA]=useState<CoordinatePoint>(initialA),[b,setB]=useState<CoordinatePoint>(initialB);
  const [progress,setProgress]=useState(1),[playing,setPlaying]=useState(false);
  const reduced=usePrefersReducedMotion(); const m=coordinateDistance(a,b,progress);
  useEffect(()=>{if(!reduced)return;const id=requestAnimationFrame(()=>setPlaying(false));return()=>cancelAnimationFrame(id);},[reduced]);
  useEffect(()=>{if(!playing||reduced||progress>=1)return;const id=setInterval(()=>setProgress(p=>Math.min(1,p+.025)),40);return()=>clearInterval(id);},[playing,reduced,progress]);
  useEffect(()=>{const stop=()=>{if(document.hidden)setPlaying(false);};document.addEventListener('visibilitychange',stop);return()=>document.removeEventListener('visibilitychange',stop);},[]);
  function change(aa:CoordinatePoint,bb:CoordinatePoint){setPlaying(false);setProgress(1);setA(aa);setB(bb);}
  function move(tx:number,ty:number){const next=translateCoordinates(a,b,tx,ty);if(next)change(...next);}
  const [ax,ay]=coordinateScreen(a),[bx,by]=coordinateScreen(b),[cx,cy]=coordinateScreen(m.c);
  const [hx,hy]=coordinateScreen(m.horizontalEnd),[vx,vy]=coordinateScreen(m.verticalEnd);
  const rightX=cx-Math.sign(m.dx)*11,rightY=cy-Math.sign(m.dy)*11;
  const aSide=ax===bx?-1:Math.sign(ax-bx), bSide=-aSide;
  const aVertical=ay===by?-1:Math.sign(ay-by), bVertical=-aVertical;
  const directionX=m.dx===0?'横坐标相同':m.dx>0?'向右':'向左',directionY=m.dy===0?'纵坐标相同':m.dy>0?'向上':'向下';
  return <article lang="zh-CN" className={s.lesson}>
    <header className={s.header}><div><p>几何 / 坐标与距离</p><h1>两点距离 <span>Coordinate distance</span></h1></div><p className={s.motto}>方向有正负，距离不为负。</p></header>
    <div className={s.controls}>{(['A','B'] as const).flatMap((point)=>[0,1].map(i=>{const p=point==='A'?a:b;return <label key={`${point}${i}`}>{point}{i===0?'x':'y'} <strong>{p[i]}</strong><input aria-label={`${point}点${i===0?'横':'纵'}坐标`} type="range" min="-5" max="5" step="1" value={p[i]} onChange={e=>{const next:CoordinatePoint=i===0?[Number(e.target.value),p[1]]:[p[0],Number(e.target.value)];change(point==='A'?next:a,point==='B'?next:b);}}/></label>;}))}</div>
    <nav className={s.actions} aria-label="坐标实验预设"><button onClick={()=>change(initialA,initialB)}>3–4–5 / 重置</button><button onClick={()=>change(b,a)}>交换 A / B</button><button onClick={()=>change([-2,-2],[2,2])}>穿过原点</button><button onClick={()=>change([-3,2],[4,2])}>水平对齐</button><button onClick={()=>change([2,-4],[2,3])}>竖直对齐</button><button onClick={()=>change([-1,2],[-1,2])}>两点重合</button></nav>
    <section className={s.stage} aria-label="等尺度坐标距离实验">
      <div className={s.plot} tabIndex={0} aria-label="两点与辅助线坐标图，窄屏可横向滚动"><svg viewBox="0 0 540 500" role="img" aria-label={`A(${a.join(',')})，B(${b.join(',')})，横向差${m.dx}，纵向差${m.dy}，距离${m.exact}；辅助线进度${Math.round(progress*100)}%`}>
        <title>坐标差给出直角边，距离是直线段 AB 的长度</title><desc>固定正交等比例网格；橙色水平辅助线，蓝色竖直辅助线，绿色直线连接A与B。只有两条非零辅助边时才显示直角标。动画仅显露辅助线，不移动两点。</desc>
        {Array.from({length:11},(_,i)=>i-5).map(v=><g key={v} className={s.grid}><path d={`M${270+v*36} 34V466 M54 ${250-v*36}H486`}/></g>)}
        <path d="M48 250H493 M270 473V27" className={s.axis}/><path d="M486 246l7 4-7 4 M266 34l4-7 4 7" className={s.axis}/>
        {[-4,-2,2,4].map(v=><g key={v}><text x={270+v*36} y="272" textAnchor="middle" className={s.tick}>{v}</text><text x="260" y={255-v*36} textAnchor="end" className={s.tick}>{v}</text></g>)}<text x="258" y="270" textAnchor="end" className={s.tick}>0</text><text x="505" y="248">x</text><text x="283" y="29">y</text>
        {m.triangle&&<polygon points={`${ax},${ay} ${cx},${cy} ${bx},${by}`} className={s.fill} opacity={progress*.8}/>}
        <path d={`M${ax} ${ay}L${bx} ${by}`} className={s.diagonal}/>
        <path d={`M${ax} ${ay}L${hx} ${hy}`} className={s.horizontal}/>{progress>=.5&&<path d={`M${cx} ${cy}L${vx} ${vy}`} className={s.vertical}/>}
        {m.triangle&&progress===1&&<><path data-right-angle="true" d={`M${rightX} ${cy}V${rightY}H${cx}`} className={s.angle}/><circle cx={cx} cy={cy} r="4" className={s.corner}/><text className={s.pointLabel} x={cx+(m.dx>0?12:-12)} y={cy+(m.dy>0?23:-14)} textAnchor={m.dx>0?'start':'end'}>C</text></>}
        <circle cx={ax} cy={ay} r={m.coincident?8:6} className={s.pointA}/>{!m.coincident&&<circle cx={bx} cy={by} r="6" className={s.pointB}/>}
        <text x={ax+aSide*12} y={ay+aVertical*22} textAnchor={aSide<0?'end':'start'} className={s.pointLabel}>{m.coincident?'A = B':'A'}</text>{!m.coincident&&<text x={bx+bSide*12} y={by+bVertical*22} textAnchor={bSide<0?'end':'start'} className={s.pointLabel}>B</text>}
        <text x="270" y="491" textAnchor="middle" className={s.tick}>每格 1 单位 · 两轴同尺度 · 固定视野</text>
      </svg></div>
      <aside className={s.reason} aria-label="图形同步解释"><p className={s.coordinates}>A = ({a.join(', ')})<br/>B = ({b.join(', ')})</p><h2>① 横向变化</h2><p className={s.orange}>Δx = {b[0]} − ({a[0]}) = {m.dx}</p><p>{directionX}{m.dx!==0&&` ${m.horizontal} 单位`}。<br/>辅助线长度 |Δx| = {m.horizontal}。</p><h2>② 纵向变化</h2><p className={s.blue}>Δy = {b[1]} − ({a[1]}) = {m.dy}</p><p>{directionY}{m.dy!==0&&` ${m.vertical} 单位`}。<br/>辅助线长度 |Δy| = {m.vertical}。</p><h2>③ 连接得到距离</h2><p className={s.distance}>d = {m.exact}{Number.isInteger(m.distance)?'':` ≈ ${fmt(m.distance)}`}</p><p>{m.coincident?'两点重合，距离为0，没有三角形。':m.triangle?'水平线与竖直线互相垂直，AB 是这个直角三角形的斜边。':'一条辅助线长度为0，图形退化为线段；距离就是另一方向的长度。'}</p></aside>
    </section>
    <div className={s.formula} aria-live="polite"><strong>d² = ({m.dx})² + ({m.dy})² = {m.square}</strong><span>d = √{m.square} = {m.exact}</span></div>
    <div className={s.toolbar}><div className={s.actions}><button className={s.primary} disabled={reduced} onClick={()=>{if(progress>=1)setProgress(0);setPlaying(!playing||progress>=1);}}>{reduced?'减动画：请单步':playing&&progress<1?'暂停':'播放辅助线'}</button><button onClick={()=>{setPlaying(false);setProgress(p=>p>=1?0:Math.min(1,p+.25));}}>单步 / 回到起点</button></div><label>辅助线进度 {Math.round(progress*100)}%<input aria-label="辅助线进度" type="range" min="0" max="1" step="0.01" value={progress} onChange={e=>{setPlaying(false);setProgress(Number(e.target.value));}}/></label></div>
    <p className={s.caption}>A、B 不随播放移动，只有辅助线逐段显露。橙蓝折线路程为 {m.horizontal+m.vertical}，绿色直线距离为 {m.exact}，不要混为一谈。全部滑块支持方向键与 Home / End；窄屏可在图内横向滚动。辅助边的数值统一放在同步解释中，避免遮住坐标刻度与点标签。</p>
    <section className={s.translation}><h2>一起平移，差不变</h2><p>把两点同时移动同一个向量。任一点将越出 −5…5 时禁用该方向，不分别截断。</p><div className={s.actions}>{[[1,0,'一起右移'],[-1,0,'一起左移'],[0,1,'一起上移'],[0,-1,'一起下移']].map(([tx,ty,label])=><button key={label} disabled={!translateCoordinates(a,b,Number(tx),Number(ty))} onClick={()=>move(Number(tx),Number(ty))}>{label}</button>)}</div></section>
    <section className={s.explain}><h2>同一幅图，同一组计算</h2><pre aria-label="坐标距离同步代码"><code>{`// 本实验：每个坐标为 -5 到 5 的整数\nconst A = [${a.join(', ')}];\nconst B = [${b.join(', ')}];\nconst dx = B[0] - A[0]; // ${m.dx}\nconst dy = B[1] - A[1]; // ${m.dy}\nconst d = Math.hypot(dx, dy); // ≈ ${fmt(m.distance)}\n// 精确值：${m.exact}；单位与坐标相同`}</code></pre><p>平方根取非负值。代码显示值可能近似；符号根式是本实验整数输入的精确结果。一般大数输入须检查差值及结果是否有限，Math.hypot 也不能修复已经溢出的坐标相减。</p></section>
    <noscript><p>初始例A=(-2,1)、B=(1,-3)，坐标差3和−4，距离5。完整图形、推导、自测与答案可直接阅读；交互需要JavaScript。</p></noscript>
    {children}<nav className={s.footer}><Link href="/learn">← 图解实验室</Link><Link href="/learn/pythagorean-theorem">前置：勾股定理 →</Link></nav><p className={s.caption}>教学结构参考 <a href="https://github.com/andyhuo520/aetherviz-master">AetherViz Master（MIT）</a>；原创原生 SVG，无外部图形脚本。坐标长度和勾股定理给出推导，试验不能替代一般证明。</p>
  </article>;
}
