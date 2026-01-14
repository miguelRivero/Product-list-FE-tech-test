import { describe, expect, it } from "vitest";

import { InvalidPriceError } from "./errors";
import { Price } from "./Price";

describe("Price", () => {
  describe("create", () => {
    it("creates valid price with default currency", () => {
      const price = Price.create(100);
      expect(price.getAmount()).toBe(100);
      expect(price.getCurrency()).toBe("USD");
    });

    it("creates valid price with custom currency", () => {
      const price = Price.create(100, "EUR");
      expect(price.getAmount()).toBe(100);
      expect(price.getCurrency()).toBe("EUR");
    });

    it("creates price with zero amount", () => {
      const price = Price.create(0);
      expect(price.getAmount()).toBe(0);
    });

    it("creates price with decimal amount", () => {
      const price = Price.create(99.99);
      expect(price.getAmount()).toBe(99.99);
    });

    it("throws error for negative amount", () => {
      expect(() => Price.create(-1)).toThrow(InvalidPriceError);
      expect(() => Price.create(-1)).toThrow("Price amount cannot be negative");
    });

    it("throws error for Infinity", () => {
      expect(() => Price.create(Infinity)).toThrow(InvalidPriceError);
      expect(() => Price.create(Infinity)).toThrow(
        "Price amount must be finite"
      );
    });

    it("throws error for -Infinity", () => {
      expect(() => Price.create(-Infinity)).toThrow(InvalidPriceError);
      // -Infinity is negative, so it throws negative error first
      expect(() => Price.create(-Infinity)).toThrow(
        "Price amount cannot be negative"
      );
    });

    it("throws error for NaN", () => {
      expect(() => Price.create(NaN)).toThrow(InvalidPriceError);
      expect(() => Price.create(NaN)).toThrow("Price amount must be finite");
    });
  });

  describe("zero", () => {
    it("creates zero price with default currency", () => {
      const price = Price.zero();
      expect(price.getAmount()).toBe(0);
      expect(price.getCurrency()).toBe("USD");
    });

    it("creates zero price with custom currency", () => {
      const price = Price.zero("EUR");
      expect(price.getAmount()).toBe(0);
      expect(price.getCurrency()).toBe("EUR");
    });
  });

  describe("getAmount", () => {
    it("returns the amount", () => {
      const price = Price.create(42.5);
      expect(price.getAmount()).toBe(42.5);
    });
  });

  describe("getCurrency", () => {
    it("returns the currency", () => {
      const price = Price.create(100, "GBP");
      expect(price.getCurrency()).toBe("GBP");
    });
  });

  describe("equals", () => {
    it("returns true for equal prices with same currency", () => {
      const price1 = Price.create(100, "USD");
      const price2 = Price.create(100, "USD");
      expect(price1.equals(price2)).toBe(true);
    });

    it("returns false for different amounts", () => {
      const price1 = Price.create(100, "USD");
      const price2 = Price.create(200, "USD");
      expect(price1.equals(price2)).toBe(false);
    });

    it("returns false for different currencies", () => {
      const price1 = Price.create(100, "USD");
      const price2 = Price.create(100, "EUR");
      expect(price1.equals(price2)).toBe(false);
    });
  });

  describe("toString", () => {
    it("formats price as string", () => {
      const price = Price.create(99.99, "USD");
      expect(price.toString()).toBe("USD 99.99");
    });

    it("formats zero price correctly", () => {
      const price = Price.zero("EUR");
      expect(price.toString()).toBe("EUR 0.00");
    });

    it("formats large price correctly", () => {
      const price = Price.create(1234.56, "GBP");
      expect(price.toString()).toBe("GBP 1234.56");
    });
  });
});
