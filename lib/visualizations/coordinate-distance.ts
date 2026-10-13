/** A bounded interactive model, not a claim that the distance formula requires integers. */
export type CoordinatePoint = readonly [number, number];
export const COORDINATE_LIMIT = 5;
export function coordinatePoint(p: CoordinatePoint) {
  if (!Array.isArray(p) || p.length !== 2 || !p.every(n => Number.isInteger(n) && Math.abs(n) <= COORDINATE_LIMIT)) throw new RangeError('实验坐标须为−5到5的整数');
  return p;
}
export function exactDistance(square: number) {
  if (!Number.isInteger(square) || square < 0 || square > 200) throw new RangeError('实验平方距离范围为0到200');
  if (square === 0) return '0';
  let factor = 1;
  for (let k = 2; k*k <= square; k++) if (square % (k*k) === 0) factor = k;
  const rest = square / (factor*factor);
  return rest === 1 ? String(factor) : `${factor === 1 ? '' : factor}√${rest}`;
}
export function coordinateDistance(a: CoordinatePoint, b: CoordinatePoint, progress = 1) {
  coordinatePoint(a); coordinatePoint(b);
  if (!Number.isFinite(progress) || progress < 0 || progress > 1) throw new RangeError('辅助线进度为0到1');
  const dx = b[0]-a[0], dy = b[1]-a[1], square = dx*dx+dy*dy;
  const c: CoordinatePoint = [b[0],a[1]];
  return { a, b, c, dx, dy, horizontal: Math.abs(dx), vertical: Math.abs(dy), square,
    distance: Math.hypot(dx,dy), exact: exactDistance(square), triangle: dx !== 0 && dy !== 0,
    coincident: square === 0,
    horizontalEnd: [a[0]+dx*Math.min(1,progress*2),a[1]] as CoordinatePoint,
    verticalEnd: [b[0],a[1]+dy*Math.max(0,progress*2-1)] as CoordinatePoint };
}
/** Equal scales on both axes, fixed across all inputs. SVG y runs downward. */
export function coordinateScreen(p: CoordinatePoint): [number,number] { return [270+p[0]*36,250-p[1]*36]; }
export function translateCoordinates(a: CoordinatePoint,b: CoordinatePoint,tx:number,ty:number): [CoordinatePoint,CoordinatePoint] | null {
  coordinatePoint(a);coordinatePoint(b);
  if (!Number.isInteger(tx) || !Number.isInteger(ty)) throw new RangeError('平移须为整数');
  const next: [CoordinatePoint,CoordinatePoint] = [[a[0]+tx,a[1]+ty],[b[0]+tx,b[1]+ty]];
  // Reject the entire translation, never independently clamp the two endpoints.
  return next.every(p=>p.every(n=>Number.isInteger(n)&&Math.abs(n)<=COORDINATE_LIMIT)) ? next : null;
}
