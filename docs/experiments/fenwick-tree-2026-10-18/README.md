# Fenwick tree · 2026-10-18 Asia/Shanghai

Goal: bridge static prefix sums and online point changes using a real interval-cover diagram. Source: CSES Dynamic Range Sum Queries https://cses.fi/problemset/task/1648/ read 2026-10-17 UTC. This is evergreen task demand, not evidence of a current search-volume spike. AHC073 was considered but unavailable from the read source; it is not a claim supporting this lesson.

Route: `/learn/fenwick-tree`. Started after 2026-10-17T16:00Z (Oct18 Shanghai); one new daily lesson. Prior Oct17 difference-array is unchanged as that day's sole lesson. No Oct8 completion is fabricated.

Implementation: native SVG interval bars T[i], query disjoint-block assembly and update covering-ancestor route; synced values, explanation and code; native range keyboard controls, scrollable narrow stage, reduced-motion single steps, static LessonReading and index.md/schema/sitemap. Each round starts from the fixed baseline array. One-based indices and assignment-to-delta conversion are explicit. AetherViz Master SKILL and MIT license read before implementation; no third-party script installed.

Dream Loop: goal/implementation in this document; independent mathematical/code review and actual screenshot review pending. Initial full build caught an unscoped CSS-module selector; fixed to `.proof pre:focus-visible`. Initial tests caught three old fixed lesson-count assertions; updated 11→12 for the new lesson, retaining their substantive checks.

Validation and deployment: pending; no production claim. Model tests enumerate all {-1,0,1} arrays through length7 and every prefix, plus lengths1–16/every point/five signed deltas and domain rejection. No analytics or growth attribution claimed.

## Pre-preview checks · 2026-10-17 16:09 UTC
- 292 tests pass; lint/types pass. Standard npm build (including unchanged sync-apps hook) passed; unrelated regenerated apps catalog restored to exact de6eff24 blob, then frozen next build + Pagefind25 passed.
- Independent read-only review: no blocking mathematics issue; separate n=1…256 oracle 66,048 query/update coverage checks passed. Fixed misleading complete-interface wording; added text node ranges and current values, made update sum undefined, stopped autoplay at endpoint, corrected narrow-width wording, and added larger-prefix/range/assignment tests. No actual screen-reader run claimed.
- Local server Ready with explicit hostname after OS network-interface enumeration error. Cloud browser localhost navigation was denied by URL policy; stopped that route without alternate local URL. Preview-domain screenshot remains pending. No production URL behavior retried.

Preview `9b7b03092d3c03b6837970cefd082d16d4f86aba` deployed Ready at 2026-10-17T16:12:57Z, Preview + dev.crazycloud.cc, deployment 3cpLUUuzY1GuQh5NT48RUCVR5r9b. Real 1180×757 desktop screenshots and three next-step clicks verified prefix(7)=10 with disjoint [1,4],[5,6],[7,7] bars. Screenshot caught inherited SVG stroke making the result labels too heavy; corrected `.result text` to stroke:none and full opacity. New exact preview validation required before main. No mobile/SR acceptance claimed.
