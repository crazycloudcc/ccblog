import test from 'node:test';
import assert from 'node:assert/strict';
import {createJiti} from 'jiti';
import {readFileSync} from 'node:fs';
const jiti=createJiti(import.meta.url);
const {differenceModel:model,differenceExamples}=await jiti.import('../lib/visualizations/difference-array.ts');
test('difference arrays: exhaustive signed arrays and single updates match direct updates',()=>{
 for(let n=1;n<=5;n++)for(let code=0;code<3**n;code++){
  let q=code;const a=Array.from({length:n},()=>{const v=q%3-1;q=Math.floor(q/3);return v;});
  for(let l=0;l<=n;l++)for(let r=l;r<=n;r++)for(let value=-2;value<=2;value++){
   const m=model(a,[{l,r,value}]);assert.deepEqual(m.result,a.map((v,i)=>v+(l<=i&&i<r?value:0)));assert.equal(m.delta.length,n+1);assert.equal(m.delta.reduce((x,y)=>x+y,0),0);
  }
 }
});
test('difference arrays: every pair of small updates is additive and commutes',()=>{
 for(let n=1;n<=4;n++){
  const a=Array.from({length:n},(_,i)=>i-2),us=[];for(let l=0;l<=n;l++)for(let r=l;r<=n;r++)for(let value=-2;value<=2;value++)us.push({l,r,value});
  for(const u of us)for(const v of us){const m=model(a,[u,v]);assert.deepEqual(m.result,a.map((a,i)=>a+(u.l<=i&&i<u.r?u.value:0)+(v.l<=i&&i<v.r?v.value:0)));assert.deepEqual(m,model(a,[v,u]));}
 }
});
test('difference arrays: examples, sentinel and invalid inputs',()=>{
 const a=Object.freeze([2,-1,3,0,2,-2]);
 assert.deepEqual(model(a,[{l:1,r:4,value:3},{l:3,r:6,value:-2}]).result,[2,2,6,1,0,-4]);
 for(const p of differenceExamples){const us=[p,...(p.overlap?[{l:3,r:6,value:-2}]:[])];assert.deepEqual(model(a,us).result,a.map((v,i)=>v+us.reduce((s,u)=>s+(u.l<=i&&i<u.r?u.value:0),0)));}
 for(const a of [[],[10],Array(2),[NaN],null])assert.throws(()=>model(a,[]),RangeError);
 for(const us of [null,Array(2),Array(9).fill({l:0,r:1,value:1}),[{l:-1,r:1,value:1}],[{l:1,r:0,value:1}],[{l:0,r:3,value:1}],[{l:0,r:1,value:NaN}],[{l:0,r:1,value:.1}]])assert.throws(()=>model([1,2],us),RangeError);
 assert.deepEqual(model(a,[]).result,a);
});
test('difference arrays: lesson, discoverability, OG and reduced-motion controls',async()=>{
 const {lessons,lessonExtensions}=await jiti.import('../lib/visualizations/lessons.ts');const l=lessons['difference-array'];assert.equal(l.published,'2026-10-17');assert.equal(l.notesSlug,null);assert.equal(lessonExtensions['prefix-sum'].slug,'difference-array');
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 assert.match(read('../public/images/learn/difference-array.svg'),/Difference Array/);assert.doesNotMatch(read('../public/images/learn/difference-array.svg'),/Longest Increasing/);
 assert.match(read('../app/learn/page.tsx'),/slug === "difference-array"/);
 const ui=read('../components/visualizations/DifferenceArrayExperience.tsx');assert.match(ui,/<noscript>/);assert.match(ui,/el.scrollTo/);assert.match(ui,/behavior:"instant"/);assert.match(read('../components/visualizations/DifferenceArrayExperience.module.css'),/aria-pressed="true"/);assert.match(ui,/disabled=\{reduced\}/);assert.match(ui,/aria-live="polite"/);assert.match(ui,/visibilitychange/);assert.match(ui,/setValue\(\+e.target.value\);restart\(\)/);
});
