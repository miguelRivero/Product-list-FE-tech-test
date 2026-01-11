import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ProductsToolbar from "./ProductsToolbar.vue";
import type { Category } from "@/types/product";
import { mountWithStubs } from "@/test-utils/helpers";

describe("ProductsToolbar", () => {
  const mockCategories: Category[] = [
    { slug: "electronics", name: "Electronics", url: "/categories/electronics" },
    { slug: "beauty", name: "Beauty", url: "/categories/beauty" },
  ];

  it("renders category select and add button", () => {
    const wrapper = mountWithStubs(ProductsToolbar, {
      props: {
        selectedCategory: null,
        categories: mockCategories,
      },
    });

    expect(wrapper.find('[data-testid="category-select"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="add-product-button"]').exists()).toBe(true);
  });

  it("emits add-product event when add button is clicked", async () => {
    const wrapper = mountWithStubs(ProductsToolbar, {
      props: {
        selectedCategory: null,
        categories: mockCategories,
      },
    });

    const addButton = wrapper.find('[data-testid="add-product-button"]');
    await addButton.trigger("click");

    expect(wrapper.emitted("add-product")).toBeTruthy();
  });

  it("emits update:selectedCategory event when category changes", async () => {
    const wrapper = mountWithStubs(ProductsToolbar, {
      props: {
        selectedCategory: null,
        categories: mockCategories,
      },
    });

    // Simulate category selection
    await wrapper.vm.$emit("update:selectedCategory", "electronics");

    expect(wrapper.emitted("update:selectedCategory")).toBeTruthy();
  });

  it("has aria-label on add button", () => {
    const wrapper = mountWithStubs(ProductsToolbar, {
      props: {
        selectedCategory: null,
        categories: mockCategories,
      },
    });

    const addButton = wrapper.find('[data-testid="add-product-button"]');
    expect(addButton.attributes("aria-label")).toBe("Add new product");
  });
});
