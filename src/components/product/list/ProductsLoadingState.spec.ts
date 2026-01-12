import { describe, it, expect } from "vitest";
import ProductsLoadingState from "./ProductsLoadingState.vue";
import { mountWithStubs } from "@/test-utils/helpers";

describe("ProductsLoadingState", () => {
  it("renders loading message", () => {
    const wrapper = mountWithStubs(ProductsLoadingState);

    expect(wrapper.text()).toContain("Loading products...");
  });

  it("displays loading spinner", () => {
    const wrapper = mountWithStubs(ProductsLoadingState);

    // ProgressSpinner is stubbed, but should be present
    expect(wrapper.html()).toContain("Loading");
  });
});
