# Independent binary-search-on-answer review

Outcome: PASS after the parent corrected the fractional-time display. No remaining mathematical correctness blocker found. Implementation files were read only; all new files are in this audit directory.

## Scope

Reviewed `lib/visualizations/answer-search.ts`, the `binary-search-on-answer` lesson in `lib/visualizations/lessons.ts`, and `components/visualizations/AnswerSearchExperience.tsx` in the 2026-10-10 checkout. Audited the integer model, event oracle, invariant, smallest boundary, input validation, zero demand, continuous display semantics, and verbatim C++ snippet under documented limits.

## Evidence

- Exhaustive ordered arrays: all 22,620 arrays of length 1–4 over integer periods 1–12, including duplicates and all permutations.
- All targets 0–24 for each array: 565,500 scenarios.
- Independent event oracle uses repeated addition to enumerate product completions and sorted events to identify the requested product. It does not use floor division or binary search to find the answer.
- 6,171,558 frame checks preserve answer membership, feasible high endpoint, and excluded lower candidates.
- 2,520,279 midpoint queries and the same number of updates matched the event oracle, used correct endpoints, and strictly shrank the interval. At most 8 iterations observed.
- 1,643,148 integer-time count checks and 16,227,900 tenth-second count checks passed.
- 22,620 zero-demand scenarios returned zero in two frames without entering the loop.
- 47 invalid numeric/parser cases were rejected; six valid parser cases passed, including Chinese commas, whitespace, and zero-padded digits.
- C++: extracted the actual `enough` function and `ANSWER_CODE` into a compiled test harness. With UBSan enabled, 50,045 solver/minimum-boundary cases and 350,315 predicates agreed with independent `__int128` accumulation. Coverage includes target 0 and 1e9, period 1 and 1e9, 200,000-machine arrays, upper bound 1e18, and cases in which an unrestricted `long long` sum would overflow.

## Fractional-time issue and verified correction

The former `time.toFixed(1)` display could round 8.96 to “9.0 seconds” while the default machines still had only seven products. Clicking Explore during the tween could retain this mismatch. Reported to the parent immediately; the parent changed display formatting to floor to a tenth, and quantized the Explore transition to that same displayed value.

Verified the current TSX with a deterministic hook/effect/RAF harness, using the actual component callbacks rather than a rewritten UI model:

1. Advance from the 8-second comparison to the next frame.
2. At animation time 8.952380952380953, the title displays “8.9 秒，完成 7 件，需求 8 件，还不够”.
3. Click Explore. Time becomes exactly 8.9, the same title remains, and the pending RAF is cancelled.

Further checks passed:
- Every one of 2,881 tenth-second slider values from 0 through 288 remains unchanged on exploration.
- 3,456,012 millisecond-time/period combinations preserve counts when flooring the displayed time.
- 3,456 immediately-preceding representable floating-point/integer-boundary combinations preserve counts.
- Zero-demand preset and final frame, invalid period input leaving the valid experiment untouched, and reduced motion completing in one RAF.

## Mathematical and numeric assessment

For positive periods, every completed-product count is nondecreasing in time. The fastest machine alone guarantees that U=min(periods)*target is feasible. Thus the earliest feasible integer remains in [lo,hi], with hi feasible and no requirement that lo be infeasible. When mid is feasible, retaining mid via hi=mid cannot discard the answer; when it is infeasible, monotonicity permits lo=mid+1. Because mid<hi while lo<hi, both updates strictly shrink the finite integer interval. At convergence the answer is feasible and its predecessor is infeasible, except target zero where the nonnegative minimum is zero. All prose examples and the nonmonotonic counterexample agree with these claims.

The C++ bounds are sufficient as written: both fastest and target are long long, their product is at most 1e18, and the nonnegative difference hi-lo is representable. During enough, made remains below target before each continuation. The test `add >= target-made` returns before an addition can meet/exceed target, so the next made remains below 1e9. Each standalone add is at most 1e18. No intermediate signed overflow occurs under the stated prevalidated inputs. Zero demand returns true on the first nonempty-machine iteration, and the outer search returns zero without querying.

## Files and reruns

- `answer-search-audit.mjs` → `answer-search-results.json`
- `answer-search-ui-audit.mjs` → `answer-search-ui-results.json`
- `answer-search-cpp.cpp`, `answer-search-extracted.hpp` → `answer-search-cpp-results.txt`
- Core/lesson/UI SHA-256 hashes are recorded in the JSON.

Run the Node files directly with the existing checkout dependencies. Compile C++ with `g++ -std=c++17 -O1 -g -fsanitize=undefined -fno-sanitize-recover=all answer-search-cpp.cpp -o answer-search-cpp`, then run the binary.

## Limits

This is an independent mathematical/code review and deterministic component-event test. It does not claim browser rendering, screen-reader operation, mobile layout, end-to-end navigation, deployment, or external-link availability were tested. Those remain separate integration/visual QA concerns. No login, network, user device, or publication action was taken.

## Follow-up: slider placement and code wrapping (2026-10-09 16:41 UTC)

The parent's follow-up visual revision does not invalidate the mathematical audit:

- `answer-search.ts` SHA-256 remains `20387c08925c36c3aa870be60bac54d7f01357f80024bb1b27ce44062472fc18`.
- `lessons.ts` SHA-256 remains `42c6ab6682d9654a3ffadc517358bd814c72187217f003ddb21d89a170202d4f`.
- Current component SHA-256 is `04cd347584f1f9c490b2d5dc179b130e1c3c00c3591a4dbc88a483e5ce4bad66`. Moving its unique time-slider JSX line back after the first SVG in memory, without changing any other byte, reconstructs the original audited hash `54eaba3d7f92d0901ca26169379c9a84a569bc98217bafb982e186b0b3367733`. Thus no state, input, animation, numeric display, code snippet, or mathematical markup changed.
- Reran only the seven focused `tests/answer-search.test.mjs` cases, including real React SSR and source/CSS assertions. All seven passed. No need to repeat the unchanged exhaustive arithmetic run.

One new visual risk was sent to the parent for browser verification: the new `.code code { text-indent: -22px }` is inherited by its inline-block `.code i` line number, which lacks an explicit `text-indent: 0` reset. This could shift the numeral left a second time and clip it within the overflowing pre. It is not a mathematical or behavioral failure, and was not browser-verified in this read-only follow-up. The SSR test confirms the seven line elements and wrapping declaration but cannot establish pixel visibility or line-number positioning.

## Follow-up: native range rounding fix (2026-10-09 16:44 UTC)

Recommended and focused-verified binding the native range to `Number(displayTime)` instead of raw interpolated `time`. This supplies an already-valid tenth-second value to the browser's step=0.1 control, preventing its nearest-step sanitization from disagreeing with the floored visible label. It does not change the model time or count calculation; continuous SVG positions still use raw time. Explore's existing handler continues to commit the selected tenth and cancel the tween.

The new `answer-search-range-audit.mjs` executes the actual TSX with deterministic hooks/RAF. All 40 tween samples passed range/title/count consistency while separately confirming the SVG cursor still tracks the exact interpolated time. At raw time 8.952380952380953, range value is 8.9, title is “8.9 秒，完成 7 件，需求 8 件，还不够”, and the cursor x-coordinate is 390.23809523809524. Explore commits 8.9 and cancels RAF; selecting 9 yields eight products, selecting 8.9 yields seven. Zero-demand, maximum-domain, integer endpoints and reduced-motion checks also pass. Results are in `answer-search-range-results.json`.

The existing seven focused answer-search/SSR tests passed again. Arithmetic core and lesson hashes remain unchanged, so prior exhaustive mathematical conclusions still apply. The parent also added `.code i { text-indent: 0 }`, resolving the previously noted inherited-indent concern in source; actual pixel rendering is still covered by the separate browser review.

The earlier `answer-search-ui-audit.mjs` / results describe the previous range binding and should be treated as historical evidence for the first floor-formatting fix. For the final native-range binding, use the newer range audit rather than that earlier range-value assertion.
