import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ProductsSearch from "./ProductsSearch.vue";
import { mountWithStubs } from "@/test-utils/helpers";

describe("ProductsSearch", () => {
  it("renders search input", () => {
    const wrapper = mountWithStubs(ProductsSearch, {
      props: {
        searchQuery: "",
      },
    });

    expect(wrapper.find('[data-testid="search-input"]').exists()).toBe(true);
  });

  it("displays search query value", () => {
    const wrapper = mountWithStubs(ProductsSearch, {
      props: {
        searchQuery: "test query",
      },
    });

    const input = wrapper.find('[data-testid="search-input"]');
    expect((input.element as HTMLInputElement).value).toBe("test query");
  });

  it("emits update:searchQuery event when input value changes", async () => {
    const wrapper = mountWithStubs(ProductsSearch, {
      props: {
        searchQuery: "",
      },
    });

    const input = wrapper.find('[data-testid="search-input"]');
    await input.setValue("new query");

    expect(wrapper.emitted("update:searchQuery")).toBeTruthy();
    expect(wrapper.emitted("update:searchQuery")?.[0]).toEqual(["new query"]);
  });

  it("has correct placeholder text", () => {
    const wrapper = mountWithStubs(ProductsSearch, {
      props: {
        searchQuery: "",
      },
    });

    const input = wrapper.find('[data-testid="search-input"]');
    expect(input.attributes("placeholder")).toBe("Search products...");
  });
});
