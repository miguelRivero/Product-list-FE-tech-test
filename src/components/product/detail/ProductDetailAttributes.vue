<template>
  <div class="product-detail-attributes">
    <div class="attribute-item">
      <span class="attribute-label">Brand:</span>
      <span class="attribute-value">
        {{ product.brand || "N/A" }}
      </span>
    </div>
    <div class="attribute-item">
      <span class="attribute-label">Category:</span>
      <span class="attribute-value">
        {{ capitalizeCategory(product.category) }}
      </span>
    </div>
    <div class="attribute-item">
      <span class="attribute-label">Stock:</span>
      <span class="attribute-value">
        {{ product.stock }}
      </span>
    </div>
    <div class="attribute-item">
      <span class="attribute-label">Rating:</span>
      <div class="rating-stars">
        <i
          v-for="i in 5"
          :key="i"
          class="pi rating-star"
          :class="{
            'pi-star-fill': i <= Math.round(product.rating),
            'pi-star': i > Math.round(product.rating),
          }"
        ></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "@/types/product";

defineProps<{
  product: Product;
}>();

const capitalizeCategory = (category: string): string => {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
</script>

<style scoped lang="scss">
.product-detail-attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-bottom: 1rem;
  font-size: 1rem;
}

.attribute-item {
  display: flex;
  align-items: center;
}

.attribute-label {
  color: $text-gray-600;
}

.attribute-value {
  color: $text-primary;
  font-weight: 500;
  margin-left: 0.5rem;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
}

.rating-star {
  font-size: 1rem;
  color: $text-gray-600;

  &.pi-star-fill {
    color: #fbbf24;
  }
}
</style>
