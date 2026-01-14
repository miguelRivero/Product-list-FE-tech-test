import type { ProductFormData } from "@/types/product";
import { ref } from "vue";

/**
 * Composable for dialog management
 * Handles dialog visibility, form data, and error/success messages
 */
export function useDialog() {
  const isVisible = ref(false);
  const formData = ref<ProductFormData | null>(null);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);

  const open = () => {
    isVisible.value = true;
    clearMessages();
  };

  const close = () => {
    isVisible.value = false;
    formData.value = null;
    clearMessages();
  };

  const setError = (message: string) => {
    error.value = message;
    success.value = null;
  };

  const setSuccess = (message: string) => {
    success.value = message;
    error.value = null;
  };

  const clearMessages = () => {
    error.value = null;
    success.value = null;
  };

  return {
    isVisible,
    formData,
    error,
    success,
    open,
    close,
    setError,
    setSuccess,
    clearMessages,
  };
}
