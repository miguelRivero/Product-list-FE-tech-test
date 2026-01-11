import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreateProductUseCase } from "./CreateProductUseCase";
import type { ProductRepository } from "@/domain/product/ProductRepository";
import type { ProductDomainService } from "@/domain/product/ProductDomainService";
import { Product } from "@/domain/product/Product";
import { ProductId } from "@/domain/product/ProductId";
import { ProductTitle } from "@/domain/product/ProductTitle";
import { Money } from "@/domain/product/Money";
import { Stock } from "@/domain/product/Stock";
import { DiscountPercentage } from "@/domain/product/DiscountPercentage";
import { DuplicateProductTitleError } from "@/domain/product/errors";
import type { ProductFormData } from "@/types/product";

describe("CreateProductUseCase", () => {
  let mockRepository: ProductRepository;
  let mockDomainService: ProductDomainService;
  let useCase: CreateProductUseCase;

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

    // Create mock domain service
    mockDomainService = {
      validateProductCreation: vi.fn(),
    };

    useCase = new CreateProductUseCase(mockRepository, mockDomainService);
  });

  const createMockProductFormData = (overrides?: Partial<ProductFormData>): ProductFormData => ({
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

    const mockExistingProducts = { products: [], total: 0 };
    const mockSavedProduct = Product.create({
      id: ProductId.createClientId(clientId),
      title: ProductTitle.create(formData.title),
      description: formData.description,
      category: formData.category,
      price: Money.create(formData.price),
      discountPercentage: DiscountPercentage.create(formData.discountPercentage!),
      stock: Stock.create(formData.stock),
      tags: formData.tags,
    });

    vi.mocked(mockRepository.findAll).mockResolvedValue(mockExistingProducts);
    vi.mocked(mockDomainService.validateProductCreation).mockReturnValue(undefined);
    vi.mocked(mockRepository.save).mockResolvedValue(mockSavedProduct);

    const result = await useCase.execute(formData, clientId);

    expect(mockRepository.findAll).toHaveBeenCalledWith(1000, 0);
    expect(mockDomainService.validateProductCreation).toHaveBeenCalledWith(
      expect.any(Product),
      []
    );
    expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Product));
    expect(result).toBe(mockSavedProduct);
  });

  it("throws error when product title is duplicate", async () => {
    const formData = createMockProductFormData();
    const clientId = 12345;

    const existingProduct = Product.create({
      id: ProductId.create(1),
      title: ProductTitle.create(formData.title),
      description: "Existing product",
      category: "electronics",
      price: Money.create(50),
      stock: Stock.create(10),
    });

    const mockExistingProducts = { products: [existingProduct], total: 1 };

    vi.mocked(mockRepository.findAll).mockResolvedValue(mockExistingProducts);
    vi.mocked(mockDomainService.validateProductCreation).mockImplementation(() => {
      throw new DuplicateProductTitleError("Product title already exists");
    });

    await expect(useCase.execute(formData, clientId)).rejects.toThrow(
      DuplicateProductTitleError
    );

    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it("handles product without discount percentage", async () => {
    const formData = createMockProductFormData({ discountPercentage: undefined });
    const clientId = 12345;

    const mockExistingProducts = { products: [], total: 0 };
    const mockSavedProduct = Product.create({
      id: ProductId.createClientId(clientId),
      title: ProductTitle.create(formData.title),
      description: formData.description,
      category: formData.category,
      price: Money.create(formData.price),
      stock: Stock.create(formData.stock),
    });

    vi.mocked(mockRepository.findAll).mockResolvedValue(mockExistingProducts);
    vi.mocked(mockDomainService.validateProductCreation).mockReturnValue(undefined);
    vi.mocked(mockRepository.save).mockResolvedValue(mockSavedProduct);

    const result = await useCase.execute(formData, clientId);

    expect(result).toBe(mockSavedProduct);
  });

  it("handles product without tags", async () => {
    const formData = createMockProductFormData({ tags: undefined });
    const clientId = 12345;

    const mockExistingProducts = { products: [], total: 0 };
    const mockSavedProduct = Product.create({
      id: ProductId.createClientId(clientId),
      title: ProductTitle.create(formData.title),
      description: formData.description,
      category: formData.category,
      price: Money.create(formData.price),
      stock: Stock.create(formData.stock),
    });

    vi.mocked(mockRepository.findAll).mockResolvedValue(mockExistingProducts);
    vi.mocked(mockDomainService.validateProductCreation).mockReturnValue(undefined);
    vi.mocked(mockRepository.save).mockResolvedValue(mockSavedProduct);

    const result = await useCase.execute(formData, clientId);

    expect(result).toBe(mockSavedProduct);
  });
});
