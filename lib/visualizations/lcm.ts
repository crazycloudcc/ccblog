/** Bounded teaching model. The positive-input contract intentionally excludes zero. */
export const LCM_LIMIT = 20;
export function positiveLessonInteger(n: number) {
  if (!Number.isInteger(n) || n < 1 || n > LCM_LIMIT) throw new RangeError("请输入1到20的正整数");
}
export function lcmModel(a: number, b: number) {
  positiveLessonInteger(a); positiveLessonInteger(b);
  let x = a, y = b;
  while (y !== 0) { const r = x % y; x = y; y = r; }
  const gcd = x, lcm = (a / gcd) * b;
  const multiplesA = Array.from({ length: lcm / a }, (_, i) => (i + 1) * a);
  const multiplesB = Array.from({ length: lcm / b }, (_, i) => (i + 1) * b);
  const events = [...new Set([...multiplesA, ...multiplesB])].sort((u, v) => u - v);
  return { a, b, gcd, lcm, x: a / gcd, y: b / gcd, multiplesA, multiplesB, events };
}
export function lcmFrame(a: number, b: number, step: number) {
  const m = lcmModel(a, b);
  if (!Number.isInteger(step) || step < 0 || step > m.events.length) throw new RangeError("步数超出范围");
  const value = step === 0 ? 0 : m.events[step - 1];
  return { ...m, step, value, done: step === m.events.length,
    seenA: m.multiplesA.filter(v => v <= value), seenB: m.multiplesB.filter(v => v <= value) };
}
/** The two tracks always share this numeric coordinate mapping. */
export function lcmPosition(value: number, lcm: number) { return 112 + 640 * value / lcm; }
