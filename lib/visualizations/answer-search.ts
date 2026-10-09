/** Integer first-true model. UI limits intentionally keep every number exact. */
export const MACHINE_LIMITS = { count: 4, period: 12, target: 24 } as const;
export type SearchFrame = { lo: number; hi: number; mid: number | null; produced: number; feasible: boolean | null; line: number; message: string };
export function validateMachines(periods: readonly number[], target: number): string | null {
  if (!periods.length || periods.length > MACHINE_LIMITS.count || periods.some(k => !Number.isInteger(k) || k < 1 || k > MACHINE_LIMITS.period)) return "请输入 1–4 台机器，每台耗时是 1–12 秒的整数。";
  if (!Number.isInteger(target) || target < 0 || target > MACHINE_LIMITS.target) return "需求必须是 0–24 件的整数。";
  return null;
}
export function parseMachines(raw: string, targetRaw: string) {
  const parts = raw.trim().split(/[\s,，]+/);
  if (!raw.trim() || parts.some(x => !/^\d+$/.test(x)) || !/^\d+$/.test(targetRaw.trim())) return { error: "请填写整数，以空格或逗号分隔机器耗时。" };
  const periods = parts.map(Number), target = Number(targetRaw);
  const error = validateMachines(periods, target);
  return error ? { error } : { periods, target };
}
export function completed(periods: readonly number[], time: number): number {
  return periods.reduce((n, k) => n + Math.floor(time / k), 0);
}
export function searchAnswer(periods: readonly number[], target: number): SearchFrame[] {
  const error = validateMachines(periods, target); if (error) throw new RangeError(error);
  let lo = 0, hi = Math.min(...periods) * target;
  const frames: SearchFrame[] = [{ lo, hi, mid: null, produced: 0, feasible: null, line: 1, message: `先把答案放进 [0, ${hi}] 秒。最快机器独自完成需求，已经给出了可行上界。` }];
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2), produced = completed(periods, mid), feasible = produced >= target;
    frames.push({ lo, hi, mid, produced, feasible, line: 3, message: `${mid} 秒完成 ${produced} 件，${feasible ? "已够用：答案不会晚于这个时刻。" : "还不够：这个时刻及更早都不行。"}` });
    if (feasible) hi = mid; else lo = mid + 1;
    frames.push({ lo, hi, mid: null, produced, feasible, line: feasible ? 4 : 5, message: feasible ? `保留 mid，令 hi = ${hi}。它可行，但还要找更早的。` : `跳过 mid，令 lo = ${lo}。更早的时刻都已排除。` });
  }
  frames.push({ lo, hi, mid: lo, produced: completed(periods, lo), feasible: true, line: 7, message: target === 0 ? "需求是 0 件：开始时就够用，最早 0 秒。" : `区间合拢：最早 ${lo} 秒。此时够用，${lo - 1} 秒只有 ${completed(periods, lo - 1)} 件。` });
  return frames;
}
export const ANSWER_CODE = [
  "long long lo = 0, hi = fastest * target;",
  "while (lo < hi) {",
  "  long long mid = lo + (hi - lo) / 2;",
  "  if (enough(mid)) hi = mid;",
  "  else lo = mid + 1;",
  "}",
  "return lo; // 第一个可行时刻",
];
