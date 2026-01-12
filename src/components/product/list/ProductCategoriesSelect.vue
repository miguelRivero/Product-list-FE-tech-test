<template>
  <Select
    v-model="selectedValue"
    :options="categoryOptions"
    option-label="label"
    option-value="slug"
    placeholder="Category (All)"
    filter
    filter-placeholder="Search categories..."
    class="category-select w-full max-w-xs"
    data-testid="category-select"
    aria-label="Filter products by category"
    showClear
  >
    <template #value="slotProps">
      <span v-if="slotProps.value !== null && slotProps.value !== undefined">
        {{ getCategoryLabel(slotProps.value) }}
      </span>
      <span v-else>Category (All)</span>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Select from "primevue/select";
import type { Category } from "@/types/product";

interface CategoryOption {
  label: string;
  slug: string | null;
}

const props = defineProps<{
  selectedCategory: string | null;
  categories: Category[];
}>();

const emit = defineEmits<{
  "update:selectedCategory": [value: string | null];
}>();

const categoryOptions = computed<CategoryOption[]>(() => {
  const allOption: CategoryOption = { label: "Category (All)", slug: null };
  const categoryOptions: CategoryOption[] = props.categories.map(cat => ({
    label: cat.name,
    slug: cat.slug,
  }));
  return [allOption, ...categoryOptions];
});

const selectedValue = computed({
  get: () => props.selectedCategory,
  set: value => emit("update:selectedCategory", value),
});

const getCategoryLabel = (slug: string | null): string => {
  if (slug === null) {
    return "Category (All)";
  }
  const category = props.categories.find(cat => cat.slug === slug);
  return category?.name || "Category (All)";
};
</script>
