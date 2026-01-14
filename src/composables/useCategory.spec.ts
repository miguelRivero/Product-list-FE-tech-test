import { beforeEach, describe, expect, it } from "vitest";

import type { Category } from "@/types/product";
import { ref } from "vue";
import { useCategory } from "./useCategory";

describe("useCategory", () => {
  const mockCategories = ref<Category[]>([
    {
      slug: "electronics",
      name: "Electronics",
      url: "/categories/electronics",
    },
    { slug: "beauty", name: "Beauty", url: "/categories/beauty" },
    { slug: "furniture", name: "Furniture", url: "/categories/furniture" },
  ]);

  beforeEach(() => {
    // Reset categories
    mockCategories.value = [
      {
        slug: "electronics",
        name: "Electronics",
        url: "/categories/electronics",
      },
      { slug: "beauty", name: "Beauty", url: "/categories/beauty" },
      { slug: "furniture", name: "Furniture", url: "/categories/furniture" },
    ];
  });

  it("converts slug to name", () => {
    const { slugToName } = useCategory(mockCategories);
    const name = slugToName("electronics");

    expect(name).toBe("Electronics");
  });

  it("returns slug if category not found when converting slug to name", () => {
    const { slugToName } = useCategory(mockCategories);
    const name = slugToName("nonexistent");

    expect(name).toBe("nonexistent");
  });

  it("capitalizes category name correctly", () => {
    const { capitalizeCategory } = useCategory(mockCategories);
    const capitalized = capitalizeCategory("electronics");

    expect(capitalized).toBe("Electronics");
  });

  it("capitalizes multi-word category", () => {
    const { capitalizeCategory } = useCategory(mockCategories);
    const capitalized = capitalizeCategory("home-decoration");

    expect(capitalized).toBe("Home Decoration");
  });
});
