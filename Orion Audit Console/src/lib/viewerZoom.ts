export const MAX_VIEWER_SCALE = 6;

export function wheelScale(scale: number, delta: number, mode: number, pageHeight: number, minScale: number) {
  const pixels = delta * (mode === 1 ? 16 : mode === 2 ? pageHeight : 1);
  return Math.max(minScale, Math.min(MAX_VIEWER_SCALE, scale * Math.exp(-pixels * 0.0015)));
}

export function anchoredTransform(x: number, y: number, scale: number, nextScale: number, anchorX: number, anchorY: number) {
  const ratio = nextScale / scale;
  return { x: anchorX - (anchorX - x) * ratio, y: anchorY - (anchorY - y) * ratio };
}