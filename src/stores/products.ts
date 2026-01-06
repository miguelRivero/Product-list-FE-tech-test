import type {
  Category,
  Product,
  ProductFormData,
  ProductsResponse,
} from "@/types/product";
import { computed, ref } from "vue";

import { defineStore } from "pinia";
import { productsApi } from "@/services/api";

export const useProductsStore = defineStore("products", () => {
  // State
  const products = ref<Product[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedProduct = ref<Product | null>(null);
  const categories = ref<Category[]>([]);
  const selectedCategory = ref<string | null>(null);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const searchQuery = ref("");

  // Getters
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value));
  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPrevPage = computed(() => currentPage.value > 1);

  // Actions
  /**
   * Fetch products with pagination
   */
  async function fetchProducts(page = 1, limit = 10) {
    loading.value = true;
    error.value = null;
    currentPage.value = page;
    pageSize.value = limit;

    try {
      let response: ProductsResponse;

      if (searchQuery.value) {
        // Search products
        const skip = (page - 1) * limit;
        response = await productsApi.searchProducts(
          searchQuery.value,
          limit,
          skip
        );
      } else if (selectedCategory.value) {
        // Filter by category
        const skip = (page - 1) * limit;
        response = await productsApi.getProductsByCategory(
          selectedCategory.value,
          limit,
          skip
        );
      } else {
        // Get all products
        const skip = (page - 1) * limit;
        response = await productsApi.getProducts(limit, skip);
      }

      products.value = response.products;
      total.value = response.total;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch products";
      console.error("Error fetching products:", err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch single product by ID
   */
  async function fetchProduct(id: number) {
    loading.value = true;
    error.value = null;

    try {
      selectedProduct.value = await productsApi.getProduct(id);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch product";
      console.error("Error fetching product:", err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch all categories
   */
  async function fetchCategories() {
    try {
      categories.value = await productsApi.getCategories();
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  /**
   * Set search query and refetch products
   */
  async function setSearchQuery(query: string) {
    searchQuery.value = query;
    await fetchProducts(1, pageSize.value);
  }

  /**
   * Set selected category and refetch products
   */
  async function setSelectedCategory(category: string | null) {
    selectedCategory.value = category;
    await fetchProducts(1, pageSize.value);
  }

  /**
   * Create a new product
   * Uses optimistic update pattern since DummyJSON doesn't persist
   */
  async function createProduct(productData: ProductFormData): Promise<Product> {
    try {
      // 1. Call API (returns fake success from DummyJSON)
      const response = await productsApi.createProduct(productData);

      // 2. Generate client-side ID (DummyJSON ID won't persist)
      // Use negative timestamp to distinguish from real IDs
      const clientId = -Date.now();

      // 3. Create product with client-side ID
      const newProduct: Product = {
        ...response,
        id: clientId,
        thumbnail: response.thumbnail || "/placeholder.png",
        images: response.images || [],
        rating: response.rating || 0,
        discountPercentage: response.discountPercentage || 0,
        tags: productData.tags || [],
      };

      // 4. Add to local state immediately (optimistic update)
      products.value.unshift(newProduct);
      total.value += 1;

      return newProduct;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to create product";
      console.error("Error creating product:", err);
      throw err;
    }
  }

  /**
   * Update an existing product
   * Uses optimistic update pattern since DummyJSON doesn't persist
   */
  async function updateProduct(
    id: number,
    updates: Partial<ProductFormData>
  ): Promise<Product> {
    // 1. Backup current state
    const originalProduct = products.value.find((p) => p.id === id);
    if (!originalProduct) {
      throw new Error("Product not found");
    }

    // 2. Optimistic update - update UI immediately
    const productIndex = products.value.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      products.value[productIndex] = {
        ...products.value[productIndex],
        ...updates,
      } as Product;
    }

    // Also update selected product if it's the one being updated
    if (selectedProduct.value?.id === id) {
      selectedProduct.value = {
        ...selectedProduct.value,
        ...updates,
      } as Product;
    }

    try {
      // 3. Call API in background (fake response from DummyJSON)
      await productsApi.updateProduct(id, updates);
      return products.value[productIndex] as Product;
    } catch (err) {
      // 4. Rollback on error
      if (productIndex !== -1) {
        products.value[productIndex] = originalProduct;
      }
      if (selectedProduct.value?.id === id) {
        selectedProduct.value = originalProduct;
      }
      error.value =
        err instanceof Error ? err.message : "Failed to update product";
      console.error("Error updating product:", err);
      throw err;
    }
  }

  /**
   * Delete a product
   * Uses optimistic update pattern since DummyJSON doesn't persist
   */
  async function deleteProduct(id: number): Promise<void> {
    // 1. Backup current state
    const backup = products.value.find((p) => p.id === id);
    if (!backup) {
      throw new Error("Product not found");
    }

    // 2. Remove from UI immediately (optimistic update)
    const productIndex = products.value.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      products.value.splice(productIndex, 1);
      total.value = Math.max(0, total.value - 1);
    }

    // Clear selected product if it's the one being deleted
    if (selectedProduct.value?.id === id) {
      selectedProduct.value = null;
    }

    try {
      // 3. Call API in background (fake response from DummyJSON)
      await productsApi.deleteProduct(id);
    } catch (err) {
      // 4. Restore on error
      if (productIndex !== -1) {
        products.value.splice(productIndex, 0, backup);
        total.value += 1;
      }
      error.value =
        err instanceof Error ? err.message : "Failed to delete product";
      console.error("Error deleting product:", err);
      throw err;
    }
  }

  /**
   * Clear selected product
   */
  function clearSelectedProduct() {
    selectedProduct.value = null;
  }

  /**
   * Reset store state
   */
  function reset() {
    products.value = [];
    total.value = 0;
    loading.value = false;
    error.value = null;
    selectedProduct.value = null;
    currentPage.value = 1;
    searchQuery.value = "";
    selectedCategory.value = null;
  }

  return {
    // State
    products,
    total,
    loading,
    error,
    selectedProduct,
    categories,
    currentPage,
    pageSize,
    searchQuery,
    selectedCategory,
    // Getters
    totalPages,
    hasNextPage,
    hasPrevPage,
    // Actions
    fetchProducts,
    fetchProduct,
    fetchCategories,
    setSearchQuery,
    setSelectedCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    clearSelectedProduct,
    reset,
  };
});
