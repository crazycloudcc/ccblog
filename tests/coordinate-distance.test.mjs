import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createJiti} from 'jiti';
const jiti=createJiti(import.meta.url,{alias:{'@':new URL('..',import.meta.url).pathname}});
const api=await jiti.import('../lib/visualizations/coordinate-distance.ts');
const {coordinateDistance: model,coordinateScreen,translateCoordinates,exactDistance}=api;
test('coordinate distance: all 14,641 endpoint pairs preserve Euclidean identities',()=>{
 for(let x=-5;x<=5;x++)for(let y=-5;y<=5;y++)for(let u=-5;u<=5;u++)for(let v=-5;v<=5;v++){
  const a=[x,y],b=[u,v],m=model(a,b),swap=model(b,a),square=(u-x)**2+(v-y)**2;
  assert.equal(m.square,square);assert.ok(Math.abs(m.distance-Math.sqrt(square))<1e-12);assert.equal(m.distance,swap.distance);assert.equal(m.coincident,x===u&&y===v);assert.equal(m.triangle,x!==u&&y!==v);assert.deepEqual(m.c,[u,y]);
  const sa=coordinateScreen(a),sb=coordinateScreen(b);assert.ok(Math.abs(Math.hypot(sa[0]-sb[0],sa[1]-sb[1])-36*m.distance)<1e-10);
 }
});
test('coordinate distance: negative quadrants, axes, coincidence, exact radicals',()=>{
 for(const [a,b,d,exact] of [[[-2,1],[1,-3],5,'5'],[[-5,1],[-2,1],3,'3'],[[-3,2],[4,2],7,'7'],[[2,-4],[2,3],7,'7'],[[-1,2],[-1,2],0,'0'],[[-2,-2],[2,2],Math.sqrt(32),'4√2'],[[-5,-5],[5,5],Math.sqrt(200),'10√2']]){const m=model(a,b);assert.ok(Math.abs(m.distance-d)<1e-12);assert.equal(m.exact,exact);}
 for(let n=0;n<=200;n++){const form=exactDistance(n),parts=form.split('√');const value=parts.length===1?Number(form):(Number(parts[0]||1)**2)*Number(parts[1]);assert.equal(parts.length===1?value**2:value,n);}
});
test('coordinate distance: shared translations preserve differences or reject whole move',()=>{
 for(let x=-5;x<=5;x++)for(let y=-5;y<=5;y++)for(let u=-5;u<=5;u++)for(let v=-5;v<=5;v++)for(const [tx,ty] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const next=translateCoordinates([x,y],[u,v],tx,ty),valid=[x+tx,y+ty,u+tx,v+ty].every(z=>Math.abs(z)<=5);
  assert.equal(next!==null,valid);if(next){const m=model(...next);assert.equal(m.dx,u-x);assert.equal(m.dy,v-y);}
 }
 assert.equal(translateCoordinates([5,0],[0,0],1,0),null);
});
test('coordinate distance: reveal progress never changes points, lengths or scales',()=>{
 for(const a of [[-5,-5],[-2,1],[0,0],[5,5]])for(const b of [[5,-5],[1,-3],[0,0],[-5,5]])for(let step=0;step<=100;step++){
  const p=step/100,m=model(a,b,p);assert.deepEqual(m.a,a);assert.deepEqual(m.b,b);assert.equal(m.square,model(a,b).square);assert.equal(m.horizontalEnd[1],a[1]);assert.equal(m.verticalEnd[0],b[0]);
  for(const point of [m.horizontalEnd,m.verticalEnd])assert.ok(point.every(n=>Number.isFinite(n)&&n>=-5&&n<=5));
 }
 for(const p of [-1,1.1,NaN,Infinity])assert.throws(()=>model([0,0],[1,1],p),RangeError);
 for(const v of [-6,6,.5,NaN,Infinity]){assert.throws(()=>model([v,0],[1,1]),RangeError);assert.throws(()=>model([0,0],[0,v]),RangeError);}
 assert.throws(()=>translateCoordinates([0,0],[1,1],.5,0),RangeError);
});
test('coordinate distance: dated static lesson, valid routes and bidirectional entry',async()=>{
 const {lessons}=await jiti.import('../lib/visualizations/lessons.ts');const {renderLessonMarkdown,lessonStructuredData}=await jiti.import('../lib/visualizations/lesson-publication.ts');const l=lessons['coordinate-distance'],md=renderLessonMarkdown('coordinate-distance');
 assert.equal(l.category,'几何');assert.equal(l.notesSlug,null);assert.equal(l.published,'2026-10-14');assert.equal(l.updated,'2026-10-14');
 for(const v of ['非负','两点重合','相同比例尺','经纬度','Math.hypot','不能修复已经溢出','辅助线','4√2'])assert.ok(md.includes(v),v);
 assert.match(lessonStructuredData('coordinate-distance')['@graph'][0].url,/\/learn\/coordinate-distance$/);
 assert.match(readFileSync(new URL('../components/visualizations/PythagoreanExperience.tsx',import.meta.url),'utf8'),/\/learn\/coordinate-distance/);
 assert.match(readFileSync(new URL('../app/learn/[slug]/page.tsx',import.meta.url),'utf8'),/CoordinateDistanceExperience/);
 assert.match(readFileSync(new URL('../app/learn/page.tsx',import.meta.url),'utf8'),/slug === "coordinate-distance"/);
 assert.equal(lessons['euclidean-algorithm'].published,'2026-10-13');assert.equal(lessons['pythagorean-theorem'].published,'2026-10-09');
});
test('coordinate distance: meaningful SSR geometry, keyboard controls, reduction preference',async()=>{
 const ts=await import('typescript'),React=await import('react'),server=await import('react-dom/server'),runtime=await import('react/jsx-runtime');const src=readFileSync(new URL('../components/visualizations/CoordinateDistanceExperience.tsx',import.meta.url),'utf8');
 const js=ts.default.transpileModule(src,{compilerOptions:{module:ts.default.ModuleKind.CommonJS,jsx:ts.default.JsxEmit.ReactJSX}}).outputText;
 const deps={'react':React,'react/jsx-runtime':runtime,'next/link':{default:({children,...p})=>React.createElement('a',p,children)},'@/components/home/usePrefersReducedMotion':{usePrefersReducedMotion:()=>false},'@/lib/visualizations/coordinate-distance':api,'./CoordinateDistanceExperience.module.css':{default:new Proxy({},{get:(_,k)=>String(k)})}};const out={};new Function('exports','require',js)(out,k=>{assert.ok(k in deps,k);return deps[k];});
 const html=server.renderToStaticMarkup(React.createElement(out.CoordinateDistanceExperience,null,'static explanation'));
 for(const text of ['<svg','<polygon','data-right-angle="true"','两点重合','A点横坐标','B点纵坐标','辅助线进度','Math.hypot','static explanation','<noscript>','每格 1 单位'])assert.ok(html.includes(text),text);
 assert.equal((html.match(/type="range"/g)||[]).length,5);
 for(const text of ['usePrefersReducedMotion','visibilitychange','clearInterval','m.triangle&&progress===1','disabled={!translateCoordinates','setPlaying(false)'])assert.ok(src.includes(text),text);
 const css=readFileSync(new URL('../components/visualizations/CoordinateDistanceExperience.module.css',import.meta.url),'utf8');assert.match(css,/overflow-x:auto/);assert.match(css,/focus-visible/);assert.match(css,/prefers-reduced-motion/);
});

test('coordinate distance: share card depicts the new lesson, not the fallback LIS title',()=>{
 const svg=readFileSync(new URL('../public/images/learn/coordinate-distance.svg',import.meta.url),'utf8');assert.match(svg,/Coordinate Distance/);assert.match(svg,/Signed changes/);assert.doesNotMatch(svg,/Longest Increasing|LIS \/ Replace|Strictly increasing/);assert.match(svg,/A\(-2,1\)/);
});
test('coordinate distance: leg values remain outside plot to protect ticks and endpoint labels',()=>{
 const src=readFileSync(new URL('../components/visualizations/CoordinateDistanceExperience.tsx',import.meta.url),'utf8');
 for(const rule of ['辅助边的数值统一放在同步解释中','aVertical*22','bVertical*22','辅助线长度 |Δx|','辅助线长度 |Δy|'])assert.ok(src.includes(rule),rule);
 assert.doesNotMatch(src,/<text[^>]*>\|Δ[xy]\|/);
});
