# LIS reference destination maintenance

Started 2026-10-11 21:03UTC / ShanghaiOctober12. This is a one-link maintenance change, not a new article. Current production publication pending.

## Verified need

During the21UTC search/teaching-demand check, the existing source https://cp-algorithms.com/sequences/longest_increasing_subsequence.html was actually readable but contained only an official moved-article notice. Its own link led to https://cp-algorithms.com/dynamic_programming/longest_increasing_subsequence.html with the complete LIS article. The notice shows updated2025-08-25; the full article shows2026-09-18. This is an observed extra navigation step, not a broken-link/outage/traffic claim or an assertion that the move happened today. No contents from inaccessible StackOverflow22923646(403), TES13606810(tool inaccessible), or SLRpenguinarticle(Cachemiss) were treated as verified demand; denied resources were not retried.

Independent review confirmed publisher/project identity and topic fit: strictLIS, quadraticDP, tails/binarysearch, reconstruction and nondecreasing variant. It did not claim historical wording equality. The external prose still contains a 'strictly greater' wording issue beside lower_bound; our mathematically correct first≥x/first>x distinction is not changed.

## Scope and Dream Loop

Existing dot workspace only. Exact preview1de2c0b7be94a7107b58e815569ac9f2fd163568/tree73218c509458356e80b93af3c420d69e1bd30279 reread;241 nonhistorical blobs matched the existing isolated snapshot before edits. Original20dirtyitems untouched. No newbranch/environment/dependency/credentials/tracking/manualdeploy.

Target: keep every visible label, chart, teaching statement, date and layout unchanged, while the existing CP-Algorithms reference opens the full official article directly. An actual baseline screenshot of the reference section was captured in the existing dot cloud browser. This functional-link maintenance does not require a generated redesign; the unchanged baseline is its visual target. Implementation changes only one shared lessons.ts URL, automatically feeding HTML and Markdown. Added regression checks both outputs, absence of old URL and unchanged LIS publication/update dates. No SVG, math model, algorithm, keyboard controls, Notes,canonical,sitemap or308query changes. Independent diff and real-preview screenshot review remain gates, followed by exactpreviewCI/Ready and production verification. Actual mobile/touch not tested for this link-only change; no claim of fresh full visual/interaction acceptance.

## Local validation,21:04UTC

230/230 tests passed, full lint,TypeScriptnoEmit,configvalidation,frozen-data webpackproductionbuild andPagefind passed. Independent final diff review: oneURL replacement only in lessondata; fourteen appended regression-test lines, no removed/altered old tests. Mathematics,dates,geometry and algorithm implementation unchanged. Preview and production remain pending at this stage.

## Exact preview and independent visual review

Product SHA: `683a68a9e0f47c4ccd68d1a8d9a2d331071efd69`. Preview CI [38175058016](https://github.com/crazycloudcc/ccblog/actions/runs/38175058016) passed. [Preview deployment](https://vercel.com/chainboxapp/ccblog/C1eRYwcb7oa3oa9GiFoHdcaQKWAj) was actually read as Ready / Preview / dev.crazycloud.cc with this exact SHA at 21:09 UTC. The rendered HTML reference href matches the complete official article; visible teaching dates remain October 7 and October 10.

Independent review actually viewed the 1180 × 757 before/after screenshots. Reference labels, underlines, wrapping, reading links and footer remained aligned, with no new clipping or overflow. No correction was required. Full-image equality is not claimed because the runtime header changes. This review did not cover mobile, external-link clicking or other scroll positions.

Normal browser navigation to the preview Markdown route returned `net::ERR_BLOCKED_BY_CLIENT`. That resource was not retried through another route. Live Markdown remains unverified; local rendering tests for both HTML and Markdown passed. This is a tool navigation limitation, not evidence of a public-site outage.

After the preview gates passed, main advanced non-forced from `6522e3c1b16c3808a4017628260b7692b6d3ee00` to the same product SHA. Production validation follows below.

## Production verified

At 2026-10-11 21:11:17 UTC (Shanghai October 12 05:11:17), the public LIS lesson rendered the new official reference href, its unchanged canonical URL, and original teaching dates (published October 7; updated October 10). [Production deployment](https://vercel.com/chainboxapp/ccblog/GJxaEZQ2xrwy764PiSBqaMQrbZhJ) was read as Ready / Production / crazycloud.cc / exact product SHA. [Main CI 38175225196](https://github.com/crazycloudcc/ccblog/actions/runs/38175225196) completed successfully. No additional article was created. This receipt is documentation only.
