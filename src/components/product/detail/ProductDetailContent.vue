<template>
  <div class="product-detail-layout px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
    <!-- Left Column: Main Content -->
    <div class="product-detail-main-content pt-8">
      <ProductDetailAttributes :product="product" />
      <ProductDetailImagePricing :product="product" />
      <ProductDetailDescription :product="product" />
      <ProductDetailGallery :product="product" />
    </div>

    <!-- Right Column: Metadata Sidebar -->
    <div class="product-detail-metadata-sidebar pt-8">
      <ProductDetailMetadata :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductDetailAttributes from "./ProductDetailAttributes.vue";
import ProductDetailImagePricing from "./ProductDetailImagePricing.vue";
import ProductDetailDescription from "./ProductDetailDescription.vue";
import ProductDetailGallery from "./ProductDetailGallery.vue";
import ProductDetailMetadata from "./ProductDetailMetadata.vue";
import type { Product } from "@/types/product";

defineProps<{
  product: Product;
}>();
</script>

<style scoped lang="scss">
.product-detail-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
}

.product-detail-main-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0; // Prevent overflow
}

.product-detail-metadata-sidebar {
  @media (min-width: 1024px) {
    border-left: 1px solid $border-gray;
    padding-left: 1.5rem;
  }

  @media (max-width: 1023px) {
    border-top: 1px solid $border-gray;
    padding-top: 1.5rem;
    margin-top: 1.5rem;
  }
}
</style>
