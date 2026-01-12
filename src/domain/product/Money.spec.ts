import { describe, it, expect } from "vitest";
import { Money } from "./Money";
import { InvalidMoneyError } from "./errors";

describe("Money", () => {
  describe("create", () => {
    it("creates valid money with default currency", () => {
      const money = Money.create(100);
      expect(money.getAmount()).toBe(100);
      expect(money.getCurrency()).toBe("USD");
    });

    it("creates valid money with custom currency", () => {
      const money = Money.create(100, "EUR");
      expect(money.getAmount()).toBe(100);
      expect(money.getCurrency()).toBe("EUR");
    });

    it("creates money with zero amount", () => {
      const money = Money.create(0);
      expect(money.getAmount()).toBe(0);
    });

    it("creates money with decimal amount", () => {
      const money = Money.create(99.99);
      expect(money.getAmount()).toBe(99.99);
    });

    it("throws error for negative amount", () => {
      expect(() => Money.create(-1)).toThrow(InvalidMoneyError);
      expect(() => Money.create(-1)).toThrow("Money amount cannot be negative");
    });

    it("throws error for Infinity", () => {
      expect(() => Money.create(Infinity)).toThrow(InvalidMoneyError);
      expect(() => Money.create(Infinity)).toThrow(
        "Money amount must be finite"
      );
    });

    it("throws error for -Infinity", () => {
      expect(() => Money.create(-Infinity)).toThrow(InvalidMoneyError);
      // -Infinity is negative, so it throws negative error first
      expect(() => Money.create(-Infinity)).toThrow(
        "Money amount cannot be negative"
      );
    });

    it("throws error for NaN", () => {
      expect(() => Money.create(NaN)).toThrow(InvalidMoneyError);
      expect(() => Money.create(NaN)).toThrow("Money amount must be finite");
    });
  });

  describe("zero", () => {
    it("creates zero money with default currency", () => {
      const money = Money.zero();
      expect(money.getAmount()).toBe(0);
      expect(money.getCurrency()).toBe("USD");
    });

    it("creates zero money with custom currency", () => {
      const money = Money.zero("EUR");
      expect(money.getAmount()).toBe(0);
      expect(money.getCurrency()).toBe("EUR");
    });
  });

  describe("getAmount", () => {
    it("returns the amount", () => {
      const money = Money.create(42.5);
      expect(money.getAmount()).toBe(42.5);
    });
  });

  describe("getCurrency", () => {
    it("returns the currency", () => {
      const money = Money.create(100, "GBP");
      expect(money.getCurrency()).toBe("GBP");
    });
  });

  describe("equals", () => {
    it("returns true for equal money with same currency", () => {
      const money1 = Money.create(100, "USD");
      const money2 = Money.create(100, "USD");
      expect(money1.equals(money2)).toBe(true);
    });

    it("returns false for different amounts", () => {
      const money1 = Money.create(100, "USD");
      const money2 = Money.create(200, "USD");
      expect(money1.equals(money2)).toBe(false);
    });

    it("returns false for same amount but different currency", () => {
      const money1 = Money.create(100, "USD");
      const money2 = Money.create(100, "EUR");
      expect(money1.equals(money2)).toBe(false);
    });
  });

  describe("toString", () => {
    it("formats money as string", () => {
      const money = Money.create(99.99, "USD");
      expect(money.toString()).toBe("USD 99.99");
    });

    it("formats zero money correctly", () => {
      const money = Money.zero("EUR");
      expect(money.toString()).toBe("EUR 0.00");
    });

    it("formats large amounts correctly", () => {
      const money = Money.create(1234.56, "GBP");
      expect(money.toString()).toBe("GBP 1234.56");
    });
  });
});
