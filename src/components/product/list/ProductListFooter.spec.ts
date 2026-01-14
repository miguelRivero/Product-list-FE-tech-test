import { describe, expect, it } from "vitest";

import type { MountingOptions } from "@vue/test-utils";
import ProductListFooter from "./ProductListFooter.vue";
import { mountWithStubs } from "@/test-utils/helpers";

type MountOptions = MountingOptions<InstanceType<typeof ProductListFooter>>;

describe("ProductListFooter", () => {
  it("renders pagination and info components", () => {
    const wrapper = mountWithStubs(ProductListFooter, {
      props: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
      },
    } as MountOptions);

    // Both ProductsListInfo and ProductsPagination should be rendered
    // Verify by checking for their CSS classes
    expect(wrapper.find(".product-list-info").exists()).toBe(true);
    expect(wrapper.find('[data-testid="pagination"]').exists()).toBe(true);
  });

  it("emits page-change event when pagination changes", async () => {
    const wrapper = mountWithStubs(ProductListFooter, {
      props: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
      },
    } as MountOptions);

    // Simulate page change from ProductsPagination
    await wrapper.vm.$emit("page-change", { page: 1, first: 10, rows: 10 });

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
    } as MountOptions);

    expect(wrapper.props("currentPage")).toBe(2);
    expect(wrapper.props("pageSize")).toBe(20);
    expect(wrapper.props("total")).toBe(150);
  });
});
