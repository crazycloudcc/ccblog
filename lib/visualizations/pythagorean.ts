/** Original Euclidean dissection. Coordinates use y downward; each piece moves rigidly. */
export type Point = readonly [number, number];
export type Triangle = readonly [Point, Point, Point];
export function pythagoreanModel(a: number, b: number, progress = 1) {
  if (![a, b].every(n => Number.isFinite(n) && n >= 1 && n <= 8)) throw new RangeError("Legs must be between 1 and 8.");
  if (!Number.isFinite(progress) || progress < 0 || progress > 1) throw new RangeError("Progress must be between 0 and 1.");
  const side = a + b;
  const initial: Triangle[] = [
    [[0, 0], [a, 0], [0, b]],
    [[side, 0], [side, a], [a, 0]],
    [[side, side], [b, side], [side, a]],
    [[0, side], [0, b], [b, side]],
  ];
  const shifts: Point[] = [[0, a], [0, 0], [-b, 0], [a, -b]];
  const triangles = initial.map((tri, i) => tri.map(([x, y]) => [x + shifts[i][0] * progress, y + shifts[i][1] * progress] as Point) as unknown as Triangle);
  const center: Point[] = [[a, 0], [side, a], [b, side], [0, b]];
  return { a, b, side, c: Math.hypot(a, b), c2: a * a + b * b, a2: a * a, b2: b * b, outer: side * side, piecesArea: 2 * a * b, initial, triangles, center };
}
export function nonRightModel(angle: number) {
  if (!Number.isFinite(angle) || angle < 30 || angle > 150) throw new RangeError("Angle must be between 30 and 150 degrees.");
  const radians = angle * Math.PI / 180;
  const c2 = 25 - 24 * Math.cos(radians);
  return { angle, c2, c: Math.sqrt(c2), vertex: [4 * Math.cos(radians), 4 * Math.sin(radians)] as Point, isRight: angle === 90 };
}
export function formatMeasure(value: number) { return Number.isInteger(value) ? String(value) : value.toFixed(2); }
