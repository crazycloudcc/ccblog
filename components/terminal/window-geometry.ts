export type WindowRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// A small viewport must take precedence over the desktop resize minimum.
export function resizeDimension(value: number, minimum: number, available: number) {
  const maximum = Math.max(0, available);
  return Math.max(Math.min(minimum, maximum), Math.min(maximum, value));
}

export function fitWindowRect(rect: WindowRect, bounds: { width: number; height: number }): WindowRect {
  const width = Math.min(rect.width, Math.max(0, bounds.width));
  const height = Math.min(rect.height, Math.max(0, bounds.height));
  const x = Math.max(0, Math.min(rect.x, bounds.width - width));
  const y = Math.max(0, Math.min(rect.y, bounds.height - height));
  if (x === rect.x && y === rect.y && width === rect.width && height === rect.height) return rect;
  return { x, y, width, height };
}
