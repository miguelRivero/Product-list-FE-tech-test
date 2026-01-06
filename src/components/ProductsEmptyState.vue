<template>
  <div class="products-empty-state">
    <div class="empty-icon">
      <i class="pi pi-inbox" />
    </div>
    <h3 class="empty-title">No products found</h3>
    <p class="empty-message">
      Try adjusting your search or filter criteria
    </p>
  </div>
</template>

<script setup lang="ts">
// Empty state component
</script>

<style scoped lang="scss">
.products-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  color: var(--p-text-color-secondary);
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--p-text-color);
  margin: 0 0 0.5rem 0;
}

.empty-message {
  font-size: 1rem;
  color: var(--p-text-color-secondary);
  margin: 0;
}
</style>

