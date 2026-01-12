<template>
  <header class="products-header">
    <!-- Logo and App Info Section -->
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4"
    >
      <img src="@/assets/logo.svg" alt="Logo" class="w-16 h-16 flex-shrink-0" />
      <div class="flex flex-col">
        <h1
          class="header-title m-0 text-2xl sm:text-3xl font-bold leading-tight"
        >
          Frontend Technical Test
        </h1>
        <p class="header-subtitle m-0 text-sm font-normal">Miguel Rivero</p>
      </div>
    </div>

    <!-- Page Title Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-6">
      <h2
        class="page-title max-w-7xl mx-auto m-0 text-4xl sm:text-5xl font-bold"
      >
        {{ pageTitle }}
      </h2>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useProductsStore } from "@/stores/products";

const route = useRoute();
const store = useProductsStore();

const pageTitle = computed(() => {
  // If we're on product detail page
  if (route.name === "product-detail" && route.params.id) {
    const productId = Number(route.params.id);
    const product = store.selectedProduct;

    // If product is already loaded and matches the ID, use it
    if (product && product.id === productId) {
      return product.title;
    }

    // Otherwise, try to find it in the products list
    const productFromList = store.products.find(p => p.id === productId);
    if (productFromList) {
      return productFromList.title;
    }

    // Fallback: show "Product" while loading
    return "Product";
  }

  // Default: Products list
  return "Products";
});
</script>

<style scoped lang="scss">
.products-header {
  background-color: $background;
}

.header-title {
  color: $text-primary;
}

.header-subtitle {
  color: $text-gray-600;
}

.page-title {
  color: $text-primary;
}
</style>
