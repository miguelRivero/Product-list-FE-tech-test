<template>
  <div class="products-view">
    <ProductsSearch v-model:searchQuery="searchQuery" />

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
      @delete="confirmDelete"
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
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import ProductsSearch from "@/components/products/ProductsSearch.vue";
import ProductsToolbar from "@/components/products/ProductsToolbar.vue";
import ProductsContent from "@/components/products/ProductsContent.vue";
import ProductListFooter from "@/components/products/ProductListFooter.vue";
import { useProducts } from "@/composables/useProducts";
import { useSearch } from "@/composables/useSearch";
import { useCategory } from "@/composables/useCategory";
import { useProductActions } from "@/composables/useProductActions";
import { useProductsStore } from "@/stores/products";
import type { Product, ProductFormData } from "@/types/product";

const store = useProductsStore();

const {
  products,
  total,
  loading,
  error,
  categories,
  currentPage,
  pageSize,
  selectedCategory,
  fetchProducts,
  fetchCategories,
  setSelectedCategory,
  setSearchQuery,
  deleteProduct,
  createProduct,
  updateProduct,
} = useProducts();

const clearError = () => {
  store.error = null;
};

const { searchQuery } = useSearch((query: string) => {
  setSearchQuery(query);
});

const { slugToName } = useCategory(categories);
const {
  viewProduct,
  editProduct: getEditProduct,
  confirmDelete: confirmProductDelete,
} = useProductActions();

const selectedCategoryValue = ref<string | null>(null);
const showCreateDialog = ref(false);
const editingProduct = ref<Product | null>(null);
const productsContentRef = ref<InstanceType<typeof ProductsContent> | null>(
  null
);

onMounted(async () => {
  await fetchCategories();
  await fetchProducts(1, 10);
});

watch(selectedCategoryValue, (newCategory) => {
  setSelectedCategory(newCategory);
});

const onPageChange = (event: { page: number; first: number; rows: number }) => {
  fetchProducts(event.page + 1, event.rows);
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
      }, 1000);
      // Product is already added to the top of the list by the store
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

const confirmDelete = (product: Product) => {
  confirmProductDelete(product, deleteProduct);
};
</script>

<style scoped lang="scss">
.products-view {
  min-height: calc(100vh - 200px);
}
</style>
