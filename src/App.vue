<template>
  <div class="app-container min-h-screen">
    <Header />
    <main class="main-content max-w-7xl mx-auto">
      <RouterView />
    </main>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import Toast from "primevue/toast";
import Header from "@/components/Header.vue";
</script>

<style scoped lang="scss">
.app-container {
  background-color: $component-bg; // white
  color: $text-primary; // #373a39
}

.main-content {
  background-color: $component-bg; // white
}
</style>
