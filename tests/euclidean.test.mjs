import test from 'node:test';import assert from 'node:assert/strict';import {createJiti} from 'jiti';import {readFileSync} from 'node:fs';
const jiti=createJiti(import.meta.url,{alias:{'@':new URL('..',import.meta.url).pathname}});
const {euclideanTrace,euclideanTiling}=await jiti.import('../lib/visualizations/euclidean.ts');
function oracle(a,b){for(let d=Math.min(a,b);d>=1;d--)if(a%d===0&&b%d===0)return d;return Math.max(a,b);}
test('gcd: all 3600 bounded inputs preserve divisions, divisors, geometry and exact coverage',()=>{
 for(let w=1;w<=60;w++)for(let h=1;h<=60;h++){
  const m=euclideanTiling(w,h),g=oracle(w,h),trace=euclideanTrace(w,h);assert.equal(m.gcd,g);assert.equal(trace.gcd,g);assert.deepEqual(m.rounds.map(({a,b,q,r})=>({a,b,q,r})),trace.rounds);
  let area=0;const cells=new Uint8Array(w*h);
  for(const t of m.squares){assert.ok(t.size>0&&Number.isInteger(t.size));assert.ok(t.x>=0&&t.y>=0&&t.x+t.size<=w&&t.y+t.size<=h);area+=t.size*t.size;for(let x=t.x;x<t.x+t.size;x++)for(let y=t.y;y<t.y+t.size;y++)cells[y*w+x]++;}
  assert.equal(area,w*h);assert.ok(cells.every(n=>n===1));
  for(const [i,r] of m.rounds.entries()){assert.equal(r.a,r.q*r.b+r.r);assert.ok(r.r>=0&&r.r<r.b);assert.equal(oracle(r.a,r.b),g);if(i)assert.ok(r.b<m.rounds[i-1].b);for(let d=1;d<=60;d++)assert.equal(r.a%d===0&&r.b%d===0,r.b%d===0&&r.r%d===0);}
 }
});
test('gcd: equal, reversed, exact divisible, coprime and zero inputs',()=>{
 assert.equal(euclideanTrace(0,7).gcd,7);assert.equal(euclideanTrace(7,0).gcd,7);assert.equal(euclideanTrace(24,24).rounds.length,1);
 assert.deepEqual(euclideanTrace(48,18).rounds.map(x=>x.r),[12,6,0]);assert.deepEqual(euclideanTrace(35,22).rounds.map(x=>x.r),[13,9,4,1,0]);assert.equal(euclideanTiling(18,48).gcd,6);assert.equal(euclideanTiling(60,1).squares.length,60);
});
test('gcd: reject invalid domain; safe integer edges agree with BigInt',()=>{
 for(const x of [-1,.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1]){assert.throws(()=>euclideanTrace(x,1),RangeError);assert.throws(()=>euclideanTrace(1,x),RangeError);}
 assert.throws(()=>euclideanTrace(0,0),RangeError);for(const x of [0,61,1.5,-1,NaN,Infinity])assert.throws(()=>euclideanTiling(x,18),RangeError);
 for(const [a,b] of [[Number.MAX_SAFE_INTEGER,2],[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER-1],[754011380474634,466004661037553]]){let x=BigInt(a),y=BigInt(b);while(y){[x,y]=[y,x%y];}assert.equal(BigInt(euclideanTrace(a,b).gcd),x);}
});
test('gcd: publication, canonical, dates, static boundaries and bidirectional entries',async()=>{
 const {lessons}=await jiti.import('../lib/visualizations/lessons.ts');const l=lessons['euclidean-algorithm'];assert.equal(l.published,'2026-10-13');assert.equal(l.category,'算法');assert.equal(l.notesSlug,null);
 const {renderLessonMarkdown,lessonStructuredData}=await jiti.import('../lib/visualizations/lesson-publication.ts');const md=renderLessonMarkdown('euclidean-algorithm');for(const v of ['公因数集合','不定义gcd(0,0)','不是任意混合大小','单位成本','6'])assert.ok(md.includes(v),v);assert.match(lessonStructuredData('euclidean-algorithm')['@graph'][0].url,/\/learn\/euclidean-algorithm$/);
 assert.match(readFileSync(new URL('../components/visualizations/AnswerSearchExperience.tsx',import.meta.url),'utf8'),/\/learn\/euclidean-algorithm/);assert.equal(lessons['binary-search'].steps.length,3);
});
test('gcd: meaningful SSR SVG, accessible controls and synchronized normalized code',async()=>{
 const ts=await import('typescript'),React=await import('react'),server=await import('react-dom/server'),runtime=await import('react/jsx-runtime');const src=readFileSync(new URL('../components/visualizations/EuclideanExperience.tsx',import.meta.url),'utf8');
 const js=ts.default.transpileModule(src,{compilerOptions:{module:ts.default.ModuleKind.CommonJS,jsx:ts.default.JsxEmit.ReactJSX}}).outputText;
 const deps={'react':React,'react/jsx-runtime':runtime,'next/link':{default:({children,...p})=>React.createElement('a',p,children)},'@/components/home/usePrefersReducedMotion':{usePrefersReducedMotion:()=>false},'@/lib/visualizations/euclidean':{euclideanTiling},'./EuclideanExperience.module.css':{default:new Proxy({},{get:(_,k)=>String(k)})}};const out={};new Function('exports','require',js)(out,k=>{assert.ok(k in deps,k);return deps[k];});
 const html=server.renderToStaticMarkup(React.createElement(out.EuclideanExperience,null,'static explanation'));for(const text of ['<svg','<rect','48','18','切下一轮','统一砖网格','Math.max(width, height)','static explanation','<noscript>'])assert.ok(html.includes(text),text);
 for(const v of ['usePrefersReducedMotion','visibilitychange','clearInterval','aria-live="polite"','aria-pressed'])assert.ok(src.includes(v),v);
});
test('gcd: scaled tile labels retain WCAG normal-text contrast',()=>{
 const src=readFileSync(new URL('../components/visualizations/EuclideanExperience.tsx',import.meta.url),'utf8');const palette=src.match(/const colors=\[([^\]]+)\]/)[1].match(/#[0-9a-f]{6}/g);
 for(const color of palette){const rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);const lum=.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];assert.ok(1.05/(lum+.05)>=4.5,color);}
});
test('gcd: exact decimal common measure uses integer numerators and common-denominator scale',()=>{
 // These are exact rational representations, never parsed floating decimal inputs.
 assert.equal(euclideanTrace(1116,465).gcd,93);
 assert.equal(1116/93,12);assert.equal(465/93,5);
 for(let a=1;a<=40;a++)for(let b=1;b<=40;b++)for(const k of [1,2,10]){
  // A/D and B/D: refining the shared denominator by k preserves g/D.
  assert.equal(euclideanTrace(k*a,k*b).gcd,k*oracle(a,b));
 }
 assert.throws(()=>euclideanTrace(111.6,46.5),RangeError);
 assert.throws(()=>euclideanTiling(1.2,.8),RangeError);
});
test('gcd: decimal explanation stays in static output without broadening lesson domain or dates',async()=>{
 const {lessons}=await jiti.import('../lib/visualizations/lessons.ts');const l=lessons['euclidean-algorithm'];
 const {renderLessonMarkdown}=await jiti.import('../lib/visualizations/lesson-publication.ts');const md=renderLessonMarkdown('euclidean-algorithm');
 for(const term of ['两个正长度都是其整数倍的最大正长度','精确有限小数','1116/10','465/10','gcd(1116,465)/10=9.3','12倍和5倍','二进制浮点数直接乘10再取整','近似测量值','误差规则','仍只处理上述整数范围'])assert.ok(md.includes(term),term);
 assert.equal(l.published,'2026-10-13');assert.equal(l.updated,'2026-10-13');assert.match(l.conditions,/1–60的正整数/);assert.match(l.conditions,/非负安全整数/);
 assert.ok(l.references.some(r=>r.url==='https://docs.python.org/3/tutorial/floatingpoint.html'));
});
