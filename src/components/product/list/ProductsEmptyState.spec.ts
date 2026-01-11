import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ProductsEmptyState from "./ProductsEmptyState.vue";

describe("ProductsEmptyState", () => {
  it("renders empty state message", () => {
    const wrapper = mount(ProductsEmptyState);

    expect(wrapper.text()).toContain("No products found");
    expect(wrapper.text()).toContain("Try adjusting your search or filter criteria");
  });

  it("has empty icon", () => {
    const wrapper = mount(ProductsEmptyState);

    // Check for icon (pi-inbox class)
    const icon = wrapper.find(".pi-inbox");
    expect(icon.exists()).toBe(true);
  });
});
