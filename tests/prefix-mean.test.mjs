import test from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
const jiti = createJiti(import.meta.url, { alias: { '@': new URL('..', import.meta.url).pathname } });
const { prefixModel } = await jiti.import('../lib/visualizations/prefix-sum.ts');
const { lessons } = await jiti.import('../lib/visualizations/lessons.ts');
const { renderLessonMarkdown } = await jiti.import('../lib/visualizations/lesson-publication.ts');
// Exact rational representation of the text's formula; empty means are unavailable.
const mean = (a,l,r) => l === r ? null : [prefixModel(a,l,r).sum,r-l];
test('prefix mean: every signed short interval matches an independent direct rational mean', () => {
 for(let n=1;n<=5;n++) for(let mask=0;mask<3**n;mask++) {
  let k=mask;const a=Array.from({length:n},()=>{const v=[-9,0,9][k%3];k=Math.floor(k/3);return v;});
  for(let l=0;l<=n;l++) for(let r=l;r<=n;r++) {
   if(l===r) {assert.equal(mean(a,l,r),null);continue;}
   let sum=0,count=0;for(let i=l;i<r;i++){sum+=a[i];count++;}
   assert.deepEqual(mean(a,l,r),[sum,count]);
   for(let m=l+1;m<r;m++) {
    const [s1,n1]=mean(a,l,m),[s2,n2]=mean(a,m,r);
    assert.deepEqual([s1+s2,n1+n2],[sum,count]);
   }
  }
 }
});
test('prefix mean: zero, empty, negative singleton, fraction and weighted merge are distinct', () => {
 const a=[4,-6,3,0,5,-2];
 for(const [l,r,want] of [[2,5,[8,3]],[5,6,[-2,1]],[1,6,[0,5]],[0,6,[4,6]],[3,3,null],[0,0,null],[6,6,null]])assert.deepEqual(mean(a,l,r),want);
 assert.notEqual(8/3,Math.trunc(8/3));
 assert.equal((1*3+2*(5/2))/3,8/3);assert.notEqual((3+5/2)/2,8/3);
 const m=prefixModel(a,2,5);assert.notEqual(m.prefix[5]/5-m.prefix[2]/2,8/3);
 assert.deepEqual(mean([9,-9,9,-9,9,-9,9,-9],0,8),[0,8]);
});
test('prefix mean: shared indexable FAQ retains lesson scope and publication identity', () => {
 const l=lessons['prefix-sum'];assert.equal(l.applications.items.length,3);
 const text=l.applications.items.map(x=>x.answer).join('\n');
 for(const phrase of ['l<r','(P[r]−P[l])/(r−l)','0/0没有定义','8/3','n₁μ₁+n₂μ₂','不重叠','上方图形、交互与同步代码仍演示区间求和'])assert.ok(text.includes(phrase));
 const md=renderLessonMarkdown('prefix-sum');
 for(const {question,answer} of l.applications.items){assert.ok(md.includes(question));assert.ok(md.includes(answer));}
 assert.equal(l.published,'2026-10-16');assert.equal(l.updated,'2026-10-17');
 assert.equal(Object.keys(lessons).length,11);
});
