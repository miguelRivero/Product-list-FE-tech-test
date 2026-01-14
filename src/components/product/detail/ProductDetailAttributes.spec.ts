import { describe, expect, it } from "vitest";

import type { MountingOptions } from "@vue/test-utils";
import type { Product } from "@/types/product";
import ProductDetailAttributes from "./ProductDetailAttributes.vue";
import { mountWithStubs } from "@/test-utils/helpers";

type MountOptions = MountingOptions<
  InstanceType<typeof ProductDetailAttributes>
>;

describe("ProductDetailAttributes", () => {
  const createMockProduct = (overrides?: Partial<Product>): Product => ({
    id: 1,
    title: "Test Product",
    description: "Test description",
    price: 99.99,
    discountPercentage: 10,
    stock: 50,
    category: "smartphones",
    rating: 4.5,
    images: ["image1.jpg"],
    thumbnail: "thumb.jpg",
    ...overrides,
  });

  it("renders product attributes", () => {
    const product = createMockProduct({
      brand: "Test Brand",
      category: "smartphones",
      stock: 100,
      rating: 4.5,
    });

    const wrapper = mountWithStubs(ProductDetailAttributes, {
      props: { product },
    } as MountOptions);

    expect(wrapper.text()).toContain("Brand:");
    expect(wrapper.text()).toContain("Test Brand");
    expect(wrapper.text()).toContain("Category:");
    expect(wrapper.text()).toContain("Stock:");
    expect(wrapper.text()).toContain("100");
    expect(wrapper.text()).toContain("Rating:");
  });

  it("displays N/A when brand is missing", () => {
    const product = createMockProduct({ brand: undefined });

    const wrapper = mountWithStubs(ProductDetailAttributes, {
      props: { product },
    } as MountOptions);

    expect(wrapper.text()).toContain("N/A");
  });

  it("capitalizes category correctly", () => {
    const product = createMockProduct({ category: "smart-phones" });

    const wrapper = mountWithStubs(ProductDetailAttributes, {
      props: { product },
    } as MountOptions);

    expect(wrapper.text()).toContain("Smart Phones");
  });

  it("capitalizes single-word category", () => {
    const product = createMockProduct({ category: "electronics" });

    const wrapper = mountWithStubs(ProductDetailAttributes, {
      props: { product },
    } as MountOptions);

    expect(wrapper.text()).toContain("Electronics");
  });

  it("capitalizes multi-word category with hyphens", () => {
    const product = createMockProduct({ category: "home-decor-accessories" });

    const wrapper = mountWithStubs(ProductDetailAttributes, {
      props: { product },
    } as MountOptions);

    expect(wrapper.text()).toContain("Home Decor Accessories");
  });

  it("displays correct number of filled stars based on rating", () => {
    const product = createMockProduct({ rating: 4.5 });

    const wrapper = mountWithStubs(ProductDetailAttributes, {
      props: { product },
    } as MountOptions);

    // Rating 4.5 rounds to 5, so all 5 stars should be filled
    const filledStars = wrapper.findAll(".pi-star-fill");
    expect(filledStars.length).toBe(5);
  });

  it("displays correct number of filled stars for rating 3.2", () => {
    const product = createMockProduct({ rating: 3.2 });

    const wrapper = mountWithStubs(ProductDetailAttributes, {
      props: { product },
    } as MountOptions);

    // Rating 3.2 rounds to 3, so 3 stars should be filled
    const filledStars = wrapper.findAll(".pi-star-fill");
    expect(filledStars.length).toBe(3);
  });

  it("displays empty stars for rating 0", () => {
    const product = createMockProduct({ rating: 0 });

    const wrapper = mountWithStubs(ProductDetailAttributes, {
      props: { product },
    } as MountOptions);

    const filledStars = wrapper.findAll(".pi-star-fill");
    expect(filledStars.length).toBe(0);
  });
});
