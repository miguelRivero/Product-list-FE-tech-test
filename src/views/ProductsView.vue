<template>
  <div class="products-view">
    <div class="mb-4 flex justify-content-between align-items-center">
      <h1 class="text-3xl font-bold m-0">Products</h1>
      <Button
        label="Add New Product"
        icon="pi pi-plus"
        @click="showCreateDialog = true"
        data-testid="add-product-button"
      />
    </div>

    <!-- Search and Filter -->
    <div class="mb-4 flex gap-3 flex-wrap">
      <span class="p-input-icon-left flex-1" style="min-width: 250px">
        <i class="pi pi-search" />
        <InputText
          v-model="searchQuery"
          placeholder="Search products..."
          class="w-full"
          data-testid="search-input"
        />
      </span>

      <Select
        v-model="selectedCategory"
        :options="categories"
        placeholder="All Categories"
        class="w-12rem"
        data-testid="category-filter"
        @change="handleCategoryChange"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-content-center py-6">
      <ProgressSpinner />
    </div>

    <!-- Error State -->
    <Message
      v-if="error && !loading"
      severity="error"
      :closable="true"
      @close="clearError"
    >
      {{ error }}
    </Message>

    <!-- Products List -->
    <div v-if="!loading && !error" class="products-grid">
      <Card
        v-for="product in products"
        :key="product.id"
        class="product-card"
        data-testid="product-card"
      >
        <template #header>
          <img
            :src="product.thumbnail"
            :alt="product.title"
            class="product-thumbnail"
            @error="handleImageError"
          />
        </template>
        <template #title>
          <div class="flex justify-content-between align-items-start">
            <span class="text-lg font-semibold">{{ product.title }}</span>
            <Tag
              :value="product.category"
              severity="info"
              class="ml-2"
            />
          </div>
        </template>
        <template #content>
          <p class="text-600 line-height-3 mt-2 mb-3">
            {{ truncateDescription(product.description) }}
          </p>
          <div class="flex justify-content-between align-items-center">
            <div>
              <span class="text-2xl font-bold text-primary">
                ${{ product.price.toFixed(2) }}
              </span>
              <span
                v-if="product.discountPercentage > 0"
                class="text-sm text-500 line-through ml-2"
              >
                ${{
                  (
                    product.price /
                    (1 - product.discountPercentage / 100)
                  ).toFixed(2)
                }}
              </span>
            </div>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-star-fill text-yellow-500" />
              <span class="font-semibold">{{ product.rating }}</span>
            </div>
          </div>
          <div class="mt-3 pt-3 border-top-1 border-200">
            <div class="flex justify-content-between align-items-center">
              <span class="text-sm text-600">Stock: {{ product.stock }}</span>
              <div class="flex gap-2">
                <Button
                  icon="pi pi-eye"
                  label="View"
                  size="small"
                  outlined
                  @click="viewProduct(product.id)"
                  data-testid="view-button"
                />
                <Button
                  icon="pi pi-pencil"
                  label="Edit"
                  size="small"
                  outlined
                  @click="editProduct(product.id)"
                  data-testid="edit-button"
                />
                <Button
                  icon="pi pi-trash"
                  label="Delete"
                  size="small"
                  severity="danger"
                  outlined
                  @click="confirmDelete(product)"
                  data-testid="delete-button"
                />
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && !error && products.length === 0"
      class="flex flex-column align-items-center justify-content-center py-8"
    >
      <i class="pi pi-inbox text-6xl text-400 mb-3" />
      <p class="text-xl text-600">No products found</p>
    </div>

    <!-- Pagination -->
    <div
      v-if="!loading && products.length > 0"
      class="mt-4 flex justify-content-center"
    >
      <Paginator
        :first="(currentPage - 1) * pageSize"
        :rows="pageSize"
        :total-records="total"
        @page="onPageChange"
        data-testid="pagination"
      />
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog
      v-model:visible="showCreateDialog"
      :header="editingProduct ? 'Edit Product' : 'Create Product'"
      :modal="true"
      :style="{ width: '50vw' }"
      data-testid="product-dialog"
    >
      <p class="text-600">
        Product form will be implemented here. This is a minimal working
        example showing the architecture.
      </p>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          outlined
          @click="showCreateDialog = false"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          @click="showCreateDialog = false"
        />
      </template>
    </Dialog>

    <!-- Delete Confirmation -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Tag from "primevue/tag";
import Dialog from "primevue/dialog";
import Paginator from "primevue/paginator";
import ProgressSpinner from "primevue/progressspinner";
import Message from "primevue/message";
import ConfirmDialog from "primevue/confirmdialog";
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
  totalPages,
  fetchProducts,
  fetchCategories,
  setSelectedCategory,
  setSearchQuery,
  deleteProduct,
} = useProducts();

// Clear error function
const clearError = () => {
  // Access the store directly to clear error
  const store = useProductsStore();
  store.error = null;
};

const { searchQuery } = useSearch((query: string) => {
  setSearchQuery(query);
});

const showCreateDialog = ref(false);
const editingProduct = ref<Product | null>(null);

// Fetch categories on mount
onMounted(async () => {
  await fetchCategories();
  await fetchProducts(1, 10);
});

// Watch for category changes
const handleCategoryChange = () => {
  setSelectedCategory(selectedCategory.value);
};

// Pagination handler
const onPageChange = (event: { page: number; first: number; rows: number }) => {
  fetchProducts(event.page + 1, event.rows);
};

// Product actions
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

// Utility functions
const truncateDescription = (description: string, maxLength = 100): string => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + "...";
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  // Set a placeholder image or hide the image on error
  img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23ddd' width='300' height='200'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
};
</script>

<style scoped lang="scss">
.products-view {
  padding: 1rem 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
