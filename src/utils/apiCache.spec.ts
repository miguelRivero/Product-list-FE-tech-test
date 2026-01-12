import { describe, it, expect, beforeEach } from "vitest";
import { apiCache } from "./apiCache";

describe("APICache", () => {
  beforeEach(() => {
    apiCache.clear();
  });

  it("returns null for non-existent cache entry", () => {
    const result = apiCache.get("/products");

    expect(result).toBeNull();
  });

  it("stores and retrieves cached data", () => {
    const testData = { products: [], total: 0 };
    apiCache.set("/products", testData);

    const result = apiCache.get("/products");

    expect(result).toEqual(testData);
  });

  it("stores data with params", () => {
    const testData = { products: [], total: 0 };
    apiCache.set("/products", testData, { page: 1, limit: 10 });

    const result = apiCache.get("/products", { page: 1, limit: 10 });

    expect(result).toEqual(testData);
  });

  it("returns null for expired cache entry", async () => {
    const testData = { products: [], total: 0 };
    apiCache.set("/products", testData, undefined, 100); // 100ms TTL

    // Wait for cache to expire
    await new Promise(resolve => setTimeout(resolve, 150));

    const result = apiCache.get("/products");

    expect(result).toBeNull();
  });

  it("invalidates specific cache entry", () => {
    apiCache.set("/products", { products: [] });
    apiCache.set("/categories", { categories: [] });

    apiCache.invalidate("/products");

    expect(apiCache.get("/products")).toBeNull();
    expect(apiCache.get("/categories")).not.toBeNull();
  });

  it("invalidates cache by pattern", () => {
    apiCache.set("/products", { products: [] });
    apiCache.set("/products/1", { product: {} });
    apiCache.set("/categories", { categories: [] });

    apiCache.invalidatePattern("^/products");

    expect(apiCache.get("/products")).toBeNull();
    expect(apiCache.get("/products/1")).toBeNull();
    expect(apiCache.get("/categories")).not.toBeNull();
  });

  it("clears all cache", () => {
    apiCache.set("/products", { products: [] });
    apiCache.set("/categories", { categories: [] });

    apiCache.clear();

    expect(apiCache.get("/products")).toBeNull();
    expect(apiCache.get("/categories")).toBeNull();
    expect(apiCache.size()).toBe(0);
  });

  it("returns correct cache size", () => {
    expect(apiCache.size()).toBe(0);

    apiCache.set("/products", { products: [] });
    expect(apiCache.size()).toBe(1);

    apiCache.set("/categories", { categories: [] });
    expect(apiCache.size()).toBe(2);

    apiCache.clear();
    expect(apiCache.size()).toBe(0);
  });
});
