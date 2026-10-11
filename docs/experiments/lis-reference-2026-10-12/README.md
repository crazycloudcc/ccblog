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
