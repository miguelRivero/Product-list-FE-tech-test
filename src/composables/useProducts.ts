import { computed } from "vue";
import { useProductsStore } from "@/stores/products";

/**
 * Composable for products functionality
 * Provides a clean interface to the products store
 */
export function useProducts() {
  const store = useProductsStore();

  return {
    // State
    products: computed(() => store.products),
    total: computed(() => store.total),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    selectedProduct: computed(() => store.selectedProduct),
    categories: computed(() => store.categories),
    currentPage: computed(() => store.currentPage),
    pageSize: computed(() => store.pageSize),
    searchQuery: computed(() => store.searchQuery),
    selectedCategory: computed(() => store.selectedCategory),

    // Computed
    totalPages: computed(() => store.totalPages),
    hasNextPage: computed(() => store.hasNextPage),
    hasPrevPage: computed(() => store.hasPrevPage),

    // Actions
    fetchProducts: store.fetchProducts,
    fetchProduct: store.fetchProduct,
    fetchCategories: store.fetchCategories,
    setSearchQuery: store.setSearchQuery,
    setSelectedCategory: store.setSelectedCategory,
    createProduct: store.createProduct,
    updateProduct: store.updateProduct,
    deleteProduct: store.deleteProduct,
    clearSelectedProduct: store.clearSelectedProduct,
    reset: store.reset,
  };
}

