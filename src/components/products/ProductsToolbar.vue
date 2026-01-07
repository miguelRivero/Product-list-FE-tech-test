<template>
  <div
    class="flex justify-between items-center mb-6 gap-4 px-4 sm:px-6 lg:px-8"
  >
    <!-- Categories Container with fixed "All" button -->
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <!-- Fixed "All" button -->
      <button
        role="tab"
        :aria-selected="selectedCategory === null"
        :tabindex="selectedCategory === null ? 0 : -1"
        class="category-button flex-shrink-0 px-4 py-2 text-sm rounded-md font-normal whitespace-nowrap outline-none"
        :class="{
          'category-button-active': selectedCategory === null,
        }"
        @click="handleCategoryClick(null)"
        @keydown.enter.prevent="handleCategoryClick(null)"
        @keydown.space.prevent="handleCategoryClick(null)"
      >
        Category (All)
      </button>

      <!-- Scrollable categories carousel -->
      <div
        ref="scrollContainer"
        class="categories-carousel flex gap-3 overflow-x-auto overflow-y-hidden flex-1 min-w-0 flex-nowrap"
        role="tablist"
        aria-label="Product categories"
        @keydown="handleKeydown"
      >
        <button
          v-for="category in categories"
          :key="category.slug"
          role="tab"
          :aria-selected="selectedCategory === category.slug"
          :tabindex="selectedCategory === category.slug ? 0 : -1"
          :aria-label="`Filter by ${category.name} category`"
          class="category-button px-4 py-2 text-sm rounded-md font-normal whitespace-nowrap flex-shrink-0 outline-none"
          :class="{
            'category-button-active': selectedCategory === category.slug,
          }"
          @click="handleCategoryClick(category.slug)"
          @keydown.enter.prevent="handleCategoryClick(category.slug)"
          @keydown.space.prevent="handleCategoryClick(category.slug)"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Add New Button -->
    <Button
      label="Add new"
      icon="pi pi-plus"
      class="px-6 py-2.5 text-base rounded-lg border border-[#e2e2e2] font-medium bg-white text-[#373a39] hover:bg-gray-50 flex-shrink-0"
      @click="$emit('add-product')"
      data-testid="add-product-button"
      aria-label="Add new product"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import Button from "primevue/button";
import type { Category } from "@/types/product";

const props = defineProps<{
  selectedCategory: string | null;
  categories: Category[];
}>();

const emit = defineEmits<{
  "update:selectedCategory": [value: string | null];
  "add-product": [];
}>();

const scrollContainer = ref<HTMLElement | null>(null);

const handleCategoryClick = (slug: string | null) => {
  emit("update:selectedCategory", slug);
  if (slug !== null) {
    nextTick(() => {
      scrollToSelected();
    });
  }
};

const scrollToSelected = () => {
  if (!scrollContainer.value) return;

  const activeButton = scrollContainer.value.querySelector(
    ".category-button-active"
  ) as HTMLElement;

  if (activeButton) {
    activeButton.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!scrollContainer.value) return;

  const buttons = Array.from(
    scrollContainer.value.querySelectorAll<HTMLElement>(".category-button")
  );
  const currentIndex = buttons.findIndex(
    (btn) => btn === document.activeElement
  );

  if (currentIndex === -1) return;

  let targetIndex = currentIndex;

  switch (event.key) {
    case "ArrowLeft":
      event.preventDefault();
      targetIndex = Math.max(0, currentIndex - 1);
      break;
    case "ArrowRight":
      event.preventDefault();
      targetIndex = Math.min(buttons.length - 1, currentIndex + 1);
      break;
    case "Home":
      event.preventDefault();
      targetIndex = 0;
      break;
    case "End":
      event.preventDefault();
      targetIndex = buttons.length - 1;
      break;
    default:
      return;
  }

  if (targetIndex !== currentIndex) {
    buttons[targetIndex].focus();
    const categorySlug = props.categories[targetIndex]?.slug || null;
    emit("update:selectedCategory", categorySlug);
  }
};

watch(
  () => props.selectedCategory,
  (newCategory) => {
    if (newCategory !== null) {
      nextTick(() => {
        scrollToSelected();
      });
    }
  }
);
</script>

<style scoped lang="scss">
.categories-carousel {
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x proximity;

  // Custom scrollbar styling
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
  }
}

.category-button {
  border: 1px solid $border-gray;
  background-color: $component-bg;
  color: $text-primary;
  cursor: pointer;
  transition: all 0.2s;
  scroll-snap-align: start;

  &:hover {
    background-color: darken($component-bg, 2%);
    border-color: darken($border-gray, 10%);
  }

  &:focus-visible {
    outline: 2px solid $primary;
    outline-offset: 2px;
  }

  &.category-button-active {
    background-color: $primary;
    color: white;
    border-color: $primary;
  }
}
</style>
