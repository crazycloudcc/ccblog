# Radians: a length ratio, not an interchangeable physical quantity

Started 2026-10-11 16:01UTC / Asia/Shanghai October12 00:01, after checking no October12 article had begun. Intended sole new daily lesson: /learn/radians. Previous October8 miss is not backfilled. Current release state: implementation and preview validation pending; this document does not claim publication.

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
