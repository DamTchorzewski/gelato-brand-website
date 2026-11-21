// Which scoop of the flavour scene is current at a given scroll progress (0 to 1) of its track.
// Each scoop owns an equal slice of the track; the last one also owns the very end (progress 1).
export function stepAt(progress: number, count: number): number {
  if (count <= 0) return 0;
  const clamped = Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
  return Math.min(count - 1, Math.floor(clamped * count));
}
