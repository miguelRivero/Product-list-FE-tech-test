<template>
  <div class="min-h-screen surface-ground text-color">
    <header class="surface-card shadow-1 border-bottom-1 border-200">
      <div class="mx-auto max-w-6xl px-4 py-3 flex align-items-center gap-4">
        <img src="@/assets/logo.svg" alt="Logo" class="logo" />
        <div class="flex flex-column">
          <h1 class="m-0 text-2xl font-bold">Frontend Technical Test</h1>
          <p class="m-0 text-base font-normal text-600">Miguel Rivero</p>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-4">
      <RouterView />
    </main>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import Toast from "primevue/toast";
</script>

<style scoped>
.logo {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}
</style>
