import test from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { readFileSync } from 'node:fs';
const jiti=createJiti(import.meta.url,{alias:{'@':new URL('..',import.meta.url).pathname}});
const {completed,parseMachines,searchAnswer,validateMachines}=await jiti.import('../lib/visualizations/answer-search.ts');
const {lessonAuthor,lessonStructuredData}=await jiti.import('../lib/visualizations/lesson-publication.ts');
const {SITE_URL}=await jiti.import('../lib/site.ts');
test('original production example checks 8,12,10,9 and first true 9',()=>{
 const f=searchAnswer([2,3,7],8);assert.deepEqual(f.filter(x=>x.mid!==null).map(x=>x.mid),[8,12,10,9,9]);assert.equal(f.at(-1).lo,9);assert.equal(completed([2,3,7],8),7);assert.equal(completed([2,3,7],9),8);
});
test('exhaustive small machines agree with independent integer enumeration',()=>{
 for(let a=1;a<=12;a++)for(let b=1;b<=12;b++)for(let goal=0;goal<=24;goal++){
  const p=[a,b];let want=0;while(Math.floor(want/a)+Math.floor(want/b)<goal)want++;
  const f=searchAnswer(p,goal);assert.equal(f.at(-1).lo,want);
  for(const r of f){assert.ok(r.lo<=want&&want<=r.hi);assert.ok(completed(p,r.hi)>=goal);}
  for(let i=2;i<f.length-1;i+=2)assert.ok(f[i].hi-f[i].lo<f[i-1].hi-f[i-1].lo);
 }
});
test('single machine, equal speeds, zero, UI extremes and fractional products',()=>{
 for(const [p,t,w] of [[[3],5,15],[[4,4],7,16],[[2,3,7],0,0],[[12,12,12,12],24,72],[[12],24,288],[[1],1,1]])assert.equal(searchAnswer(p,t).at(-1).lo,w);
 assert.equal(completed([2,3,7],8.9),7);assert.equal(completed([2,3,7],0),0);
});
test('invalid inputs rejected without traces',()=>{
 for(const [p,t] of [[[],8],[[0],8],[[-1],8],[[1.5],8],[[NaN],8],[[Infinity],8],[[13],8],[[1,2,3,4,5],8],[[2],-1],[[2],25],[[2],NaN],[[2],1.5]]){assert.ok(validateMachines(p,t));assert.throws(()=>searchAnswer(p,t),RangeError);}
 for(const [p,t] of [['','8'],['2e0','8'],['2,0','8'],['2','1e1'],['2',''],['2','-1']])assert.ok(parseMachines(p,t).error);
 assert.deepEqual(parseMachines('2，3 7','0'),{periods:[2,3,7],target:0});
});
test('author identity uses enabled about page and configured origin only',()=>{
 assert.deepEqual(lessonAuthor(false,'https://example.org/'),{'@type':'Person',name:lessonAuthor().name});
 assert.equal(lessonAuthor(true,'https://example.org/').url,'https://example.org/about');
 assert.equal(lessonStructuredData('binary-search-on-answer')['@graph'][0].author.url,`${SITE_URL}/about`);
 assert.equal(lessonAuthor()['@type'],'Person');
});
test('interactive publication keeps meaningful stage and interaction accessibility',()=>{
 const source=readFileSync(new URL('../components/visualizations/AnswerSearchExperience.tsx',import.meta.url),'utf8');
 for(const text of ['<svg','requestAnimationFrame','cancelAnimationFrame','visibilitychange','aria-live="polite"','aria-label="探索时间"','/learn/binary-search','<noscript>','prefers']) { if(text!=='prefers')assert.ok(source.includes(text),text); }
 assert.ok(source.includes('if (input.error'));assert.ok(source.includes('usePrefersReducedMotion'));
 assert.doesNotMatch(source,/\/blog\/binary-search-on-answer/);
});

test('real React SSR exposes SVG math and literal C++ line breaks', async()=>{
 const ts=await import('typescript');const React=await import('react');const server=await import('react-dom/server');const runtime=await import('react/jsx-runtime');
 const src=readFileSync(new URL('../components/visualizations/AnswerSearchExperience.tsx',import.meta.url),'utf8');
 const js=ts.default.transpileModule(src,{compilerOptions:{module:ts.default.ModuleKind.CommonJS,jsx:ts.default.JsxEmit.ReactJSX}}).outputText;
 const core=await jiti.import('../lib/visualizations/answer-search.ts');const output={};
 const deps={'react':React,'react/jsx-runtime':runtime,'next/link':{default:({children,...p})=>React.createElement('a',p,children)},'@/lib/visualizations/answer-search':core,'@/components/home/usePrefersReducedMotion':{usePrefersReducedMotion:()=>false},'./AnswerSearchExperience.module.css':{default:new Proxy({},{get:(_,key)=>String(key)})}};
 new Function('exports','require',js)(output,k=>{assert.ok(k in deps,k);return deps[k];});
 const html=server.renderToStaticMarkup(React.createElement(output.AnswerSearchExperience,null,'static lesson'));
 assert.match(html,/<title[^>]*>9\.0 秒，完成 8 件，需求 8 件，可行|<title[^>]*>9\.0 秒，完成 8 件，需求 8 件，已够用/);
 assert.match(html,/4 \+ 3 \+ 1 =/);assert.match(html,/role="img"/);assert.match(html,/static lesson/);assert.match(html,/return lo/);assert.match(html,/href="\/learn\/binary-search"/);
 assert.equal((html.match(/<code class=/g)||[]).length,7);
 assert.ok(html.indexOf('aria-label="探索时间"') < html.indexOf('<svg'), 'exploration control precedes the tall graph');
 const css=readFileSync(new URL('../components/visualizations/AnswerSearchExperience.module.css',import.meta.url),'utf8');
 assert.ok(css.includes('white-space:pre-wrap'), 'core code wraps instead of clipping');
});
