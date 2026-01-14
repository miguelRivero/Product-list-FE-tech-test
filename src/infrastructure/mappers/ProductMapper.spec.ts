import { describe, expect, it } from "vitest";

import type { Product as ApiProduct } from "@/types/product";
import { DiscountPercentage } from "@/domain/product/DiscountPercentage";
import { Price } from "@/domain/product/Price";
import { Product } from "@/domain/product/Product";
import { ProductId } from "@/domain/product/ProductId";
import { ProductMapper } from "./ProductMapper";
import { ProductTitle } from "@/domain/product/ProductTitle";
import { Stock } from "@/domain/product/Stock";

describe("ProductMapper", () => {
  const createMockApiProduct = (
    overrides?: Partial<ApiProduct>
  ): ApiProduct => {
    return {
      id: 1,
      title: "Test Product",
      description: "Test description",
      category: "electronics",
      price: 99.99,
      discountPercentage: 10,
      rating: 4.5,
      stock: 50,
      images: ["image1.jpg", "image2.jpg"],
      thumbnail: "thumb.jpg",
      tags: ["tag1", "tag2"],
      brand: "Test Brand",
      sku: "SKU123",
      weight: 1.5,
      dimensions: {
        width: 10,
        height: 20,
        depth: 30,
      },
      warrantyInformation: "1 year warranty",
      shippingInformation: "Free shipping",
      availabilityStatus: "in-stock",
      reviews: [
        {
          rating: 5,
          comment: "Great product",
          date: "2024-01-01",
          reviewerName: "John Doe",
          reviewerEmail: "john@example.com",
        },
      ],
      returnPolicy: "30 days return",
      minimumOrderQuantity: 1,
      meta: {
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        barcode: "123456789",
        qrCode: "QR123",
      },
      ...overrides,
    };
  };

  const createDomainProduct = () => {
    return Product.create({
      id: ProductId.create(1),
      title: ProductTitle.create("Test Product"),
      description: "Test description",
      category: "electronics",
      price: Price.create(99.99),
      stock: Stock.create(50),
      discountPercentage: DiscountPercentage.create(10),
      rating: 4.5,
      images: ["image1.jpg", "image2.jpg"],
      thumbnail: "thumb.jpg",
      tags: ["tag1", "tag2"],
      brand: "Test Brand",
      sku: "SKU123",
      meta: {
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        barcode: "123456789",
        qrCode: "QR123",
      },
    });
  };

  describe("toDomain", () => {
    it("converts API Product to Domain Product entity", () => {
      const apiProduct = createMockApiProduct();
      const domainProduct = ProductMapper.toDomain(apiProduct);

      expect(domainProduct.getId().getValue()).toBe(1);
      expect(domainProduct.getTitle().getValue()).toBe("Test Product");
      expect(domainProduct.getDescription()).toBe("Test description");
      expect(domainProduct.getCategory()).toBe("electronics");
      expect(domainProduct.getPrice().getAmount()).toBe(99.99);
      expect(domainProduct.getStock().getValue()).toBe(50);
      expect(domainProduct.getDiscountPercentage().getValue()).toBe(10);
      expect(domainProduct.getRating()).toBe(4.5);
    });

    it("handles missing tags by defaulting to empty array", () => {
      const apiProduct = createMockApiProduct({ tags: undefined });
      const domainProduct = ProductMapper.toDomain(apiProduct);

      const dto = domainProduct.toDTO();
      expect(dto.tags).toEqual([]);
    });

    it("preserves fields that Product entity supports", () => {
      const apiProduct = createMockApiProduct();
      const domainProduct = ProductMapper.toDomain(apiProduct);

      const dto = domainProduct.toDTO();
      // Product entity stores these fields
      expect(dto.brand).toBe("Test Brand");
      expect(dto.sku).toBe("SKU123");
      expect(dto.meta).toEqual({
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        barcode: "123456789",
        qrCode: "QR123",
      });
    });

    it("handles minimal API Product with only required fields", () => {
      const apiProduct: ApiProduct = {
        id: 1,
        title: "Minimal Product",
        description: "Minimal description",
        category: "electronics",
        price: 100,
        discountPercentage: 0,
        rating: 0,
        stock: 0,
        images: [],
        thumbnail: "",
      };

      const domainProduct = ProductMapper.toDomain(apiProduct);

      expect(domainProduct.getId().getValue()).toBe(1);
      expect(domainProduct.getTitle().getValue()).toBe("Minimal Product");
      expect(domainProduct.getDescription()).toBe("Minimal description");
      expect(domainProduct.getCategory()).toBe("electronics");
      expect(domainProduct.getPrice().getAmount()).toBe(100);
      expect(domainProduct.getStock().getValue()).toBe(0);
    });

    it("preserves images and thumbnail arrays", () => {
      const apiProduct = createMockApiProduct({
        images: ["img1.jpg", "img2.jpg", "img3.jpg"],
        thumbnail: "thumb.jpg",
      });
      const domainProduct = ProductMapper.toDomain(apiProduct);

      const dto = domainProduct.toDTO();
      expect(dto.images).toEqual(["img1.jpg", "img2.jpg", "img3.jpg"]);
      expect(dto.thumbnail).toBe("thumb.jpg");
    });
  });

  describe("toApi", () => {
    it("converts Domain Product to API Product", () => {
      const domainProduct = createDomainProduct();
      const apiProduct = ProductMapper.toApi(domainProduct);

      expect(apiProduct.id).toBe(1);
      expect(apiProduct.title).toBe("Test Product");
      expect(apiProduct.description).toBe("Test description");
      expect(apiProduct.category).toBe("electronics");
      expect(apiProduct.price).toBe(99.99);
      expect(apiProduct.stock).toBe(50);
      expect(apiProduct.discountPercentage).toBe(10);
      expect(apiProduct.rating).toBe(4.5);
    });

    it("preserves fields that Product entity supports", () => {
      const domainProduct = createDomainProduct();
      const apiProduct = ProductMapper.toApi(domainProduct);

      // Product entity stores these fields
      expect(apiProduct.brand).toBe("Test Brand");
      expect(apiProduct.sku).toBe("SKU123");
      expect(apiProduct.meta).toEqual({
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        barcode: "123456789",
        qrCode: "QR123",
      });
      // Note: weight, dimensions, warrantyInformation, etc. are not stored
      // in Product entity, so they won't be in the output
    });

    it("handles roundtrip conversion for fields stored in Product entity", () => {
      const originalApiProduct = createMockApiProduct();
      const domainProduct = ProductMapper.toDomain(originalApiProduct);
      const convertedApiProduct = ProductMapper.toApi(domainProduct);

      // Compare core fields (always preserved)
      expect(convertedApiProduct.id).toBe(originalApiProduct.id);
      expect(convertedApiProduct.title).toBe(originalApiProduct.title);
      expect(convertedApiProduct.description).toBe(
        originalApiProduct.description
      );
      expect(convertedApiProduct.category).toBe(originalApiProduct.category);
      expect(convertedApiProduct.price).toBe(originalApiProduct.price);
      expect(convertedApiProduct.discountPercentage).toBe(
        originalApiProduct.discountPercentage
      );
      expect(convertedApiProduct.rating).toBe(originalApiProduct.rating);
      expect(convertedApiProduct.stock).toBe(originalApiProduct.stock);
      expect(convertedApiProduct.images).toEqual(originalApiProduct.images);
      expect(convertedApiProduct.thumbnail).toBe(originalApiProduct.thumbnail);
      expect(convertedApiProduct.tags).toEqual(originalApiProduct.tags);
      // Fields stored in Product entity
      expect(convertedApiProduct.brand).toBe(originalApiProduct.brand);
      expect(convertedApiProduct.sku).toBe(originalApiProduct.sku);
      expect(convertedApiProduct.meta).toEqual(originalApiProduct.meta);
      // Note: weight, dimensions, warrantyInformation, etc. are lost because
      // Product entity doesn't store them (they're only in ProductDTO during mapping)
    });

    it("handles minimal Domain Product with only required fields", () => {
      const domainProduct = Product.create({
        id: ProductId.create(1),
        title: ProductTitle.create("Minimal Product"),
        description: "Minimal description",
        category: "electronics",
        price: Price.create(100),
        stock: Stock.create(0),
      });

      const apiProduct = ProductMapper.toApi(domainProduct);

      expect(apiProduct.id).toBe(1);
      expect(apiProduct.title).toBe("Minimal Product");
      expect(apiProduct.description).toBe("Minimal description");
      expect(apiProduct.category).toBe("electronics");
      expect(apiProduct.price).toBe(100);
      expect(apiProduct.stock).toBe(0);
      expect(apiProduct.discountPercentage).toBe(0);
      expect(apiProduct.rating).toBe(0);
      expect(apiProduct.tags).toEqual([]);
    });
  });

  describe("toFormData", () => {
    it("converts Domain Product to ProductFormData", () => {
      const domainProduct = createDomainProduct();
      const formData = ProductMapper.toFormData(domainProduct);

      expect(formData.title).toBe("Test Product");
      expect(formData.description).toBe("Test description");
      expect(formData.price).toBe(99.99);
      expect(formData.discountPercentage).toBe(10);
      expect(formData.stock).toBe(50);
      expect(formData.category).toBe("electronics");
      expect(formData.tags).toEqual(["tag1", "tag2"]);
      expect(formData.brand).toBe("Test Brand");
    });

    it("only includes form-relevant fields", () => {
      const domainProduct = createDomainProduct();
      const formData = ProductMapper.toFormData(domainProduct);

      // Should include these fields
      expect(formData).toHaveProperty("title");
      expect(formData).toHaveProperty("description");
      expect(formData).toHaveProperty("price");
      expect(formData).toHaveProperty("discountPercentage");
      expect(formData).toHaveProperty("stock");
      expect(formData).toHaveProperty("category");
      expect(formData).toHaveProperty("tags");
      expect(formData).toHaveProperty("brand");

      // Should NOT include read-only or non-form fields
      expect(formData).not.toHaveProperty("id");
      expect(formData).not.toHaveProperty("images");
      expect(formData).not.toHaveProperty("thumbnail");
      expect(formData).not.toHaveProperty("rating");
      expect(formData).not.toHaveProperty("sku");
      expect(formData).not.toHaveProperty("weight");
      expect(formData).not.toHaveProperty("dimensions");
      expect(formData).not.toHaveProperty("warrantyInformation");
      expect(formData).not.toHaveProperty("shippingInformation");
      expect(formData).not.toHaveProperty("availabilityStatus");
      expect(formData).not.toHaveProperty("reviews");
      expect(formData).not.toHaveProperty("returnPolicy");
      expect(formData).not.toHaveProperty("minimumOrderQuantity");
      expect(formData).not.toHaveProperty("meta");
    });

    it("handles optional fields correctly", () => {
      const domainProduct = Product.create({
        id: ProductId.create(1),
        title: ProductTitle.create("Product without optional fields"),
        description: "Description",
        category: "electronics",
        price: Price.create(100),
        stock: Stock.create(50),
      });

      const formData = ProductMapper.toFormData(domainProduct);

      expect(formData.title).toBe("Product without optional fields");
      expect(formData.description).toBe("Description");
      expect(formData.price).toBe(100);
      expect(formData.stock).toBe(50);
      expect(formData.category).toBe("electronics");
      expect(formData.discountPercentage).toBe(0);
      expect(formData.tags).toEqual([]);
      expect(formData.brand).toBeUndefined();
    });

    it("preserves discountPercentage when present", () => {
      const domainProduct = createDomainProduct();
      const formData = ProductMapper.toFormData(domainProduct);

      expect(formData.discountPercentage).toBe(10);
    });

    it("preserves tags array when present", () => {
      const domainProduct = createDomainProduct();
      const formData = ProductMapper.toFormData(domainProduct);

      expect(formData.tags).toEqual(["tag1", "tag2"]);
    });

    it("preserves empty tags array", () => {
      const domainProduct = Product.create({
        id: ProductId.create(1),
        title: ProductTitle.create("Product with empty tags"),
        description: "Description",
        category: "electronics",
        price: Price.create(100),
        stock: Stock.create(50),
        tags: [],
      });

      const formData = ProductMapper.toFormData(domainProduct);

      expect(formData.tags).toEqual([]);
    });
  });
});
