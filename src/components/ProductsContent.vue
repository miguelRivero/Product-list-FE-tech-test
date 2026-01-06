<template>
  <div class="products-content">
    <ProductsLoadingState v-if="loading" />

    <ProductsErrorState
      v-if="error && !loading"
      :error="error"
      @close="$emit('clear-error')"
    />

    <ProductsList
      v-if="!loading && !error && products.length > 0"
      :products="products"
      @view="$emit('view', $event)"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />

    <ProductsEmptyState v-if="!loading && !error && products.length === 0" />

    <!-- Create/Edit Dialog -->
    <Dialog
      :visible="showCreateDialog"
      :header="editingProduct ? 'Edit Product' : 'Create Product'"
      :modal="true"
      :style="{ width: '50vw' }"
      data-testid="product-dialog"
      @update:visible="$emit('update:showCreateDialog', $event)"
    >
      <p class="text-600">
        Product form will be implemented here. This is a minimal working example
        showing the architecture.
      </p>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          outlined
          @click="$emit('close-dialog')"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          @click="$emit('close-dialog')"
        />
      </template>
    </Dialog>

    <!-- Delete Confirmation -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import ConfirmDialog from "primevue/confirmdialog";
import ProductsLoadingState from "./ProductsLoadingState.vue";
import ProductsErrorState from "./ProductsErrorState.vue";
import ProductsList from "./ProductsList.vue";
import ProductsEmptyState from "./ProductsEmptyState.vue";
import type { Product } from "@/types/product";

defineProps<{
  loading: boolean;
  error: string | null;
  products: Product[];
  showCreateDialog: boolean;
  editingProduct: Product | null;
}>();

defineEmits<{
  "clear-error": [];
  view: [id: number];
  edit: [id: number];
  delete: [product: Product];
  "close-dialog": [];
  "update:showCreateDialog": [value: boolean];
}>();
</script>
