import { describe, expect, it } from "vitest";

import { CLIENT_ID_RANGE } from "@/utils/constants";
import { InvalidProductIdError } from "./errors";
import { ProductId } from "./ProductId";

describe("ProductId", () => {
  describe("create", () => {
    it("creates valid product ID", () => {
      const id = ProductId.create(1);
      expect(id.getValue()).toBe(1);
    });

    it("creates product ID with large value", () => {
      const id = ProductId.create(999999);
      expect(id.getValue()).toBe(999999);
    });

    it("throws error for zero ID", () => {
      expect(() => ProductId.create(0)).toThrow(InvalidProductIdError);
      expect(() => ProductId.create(0)).toThrow("Product ID must be positive");
    });

    it("throws error for negative ID", () => {
      expect(() => ProductId.create(-1)).toThrow(InvalidProductIdError);
      expect(() => ProductId.create(-1)).toThrow("Product ID must be positive");
    });
  });

  describe("createClientId", () => {
    it("creates valid client ID in range", () => {
      const id = ProductId.createClientId(15000);
      expect(id.getValue()).toBe(15000);
      expect(id.isClientGenerated()).toBe(true);
    });

    it("creates client ID at minimum boundary", () => {
      const id = ProductId.createClientId(CLIENT_ID_RANGE.MIN);
      expect(id.getValue()).toBe(CLIENT_ID_RANGE.MIN);
      expect(id.isClientGenerated()).toBe(true);
    });

    it("creates client ID at maximum boundary", () => {
      const id = ProductId.createClientId(CLIENT_ID_RANGE.MAX);
      expect(id.getValue()).toBe(CLIENT_ID_RANGE.MAX);
      expect(id.isClientGenerated()).toBe(true);
    });

    it("throws error for client ID below range", () => {
      expect(() => ProductId.createClientId(CLIENT_ID_RANGE.MIN - 1)).toThrow(
        InvalidProductIdError
      );
      expect(() => ProductId.createClientId(CLIENT_ID_RANGE.MIN - 1)).toThrow(
        "Client ID must be in range"
      );
    });

    it("throws error for client ID above range", () => {
      expect(() => ProductId.createClientId(CLIENT_ID_RANGE.MAX + 1)).toThrow(
        InvalidProductIdError
      );
      expect(() => ProductId.createClientId(CLIENT_ID_RANGE.MAX + 1)).toThrow(
        "Client ID must be in range"
      );
    });
  });

  describe("getValue", () => {
    it("returns the ID value", () => {
      const id = ProductId.create(42);
      expect(id.getValue()).toBe(42);
    });
  });

  describe("equals", () => {
    it("returns true for equal IDs", () => {
      const id1 = ProductId.create(1);
      const id2 = ProductId.create(1);
      expect(id1.equals(id2)).toBe(true);
    });

    it("returns false for different IDs", () => {
      const id1 = ProductId.create(1);
      const id2 = ProductId.create(2);
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe("isClientGenerated", () => {
    it("returns true for client-generated IDs", () => {
      const id = ProductId.create(15000);
      expect(id.isClientGenerated()).toBe(true);
    });

    it("returns false for server-generated IDs", () => {
      const id = ProductId.create(1);
      expect(id.isClientGenerated()).toBe(false);
    });

    it("returns false for IDs above client range", () => {
      const id = ProductId.create(100000);
      expect(id.isClientGenerated()).toBe(false);
    });
  });

  describe("toString", () => {
    it("converts ID to string", () => {
      const id = ProductId.create(123);
      expect(id.toString()).toBe("123");
    });
  });
});
