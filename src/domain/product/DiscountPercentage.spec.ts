import { describe, it, expect } from "vitest";
import { DiscountPercentage } from "./DiscountPercentage";
import { InvalidDiscountPercentageError } from "./errors";

describe("DiscountPercentage", () => {
  describe("create", () => {
    it("creates valid discount percentage", () => {
      const discount = DiscountPercentage.create(10);
      expect(discount.getValue()).toBe(10);
    });

    it("creates discount with zero value", () => {
      const discount = DiscountPercentage.create(0);
      expect(discount.getValue()).toBe(0);
    });

    it("creates discount with maximum value (100)", () => {
      const discount = DiscountPercentage.create(100);
      expect(discount.getValue()).toBe(100);
    });

    it("creates discount with decimal value", () => {
      const discount = DiscountPercentage.create(15.5);
      expect(discount.getValue()).toBe(15.5);
    });

    it("throws error for negative value", () => {
      expect(() => DiscountPercentage.create(-1)).toThrow(InvalidDiscountPercentageError);
      expect(() => DiscountPercentage.create(-1)).toThrow(
        "Discount must be between 0 and 100"
      );
    });

    it("throws error for value exceeding 100", () => {
      expect(() => DiscountPercentage.create(101)).toThrow(InvalidDiscountPercentageError);
      expect(() => DiscountPercentage.create(101)).toThrow(
        "Discount must be between 0 and 100"
      );
    });
  });

  describe("none", () => {
    it("creates zero discount", () => {
      const discount = DiscountPercentage.none();
      expect(discount.getValue()).toBe(0);
    });
  });

  describe("getValue", () => {
    it("returns the discount value", () => {
      const discount = DiscountPercentage.create(25);
      expect(discount.getValue()).toBe(25);
    });
  });

  describe("equals", () => {
    it("returns true for equal discount values", () => {
      const discount1 = DiscountPercentage.create(10);
      const discount2 = DiscountPercentage.create(10);
      expect(discount1.equals(discount2)).toBe(true);
    });

    it("returns false for different discount values", () => {
      const discount1 = DiscountPercentage.create(10);
      const discount2 = DiscountPercentage.create(20);
      expect(discount1.equals(discount2)).toBe(false);
    });
  });
});
