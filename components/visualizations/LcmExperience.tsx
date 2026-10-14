"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/components/home/usePrefersReducedMotion";
import { lcmModel, lcmFrame, lcmPosition } from "@/lib/visualizations/lcm";
import s from "./LcmExperience.module.css";

export function LcmExperience({ children }: { children: ReactNode }) {
  const [a, setA] = useState(6), [b, setB] = useState(8);
  const [step, setStep] = useState(lcmModel(6, 8).events.length), [playing, setPlaying] = useState(false);
  const reduced = usePrefersReducedMotion(), m = lcmFrame(a, b, step);
  useEffect(() => {
    if (!playing || reduced || m.done) return;
    const id = setInterval(() => setStep(v => Math.min(v + 1, m.events.length)), 650);
    return () => clearInterval(id);
  }, [playing, reduced, m.done, m.events.length]);
  useEffect(() => { if (!reduced) return; const id = requestAnimationFrame(() => setPlaying(false)); return () => cancelAnimationFrame(id); }, [reduced]);
  useEffect(() => { const stop = () => { if (document.hidden) setPlaying(false); }; document.addEventListener("visibilitychange", stop); return () => document.removeEventListener("visibilitychange", stop); }, []);
  function change(aa: number, bb: number) { const next = lcmModel(aa, bb); setPlaying(false); setA(aa); setB(bb); setStep(next.events.length); }
  const status = step === 0 ? "0只是起点，不是正倍数。下一步从最小的正落点开始。" : m.done ? `${m.lcm}同时是${a}和${b}的倍数；前面没有共同的正落点。` : `${m.value}是${m.value % a === 0 ? a : b}的倍数，还不是两个数共同的正落点。`;
  return <article lang="zh-CN" className={s.lesson}>
    <header className={s.header}><p>算法 / 整除与倍数</p><h1>最小公倍数 <span>Least common multiple</span></h1><p>沿两排倍数向前走，找到第一次共同的正落点。</p></header>
    <div className={s.controls}>{[["a", a], ["b", b]].map(([name, value]) => <label key={name}>步长 {name} <strong>{value}</strong><input aria-label={`正整数${name}`} type="range" min="1" max="20" step="1" value={value} onChange={e => change(name === "a" ? Number(e.target.value) : a, name === "b" ? Number(e.target.value) : b)} /></label>)}</div>
    <nav className={s.actions} aria-label="最小公倍数预设"><button onClick={() => change(6, 8)}>6 和 8 / 重置</button><button onClick={() => change(5, 7)}>互质 5 和 7</button><button onClick={() => change(3, 12)}>整除 3 和 12</button><button onClick={() => change(7, 7)}>相等 7 和 7</button><button onClick={() => change(b, a)}>交换 a / b</button></nav>
    <section className={s.stage} aria-label="同尺度双排倍数实验">
      <div className={s.graph} tabIndex={0} aria-label="倍数数轴，窄屏可在图内左右滚动"><svg viewBox="0 0 800 300" role="img" aria-label={`${a}和${b}的正倍数，首次共同落点${m.lcm}，当前回放到${m.value}`}>
        <title>同一数值必须落在同一横坐标</title><desc>上排是a的倍数，下排是b的倍数。空心0只是起点。实心落点为已经过的倍数，淡色虚线为尚未回放的跳步，最右侧标出第一个共同正倍数。</desc>
        <text x="20" y="30" className={s.small}>从正倍数开始 · 0 不计入</text>
        <rect x="646" y="13" width="134" height="59" rx="6" className={s.badge}/><text x="713" y="36" textAnchor="middle" className={s.badgeText}>首次共同落点</text><text x="713" y="61" textAnchor="middle" className={s.badgeNumber}>{m.lcm}</text>
        <rect x="737" y="84" width="30" height="184" rx="4" className={s.band}/>
        {[[a, m.multiplesA, 140, "a"], [b, m.multiplesB, 245, "b"]].map(([unit, list, yy, name]) => {
          const values = list as number[], y = Number(yy), color = name === "a" ? s.teal : s.orange;
          return <g key={String(name)} className={color}>
            <text x="16" y={y + 6} className={s.rowLabel}>{name} = {unit}</text><path d={`M112 ${y}H752`} className={s.axis}/>
            <circle cx="112" cy={y} r="5" className={s.origin}/><text x="112" y={y + 25} textAnchor="middle" className={s.number}>0</text>
            {values.map((v, i) => { const x = lcmPosition(v, m.lcm), prev = lcmPosition(i * Number(unit), m.lcm), seen = v <= m.value; return <g key={v} data-value={v} data-row={name} data-seen={seen}>
              <path d={`M${prev} ${y - 7}Q${(prev + x) / 2} ${y - 60} ${x} ${y - 7}`} className={seen ? s.jump : s.future}/>
              {values.length <= 8 && <text x={(prev + x) / 2} y={y - 39} textAnchor="middle" className={s.jumpLabel}>+{unit}</text>}
              <circle cx={x} cy={y} r={v === m.lcm ? 7 : 5} className={seen ? s.landing : s.unseen}/><text x={x} y={y + 25} textAnchor="middle" className={s.number}>{v}</text>
            </g>; })}
          </g>;
        })}
        {step > 0 && <path d={`M${lcmPosition(m.value, m.lcm)} 85V270`} className={s.cursor}/>}
        <text x="112" y="295" className={s.small}>两排共用数值刻度 · 改变输入时重新适配视野</text>
      </svg></div>
      <div className={s.formula}><span>gcd({a}, {b}) = {m.gcd}</span><strong>lcm = {a} ÷ {m.gcd} × {b} = {m.lcm}</strong></div>
    </section>
    <div className={s.toolbar}><div className={s.actions}><button disabled={step === 0} onClick={() => { setPlaying(false); setStep(v => v - 1); }}>上一步</button><button disabled={m.done} onClick={() => { setPlaying(false); setStep(v => v + 1); }}>下一落点</button><button className={s.primary} disabled={reduced} onClick={() => { if (m.done) setStep(0); setPlaying(!playing || m.done); }}>{reduced ? "减动画：请单步" : playing && !m.done ? "暂停" : "播放"}</button><button onClick={() => { setPlaying(false); setStep(0); }}>回到起点</button></div><label>落点 {step} / {m.events.length}<input aria-label="倍数回放进度" type="range" min="0" max={m.events.length} step="1" value={step} onChange={e => { setPlaying(false); setStep(Number(e.target.value)); }} /></label></div>
    <p className={s.status} aria-live="polite">{status}</p><p className={s.caption}>回放按数值大小合并两排落点，同值只算一步；不是每步同时各跳一次。答案一直可读，动画只帮助观察。滑块可用方向键与 Home / End；窄屏图形可左右滚动。</p>
    <section className={s.proof}><h2>为什么先除掉共同因子？</h2><p>把共同尺度 d = {m.gcd} 提出来：a = d × {m.x}，b = d × {m.y}，剩下的 {m.x} 和 {m.y} 互质。</p><div className={s.factors}><span>a = <b>{m.gcd}</b> × {m.x}</span><span>b = <b>{m.gcd}</b> × {m.y}</span><strong>lcm = <b>{m.gcd}</b> × {m.x} × {m.y} = {m.lcm}</strong></div><p>一般地，写成 a=dx、b=dy。dxy 同时是两数的倍数。若另一个正公倍数 M=ka 也被 b 整除，则 y 整除 kx；因为 x、y 互质，y 必须整除 k。所以每个正公倍数都包含 dxy，最小的就是它。这里用到互质整除引理，试几个例子本身不能替代证明。</p>
      <pre tabIndex={0} aria-label="最小公倍数同步代码"><code>{`// 本实验仅接受1到20的正整数\nconst a = ${a}, b = ${b};\nlet x = a, y = b;\nwhile (y !== 0) {\n  const r = x % y;\n  x = y; y = r;\n}\nconst d = x; // ${m.gcd}\nconst result = (a / d) * b; // ${m.lcm}`}</code></pre><p className={s.caption}>先除后乘可减小中间值，但不保证任意大数都安全。本课范围内最大结果380；更大整数需要另定精度与溢出策略。绘制倍数的开销不计入上述求值算法。</p>
    </section>
    <section className={s.proof}><h2>三个数，不能直接照搬乘积公式</h2><p>3、12、10 的 gcd 是1，乘积是360，但最小公倍数是60。两数恒等式不能直接变成“三数乘积 ÷ 三数gcd”。</p><p>正确做法是两两折叠：lcm(3,12)=12，再算 lcm(12,10)=12÷2×10=60。每个共同倍数先被12整除，再要求被10整除；没有丢掉任何共同倍数。图中仍只演示两个数。</p></section>
    <noscript><p>默认6和8：正倍数在24第一次相遇，gcd为2，最小公倍数为24。初始完整图、推导与自测可直接阅读；回放需要JavaScript。</p></noscript>
    {children}<nav className={s.footer}><Link href="/learn">← 图解实验室</Link><Link href="/learn/euclidean-algorithm">前置：最大公约数 →</Link></nav><p className={s.caption}>教学结构参考 <a href="https://github.com/andyhuo520/aetherviz-master">AetherViz Master（MIT）</a>；原创原生 SVG，无外部图形脚本。</p>
  </article>;
}
