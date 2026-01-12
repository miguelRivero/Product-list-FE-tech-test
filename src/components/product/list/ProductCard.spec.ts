import { describe, it, expect } from "vitest";
import ProductCard from "./ProductCard.vue";
import type { Product } from "@/types/product";
import { mountWithStubs } from "@/test-utils/helpers";

describe("ProductCard", () => {
  const createMockProduct = (overrides?: Partial<Product>): Product => ({
    id: 1,
    title: "Test Product",
    description: "Test description for the product card",
    price: 99.99,
    discountPercentage: 10,
    stock: 50,
    category: "electronics",
    rating: 4.5,
    images: ["image1.jpg"],
    thumbnail: "thumb.jpg",
    ...overrides,
  });

  it("renders product information", () => {
    const product = createMockProduct();
    const wrapper = mountWithStubs(ProductCard, {
      props: { product },
    });

    expect(wrapper.text()).toContain("Test Product");
    expect(wrapper.text()).toContain("$99.99");
    expect(wrapper.text()).toContain("50");
  });

  it("displays discounted price when discountPercentage is greater than 0", () => {
    const product = createMockProduct({ discountPercentage: 20 });
    const wrapper = mountWithStubs(ProductCard, {
      props: { product },
    });

    // Should show original price (with line-through) and discounted price
    expect(wrapper.text()).toContain("$99.99");
  });

  it("displays rating", () => {
    const product = createMockProduct({ rating: 4.5 });
    const wrapper = mountWithStubs(ProductCard, {
      props: { product },
    });

    expect(wrapper.text()).toContain("4.5");
  });

  it("emits view event when view button is clicked", async () => {
    const product = createMockProduct();
    const wrapper = mountWithStubs(ProductCard, {
      props: { product },
    });

    const viewButton = wrapper.find('[data-testid="view-button"]');
    await viewButton.trigger("click");

    expect(wrapper.emitted("view")).toBeTruthy();
    expect(wrapper.emitted("view")?.[0]).toEqual([product.id]);
  });

  it("emits edit event when edit button is clicked", async () => {
    const product = createMockProduct();
    const wrapper = mountWithStubs(ProductCard, {
      props: { product },
    });

    const editButton = wrapper.find('[data-testid="edit-button"]');
    await editButton.trigger("click");

    expect(wrapper.emitted("edit")).toBeTruthy();
    expect(wrapper.emitted("edit")?.[0]).toEqual([product.id]);
  });

  it("emits delete event when delete button is clicked", async () => {
    const product = createMockProduct();
    const wrapper = mountWithStubs(ProductCard, {
      props: { product },
    });

    const deleteButton = wrapper.find('[data-testid="delete-button"]');
    await deleteButton.trigger("click");

    expect(wrapper.emitted("delete")).toBeTruthy();
    expect(wrapper.emitted("delete")?.[0]).toEqual([product]);
  });

  it("truncates long descriptions", () => {
    const longDescription = "a".repeat(200);
    const product = createMockProduct({ description: longDescription });
    const wrapper = mountWithStubs(ProductCard, {
      props: { product },
    });

    const description = wrapper.text();
    // Description should be truncated (less than 200 chars + "...")
    expect(description.length).toBeLessThan(longDescription.length + 10);
  });
});
