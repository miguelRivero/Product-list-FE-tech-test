import { describe, expect, it } from "vitest";
import { generateSecureClientId, isClientGeneratedId } from "./idGenerator";

describe("generateSecureClientId", () => {
  it("generates a number", () => {
    const id = generateSecureClientId();

    expect(typeof id).toBe("number");
  });

  it("generates IDs in the range 10000-99999", () => {
    for (let i = 0; i < 10; i++) {
      const id = generateSecureClientId();
      expect(id).toBeGreaterThanOrEqual(10000);
      expect(id).toBeLessThan(100000);
    }
  });

  it("generates unique IDs", () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
      ids.add(generateSecureClientId());
    }
    // We should have at least 95 unique IDs (allowing for some collisions due to randomness)
    expect(ids.size).toBeGreaterThan(90);
  });
});

describe("isClientGeneratedId", () => {
  it("returns true for IDs in range 10000-99999", () => {
    expect(isClientGeneratedId(10000)).toBe(true);
    expect(isClientGeneratedId(50000)).toBe(true);
    expect(isClientGeneratedId(99999)).toBe(true);
  });

  it("returns false for IDs outside range", () => {
    expect(isClientGeneratedId(1)).toBe(false);
    expect(isClientGeneratedId(9999)).toBe(false);
    expect(isClientGeneratedId(100000)).toBe(false);
    expect(isClientGeneratedId(999999)).toBe(false);
  });
});
