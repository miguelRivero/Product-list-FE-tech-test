<template>
  <div class="product-actions flex items-center gap-3">
    <button
      class="action-icon-button p-2 rounded transition-colors"
      data-testid="view-button"
      aria-label="View product"
      @click="$emit('view', productId)"
    >
      <i class="pi pi-eye action-icon" aria-hidden="true" />
    </button>
    <button
      class="action-icon-button p-2 rounded transition-colors"
      data-testid="edit-button"
      aria-label="Edit product"
      @click="$emit('edit', productId)"
    >
      <i class="pi pi-pencil action-icon" aria-hidden="true" />
    </button>
    <button
      class="action-icon-button p-2 rounded transition-colors"
      data-testid="delete-button"
      aria-label="Delete product"
      @click="$emit('delete', product)"
    >
      <i class="pi pi-trash action-icon" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "@/types/product";

defineProps<{
  productId: number;
  product: Product;
}>();

defineEmits<{
  view: [id: number];
  edit: [id: number];
  delete: [product: Product];
}>();
</script>

<style scoped lang="scss">
.action-icon-button {
  cursor: pointer;
  &:hover {
    background-color: $background;
  }
}

.action-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: $text-gray-600;
}
</style>
