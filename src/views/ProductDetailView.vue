<template>
  <div>
    <h1>Product Detail View</h1>
    <p v-if="loading">Loading product...</p>
    <div v-else-if="product">
      <p>Product ID: {{ product.id }}</p>
      <p>Product Name: {{ product.title }}</p>
      <!-- TODO: Implement product detail component -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useProducts } from "@/composables/useProducts";

const route = useRoute();
const { selectedProduct, loading, fetchProduct } = useProducts();

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
</script>
