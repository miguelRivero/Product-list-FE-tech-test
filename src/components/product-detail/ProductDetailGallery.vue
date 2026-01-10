<template>
  <div
    class="product-detail-gallery"
    v-if="product.images && product.images.length > 0"
  >
    <div class="gallery-images flex gap-4">
      <div
        v-for="(image, index) in product.images.slice(0, 3)"
        :key="index"
        class="gallery-image-wrapper w-24 h-24 flex-shrink-0"
      >
        <img
          :src="image"
          :alt="`${product.title} - Image ${index + 1}`"
          class="gallery-image w-full h-full rounded-md object-cover"
          loading="lazy"
          @error="handleImageError"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "@/types/product";

defineProps<{
  product: Product;
}>();

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect fill='%23e2e2e2' width='96' height='96'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='10' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
};
</script>

<style scoped lang="scss">
.product-detail-gallery {
  padding-top: 1.5rem;
}

.gallery-image-wrapper {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 0.375rem;
  background-color: $skeleton;
}

.gallery-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>
