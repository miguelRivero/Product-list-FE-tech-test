<template>
  <div class="products-view mb-8">
    <ProductsSearch v-model:searchQuery="searchQuery" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ProductsToolbar
        v-model:selectedCategory="selectedCategoryValue"
        :categories="categories"
        @add-product="showCreateDialog = true"
      />

      <ProductsContent
        ref="productsContentRef"
        :loading="loading"
        :error="error"
        :products="products"
        :show-create-dialog="showCreateDialog"
        :editing-product="editingProduct"
        :categories="categories"
        @clear-error="clearError"
        @view="viewProductHandler"
        @edit="editProductHandler"
        @delete="handleDeleteClick"
        @close-dialog="handleCloseDialog"
        @save-product="handleSaveProduct"
      />

      <ProductListFooter
        v-if="!loading && products.length > 0"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @page-change="onPageChange"
      />
    </div>

    <!-- Delete Confirmation Dialog -->
    <DeleteConfirmationDialog
      v-if="productToDelete"
      :visible="showDeleteDialog"
      :product-title="productToDelete.title"
      :is-deleting="isDeleting"
      :error-message="deleteError"
      :success-message="deleteSuccess"
      @update:visible="handleDialogVisibilityChange"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import ProductsSearch from "@/components/product/list/ProductsSearch.vue";
import ProductsToolbar from "@/components/product/list/ProductsToolbar.vue";
import ProductsContent from "@/components/product/list/ProductsContent.vue";
import ProductListFooter from "@/components/product/list/ProductListFooter.vue";
import DeleteConfirmationDialog from "@/components/product/form/DeleteConfirmationDialog.vue";
import { useSearch } from "@/composables/useSearch";
import { useCategory } from "@/composables/useCategory";
import { useProductActions } from "@/composables/useProductActions";
import { useProductsStore } from "@/stores/products";
import { storeToRefs } from "pinia";
import type { Product, ProductFormData } from "@/types/product";
import {
  DIALOG_AUTO_CLOSE_DELAY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/utils/constants";

const store = useProductsStore();

// Extract reactive state and getters
const { products, total, loading, error, categories, currentPage, pageSize } =
  storeToRefs(store);

// Actions are accessed directly from the store
const {
  fetchProducts,
  fetchCategories,
  setSelectedCategory,
  setSearchQuery,
  deleteProduct,
  createProduct,
  updateProduct,
} = store;

const clearError = () => {
  store.error = null;
};

// useSearch manages its own searchQuery ref and syncs with store
const { searchQuery } = useSearch((query: string) => {
  setSearchQuery(query);
});

const { slugToName } = useCategory(categories);
const { viewProduct, editProduct: getEditProduct } = useProductActions();

const selectedCategoryValue = ref<string | null>(null);
const showCreateDialog = ref(false);
const editingProduct = ref<Product | null>(null);
const productsContentRef = ref<InstanceType<typeof ProductsContent> | null>(
  null
);

// Delete dialog state
const showDeleteDialog = ref(false);
const productToDelete = ref<Product | null>(null);
const isDeleting = ref(false);
const deleteError = ref<string | null>(null);
const deleteSuccess = ref<string | null>(null);

onMounted(async () => {
  await fetchCategories();
  // Only fetch products if the store is empty or we need fresh data
  // If products were already loaded (e.g., after deleting), use them
  if (products.value.length === 0) {
    await fetchProducts(DEFAULT_PAGE, DEFAULT_PAGE_SIZE);
  }
});

watch(selectedCategoryValue, newCategory => {
  setSelectedCategory(newCategory);
});

const onPageChange = (event: { page: number; first: number; rows: number }) => {
  // PrimeVue Paginator uses 0-indexed pages, but our API uses 1-indexed pages
  // Calculate page number from first index: page = (first / rows) + 1
  const pageNumber = Math.floor(event.first / event.rows) + 1;
  fetchProducts(pageNumber, event.rows);
};

const viewProductHandler = (id: number) => {
  viewProduct(id);
};

const editProductHandler = (id: number) => {
  editingProduct.value = getEditProduct(id, products.value);
  showCreateDialog.value = true;
};

const handleCloseDialog = () => {
  showCreateDialog.value = false;
  editingProduct.value = null;
  if (productsContentRef.value) {
    productsContentRef.value.clearMessages();
  }
};

const handleSaveProduct = async (data: ProductFormData, productId?: number) => {
  if (!productsContentRef.value) return;

  try {
    if (productId) {
      await updateProduct(productId, data);
      productsContentRef.value.setSaveSuccess("Product updated successfully");
      setTimeout(() => {
        handleCloseDialog();
      }, 1000);
    } else {
      // Convert category slug to category name if needed
      const categorySlug = data.category;
      const categoryName = slugToName(categorySlug);

      const createData: ProductFormData = {
        ...data,
        category: categoryName,
      };

      await createProduct(createData);
      productsContentRef.value.setSaveSuccess("Product created successfully");
      setTimeout(() => {
        handleCloseDialog();
      }, DIALOG_AUTO_CLOSE_DELAY);
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : productId
          ? "Failed to update product"
          : "Failed to create product";
    productsContentRef.value.setSaveError(errorMessage);
  }
};

const handleDeleteClick = (product: Product) => {
  productToDelete.value = product;
  deleteError.value = null;
  deleteSuccess.value = null;
  showDeleteDialog.value = true;
};

const handleDeleteConfirm = async () => {
  if (!productToDelete.value) return;

  isDeleting.value = true;
  deleteError.value = null;
  deleteSuccess.value = null;

  try {
    await deleteProduct(productToDelete.value.id);
    deleteSuccess.value = "Product deleted successfully";
    // Dialog will auto-close after 1 second (handled in component)
  } catch (err) {
    deleteError.value =
      err instanceof Error ? err.message : "Failed to delete product";
  } finally {
    isDeleting.value = false;
  }
};

const handleDeleteCancel = () => {
  productToDelete.value = null;
  deleteError.value = null;
  deleteSuccess.value = null;
};

const handleDialogVisibilityChange = (visible: boolean) => {
  showDeleteDialog.value = visible;
  if (!visible) {
    productToDelete.value = null;
    deleteError.value = null;
    deleteSuccess.value = null;
  }
};
</script>

<style scoped lang="scss">
.products-view {
  min-height: calc(100vh - 200px);
  overflow-x: hidden;
  width: 100%;
}
</style>
