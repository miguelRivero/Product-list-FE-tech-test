import { beforeEach, describe, expect, it, vi } from "vitest";

import { GetProductsUseCase } from "./GetProductsUseCase";
import { Price } from "@/domain/product/Price";
import { Product } from "@/domain/product/Product";
import { ProductId } from "@/domain/product/ProductId";
import type { ProductRepository } from "@/domain/product/ProductRepository";
import { ProductTitle } from "@/domain/product/ProductTitle";
import { Stock } from "@/domain/product/Stock";
import { createMockProductRepository } from "@/test-utils/helpers";

describe("GetProductsUseCase", () => {
  let mockRepository: ProductRepository;
  let getProductsUseCase: GetProductsUseCase;

  beforeEach(() => {
    mockRepository = createMockProductRepository();
    getProductsUseCase = new GetProductsUseCase(mockRepository);
  });

  const createMockProduct = (id: number): Product => {
    return Product.create({
      id: ProductId.create(id),
      title: ProductTitle.create(`Product ${id}`),
      description: "Test description",
      category: "electronics",
      price: Price.create(99.99),
      stock: Stock.create(100),
    });
  };

  it("fetches all products with default pagination", async () => {
    const mockProducts = [createMockProduct(1), createMockProduct(2)];
    const mockResult = { products: mockProducts, total: 2 };

    vi.mocked(mockRepository.findAll).mockResolvedValue(mockResult);

    const result = await getProductsUseCase.execute();

    expect(mockRepository.findAll).toHaveBeenCalledWith(10, 0);
    expect(result.products).toEqual(mockProducts);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  it("fetches products with custom pagination", async () => {
    const page = 2;
    const limit = 20;
    const skip = (page - 1) * limit; // 20
    const mockProducts = [createMockProduct(1), createMockProduct(2)];
    const mockResult = { products: mockProducts, total: 50 };

    vi.mocked(mockRepository.findAll).mockResolvedValue(mockResult);

    const result = await getProductsUseCase.execute(page, limit);

    expect(mockRepository.findAll).toHaveBeenCalledWith(limit, skip);
    expect(result.page).toBe(page);
    expect(result.limit).toBe(limit);
    expect(result.total).toBe(50);
  });

  it("fetches products by category", async () => {
    const category = "smartphones";
    const page = 1;
    const limit = 10;
    const skip = 0;
    const mockProducts = [createMockProduct(1)];
    const mockResult = { products: mockProducts, total: 1 };

    vi.mocked(mockRepository.findByCategory).mockResolvedValue(mockResult);

    const result = await getProductsUseCase.execute(page, limit, category);

    expect(mockRepository.findByCategory).toHaveBeenCalledWith(
      category,
      limit,
      skip
    );
    expect(mockRepository.findAll).not.toHaveBeenCalled();
    expect(mockRepository.search).not.toHaveBeenCalled();
    expect(result.products).toEqual(mockProducts);
  });

  it("searches products by query", async () => {
    const searchQuery = "laptop";
    const page = 1;
    const limit = 10;
    const skip = 0;
    const mockProducts = [createMockProduct(1)];
    const mockResult = { products: mockProducts, total: 1 };

    vi.mocked(mockRepository.search).mockResolvedValue(mockResult);

    const result = await getProductsUseCase.execute(
      page,
      limit,
      undefined,
      searchQuery
    );

    expect(mockRepository.search).toHaveBeenCalledWith(
      searchQuery,
      limit,
      skip
    );
    expect(mockRepository.findAll).not.toHaveBeenCalled();
    expect(mockRepository.findByCategory).not.toHaveBeenCalled();
    expect(result.products).toEqual(mockProducts);
  });

  it("prioritizes search query over category", async () => {
    const category = "electronics";
    const searchQuery = "laptop";
    const page = 1;
    const limit = 10;
    const skip = 0;
    const mockProducts = [createMockProduct(1)];
    const mockResult = { products: mockProducts, total: 1 };

    vi.mocked(mockRepository.search).mockResolvedValue(mockResult);

    await getProductsUseCase.execute(page, limit, category, searchQuery);

    expect(mockRepository.search).toHaveBeenCalledWith(
      searchQuery,
      limit,
      skip
    );
    expect(mockRepository.findByCategory).not.toHaveBeenCalled();
    expect(mockRepository.findAll).not.toHaveBeenCalled();
  });

  it("calculates skip correctly for different pages", async () => {
    const page = 3;
    const limit = 15;
    const expectedSkip = (page - 1) * limit; // 30
    const mockResult = { products: [], total: 0 };

    vi.mocked(mockRepository.findAll).mockResolvedValue(mockResult);

    await getProductsUseCase.execute(page, limit);

    expect(mockRepository.findAll).toHaveBeenCalledWith(limit, expectedSkip);
  });
});
