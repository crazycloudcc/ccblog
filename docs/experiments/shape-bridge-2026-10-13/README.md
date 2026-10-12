# Pythagorean–similarity area bridge

Started 2026-10-12 22:03:51 UTC / Shanghai Oct13. This is maintenance, not a second article. Original publication 2026-10-09 and teaching update 2026-10-11 remain unchanged. Exact preview `552a29521e0cac22ed40dcc170e8fad98edf1b43` was materialized in the existing authorized cloud workspace; all 351 baseline blobs were verified. The old 20 dirty entries were untouched. Missing earlier temporary snapshots do not imply a production rollback.

## Evidence and scope

Actually read the Cambridge [problem](https://undergroundmathematics.org/thinking-about-geometry/quintessential-proof) and [solution](https://undergroundmathematics.org/thinking-about-geometry/quintessential-proof/solution). Both state last updated 12-Dec-2022; original publication is unknown. This is evergreen teaching intent, not new heat or search-volume evidence. Source figures were not visually inspected or copied.

Independent scope review identified a useful bridge between the existing Pythagorean proof and similarity lesson: three semicircles with the right triangle's sides as diameters have area constant π/8. More generally, similar shapes with corresponding lengths share the same area constant K. This is a consequence of known Pythagoras, not another proof; mixing shapes or noncorresponding lengths is not justified.

Only the existing extension paragraph and link label in shared lesson data were replaced. Destination `/learn/similar-triangles` is unchanged. No new FAQ, component, animation, title, route or teaching date. Core native SVG remains unchanged. Two mathematical/static-output tests were added.

## Dream Loop and correction

Re-read AetherViz SKILL and retained MIT notice, and Dream Loop Pro workflow at commit `9bddb901f7d071cfefdd21e264267c757177a9df` with its MIT notice. No upstream scripts or CDN code executed.

Actual baseline captured 22:06:47 UTC at 1188×761. The generated target is a local layout reference only, never uploaded or treated as mathematical/QA evidence. Goal: the longer extension wraps naturally, the internal link remains visible, and references flow below it without overlap or overflow.

The first new static-Markdown test failed because the pre-existing test Jiti instance lacked the `@` alias. Independent review reproduced 12/13 focused tests. Added the existing project alias pattern and restarted all checks; the original failure log is retained locally.

Final independent mathematical/text review passed: 42 positive-real leg pairs using semicircle radii and Heron's formula, mixed-shape and non-right counterexamples, static HTML/Markdown, link and date preservation. Final focused tests 13/13 passed. No outstanding findings.

Full checks and exact preview, actual after screenshots, independent visual review, and production verification are pending at this entry.

Final validation completed 22:11:12 UTC after the alias fix: 244/244 tests, lint, TypeScript, configuration, frozen-source Next webpack build and Pagefind all passed. Generated HTML and Markdown were read and contain the full bridge and target link. Existing app data was frozen; no network sync prebuild. Preview and live visual/production verification remain pending.
