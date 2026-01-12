import { describe, it, expect } from "vitest";
import { ProductTitle } from "./ProductTitle";
import { InvalidProductTitleError } from "./errors";

describe("ProductTitle", () => {
  describe("create", () => {
    it("creates valid product title", () => {
      const title = ProductTitle.create("Test Product");
      expect(title.getValue()).toBe("Test Product");
    });

    it("creates product title with maximum length", () => {
      const longTitle = "a".repeat(200);
      const title = ProductTitle.create(longTitle);
      expect(title.getValue()).toBe(longTitle);
    });

    it("trims whitespace but preserves value", () => {
      const title = ProductTitle.create("  Test Product  ");
      // Value should be trimmed internally for validation, but getValue returns original
      expect(title.getValue()).toBe("  Test Product  ");
    });

    it("throws error for empty string", () => {
      expect(() => ProductTitle.create("")).toThrow(InvalidProductTitleError);
      expect(() => ProductTitle.create("")).toThrow(
        "Product title cannot be empty"
      );
    });

    it("throws error for whitespace-only string", () => {
      expect(() => ProductTitle.create("   ")).toThrow(
        InvalidProductTitleError
      );
      expect(() => ProductTitle.create("   ")).toThrow(
        "Product title cannot be empty"
      );
    });

    it("throws error for title exceeding 200 characters", () => {
      const tooLongTitle = "a".repeat(201);
      expect(() => ProductTitle.create(tooLongTitle)).toThrow(
        InvalidProductTitleError
      );
      expect(() => ProductTitle.create(tooLongTitle)).toThrow(
        "Product title cannot exceed 200 characters"
      );
    });
  });

  describe("getValue", () => {
    it("returns the title value", () => {
      const title = ProductTitle.create("My Product");
      expect(title.getValue()).toBe("My Product");
    });
  });

  describe("equals", () => {
    it("returns true for equal titles", () => {
      const title1 = ProductTitle.create("Test Product");
      const title2 = ProductTitle.create("Test Product");
      expect(title1.equals(title2)).toBe(true);
    });

    it("returns false for different titles", () => {
      const title1 = ProductTitle.create("Product 1");
      const title2 = ProductTitle.create("Product 2");
      expect(title1.equals(title2)).toBe(false);
    });

    it("returns false for titles with different whitespace", () => {
      const title1 = ProductTitle.create("Test Product");
      const title2 = ProductTitle.create("Test  Product"); // Different whitespace
      expect(title1.equals(title2)).toBe(false);
    });
  });

  describe("toString", () => {
    it("converts title to string", () => {
      const title = ProductTitle.create("Test Product");
      expect(title.toString()).toBe("Test Product");
    });
  });
});
