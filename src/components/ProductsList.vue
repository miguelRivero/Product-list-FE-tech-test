<template>
  <div class="products-table-container">
    <table class="products-table" data-testid="products-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Title</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in products"
          :key="product.id"
          class="product-row"
          data-testid="product-row"
        >
          <td class="product-image-cell">
            <img
              :src="product.thumbnail"
              :alt="product.title"
              class="product-image"
              @error="handleImageError"
            />
          </td>
          <td class="product-title-cell">
            <span class="product-title-text">{{ product.title }}</span>
          </td>
          <td class="product-category-cell">
            <span class="product-category-text">{{ product.category }}</span>
          </td>
          <td class="product-price-cell">
            <span class="product-price-text">
              ${{ product.price.toFixed(2) }}
            </span>
          </td>
          <td class="product-stock-cell">
            <span class="product-stock-text">{{ product.stock }}</span>
          </td>
          <td class="product-actions-cell">
            <div class="action-icons">
              <button
                class="action-icon-button"
                @click="$emit('view', product.id)"
                data-testid="view-button"
                aria-label="View product"
              >
                <i class="pi pi-eye action-icon" />
              </button>
              <button
                class="action-icon-button"
                @click="$emit('edit', product.id)"
                data-testid="edit-button"
                aria-label="Edit product"
              >
                <i class="pi pi-pencil action-icon" />
              </button>
              <button
                class="action-icon-button action-icon-button-danger"
                @click="$emit('delete', product)"
                data-testid="delete-button"
                aria-label="Delete product"
              >
                <i class="pi pi-trash action-icon" />
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
</script>

<style scoped lang="scss">
.products-table-container {
  background-color: $component-bg;
  border-radius: 0.5rem;
  overflow: hidden;
  padding: 1.5rem; // p-6
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: $background;
}

th {
  padding: 1rem 1.5rem; // px-6 py-4 (24px horizontal, 16px vertical)
  text-align: left;
  font-size: 0.875rem; // text-sm (14px)
  font-weight: 600; // font-medium or font-semibold
  color: $text-gray-700;
  border-bottom: 1px solid $border-gray;
}

.product-row {
  border-bottom: 1px solid $border-gray;
  transition: background-color 0.2s;

  &:hover {
    background-color: lighten($background, 1%);
  }

  &:last-child {
    border-bottom: none;
  }
}

td {
  padding: 1rem 1.5rem; // px-6 py-4 (24px horizontal, 16px vertical)
  vertical-align: middle;
}

.product-image-cell {
  width: 80px;
}

.product-image {
  width: 4rem; // w-16 (64px)
  height: 4rem; // h-16 (64px)
  border-radius: 0.375rem; // rounded-md
  object-fit: cover;
  background-color: $skeleton;
}

.product-title-cell {
  min-width: 200px;
}

.product-title-text {
  font-size: 1rem; // text-base (16px)
  font-weight: 500; // font-medium
  color: $text-primary;
}

.product-category-cell,
.product-price-cell,
.product-stock-cell {
  min-width: 120px;
}

.product-category-text,
.product-price-text,
.product-stock-text {
  font-size: 0.875rem; // text-sm (14px)
  color: $text-gray-600;
}

.product-price-text {
  font-weight: 600;
}

.product-actions-cell {
  width: 150px;
}

.action-icons {
  display: flex;
  gap: 0.75rem; // gap-3 (12px)
  align-items: center;
}

.action-icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: $background;
  }

  &.action-icon-button-danger {
    &:hover {
      background-color: rgba($danger, 0.1);
    }
  }
}

.action-icon {
  width: 1.25rem; // w-5 (20px)
  height: 1.25rem; // h-5 (20px)
  color: $text-gray-600;

  .action-icon-button-danger & {
    color: $danger;
  }
}
</style>
