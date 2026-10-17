import test from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
const {fenwickModel,lowbit}=await createJiti(import.meta.url).import('../lib/visualizations/fenwick.ts');
test('all short signed arrays: disjoint query cover and exact sum',()=>{
 for(let n=1;n<=7;n++) for(let mask=0;mask<3**n;mask++){
  let m=mask;const a=Array.from({length:n},()=>{const v=m%3-1;m=Math.floor(m/3);return v;});
  for(let k=0;k<=n;k++) {const f=fenwickModel(a,'query',k),cover=f.path.flatMap(i=>Array.from({length:lowbit(i)},(_,j)=>i-lowbit(i)+1+j)).sort((a,b)=>a-b);assert.deepEqual(cover,Array.from({length:k},(_,j)=>j+1));assert.equal(f.sum,a.slice(0,k).reduce((a,b)=>a+b,0));}
 }
});
test('all lengths through16, each point and negative/zero/positive delta maintain every block',()=>{
 for(let n=1;n<=16;n++)for(let p=1;p<=n;p++)for(const d of [-99,-3,0,4,99]){
  const a=Array.from({length:n},(_,i)=>i%2?99:-99),f=fenwickModel(a,'update',p,d);
  assert.deepEqual(f.path,f.ranges.filter(r=>r.l<=p&&p<=r.r).map(r=>r.i));
  for(const r of f.ranges)assert.equal(f.bit[r.i]+(f.path.includes(r.i)?d:0),f.after.slice(r.l-1,r.r).reduce((s,v)=>s+v,0));
  assert.deepEqual(a,Array.from({length:n},(_,i)=>i%2?99:-99));
 }
});
test('guard domain, including sparse arrays and update zero',()=>{
 for(const a of [[],Array(3),[NaN],[Infinity],[1.2],[100],Array(17).fill(0)])assert.throws(()=>fenwickModel(a,'query',0),RangeError);
 for(const k of [-1,2,NaN,0.5])assert.throws(()=>fenwickModel([1],'query',k),RangeError);
 for(const k of [0,-1,2])assert.throws(()=>fenwickModel([1],'update',k),RangeError);
 for(const d of [NaN,Infinity,100,1.5])assert.throws(()=>fenwickModel([1],'update',1,d),RangeError);
 assert.throws(()=>fenwickModel([1],'other',1),RangeError);
 for(const i of [0,-1,17,1.2,NaN])assert.throws(()=>lowbit(i),RangeError);
 assert.equal(fenwickModel([0],'query',0).sum,0);
});
test('larger prefixes, every closed interval and assignment conversion',()=>{
 for(let n=8;n<=16;n++){
  const a=Array.from({length:n},(_,i)=>i%5-2);
  for(let l=1;l<=n;l++)for(let r=l;r<=n;r++)assert.equal(fenwickModel(a,'query',r).sum-fenwickModel(a,'query',l-1).sum,a.slice(l-1,r).reduce((s,v)=>s+v,0));
 }
 const a=[3,-2,4,1,5,-3,2,6],f=fenwickModel(a,'update',3,1-a[2]);
 assert.equal(f.after[2],1);assert.equal(f.sum,undefined);
 for(let k=0;k<=a.length;k++){const q=fenwickModel(f.after,'query',k);assert.equal(q.sum,f.after.slice(0,k).reduce((s,v)=>s+v,0));for(const i of q.path)assert.equal(q.bit[i],f.bit[i]+(f.path.includes(i)?-3:0));}
});
