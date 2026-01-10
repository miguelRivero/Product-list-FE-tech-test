<template>
  <div class="product-detail-navigation shadow py-2">
    <div
      class="product-detail-navigation-content px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl py-2"
    >
      <router-link to="/" class="back-link" aria-label="Back to products list">
        <i class="pi pi-arrow-left" aria-hidden="true"></i>
        <span>Back</span>
      </router-link>
      <div class="product-actions">
        <Button
          label="Edit"
          icon="pi pi-pencil"
          class="action-button"
          @click="$emit('edit')"
          aria-label="Edit product"
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          class="action-button"
          @click="$emit('delete')"
          aria-label="Delete product"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";

defineEmits<{
  edit: [];
  delete: [];
}>();
</script>

<style scoped lang="scss">
.product-detail-navigation-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: $text-gray-600;
  transition: color 0.2s;

  &:hover {
    color: $text-primary;
  }
}

.product-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-button {
  padding: 0.625rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  border: 1px solid $border-gray;
  font-weight: 500;
  background-color: $component-bg;
  color: $text-primary;

  &:hover {
    background-color: $hover-bg;
  }
}
</style>
