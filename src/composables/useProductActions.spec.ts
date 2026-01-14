import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Product } from "@/types/product";
import { useProductActions } from "./useProductActions";

// Mock vue-router
const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("useProductActions", () => {
  let productActions: ReturnType<typeof useProductActions>;
  let mockProducts: Product[];

  beforeEach(() => {
    vi.clearAllMocks();
    productActions = useProductActions();
    mockProducts = [
      {
        id: 1,
        title: "Product 1",
        description: "Description 1",
        price: 100,
        discountPercentage: 10,
        rating: 4.5,
        stock: 50,
        brand: "Brand 1",
        category: "electronics",
        thumbnail: "thumb1.jpg",
        images: ["img1.jpg"],
      },
      {
        id: 2,
        title: "Product 2",
        description: "Description 2",
        price: 200,
        discountPercentage: 15,
        rating: 4.0,
        stock: 30,
        brand: "Brand 2",
        category: "beauty",
        thumbnail: "thumb2.jpg",
        images: ["img2.jpg"],
      },
    ];
  });

  describe("viewProduct", () => {
    it("navigates to product detail page", () => {
      productActions.viewProduct(1);

      expect(mockPush).toHaveBeenCalledWith("/products/1");
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it("navigates with different product id", () => {
      productActions.viewProduct(42);

      expect(mockPush).toHaveBeenCalledWith("/products/42");
    });
  });

  describe("editProduct", () => {
    it("returns product when found", () => {
      const result = productActions.editProduct(1, mockProducts);

      expect(result).toEqual(mockProducts[0]);
    });

    it("returns product with different id", () => {
      const result = productActions.editProduct(2, mockProducts);

      expect(result).toEqual(mockProducts[1]);
    });

    it("returns null when product not found", () => {
      const result = productActions.editProduct(999, mockProducts);

      expect(result).toBe(null);
    });

    it("returns null when products array is empty", () => {
      const result = productActions.editProduct(1, []);

      expect(result).toBe(null);
    });

    it("handles products array with single product", () => {
      const singleProduct = [mockProducts[0]];
      const result = productActions.editProduct(1, singleProduct);

      expect(result).toEqual(mockProducts[0]);
    });
  });
});
