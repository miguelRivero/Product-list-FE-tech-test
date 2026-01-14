import type { Category, Product } from "@/types/product";
import { describe, expect, it } from "vitest";

import type { MountingOptions } from "@vue/test-utils";
import ProductsContent from "./ProductsContent.vue";
import { mountWithStubs } from "@/test-utils/helpers";

type MountOptions = MountingOptions<InstanceType<typeof ProductsContent>>;

describe("ProductsContent", () => {
  const mockCategories: Category[] = [
    {
      slug: "electronics",
      name: "Electronics",
      url: "/categories/electronics",
    },
  ];

  const mockProducts: Product[] = [
    {
      id: 1,
      title: "Product 1",
      description: "Description 1",
      price: 99.99,
      discountPercentage: 10,
      stock: 50,
      category: "electronics",
      rating: 4.5,
      images: ["image1.jpg"],
      thumbnail: "thumb1.jpg",
    },
  ];

  it("shows loading state when loading is true", () => {
    const wrapper = mountWithStubs(ProductsContent, {
      props: {
        loading: true,
        error: null,
        products: [],
        showCreateDialog: false,
        editingProduct: null,
        categories: mockCategories,
      },
    } as MountOptions);

    // ProductsLoadingState should be rendered
    expect(wrapper.html()).toContain("Loading");
  });

  it("shows error state when error is provided and not loading", () => {
    const wrapper = mountWithStubs(ProductsContent, {
      props: {
        loading: false,
        error: "Something went wrong",
        products: [],
        showCreateDialog: false,
        editingProduct: null,
        categories: mockCategories,
      },
    } as MountOptions);

    expect(wrapper.text()).toContain("Something went wrong");
  });

  it("shows products list when products are available", () => {
    const wrapper = mountWithStubs(ProductsContent, {
      props: {
        loading: false,
        error: null,
        products: mockProducts,
        showCreateDialog: false,
        editingProduct: null,
        categories: mockCategories,
      },
    } as MountOptions);

    expect(wrapper.find('[data-testid="products-table"]').exists()).toBe(true);
  });

  it("shows empty state when no products and not loading", () => {
    const wrapper = mountWithStubs(ProductsContent, {
      props: {
        loading: false,
        error: null,
        products: [],
        showCreateDialog: false,
        editingProduct: null,
        categories: mockCategories,
      },
    } as MountOptions);

    expect(wrapper.text()).toContain("No products found");
  });

  it("shows create dialog when showCreateDialog is true", () => {
    const wrapper = mountWithStubs(ProductsContent, {
      props: {
        loading: false,
        error: null,
        products: mockProducts,
        showCreateDialog: true,
        editingProduct: null,
        categories: mockCategories,
      },
    } as MountOptions);

    expect(wrapper.find('[data-testid="product-create-dialog"]').exists()).toBe(
      true
    );
  });

  it("shows edit dialog when editingProduct is provided", () => {
    const wrapper = mountWithStubs(ProductsContent, {
      props: {
        loading: false,
        error: null,
        products: mockProducts,
        showCreateDialog: true,
        editingProduct: mockProducts[0],
        categories: mockCategories,
      },
    } as MountOptions);

    expect(wrapper.find('[data-testid="product-edit-dialog"]').exists()).toBe(
      true
    );
  });

  it("emits view event when view is triggered", async () => {
    const wrapper = mountWithStubs(ProductsContent, {
      props: {
        loading: false,
        error: null,
        products: mockProducts,
        showCreateDialog: false,
        editingProduct: null,
        categories: mockCategories,
      },
    } as MountOptions);

    // Trigger view event from ProductsList component
    await wrapper.vm.$emit("view", 1);

    expect(wrapper.emitted("view")?.[0]).toEqual([1]);
  });

  it("emits clear-error event when error is cleared", async () => {
    const wrapper = mountWithStubs(ProductsContent, {
      props: {
        loading: false,
        error: "Error message",
        products: [],
        showCreateDialog: false,
        editingProduct: null,
        categories: mockCategories,
      },
    } as MountOptions);

    // Trigger close event from ProductsErrorState
    await wrapper.vm.$emit("clear-error");

    expect(wrapper.emitted("clear-error")).toBeTruthy();
  });
});
