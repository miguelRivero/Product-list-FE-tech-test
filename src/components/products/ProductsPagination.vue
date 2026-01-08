<template>
  <Paginator
    :first="(currentPage - 1) * pageSize"
    :rows="pageSize"
    :total-records="total"
    @page="$emit('page-change', $event)"
    data-testid="pagination"
  />
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
