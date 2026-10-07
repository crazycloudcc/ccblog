# Independent LIS correctness and UI review

Reviewed 2026-10-07 UTC; final recheck completed at 15:12 UTC. No implementation, test-suite, or Git changes were made by this reviewer. The two files in this review directory are the authorized review evidence.

Final result: no remaining blocking findings. Both reported accessibility issues were fixed by the builder and independently verified. The full independent review script passes, and the final focused repository checks pass 16/16.

## Findings

- Algorithm: no blocker found. An independent quadratic dynamic-programming oracle matched minimum endings for 19,846 arrays and 307,898 prefix/mode frames. Every reconstructed witness has increasing original indices, values obeying the chosen strict/nondecreasing rule, and length equal to tails length. Snapshots are deterministic and do not share their array identities with previous frames. Frozen input was accepted without mutation.
- The generated design's erroneous math was not copied. For `[3,5,7,1,2,8]`, step 5 has tails `[1,2,7]`, length 3, and a real witness `[3,5,7]` at indices `[0,1,2]`. Step 6 has tails `[1,2,7,8]`, length 4, and a real witness `[3,5,7,8]` at indices `[0,1,2,5]`.
- Deterministic UI execution passes initial/final/empty frames, backwards/reset navigation, rule/preset/apply/slider synchronization, malformed-input preservation, strict and nondecreasing duplicates, single items, zero, negative values, both ±999 extremes, and 12-item input. SVG numeric geometry stays finite. Both graphs have unique title/description references, and graph/code scroll regions are focusable.
- Fixed and verified: real React SSR exposed a concrete accessibility defect in the initial reviewed TSX. The input SVG `<title>` was assembled from multiple JSX children, which made React 19 emit a warning and render an empty title. It now uses one template-string child. The accompanying script confirms a nonempty accessible title in the real SSR output, with no warning on the final rerun. The builder also added a real React SSR regression test.
- Fixed and verified: the initial unread-circle and hollow legend outlines used light-theme `--theme-mist` (#b0a49e) on paper (#fffef9), a computed 2.40:1 contrast. Both now use `--theme-slate`, improving outline visibility while preserving the hollow shape. This is source-derived verification, not a browser measurement.

## Static publication and integration

- The actual LIS route branch renders all LessonReading content: definition, conditions, invariant, complexity, walkthrough, mistakes, and answer. It contains one h1 and direct Notes and Markdown links, and keeps a noscript explanation.
- Static params and the LIS canonical metadata path remain intact. Existing publication/routing/trace tests passed 12/12 before the new implementation, including sitemap identity, Markdown canonical headers, and permanent legacy-redirect configuration. After the fixes, `node --test tests/lis-experience.test.mjs tests/learn-publication.test.mjs tests/learn-routing.test.mjs` passed 16/16.
- The LIS route deliberately remains inside the terminal shell. No fullscreen bypass is needed for this design. The old generic route branch is now unreachable for the two known lessons, but it is not relied on for the new route's actual SSR facts.
- CSS source provides focus-visible outlines, named local scroll regions, mobile/container-query stacking, and a reduced-motion override. There is no autoplay or animation timer in the new component.

## Reproduce

Run `node docs/experiments/dream-loop-2026-10-07/checks/algorithm-review.mjs` from the repository. It reads current implementation files, prints SHA-256 values, checks the independent oracle, executes the controls in a deterministic hook host, and renders the actual route branch with real React SSR. Its SVG title assertion protects the identified defect. All three stages passed on the final reviewed version. It does not install dependencies or edit files.

The algorithm corpus comprises exhaustive arrays over `{-2,0,2}` through length 8, 10,000 seeded random arrays of length 0–12 and values -999…999, and five explicit extreme/counterexample arrays. Both rules are tested for every prefix.

## Scope limits

This review has not performed live keyboard events, responsive visual inspection, computed CSS layout, screen-reader testing, hydration, HTTP redirect checks, or browser-history navigation. Source and deterministic-render checks are not real browser QA. The parent task is coordinating that validation separately. Full build/lint/type-check results are also owned by the parent/builder.

## Initial reviewed source hashes

- `LisExperience.tsx`: `13897049d41d93ea49c0de3b291fd9aaa3c0a4be668c1be53fdde4a13d20bd3d`
- `LisExperience.module.css`: `97392aadddf3243fac81a34a7f49647a64cfab48e93e007de3aa3da08aab424c`
- `lis-witness.ts`: `9ffcbc7e814a3f404d6d7abce8fe6cc1095cd0a23c0addb25338f7ef392279a5`
- `app/learn/[slug]/page.tsx`: `77c95eb6715fa4717ce33855aa5b9564ff068ff2f888086a7bbea086dec1e1fe`

The script prints fresh hashes on each rerun so later fixes can be distinguished from this initial review.

## Final verified source hashes

- `LisExperience.tsx`: `96914bf1b0cb27280381ecf932b5f59a8e96b18020cc367e385e6562952e9ffe`
- `LisExperience.module.css`: `e1237e21fc5338cc9ccde5a37e5bf8fcf13ee56223a5f630967acaf94f1bca97`
- `lis-witness.ts`: `9ffcbc7e814a3f404d6d7abce8fe6cc1095cd0a23c0addb25338f7ef392279a5`
- `app/learn/[slug]/page.tsx`: `77c95eb6715fa4717ce33855aa5b9564ff068ff2f888086a7bbea086dec1e1fe`
