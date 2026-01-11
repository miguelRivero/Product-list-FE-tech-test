import { describe, it, expect } from "vitest";
import { Stock } from "./Stock";
import { InvalidStockError } from "./errors";

describe("Stock", () => {
  describe("create", () => {
    it("creates valid stock", () => {
      const stock = Stock.create(100);
      expect(stock.getValue()).toBe(100);
    });

    it("creates stock with zero value", () => {
      const stock = Stock.create(0);
      expect(stock.getValue()).toBe(0);
    });

    it("creates stock with maximum value", () => {
      const stock = Stock.create(999999);
      expect(stock.getValue()).toBe(999999);
    });

    it("throws error for negative value", () => {
      expect(() => Stock.create(-1)).toThrow(InvalidStockError);
      expect(() => Stock.create(-1)).toThrow("Stock cannot be negative");
    });

    it("throws error for value exceeding maximum", () => {
      expect(() => Stock.create(1000000)).toThrow(InvalidStockError);
      expect(() => Stock.create(1000000)).toThrow("Stock cannot exceed 999999");
    });

    it("throws error for non-integer value", () => {
      expect(() => Stock.create(10.5)).toThrow(InvalidStockError);
      expect(() => Stock.create(10.5)).toThrow("Stock must be an integer");
    });

    it("throws error for decimal values", () => {
      expect(() => Stock.create(99.99)).toThrow(InvalidStockError);
    });
  });

  describe("zero", () => {
    it("creates zero stock", () => {
      const stock = Stock.zero();
      expect(stock.getValue()).toBe(0);
    });
  });

  describe("getValue", () => {
    it("returns the stock value", () => {
      const stock = Stock.create(42);
      expect(stock.getValue()).toBe(42);
    });
  });

  describe("equals", () => {
    it("returns true for equal stock values", () => {
      const stock1 = Stock.create(100);
      const stock2 = Stock.create(100);
      expect(stock1.equals(stock2)).toBe(true);
    });

    it("returns false for different stock values", () => {
      const stock1 = Stock.create(100);
      const stock2 = Stock.create(200);
      expect(stock1.equals(stock2)).toBe(false);
    });
  });
});
