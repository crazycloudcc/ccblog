import test from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
const jiti=createJiti(import.meta.url);
const {prefixModel:model,prefixExamples}=await jiti.import('../lib/visualizations/prefix-sum.ts');
test('prefix sum: every small signed array and every interval match direct sum',()=>{
 for(let n=1;n<=5;n++) for(let mask=0;mask<5**n;mask++) {
  let k=mask;const a=Array.from({length:n},()=>{const v=k%5-2;k=Math.floor(k/5);return v;});
  for(let l=0;l<=n;l++) for(let r=l;r<=n;r++) {
   const m=model(a,l,r); assert.equal(m.prefix.length,n+1);assert.equal(m.prefix[0],0);
   assert.equal(m.sum,a.slice(l,r).reduce((x,y)=>x+y,0));
   for(let i=0;i<=n;i++)assert.equal(m.prefix[i],a.slice(0,i).reduce((x,y)=>x+y,0));
  }
 }
});
test('prefix sum: signed fixture, empty, last element, nonempty zero',()=>{
 const a=[4,-6,3,0,5,-2];assert.deepEqual(model(a,2,5).prefix,[0,4,-2,1,1,6,4]);
 for(const [l,r,sum] of [[2,5,8],[1,4,-3],[0,6,4],[0,1,4],[5,6,-2],[3,4,0],[1,6,0],[0,0,0],[3,3,0],[6,6,0]])assert.equal(model(a,l,r).sum,sum);
 for(const p of prefixExamples)assert.equal(model(p.values,p.l,p.r).sum,p.values.slice(p.l,p.r).reduce((a,b)=>a+b,0));
});
test('prefix sum: invalid arrays and endpoints are rejected, inputs not mutated',()=>{
 for(const a of [[],[10],[-10],[NaN],[Infinity],[.5],Array(9).fill(0),Array(2),[1,,2],['1'],null])assert.throws(()=>model(a,0,0),RangeError);
 for(const [l,r] of [[-1,1],[1,0],[0,3],[.1,1],[0,NaN],[undefined,1],[0,Infinity]])assert.throws(()=>model([1,2],l,r),RangeError);
 const a=Object.freeze([9,-9,9,-9,9,-9,9,-9]);assert.equal(model(a,0,8).sum,0);assert.deepEqual(a,[9,-9,9,-9,9,-9,9,-9]);
});

 test('prefix sum: directory and OG use the prefix lesson rather than LIS fallbacks',async()=>{
 const {readFileSync}=await import('node:fs');
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const svg=read('../public/images/learn/prefix-sum.svg');
 assert.match(svg,/Prefix Sum/);assert.doesNotMatch(svg,/Longest Increasing|Strictly increasing/);
 assert.match(read('../app/learn/page.tsx'),/slug === "prefix-sum"/);
 assert.match(read('../components/visualizations/PrefixSumExperience.tsx'),/<noscript>/);
 });
