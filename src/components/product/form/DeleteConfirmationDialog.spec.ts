import { describe, expect, it } from "vitest";

import DeleteConfirmationDialog from "./DeleteConfirmationDialog.vue";
import { mountWithStubs } from "@/test-utils/helpers";

describe("DeleteConfirmationDialog", () => {
  const defaultProps = {
    visible: true,
    productTitle: "Test Product",
    isDeleting: false,
  };

  it("renders dialog when visible is true", () => {
    const wrapper = mountWithStubs(DeleteConfirmationDialog, {
      props: defaultProps,
    });

    expect(
      wrapper.find('[data-testid="delete-confirmation-dialog"]').exists()
    ).toBe(true);
  });

  it("does not render dialog when visible is false", () => {
    const wrapper = mountWithStubs(DeleteConfirmationDialog, {
      props: {
        ...defaultProps,
        visible: false,
      },
    });

    expect(
      wrapper.find('[data-testid="delete-confirmation-dialog"]').exists()
    ).toBe(false);
  });

  it("displays product title in confirmation message", () => {
    const wrapper = mountWithStubs(DeleteConfirmationDialog, {
      props: {
        ...defaultProps,
        productTitle: "My Test Product",
      },
    });

    expect(wrapper.text()).toContain("My Test Product");
    expect(wrapper.text()).toContain("Are you sure you want to delete");
  });

  it("shows error message when errorMessage prop is provided", () => {
    const wrapper = mountWithStubs(DeleteConfirmationDialog, {
      props: {
        ...defaultProps,
        errorMessage: "Failed to delete product",
      },
    });

    expect(wrapper.text()).toContain("Failed to delete product");
  });

  it("shows success message when successMessage prop is provided", () => {
    const wrapper = mountWithStubs(DeleteConfirmationDialog, {
      props: {
        ...defaultProps,
        successMessage: "Product deleted successfully",
      },
    });

    expect(wrapper.text()).toContain("Product deleted successfully");
  });

  it("emits confirm event when delete button is clicked", async () => {
    const wrapper = mountWithStubs(DeleteConfirmationDialog, {
      props: defaultProps,
    });

    // Find delete button by text content
    const buttons = wrapper.findAll("button");
    const deleteButton = buttons.find(btn => btn.text().includes("Delete"));
    expect(deleteButton).toBeDefined();

    if (deleteButton) {
      await deleteButton.trigger("click");
      expect(wrapper.emitted("confirm")).toBeTruthy();
    }
  });

  it("emits cancel and update:visible events when cancel button is clicked", async () => {
    const wrapper = mountWithStubs(DeleteConfirmationDialog, {
      props: defaultProps,
    });

    // Find cancel button by text content
    const buttons = wrapper.findAll("button");
    const cancelButton = buttons.find(btn => btn.text().includes("Cancel"));
    expect(cancelButton).toBeDefined();

    if (cancelButton) {
      await cancelButton.trigger("click");
      expect(wrapper.emitted("cancel")).toBeTruthy();
      expect(wrapper.emitted("update:visible")).toBeTruthy();
      expect(wrapper.emitted("update:visible")?.[0]).toEqual([false]);
    }
  });

  it("disables delete button when isDeleting is true", () => {
    const wrapper = mountWithStubs(DeleteConfirmationDialog, {
      props: {
        ...defaultProps,
        isDeleting: true,
      },
    });

    const buttons = wrapper.findAll("button");
    const deleteButton = buttons.find(btn => btn.text().includes("Delete"));
    if (deleteButton) {
      expect(deleteButton.attributes("disabled")).toBeDefined();
    }
  });
});
