# GCD exact-decimal scope clarification

Started 2026-10-12 18:04:20 UTC (Shanghai Oct13). Maintenance only; sole Oct13 article remains GCD published16:49:46UTC. Exact preview c7cb43fa715a24eda4119308ce6950617f34bbfd materialized in existing cloud directory, all350 blobs verified; old20 dirty entries untouched. No new environment/branch/dependency or other project.

## Evidence and scope
- Actually read original learner question https://stackoverflow.com/questions/14297515/calculating-greatest-common-divisor , asked2013-01-12 20:12, about C float input111.6/46.5. Evergreen confusion, not new heat/search-volume evidence. Did not copy answer's precision-specific numeric claims.
- Actually read primary https://docs.python.org/3/tutorial/floatingpoint.html : most finite decimal fractions are not exact in binary floating point; distinction between input's intended value and stored representation. Live documentation page, original publication date not established; access2026-10-12.
- Another result https://stackoverflow.com/questions/445113/approximate-greatest-common-divisor/445161 returned Cache miss when opened; not treated as verified original evidence.
- Independent scope assessment confirms current integer implementation is correct, but why decimals require separate treatment is useful additional explanation. Exact rational1116/10 and465/10 have common measure93/10; cannot promise arbitrary stored float times10 then rounding equals original exact decimal. Measured approximate values need an error model. No input-domain expansion or arbitrary tolerance algorithm.

## Goal and implementation
Only one shared static misconception/FAQ bullet and official reference, plus necessary regressions. Native geometry, controls, routes, canonical/sitemap, /learn/Notes split, original teaching dates unchanged. Old cancelled binary proof excluded; stoppedprojects untouched.
Actually re-read AetherViz SKILL and retained MIT notice; Dream Loop SKILL/pinned Pro workflow and MIT notice. For this text-only layout goal retain existing typography/core SVG; do not execute upstream/CDN scripts. Actual before screenshot captured18:07:18; generated target is optional local layout reference only, not realQA or mathematical proof and is never uploaded.
Status: local implementation/review/checks in progress, preview/production not submitted at this entry.

### Review correction before release
Independent exact Fraction review checked82,944 positive rational pairs with4 denominator refinements, and the two focused tests passed. Review then requested explicit definition of maximum common measure as the largest positive length of which bothpositive lengths are integer multiples. Addedthat definition beforefinalvalidation; no algorithmchange. Initial242fullchecks passed but finalallchecks must runagain afterthiswordingchange. Generatedtargetlocalonly retainslayout buthasalteredglyphs/resolution, notmathproof.
- Final independent review18:12:23 passes definition, exact93/10/12and5multiples, denominator invariance, storedfloat warning and measured-data boundary. Finaltwofocusedtests passed again; unchanged euclidean.ts andteachingdates verified. Reportlocal .dream-loop/gcd-decimal/math-review.md. No browser/phone claim from mathematicalchecks.
- Finalafterdefinition fullchecks completed18:14:10UTC:242/242tests, lint, types, config, frozenNextwebpackbuild andPagefind allpass. GeneratedSSRHTML/Markdown containpositive-integer-multipledefinition andexact9.3example. Preview/actualafter/productionremainpending.
