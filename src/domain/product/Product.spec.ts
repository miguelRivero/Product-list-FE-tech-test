import { describe, it, expect } from "vitest";
import { Product } from "./Product";
import { ProductId } from "./ProductId";
import { ProductTitle } from "./ProductTitle";
import { Price } from "./Price";
import { Stock } from "./Stock";
import { DiscountPercentage } from "./DiscountPercentage";
import { InvalidProductError } from "./errors";

describe("Product", () => {
  const createValidProduct = () => {
    return Product.create({
      id: ProductId.create(1),
      title: ProductTitle.create("Test Product"),
      description: "Test description",
      category: "electronics",
      price: Price.create(100),
      stock: Stock.create(50),
    });
  };

  describe("create", () => {
    it("creates valid product with required fields", () => {
      const product = createValidProduct();

      expect(product.getId().getValue()).toBe(1);
      expect(product.getTitle().getValue()).toBe("Test Product");
      expect(product.getDescription()).toBe("Test description");
      expect(product.getCategory()).toBe("electronics");
      expect(product.getPrice().getAmount()).toBe(100);
      expect(product.getStock().getValue()).toBe(50);
    });

    it("creates product with optional fields", () => {
      const product = Product.create({
        id: ProductId.create(1),
        title: ProductTitle.create("Test Product"),
        description: "Test description",
        category: "electronics",
        price: Price.create(100),
        stock: Stock.create(50),
        discountPercentage: DiscountPercentage.create(10),
        rating: 4.5,
        images: ["image1.jpg", "image2.jpg"],
        thumbnail: "thumb.jpg",
        tags: ["tag1", "tag2"],
        brand: "Test Brand",
        sku: "SKU123",
      });

      expect(product.getDiscountPercentage().getValue()).toBe(10);
      expect(product.getRating()).toBe(4.5);
      expect(product.getImages()).toEqual(["image1.jpg", "image2.jpg"]);
      expect(product.getThumbnail()).toBe("thumb.jpg");
      expect(product.getTags()).toEqual(["tag1", "tag2"]);
      expect(product.getBrand()).toBe("Test Brand");
      expect(product.getSku()).toBe("SKU123");
    });

    it("creates product with default discount percentage", () => {
      const product = createValidProduct();
      expect(product.getDiscountPercentage().getValue()).toBe(0);
    });

    it("creates product with default rating", () => {
      const product = createValidProduct();
      expect(product.getRating()).toBe(0);
    });

    it("creates product with default images and thumbnail", () => {
      const product = createValidProduct();
      expect(product.getImages()).toEqual([]);
      expect(product.getThumbnail()).toBe("");
    });

    it("throws error for empty description", () => {
      expect(() =>
        Product.create({
          id: ProductId.create(1),
          title: ProductTitle.create("Test Product"),
          description: "",
          category: "electronics",
          price: Price.create(100),
          stock: Stock.create(50),
        })
      ).toThrow(InvalidProductError);
    });

    it("throws error for whitespace-only description", () => {
      expect(() =>
        Product.create({
          id: ProductId.create(1),
          title: ProductTitle.create("Test Product"),
          description: "   ",
          category: "electronics",
          price: Price.create(100),
          stock: Stock.create(50),
        })
      ).toThrow(InvalidProductError);
    });

    it("throws error for description exceeding 5000 characters", () => {
      const longDescription = "a".repeat(5001);
      expect(() =>
        Product.create({
          id: ProductId.create(1),
          title: ProductTitle.create("Test Product"),
          description: longDescription,
          category: "electronics",
          price: Price.create(100),
          stock: Stock.create(50),
        })
      ).toThrow(InvalidProductError);
    });

    it("throws error for negative rating", () => {
      expect(() =>
        Product.create({
          id: ProductId.create(1),
          title: ProductTitle.create("Test Product"),
          description: "Test description",
          category: "electronics",
          price: Price.create(100),
          stock: Stock.create(50),
          rating: -1,
        })
      ).toThrow(InvalidProductError);
    });

    it("throws error for rating exceeding 5", () => {
      expect(() =>
        Product.create({
          id: ProductId.create(1),
          title: ProductTitle.create("Test Product"),
          description: "Test description",
          category: "electronics",
          price: Price.create(100),
          stock: Stock.create(50),
          rating: 6,
        })
      ).toThrow(InvalidProductError);
    });
  });

  describe("updateTitle", () => {
    it("updates product title", () => {
      const product = createValidProduct();
      const newTitle = ProductTitle.create("New Title");

      product.updateTitle(newTitle);

      expect(product.getTitle().getValue()).toBe("New Title");
    });
  });

  describe("updateDescription", () => {
    it("updates product description", () => {
      const product = createValidProduct();

      product.updateDescription("New description");

      expect(product.getDescription()).toBe("New description");
    });

    it("throws error for empty description", () => {
      const product = createValidProduct();

      expect(() => product.updateDescription("")).toThrow(InvalidProductError);
    });

    it("throws error for description exceeding 5000 characters", () => {
      const product = createValidProduct();
      const longDescription = "a".repeat(5001);

      expect(() => product.updateDescription(longDescription)).toThrow(
        InvalidProductError
      );
    });
  });

  describe("updatePrice", () => {
    it("updates product price", () => {
      const product = createValidProduct();
      const newPrice = Price.create(200);

      product.updatePrice(newPrice);

      expect(product.getPrice().getAmount()).toBe(200);
    });
  });

  describe("updateCategory", () => {
    it("updates product category", () => {
      const product = createValidProduct();

      product.updateCategory("beauty");

      expect(product.getCategory()).toBe("beauty");
    });

    it("throws error for empty category", () => {
      const product = createValidProduct();

      expect(() => product.updateCategory("")).toThrow(InvalidProductError);
    });

    it("throws error for whitespace-only category", () => {
      const product = createValidProduct();

      expect(() => product.updateCategory("   ")).toThrow(InvalidProductError);
    });
  });

  describe("applyDiscount", () => {
    it("applies discount to product", () => {
      const product = createValidProduct();
      const discount = DiscountPercentage.create(15);

      product.applyDiscount(discount);

      expect(product.getDiscountPercentage().getValue()).toBe(15);
    });
  });

  describe("updateStock", () => {
    it("updates product stock", () => {
      const product = createValidProduct();
      const newStock = Stock.create(100);

      product.updateStock(newStock);

      expect(product.getStock().getValue()).toBe(100);
    });
  });

  describe("fromDTO", () => {
    it("creates product from DTO", () => {
      const dto = {
        id: 1,
        title: "Test Product",
        description: "Test description",
        category: "electronics",
        price: 100,
        discountPercentage: 10,
        stock: 50,
        rating: 4.5,
        images: ["image1.jpg"],
        thumbnail: "thumb.jpg",
        tags: ["tag1"],
        brand: "Brand",
        sku: "SKU123",
      };

      const product = Product.fromDTO(dto);

      expect(product.getId().getValue()).toBe(1);
      expect(product.getTitle().getValue()).toBe("Test Product");
      expect(product.getPrice().getAmount()).toBe(100);
      expect(product.getDiscountPercentage().getValue()).toBe(10);
      expect(product.getStock().getValue()).toBe(50);
      expect(product.getRating()).toBe(4.5);
    });
  });

  describe("toDTO", () => {
    it("converts product to DTO", () => {
      const product = Product.create({
        id: ProductId.create(1),
        title: ProductTitle.create("Test Product"),
        description: "Test description",
        category: "electronics",
        price: Price.create(100),
        stock: Stock.create(50),
        discountPercentage: DiscountPercentage.create(10),
        rating: 4.5,
        images: ["image1.jpg"],
        thumbnail: "thumb.jpg",
        tags: ["tag1"],
        brand: "Brand",
        sku: "SKU123",
      });

      const dto = product.toDTO();

      expect(dto.id).toBe(1);
      expect(dto.title).toBe("Test Product");
      expect(dto.description).toBe("Test description");
      expect(dto.category).toBe("electronics");
      expect(dto.price).toBe(100);
      expect(dto.discountPercentage).toBe(10);
      expect(dto.stock).toBe(50);
      expect(dto.rating).toBe(4.5);
      expect(dto.images).toEqual(["image1.jpg"]);
      expect(dto.thumbnail).toBe("thumb.jpg");
      expect(dto.tags).toEqual(["tag1"]);
      expect(dto.brand).toBe("Brand");
      expect(dto.sku).toBe("SKU123");
    });
  });
});
