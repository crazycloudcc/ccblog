/** Original point-light geometry. Lengths are metres; finite model only. */
export type Point = readonly [number, number];
export function shadowModel(H: number, h: number, x: number, progress = 0) {
  if (![H,h,x,progress].every(Number.isFinite) || H < 4 || H > 10 || h < 1 || h > 3 || x < 1 || x > 8 || progress < 0 || progress > 1) throw new RangeError('实验范围：H 4–10，h 1–3，x 1–8，进度 0–1。');
  const s = h*x/(H-h), q = H*x/(H-h), ratio = H/h;
  const scale = 1+progress*(ratio-1);
  const big: Point[] = [[0,0],[0,H],[q,0]];
  const small: Point[] = [[x,0],[x,h],[q,0]];
  const transformed: Point[] = small.map(([px,py])=>[q+scale*(px-q),scale*py]);
  return {H,h,x,s,q,ratio,scale,big,small,transformed,coefficient:h/(H-h),maxQ:H*8/(H-h)};
}
export function measure(value: number) {
  const rounded = Number(value.toFixed(2));
  return `${Math.abs(value-rounded)<1e-10?'=':'≈'} ${rounded.toFixed(2).replace(/\.00$/, '')}`;
}
export const similarityCode = [
  '// 本实验：4 ≤ H ≤ 10, 1 ≤ h ≤ 3, 1 ≤ x ≤ 8（米）',
  'if (!(H > h && h > 0 && x > 0)) {',
  '  throw new Error("不满足有限影长模型");',
  '}',
  'const s = h * x / (H - h);',
  'const q = H * x / (H - h); // 影尖距灯底',
  '// 保留计算精度，只在显示时取近似值',
];
