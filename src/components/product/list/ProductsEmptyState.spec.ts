import { describe, expect, it } from "vitest";

import ProductsEmptyState from "./ProductsEmptyState.vue";
import { mount } from "@vue/test-utils";

describe("ProductsEmptyState", () => {
  it("renders empty state message and icon", () => {
    const wrapper = mount(ProductsEmptyState);

    expect(wrapper.text()).toContain("No products found");
    expect(wrapper.text()).toContain(
      "Try adjusting your search or filter criteria"
    );
    // Icon is always present when component renders
    const icon = wrapper.find(".pi-inbox");
    expect(icon.exists()).toBe(true);
  });
});
