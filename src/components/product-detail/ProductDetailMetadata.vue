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
  padding-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.metadata-item {
  display: flex;
  flex-direction: column;
}

.metadata-label {
  color: $text-gray-600;
  margin-bottom: 0.25rem;
}

@media (max-width: 1024px) {
  .product-detail-metadata {
    border-left: none;
    border-top: 1px solid $border-gray;
    padding-top: 1.5rem;
    margin-top: 1.5rem;
  }

  .metadata-content {
    border-left: none;
    padding-left: 0;
  }
}
</style>
