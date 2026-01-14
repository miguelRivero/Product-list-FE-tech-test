import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  handleProductError,
  invalidateProductCaches,
} from "./productStoreHelpers";

import { apiCache } from "@/utils/apiCache";
import { logger } from "@/utils/logger";

// Mock dependencies
vi.mock("@/utils/apiCache", () => ({
  apiCache: {
    invalidate: vi.fn(),
    invalidatePattern: vi.fn(),
  },
}));

vi.mock("@/utils/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe("productStoreHelpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("handleProductError", () => {
    it("handles Error instance correctly", () => {
      const error = new Error("Test error message");
      const operation = "fetching products";
      const context = { page: 1, limit: 10 };

      const result = handleProductError(error, operation, context);

      expect(logger.error).toHaveBeenCalledWith(
        "Error fetching products",
        error,
        {
          operation,
          ...context,
        }
      );
      expect(result).toBe("Test error message");
    });

    it("handles unknown error type correctly", () => {
      const error = "String error";
      const operation = "creating product";

      const result = handleProductError(error, operation);

      expect(logger.error).toHaveBeenCalledWith(
        "Error creating product",
        expect.any(Error),
        {
          operation,
        }
      );
      expect(result).toBe("Unknown error occurred");
    });

    it("handles error without context", () => {
      const error = new Error("Test error");
      const operation = "deleting product";

      const result = handleProductError(error, operation);

      expect(logger.error).toHaveBeenCalledWith(
        "Error deleting product",
        error,
        {
          operation,
        }
      );
      expect(result).toBe("Test error");
    });

    it("handles null error", () => {
      const error = null;
      const operation = "updating product";

      const result = handleProductError(error, operation);

      expect(logger.error).toHaveBeenCalledWith(
        "Error updating product",
        expect.any(Error),
        {
          operation,
        }
      );
      expect(result).toBe("Unknown error occurred");
    });

    it("handles undefined error", () => {
      const error = undefined;
      const operation = "fetching product";

      const result = handleProductError(error, operation);

      expect(logger.error).toHaveBeenCalledWith(
        "Error fetching product",
        expect.any(Error),
        {
          operation,
        }
      );
      expect(result).toBe("Unknown error occurred");
    });

    it("includes context in logger call", () => {
      const error = new Error("Test error");
      const operation = "searching products";
      const context = {
        query: "test",
        category: "electronics",
        page: 2,
      };

      handleProductError(error, operation, context);

      expect(logger.error).toHaveBeenCalledWith(
        "Error searching products",
        error,
        {
          operation,
          query: "test",
          category: "electronics",
          page: 2,
        }
      );
    });
  });

  describe("invalidateProductCaches", () => {
    it("invalidates specific product cache when productId is provided", () => {
      const productId = 123;

      invalidateProductCaches(productId);

      expect(apiCache.invalidate).toHaveBeenCalledWith("/products/123");
      expect(apiCache.invalidatePattern).toHaveBeenCalledWith("^/products");
    });

    it("invalidates pattern cache when productId is not provided", () => {
      invalidateProductCaches();

      expect(apiCache.invalidate).not.toHaveBeenCalled();
      expect(apiCache.invalidatePattern).toHaveBeenCalledWith("^/products");
    });

    it("always invalidates pattern cache even when productId is provided", () => {
      const productId = 456;

      invalidateProductCaches(productId);

      expect(apiCache.invalidate).toHaveBeenCalledWith("/products/456");
      expect(apiCache.invalidatePattern).toHaveBeenCalledWith("^/products");
      expect(apiCache.invalidatePattern).toHaveBeenCalledTimes(1);
    });

    it("does not invalidate specific cache when productId is 0 (falsy)", () => {
      invalidateProductCaches(0);

      // Zero is falsy in JavaScript, so it won't trigger the specific cache invalidation
      // but pattern invalidation still happens
      expect(apiCache.invalidate).not.toHaveBeenCalled();
      expect(apiCache.invalidatePattern).toHaveBeenCalledWith("^/products");
    });
  });
});
