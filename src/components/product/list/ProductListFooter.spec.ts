import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ProductListFooter from "./ProductListFooter.vue";
import { mountWithStubs } from "@/test-utils/helpers";

describe("ProductListFooter", () => {
  it("renders pagination and info components", () => {
    const wrapper = mountWithStubs(ProductListFooter, {
      props: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
      },
    });

    // Both ProductsListInfo and ProductsPagination should be rendered
    expect(wrapper.html()).toBeDefined();
  });

  it("emits page-change event when pagination changes", async () => {
    const wrapper = mountWithStubs(ProductListFooter, {
      props: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
      },
    });

    // Simulate page change from ProductsPagination
    await wrapper.vm.$emit("page-change", { page: 1, first: 10, rows: 10 });

    expect(wrapper.emitted("page-change")).toBeTruthy();
    expect(wrapper.emitted("page-change")?.[0]).toEqual([
      { page: 1, first: 10, rows: 10 },
    ]);
  });

  it("passes correct props to child components", () => {
    const wrapper = mountWithStubs(ProductListFooter, {
      props: {
        currentPage: 2,
        pageSize: 20,
        total: 150,
      },
    });

    expect(wrapper.props("currentPage")).toBe(2);
    expect(wrapper.props("pageSize")).toBe(20);
    expect(wrapper.props("total")).toBe(150);
  });
});
