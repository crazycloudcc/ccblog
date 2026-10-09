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
