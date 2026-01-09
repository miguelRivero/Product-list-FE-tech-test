<template>
  <div class="product-detail-view">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <p class="text-[#6b7280]">Loading product...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-12">
      <p class="text-[#ef4444]">{{ error }}</p>
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
          <span v-if="saveError" class="dialog-error-message">
            {{ saveError }}
          </span>
          <span v-else-if="saveSuccess" class="dialog-success-message">
            {{ saveSuccess }}
          </span>
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
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
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
import type { ProductFormData } from "@/types/product";

const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

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
const formData = ref<ProductFormData | null>(null);
const saveError = ref<string | null>(null);
const saveSuccess = ref<string | null>(null);

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
    saveError.value = null;
    saveSuccess.value = null;
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
  saveError.value = null;
  saveSuccess.value = null;
};

const handleFormSubmit = (data: ProductFormData) => {
  formData.value = data;
  saveError.value = null;
  saveSuccess.value = null;
};

const handleSave = async () => {
  if (!product.value) return;

  saveError.value = null;
  saveSuccess.value = null;

  // Trigger form submit first to update formData
  if (productFormRef.value) {
    productFormRef.value.submitForm();
  }

  // The submit event is synchronous, so formData should be updated now
  if (!formData.value) {
    saveError.value = "Please fill in all required fields";
    return;
  }

  try {
    // Convert category slug to category name if needed
    const categorySlug = formData.value.category;
    const category = categories.value.find((cat) => cat.slug === categorySlug);
    const categoryName = category ? category.name : categorySlug;

    // Prepare update data with category name
    const updateData: ProductFormData = {
      ...formData.value,
      category: categoryName,
    };

    await updateProduct(product.value.id, updateData);

    saveSuccess.value = "Product updated successfully";

    // Close dialog after a short delay to show success message
    setTimeout(() => {
      handleCloseEditDialog();
    }, 1000);

    // The store automatically updates selectedProduct, so the view will update reactively
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update product";
    saveError.value = errorMessage;
    console.error("Error updating product:", err);
  }
};

const handleDelete = () => {
  if (!product.value) return;

  confirm.require({
    message: `Are you sure you want to delete "${product.value.title}"?`,
    header: "Delete Confirmation",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await deleteProduct(product.value!.id);
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Product deleted successfully",
          life: 3000,
        });
        router.push("/");
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

.dialog-footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.dialog-error-message,
.dialog-success-message {
  font-size: 0.875rem;
  flex: 0 0 auto;
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
