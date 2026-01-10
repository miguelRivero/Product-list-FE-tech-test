<template>
  <div class="product-detail-view">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <p class="loading-text">Loading product...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-12">
      <p class="error-text">{{ error }}</p>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="product-detail-content">
      <ProductDetailNavigation @edit="handleEdit" @delete="handleDelete" />

      <ProductDetailContent :product="product" />
    </div>

    <!-- Edit Dialog -->
    <Dialog
      :visible="showEditDialog"
      header="Edit Product"
      :modal="true"
      :style="{ width: '50vw' }"
      class="product-dialog"
      data-testid="product-edit-dialog"
      @update:visible="handleDialogClose"
    >
      <ProductForm
        ref="productFormRef"
        :product="product"
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
              @click="handleCloseEditDialog"
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

    <!-- Delete Confirmation Dialog -->
    <DeleteConfirmationDialog
      v-if="product"
      :visible="showDeleteDialog"
      :product-title="product.title"
      :is-deleting="isDeleting"
      :error-message="deleteError"
      :success-message="deleteSuccess"
      @update:visible="showDeleteDialog = $event"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import ProductDetailNavigation from "@/components/product-detail/ProductDetailNavigation.vue";
import ProductDetailContent from "@/components/product-detail/ProductDetailContent.vue";
import ProductForm from "@/components/product/ProductForm.vue";
import DeleteConfirmationDialog from "@/components/product/DeleteConfirmationDialog.vue";
import { useProducts } from "@/composables/useProducts";
import { useDialog } from "@/composables/useDialog";
import { useCategory } from "@/composables/useCategory";
import type { ProductFormData } from "@/types/product";

const route = useRoute();
const router = useRouter();

const {
  selectedProduct,
  loading,
  error,
  categories,
  fetchProduct,
  deleteProduct,
  updateProduct,
  fetchCategories,
} = useProducts();

const product = selectedProduct;
const showEditDialog = ref(false);
const productFormRef = ref<InstanceType<typeof ProductForm> | null>(null);
const dialogState = useDialog();
const {
  formData,
  error: saveError,
  success: saveSuccess,
  setError,
  setSuccess,
  clearMessages,
  handleDialogClose: dialogCloseHandler,
} = dialogState;

const { slugToName } = useCategory(categories);

// Delete dialog state
const showDeleteDialog = ref(false);
const isDeleting = ref(false);
const deleteError = ref<string | null>(null);
const deleteSuccess = ref<string | null>(null);

onMounted(async () => {
  await fetchCategories();
  const productId = Number(route.params.id);
  if (productId) {
    await fetchProduct(productId);
  }
});

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await fetchProduct(Number(newId));
    }
  }
);

const handleEdit = () => {
  if (product.value) {
    showEditDialog.value = true;
    clearMessages();
  }
};

const handleDialogClose = (visible: boolean) => {
  if (!visible) {
    handleCloseEditDialog();
  }
};

const handleCloseEditDialog = () => {
  showEditDialog.value = false;
  formData.value = null;
  clearMessages();
};

const handleFormSubmit = (data: ProductFormData) => {
  formData.value = data;
  clearMessages();
};

const handleSave = async () => {
  if (!product.value) return;

  clearMessages();

  // Trigger form submit first to update formData
  if (productFormRef.value) {
    productFormRef.value.submitForm();
  }

  // The submit event is synchronous, so formData should be updated now
  if (!formData.value) {
    setError("Please fill in all required fields");
    return;
  }

  try {
    // Convert category slug to category name if needed
    const categorySlug = formData.value.category;
    const categoryName = slugToName(categorySlug);

    // Prepare update data with category name
    const updateData: ProductFormData = {
      ...formData.value,
      category: categoryName,
    };

    await updateProduct(product.value.id, updateData);

    setSuccess("Product updated successfully");

    // Close dialog after a short delay to show success message
    setTimeout(() => {
      handleCloseEditDialog();
    }, 1000);

    // The store automatically updates selectedProduct, so the view will update reactively
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update product";
    setError(errorMessage);
    console.error("Error updating product:", err);
  }
};

const handleDelete = () => {
  if (!product.value) return;
  deleteError.value = null;
  deleteSuccess.value = null;
  showDeleteDialog.value = true;
};

const handleDeleteConfirm = async () => {
  if (!product.value) return;

  isDeleting.value = true;
  deleteError.value = null;
  deleteSuccess.value = null;

  try {
    await deleteProduct(product.value.id);
    deleteSuccess.value = "Product deleted successfully";

    // Navigate to home after successful delete
    // The store already has the updated list (optimistic update)
    setTimeout(() => {
      router.push("/");
    }, 1000);
  } catch (err) {
    deleteError.value =
      err instanceof Error ? err.message : "Failed to delete product";
  } finally {
    isDeleting.value = false;
  }
};

const handleDeleteCancel = () => {
  deleteError.value = null;
  deleteSuccess.value = null;
};
</script>

<style scoped lang="scss">
.loading-text {
  color: $text-gray-600;
}

.error-text {
  color: $danger;
}

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
  margin-left: auto;
}
</style>
