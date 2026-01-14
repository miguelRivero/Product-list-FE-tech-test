<template>
  <div class="products-list-info">
    <span class="info-text">
      Showing {{ start }}-{{ end }} of {{ total }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  currentPage: number;
  pageSize: number;
  total: number;
}>();

const start = computed(() => {
  if (props.total === 0) return 0;
  return (props.currentPage - 1) * props.pageSize + 1;
});

const end = computed(() => {
  const calculatedEnd = props.currentPage * props.pageSize;
  return calculatedEnd > props.total ? props.total : calculatedEnd;
});
</script>
