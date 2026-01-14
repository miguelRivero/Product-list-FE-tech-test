import { beforeEach, describe, expect, it, vi } from "vitest";

import { GetProductUseCase } from "./GetProductUseCase";
import { Price } from "@/domain/product/Price";
import { Product } from "@/domain/product/Product";
import { ProductId } from "@/domain/product/ProductId";
import { ProductNotFoundError } from "@/domain/product/errors";
import type { ProductRepository } from "@/domain/product/ProductRepository";
import { ProductTitle } from "@/domain/product/ProductTitle";
import { Stock } from "@/domain/product/Stock";
import { createMockProductRepository } from "@/test-utils/helpers";

describe("GetProductUseCase", () => {
  let mockRepository: ProductRepository;
  let getProductUseCase: GetProductUseCase;

  beforeEach(() => {
    mockRepository = createMockProductRepository();
    getProductUseCase = new GetProductUseCase(mockRepository);
  });

  const createMockProduct = (id: number): Product => {
    return Product.create({
      id: ProductId.create(id),
      title: ProductTitle.create("Test Product"),
      description: "Test description",
      category: "electronics",
      price: Price.create(99.99),
      stock: Stock.create(100),
    });
  };

  it("fetches a product successfully", async () => {
    const productId = 1;
    const mockProduct = createMockProduct(productId);

    vi.mocked(mockRepository.findById).mockResolvedValue(mockProduct);

    const result = await getProductUseCase.execute(productId);

    expect(mockRepository.findById).toHaveBeenCalledWith(
      ProductId.create(productId)
    );
    expect(result).toBe(mockProduct);
  });

  it("throws error when product not found", async () => {
    const productId = 999;

    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    await expect(getProductUseCase.execute(productId)).rejects.toThrow(
      ProductNotFoundError
    );

    expect(mockRepository.findById).toHaveBeenCalledWith(
      ProductId.create(productId)
    );
  });
});
