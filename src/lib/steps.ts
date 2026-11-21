// Which scoop of the flavour scene is current at a given scroll progress (0 to 1) of its track.
// Each scoop owns an equal slice of the track; the last one also owns the very end (progress 1).
export function stepAt(progress: number, count: number): number {
  if (count <= 0) return 0;
  const clamped = Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
  return Math.min(count - 1, Math.floor(clamped * count));
}

// The frame of the cone sequence (0 to count - 1) shown at a given scroll progress of the track.
export function frameAt(progress: number, count: number): number {
  if (count <= 0) return 0;
  const clamped = Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
  return Math.round(clamped * (count - 1));
}

// The order in which frames are fetched: a coarse pass first (every `stride`-th frame, so the whole scene can be
// scrubbed early), then the frames in between. Every frame appears exactly once.
export function loadOrder(count: number, stride = 8): number[] {
  if (count <= 0) return [];
  // the first and the last frame (the empty and the finished cone) come before anything else
  const order: number[] = count > 1 ? [0, count - 1] : [0];
  const seen = new Set(order);
  for (let step = Math.max(1, stride); ; step = Math.max(1, Math.floor(step / 2))) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
    if (step === 1) break;
  }
  return order;
}

// The loaded frame closest to the wanted one (searching outwards), or -1 when none is loaded yet.
export function nearestLoaded(wanted: number, loaded: ArrayLike<boolean>): number {
  for (let d = 0; d < loaded.length; d++) {
    if (loaded[wanted - d]) return wanted - d;
    if (loaded[wanted + d]) return wanted + d;
  }
  return -1;
}
