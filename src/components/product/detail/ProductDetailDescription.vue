<template>
  <div class="product-detail-description">
    <h3 class="description-heading">Description:</h3>
    <p class="description-text">
      {{ product.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "@/types/product";

defineProps<{
  product: Product;
}>();
</script>

<style scoped lang="scss">
.description-heading {
  color: $text-primary;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.description-text {
  color: $text-gray-600;
  line-height: 1.625;
}
</style>
