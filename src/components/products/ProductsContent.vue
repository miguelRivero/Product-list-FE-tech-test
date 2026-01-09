<template>
  <div class="products-content">
    <ProductsLoadingState v-if="loading" />

    <ProductsErrorState
      v-if="error && !loading"
      :error="error"
      @close="$emit('clear-error')"
    />

    <ProductsList
      v-if="!loading && !error && products.length > 0"
      :products="products"
      :categories="categories"
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
        <div class="dialog-footer-content">
          <div class="dialog-message-container">
            <span v-if="saveError" class="dialog-error-message">
              {{ saveError }}
            </span>
            <span v-else-if="saveSuccess" class="dialog-success-message">
              {{ saveSuccess }}
            </span>
          </div>
          <div class="dialog-footer-buttons">
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
          </div>
        </div>
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
import { useDialog } from "@/composables/useDialog";
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
const dialogState = useDialog();
const {
  formData,
  error: saveError,
  success: saveSuccess,
  setError,
  setSuccess,
  clearMessages,
} = dialogState;

const handleFormSubmit = (data: ProductFormData) => {
  formData.value = data;
  clearMessages();
};

const handleSave = () => {
  clearMessages();

  // Trigger form submit to update formData
  if (productFormRef.value) {
    productFormRef.value.submitForm();
  }

  // Emit save event with form data
  if (formData.value) {
    emit("save-product", formData.value, props.editingProduct?.id);
  } else {
    setError("Please fill in all required fields");
  }
};

const handleDialogClose = (visible: boolean) => {
  if (!visible) {
    handleCloseDialog();
  }
};

const handleCloseDialog = () => {
  formData.value = null;
  clearMessages();
  emit("close-dialog");
};

// Expose methods to parent for setting success/error messages
defineExpose({
  setSaveError: setError,
  setSaveSuccess: setSuccess,
  clearMessages,
});
</script>

<style scoped lang="scss">
.dialog-footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.dialog-message-container {
  flex: 1;
  min-width: 0;
}

.dialog-error-message,
.dialog-success-message {
  font-size: 0.875rem;
}

.dialog-error-message {
  color: $danger;
}

.dialog-success-message {
  color: $success;
}

.dialog-footer-buttons {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}
</style>
