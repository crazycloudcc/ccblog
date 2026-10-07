import assert from "node:assert/strict";
import { test } from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const { binaryTrace, lisTrace, parseValues } = await jiti.import("../lib/visualizations/traces.ts");

function* arrays(alphabet, maxLength, prefix = []) {
  yield prefix;
  if (prefix.length < maxLength) {
    for (const value of alphabet) yield* arrays(alphabet, maxLength, [...prefix, value]);
  }
}

function lisOracle(values, nondecreasing) {
  const lengths = values.map(() => 1);
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nondecreasing ? values[j] <= values[i] : values[j] < values[i]) {
        lengths[i] = Math.max(lengths[i], lengths[j] + 1);
      }
    }
  }
  return Math.max(0, ...lengths);
}

test("binary traces exhaustively preserve closed intervals and match membership", () => {
  for (const input of arrays([-1, 0, 1], 6)) {
    const values = [...input].sort((a, b) => a - b);
    const snapshot = [...values];
    Object.freeze(values);
    for (const target of [-2, -1, 0, 1, 2]) {
      const states = binaryTrace(values, target);
      assert.deepEqual(binaryTrace(values, target), states);
      assert.ok(states.length <= values.length + 1);
      assert.equal(states[0].lo, 0);
      assert.equal(states[0].hi, values.length - 1);
      const final = states.at(-1);
      assert.equal(final.status, values.includes(target) ? "found" : "missing");
      if (final.status === "found") assert.equal(values[final.mid], target);
      else {
        assert.equal(final.mid, null);
        assert.ok(final.lo > final.hi);
      }
      for (let i = 0; i < states.length; i++) {
        const state = states[i];
        assert.ok(state.message.length > 0);
        if (state.mid !== null) {
          assert.ok(state.lo <= state.mid && state.mid <= state.hi);
          assert.equal(state.mid, state.lo + Math.floor((state.hi - state.lo) / 2));
          if (values.includes(target)) assert.ok(values.slice(state.lo, state.hi + 1).includes(target));
        }
        if (state.status === "compare") {
          const next = states[i + 1];
          assert.ok(next.hi - next.lo < state.hi - state.lo);
          assert.equal(next.lo, values[state.mid] < target ? state.mid + 1 : state.lo);
          assert.equal(next.hi, values[state.mid] > target ? state.mid - 1 : state.hi);
        }
      }
    }
    assert.deepEqual(values, snapshot);
  }
});

test("broken binary updates halt safely at the first repeated window", () => {
  for (const input of arrays([-1, 0, 1], 5)) {
    const values = [...input].sort((a, b) => a - b);
    for (const target of [-2, -1, 0, 1, 2]) {
      const states = binaryTrace(values, target, true);
      assert.ok(states.length <= values.length + 2);
      const final = states.at(-1);
      assert.ok(["found", "stalled", "missing"].includes(final.status));
      if (!values.length) assert.equal(final.status, "missing");
      else assert.notEqual(final.status, "missing");
      if (final.status === "found") assert.equal(values[final.mid], target);
      if (final.status === "stalled") {
        const before = states.at(-2);
        assert.equal(before.status, "compare");
        for (const key of ["lo", "hi", "mid"]) assert.equal(final[key], before[key]);
        assert.notEqual(values[final.mid], target);
      }
      for (let i = 0; i < states.length - 1; i++) {
        const state = states[i];
        const next = states[i + 1];
        assert.equal(next.lo, values[state.mid] < target ? state.mid : state.lo);
        assert.equal(next.hi, values[state.mid] > target ? state.mid : state.hi);
        if (next.status !== "stalled") assert.ok(next.hi - next.lo < state.hi - state.lo);
      }
    }
  }
  assert.deepEqual(binaryTrace([1, 3], 3, true).map(({ status }) => status), ["compare", "stalled"]);
});

test("LIS snapshots agree with quadratic oracle for every prefix of small arrays", () => {
  for (const values of arrays([-1, 0, 1], 6)) {
    const snapshot = [...values];
    Object.freeze(values);
    for (const nondecreasing of [false, true]) {
      const states = lisTrace(values, nondecreasing);
      assert.deepEqual(lisTrace(values, nondecreasing), states);
      assert.equal(states.length, values.length + 1);
      assert.deepEqual(states[0].tails, []);
      assert.equal(states[0].value, null);
      assert.equal(states[0].position, null);
      for (let i = 1; i < states.length; i++) {
        const state = states[i];
        const before = states[i - 1].tails;
        const value = values[i - 1];
        assert.equal(state.tails.length, lisOracle(values.slice(0, i), nondecreasing));
        assert.equal(state.value, value);
        const first = before.findIndex((tail) => nondecreasing ? tail > value : tail >= value);
        const position = first < 0 ? before.length : first;
        assert.equal(state.position, position);
        const expected = [...before];
        expected[position] = value;
        assert.deepEqual(state.tails, expected);
        assert.notEqual(state.tails, before);
        for (let j = 1; j < state.tails.length; j++) {
          assert.ok(nondecreasing ? state.tails[j - 1] <= state.tails[j] : state.tails[j - 1] < state.tails[j]);
        }
      }
    }
    assert.deepEqual(values, snapshot);
  }
});

test("article examples expose duplicates and tails not being a real subsequence", () => {
  assert.equal(lisTrace([2, 2, 2]).at(-1).tails.length, 1);
  assert.equal(lisTrace([2, 2, 2], true).at(-1).tails.length, 3);
  assert.deepEqual(lisTrace([10, 9, 2, 5, 3, 7, 101]).at(-1).tails, [2, 3, 7, 101]);
  assert.deepEqual(lisTrace([3, 5, 6, 2]).at(-1).tails, [2, 5, 6]);
  const states = lisTrace([1, 2, 3]);
  states.at(-1).tails[0] = 999;
  assert.deepEqual(states[1].tails, [1]);
  assert.deepEqual(states[2].tails, [1, 2]);
});

test("input parser accepts full bounded integers and rejects malformed or excessive input", () => {
  for (const raw of [" -999 0 +999 ", "-999, 0，+999", "-999\n0\t+999"]) {
    assert.deepEqual(parseValues(raw), { values: [-999, 0, 999] });
  }
  assert.deepEqual(parseValues("01 +2 -3"), { values: [1, 2, -3] });
  assert.equal(parseValues(Array(12).fill("1").join(" ")).values.length, 12);
  for (const raw of ["", " \t\n", "1.5", "1e2", "0x10", "2x", "Infinity", "NaN", "1/2", "--1", "+", "1,,2", ",1", "1,", "1, ,2", "1000", "-1000", "9".repeat(400), Array(13).fill("1").join(" ")]) {
    const result = parseValues(raw);
    assert.deepEqual(result.values, [], raw);
    assert.equal(typeof result.error, "string", raw);
    assert.ok(result.error.length > 0, raw);
  }
});
