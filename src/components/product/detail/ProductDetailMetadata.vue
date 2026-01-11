<template>
  <div class="product-detail-metadata">
    <div class="metadata-content">
      <div class="metadata-item">
        <div class="metadata-label">Created At</div>
        <div class="metadata-value">
          {{ formatDate(product.meta?.createdAt) }}
        </div>
      </div>
      <div class="metadata-item">
        <div class="metadata-label">Updated At</div>
        <div class="metadata-value">
          {{ formatDate(product.meta?.updatedAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "@/types/product";

defineProps<{
  product: Product;
}>();

const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
};
</script>

<style scoped lang="scss">
.product-detail-metadata {
  padding-top: 0;
}

.metadata-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    padding-left: 0; // Padding is handled by parent sidebar
  }
}

.metadata-item {
  display: flex;
  flex-direction: column;
}

.metadata-label {
  color: $text-gray-600;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.metadata-value {
  color: $text-primary;
  font-size: 1rem;
}
</style>
