<template>
  <div class="products-table-wrapper">
    <div class="products-table-container rounded-xl border">
      <table
        class="products-table w-full border-collapse"
        data-testid="products-table"
      >
        <thead>
          <tr class="table-header-row">
            <th class="table-header-cell"></th>
            <th class="table-header-cell">Title</th>
            <th class="table-header-cell">Category</th>
            <th class="table-header-cell">Price</th>
            <th class="table-header-cell">Stock</th>
            <th class="table-header-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in products"
            :key="product.id"
            class="product-row transition-colors"
            data-testid="product-row"
          >
            <td class="product-image-cell px-6 py-4 align-middle">
              <div class="product-image-wrapper w-16 h-16 flex-shrink-0">
                <img
                  :src="product.thumbnail"
                  :alt="product.title"
                  class="product-image w-full h-full rounded-md object-cover"
                  loading="lazy"
                  @error="handleImageError"
                />
              </div>
            </td>
            <td class="product-title-cell px-6 py-4 align-middle min-w-[200px]">
              <span class="product-title-text">
                {{ product.title }}
              </span>
            </td>
            <td
              class="product-category-cell px-6 py-4 align-middle min-w-[120px]"
            >
              <span class="product-category-text">
                {{ capitalizeCategory(product.category) }}
              </span>
            </td>
            <td class="product-price-cell px-6 py-4 align-middle min-w-[120px]">
              <span class="product-price-text">
                ${{ product.price.toFixed(2) }}
              </span>
            </td>
            <td class="product-stock-cell px-6 py-4 align-middle min-w-[120px]">
              <span class="product-stock-text">
                {{ product.stock }}
              </span>
            </td>
            <td class="product-actions-cell px-6 py-4 align-middle w-[150px]">
              <ProductListActions
                :product-id="product.id"
                :product="product"
                @view="$emit('view', $event)"
                @edit="$emit('edit', $event)"
                @delete="$emit('delete', $event)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Ref } from "vue";
import type { Product, Category } from "@/types/product";
import ProductListActions from "./ProductListActions.vue";
import { useImageError } from "@/composables/useImageError";
import { useCategory } from "@/composables/useCategory";

const props = defineProps<{
  products: Product[];
  categories?: Category[];
}>();

defineEmits<{
  view: [id: number];
  edit: [id: number];
  delete: [product: Product];
}>();

const { handleImageError } = useImageError();
const categoriesRef = computed(() => props.categories || []);
const { capitalizeCategory } = useCategory(categoriesRef as Ref<Category[]>);
</script>

<style scoped lang="scss">
.products-table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.products-table-container {
  background-color: $background;
  border: 1px solid $border-gray;
  min-width: fit-content;
}

.products-table {
  thead {
    background-color: $background;
  }
}

.table-header-cell {
  padding: 1.5rem 1.5rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: normal;
  color: $text-gray-700;
}

.table-header-row {
  border-bottom: 1px solid $border-gray;
}

.product-row {
  border-bottom: 1px solid $border-gray;

  &:hover {
    background-color: $component-bg;
  }

  &:last-child {
    border-bottom: none;
  }
}

.product-image-wrapper {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 0.375rem;
}

.product-image {
  background-color: $skeleton;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.product-title-text {
  font-size: 1rem;
  font-weight: 500;
  color: $text-primary;
}

.product-category-text,
.product-price-text,
.product-stock-text {
  font-size: 0.875rem;
  color: $text-gray-600;
}

.product-price-text {
  font-weight: 600;
}
</style>
