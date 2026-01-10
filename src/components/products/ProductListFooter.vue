<template>
  <div class="product-list-footer mb-8">
    <ProductsListInfo
      class="product-list-info"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
    />
    <ProductsPagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @page-change="$emit('page-change', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import ProductsListInfo from "./ProductsListInfo.vue";
import ProductsPagination from "./ProductsPagination.vue";

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
.product-list-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  background-color: $component-bg;
  border-radius: 0.5rem;
}

.product-list-info {
  @media (max-width: 767px) {
    display: none;
  }
}
</style>
