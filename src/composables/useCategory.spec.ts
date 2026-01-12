import { describe, it, expect, beforeEach } from "vitest";
import { ref } from "vue";
import { useCategory } from "./useCategory";
import type { Category } from "@/types/product";

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

  it("finds category by name", () => {
    const { findCategoryByName } = useCategory(mockCategories);
    const category = findCategoryByName("Electronics");

    expect(category).toEqual({
      slug: "electronics",
      name: "Electronics",
      url: "/categories/electronics",
    });
  });

  it("finds category by slug", () => {
    const { findCategoryBySlug } = useCategory(mockCategories);
    const category = findCategoryBySlug("beauty");

    expect(category).toEqual({
      slug: "beauty",
      name: "Beauty",
      url: "/categories/beauty",
    });
  });

  it("returns undefined when category not found by name", () => {
    const { findCategoryByName } = useCategory(mockCategories);
    const category = findCategoryByName("NonExistent");

    expect(category).toBeUndefined();
  });

  it("returns undefined when category not found by slug", () => {
    const { findCategoryBySlug } = useCategory(mockCategories);
    const category = findCategoryBySlug("nonexistent");

    expect(category).toBeUndefined();
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

  it("converts name to slug", () => {
    const { nameToSlug } = useCategory(mockCategories);
    const slug = nameToSlug("Electronics");

    expect(slug).toBe("electronics");
  });

  it("generates slug from name if category not found", () => {
    const { nameToSlug } = useCategory(mockCategories);
    const slug = nameToSlug("New Category");

    expect(slug).toBe("new-category");
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
