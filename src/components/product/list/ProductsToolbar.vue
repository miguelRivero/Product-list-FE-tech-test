<template>
  <div class="flex justify-between items-center mb-6 gap-4">
    <!-- Category Dropdown -->
    <ProductCategoriesSelect
      :selected-category="selectedCategory"
      :categories="categories"
      @update:selected-category="$emit('update:selectedCategory', $event)"
    />

    <!-- Add New Button -->
    <Button
      label="Add new"
      icon="pi pi-plus"
      class="add-product-button flex-shrink-0"
      @click="$emit('add-product')"
      data-testid="add-product-button"
      aria-label="Add new product"
    />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import ProductCategoriesSelect from "./ProductCategoriesSelect.vue";
import type { Category } from "@/types/product";

defineProps<{
  selectedCategory: string | null;
  categories: Category[];
}>();

defineEmits<{
  "update:selectedCategory": [value: string | null];
  "add-product": [];
}>();
</script>

<style scoped lang="scss">
.add-product-button {
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
