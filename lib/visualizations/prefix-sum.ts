/** Bounded integer teaching model; boundary k is before cell k. */
export function prefixModel(values: readonly number[], l: number, r: number) {
  if (!Array.isArray(values) || values.length < 1 || values.length > 8 || Array.from(values).some(v => !Number.isInteger(v) || Math.abs(v) > 9)) throw new RangeError("Use 1–8 integers from -9 to 9");
  if (!Number.isInteger(l) || !Number.isInteger(r) || l < 0 || l > r || r > values.length) throw new RangeError("Require 0 <= l <= r <= n");
  const prefix = [0];
  for (const value of values) prefix.push(prefix.at(-1)! + value);
  return { values: [...values], prefix, l, r, sum: prefix[r] - prefix[l], selected: values.slice(l, r) };
}
export const prefixExamples = [
  { label: "含负数：减去负前缀", values: [4,-6,3,0,5,-2], l: 2, r: 5 },
  { label: "负区间和", values: [4,-6,3,0,5,-2], l: 1, r: 4 },
  { label: "非空，但和为零", values: [4,-6,3,0,5,-2], l: 1, r: 6 },
  { label: "空区间 [n,n)", values: [4,-6,3,0,5,-2], l: 6, r: 6 },
  { label: "单元素数组", values: [-3], l: 0, r: 1 },
] as const;
