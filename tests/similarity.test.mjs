import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {createJiti} from 'jiti';
const jiti=createJiti(import.meta.url);
const {shadowModel,measure}=await jiti.import('../lib/visualizations/similar-triangles.ts');
const {lessons,lessonExtensions}=await jiti.import('../lib/visualizations/lessons.ts');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9*Math.max(1,Math.abs(b)),`${a} != ${b}`);
test('shadow geometry matches an independent line-ground intersection throughout inputs',()=>{
 for(let H=4;H<=10;H+=.5)for(let h=1;h<=3;h+=.5)for(let x=1;x<=8;x+=.5){
 const m=shadowModel(H,h,x);const slope=(h-H)/x;const intersection=-H/slope;
 near(m.q,intersection);near(m.s,intersection-x);near(H*m.s,h*m.q);near(m.q,x+m.s);near(m.s/x,h/(H-h));assert.ok(m.s>0);
 for(const progress of [0,.01,.25,.5,.75,.99,1]){const a=shadowModel(H,h,x,progress);near(a.transformed[2][0],a.q);near(a.transformed[2][1],0);near(a.transformed[1][1]/h,a.scale);near((a.q-a.transformed[0][0])/a.s,a.scale);if(progress===1)for(let i=0;i<3;i++)for(let j=0;j<2;j++)near(a.transformed[i][j],a.big[i][j]);}
 }
});
test('fixed heights produce proportional shadows; distinguish tip position',()=>{const a=shadowModel(6,2,4),b=shadowModel(6,2,8);assert.equal(a.s,2);assert.equal(a.q,6);assert.equal(b.s,4);assert.equal(b.q,12);near(shadowModel(10,1,1).s,1/9);assert.equal(shadowModel(4,3,8).s,24);assert.ok(shadowModel(6,2.5,4).s>a.s);assert.ok(shadowModel(7,2,4).s<a.s);});
test('invalid and out of graphical range inputs are explicitly rejected',()=>{for(const args of [[0,1,4],[4,4,4],[4,5,4],[6,0,4],[6,2,0],[6,2,-1],[11,2,4],[6,2,9],[NaN,2,4],[Infinity,2,4],[6,2,4,-.1],[6,2,4,1.1],[6,2,4,NaN]])assert.throws(()=>shadowModel(...args),RangeError);});
test('readable bounds, model conditions, date and reciprocal links are present',()=>{const l=lessons['similar-triangles'];assert.equal(l.published,'2026-10-11');assert.equal(l.category,'几何');assert.equal(l.notesSlug,null);assert.match(l.complexity,/H=h/);assert.match(l.complexity,/H<h/);assert.match(l.complexity,/x=0/);assert.match(l.complexity,/太阳光/);assert.match(l.shortAnswer,/固定 H、h/);assert.equal(lessonExtensions['similar-triangles'].slug,'pythagorean-theorem');assert.equal(lessonExtensions['pythagorean-theorem'].slug,'similar-triangles');});
test('formatting never reuses rounded lengths; animation controls and accessibility are exposed',()=>{assert.equal(measure(2),'= 2');assert.equal(measure(1/9),'≈ 0.11');const source=readFileSync('components/visualizations/SimilarityExperience.tsx','utf8');for(const text of ['aria-labelledby','prefers-reduced-motion','requestAnimationFrame','cancelAnimationFrame','播放放大','单步 +25%','重置','similarityCode','setPlaying(false)'])assert.ok(source.includes(text),text);});

test('initial lesson UI server-renders real SVG geometry, controls and synchronized code',async()=>{
 const ts=await import('typescript');const React=await import('react');const jsx=await import('react/jsx-runtime');const {renderToStaticMarkup}=await import('react-dom/server');
 const model=await jiti.import('../lib/visualizations/similar-triangles.ts');const out={};
 const source=ts.default.transpileModule(readFileSync('components/visualizations/SimilarityExperience.tsx','utf8'),{compilerOptions:{module:ts.default.ModuleKind.CommonJS,jsx:ts.default.JsxEmit.ReactJSX}}).outputText;
 const deps={'react':React,'react/jsx-runtime':jsx,'next/link':{default:({children,...props})=>React.createElement('a',props,children)},'@/lib/visualizations/similar-triangles':model,'./SimilarityExperience.module.css':{default:{}}};
 new Function('exports','require',source)(out,id=>{assert.ok(id in deps,id);return deps[id];});
 const html=renderToStaticMarkup(React.createElement(out.SimilarityExperience,null,React.createElement('p',null,'静态阅读插槽')));
 assert.equal((html.match(/<svg /g)||[]).length,2);assert.equal((html.match(/type="range"/g)||[]).length,4);assert.ok(html.includes('const H = 6, h = 2, x = 4;'));assert.ok(html.includes('静态阅读插槽'));assert.ok(html.includes('影尖 T'));assert.ok(html.includes('AA 相似'));assert.ok(html.includes('H / (x+s) = h / s'));assert.ok(html.includes('s = hx / (H−h)'));assert.ok(html.includes('disabled')===false);
});
test('screen projections preserve equal horizontal and vertical units and fit extrema',()=>{
 for(const H of [4,6,10])for(const h of [1,2,3])for(const x of [1,4,8]){
 const m=shadowModel(H,h,x),unit=Math.min(490/m.maxQ,260/H);
 for(const [a,b] of [...m.big,...m.small]){const sx=65+a*unit,sy=302-b*unit;assert.ok(sx>=65-1e-9&&sx<=555+1e-9);assert.ok(sy>=42-1e-9&&sy<=302+1e-9);}
 near((302-(302-H*unit))/H,(65+m.q*unit-65)/m.q);
 near(unit,Math.min(490/shadowModel(H,h,8).maxQ,260/H));
 }
});
test('angle markers stay within small triangles even when the shadow is short',()=>{
 for(let H=4;H<=10;H+=.5)for(let h=1;h<=3;h+=.5)for(let x=1;x<=8;x+=.5){const m=shadowModel(H,h,x),unit=Math.min(490/m.maxQ,260/H),r=Math.min(9,m.s*unit/4,h*unit/4),arc=Math.min(22,m.s*unit*.65);assert.ok(r/(m.s*unit)+r/(h*unit)<=1);assert.ok(arc<=m.s*unit);}
});

test('graph-first shell and truthful local magnification keep teaching context visible',()=>{const ui=readFileSync('components/visualizations/SimilarityExperience.tsx','utf8');assert.ok(ui.includes('局部等比放大'));assert.ok(ui.includes('不表示第二个人'));const shell=readFileSync('components/terminal/TerminalPageEntry.tsx','utf8');assert.ok(shell.includes('"/learn/similar-triangles"'));for(let H=4;H<=10;H+=.5)for(let h=1;h<=3;h+=.5)for(let x=1;x<=8;x+=.5){const m=shadowModel(H,h,x),u=Math.min(145/h,150/m.s),r=Math.min(10,m.s*u/4,h*u/4),a=Math.min(20,m.s*u*.6);assert.ok(r/(m.s*u)+r/(h*u)<=1);assert.ok(a<=m.s*u);assert.ok(415+m.s*u<=565);assert.ok(244-h*u>=99);}});

test('similarity area explanation scales both base and perpendicular height',()=>{
 const text=lessons['similar-triangles'].mistakes.join(' ');
 assert.ok(text.includes('k=H/h'));assert.ok(text.includes('底和对应的垂直高都乘 k'));assert.ok(text.includes('½×底×高'));
 const area=vertices=>Math.abs(vertices.reduce((sum,[x,y],i)=>{const [nx,ny]=vertices[(i+1)%vertices.length];return sum+x*ny-nx*y;},0))/2;
 for(let H=4;H<=10;H+=.5)for(let h=1;h<=3;h+=.5)for(let x=1;x<=8;x+=.5){
  const m=shadowModel(H,h,x),k=H/h;near(area(m.small),h*m.s/2);near(area(m.big),H*m.q/2);near(area(m.big)/area(m.small),k*k);
 }
 const m=shadowModel(6,2,4);assert.equal(area(m.small),2);assert.equal(area(m.big),18);
});
