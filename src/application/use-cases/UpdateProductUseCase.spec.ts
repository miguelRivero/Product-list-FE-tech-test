import { describe, it, expect, beforeEach, vi } from "vitest";
import { UpdateProductUseCase } from "./UpdateProductUseCase";
import type { ProductRepository } from "@/domain/product/ProductRepository";
import { Product } from "@/domain/product/Product";
import { ProductId } from "@/domain/product/ProductId";
import { ProductTitle } from "@/domain/product/ProductTitle";
import { Money } from "@/domain/product/Money";
import { Stock } from "@/domain/product/Stock";
import { DiscountPercentage } from "@/domain/product/DiscountPercentage";
import { ProductNotFoundError } from "@/domain/product/errors";
import type { ProductFormData } from "@/types/product";

describe("UpdateProductUseCase", () => {
  let mockRepository: ProductRepository;
  let useCase: UpdateProductUseCase;

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByCategory: vi.fn(),
      search: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn(),
    };

    useCase = new UpdateProductUseCase(mockRepository);
  });

  const createMockProduct = (): Product => {
    return Product.create({
      id: ProductId.create(1),
      title: ProductTitle.create("Original Product"),
      description: "Original description",
      category: "electronics",
      price: Money.create(100),
      stock: Stock.create(50),
    });
  };

  it("updates a product successfully", async () => {
    const productId = 1;
    const updates: Partial<ProductFormData> = {
      title: "Updated Product",
      price: 150,
    };

    const existingProduct = createMockProduct();
    const updatedProduct = createMockProduct();
    updatedProduct.updateTitle(ProductTitle.create(updates.title!));
    updatedProduct.updatePrice(Money.create(updates.price!));

    vi.mocked(mockRepository.findById).mockResolvedValue(existingProduct);
    vi.mocked(mockRepository.save).mockResolvedValue(updatedProduct);

    const result = await useCase.execute(productId, updates);

    expect(mockRepository.findById).toHaveBeenCalledWith(
      ProductId.create(productId)
    );
    expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Product));
    expect(result).toBe(updatedProduct);
  });

  it("throws error when product not found", async () => {
    const productId = 999;
    const updates: Partial<ProductFormData> = {
      title: "Updated Product",
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(productId, updates)).rejects.toThrow(
      ProductNotFoundError
    );

    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it("updates multiple fields at once", async () => {
    const productId = 1;
    const updates: Partial<ProductFormData> = {
      title: "Updated Title",
      description: "Updated description",
      price: 200,
      stock: 75,
      discountPercentage: 15,
      category: "smartphones",
    };

    const existingProduct = createMockProduct();
    const updatedProduct = createMockProduct();
    updatedProduct.updateTitle(ProductTitle.create(updates.title!));
    updatedProduct.updateDescription(updates.description!);
    updatedProduct.updatePrice(Money.create(updates.price!));
    updatedProduct.updateStock(Stock.create(updates.stock!));
    updatedProduct.applyDiscount(
      DiscountPercentage.create(updates.discountPercentage!)
    );
    updatedProduct.updateCategory(updates.category!);

    vi.mocked(mockRepository.findById).mockResolvedValue(existingProduct);
    vi.mocked(mockRepository.save).mockResolvedValue(updatedProduct);

    const result = await useCase.execute(productId, updates);

    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toBe(updatedProduct);
  });

  it("handles partial updates", async () => {
    const productId = 1;
    const updates: Partial<ProductFormData> = {
      price: 250,
    };

    const existingProduct = createMockProduct();
    const updatedProduct = createMockProduct();
    updatedProduct.updatePrice(Money.create(updates.price!));

    vi.mocked(mockRepository.findById).mockResolvedValue(existingProduct);
    vi.mocked(mockRepository.save).mockResolvedValue(updatedProduct);

    const result = await useCase.execute(productId, updates);

    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toBe(updatedProduct);
  });

  it("handles empty updates object", async () => {
    const productId = 1;
    const updates: Partial<ProductFormData> = {};

    const existingProduct = createMockProduct();

    vi.mocked(mockRepository.findById).mockResolvedValue(existingProduct);
    vi.mocked(mockRepository.save).mockResolvedValue(existingProduct);

    const result = await useCase.execute(productId, updates);

    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toBe(existingProduct);
  });
});
