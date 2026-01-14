import type { Ref, ComputedRef } from "vue";
import type { Category } from "@/types/product";

/**
 * Composable for category utilities
 * Provides category conversion and formatting functions
 */
export function useCategory(
  categories: Ref<Category[]> | ComputedRef<Category[]>
) {
  const findCategoryBySlug = (slug: string): Category | undefined => {
    return categories.value.find(cat => cat.slug === slug);
  };

  const slugToName = (slug: string): string => {
    const category = findCategoryBySlug(slug);
    return category ? category.name : slug;
  };

  const capitalizeCategory = (category: string): string => {
    return category
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return {
    slugToName,
    capitalizeCategory,
  };
}
