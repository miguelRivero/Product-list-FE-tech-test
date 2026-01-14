import { beforeEach, describe, expect, it, vi } from "vitest";

import { CreateProductUseCase } from "./CreateProductUseCase";
import { DiscountPercentage } from "@/domain/product/DiscountPercentage";
import { DuplicateProductTitleError } from "@/domain/product/errors";
import { Price } from "@/domain/product/Price";
import { Product } from "@/domain/product/Product";
import type { ProductFormData } from "@/types/product";
import { ProductId } from "@/domain/product/ProductId";
import type { ProductRepository } from "@/domain/product/ProductRepository";
import { ProductTitle } from "@/domain/product/ProductTitle";
import { Stock } from "@/domain/product/Stock";
import { createMockProductRepository } from "@/test-utils/helpers";

describe("CreateProductUseCase", () => {
  let mockRepository: ProductRepository;
  let createUseCase: CreateProductUseCase;

  beforeEach(() => {
    mockRepository = createMockProductRepository();
    createUseCase = new CreateProductUseCase(mockRepository);
  });

  const createMockProductFormData = (
    overrides?: Partial<ProductFormData>
  ): ProductFormData => ({
    title: "Test Product",
    description: "Test description",
    price: 99.99,
    discountPercentage: 10,
    stock: 100,
    category: "electronics",
    tags: ["test", "product"],
    ...overrides,
  });

  it("creates a product successfully", async () => {
    const formData = createMockProductFormData();
    const clientId = 12345;

    const mockSavedProduct = Product.create({
      id: ProductId.createClientId(clientId),
      title: ProductTitle.create(formData.title),
      description: formData.description,
      category: formData.category,
      price: Price.create(formData.price),
      discountPercentage: DiscountPercentage.create(
        formData.discountPercentage!
      ),
      stock: Stock.create(formData.stock),
      tags: formData.tags,
    });

    vi.mocked(mockRepository.existsByTitle).mockResolvedValue(false);
    vi.mocked(mockRepository.save).mockResolvedValue(mockSavedProduct);

    const result = await createUseCase.execute(formData, clientId);

    expect(mockRepository.existsByTitle).toHaveBeenCalledWith(formData.title);
    expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Product));
    expect(result).toBe(mockSavedProduct);
  });

  it("throws error when product title is duplicate", async () => {
    const formData = createMockProductFormData();
    const clientId = 12345;

    vi.mocked(mockRepository.existsByTitle).mockResolvedValue(true);

    await expect(createUseCase.execute(formData, clientId)).rejects.toThrow(
      DuplicateProductTitleError
    );

    expect(mockRepository.existsByTitle).toHaveBeenCalledWith(formData.title);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it("handles product without discount percentage", async () => {
    const formData = createMockProductFormData({
      discountPercentage: undefined,
    });
    const clientId = 12345;

    const mockSavedProduct = Product.create({
      id: ProductId.createClientId(clientId),
      title: ProductTitle.create(formData.title),
      description: formData.description,
      category: formData.category,
      price: Price.create(formData.price),
      stock: Stock.create(formData.stock),
    });

    vi.mocked(mockRepository.existsByTitle).mockResolvedValue(false);
    vi.mocked(mockRepository.save).mockResolvedValue(mockSavedProduct);

    const result = await createUseCase.execute(formData, clientId);

    expect(result).toBe(mockSavedProduct);
  });

  it("handles product without tags", async () => {
    const formData = createMockProductFormData({ tags: undefined });
    const clientId = 12345;

    const mockSavedProduct = Product.create({
      id: ProductId.createClientId(clientId),
      title: ProductTitle.create(formData.title),
      description: formData.description,
      category: formData.category,
      price: Price.create(formData.price),
      stock: Stock.create(formData.stock),
    });

    vi.mocked(mockRepository.existsByTitle).mockResolvedValue(false);
    vi.mocked(mockRepository.save).mockResolvedValue(mockSavedProduct);

    const result = await createUseCase.execute(formData, clientId);

    expect(result).toBe(mockSavedProduct);
  });
});
