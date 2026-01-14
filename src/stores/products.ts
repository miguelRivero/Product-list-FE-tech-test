import { CACHE_TTL, DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/constants";
import type { Category, Product, ProductFormData } from "@/types/product";
import { computed, ref } from "vue";
import {
  generateSecureClientId,
  isClientGeneratedId,
} from "@/utils/idGenerator";
import {
  handleProductError,
  invalidateProductCaches,
} from "./helpers/productStoreHelpers";

import { apiCache } from "@/utils/apiCache";
import { defineStore } from "pinia";
import { diContainer } from "@/infrastructure/di/container";
import { logger } from "@/utils/logger";
import { productsApi } from "@/services/api";
import { toProductViewModel } from "./ProductViewModelMapper";

export const useProductsStore = defineStore("products", () => {
  // State (using API Product type for component compatibility)
  const products = ref<Product[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedProduct = ref<Product | null>(null);
  const categories = ref<Category[]>([]);
  const selectedCategory = ref<string | null>(null);
  const currentPage = ref(DEFAULT_PAGE);
  const pageSize = ref(DEFAULT_PAGE_SIZE);
  const searchQuery = ref("");

  // Getters
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value));
  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPrevPage = computed(() => currentPage.value > 1);

  // Actions
  /**
   * Fetch products with pagination
   * Uses GetProductsUseCase internally
   */
  async function fetchProducts(page = DEFAULT_PAGE, limit = DEFAULT_PAGE_SIZE) {
    loading.value = true;
    error.value = null;
    currentPage.value = page;
    pageSize.value = limit;

    try {
      const getProductsUseCase = diContainer.getProductsUseCase();
      const result = await getProductsUseCase.execute(
        page,
        limit,
        selectedCategory.value || undefined,
        searchQuery.value || undefined
      );

      // Convert domain entities to API Product type for component compatibility
      products.value = result.products.map(toProductViewModel);
      total.value = result.total;
    } catch (err) {
      error.value = handleProductError(err, "fetching products", {
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
   * Uses GetProductUseCase internally
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
        const getProductUseCase = diContainer.getProductUseCase();
        const domainProduct = await getProductUseCase.execute(id);
        const apiProduct = toProductViewModel(domainProduct);
        selectedProduct.value = apiProduct;
        // Cache for 10 minutes
        apiCache.set(cacheKey, apiProduct, undefined, CACHE_TTL.PRODUCT_DETAIL);
      }
    } catch (err) {
      error.value = handleProductError(err, "fetching product", { id });
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch all categories
   * Categories are not part of domain model, so we use API directly
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
        apiCache.set(
          cacheKey,
          categories.value,
          undefined,
          CACHE_TTL.CATEGORIES
        );
      }
    } catch (err) {
      logger.error(
        "Error fetching categories",
        err instanceof Error ? err : new Error("Unknown error")
      );
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
   * Uses CreateProductUseCase internally
   * Uses optimistic update pattern since DummyJSON doesn't persist
   */
  async function createProduct(productData: ProductFormData): Promise<Product> {
    loading.value = true;
    error.value = null;

    try {
      // Generate secure client-side ID
      const clientId = generateSecureClientId();

      // Use case handles domain logic and validation
      const createProductUseCase = diContainer.getCreateProductUseCase();
      const domainProduct = await createProductUseCase.execute(
        productData,
        clientId
      );

      // Convert to API Product type
      const newProduct = toProductViewModel(domainProduct);

      // Add placeholder image if needed (handled in use case, but ensure it's set)
      if (!newProduct.thumbnail) {
        const placeholderImage =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23e2e2e2' width='300' height='200'/%3E%3Ctext fill='%236b7280' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
        newProduct.thumbnail = placeholderImage;
        if (newProduct.images.length === 0) {
          newProduct.images = [placeholderImage];
        }
      }

      // Optimistic update - add to local state immediately
      products.value.unshift(newProduct);
      total.value += 1;

      // Invalidate product caches
      invalidateProductCaches();

      logger.info("Product created successfully", {
        id: clientId,
        title: productData.title,
      });

      return newProduct;
    } catch (err) {
      error.value = handleProductError(err, "creating product", {
        productData,
      });
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Update an existing product
   * Uses UpdateProductUseCase internally
   * Uses optimistic update pattern since DummyJSON doesn't persist
   */
  async function updateProduct(
    id: number,
    updates: Partial<ProductFormData>
  ): Promise<Product> {
    loading.value = true;
    error.value = null;

    // Backup current state for rollback
    const originalProduct =
      products.value.find(p => p.id === id) || selectedProduct.value;

    if (!originalProduct || originalProduct.id !== id) {
      error.value = "Product not found";
      loading.value = false;
      throw new Error("Product not found");
    }

    // Check if product is client-side created
    const isClientCreated = isClientGeneratedId(id);

    // Optimistic update - update UI immediately
    const productIndex = products.value.findIndex(p => p.id === id);
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

    if (isClientCreated) {
      // Product was created locally, just return updated product without API call
      loading.value = false;
      if (productIndex !== -1) {
        return products.value[productIndex] as Product;
      }
      return selectedProduct.value as Product;
    }

    try {
      // Use case handles domain logic
      const updateProductUseCase = diContainer.getUpdateProductUseCase();
      const domainProduct = await updateProductUseCase.execute(id, updates);

      // Convert to API Product type
      const updatedProduct = toProductViewModel(domainProduct);

      // Update state with the actual updated product
      if (productIndex !== -1) {
        products.value[productIndex] = updatedProduct;
      }
      if (selectedProduct.value?.id === id) {
        selectedProduct.value = updatedProduct;
      }

      // Invalidate caches
      invalidateProductCaches(id);

      logger.info("Product updated successfully", { id, updates });

      return updatedProduct;
    } catch (err) {
      // Rollback on error
      if (productIndex !== -1 && originalProduct) {
        products.value[productIndex] = originalProduct;
      }
      if (selectedProduct.value?.id === id && originalProduct) {
        selectedProduct.value = originalProduct;
      }
      error.value = handleProductError(err, "updating product", {
        id,
        updates,
      });
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete a product
   * Uses DeleteProductUseCase internally
   * Uses optimistic update pattern since DummyJSON doesn't persist
   */
  async function deleteProduct(id: number): Promise<void> {
    loading.value = true;
    error.value = null;

    // Backup current state for rollback
    const productInList = products.value.find(p => p.id === id);
    const productInSelected =
      selectedProduct.value?.id === id ? selectedProduct.value : null;

    if (!productInList && !productInSelected) {
      error.value = "Product not found";
      loading.value = false;
      throw new Error("Product not found");
    }

    // Check if product is client-side created
    const isClientCreated = isClientGeneratedId(id);

    // Optimistic update - remove from UI immediately
    const productIndex = products.value.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      products.value.splice(productIndex, 1);
      total.value = Math.max(0, total.value - 1);
    } else if (productInSelected) {
      total.value = Math.max(0, total.value - 1);
    }

    // Clear selected product if it's the one being deleted
    if (selectedProduct.value?.id === id) {
      selectedProduct.value = null;
    }

    if (isClientCreated) {
      // Product was created locally, just remove from UI without API call
      loading.value = false;
      logger.info("Product deleted successfully (client-created)", { id });
      return;
    }

    try {
      // Use case handles domain logic
      const deleteProductUseCase = diContainer.getDeleteProductUseCase();
      await deleteProductUseCase.execute(id);

      // Invalidate caches
      invalidateProductCaches(id);

      logger.info("Product deleted successfully", { id });
    } catch (err) {
      // If product doesn't exist on server but exists locally (DummyJSON doesn't persist),
      // treat it as a successful deletion since we already removed it from UI optimistically
      if (
        err instanceof Error &&
        err.message.includes("not found") &&
        (productInList || productInSelected)
      ) {
        // Product was already removed from UI optimistically
        // Since DummyJSON doesn't persist, this is expected behavior
        logger.info(
          "Product deleted successfully (not found on server, removed locally)",
          {
            id,
          }
        );
        return;
      }

      // Restore on error
      if (productIndex !== -1 && productInList) {
        products.value.splice(productIndex, 0, productInList);
        total.value += 1;
      } else if (productInSelected) {
        total.value += 1;
      }
      error.value = handleProductError(err, "deleting product", { id });
      throw err;
    } finally {
      loading.value = false;
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
