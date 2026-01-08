<template>
  <form class="product-form" @submit.prevent="handleSubmit">
    <div class="form-field">
      <label for="title" class="form-label">Title</label>
      <InputText
        id="title"
        v-model="formData.title"
        class="form-input"
        required
        data-testid="product-title-input"
      />
    </div>

    <div class="form-field">
      <label for="description" class="form-label">Description</label>
      <Textarea
        id="description"
        v-model="formData.description"
        class="form-textarea"
        rows="5"
        required
        data-testid="product-description-input"
      />
    </div>

    <div class="form-row">
      <div class="form-field">
        <label for="price" class="form-label">Price</label>
        <InputNumber
          id="price"
          v-model="formData.price"
          class="form-input"
          mode="decimal"
          :min="0"
          :min-fraction-digits="2"
          :max-fraction-digits="2"
          required
          data-testid="product-price-input"
        />
      </div>

      <div class="form-field">
        <label for="discount" class="form-label">Discount</label>
        <InputNumber
          id="discount"
          v-model="formData.discountPercentage"
          class="form-input"
          mode="decimal"
          :min="0"
          :max="100"
          :min-fraction-digits="0"
          :max-fraction-digits="2"
          suffix="%"
          data-testid="product-discount-input"
        />
      </div>
    </div>

    <div class="form-field">
      <label for="category" class="form-label">Category</label>
      <Select
        id="category"
        v-model="formData.category"
        :options="categoryOptions"
        option-label="name"
        option-value="slug"
        placeholder="Select category"
        class="form-select"
        required
        data-testid="product-category-select"
      />
    </div>

    <div class="form-field">
      <label for="stock" class="form-label">Stock</label>
      <InputNumber
        id="stock"
        v-model="formData.stock"
        class="form-input"
        :min="0"
        required
        data-testid="product-stock-input"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import type { Product, Category, ProductFormData } from "@/types/product";

const props = defineProps<{
  product?: Product | null;
  categories: Category[];
}>();

const emit = defineEmits<{
  submit: [data: ProductFormData];
}>();

const formData = reactive<ProductFormData>({
  title: "",
  description: "",
  price: 0,
  discountPercentage: 0,
  stock: 0,
  category: "",
});

const categoryOptions = props.categories;

// Populate form when editing
watch(
  () => props.product,
  (product) => {
    if (product) {
      formData.title = product.title;
      formData.description = product.description;
      formData.price = product.price;
      formData.discountPercentage = product.discountPercentage || 0;
      formData.stock = product.stock;
      formData.category = product.category;
    } else {
      // Reset form for new product
      formData.title = "";
      formData.description = "";
      formData.price = 0;
      formData.discountPercentage = 0;
      formData.stock = 0;
      formData.category = "";
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit("submit", { ...formData });
};

// Expose method to trigger submit from parent
const submitForm = () => {
  handleSubmit();
};

defineExpose({
  submitForm,
});
</script>

<style scoped lang="scss">
.product-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.form-label {
  font-size: 0.875rem;
  color: $text-primary;
  font-weight: 500;
  margin-bottom: 0;
}

// Base styles for all inputs
:deep(.p-inputtext),
:deep(.p-textarea),
:deep(.p-inputnumber),
:deep(.p-select) {
  width: 100%;
  border: 1px solid $border-gray;
  border-radius: 0.375rem;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  background-color: $component-bg;
  color: $text-primary;
  font-family: $font-family;

  &:focus {
    outline: none;
    border-color: $border-gray;
    box-shadow: none;
  }

  &::placeholder {
    color: $text-gray-600;
  }
}

// InputText specific
:deep(.p-inputtext) {
  height: auto;
  box-shadow: none;
}

// Textarea specific
:deep(.p-inputtextarea) {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

// InputNumber wrapper - ensure it looks like a regular input
:deep(.p-inputnumber) {
  display: flex;
  align-items: center;
  border: 1px solid $border-gray;
  border-radius: 0.375rem;
  padding: 0.625rem 0.75rem;
  background-color: $component-bg;

  .p-inputnumber-input {
    flex: 1;
    border: none;
    padding: 0;
    background: transparent;
    font-size: 0.875rem;
    color: $text-primary;
    width: 100%;

    &:focus {
      outline: none;
      box-shadow: none;
    }
  }

  .p-inputnumber-button {
    display: none;
  }

  .p-inputnumber-suffix {
    margin-left: 0.25rem;
    color: $text-primary;
    font-size: 0.875rem;
  }
}

// Select specific - use same styles as category-select
:deep(.p-select) {
  .p-select-label {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    color: $text-primary;
  }

  .p-select-trigger {
    border: none;
    background: transparent;
  }

  .p-select-dropdown {
    color: $text-primary;
  }
}

// Remove PrimeVue default focus styles
:deep(.p-focus) {
  border-color: $border-gray !important;
  box-shadow: none !important;
}
</style>
