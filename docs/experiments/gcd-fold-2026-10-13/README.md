# Positive multi-input GCD explanation

## Goal and sources

Started 2026-10-13 04:02:56 UTC, after the existing cloud executor became usable again. This is maintenance of the October 13 lesson, not another daily article. The two-input SVG, input domain, routes and teaching dates remain unchanged.

The March 14, 2015 question [GCD associativity](https://math.stackexchange.com/questions/1189424/gcda-b-c-gcd-gcda-b-c-associative-law-for-gcd-lcm) asks why repeated pairwise GCD computes a common GCD. Its comments expose a genuine proof detail: the numerically greatest common divisor cannot simply be assumed to contain every common divisor without justification. Our existing Euclidean invariant supplies that justification by preserving the divisor set through the terminal pair (g,0).

A further question, [Finding the GCD of three numbers?](https://math.stackexchange.com/questions/93731/finding-the-gcd-of-three-numbers), was asked December 23, 2011 at 18:06. Its original intent is pairwise coprimality, which differs from a common three-input GCD. We do not copy its proposed algorithms or claim that a common GCD of 1 proves pairwise coprimality. Both sources are historical learning intent, not new trends or search-volume evidence.

## Scope

One shared static explanation in `lessons.ts`, plus focused mathematical and Markdown regressions. For positive integers a,b,c, let g=gcd(a,b). Every positive divisor divides both a,b exactly when it divides g, because the Euclidean steps preserve their common divisors until (g,0). Intersect with divisors of c to obtain gcd(a,b,c)=gcd(g,c).

Examples: (48,18,30) gives 6, while (48,18,20) gives 2. No new multi-input API, empty-list or all-zero convention is introduced. The existing core still rejects (0,0), so this explanation deliberately does not promise an unconditional associativity law on every nonnegative tuple. The core SVG is untouched.

## Dream Loop and working tree

Exact preview baseline `4e498ba9a31292edbcb0f6a3a8dd55f320f4b708` was materialized in a separate directory inside the same authorized cloud environment; all 352 baseline blobs matched. The old working tree's 20 modifications were preserved. No new environment, branch or dependency installation was used.

AetherViz SKILL and the repository's MIT attribution were read; the original SVG implementation is preserved without external graphics scripts. Dream Loop SKILL and its Pro workflow were read at upstream commit `9bddb901f7d071cfefdd21e264267c757177a9df`, together with its MIT license. A stale AetherViz main URL returned 404; its actual master file was read normally.

The browser entry explicitly selected `cdp`, documented as the dot cloud browser. The requested old tab was absent; a new tab in that same cloud browser opened the existing preview lesson. No unrestricted tab enumeration or user-computer operation was used. A real baseline screenshot was saved locally at 04:04:45 UTC. The local generated target is a layout reference only, never a teaching proof or real screenshot, and is not uploaded.

Implementation, independent math review, full checks, real after screenshots and exact deployment verification are recorded below as they finish. No unverified stage is a release claim.

## Checks before preview

At 04:07:00 UTC the final implementation passed 246/246 tests, lint, TypeScript, configuration validation, frozen-source Next webpack build and Pagefind. Generated HTML and Markdown both contain the shared explanation. No data-sync prebuild or dependency installation was run.

Independent mathematical review passed at 04:07:55 UTC: 216,000 positive triples in 1–60, 1,296,000 permutations and 12,960,000 divisor-set comparisons; 2,056 safe-integer boundary/deterministic-random triples against BigInt (12,336 permutations); 128 lists of lengths 1–12 with reverse-order comparison. Static HTML, Markdown equality, dates and canonical were inspected. No blocker found. The extra test counterexample (6,10,15) has common GCD 1 but pairwise GCDs 2,3,5; the text does not equate these concepts.

Real baseline and generated target were captured/prepared in parallel with the implementation and review. The target remains a local layout reference; its generated lettering and larger raster size are not accepted as mathematical evidence. Real after-image and exact preview/production verification remain pending at this product commit.
