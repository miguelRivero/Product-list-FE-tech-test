<template>
  <Paginator
    :first="(currentPage - 1) * pageSize"
    :rows="pageSize"
    :total-records="total"
    :rows-per-page-options="[]"
    :page-link-size="pageLinkSize"
    :template="templateConfig"
    class="products-pagination"
    @page="$emit('page-change', $event)"
    data-testid="pagination"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import Paginator from "primevue/paginator";

const props = defineProps<{
  currentPage: number;
  pageSize: number;
  total: number;
}>();

defineEmits<{
  "page-change": [event: { page: number; first: number; rows: number }];
}>();

const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 767;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

const pageLinkSize = computed(() => {
  return isMobile.value ? 3 : undefined;
});

const templateConfig = computed(() => {
  return {
    "767px": "PrevPageLink PageLinks NextPageLink",
    default: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink",
  };
});
</script>

<style scoped lang="scss">
:deep(.products-pagination) {
  @media (max-width: 767px) {
    padding: 0.5rem 0;

    .p-paginator-element {
      padding: 0.375rem 0.5rem;
      font-size: 0.875rem;
      min-width: 2rem;
      height: 2rem;
      margin: 0 0.125rem;
    }
  }
}
</style>
