<template>
  <div class="mb-6">
    <div class="relative w-full max-w-md">
      <i
        class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-[#6b7280]"
      />
      <InputText
        :model-value="searchQuery"
        placeholder="Search products..."
        class="w-full pl-11 pr-4 py-3 text-base rounded-lg border border-[#ffffff] bg-white text-[#373a39] focus:outline-none shadow-none"
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
