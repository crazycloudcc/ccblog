# Radians: a length ratio, not an interchangeable physical quantity

Started 2026-10-11 16:01UTC / Asia/Shanghai October12 00:01, after checking no October12 article had begun. Intended sole new daily lesson: /learn/radians. Previous October8 miss is not backfilled. Final release state: published and production-verified at2026-10-11 16:34:20UTC / ShanghaiOctober12 00:34:20. Earlier pending statements below are chronological stage records, superseded by the final receipt.

## Need and evidence

Actual original learner question https://math.stackexchange.com/questions/3135684/why-is-using-the-arc-length-of-a-circle-s-equivalent-to-using-the-angle-meas was asked March5,2019 02:23: why can arc length and radians have the same value, and what happens away from radius1? This is evergreen demand, not a search-volume or current-trend claim. Actual primary sources read: MIT18.01SC Fall2010 Questions and Answers https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/fbda3f72a5192d956ee948b351839f06_MIT18_01SCF10_Ses8c.pdf and OpenStax Algebra and Trigonometry2e section7.1 https://openstax.org/books/algebra-and-trigonometry-2e/pages/7-1-angles . No external answer or illustration copied. Recent Reddit result could not be read and was not used as evidence.

## Scope and original implementation

Single positive counterclockwise turn, 0..360degrees; physical radius0.5..2cm. Native SVG circle and separate fixed-scale unfolding canvas, synchronized radius/angle/length/formula/JavaScript, keyboard-native sliders, step/play/reset, reduced-motion and hidden-tab pause. Explain arc versus chord, 0/fullturn, units and unit-circle numerical equality. No calculus, negative angles or multiple-turn semantics taught.

Unroll formula uses arc-length u in[0,rθ] and curvature k=(1-p)/r: X=sin(ku)/k, Y=2sin²(ku/2)/k, with straight endpoint(X,Y)=(u,0) atp=1. Tangent norm1 means analytic length preserved throughout. Polyline sampling is only a visual approximation. Independent reviewer checked endpoints, circle equation, scales, stable near-straight limit and exact sampled chord-length formula. A detected first-pass viewport error (large-radius/fullcircle intermediate curve could clip/overlap) was fixed by giving the unroll its own fixed760×540 viewBox anchored(140,460),46SVGunits/cm; dense bounds fit x≈14.4..718.1,y≈41.1..460. Final checks/review follow in receipt.

## Dream Loop

AetherViz SKILL.md and MIT license actually reread October11 16:01UTC; SVG chosen for planar geometry, existing MIT attribution retained, no CDN dependency added. Dream Loop pinned9bddb901f7d071cfefdd21e264267c757177a9df SKILL/pro workflow reread. Current actual similar-triangles preview captured as baseline at16:03UTC. Generated a local layout target preserving the terminal shell/ivory/teal identity. Target is a layout reference, not numerical teaching evidence; it is not uploaded. Its compact layout is adjusted where needed to fit all analytic animation states without changing physical scale. Before/target/actual after captures retained locally under ignored .dream-loop. Independent real screenshot review and corrections remain release gates; never count generated imagery as actual UI validation.

## Safety and verification boundaries

Exact previewafde8b5a0d45d2c33f02aab26e8fb56bc694b241 materialized in same existingdot environment, all nonhistorical blobs hashmatched before edits. Original dirty20items not touched. No new branch/environment/credentials/tracking/service/manual deployment. Existing Notes separation and308query rules preserved; sitemap/canonical/Markdown/llms all derive shared lesson data. Actual375/390mobile and physical touch remain unverified under existingccblog exemption. No performance/FPS or learning-effect claims.

## Local final validation, 16:13UTC

228/228 tests passed, including dense1001progress full-curve viewport checks; lint, TypeScript noEmit, configuration validation, frozen-data webpack build and Pagefind passed. Built HTML/Markdown contain the shared lesson and October12 dates/canonical. Earlier lint failures (synchronous state changes in effects, unscoped CSS-module focus selector) were corrected and every aggregate check rerun afterward. Later move of unroll controls above the long geometry canvas also received a complete rerun.

Independent final math/code reviewer:3,261,258sampledpoints passed, x=[14.4275,718.0530],y=[41.1362,460]; tangent-speed finite-difference error≤5.84e−10, sampled length agrees with independent chord formula. UpperSVG raised to340 so largest-radius labelbaseline311 fits. Focused newlesson/similarity/routing20/20passed. This is not actual-browser visual acceptance; that gate remains pending on exact preview.

## Actual preview correction, 16:22–16:25UTC

Preview b7025f0a19562ad431441261f133d11bdabe98ef: GitHub CI38154791554 succeeded; Vercel H4eYiNVpJjvYdN5caYEXaPzX614L Ready/Preview/dev.crazycloud.cc exact SHA read at16:22UTC. Git trigger briefly delayed; no manual deployment or empty commit used. Actual browser screenshots and independent visual review rejected excessive blank space and separation of controls from the default90degree curve. Corrected compact heading/upper canvas and angle-only vertical crop of unfolding canvas: width760 and46SVGunits/cm unchanged, all radii/progress use one angle-specific envelope, so no radius-dependent zoom. Independent mathematical review checked19,798,323points including0/fullcircle/allprogress; curve top margin≥40SVGunits, upper circle/labels and lower ruler/text fit. New full tests229/229, lint/types/config/frozen-data webpack build/Pagefind passed after correction. Fresh actual screenshot re-review remains pending; main not advanced.

Independent visual baseline score5/10 (composition0/3,color3/3,material2/3,details0/1). Its additional recommendation was implemented: opaque sticky playback toolbar and dedicated keyboard-focusable horizontal graph wrappers, instead of making the whole stage a scrolling ancestor. SVG overflow is clipped after all bounds were independently verified. These changes receive another complete automatic run before the new preview.

## Final preview acceptance, 16:31UTC

Final product SHA6522e3c1b16c3808a4017628260b7692b6d3ee00. After the toolbar fix,229/229tests,lint,TypeScript,config,frozen-data webpack build andPagefind all passed again. GitHub previewCI38155567843 success; Vercel EZWQARzYhdzZiHvszh2LQd3DuBxv Ready/Preview/dev.crazycloud.cc/exactSHA actually read. Independent real-image re-review8/10 (composition2/3,color3/3,material2/3,details1/1), no remaining visual blocker. The fixed-scale circle is smaller than the generated reference; no geometry distortion was introduced merely to match it.

Actual cloud browser checks:1180×757desktop and500×757narrow window. Native step25%, radius1→2 with90degree angle retained, keyboard progressEnd, fullcircle intermediate50%, playback reaching100% then stopping, reset and angleHome→zero all verified. Narrow document client/scrollwidth500/500; graph wrappers412/600, actual focused ArrowRight changed scrollLeft to69, leaving toolbar and page fixed. Real narrow screenshots show controls/curve/ruler/text without page overflow. Reduced-motion and hidden-tab behavior covered by code review/automated checks, not changed in browser settings; physicalmobile,375/390,screen-reader andtouch remain unverified. Actual screenshots retained locally under ignored .dream-loop/after-v3-*.png; generated target remains a layout reference only.

## Production receipt

Same tested productSHA6522e3c1b16c3808a4017628260b7692b6d3ee00 advanced to existingmain with expected194a93143b71ca8733259a7b4212beeb115c6c44 andforce=false at16:31UTC. Git-triggered productionCI38155843685 success. Actual Vercel https://vercel.com/chainboxapp/ccblog/FZojoWgQjYrhHeFwr9PnEz5mEbY8 showed Ready,Production,crazycloud.cc,and exact productSHA. First actual production lesson read at2026-10-11T16:34:20.763Z; canonical https://crazycloud.cc/learn/radians,October12date,twoSVG and complete static lesson present. Actual production1radpreset thenr=2 gaveθ≈1rad,s≈2cm and synchronizedcode. The original20-itemdirtyworktree remained untouched. This counts one ShanghaiOctober12newarticle, not an extraOctober11article; October8miss remains. No traffic/ranking/learning-effect claim.

Final actual screenshot SHA256 identifiers (local ignored captures, not generated target):
ffccdedca614442c038d7f166f29f3b1c1e0484506d64758c348ceadd0bffa3d  .dream-loop/after-v3-default.png
7e48bf90cc23ca9b62845cea41a3dd4913add92bf525c9cd383328bdf81c3f91  .dream-loop/after-v3-full-mid.png
5b47cca777560d5a14470486a5c4f40f9e8871380a30c50b7dbd61ade995eef0  .dream-loop/after-v3-narrow-keyboard.png
a91b63e8123119e7c92011abb3c107dfe457de1469f4b29847efaf20984a486c  .dream-loop/after-v3-narrow-stage.png
6de101c2dd6dde18753eacb6f081776e7d52ab3ddd81dfe6f2dbd5e141099c18  .dream-loop/after-v3-narrow-top.png
40a504155c1d862cc8fe044459e92530647e169bccccf63bb9fc958e79184aa7  .dream-loop/after-v3-quarter.png
b73b1165af3098f770ad16b34db3442dbb5b2ada5bdb90aee08ef8c503b6508c  .dream-loop/after-v3-unrolled.png
