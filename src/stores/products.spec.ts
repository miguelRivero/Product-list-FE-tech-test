import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useProductsStore } from "./products";
import { productsApi } from "@/services/api";
import type { Product, ProductsResponse, Category } from "@/types/product";

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

// Mock logger
vi.mock("@/utils/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock API cache
vi.mock("@/utils/apiCache", () => ({
  apiCache: {
    get: vi.fn().mockReturnValue(null),
    set: vi.fn(),
    invalidate: vi.fn(),
    invalidatePattern: vi.fn(),
    clear: vi.fn(),
    size: vi.fn().mockReturnValue(0),
  },
}));

// Mock ID generator
vi.mock("@/utils/idGenerator", () => ({
  generateSecureClientId: vi.fn(() => 15000),
  isClientGeneratedId: vi.fn((id: number) => id >= 10000 && id < 100000),
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

    const mockCategories: Category[] = [
      { slug: "electronics", name: "Electronics", url: "/categories/electronics" },
      { slug: "beauty", name: "Beauty", url: "/categories/beauty" },
      { slug: "furniture", name: "Furniture", url: "/categories/furniture" },
    ];
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

  it("creates product successfully", async () => {
    const store = useProductsStore();

    const mockProductData = {
      title: "New Product",
      description: "New description",
      price: 99.99,
      discountPercentage: 10,
      stock: 50,
      category: "electronics",
    };

    const mockApiResponse: Product = {
      id: 195,
      ...mockProductData,
      rating: 0,
      images: [],
      thumbnail: "",
    };

    vi.mocked(productsApi.createProduct).mockResolvedValue(mockApiResponse);

    const result = await store.createProduct(mockProductData);

    expect(result.id).toBeGreaterThanOrEqual(10000);
    expect(result.id).toBeLessThan(100000);
    expect(store.products.length).toBe(1);
    expect(store.products[0].title).toBe("New Product");
    expect(store.total).toBe(1);
  });

  it("updates product successfully", async () => {
    const store = useProductsStore();

    const existingProduct: Product = {
      id: 1,
      title: "Original",
      description: "Original description",
      category: "electronics",
      price: 100,
      discountPercentage: 0,
      rating: 4.5,
      stock: 50,
      images: [],
      thumbnail: "thumb.jpg",
    };

    store.products = [existingProduct];

    const updates = {
      title: "Updated Title",
      price: 150,
    };

    vi.mocked(productsApi.updateProduct).mockResolvedValue({
      ...existingProduct,
      ...updates,
    });

    const result = await store.updateProduct(1, updates);

    expect(result.title).toBe("Updated Title");
    expect(result.price).toBe(150);
    expect(store.products[0].title).toBe("Updated Title");
    expect(store.products[0].price).toBe(150);
  });

  it("skips API call for client-created products when updating", async () => {
    const store = useProductsStore();

    const clientProduct: Product = {
      id: 15000, // Client-generated ID
      title: "Client Product",
      description: "Description",
      category: "electronics",
      price: 100,
      discountPercentage: 0,
      rating: 0,
      stock: 50,
      images: [],
      thumbnail: "",
    };

    store.products = [clientProduct];

    const updates = {
      title: "Updated",
    };

    const result = await store.updateProduct(15000, updates);

    expect(result.title).toBe("Updated");
    expect(productsApi.updateProduct).not.toHaveBeenCalled();
  });

  it("deletes product successfully", async () => {
    const store = useProductsStore();

    const product1: Product = {
      id: 1,
      title: "Product 1",
      description: "Description 1",
      category: "electronics",
      price: 100,
      discountPercentage: 0,
      rating: 0,
      stock: 50,
      images: [],
      thumbnail: "",
    };

    const product2: Product = {
      id: 2,
      title: "Product 2",
      description: "Description 2",
      category: "electronics",
      price: 200,
      discountPercentage: 0,
      rating: 0,
      stock: 30,
      images: [],
      thumbnail: "",
    };

    store.products = [product1, product2];
    store.total = 2;

    vi.mocked(productsApi.deleteProduct).mockResolvedValue(product1);

    await store.deleteProduct(1);

    expect(store.products.length).toBe(1);
    expect(store.products[0].id).toBe(2);
    expect(store.total).toBe(1);
    expect(productsApi.deleteProduct).toHaveBeenCalledWith(1);
  });

  it("restores product on delete error", async () => {
    const store = useProductsStore();

    const product: Product = {
      id: 1,
      title: "Product",
      description: "Description",
      category: "electronics",
      price: 100,
      discountPercentage: 0,
      rating: 0,
      stock: 50,
      images: [],
      thumbnail: "",
    };

    store.products = [product];
    store.total = 1;

    vi.mocked(productsApi.deleteProduct).mockRejectedValue(new Error("Delete failed"));

    await expect(store.deleteProduct(1)).rejects.toThrow("Delete failed");

    expect(store.products.length).toBe(1);
    expect(store.total).toBe(1);
  });
});

