/** D records changes in the extra amount, not differences of the original A. */
export type RangeAddition = { l: number; r: number; value: number };
export function differenceModel(values: readonly number[], updates: readonly RangeAddition[]) {
  if (!Array.isArray(values) || values.length < 1 || values.length > 8 || Array.from(values).some(v => !Number.isInteger(v) || Math.abs(v) > 9)) throw new RangeError("Use 1–8 integers from -9 to 9");
  if (!Array.isArray(updates) || updates.length > 8) throw new RangeError("Use at most 8 updates");
  const delta = Array(values.length + 1).fill(0) as number[];
  for (const u of Array.from(updates)) {
    if (!u || !Number.isInteger(u.l) || !Number.isInteger(u.r) || u.l < 0 || u.l > u.r || u.r > values.length || !Number.isInteger(u.value) || Math.abs(u.value) > 9) throw new RangeError("Require 0 <= l <= r <= n and integer value in -9..9");
    delta[u.l] += u.value; delta[u.r] -= u.value;
  }
  let running = 0;
  const extra = delta.slice(0,-1).map(d => running += d);
  return { values: [...values], delta, extra, result: values.map((v,i) => v + extra[i]) };
}
export const differenceExamples = [
  {label:"一段加 3",l:1,r:4,value:3,overlap:false},
  {label:"重叠两段",l:1,r:4,value:3,overlap:true},
  {label:"全段减 2",l:0,r:6,value:-2,overlap:false},
  {label:"只改末项",l:5,r:6,value:4,overlap:false},
  {label:"空区间",l:3,r:3,value:3,overlap:false},
] as const;
