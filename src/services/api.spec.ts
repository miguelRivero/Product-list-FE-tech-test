import type { Category, Product, ProductsResponse } from "@/types/product";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock axios BEFORE importing api
const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
};

vi.mock("axios", async () => {
  const actual = await vi.importActual("axios");
  return {
    ...actual,
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
  };
});

// Mock dependencies
vi.mock("@/utils/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

describe("productsApi", () => {
  let productsApi: typeof import("./api").productsApi;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Dynamically import after mocks are set up
    const apiModule = await import("./api");
    productsApi = apiModule.productsApi;
  });

  describe("getProducts", () => {
    it("fetches products with default pagination", async () => {
      const mockResponse: ProductsResponse = {
        products: [],
        total: 0,
        skip: 0,
        limit: 10,
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await productsApi.getProducts();

      expect(result).toEqual(mockResponse);
    });

    it("fetches products with custom pagination", async () => {
      const mockResponse: ProductsResponse = {
        products: [],
        total: 0,
        skip: 20,
        limit: 20,
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await productsApi.getProducts(20, 20);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        "/products?limit=20&skip=20"
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getProduct", () => {
    it("fetches a single product by ID", async () => {
      const mockProduct: Product = {
        id: 1,
        title: "Test Product",
        description: "Test description",
        category: "electronics",
        price: 99.99,
        discountPercentage: 0,
        rating: 4.5,
        stock: 50,
        images: [],
        thumbnail: "thumb.jpg",
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockProduct });

      const result = await productsApi.getProduct(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/products/1");
      expect(result).toEqual(mockProduct);
    });
  });

  describe("searchProducts", () => {
    it("searches products with query", async () => {
      const mockResponse: ProductsResponse = {
        products: [],
        total: 0,
        skip: 0,
        limit: 10,
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await productsApi.searchProducts("test query");

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        "/products/search?q=test%20query&limit=10&skip=0"
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getCategories", () => {
    it("fetches all categories", async () => {
      const mockCategories: Category[] = [
        {
          slug: "electronics",
          name: "Electronics",
          url: "/categories/electronics",
        },
      ];

      mockAxiosInstance.get.mockResolvedValue({ data: mockCategories });

      const result = await productsApi.getCategories();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        "/products/categories"
      );
      expect(result).toEqual(mockCategories);
    });
  });

  describe("getProductsByCategory", () => {
    it("fetches products by category", async () => {
      const mockResponse: ProductsResponse = {
        products: [],
        total: 0,
        skip: 0,
        limit: 10,
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await productsApi.getProductsByCategory("electronics");

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        "/products/category/electronics?limit=10&skip=0"
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
