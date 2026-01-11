import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ProductListActions from "./ProductListActions.vue";
import type { Product } from "@/types/product";

describe("ProductListActions", () => {
  const createMockProduct = (): Product => ({
    id: 1,
    title: "Test Product",
    description: "Test description",
    price: 99.99,
    discountPercentage: 10,
    stock: 50,
    category: "electronics",
    rating: 4.5,
    images: ["image1.jpg"],
    thumbnail: "thumb.jpg",
  });

  it("renders all action buttons", () => {
    const wrapper = mount(ProductListActions, {
      props: {
        productId: 1,
        product: createMockProduct(),
      },
    });

    expect(wrapper.find('[data-testid="view-button"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="edit-button"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="delete-button"]').exists()).toBe(true);
  });

  it("emits view event with correct id when view button is clicked", async () => {
    const wrapper = mount(ProductListActions, {
      props: {
        productId: 1,
        product: createMockProduct(),
      },
    });

    await wrapper.find('[data-testid="view-button"]').trigger("click");

    expect(wrapper.emitted("view")).toBeTruthy();
    expect(wrapper.emitted("view")?.[0]).toEqual([1]);
  });

  it("emits edit event with correct id when edit button is clicked", async () => {
    const wrapper = mount(ProductListActions, {
      props: {
        productId: 1,
        product: createMockProduct(),
      },
    });

    await wrapper.find('[data-testid="edit-button"]').trigger("click");

    expect(wrapper.emitted("edit")).toBeTruthy();
    expect(wrapper.emitted("edit")?.[0]).toEqual([1]);
  });

  it("emits delete event with product when delete button is clicked", async () => {
    const mockProduct = createMockProduct();
    const wrapper = mount(ProductListActions, {
      props: {
        productId: 1,
        product: mockProduct,
      },
    });

    await wrapper.find('[data-testid="delete-button"]').trigger("click");

    expect(wrapper.emitted("delete")).toBeTruthy();
    expect(wrapper.emitted("delete")?.[0]).toEqual([mockProduct]);
  });

  it("has aria-labels for accessibility", () => {
    const wrapper = mount(ProductListActions, {
      props: {
        productId: 1,
        product: createMockProduct(),
      },
    });

    expect(wrapper.find('[data-testid="view-button"]').attributes("aria-label")).toBe("View product");
    expect(wrapper.find('[data-testid="edit-button"]').attributes("aria-label")).toBe("Edit product");
    expect(wrapper.find('[data-testid="delete-button"]').attributes("aria-label")).toBe("Delete product");
  });
});
