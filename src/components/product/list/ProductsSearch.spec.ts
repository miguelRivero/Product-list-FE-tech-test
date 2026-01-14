import { describe, expect, it } from "vitest";

import type { MountingOptions } from "@vue/test-utils";
import ProductsSearch from "./ProductsSearch.vue";
import { mountWithStubs } from "@/test-utils/helpers";

type MountOptions = MountingOptions<InstanceType<typeof ProductsSearch>>;

describe("ProductsSearch", () => {
  it("renders search input", () => {
    const wrapper = mountWithStubs(ProductsSearch, {
      props: {
        searchQuery: "",
      },
    } as MountOptions);

    expect(wrapper.find('[data-testid="search-input"]').exists()).toBe(true);
  });

  it("displays search query value", () => {
    const wrapper = mountWithStubs(ProductsSearch, {
      props: {
        searchQuery: "test query",
      },
    } as MountOptions);

    const input = wrapper.find('[data-testid="search-input"]');
    expect((input.element as HTMLInputElement).value).toBe("test query");
  });

  it("emits update:searchQuery event when input value changes", async () => {
    const wrapper = mountWithStubs(ProductsSearch, {
      props: {
        searchQuery: "",
      },
    } as MountOptions);

    const input = wrapper.find('[data-testid="search-input"]');
    await input.setValue("new query");

    expect(wrapper.emitted("update:searchQuery")?.[0]).toEqual(["new query"]);
  });

  it("has correct placeholder text", () => {
    const wrapper = mountWithStubs(ProductsSearch, {
      props: {
        searchQuery: "",
      },
    } as MountOptions);

    const input = wrapper.find('[data-testid="search-input"]');
    expect(input.attributes("placeholder")).toBe("Search products...");
  });
});
