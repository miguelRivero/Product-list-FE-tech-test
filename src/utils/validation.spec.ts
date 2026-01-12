import { describe, it, expect } from "vitest";
import { validateProductForm, sanitizeString } from "./validation";

describe("validateProductForm", () => {
  it("validates correct product form data", () => {
    const validData = {
      title: "Test Product",
      description: "Test description",
      price: 99.99,
      discountPercentage: 10,
      stock: 50,
      category: "electronics",
    };

    const result = validateProductForm(validData);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.title).toBe("Test Product");
    expect(result.errors).toBeUndefined();
  });

  it("rejects data with missing required fields", () => {
    const invalidData = {
      title: "",
      description: "Test description",
      price: 99.99,
      stock: 50,
      category: "electronics",
    };

    const result = validateProductForm(invalidData);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.title).toBeDefined();
  });

  it("rejects data with price < 0", () => {
    const invalidData = {
      title: "Test Product",
      description: "Test description",
      price: -10,
      stock: 50,
      category: "electronics",
    };

    const result = validateProductForm(invalidData);

    expect(result.success).toBe(false);
    expect(result.errors?.price).toBeDefined();
  });

  it("rejects data with price > 999999", () => {
    const invalidData = {
      title: "Test Product",
      description: "Test description",
      price: 1000000,
      stock: 50,
      category: "electronics",
    };

    const result = validateProductForm(invalidData);

    expect(result.success).toBe(false);
    expect(result.errors?.price).toBeDefined();
  });

  it("rejects data with discount > 100", () => {
    const invalidData = {
      title: "Test Product",
      description: "Test description",
      price: 99.99,
      discountPercentage: 101,
      stock: 50,
      category: "electronics",
    };

    const result = validateProductForm(invalidData);

    expect(result.success).toBe(false);
    expect(result.errors?.discountPercentage).toBeDefined();
  });

  it("rejects data with stock < 0", () => {
    const invalidData = {
      title: "Test Product",
      description: "Test description",
      price: 99.99,
      stock: -10,
      category: "electronics",
    };

    const result = validateProductForm(invalidData);

    expect(result.success).toBe(false);
    expect(result.errors?.stock).toBeDefined();
  });

  it("rejects data with title > 200 characters", () => {
    const invalidData = {
      title: "A".repeat(201),
      description: "Test description",
      price: 99.99,
      stock: 50,
      category: "electronics",
    };

    const result = validateProductForm(invalidData);

    expect(result.success).toBe(false);
    expect(result.errors?.title).toBeDefined();
  });

  it("rejects data with description > 5000 characters", () => {
    const invalidData = {
      title: "Test Product",
      description: "A".repeat(5001),
      price: 99.99,
      stock: 50,
      category: "electronics",
    };

    const result = validateProductForm(invalidData);

    expect(result.success).toBe(false);
    expect(result.errors?.description).toBeDefined();
  });

  it("trims whitespace from title", () => {
    const data = {
      title: "  Test Product  ",
      description: "Test description",
      price: 99.99,
      stock: 50,
      category: "electronics",
    };

    const result = validateProductForm(data);

    expect(result.success).toBe(true);
    expect(result.data?.title).toBe("Test Product");
  });
});

describe("sanitizeString", () => {
  it("trims whitespace", () => {
    expect(sanitizeString("  test  ")).toBe("test");
  });

  it("removes control characters", () => {
    expect(sanitizeString("test\x00\x1F\x7F")).toBe("test");
  });

  it("normalizes whitespace", () => {
    expect(sanitizeString("test    multiple    spaces")).toBe(
      "test multiple spaces"
    );
  });

  it("handles empty string", () => {
    expect(sanitizeString("")).toBe("");
  });
});
