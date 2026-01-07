<template>
  <div class="products-loading">
    <ProgressSpinner />
    <p class="loading-text">Loading products...</p>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from "primevue/progressspinner";
</script>

<style scoped lang="scss">
.products-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.loading-text {
  color: var(--p-text-color-secondary);
  font-size: 0.9375rem;
  margin: 0;
}
</style>

