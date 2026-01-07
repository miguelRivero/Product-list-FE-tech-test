<template>
  <div class="products-pagination">
    <Paginator
      :first="(currentPage - 1) * pageSize"
      :rows="pageSize"
      :total-records="total"
      @page="$emit('page-change', $event)"
      data-testid="pagination"
    />
  </div>
</template>

<script setup lang="ts">
import Paginator from "primevue/paginator";

defineProps<{
  currentPage: number;
  pageSize: number;
  total: number;
}>();

defineEmits<{
  "page-change": [event: { page: number; first: number; rows: number }];
}>();
</script>

<style scoped lang="scss">
.products-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 1.5rem; // px-6 py-4
  margin-top: 1.5rem;
  background-color: $component-bg;
  border-radius: 0.5rem;
  font-size: 0.875rem; // text-sm (14px)
  color: $text-gray-600;
  gap: 0.5rem; // gap-2
}
</style>

