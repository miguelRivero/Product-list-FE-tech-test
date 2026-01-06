<template>
  <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
    <div class="flex items-center gap-3 flex-wrap">
      <span class="text-base text-[#373a39] font-medium mr-2"
        >Category (All)</span
      >
      <div class="flex gap-3 flex-wrap">
        <button
          class="px-4 py-2 text-sm rounded-md border border-[#e2e2e2] bg-white text-[#373a39] cursor-pointer transition-all font-normal hover:bg-gray-50 hover:border-gray-300"
          :class="{
            'bg-[#3b82f6] text-white border-[#3b82f6]':
              selectedCategory === null,
          }"
          @click="$emit('update:selectedCategory', null)"
        >
          All
        </button>
        <button
          v-for="category in categories"
          :key="category"
          class="px-4 py-2 text-sm rounded-md border border-[#e2e2e2] bg-white text-[#373a39] cursor-pointer transition-all font-normal hover:bg-gray-50 hover:border-gray-300"
          :class="{
            'bg-[#3b82f6] text-white border-[#3b82f6]':
              selectedCategory === category,
          }"
          @click="$emit('update:selectedCategory', category)"
        >
          {{ category }}
        </button>
      </div>
    </div>
    <Button
      label="Add new"
      icon="pi pi-plus"
      class="px-6 py-2.5 text-base rounded-lg border border-[#e2e2e2] font-medium bg-white text-[#373a39] hover:bg-gray-50"
      @click="$emit('add-product')"
      data-testid="add-product-button"
    />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";

defineProps<{
  selectedCategory: string | null;
  categories: string[];
}>();

defineEmits<{
  "update:selectedCategory": [value: string | null];
  "add-product": [];
}>();
</script>
