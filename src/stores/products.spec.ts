import type { Category, Product } from "@/types/product";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/constants";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

import { Product as DomainProduct } from "@/domain/product/Product";
import { productsApi } from "@/services/api";
import { useProductsStore } from "./products";

// Create mock use cases
const mockGetProductsUseCase = {
  execute: vi.fn(),
};

const mockGetProductUseCase = {
  execute: vi.fn(),
};

const mockCreateProductUseCase = {
  execute: vi.fn(),
};

const mockUpdateProductUseCase = {
  execute: vi.fn(),
};

const mockDeleteProductUseCase = {
  execute: vi.fn(),
};

// Mock DI container
vi.mock("@/infrastructure/di/container", () => ({
  diContainer: {
    getProductsUseCase: () => mockGetProductsUseCase,
    getProductUseCase: () => mockGetProductUseCase,
    getCreateProductUseCase: () => mockCreateProductUseCase,
    getUpdateProductUseCase: () => mockUpdateProductUseCase,
    getDeleteProductUseCase: () => mockDeleteProductUseCase,
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

// Mock API (still needed for categories)
vi.mock("@/services/api", () => ({
  productsApi: {
    getCategories: vi.fn(),
  },
}));

// Helper function to create domain product from API product data
function createDomainProductFromApiData(
  apiProduct: Partial<Product>
): DomainProduct {
  return DomainProduct.fromDTO({
    id: apiProduct.id!,
    title: apiProduct.title!,
    description: apiProduct.description || "",
    category: apiProduct.category!,
    price: apiProduct.price!,
    discountPercentage: apiProduct.discountPercentage || 0,
    stock: apiProduct.stock!,
    rating: apiProduct.rating || 0,
    images: apiProduct.images || [],
    thumbnail: apiProduct.thumbnail || "",
    tags: apiProduct.tags || [],
    brand: apiProduct.brand,
    sku: apiProduct.sku,
  });
}

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

    // Mock use case response
    mockGetProductsUseCase.execute.mockResolvedValue({
      products: [],
      total: 25,
      page: 1,
      limit: 10,
    });

    await store.fetchProducts(DEFAULT_PAGE, DEFAULT_PAGE_SIZE);

    expect(store.totalPages).toBe(3); // Math.ceil(25/10) = 3
  });

  it("fetches products successfully", async () => {
    const store = useProductsStore();

    const mockApiProducts: Product[] = [
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

    // Convert to domain entities
    const domainProducts = mockApiProducts.map(createDomainProductFromApiData);

    // Mock use case response
    mockGetProductsUseCase.execute.mockResolvedValue({
      products: domainProducts,
      total: 2,
      page: 1,
      limit: 10,
    });

    await store.fetchProducts(DEFAULT_PAGE, DEFAULT_PAGE_SIZE);

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
    mockGetProductsUseCase.execute.mockRejectedValue(new Error(errorMessage));

    await store.fetchProducts(DEFAULT_PAGE, DEFAULT_PAGE_SIZE);

    expect(store.products).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(errorMessage);
  });

  it("computes hasNextPage and hasPrevPage correctly", async () => {
    const store = useProductsStore();

    mockGetProductsUseCase.execute.mockResolvedValue({
      products: [],
      total: 25,
      page: 1,
      limit: 10,
    });

    // Page 1
    await store.fetchProducts(DEFAULT_PAGE, DEFAULT_PAGE_SIZE);
    expect(store.hasNextPage).toBe(true);
    expect(store.hasPrevPage).toBe(false);

    // Page 2
    mockGetProductsUseCase.execute.mockResolvedValue({
      products: [],
      total: 25,
      page: 2,
      limit: 10,
    });
    await store.fetchProducts(2, 10);
    expect(store.hasNextPage).toBe(true);
    expect(store.hasPrevPage).toBe(true);

    // Page 3 (last page)
    mockGetProductsUseCase.execute.mockResolvedValue({
      products: [],
      total: 25,
      page: 3,
      limit: 10,
    });
    await store.fetchProducts(3, 10);
    expect(store.hasNextPage).toBe(false);
    expect(store.hasPrevPage).toBe(true);
  });

  it("fetches categories successfully", async () => {
    const store = useProductsStore();

    const mockCategories: Category[] = [
      {
        slug: "electronics",
        name: "Electronics",
        url: "/categories/electronics",
      },
      { slug: "beauty", name: "Beauty", url: "/categories/beauty" },
      { slug: "furniture", name: "Furniture", url: "/categories/furniture" },
    ];
    vi.mocked(productsApi.getCategories).mockResolvedValue(mockCategories);

    await store.fetchCategories();

    expect(store.categories).toEqual(mockCategories);
  });

  it("sets search query and refetches products", async () => {
    const store = useProductsStore();

    mockGetProductsUseCase.execute.mockResolvedValue({
      products: [],
      total: 0,
      page: 1,
      limit: 10,
    });

    await store.setSearchQuery("test query");

    expect(store.searchQuery).toBe("test query");
    expect(mockGetProductsUseCase.execute).toHaveBeenCalledWith(
      1,
      10,
      undefined,
      "test query"
    );
  });

  it("sets selected category and refetches products", async () => {
    const store = useProductsStore();

    mockGetProductsUseCase.execute.mockResolvedValue({
      products: [],
      total: 0,
      page: 1,
      limit: 10,
    });

    await store.setSelectedCategory("electronics");

    expect(store.selectedCategory).toBe("electronics");
    expect(mockGetProductsUseCase.execute).toHaveBeenCalledWith(
      1,
      10,
      "electronics",
      undefined
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

    const mockApiProduct: Product = {
      id: 15000,
      ...mockProductData,
      rating: 0,
      images: [],
      thumbnail: "",
    };

    const domainProduct = createDomainProductFromApiData(mockApiProduct);
    mockCreateProductUseCase.execute.mockResolvedValue(domainProduct);

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

    const updatedDomainProduct = createDomainProductFromApiData({
      ...existingProduct,
      ...updates,
    });

    mockUpdateProductUseCase.execute.mockResolvedValue(updatedDomainProduct);

    const result = await store.updateProduct(1, updates);

    expect(result.title).toBe("Updated Title");
    expect(result.price).toBe(150);
    expect(store.products[0].title).toBe("Updated Title");
    expect(store.products[0].price).toBe(150);
  });

  it("skips use case call for client-created products when updating", async () => {
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
    // Use case is NOT called for client-created products (optimistic update only)
    expect(mockUpdateProductUseCase.execute).not.toHaveBeenCalled();
    expect(store.products[0].title).toBe("Updated");
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

    mockDeleteProductUseCase.execute.mockResolvedValue(undefined);

    await store.deleteProduct(1);

    expect(store.products.length).toBe(1);
    expect(store.products[0].id).toBe(2);
    expect(store.total).toBe(1);
    expect(mockDeleteProductUseCase.execute).toHaveBeenCalled();
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

    mockDeleteProductUseCase.execute.mockRejectedValue(
      new Error("Delete failed")
    );

    await expect(store.deleteProduct(1)).rejects.toThrow("Delete failed");

    expect(store.products.length).toBe(1);
    expect(store.total).toBe(1);
  });
});
