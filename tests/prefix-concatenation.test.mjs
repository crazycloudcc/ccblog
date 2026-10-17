import test from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
const jiti=createJiti(import.meta.url,{alias:{'@':new URL('..',import.meta.url).pathname}});
const {lessons}=await jiti.import('../lib/visualizations/lessons.ts');
const {renderLessonMarkdown}=await jiti.import('../lib/visualizations/lesson-publication.ts');
// Executable specification of the optional text; not the interactive lesson code.
function virtualPrefix(a) {
 const p=[0n],s=[0n];for(const v of a)p.push(p.at(-1)+BigInt(v));
 for(let k=1;k<p.length;k++)s.push(s.at(-1)+p[k]);
 const triangle=k=>k*(k+1)/2;
 return x=>{
  if(!Number.isSafeInteger(x)||x<0||x>triangle(a.length))throw new RangeError('prefix length');
  let lo=0,hi=a.length;
  while(lo<hi){const mid=lo+Math.ceil((hi-lo)/2);if(triangle(mid)<=x)lo=mid;else hi=mid-1;}
  return s[lo]+p[x-triangle(lo)];
 };
}
test('virtual prefix: independent expanded oracle includes negative, zero, empty and block endpoints',()=>{
 for(let n=1;n<=6;n++)for(let mask=0;mask<3**n;mask++){
  let q=mask;const a=Array.from({length:n},()=>{const v=[-2,0,3][q%3];q=Math.floor(q/3);return v;});
  const b=a.flatMap((_,i)=>a.slice(0,i+1));const f=virtualPrefix(a);
  for(let l=0;l<=b.length;l++){let expected=0n;for(let r=l;r<=b.length;r++){assert.equal(f(r)-f(l),expected);if(r<b.length)expected+=BigInt(b[r]);}}
 }
});
test('virtual prefix: official samples and maximum exact signed range',()=>{
 const f=virtualPrefix([1,10,100,1000]);
 for(const [l,r,v] of [[3,6,121n],[1,10,1234n],[8,8,10n]])assert.equal(f(r)-f(l-1),v);
 const a=Array(100000).fill(100000000);const big=virtualPrefix(a);assert.equal(big(5000050000),500005000000000000n);
 assert.equal(virtualPrefix(a.map(x=>-x))(5000050000),-500005000000000000n);
 assert.equal(big(0),0n);assert.ok(big(5000050000)>BigInt(Number.MAX_SAFE_INTEGER));
 for(const x of [-1,0.5,5000050001,NaN])assert.throws(()=>big(x),RangeError);
});
test('virtual prefix: indexed HTML data and Markdown share optional scope and dates',()=>{
 const l=lessons['prefix-sum'],ext=l.advancedApplication,md=renderLessonMarkdown('prefix-sum');
 assert.equal(l.published,'2026-10-16');assert.equal(l.updated,'2026-10-17');assert.equal(Object.keys(lessons).length,12);
 assert.ok(ext.title.startsWith('可选进阶'));for(const p of ext.paragraphs)assert.ok(md.includes(p));
 for(const t of ['F(x)=S[k]+P[m]','k=N','F(0)=0','F(R)−F(L−1)','O(N+Q log N)','BigInt','不能二分','同步代码仍只演示普通数组求和'])assert.ok(ext.paragraphs.join('').includes(t));
 assert.ok(md.includes('https://atcoder.jp/contests/abc480/tasks/abc480_d'));
});
