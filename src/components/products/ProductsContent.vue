<template>
  <div class="products-content px-4 sm:px-6 lg:px-8">
    <ProductsLoadingState v-if="loading" />

    <ProductsErrorState
      v-if="error && !loading"
      :error="error"
      @close="$emit('clear-error')"
    />

    <ProductsList
      v-if="!loading && !error && products.length > 0"
      :products="products"
      @view="$emit('view', $event)"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />

    <ProductsEmptyState v-if="!loading && !error && products.length === 0" />

    <!-- Create/Edit Dialog -->
    <Dialog
      :visible="showCreateDialog"
      :header="editingProduct ? 'Edit Product' : 'Add new'"
      :modal="true"
      :style="{ width: '50vw' }"
      class="product-dialog"
      data-testid="product-dialog"
      @update:visible="handleDialogClose"
    >
      <ProductForm
        ref="productFormRef"
        :product="editingProduct"
        :categories="categories"
        @submit="handleFormSubmit"
      />
      <template #footer>
        <Button
          label="Cancel"
          class="dialog-button dialog-button-cancel"
          @click="handleCloseDialog"
        />
        <Button
          label="Save"
          class="dialog-button dialog-button-save"
          @click="handleSave"
        />
      </template>
    </Dialog>

    <!-- Delete Confirmation -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import ConfirmDialog from "primevue/confirmdialog";
import ProductsLoadingState from "./ProductsLoadingState.vue";
import ProductsErrorState from "./ProductsErrorState.vue";
import ProductsList from "./ProductsList.vue";
import ProductsEmptyState from "./ProductsEmptyState.vue";
import ProductForm from "@/components/product/ProductForm.vue";
import type { Product, Category, ProductFormData } from "@/types/product";

const props = defineProps<{
  loading: boolean;
  error: string | null;
  products: Product[];
  showCreateDialog: boolean;
  editingProduct: Product | null;
  categories: Category[];
}>();

const emit = defineEmits<{
  "clear-error": [];
  view: [id: number];
  edit: [id: number];
  delete: [product: Product];
  "close-dialog": [];
  "update:showCreateDialog": [value: boolean];
  "save-product": [data: ProductFormData, productId?: number];
}>();

const productFormRef = ref<InstanceType<typeof ProductForm> | null>(null);
const formData = ref<ProductFormData | null>(null);

const handleFormSubmit = (data: ProductFormData) => {
  formData.value = data;
};

const handleSave = () => {
  // Trigger form submit
  if (productFormRef.value) {
    productFormRef.value.submitForm();
  }
};

const handleDialogClose = (visible: boolean) => {
  if (!visible) {
    handleCloseDialog();
  }
};

const handleCloseDialog = () => {
  formData.value = null;
  emit("close-dialog");
};
</script>
