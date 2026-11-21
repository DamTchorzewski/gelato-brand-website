// The flavour scene: which scoop is current at a given scroll progress.
import { describe, expect, it } from "vitest";
import { stepAt } from "../src/lib/steps";

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
