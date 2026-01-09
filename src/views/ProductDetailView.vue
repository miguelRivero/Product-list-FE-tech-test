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

      <!-- Main Content Grid -->
      <div class="product-main-grid px-4 sm:px-6 lg:px-8">
        <!-- Left Column: Main Content -->
        <div class="product-main-content pt-8">
          <ProductDetailAttributes :product="product" />
          <ProductDetailImagePricing :product="product" />
          <ProductDetailDescription :product="product" />
          <ProductDetailGallery :product="product" />
        </div>

        <!-- Right Column: Metadata Sidebar -->
        <div class="product-metadata-sidebar pt-8">
          <ProductDetailMetadata :product="product" />
        </div>
      </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import ProductDetailNavigation from "@/components/product-detail/ProductDetailNavigation.vue";
import ProductDetailAttributes from "@/components/product-detail/ProductDetailAttributes.vue";
import ProductDetailImagePricing from "@/components/product-detail/ProductDetailImagePricing.vue";
import ProductDetailDescription from "@/components/product-detail/ProductDetailDescription.vue";
import ProductDetailGallery from "@/components/product-detail/ProductDetailGallery.vue";
import ProductDetailMetadata from "@/components/product-detail/ProductDetailMetadata.vue";
import ProductForm from "@/components/product/ProductForm.vue";
import { useProducts } from "@/composables/useProducts";
import { useDialog } from "@/composables/useDialog";
import { useCategory } from "@/composables/useCategory";
import { useProductActions } from "@/composables/useProductActions";
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
const { confirmDelete: confirmProductDelete } = useProductActions();

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

  confirmProductDelete(product.value, deleteProduct, () => {
    router.push("/");
  });
};
</script>

<style scoped lang="scss">
.product-main-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
}

.product-main-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-metadata-sidebar {
  border-left: 1px solid $border-gray;
}

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
