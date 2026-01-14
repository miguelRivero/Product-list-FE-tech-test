import { describe, expect, it } from "vitest";

import { InvalidProductTitleError } from "./errors";
import { ProductTitle } from "./ProductTitle";

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

    it("normalizes whitespace by trimming and collapsing multiple spaces", () => {
      const title = ProductTitle.create("  Test   Product  ");
      // Whitespace is normalized: trimmed and multiple spaces collapsed to single space
      expect(title.getValue()).toBe("Test Product");
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

    it("returns true for titles with different whitespace (normalized)", () => {
      const title1 = ProductTitle.create("Test Product");
      const title2 = ProductTitle.create("Test  Product"); // Different whitespace, but normalized
      expect(title1.equals(title2)).toBe(true);
    });

    it("normalizes leading and trailing whitespace", () => {
      const title1 = ProductTitle.create("  Test Product  ");
      const title2 = ProductTitle.create("Test Product");
      expect(title1.equals(title2)).toBe(true);
    });
  });

  describe("toString", () => {
    it("converts title to string", () => {
      const title = ProductTitle.create("Test Product");
      expect(title.toString()).toBe("Test Product");
    });
  });
});
