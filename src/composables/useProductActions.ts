import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import type { Product } from "@/types/product";

/**
 * Composable for product action handlers
 * Provides navigation and action handlers for product operations
 */
export function useProductActions() {
  const router = useRouter();
  const confirm = useConfirm();
  const toast = useToast();

  const viewProduct = (id: number) => {
    router.push(`/products/${id}`);
  };

  const editProduct = (id: number, products: Product[]): Product | null => {
    return products.find((p) => p.id === id) || null;
  };

  const confirmDelete = (
    product: Product,
    onDelete: (id: number) => Promise<void>,
    onSuccess?: () => void
  ) => {
    confirm.require({
      message: `Are you sure you want to delete "${product.title}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        try {
          await onDelete(product.id);
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Product deleted successfully",
            life: 3000,
          });
          if (onSuccess) {
            onSuccess();
          }
        } catch (err) {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to delete product",
            life: 3000,
          });
        }
      },
    });
  };

  return {
    viewProduct,
    editProduct,
    confirmDelete,
  };
}
