<template>
  <div class="mb-6 py-1 shadow">
    <div class="relative w-full">
      <i
        class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 z-10 w-5 h-5 search-icon"
      />
      <InputText
        :model-value="searchQuery"
        placeholder="Search products..."
        class="search-input w-full pl-11 pr-4 py-3 text-base rounded-lg border shadow-none"
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
