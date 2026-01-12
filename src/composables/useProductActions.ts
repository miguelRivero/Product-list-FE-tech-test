import type { Product } from "@/types/product";
import { useRouter } from "vue-router";

/**
 * Composable for product action handlers
 * Provides navigation and action handlers for product operations
 */
export function useProductActions() {
  const router = useRouter();

  const viewProduct = (id: number) => {
    router.push(`/products/${id}`);
  };

  const editProduct = (id: number, products: Product[]): Product | null => {
    return products.find(p => p.id === id) || null;
  };

  return {
    viewProduct,
    editProduct,
  };
}
