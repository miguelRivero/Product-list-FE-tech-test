import { beforeEach, describe, expect, it } from "vitest";

import type { ProductFormData } from "@/types/product";
import { nextTick } from "vue";
import { useDialog } from "./useDialog";

describe("useDialog", () => {
  let dialog: ReturnType<typeof useDialog>;

  beforeEach(() => {
    dialog = useDialog();
  });

  it("initializes with closed dialog and no messages", () => {
    expect(dialog.isVisible.value).toBe(false);
    expect(dialog.formData.value).toBe(null);
    expect(dialog.error.value).toBe(null);
    expect(dialog.success.value).toBe(null);
  });

  describe("open", () => {
    it("opens dialog and clears messages", () => {
      dialog.setError("Some error");
      dialog.setSuccess("Some success");

      dialog.open();

      expect(dialog.isVisible.value).toBe(true);
      expect(dialog.error.value).toBe(null);
      expect(dialog.success.value).toBe(null);
    });
  });

  describe("close", () => {
    it("closes dialog and clears messages", () => {
      dialog.open();
      dialog.setError("Some error");
      dialog.setSuccess("Some success");

      dialog.close();

      expect(dialog.isVisible.value).toBe(false);
      expect(dialog.error.value).toBe(null);
      expect(dialog.success.value).toBe(null);
    });

    it("clears formData when closing", async () => {
      const mockFormData: ProductFormData = {
        title: "Test Product",
        description: "Test Description",
        price: 100,
        discountPercentage: 10,
        stock: 50,
        brand: "Test Brand",
        category: "electronics",
      };

      dialog.formData.value = mockFormData;
      await nextTick();

      dialog.close();

      expect(dialog.formData.value).toBe(null);
    });
  });

  describe("setError", () => {
    it("sets error message and clears success", () => {
      dialog.setSuccess("Some success");

      dialog.setError("Error occurred");

      expect(dialog.error.value).toBe("Error occurred");
      expect(dialog.success.value).toBe(null);
    });

    it("replaces existing error", () => {
      dialog.setError("First error");
      dialog.setError("Second error");

      expect(dialog.error.value).toBe("Second error");
    });
  });

  describe("setSuccess", () => {
    it("sets success message and clears error", () => {
      dialog.setError("Some error");

      dialog.setSuccess("Success occurred");

      expect(dialog.success.value).toBe("Success occurred");
      expect(dialog.error.value).toBe(null);
    });

    it("replaces existing success", () => {
      dialog.setSuccess("First success");
      dialog.setSuccess("Second success");

      expect(dialog.success.value).toBe("Second success");
    });
  });

  describe("clearMessages", () => {
    it("clears both error and success messages", () => {
      dialog.setError("Some error");
      dialog.setSuccess("Some success");

      dialog.clearMessages();

      expect(dialog.error.value).toBe(null);
      expect(dialog.success.value).toBe(null);
    });

    it("does nothing when messages are already cleared", () => {
      dialog.clearMessages();

      expect(dialog.error.value).toBe(null);
      expect(dialog.success.value).toBe(null);
    });
  });
});
