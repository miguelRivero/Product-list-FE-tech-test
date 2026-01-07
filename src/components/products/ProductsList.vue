<template>
  <div class="products-table-container rounded-xl border">
    <table
      class="products-table w-full border-collapse"
      data-testid="products-table"
    >
      <thead>
        <tr class="table-header-row">
          <th
            class="px-6 py-4 text-left text-sm text-[#374151] font-normal"
          ></th>
          <th class="px-6 py-4 text-left text-sm text-[#374151] font-normal">
            Title
          </th>
          <th class="px-6 py-4 text-left text-sm text-[#374151] font-normal">
            Category
          </th>
          <th class="px-6 py-4 text-left text-sm text-[#374151] font-normal">
            Price
          </th>
          <th class="px-6 py-4 text-left text-sm text-[#374151] font-normal">
            Stock
          </th>
          <th class="px-6 py-4 text-left text-sm text-[#374151] font-normal">
            Actions
          </th>
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
                @error="handleImageError"
              />
            </div>
          </td>
          <td class="product-title-cell px-6 py-4 align-middle min-w-[200px]">
            <span
              class="product-title-text text-base font-medium text-[#373a39]"
            >
              {{ product.title }}
            </span>
          </td>
          <td
            class="product-category-cell px-6 py-4 align-middle min-w-[120px]"
          >
            <span class="product-category-text text-sm text-[#6b7280]">
              {{ capitalizeCategory(product.category) }}
            </span>
          </td>
          <td class="product-price-cell px-6 py-4 align-middle min-w-[120px]">
            <span
              class="product-price-text text-sm text-[#6b7280] font-semibold"
            >
              ${{ product.price.toFixed(2) }}
            </span>
          </td>
          <td class="product-stock-cell px-6 py-4 align-middle min-w-[120px]">
            <span class="product-stock-text text-sm text-[#6b7280]">
              {{ product.stock }}
            </span>
          </td>
          <td class="product-actions-cell px-6 py-4 align-middle w-[150px]">
            <div class="action-icons flex items-center gap-3">
              <button
                class="action-icon-button p-2 rounded transition-colors"
                @click="$emit('view', product.id)"
                data-testid="view-button"
                aria-label="View product"
              >
                <i class="pi pi-eye action-icon w-5 h-5 text-[#6b7280]" />
              </button>
              <button
                class="action-icon-button p-2 rounded transition-colors"
                @click="$emit('edit', product.id)"
                data-testid="edit-button"
                aria-label="Edit product"
              >
                <i class="pi pi-pencil action-icon w-5 h-5 text-[#6b7280]" />
              </button>
              <button
                class="action-icon-button action-icon-button-danger p-2 rounded transition-colors"
                @click="$emit('delete', product)"
                data-testid="delete-button"
                aria-label="Delete product"
              >
                <i class="pi pi-trash action-icon w-5 h-5 text-[#ef4444]" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "@/types/product";

defineProps<{
  products: Product[];
}>();

defineEmits<{
  view: [id: number];
  edit: [id: number];
  delete: [product: Product];
}>();

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23e2e2e2' width='64' height='64'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='10' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
};

const capitalizeCategory = (category: string): string => {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
</script>

<style scoped lang="scss">
.products-table-container {
  background-color: $background;
  border: 1px solid $border-gray;
}

.products-table {
  thead {
    background-color: $background;
  }
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

.action-icon-button {
  &:hover {
    background-color: $background;
  }

  &.action-icon-button-danger {
    &:hover {
      background-color: rgba($danger, 0.1);
    }
  }
}
</style>
