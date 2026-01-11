<template>
  <Card class="product-card" data-testid="product-card">
    <template #header>
      <div class="product-image-container">
        <img
          :src="product.thumbnail"
          :alt="product.title"
          class="product-thumbnail"
          loading="lazy"
          @error="handleImageError"
        />
        <Tag
          :value="product.category"
          severity="info"
          class="product-category-badge"
        />
      </div>
    </template>
    <template #content>
      <div class="product-content">
        <h3 class="product-title">{{ product.title }}</h3>
        <p class="product-description">
          {{ truncateDescription(product.description) }}
        </p>
        <div class="product-rating">
          <i class="pi pi-star-fill star-icon" />
          <span class="rating-value">{{ product.rating }}</span>
        </div>
        <div class="product-price-section">
          <div class="price-container">
            <span class="product-price">
              ${{ product.price.toFixed(2) }}
            </span>
            <span
              v-if="product.discountPercentage > 0"
              class="product-price-original"
            >
              ${{
                (
                  product.price /
                  (1 - product.discountPercentage / 100)
                ).toFixed(2)
              }}
            </span>
          </div>
          <div class="stock-info">
            <span class="stock-label">Stock:</span>
            <span
              class="stock-value"
              :class="{ 'stock-low': product.stock < 10 }"
            >
              {{ product.stock }}
            </span>
          </div>
        </div>
        <div class="product-actions">
          <Button
            icon="pi pi-eye"
            label="View"
            size="small"
            outlined
            class="action-button"
            @click="$emit('view', product.id)"
            data-testid="view-button"
          />
          <Button
            icon="pi pi-pencil"
            label="Edit"
            size="small"
            outlined
            class="action-button"
            @click="$emit('edit', product.id)"
            data-testid="edit-button"
          />
          <Button
            icon="pi pi-trash"
            label="Delete"
            size="small"
            severity="danger"
            outlined
            class="action-button"
            @click="$emit('delete', product)"
            data-testid="delete-button"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import Tag from "primevue/tag";
import type { Product } from "@/types/product";

defineProps<{
  product: Product;
}>();

defineEmits<{
  view: [id: number];
  edit: [id: number];
  delete: [product: Product];
}>();

const truncateDescription = (description: string, maxLength = 100): string => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + "...";
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23ddd' width='300' height='200'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
};
</script>

<style scoped lang="scss">
.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid var(--p-border-color);
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: var(--p-surface-50);
}

.product-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-thumbnail {
  transform: scale(1.05);
}

.product-category-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
}

.product-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.product-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: var(--p-text-color);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  font-size: 0.875rem;
  color: var(--p-text-color-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.star-icon {
  color: #fbbf24;
  font-size: 1rem;
}

.rating-value {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--p-text-color);
}

.product-price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid var(--p-border-color);
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--p-primary-color);
}

.product-price-original {
  font-size: 1rem;
  color: var(--p-text-color-secondary);
  text-decoration: line-through;
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.stock-label {
  color: var(--p-text-color-secondary);
}

.stock-value {
  font-weight: 600;
  color: var(--p-text-color);

  &.stock-low {
    color: #ef4444;
  }
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--p-border-color);
  margin-top: auto;
}

.action-button {
  flex: 1;
  font-size: 0.875rem;
}
</style>

