<template>
  <div class="product-image-pricing">
    <!-- Product Image -->
    <div class="product-main-image-wrapper">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="product-main-image"
        loading="eager"
        @error="handleImageError"
      />
    </div>

    <!-- Pricing Info -->
    <div class="pricing-info">
      <div class="price-item">
        <span class="price-label">Price:</span>
        <span class="price-value">
          {{ formatPrice(product.price) }}
        </span>
      </div>
      <div class="price-item" v-if="product.discountPercentage > 0">
        <span class="price-label">Discount:</span>
        <span class="price-value"> {{ product.discountPercentage }}% </span>
      </div>
      <div class="price-item">
        <span class="price-label">SKU/ID:</span>
        <span class="price-value">
          {{ product.sku || product.id }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "@/types/product";

defineProps<{
  product: Product;
}>();

const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Crect fill='%23e2e2e2' width='256' height='256'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
};
</script>

<style scoped lang="scss">
.product-image-pricing {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }
}

.product-main-image-wrapper {
  width: 100%;
  max-width: 16rem;
  height: 16rem;
  flex-shrink: 0;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 0.375rem;
  background-color: $skeleton;
  margin: 0 auto;

  @media (min-width: 640px) {
    margin: 0;
  }
}

.product-main-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.pricing-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  font-size: 1rem;
}

.price-item {
  display: flex;
  align-items: center;
}

.price-label {
  color: $text-gray-600;
}

.price-value {
  color: $text-primary;
  font-weight: 600;
  margin-left: 0.5rem;
}
</style>
