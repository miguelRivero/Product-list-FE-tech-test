import { describe, expect, it } from "vitest";

import type { MountingOptions } from "@vue/test-utils";
import type { Product } from "@/types/product";
import ProductDetailMetadata from "./ProductDetailMetadata.vue";
import { mountWithStubs } from "@/test-utils/helpers";

type MountOptions = MountingOptions<InstanceType<typeof ProductDetailMetadata>>;

describe("ProductDetailMetadata", () => {
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

  it("renders metadata labels", () => {
    const product = createMockProduct({
      meta: {
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T15:30:00Z",
      },
    });

    const wrapper = mountWithStubs(ProductDetailMetadata, {
      props: { product },
    } as MountOptions);

    expect(wrapper.text()).toContain("Created At");
    expect(wrapper.text()).toContain("Updated At");
  });

  it("formats valid date correctly", () => {
    const product = createMockProduct({
      meta: {
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-02-20T15:30:00Z",
      },
    });

    const wrapper = mountWithStubs(ProductDetailMetadata, {
      props: { product },
    } as MountOptions);

    // Date should be formatted in en-GB format (day month year)
    const text = wrapper.text();
    expect(text).toMatch(
      /\d{1,2}\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}/
    );
  });

  it("displays N/A when createdAt is missing", () => {
    const product = createMockProduct({
      meta: {
        createdAt: undefined as unknown as string,
        updatedAt: "2024-01-20T15:30:00Z",
      },
    });

    const wrapper = mountWithStubs(ProductDetailMetadata, {
      props: { product },
    } as MountOptions);

    expect(wrapper.text()).toContain("N/A");
  });

  it("displays N/A when updatedAt is missing", () => {
    const product = createMockProduct({
      meta: {
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: undefined as unknown as string,
      },
    });

    const wrapper = mountWithStubs(ProductDetailMetadata, {
      props: { product },
    } as MountOptions);

    expect(wrapper.text()).toContain("N/A");
  });

  it("displays N/A when meta is missing", () => {
    const product = createMockProduct({
      meta: undefined,
    });

    const wrapper = mountWithStubs(ProductDetailMetadata, {
      props: { product },
    } as MountOptions);

    // Should show N/A for both dates
    const nACount = (wrapper.text().match(/N\/A/g) || []).length;
    expect(nACount).toBe(2);
  });

  it("handles invalid date string gracefully", () => {
    const product = createMockProduct({
      meta: {
        createdAt: "invalid-date",
        updatedAt: "2024-01-20T15:30:00Z",
      },
    });

    const wrapper = mountWithStubs(ProductDetailMetadata, {
      props: { product },
    } as MountOptions);

    // Invalid dates will show "Invalid Date" when formatted
    // The formatDate function's try-catch only catches exceptions,
    // but new Date("invalid-date") doesn't throw, it creates an invalid Date
    // that formats to "Invalid Date" string
    const text = wrapper.text();
    // Should show "Invalid Date" for the invalid date
    expect(text).toContain("Invalid Date");
    // But should still show valid date for updatedAt
    expect(text).toMatch(/\d{1,2}\s(Jan)\s2024/);
  });

  it("formats different date formats correctly", () => {
    const product = createMockProduct({
      meta: {
        createdAt: "2024-12-25",
        updatedAt: "2024-12-31T23:59:59.999Z",
      },
    });

    const wrapper = mountWithStubs(ProductDetailMetadata, {
      props: { product },
    } as MountOptions);

    // Should format both dates
    const text = wrapper.text();
    expect(text).toMatch(/\d{1,2}\s(Dec)\s2024/);
  });
});
