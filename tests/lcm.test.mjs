import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createJiti} from 'jiti';
const jiti=createJiti(import.meta.url,{alias:{'@':new URL('..',import.meta.url).pathname}});
const api=await jiti.import('../lib/visualizations/lcm.ts');
const {lcmModel:model,lcmFrame:frame,lcmPosition:position}=api;
test('lcm: all400 bounded pairs match independent first-positive-multiple oracle',()=>{
 for(let a=1;a<=20;a++)for(let b=1;b<=20;b++){
  const m=model(a,b); let first=1; while(first%a!==0||first%b!==0)first++;
  assert.equal(m.lcm,first);assert.equal(m.lcm,model(b,a).lcm);assert.equal(m.gcd*m.lcm,a*b);assert.ok(m.lcm<=380);
  const divisors=Array.from({length:Math.min(a,b)},(_,i)=>i+1).filter(d=>a%d===0&&b%d===0);assert.equal(m.gcd,divisors.at(-1));
  assert.equal(m.multiplesA.length,b/m.gcd);assert.equal(m.multiplesB.length,a/m.gcd);assert.ok(m.multiplesA.length<=20&&m.multiplesB.length<=20);
  assert.deepEqual(m.multiplesA.filter(v=>m.multiplesB.includes(v)),[m.lcm]);assert.equal(m.events[0],Math.min(a,b));assert.equal(m.events.at(-1),m.lcm);
 }
});
test('lcm: every frame preserves common scale, sorted unique positive events and endpoint',()=>{
 for(let a=1;a<=20;a++)for(let b=1;b<=20;b++){
  const m=model(a,b);assert.equal(new Set(m.events).size,m.events.length);
  for(let i=0;i<=m.events.length;i++){
   const f=frame(a,b,i);assert.equal(f.value,i===0?0:m.events[i-1]);assert.equal(f.done,i===m.events.length);
   assert.ok(f.seenA.every(v=>v>0&&v%a===0&&v<=f.value));assert.ok(f.seenB.every(v=>v>0&&v%b===0&&v<=f.value));
   assert.equal(f.seenA.length,Math.floor(f.value/a));assert.equal(f.seenB.length,Math.floor(f.value/b));
   if(i&&i<m.events.length)assert.ok(f.value%a!==0||f.value%b!==0);
   for(const v of [...f.seenA,...f.seenB]){assert.ok(position(v,m.lcm)>=112&&position(v,m.lcm)<=752);assert.equal(position(v,m.lcm),112+640*v/m.lcm);}
  }
  assert.equal(position(0,m.lcm),112);assert.equal(position(m.lcm,m.lcm),752);
 }
});
test('lcm: boundary and invalid inputs reject unsupported domains',()=>{
 for(const [a,b,result] of [[1,1,1],[1,20,20],[20,1,20],[7,7,7],[3,12,12],[12,3,12],[5,7,35],[6,8,24],[8,12,24],[19,20,380],[20,20,20]])assert.equal(model(a,b).lcm,result);
 for(const v of [undefined,null,NaN,Infinity,-Infinity,-1,0,.5,20.1,21,'6']){assert.throws(()=>model(v,8),RangeError);assert.throws(()=>model(6,v),RangeError);}
 for(const v of [-1,.5,NaN,Infinity,100])assert.throws(()=>frame(6,8,v),RangeError);
 assert.equal(model(model(3,12).lcm,10).lcm,60);assert.notEqual(3*12*10,60);
});
test('lcm: static lesson, date, canonical and two-way GCD/hub routes stay coherent',async()=>{
 const {lessons}=await jiti.import('../lib/visualizations/lessons.ts');const {renderLessonMarkdown,lessonStructuredData}=await jiti.import('../lib/visualizations/lesson-publication.ts');
 const l=lessons['least-common-multiple'],md=renderLessonMarkdown('least-common-multiple');assert.equal(l.published,'2026-10-15');assert.equal(l.updated,l.published);assert.equal(l.notesSlug,null);
 for(const v of ['最小正整数','1–20','380','互质整除引理','360','两两折叠','共同倍数集合','先除后乘'])assert.ok(md.includes(v),v);
 assert.match(lessonStructuredData('least-common-multiple')['@graph'][0].url,/\/learn\/least-common-multiple$/);
 for(const p of ['app/learn/[slug]/page.tsx','app/learn/page.tsx','components/visualizations/EuclideanExperience.tsx'])assert.ok(readFileSync(new URL('../'+p,import.meta.url),'utf8').includes('least-common-multiple'),p);
 assert.equal(lessons['coordinate-distance'].published,'2026-10-14');assert.equal(lessons['euclidean-algorithm'].published,'2026-10-13');
});
test('lcm: real React SSR has two meaningful tracks, full code, controls and no-JS answer',async()=>{
 const ts=await import('typescript'),React=await import('react'),server=await import('react-dom/server'),runtime=await import('react/jsx-runtime');const src=readFileSync(new URL('../components/visualizations/LcmExperience.tsx',import.meta.url),'utf8');
 const js=ts.default.transpileModule(src,{compilerOptions:{module:ts.default.ModuleKind.CommonJS,jsx:ts.default.JsxEmit.ReactJSX}}).outputText;
 const deps={'react':React,'react/jsx-runtime':runtime,'next/link':{default:({children,...p})=>React.createElement('a',p,children)},'@/components/home/usePrefersReducedMotion':{usePrefersReducedMotion:()=>false},'@/lib/visualizations/lcm':api,'./LcmExperience.module.css':{default:new Proxy({},{get:(_,k)=>String(k)})}};
 const out={};new Function('exports','require',js)(out,k=>{assert.ok(k in deps,k);return deps[k];});const html=server.renderToStaticMarkup(React.createElement(out.LcmExperience,null,'static lesson'));
 for(const text of ['<svg','<path','<title>','<desc>','首次共同落点','正整数a','正整数b','倍数回放进度','<noscript>','static lesson','const result = (a / d) * b; // 24'])assert.ok(html.includes(text),text);
 const code=html.match(/<code>([\s\S]*?)<\/code>/)[1];assert.equal(code.split('\n').length,9);assert.ok(!code.includes('\\n'));assert.equal(new Function(code+'\nreturn result')(),24);
 assert.equal((html.match(/data-row="a"/g)||[]).length,4);assert.equal((html.match(/data-row="b"/g)||[]).length,3);assert.equal((html.match(/data-value="24"/g)||[]).length,2);assert.ok(!html.includes('NaN'));
 assert.match(src,/disabled=\{reduced\}/);assert.match(src,/visibilitychange/);assert.match(src,/clearInterval/);assert.match(src,/setPlaying\(false\)/);assert.match(src,/tabIndex=\{0\}/);
 const css=readFileSync(new URL('../components/visualizations/LcmExperience.module.css',import.meta.url),'utf8');for(const v of ['overflow-x:auto','focus-visible','prefers-reduced-motion','min-width:720px'])assert.ok(css.includes(v));
});
