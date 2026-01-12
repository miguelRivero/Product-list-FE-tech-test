import { describe, it, expect } from "vitest";
import { ProductDomainService } from "./ProductDomainService";
import { Product } from "./Product";
import { ProductId } from "./ProductId";
import { ProductTitle } from "./ProductTitle";
import { Money } from "./Money";
import { Stock } from "./Stock";
import { DuplicateProductTitleError } from "./errors";

describe("ProductDomainService", () => {
  const createProduct = (id: number, title: string) => {
    return Product.create({
      id: ProductId.create(id),
      title: ProductTitle.create(title),
      description: "Test description",
      category: "electronics",
      price: Money.create(100),
      stock: Stock.create(50),
    });
  };

  describe("validateProductCreation", () => {
    it("validates product creation with no duplicates", () => {
      const service = new ProductDomainService();
      const newProduct = createProduct(1, "New Product");
      const existingProducts: Product[] = [];

      expect(() =>
        service.validateProductCreation(newProduct, existingProducts)
      ).not.toThrow();
    });

    it("validates product creation with different titles", () => {
      const service = new ProductDomainService();
      const newProduct = createProduct(1, "New Product");
      const existingProducts = [createProduct(2, "Existing Product")];

      expect(() =>
        service.validateProductCreation(newProduct, existingProducts)
      ).not.toThrow();
    });

    it("throws error for duplicate title (case-insensitive)", () => {
      const service = new ProductDomainService();
      const newProduct = createProduct(1, "Test Product");
      const existingProducts = [createProduct(2, "test product")]; // Different case

      expect(() =>
        service.validateProductCreation(newProduct, existingProducts)
      ).toThrow(DuplicateProductTitleError);
      expect(() =>
        service.validateProductCreation(newProduct, existingProducts)
      ).toThrow('Product with title "Test Product" already exists');
    });

    it("throws error for duplicate title (same case)", () => {
      const service = new ProductDomainService();
      const newProduct = createProduct(1, "Test Product");
      const existingProducts = [createProduct(2, "Test Product")];

      expect(() =>
        service.validateProductCreation(newProduct, existingProducts)
      ).toThrow(DuplicateProductTitleError);
    });

    it("allows products with similar but not identical titles", () => {
      const service = new ProductDomainService();
      const newProduct = createProduct(1, "Test Product");
      const existingProducts = [createProduct(2, "Test Product 2")];

      expect(() =>
        service.validateProductCreation(newProduct, existingProducts)
      ).not.toThrow();
    });
  });
});
