<template>
  <div class="products-search mb-6 shadow w-full">
    <div class="relative px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl py-2">
      <i
        class="pi pi-search absolute top-1/2 -translate-y-1/2 z-10 w-5 h-5 search-icon"
      />
      <InputText
        :model-value="searchQuery"
        placeholder="Search products..."
        class="search-input w-full pl-7 pr-4 py-3 text-base rounded-lg border shadow-none"
        data-testid="search-input"
        @update:model-value="$emit('update:searchQuery', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";

defineProps<{
  searchQuery: string;
}>();

defineEmits<{
  "update:searchQuery": [value: string];
}>();
</script>

<style scoped lang="scss">
.search-icon {
  color: $text-gray-600;
}

.search-input {
  border-color: $component-bg;
  background-color: $component-bg;
  color: $text-primary;

  &:focus {
    outline: none;
  }
}
</style>
