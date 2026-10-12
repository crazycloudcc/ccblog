"use client";
import {useEffect,useState,type ReactNode} from "react";
import Link from "next/link";
import {usePrefersReducedMotion} from "@/components/home/usePrefersReducedMotion";
import {euclideanTiling} from "@/lib/visualizations/euclidean";
import s from "./EuclideanExperience.module.css";
const colors=["#37766a","#a86140","#466885","#776036","#80658c","#487b83","#8d6650"];
export function EuclideanExperience({children}:{children:ReactNode}){
 const [width,setWidth]=useState(48),[height,setHeight]=useState(18),[step,setStep]=useState(0),[playing,setPlaying]=useState(false),[grid,setGrid]=useState(false);
 const reduced=usePrefersReducedMotion(),m=euclideanTiling(width,height),round=m.rounds[Math.min(step,m.rounds.length-1)],done=step===m.rounds.length;
 useEffect(()=>{if(!reduced)return;const id=requestAnimationFrame(()=>setPlaying(false));return()=>cancelAnimationFrame(id);},[reduced]);
 useEffect(()=>{if(!playing||reduced||done)return;const id=setInterval(()=>setStep(v=>{if(v>=m.rounds.length)return v;return v+1;}),1200);return()=>clearInterval(id);},[playing,reduced,done,m.rounds.length]);
 useEffect(()=>{const stop=()=>{if(document.hidden)setPlaying(false);};document.addEventListener('visibilitychange',stop);return()=>document.removeEventListener('visibilitychange',stop);},[]);
 const scale=Math.min(650/width,240/height),ox=55+(650-width*scale)/2,oy=40+(240-height*scale)/2;
 function reset(w=48,h=18){setPlaying(false);setStep(0);setGrid(false);setWidth(w);setHeight(h);}
 const visible=m.squares.filter(t=>t.round<step),active=done?null:round;
 return <article lang="zh-CN" className={s.lesson}>
 <header className={s.header}><p>算法 / 整除与几何</p><h1>最大公约数 <span>Euclidean Algorithm</span></h1><p className={s.subtitle}>把余数留在画面里</p><p>切去整块正方形，留下更小的矩形。尺寸在变，共同的整除尺度不变。</p></header>
 <nav className={s.actions} aria-label="输入预设"><button onClick={()=>reset()}>48 × 18</button><button onClick={()=>reset(35,22)}>互质 35 × 22</button><button onClick={()=>reset(24,24)}>相等 24 × 24</button><button onClick={()=>reset(height,width)}>交换两边</button><button onClick={()=>reset()}>重置</button></nav>
 <div className={s.controls}><label>宽 <strong>{width}</strong><input aria-label="矩形宽" type="range" min="1" max="60" step="1" value={width} onChange={e=>reset(Number(e.target.value),height)}/></label><label>高 <strong>{height}</strong><input aria-label="矩形高" type="range" min="1" max="60" step="1" value={height} onChange={e=>reset(width,Number(e.target.value))}/></label></div>
 <section className={s.stage} aria-label="欧几里得切分实验">
 <div className={s.stageTitle}><strong>{done?`完成 · gcd(${width}, ${height}) = ${m.gcd}`:`第 ${step+1} / ${m.rounds.length} 轮 · 先预测余数`}</strong><span>正整数边长 · 同一长度单位</span></div>
 <div className={s.toolbar}><div className={s.actions}><button disabled={step===0} onClick={()=>{setPlaying(false);setStep(v=>Math.max(0,v-1));}}>上一步</button><button className={s.primary} disabled={done} onClick={()=>{setPlaying(false);setStep(v=>Math.min(m.rounds.length,v+1));}}>切下一轮</button><button disabled={done||reduced} onClick={()=>setPlaying(!playing)}>{reduced?'减动画：请单步':playing&&!done?'暂停':'播放'}</button><button aria-pressed={grid} onClick={()=>{setPlaying(false);setGrid(!grid);}}>{grid?'隐藏':'显示'}统一砖网格</button></div><p className={s.status} aria-live="polite">{done?`余数为0，最后非零边长是 ${m.gcd}。这也是能沿两边整齐铺满的最大同尺寸正方形边长。`:`${round.a} = ${round.q} × ${round.b} + ${round.r}。本轮切去 ${round.q} 块 ${round.b} × ${round.b} 正方形，${round.r===0?'没有余下矩形，下一步完成。':`留下边长 ${round.b} 和 ${round.r} 的矩形。`}`}</p></div>
 <div className={s.graphScroll} tabIndex={0} aria-label="矩形切分图，可横向滚动"><svg viewBox="0 0 760 340" role="img" aria-label={`${width}乘${height}矩形，已完成${step}轮，${done?`最大公约数${m.gcd}`:`待切${round.q}块边长${round.b}的正方形，余数${round.r}`}${grid?`；统一砖边长${m.gcd}，${width/m.gcd}列、${height/m.gcd}行`:""}`}>
 <title>原矩形内逐轮切分，面积无重叠无遗漏</title><desc>着色块是先前切下的正方形，虚线是本轮切线。最终可以叠加边长为最大公约数的统一网格。</desc>
 <rect x={ox} y={oy} width={width*scale} height={height*scale} fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2"/>
 {visible.map((t,i)=><g key={`${t.round}-${i}`}><rect className={s.tile} x={ox+t.x*scale} y={oy+t.y*scale} width={t.size*scale} height={t.size*scale} fill={colors[t.round%colors.length]} stroke="var(--color-paper)" strokeWidth="1.5"/>{!grid&&t.size*scale>35&&<text x={ox+(t.x+t.size/2)*scale} y={oy+(t.y+t.size/2)*scale+6} textAnchor="middle" className={s.tileLabel}>{t.size}</text>}</g>)}
 {active&&<g><rect x={ox+active.x*scale} y={oy+active.y*scale} width={active.width*scale} height={active.height*scale} fill="none" stroke="var(--color-ink)" strokeWidth="3"/>{active.squares.map((t,i)=><rect key={i} x={ox+t.x*scale} y={oy+t.y*scale} width={t.size*scale} height={t.size*scale} fill="var(--color-code-teal)" fillOpacity=".15" stroke="var(--color-ink)" strokeWidth="1.5" strokeDasharray="5 5"/>)}</g>}
 {grid&&<g>{[{color:"#172e29",width:2.8},{color:"#ffffff",width:1}].map(style=><g key={style.color} stroke={style.color} strokeWidth={style.width}>{Array.from({length:width/m.gcd+1},(_,i)=><path key={`v${i}`} d={`M${ox+i*m.gcd*scale} ${oy}v${height*scale}`}/>)}{Array.from({length:height/m.gcd+1},(_,i)=><path key={`h${i}`} d={`M${ox} ${oy+i*m.gcd*scale}h${width*scale}`}/>)}</g>)}</g>}
 <text x={ox+width*scale/2} y={oy-16} textAnchor="middle">宽 {width}</text><text x="20" y={oy+height*scale/2} textAnchor="middle">{height}</text>
 <text x="380" y="321" textAnchor="middle" className={s.small}>{grid?`统一砖边长 ${m.gcd} · ${width/m.gcd} 列 × ${height/m.gcd} 行`:'颜色区分切分轮次；大块不等于最终统一砖'}</text>
 </svg></div>

 <p className={s.caption}>轮次切换只为观察切分，所有尺寸始终是整数。输入改变时重新开始并重新适配画面，不能比较不同输入的像素长度。减动画偏好下禁用播放，单步仍可使用。网格提前显示会揭示答案。</p>
 </section>
 <section className={s.explain}><h2>{done?'最后非零数，而不是最后的0':'为什么换成余数，共同尺度不变？'}</h2><p>若 d 同时整除 a 和 b，就整除 r=a−qb；反过来，若 d 整除 b 和 r，就整除 a=qb+r。两边的公因数集合相同，最大值也相同。</p><pre aria-label="与当前切分同步的代码"><code>{`// 本课：非负安全整数，不允许同时为0\nlet a = Math.max(width, height);\nlet b = Math.min(width, height);\nwhile (b !== 0) {\n  const r = a % b;\n  a = b;\n  b = r;\n}\nreturn a;\n\n// ${done?`结束：a=${m.gcd}, b=0`:`本轮：a=${round.a}, b=${round.b}, r=${round.r}\n// 下一对：(${round.b}, ${round.r})`}`}</code></pre></section>
 <noscript><p>初始矩形48×18：48=2×18+12，18=1×12+6，12=2×6，故gcd=6。交互需要JavaScript，下面完整解释与答案始终可读。</p></noscript>
 {children}<nav className={s.footer}><Link href="/learn">← 图解实验室</Link><Link href="/learn/binary-search-on-answer">继续比较：算法为何终止 →</Link></nav><p className={s.caption}>教学结构参考 <a href="https://github.com/andyhuo520/aetherviz-master">AetherViz Master（MIT）</a>；原创原生 SVG 实现，无外部图形脚本。几何帮助观察，整除双向推导给出证明。</p>
 </article>;
}
