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
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import ProductDetailNavigation from "@/components/product-detail/ProductDetailNavigation.vue";
import ProductDetailAttributes from "@/components/product-detail/ProductDetailAttributes.vue";
import ProductDetailImagePricing from "@/components/product-detail/ProductDetailImagePricing.vue";
import ProductDetailDescription from "@/components/product-detail/ProductDetailDescription.vue";
import ProductDetailGallery from "@/components/product-detail/ProductDetailGallery.vue";
import ProductDetailMetadata from "@/components/product-detail/ProductDetailMetadata.vue";
import { useProducts } from "@/composables/useProducts";

const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

const { selectedProduct, loading, error, fetchProduct, deleteProduct } =
  useProducts();

const product = selectedProduct;

onMounted(async () => {
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
    router.push(`/products/${product.value.id}/edit`);
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
  padding-: 0;
  border-left: 1px solid $border-gray;
}
</style>
