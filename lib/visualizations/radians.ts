export const TAU = 2 * Math.PI;
export function radianModel(radius: number, degrees: number) {
  if (!Number.isFinite(radius) || radius < 0.5 || radius > 2 || !Number.isFinite(degrees) || degrees < 0 || degrees > 360) throw new RangeError("实验要求 0.5≤r≤2、0≤角度≤360");
  const theta = degrees * Math.PI / 180;
  return { radius, degrees, theta, length: radius * theta, ratio: theta };
}
/** Arc-length parameterization. Tangent (cos(ku), sin(ku)) has unit norm. */
export function unrolledPoint(radius: number, u: number, progress: number): [number, number] {
  if (![radius,u,progress].every(Number.isFinite) || radius <= 0 || u < 0 || u > radius * TAU + 1e-12 || progress < 0 || progress > 1) throw new RangeError("无效的弧长或展开进度");
  const k = (1-progress)/radius;
  if (k === 0) return [u,0];
  const z=k*u;
  // Stable at tiny curvature: 1-cos(z) would lose significant digits.
  return [u * (z === 0 ? 1 : Math.sin(z)/z), 2*Math.sin(z/2)**2/k];
}
export function unrolledPoints(radius:number, theta:number, progress:number, segments=180) {
  if (!Number.isFinite(theta) || theta<0 || theta>TAU || !Number.isInteger(segments) || segments<1 || segments>2000) throw new RangeError("无效采样参数");
  return Array.from({length:segments+1},(_,i)=>unrolledPoint(radius,radius*theta*i/segments,progress));
}
