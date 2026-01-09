<template>
  <div class="app-container min-h-screen">
    <Header />
    <main class="main-content">
      <RouterView />
    </main>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import Toast from "primevue/toast";
import Header from "@/components/layout/Header.vue";
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
