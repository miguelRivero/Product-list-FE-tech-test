import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useProductsStore } from "./products";
import { productsApi } from "@/services/api";
import type { Product, ProductsResponse } from "@/types/product";

// Mock the API service
vi.mock("@/services/api", () => ({
  productsApi: {
    getProducts: vi.fn(),
    getProduct: vi.fn(),
    searchProducts: vi.fn(),
    getCategories: vi.fn(),
    getProductsByCategory: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  },
}));

describe("Products Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("initializes with empty state", () => {
    const store = useProductsStore();

    expect(store.products).toEqual([]);
    expect(store.total).toBe(0);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
    expect(store.selectedProduct).toBe(null);
    expect(store.currentPage).toBe(1);
    expect(store.pageSize).toBe(10);
  });

  it("computes totalPages correctly", async () => {
    const store = useProductsStore();

    // Mock API response
    const mockResponse: ProductsResponse = {
      products: [],
      total: 25,
      skip: 0,
      limit: 10,
    };

    vi.mocked(productsApi.getProducts).mockResolvedValue(mockResponse);

    await store.fetchProducts(1, 10);

    expect(store.totalPages).toBe(3); // Math.ceil(25/10) = 3
  });

  it("fetches products successfully", async () => {
    const store = useProductsStore();

    const mockProducts: Product[] = [
      {
        id: 1,
        title: "Test Product 1",
        description: "Description 1",
        category: "electronics",
        price: 99.99,
        discountPercentage: 10,
        rating: 4.5,
        stock: 50,
        images: [],
        thumbnail: "thumb1.jpg",
      },
      {
        id: 2,
        title: "Test Product 2",
        description: "Description 2",
        category: "electronics",
        price: 149.99,
        discountPercentage: 15,
        rating: 4.8,
        stock: 30,
        images: [],
        thumbnail: "thumb2.jpg",
      },
    ];

    const mockResponse: ProductsResponse = {
      products: mockProducts,
      total: 2,
      skip: 0,
      limit: 10,
    };

    vi.mocked(productsApi.getProducts).mockResolvedValue(mockResponse);

    await store.fetchProducts(1, 10);

    expect(store.products).toHaveLength(2);
    expect(store.products[0].title).toBe("Test Product 1");
    expect(store.total).toBe(2);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
    expect(store.currentPage).toBe(1);
  });

  it("handles fetch products error", async () => {
    const store = useProductsStore();

    const errorMessage = "Network error";
    vi.mocked(productsApi.getProducts).mockRejectedValue(
      new Error(errorMessage)
    );

    await store.fetchProducts(1, 10);

    expect(store.products).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(errorMessage);
  });

  it("computes hasNextPage and hasPrevPage correctly", async () => {
    const store = useProductsStore();

    const mockResponse: ProductsResponse = {
      products: [],
      total: 25,
      skip: 0,
      limit: 10,
    };

    vi.mocked(productsApi.getProducts).mockResolvedValue(mockResponse);

    // Page 1
    await store.fetchProducts(1, 10);
    expect(store.hasNextPage).toBe(true);
    expect(store.hasPrevPage).toBe(false);

    // Page 2
    await store.fetchProducts(2, 10);
    expect(store.hasNextPage).toBe(true);
    expect(store.hasPrevPage).toBe(true);

    // Page 3 (last page)
    await store.fetchProducts(3, 10);
    expect(store.hasNextPage).toBe(false);
    expect(store.hasPrevPage).toBe(true);
  });

  it("fetches categories successfully", async () => {
    const store = useProductsStore();

    const mockCategories = ["electronics", "beauty", "furniture"];
    vi.mocked(productsApi.getCategories).mockResolvedValue(mockCategories);

    await store.fetchCategories();

    expect(store.categories).toEqual(mockCategories);
  });

  it("sets search query and refetches products", async () => {
    const store = useProductsStore();

    const mockResponse: ProductsResponse = {
      products: [],
      total: 0,
      skip: 0,
      limit: 10,
    };

    vi.mocked(productsApi.searchProducts).mockResolvedValue(mockResponse);

    await store.setSearchQuery("test query");

    expect(store.searchQuery).toBe("test query");
    expect(productsApi.searchProducts).toHaveBeenCalledWith(
      "test query",
      10,
      0
    );
  });

  it("sets selected category and refetches products", async () => {
    const store = useProductsStore();

    const mockResponse: ProductsResponse = {
      products: [],
      total: 0,
      skip: 0,
      limit: 10,
    };

    vi.mocked(productsApi.getProductsByCategory).mockResolvedValue(
      mockResponse
    );

    await store.setSelectedCategory("electronics");

    expect(store.selectedCategory).toBe("electronics");
    expect(productsApi.getProductsByCategory).toHaveBeenCalledWith(
      "electronics",
      10,
      0
    );
  });

  it("resets store state", () => {
    const store = useProductsStore();

    // Set some state
    store.products = [
      {
        id: 1,
        title: "Test",
        description: "Test",
        category: "test",
        price: 100,
        discountPercentage: 0,
        rating: 0,
        stock: 10,
        images: [],
        thumbnail: "test.jpg",
      },
    ];
    store.total = 1;
    store.currentPage = 2;
    store.searchQuery = "test";
    store.selectedCategory = "electronics";

    store.reset();

    expect(store.products).toEqual([]);
    expect(store.total).toBe(0);
    expect(store.currentPage).toBe(1);
    expect(store.searchQuery).toBe("");
    expect(store.selectedCategory).toBe(null);
  });
});

