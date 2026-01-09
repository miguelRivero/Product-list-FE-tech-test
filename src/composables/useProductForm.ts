import { reactive, watch, computed, type Ref, type ComputedRef } from "vue";
import type { Product, Category, ProductFormData } from "@/types/product";
import { useCategory } from "./useCategory";

/**
 * Composable for product form management
 * Handles form data, validation, and category conversion
 */
export function useProductForm(
  product: Ref<Product | null>,
  categories: Ref<Category[]> | ComputedRef<Category[]>
) {
  const { slugToName } = useCategory(categories);

  const formData = reactive<ProductFormData>({
    title: "",
    description: "",
    price: 0,
    discountPercentage: 0,
    stock: 0,
    category: "",
  });

  const resetForm = () => {
    formData.title = "";
    formData.description = "";
    formData.price = 0;
    formData.discountPercentage = 0;
    formData.stock = 0;
    formData.category = "";
  };

  const populateForm = (product: Product) => {
    formData.title = product.title;
    formData.description = product.description;
    formData.price = product.price;
    formData.discountPercentage = product.discountPercentage || 0;
    formData.stock = product.stock;
    // Convert category name to slug if needed
    const category = categories.value.find((cat) => cat.name === product.category);
    formData.category = category ? category.slug : product.category;
  };

  watch(
    () => product.value,
    (newProduct) => {
      if (newProduct) {
        populateForm(newProduct);
      } else {
        resetForm();
      }
    },
    { immediate: true }
  );

  const prepareSubmitData = (): ProductFormData => {
    const categorySlug = formData.category;
    const categoryName = slugToName(categorySlug);

    return {
      ...formData,
      category: categoryName,
    };
  };

  const validateForm = (): boolean => {
    return !!(
      formData.title &&
      formData.description &&
      formData.price >= 0 &&
      formData.stock >= 0 &&
      formData.category
    );
  };

  return {
    formData,
    resetForm,
    populateForm,
    prepareSubmitData,
    validateForm,
  };
}
