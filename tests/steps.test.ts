// The flavour scene: which scoop is current at a given scroll progress.
import { describe, expect, it } from "vitest";
import { frameAt, loadOrder, nearestLoaded, stepAt } from "../src/lib/steps";

describe("stepAt", () => {
  it("gives each scoop an equal slice of the track", () => {
    expect(stepAt(0, 6)).toBe(0);
    expect(stepAt(0.16, 6)).toBe(0);
    expect(stepAt(0.17, 6)).toBe(1);
    expect(stepAt(0.5, 6)).toBe(3);
    expect(stepAt(0.99, 6)).toBe(5);
  });

  it("keeps the last scoop at the very end and clamps outside 0 to 1", () => {
    expect(stepAt(1, 6)).toBe(5);
    expect(stepAt(1.4, 6)).toBe(5);
    expect(stepAt(-0.2, 6)).toBe(0);
    expect(stepAt(Number.NaN, 6)).toBe(0);
  });

  it("copes with an empty scene", () => {
    expect(stepAt(0.5, 0)).toBe(0);
  });
});

describe("frameAt", () => {
  it("maps the track onto the whole sequence", () => {
    expect(frameAt(0, 96)).toBe(0);
    expect(frameAt(0.5, 96)).toBe(48);
    expect(frameAt(1, 96)).toBe(95);
    expect(frameAt(2, 96)).toBe(95);
    expect(frameAt(Number.NaN, 96)).toBe(0);
  });
});

describe("loadOrder", () => {
  it("fetches a coarse pass first and every frame once", () => {
    const order = loadOrder(96, 8);
    expect(order.slice(0, 3)).toEqual([0, 95, 8]);
    expect(new Set(order).size).toBe(96);
    expect([...order].sort((a, b) => a - b)).toEqual(Array.from({ length: 96 }, (_, i) => i));
  });
});

describe("nearestLoaded", () => {
  it("finds the closest frame that is already in", () => {
    const loaded = Array.from({ length: 10 }, (_, i) => i % 4 === 0);
    expect(nearestLoaded(4, loaded)).toBe(4);
    expect(nearestLoaded(6, loaded)).toBe(4);
    expect(nearestLoaded(7, loaded)).toBe(8);
    expect(
      nearestLoaded(
        3,
        Array.from({ length: 10 }, () => false),
      ),
    ).toBe(-1);
  });
});
