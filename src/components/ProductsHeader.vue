<template>
  <header class="products-header">
    <!-- Logo and App Info Section -->
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4"
    >
      <img src="@/assets/logo.svg" alt="Logo" class="w-16 h-16 flex-shrink-0" />
      <div class="flex flex-col">
        <h1
          class="header-title m-0 text-2xl sm:text-3xl font-bold leading-tight"
        >
          Frontend Technical Test
        </h1>
        <p class="header-subtitle m-0 text-sm font-normal">Miguel Rivero</p>
      </div>
    </div>

    <!-- Page Title Section -->
    <div class="px-4 sm:px-6 lg:px-8 pt-0 pb-6">
      <h2
        class="page-title max-w-7xl mx-auto m-0 text-4xl sm:text-5xl font-bold"
      >
        Products
      </h2>
    </div>
  </header>
</template>

<script setup lang="ts">
// ProductsHeader component
</script>

<style scoped lang="scss">
.products-header {
  background-color: $background; // #f7f7f7
  border-bottom: 1px solid $border-gray; // #e2e2e2
}

.header-title {
  color: $text-primary; // #373a39
}

.header-subtitle {
  color: $text-gray-600; // #6b7280
}

.page-title {
  color: $text-primary; // #373a39
}
</style>
