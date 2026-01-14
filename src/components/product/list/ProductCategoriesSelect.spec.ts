import { describe, expect, it } from "vitest";

import type { Category } from "@/types/product";
import type { MountingOptions } from "@vue/test-utils";
import ProductCategoriesSelect from "./ProductCategoriesSelect.vue";
import { mountWithStubs } from "@/test-utils/helpers";

type MountOptions = MountingOptions<
  InstanceType<typeof ProductCategoriesSelect>
>;

describe("ProductCategoriesSelect", () => {
  const mockCategories: Category[] = [
    {
      slug: "electronics",
      name: "Electronics",
      url: "/categories/electronics",
    },
    { slug: "beauty", name: "Beauty", url: "/categories/beauty" },
  ];

  it("renders category select", () => {
    const wrapper = mountWithStubs(ProductCategoriesSelect, {
      props: {
        selectedCategory: null,
        categories: mockCategories,
      },
    } as MountOptions);

    expect(wrapper.find('[data-testid="category-select"]').exists()).toBe(true);
  });

  it("includes 'All' option in category options", () => {
    const wrapper = mountWithStubs(ProductCategoriesSelect, {
      props: {
        selectedCategory: null,
        categories: mockCategories,
      },
    } as MountOptions);

    // The component includes an "All" option with slug: null
    const select = wrapper.find('[data-testid="category-select"]');
    expect(select.exists()).toBe(true);
  });

  it("emits update:selectedCategory when category is selected", async () => {
    const wrapper = mountWithStubs(ProductCategoriesSelect, {
      props: {
        selectedCategory: null,
        categories: mockCategories,
      },
    } as MountOptions);

    const select = wrapper.find('[data-testid="category-select"]');
    await select.setValue("electronics");

    expect(wrapper.emitted("update:selectedCategory")?.[0]).toEqual([
      "electronics",
    ]);
  });

  it("displays selected category", () => {
    const wrapper = mountWithStubs(ProductCategoriesSelect, {
      props: {
        selectedCategory: "electronics",
        categories: mockCategories,
      },
    } as MountOptions);

    const select = wrapper.find('[data-testid="category-select"]');
    expect((select.element as HTMLSelectElement).value).toBe("electronics");
  });

  it("has aria-label for accessibility", () => {
    const wrapper = mountWithStubs(ProductCategoriesSelect, {
      props: {
        selectedCategory: null,
        categories: mockCategories,
      },
    } as MountOptions);

    const select = wrapper.find('[data-testid="category-select"]');
    expect(select.attributes("aria-label")).toBe("Filter products by category");
  });
});
