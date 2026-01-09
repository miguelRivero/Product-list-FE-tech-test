import { computed, type Ref, type ComputedRef } from "vue";
import type { Category } from "@/types/product";

/**
 * Composable for category utilities
 * Provides category conversion and formatting functions
 */
export function useCategory(categories: Ref<Category[]> | ComputedRef<Category[]>) {
  const findCategoryByName = (name: string): Category | undefined => {
    return categories.value.find((cat) => cat.name === name);
  };

  const findCategoryBySlug = (slug: string): Category | undefined => {
    return categories.value.find((cat) => cat.slug === slug);
  };

  const slugToName = (slug: string): string => {
    const category = findCategoryBySlug(slug);
    return category ? category.name : slug;
  };

  const nameToSlug = (name: string): string => {
    const category = findCategoryByName(name);
    return category
      ? category.slug
      : name.toLowerCase().replace(/\s+/g, "-");
  };

  const capitalizeCategory = (category: string): string => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return {
    findCategoryByName,
    findCategoryBySlug,
    slugToName,
    nameToSlug,
    capitalizeCategory,
  };
}
