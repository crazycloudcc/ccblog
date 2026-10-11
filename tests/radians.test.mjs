import test from 'node:test';import assert from 'node:assert/strict';import {createJiti} from 'jiti';import {readFileSync} from 'node:fs';
const jiti=createJiti(import.meta.url,{alias:{'@':new URL('..',import.meta.url).pathname}});
const {radianModel,unrolledPoint,unrolledPoints,TAU}=await jiti.import('../lib/visualizations/radians.ts');
const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b}`);
test('radians: unit circle, radius scaling, degree conversion and zero/full-turn',()=>{
 for(const r of [.5,1,2])for(const deg of [0,1,30,90,180,270,360]){let m=radianModel(r,deg);near(m.theta,TAU*deg/360);near(m.length/r,m.theta);near(m.length,2*Math.PI*r*deg/360);}
 near(radianModel(1,90).length,Math.PI/2);near(radianModel(2,90).length,Math.PI);near(radianModel(2,360).length,4*Math.PI);near(radianModel(1,180/Math.PI).length,1);
});
test('radians: reject invalid radii angles and animation inputs',()=>{
 for(const r of [0,-1,.49,2.01,NaN,Infinity])assert.throws(()=>radianModel(r,90),RangeError);
 for(const d of [-1,361,NaN,Infinity])assert.throws(()=>radianModel(1,d),RangeError);
 for(const args of [[0,1,0],[1,-1,0],[1,7,0],[1,1,-.1],[1,1,1.1],[1,NaN,0]])assert.throws(()=>unrolledPoint(...args),RangeError);
});
test('radians: analytic curve endpoints, radius scaling and finite near-straight limit',()=>{
 for(const r of [.5,1,2])for(const theta of [0,1e-12,1,Math.PI/2,Math.PI,TAU])for(const p of [0,.25,.5,.75,1-1e-12,1]){
  const pts=unrolledPoints(r,theta,p);assert.ok(pts.flat().every(Number.isFinite));near(pts[0][0],0);near(pts[0][1],0);
  const [x,y]=pts.at(-1);if(p===1){near(x,r*theta);near(y,0);}if(p===0)near(x*x+(y-r)**2,r*r);
  const [a,b]=unrolledPoint(1,theta,p);near(x,r*a);near(y,r*b);
 }
});
test('radians: sampled length matches independent chord formula throughout unroll',()=>{
 const N=180;
 for(let ri=5;ri<=20;ri++)for(let d=0;d<=360;d+=5)for(let pi=0;pi<=20;pi++){
  const r=ri/10,theta=d*Math.PI/180,p=pi/20,L=r*theta;
  const pts=unrolledPoints(r,theta,p,N);let sum=0;for(let i=1;i<pts.length;i++)sum+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
  const q=(1-p)*theta/(2*N);const expected=L*(q===0?1:Math.sin(q)/q);near(sum,expected,1e-9);assert.ok(sum<=L+1e-9);
 }
});
test('radians: static publication, date, bidirectional entry and no invented Notes',async()=>{
 const {lessons}=await jiti.import('../lib/visualizations/lessons.ts');const l=lessons.radians;assert.equal(l.published,'2026-10-12');assert.equal(l.category,'几何');assert.equal(l.notesSlug,null);
 for(const v of ['θ=s/r','数值相同','不同的量'])assert.ok(l.shortAnswer.includes(v));assert.match(l.conditions,/0≤θ≤2π/);assert.match(l.complexity,/半径0不允许/);
 const {renderLessonMarkdown,lessonStructuredData}=await jiti.import('../lib/visualizations/lesson-publication.ts');assert.match(renderLessonMarkdown('radians'),/单位圆/);assert.match(lessonStructuredData('radians')['@graph'][0].url,/\/learn\/radians$/);
 assert.match(readFileSync(new URL('../components/visualizations/SimilarityExperience.tsx',import.meta.url),'utf8'),/\/learn\/radians/);
 assert.match(readFileSync(new URL('../app/learn/[slug]/page.tsx',import.meta.url),'utf8'),/slug === "radians"/);
});
test('radians: real SSR has meaningful geometry, native controls and synchronized code',async()=>{
 const ts=await import('typescript'),React=await import('react'),server=await import('react-dom/server'),runtime=await import('react/jsx-runtime');
 const src=readFileSync(new URL('../components/visualizations/RadianExperience.tsx',import.meta.url),'utf8');
 const js=ts.default.transpileModule(src,{compilerOptions:{module:ts.default.ModuleKind.CommonJS,jsx:ts.default.JsxEmit.ReactJSX}}).outputText;
 const deps={'react':React,'react/jsx-runtime':runtime,'next/link':{default:({children,...p})=>React.createElement('a',p,children)},'@/components/home/usePrefersReducedMotion':{usePrefersReducedMotion:()=>false},'@/lib/visualizations/radians':{radianModel,unrolledPoints},'./RadianExperience.module.css':{default:new Proxy({},{get:(_,k)=>String(k)})}};const out={};new Function('exports','require',js)(out,k=>{assert.ok(k in deps,k);return deps[k];});
 const html=server.renderToStaticMarkup(React.createElement(out.RadianExperience,null,'static explanation'));
 for(const text of ['<svg','<polyline','<circle','半径 r','展开进度','static explanation','const arcCm = radiusCm * theta','<noscript>'])assert.ok(html.includes(text),text);
 for(const text of ['requestAnimationFrame','cancelAnimationFrame','visibilitychange','usePrefersReducedMotion','aria-live="polite"'])assert.ok(src.includes(text),text);
});
test('radians: complete animation fits fixed independent unroll viewport',()=>{
 for(let pi=0;pi<=1000;pi++)for(const [x,y] of unrolledPoints(2,TAU,pi/1000)){
  const px=140+46*x,py=460-46*y;assert.ok(px>=0&&px<=760,`x ${px}`);assert.ok(py>=30&&py<=460+1e-9,`y ${py}`);
 }
 const src=readFileSync(new URL('../components/visualizations/RadianExperience.tsx',import.meta.url),'utf8');assert.match(src,/540-unfoldTop/);assert.match(src,/完全展开后/);
});

test('radians: angle-only crop preserves scale and all intermediate geometry',()=>{
 for(let d=0;d<=360;d+=3){const theta=d*Math.PI/180,top=Math.max(0,460-Math.min(420,2*theta*46)-40);
  for(const r of [.5,1,2])for(let i=0;i<=100;i++)for(const [x,y] of unrolledPoints(r,theta,i/100,36)){
   assert.ok(460-46*y>=top+30-1e-8);assert.ok(460-46*y<=460+1e-8);assert.ok(140+46*x>=0&&140+46*x<=760);
  }
 }
});
