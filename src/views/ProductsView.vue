<template>
  <div class="products-view">
    <ProductsHeader />

    <ProductsSearch v-model:searchQuery="searchQuery" />

    <ProductsToolbar
      v-model:selectedCategory="selectedCategoryValue"
      :categories="categories"
      @add-product="showCreateDialog = true"
    />

    <ProductsContent
      :loading="loading"
      :error="error"
      :products="products"
      :show-create-dialog="showCreateDialog"
      :editing-product="editingProduct"
      @clear-error="clearError"
      @view="viewProduct"
      @edit="editProduct"
      @delete="confirmDelete"
      @close-dialog="showCreateDialog = false"
    />

    <ProductsPagination
      v-if="!loading && products.length > 0"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @page-change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import ProductsHeader from "@/components/ProductsHeader.vue";
import ProductsSearch from "@/components/ProductsSearch.vue";
import ProductsToolbar from "@/components/ProductsToolbar.vue";
import ProductsContent from "@/components/ProductsContent.vue";
import ProductsPagination from "@/components/ProductsPagination.vue";
import { useProducts } from "@/composables/useProducts";
import { useSearch } from "@/composables/useSearch";
import { useProductsStore } from "@/stores/products";
import type { Product } from "@/types/product";

const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

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
} = useProducts();

const clearError = () => {
  const store = useProductsStore();
  store.error = null;
};

const { searchQuery } = useSearch((query: string) => {
  setSearchQuery(query);
});

const selectedCategoryValue = ref<string | null>(null);
const showCreateDialog = ref(false);
const editingProduct = ref<Product | null>(null);

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

const viewProduct = (id: number) => {
  router.push(`/products/${id}`);
};

const editProduct = (id: number) => {
  editingProduct.value = products.value.find((p) => p.id === id) || null;
  showCreateDialog.value = true;
};

const confirmDelete = (product: Product) => {
  confirm.require({
    message: `Are you sure you want to delete "${product.title}"?`,
    header: "Delete Confirmation",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await deleteProduct(product.id);
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Product deleted successfully",
          life: 3000,
        });
      } catch (err) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete product",
          life: 3000,
        });
      }
    },
  });
};
</script>

<style scoped lang="scss">
.products-view {
  min-height: calc(100vh - 200px);
}
</style>
