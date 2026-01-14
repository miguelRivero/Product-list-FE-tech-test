import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Product as ApiProduct } from "@/types/product";
import { DiscountPercentage } from "@/domain/product/DiscountPercentage";
import { Price } from "@/domain/product/Price";
import { Product } from "@/domain/product/Product";
import { ProductId } from "@/domain/product/ProductId";
import { ProductMapper } from "@/infrastructure/mappers/ProductMapper";
import { ProductRepositoryImpl } from "./ProductRepositoryImpl";
import { ProductTitle } from "@/domain/product/ProductTitle";
import { Stock } from "@/domain/product/Stock";
import { productsApi } from "@/services/api";

// Mock dependencies
vi.mock("@/services/api", () => ({
  productsApi: {
    getProduct: vi.fn(),
    getProducts: vi.fn(),
    getProductsByCategory: vi.fn(),
    searchProducts: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  },
}));

vi.mock("@/infrastructure/mappers/ProductMapper", () => ({
  ProductMapper: {
    toDomain: vi.fn(),
    toFormData: vi.fn(),
  },
}));

vi.mock("@/utils/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe("ProductRepositoryImpl", () => {
  let repository: ProductRepositoryImpl;

  const createMockApiProduct = (id: number): ApiProduct => {
    return {
      id,
      title: "Test Product",
      description: "Test description",
      category: "electronics",
      price: 99.99,
      discountPercentage: 10,
      rating: 4.5,
      stock: 50,
      images: ["image1.jpg"],
      thumbnail: "thumb.jpg",
      tags: ["tag1"],
    };
  };

  const createMockDomainProduct = (id: number): Product => {
    return Product.create({
      id: ProductId.create(id),
      title: ProductTitle.create("Test Product"),
      description: "Test description",
      category: "electronics",
      price: Price.create(99.99),
      stock: Stock.create(50),
      discountPercentage: DiscountPercentage.create(10),
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new ProductRepositoryImpl();
  });

  describe("findById", () => {
    it("fetches and converts a product successfully", async () => {
      const productId = ProductId.create(1);
      const apiProduct = createMockApiProduct(1);
      const domainProduct = createMockDomainProduct(1);

      vi.mocked(productsApi.getProduct).mockResolvedValue(apiProduct);
      vi.mocked(ProductMapper.toDomain).mockReturnValue(domainProduct);

      const result = await repository.findById(productId);

      expect(productsApi.getProduct).toHaveBeenCalledWith(1);
      expect(ProductMapper.toDomain).toHaveBeenCalledWith(apiProduct);
      expect(result).toBe(domainProduct);
    });

    it("returns null when product not found", async () => {
      const productId = ProductId.create(999);

      vi.mocked(productsApi.getProduct).mockRejectedValue(
        new Error("Product not found")
      );

      const result = await repository.findById(productId);

      expect(result).toBeNull();
      expect(productsApi.getProduct).toHaveBeenCalledWith(999);
    });

    it("handles errors gracefully and returns null", async () => {
      const productId = ProductId.create(1);

      vi.mocked(productsApi.getProduct).mockRejectedValue(
        new Error("Network error")
      );

      const result = await repository.findById(productId);

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("fetches and converts products successfully", async () => {
      const apiProducts = [createMockApiProduct(1), createMockApiProduct(2)];
      const domainProducts = [
        createMockDomainProduct(1),
        createMockDomainProduct(2),
      ];

      vi.mocked(productsApi.getProducts).mockResolvedValue({
        products: apiProducts,
        total: 2,
        skip: 0,
        limit: 10,
      });
      vi.mocked(ProductMapper.toDomain)
        .mockReturnValueOnce(domainProducts[0])
        .mockReturnValueOnce(domainProducts[1]);

      const result = await repository.findAll(10, 0);

      expect(productsApi.getProducts).toHaveBeenCalledWith(10, 0);
      expect(ProductMapper.toDomain).toHaveBeenCalledTimes(2);
      expect(result.products).toEqual(domainProducts);
      expect(result.total).toBe(2);
    });

    it("throws error when API call fails", async () => {
      const error = new Error("API error");

      vi.mocked(productsApi.getProducts).mockRejectedValue(error);

      await expect(repository.findAll()).rejects.toThrow("API error");
    });
  });

  describe("findByCategory", () => {
    it("fetches and converts products by category successfully", async () => {
      const category = "electronics";
      const apiProducts = [createMockApiProduct(1)];
      const domainProduct = createMockDomainProduct(1);

      vi.mocked(productsApi.getProductsByCategory).mockResolvedValue({
        products: apiProducts,
        total: 1,
        skip: 0,
        limit: 10,
      });
      vi.mocked(ProductMapper.toDomain).mockReturnValue(domainProduct);

      const result = await repository.findByCategory(category, 10, 0);

      expect(productsApi.getProductsByCategory).toHaveBeenCalledWith(
        category,
        10,
        0
      );
      expect(result.products).toEqual([domainProduct]);
      expect(result.total).toBe(1);
    });

    it("throws error when API call fails", async () => {
      const error = new Error("API error");

      vi.mocked(productsApi.getProductsByCategory).mockRejectedValue(error);

      await expect(repository.findByCategory("electronics")).rejects.toThrow(
        "API error"
      );
    });
  });

  describe("search", () => {
    it("searches and converts products successfully", async () => {
      const query = "test";
      const apiProducts = [createMockApiProduct(1)];
      const domainProduct = createMockDomainProduct(1);

      vi.mocked(productsApi.searchProducts).mockResolvedValue({
        products: apiProducts,
        total: 1,
        skip: 0,
        limit: 10,
      });
      vi.mocked(ProductMapper.toDomain).mockReturnValue(domainProduct);

      const result = await repository.search(query, 10, 0);

      expect(productsApi.searchProducts).toHaveBeenCalledWith(query, 10, 0);
      expect(result.products).toEqual([domainProduct]);
      expect(result.total).toBe(1);
    });

    it("throws error when API call fails", async () => {
      const error = new Error("API error");

      vi.mocked(productsApi.searchProducts).mockRejectedValue(error);

      await expect(repository.search("test")).rejects.toThrow("API error");
    });
  });

  describe("save", () => {
    it("creates a new product with client-generated ID", async () => {
      const clientId = 15000;
      const product = Product.create({
        id: ProductId.createClientId(clientId),
        title: ProductTitle.create("Test Product"),
        description: "Test description",
        category: "electronics",
        price: Price.create(99.99),
        stock: Stock.create(50),
        discountPercentage: DiscountPercentage.create(10),
      });
      const formData = {
        title: "Test Product",
        description: "Test description",
        price: 99.99,
        discountPercentage: 10,
        stock: 50,
        category: "electronics",
      };

      vi.mocked(ProductMapper.toFormData).mockReturnValue(formData);
      vi.mocked(productsApi.createProduct).mockResolvedValue(
        createMockApiProduct(clientId)
      );

      const result = await repository.save(product);

      expect(ProductMapper.toFormData).toHaveBeenCalledWith(product);
      expect(productsApi.createProduct).toHaveBeenCalledWith(formData);
      expect(productsApi.updateProduct).not.toHaveBeenCalled();
      expect(result).toBe(product);
    });

    it("updates an existing product with server ID", async () => {
      const serverId = 1;
      const product = createMockDomainProduct(serverId);
      const formData = {
        title: "Test Product",
        description: "Test description",
        price: 99.99,
        discountPercentage: 10,
        stock: 50,
        category: "electronics",
      };

      vi.mocked(ProductMapper.toFormData).mockReturnValue(formData);
      vi.mocked(productsApi.updateProduct).mockResolvedValue(
        createMockApiProduct(serverId)
      );

      const result = await repository.save(product);

      expect(ProductMapper.toFormData).toHaveBeenCalledWith(product);
      expect(productsApi.updateProduct).toHaveBeenCalledWith(
        serverId,
        formData
      );
      expect(productsApi.createProduct).not.toHaveBeenCalled();
      expect(result).toBe(product);
    });

    it("throws error when API call fails", async () => {
      const product = createMockDomainProduct(1);
      const formData = {
        title: "Test Product",
        description: "Test description",
        price: 99.99,
        discountPercentage: 10,
        stock: 50,
        category: "electronics",
      };
      const error = new Error("API error");

      vi.mocked(ProductMapper.toFormData).mockReturnValue(formData);
      vi.mocked(productsApi.updateProduct).mockRejectedValue(error);

      await expect(repository.save(product)).rejects.toThrow("API error");
    });
  });

  describe("delete", () => {
    it("deletes a product successfully", async () => {
      const productId = ProductId.create(1);

      vi.mocked(productsApi.deleteProduct).mockResolvedValue(
        createMockApiProduct(1)
      );

      await repository.delete(productId);

      expect(productsApi.deleteProduct).toHaveBeenCalledWith(1);
    });

    it("throws error when API call fails", async () => {
      const productId = ProductId.create(1);
      const error = new Error("API error");

      vi.mocked(productsApi.deleteProduct).mockRejectedValue(error);

      await expect(repository.delete(productId)).rejects.toThrow("API error");
    });
  });

  describe("exists", () => {
    it("returns true when product exists", async () => {
      const productId = ProductId.create(1);
      const product = createMockDomainProduct(1);
      const apiProduct = createMockApiProduct(1);

      vi.mocked(productsApi.getProduct).mockResolvedValue(apiProduct);
      vi.mocked(ProductMapper.toDomain).mockReturnValue(product);

      const result = await repository.exists(productId);

      expect(productsApi.getProduct).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it("returns false when product does not exist", async () => {
      const productId = ProductId.create(999);

      vi.mocked(productsApi.getProduct).mockRejectedValue(
        new Error("Product not found")
      );

      const result = await repository.exists(productId);

      expect(productsApi.getProduct).toHaveBeenCalledWith(999);
      expect(result).toBe(false);
    });
  });

  describe("existsByTitle", () => {
    it("returns true when product with title exists", async () => {
      const title = "Test Product";
      const apiProducts = [
        createMockApiProduct(1),
        { ...createMockApiProduct(2), title: "Other Product" },
      ];

      vi.mocked(productsApi.searchProducts).mockResolvedValue({
        products: apiProducts,
        total: 2,
        skip: 0,
        limit: 1,
      });

      const result = await repository.existsByTitle(title);

      expect(productsApi.searchProducts).toHaveBeenCalledWith(title, 1, 0);
      expect(result).toBe(true);
    });

    it("returns false when product with title does not exist", async () => {
      const title = "Non-existent Product";
      const apiProducts = [
        { ...createMockApiProduct(1), title: "Other Product" },
      ];

      vi.mocked(productsApi.searchProducts).mockResolvedValue({
        products: apiProducts,
        total: 1,
        skip: 0,
        limit: 1,
      });

      const result = await repository.existsByTitle(title);

      expect(productsApi.searchProducts).toHaveBeenCalledWith(title, 1, 0);
      expect(result).toBe(false);
    });

    it("returns false when search returns empty results", async () => {
      const title = "Non-existent Product";

      vi.mocked(productsApi.searchProducts).mockResolvedValue({
        products: [],
        total: 0,
        skip: 0,
        limit: 1,
      });

      const result = await repository.existsByTitle(title);

      expect(result).toBe(false);
    });

    it("is case-insensitive", async () => {
      const title = "test product";
      const apiProducts = [
        { ...createMockApiProduct(1), title: "Test Product" },
      ];

      vi.mocked(productsApi.searchProducts).mockResolvedValue({
        products: apiProducts,
        total: 1,
        skip: 0,
        limit: 1,
      });

      const result = await repository.existsByTitle(title);

      expect(result).toBe(true);
    });

    it("returns false on error to avoid blocking creation", async () => {
      const title = "Test Product";

      vi.mocked(productsApi.searchProducts).mockRejectedValue(
        new Error("API error")
      );

      const result = await repository.existsByTitle(title);

      expect(result).toBe(false);
    });
  });
});
