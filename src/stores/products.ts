import type {
  Category,
  Product,
  ProductFormData,
  ProductsResponse,
} from "@/types/product";
import { computed, ref } from "vue";

import { defineStore } from "pinia";
import { productsApi } from "@/services/api";
import { logger } from "@/utils/logger";
import { generateSecureClientId, isClientGeneratedId } from "@/utils/idGenerator";
import { apiCache } from "@/utils/apiCache";
import { CACHE_TTL } from "@/utils/constants";

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
      const skip = (page - 1) * limit;
      const cacheParams = { page, limit, skip, search: searchQuery.value, category: selectedCategory.value };

      if (searchQuery.value) {
        // Check cache first
        const cacheKey = `/products/search`;
        const cached = apiCache.get<ProductsResponse>(cacheKey, cacheParams);
        if (cached) {
          response = cached;
          logger.debug("Using cached search results", { query: searchQuery.value });
        } else {
          // Search products
          response = await productsApi.searchProducts(
            searchQuery.value,
            limit,
            skip
          );
          // Cache for 1 minute (search results change frequently)
          apiCache.set(cacheKey, response, cacheParams, CACHE_TTL.SEARCH_RESULTS);
        }
      } else if (selectedCategory.value) {
        // Check cache first
        const cacheKey = `/products/category/${selectedCategory.value}`;
        const cached = apiCache.get<ProductsResponse>(cacheKey, cacheParams);
        if (cached) {
          response = cached;
          logger.debug("Using cached category results", { category: selectedCategory.value });
        } else {
          // Filter by category
          response = await productsApi.getProductsByCategory(
            selectedCategory.value,
            limit,
            skip
          );
          // Cache for 5 minutes
          apiCache.set(cacheKey, response, cacheParams, CACHE_TTL.PRODUCTS_LIST);
        }
      } else {
        // Check cache first
        const cacheKey = `/products`;
        const cached = apiCache.get<ProductsResponse>(cacheKey, cacheParams);
        if (cached) {
          response = cached;
          logger.debug("Using cached products");
        } else {
          // Get all products
          response = await productsApi.getProducts(limit, skip);
          // Cache for 5 minutes
          apiCache.set(cacheKey, response, cacheParams, CACHE_TTL.PRODUCTS_LIST);
        }
      }

      products.value = response.products;
      total.value = response.total;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch products";
      error.value = errorMessage;
      logger.error("Error fetching products", err instanceof Error ? err : new Error(errorMessage), {
        page,
        limit,
        searchQuery: searchQuery.value,
        category: selectedCategory.value,
      });
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
      // Check cache first
      const cacheKey = `/products/${id}`;
      const cached = apiCache.get<Product>(cacheKey);
      if (cached) {
        selectedProduct.value = cached;
        logger.debug("Using cached product", { id });
      } else {
        selectedProduct.value = await productsApi.getProduct(id);
        // Cache for 10 minutes (product details don't change often)
        apiCache.set(cacheKey, selectedProduct.value, undefined, CACHE_TTL.PRODUCT_DETAIL);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch product";
      error.value = errorMessage;
      logger.error("Error fetching product", err instanceof Error ? err : new Error(errorMessage), { id });
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch all categories
   */
  async function fetchCategories() {
    try {
      // Check cache first (categories rarely change)
      const cacheKey = `/products/categories`;
      const cached = apiCache.get<Category[]>(cacheKey);
      if (cached) {
        categories.value = cached;
        logger.debug("Using cached categories");
      } else {
        categories.value = await productsApi.getCategories();
        // Cache for 1 hour (categories rarely change)
        apiCache.set(cacheKey, categories.value, undefined, CACHE_TTL.CATEGORIES);
      }
    } catch (err) {
      logger.error("Error fetching categories", err instanceof Error ? err : new Error("Unknown error"));
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

      // 2. Generate secure client-side ID
      const clientId = generateSecureClientId();

      // 3. Create placeholder image (SVG data URI)
      const placeholderImage =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23e2e2e2' width='300' height='200'/%3E%3Ctext fill='%236b7280' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

      // 4. Create product with client-side ID
      const newProduct: Product = {
        ...response,
        id: clientId,
        thumbnail: response.thumbnail || placeholderImage,
        images:
          response.images && response.images.length > 0
            ? response.images
            : [placeholderImage],
        rating: response.rating || 0,
        discountPercentage: response.discountPercentage || 0,
        tags: productData.tags || [],
      };

      // 5. Add to local state immediately (optimistic update) - at the top of the list
      products.value.unshift(newProduct);
      total.value += 1;

      // 6. Invalidate product list cache since we added a new product
      apiCache.invalidatePattern("^/products");

      logger.info("Product created successfully", { id: clientId, title: productData.title });

      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create product";
      error.value = errorMessage;
      logger.error("Error creating product", err instanceof Error ? err : new Error(errorMessage), {
        productData,
      });
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
    // 1. Backup current state - check both products array and selectedProduct
    const originalProduct =
      products.value.find((p) => p.id === id) || selectedProduct.value;

    if (!originalProduct || originalProduct.id !== id) {
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

    // 3. Check if product is client-side created
    const isClientCreated = isClientGeneratedId(id);

    if (isClientCreated) {
      // Product was created locally, just return updated product without API call
      if (productIndex !== -1) {
        return products.value[productIndex] as Product;
      }
      return selectedProduct.value as Product;
    }

    try {
      // 4. Call API in background (fake response from DummyJSON) only for real products
      await productsApi.updateProduct(id, updates);

      // Invalidate caches for this product and product list
      apiCache.invalidate(`/products/${id}`);
      apiCache.invalidatePattern("^/products");

      logger.info("Product updated successfully", { id, updates });

      // Return the updated product
      if (productIndex !== -1) {
        return products.value[productIndex] as Product;
      }
      return selectedProduct.value as Product;
    } catch (err) {
      // 5. Rollback on error
      if (productIndex !== -1 && originalProduct) {
        products.value[productIndex] = originalProduct;
      }
      if (selectedProduct.value?.id === id && originalProduct) {
        selectedProduct.value = originalProduct;
      }
      const errorMessage = err instanceof Error ? err.message : "Failed to update product";
      error.value = errorMessage;
      logger.error("Error updating product", err instanceof Error ? err : new Error(errorMessage), {
        id,
        updates,
      });
      throw err;
    }
  }

  /**
   * Delete a product
   * Uses optimistic update pattern since DummyJSON doesn't persist
   */
  async function deleteProduct(id: number): Promise<void> {
    // 1. Backup current state - check both products array and selectedProduct
    const productInList = products.value.find((p) => p.id === id);
    const productInSelected = selectedProduct.value?.id === id ? selectedProduct.value : null;

    if (!productInList && !productInSelected) {
      throw new Error("Product not found");
    }

    // 2. Remove from UI immediately (optimistic update)
    const productIndex = products.value.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      products.value.splice(productIndex, 1);
      total.value = Math.max(0, total.value - 1);
    } else if (productInSelected) {
      // Product was in selectedProduct but not in the list
      // Still decrease total to reflect deletion
      total.value = Math.max(0, total.value - 1);
    }

    // Clear selected product if it's the one being deleted
    if (selectedProduct.value?.id === id) {
      selectedProduct.value = null;
    }

    try {
      // 3. Call API in background (fake response from DummyJSON)
      await productsApi.deleteProduct(id);

      // 4. Invalidate caches
      apiCache.invalidate(`/products/${id}`);
      apiCache.invalidatePattern("^/products");

      logger.info("Product deleted successfully", { id });
    } catch (err) {
      // 5. Restore on error
      if (productIndex !== -1 && productInList) {
        products.value.splice(productIndex, 0, productInList);
        total.value += 1;
      } else if (productInSelected) {
        // Restore total if product was only in selectedProduct
        total.value += 1;
      }
      const errorMessage = err instanceof Error ? err.message : "Failed to delete product";
      error.value = errorMessage;
      logger.error("Error deleting product", err instanceof Error ? err : new Error(errorMessage), { id });
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
