import { describe, expect, it } from "vitest";

import type { MountingOptions } from "@vue/test-utils";
import type { Product } from "@/types/product";
import ProductDetailImagePricing from "./ProductDetailImagePricing.vue";
import { mountWithStubs } from "@/test-utils/helpers";

type MountOptions = MountingOptions<
  InstanceType<typeof ProductDetailImagePricing>
>;

describe("ProductDetailImagePricing", () => {
  const createMockProduct = (overrides?: Partial<Product>): Product => ({
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
    ...overrides,
  });

  it("renders product image and pricing information", () => {
    const product = createMockProduct({
      price: 99.99,
      discountPercentage: 15,
      sku: "SKU-123",
    });

    const wrapper = mountWithStubs(ProductDetailImagePricing, {
      props: { product },
    } as MountOptions);

    expect(wrapper.text()).toContain("Price:");
    expect(wrapper.text()).toContain("$99.99");
    expect(wrapper.text()).toContain("Discount:");
    expect(wrapper.text()).toContain("15%");
    expect(wrapper.text()).toContain("SKU/ID:");
    expect(wrapper.text()).toContain("SKU-123");
  });

  it("formats price correctly with two decimal places", () => {
    const product = createMockProduct({ price: 123.456 });

    const wrapper = mountWithStubs(ProductDetailImagePricing, {
      props: { product },
    } as MountOptions);

    expect(wrapper.text()).toContain("$123.46");
  });

  it("formats price correctly for whole numbers", () => {
    const product = createMockProduct({ price: 100 });

    const wrapper = mountWithStubs(ProductDetailImagePricing, {
      props: { product },
    } as MountOptions);

    expect(wrapper.text()).toContain("$100.00");
  });

  it("does not display discount when discountPercentage is 0", () => {
    const product = createMockProduct({ discountPercentage: 0 });

    const wrapper = mountWithStubs(ProductDetailImagePricing, {
      props: { product },
    } as MountOptions);

    expect(wrapper.text()).not.toContain("Discount:");
  });

  it("displays discount when discountPercentage is greater than 0", () => {
    const product = createMockProduct({ discountPercentage: 20 });

    const wrapper = mountWithStubs(ProductDetailImagePricing, {
      props: { product },
    } as MountOptions);

    expect(wrapper.text()).toContain("Discount:");
    expect(wrapper.text()).toContain("20%");
  });

  it("displays SKU when available", () => {
    const product = createMockProduct({ sku: "PROD-123" });

    const wrapper = mountWithStubs(ProductDetailImagePricing, {
      props: { product },
    } as MountOptions);

    expect(wrapper.text()).toContain("PROD-123");
  });

  it("displays product ID when SKU is not available", () => {
    const product = createMockProduct({ id: 42, sku: undefined });

    const wrapper = mountWithStubs(ProductDetailImagePricing, {
      props: { product },
    } as MountOptions);

    expect(wrapper.text()).toContain("42");
  });

  it("renders product image with correct attributes", () => {
    const product = createMockProduct({
      thumbnail: "https://example.com/image.jpg",
      title: "Test Product Title",
    });

    const wrapper = mountWithStubs(ProductDetailImagePricing, {
      props: { product },
    } as MountOptions);

    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe("https://example.com/image.jpg");
    expect(img.attributes("alt")).toBe("Test Product Title");
    expect(img.attributes("loading")).toBe("eager");
  });

  it("handles image error by setting fallback image", async () => {
    const product = createMockProduct({
      thumbnail: "invalid-url.jpg",
    });

    const wrapper = mountWithStubs(ProductDetailImagePricing, {
      props: { product },
    } as MountOptions);

    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);

    // Simulate image error by triggering the error event
    const imgElement = img.element as HTMLImageElement;
    const originalSrc = imgElement.src;

    // Create and dispatch error event
    const errorEvent = new Event("error", { bubbles: true });
    Object.defineProperty(errorEvent, "target", {
      value: imgElement,
      enumerable: true,
    });

    imgElement.dispatchEvent(errorEvent);

    // The handleImageError function should set a fallback SVG
    // Wait for next tick to allow the handler to execute
    await wrapper.vm.$nextTick();

    // Verify the src was changed (should be the fallback SVG)
    expect(imgElement.src).not.toBe(originalSrc);
    expect(imgElement.src).toContain("data:image/svg+xml");
  });
});
