<template>
  <form class="product-form" @submit.prevent="handleSubmit">
    <div
      v-if="Object.keys(validationErrors).length > 0"
      class="form-validation-errors"
    >
      <Message severity="error" :closable="false">
        <ul class="validation-errors-list">
          <li v-for="(errors, field) in validationErrors" :key="field">
            <strong>{{ field }}:</strong> {{ errors.join(", ") }}
          </li>
        </ul>
      </Message>
    </div>

    <div class="form-field">
      <label for="title" class="form-label">Title</label>
      <InputText
        id="title"
        v-model="formData.title"
        class="form-input"
        :class="{ 'p-invalid': validationErrors.title }"
        required
        data-testid="product-title-input"
      />
      <small v-if="validationErrors.title" class="p-error">{{
        validationErrors.title[0]
      }}</small>
    </div>

    <div class="form-field">
      <label for="description" class="form-label">Description</label>
      <Textarea
        id="description"
        v-model="formData.description"
        class="form-textarea"
        :class="{ 'p-invalid': validationErrors.description }"
        rows="5"
        required
        data-testid="product-description-input"
      />
      <small v-if="validationErrors.description" class="p-error">{{
        validationErrors.description[0]
      }}</small>
    </div>

    <div class="form-row">
      <div class="form-field">
        <label for="price" class="form-label">Price</label>
        <InputNumber
          id="price"
          v-model="formData.price"
          class="form-input"
          :class="{ 'p-invalid': validationErrors.price }"
          mode="decimal"
          :min="0"
          :min-fraction-digits="2"
          :max-fraction-digits="2"
          required
          data-testid="product-price-input"
        />
        <small v-if="validationErrors.price" class="p-error">{{
          validationErrors.price[0]
        }}</small>
      </div>

      <div class="form-field">
        <label for="discount" class="form-label">Discount</label>
        <InputNumber
          id="discount"
          v-model="formData.discountPercentage"
          class="form-input"
          :class="{ 'p-invalid': validationErrors.discountPercentage }"
          mode="decimal"
          :min="0"
          :max="100"
          :min-fraction-digits="0"
          :max-fraction-digits="2"
          suffix="%"
          data-testid="product-discount-input"
        />
        <small v-if="validationErrors.discountPercentage" class="p-error">{{
          validationErrors.discountPercentage[0]
        }}</small>
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
        :class="{ 'p-invalid': validationErrors.category }"
        required
        data-testid="product-category-select"
      />
      <small v-if="validationErrors.category" class="p-error">{{
        validationErrors.category[0]
      }}</small>
    </div>

    <div class="form-field">
      <label for="stock" class="form-label">Stock</label>
      <InputNumber
        id="stock"
        v-model="formData.stock"
        class="form-input"
        :class="{ 'p-invalid': validationErrors.stock }"
        :min="0"
        required
        data-testid="product-stock-input"
      />
      <small v-if="validationErrors.stock" class="p-error">{{
        validationErrors.stock[0]
      }}</small>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from "vue";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import Message from "primevue/message";
import type { Product, Category } from "@/types/product";
import { validateProductForm, sanitizeString } from "@/utils/validation";
import type { ProductFormData } from "@/types/product";

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
  tags: [],
});

const categoryOptions = props.categories;
const validationErrors = ref<Record<string, string[]>>({});

// Populate form when editing
watch(
  () => props.product,
  product => {
    if (product) {
      formData.title = sanitizeString(product.title);
      formData.description = sanitizeString(product.description);
      formData.price = product.price;
      formData.discountPercentage = product.discountPercentage || 0;
      formData.stock = product.stock;
      formData.category = product.category;
      formData.tags = product.tags || [];
      formData.brand = product.brand;
      validationErrors.value = {};
    } else {
      // Reset form for new product
      formData.title = "";
      formData.description = "";
      formData.price = 0;
      formData.discountPercentage = 0;
      formData.stock = 0;
      formData.category = "";
      formData.tags = [];
      formData.brand = undefined;
      validationErrors.value = {};
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  // Validate form data
  const validation = validateProductForm(formData);

  if (!validation.success) {
    validationErrors.value = validation.errors || {};
    return;
  }

  // Clear validation errors
  validationErrors.value = {};

  // Emit validated and sanitized data
  emit("submit", validation.data!);
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

.form-validation-errors {
  margin-bottom: 1rem;
}

.validation-errors-list {
  margin: 0;
  padding-left: 1.5rem;

  li {
    margin-bottom: 0.25rem;
  }
}

.p-error {
  color: $danger;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

:deep(.p-invalid) {
  border-color: $danger !important;
}
</style>
