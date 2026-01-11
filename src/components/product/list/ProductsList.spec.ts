import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ProductsList from "./ProductsList.vue";
import type { Product, Category } from "@/types/product";
import { mountWithStubs } from "@/test-utils/helpers";

describe("ProductsList", () => {
  const mockCategories: Category[] = [
    { slug: "electronics", name: "Electronics", url: "/categories/electronics" },
  ];

  const createMockProducts = (count: number): Product[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: `Product ${i + 1}`,
      description: `Description ${i + 1}`,
      price: 99.99 + i,
      discountPercentage: 0,
      stock: 50 + i,
      category: "electronics",
      rating: 4.5,
      images: ["image1.jpg"],
      thumbnail: "thumb.jpg",
    }));
  };

  it("renders products table", () => {
    const products = createMockProducts(2);
    const wrapper = mountWithStubs(ProductsList, {
      props: {
        products,
        categories: mockCategories,
      },
    });

    expect(wrapper.find('[data-testid="products-table"]').exists()).toBe(true);
  });

  it("renders correct number of product rows", () => {
    const products = createMockProducts(3);
    const wrapper = mountWithStubs(ProductsList, {
      props: {
        products,
        categories: mockCategories,
      },
    });

    const rows = wrapper.findAll('[data-testid="product-row"]');
    expect(rows.length).toBe(3);
  });

  it("displays product information in table cells", () => {
    const products = createMockProducts(1);
    const wrapper = mountWithStubs(ProductsList, {
      props: {
        products,
        categories: mockCategories,
      },
    });

    expect(wrapper.text()).toContain("Product 1");
    expect(wrapper.text()).toContain("$99.99");
    expect(wrapper.text()).toContain("50");
  });

  it("emits view event when view button is clicked", async () => {
    const products = createMockProducts(1);
    const wrapper = mountWithStubs(ProductsList, {
      props: {
        products,
        categories: mockCategories,
      },
    });

    const viewButton = wrapper.find('[data-testid="view-button"]');
    await viewButton.trigger("click");

    expect(wrapper.emitted("view")).toBeTruthy();
    expect(wrapper.emitted("view")?.[0]).toEqual([1]);
  });

  it("emits edit event when edit button is clicked", async () => {
    const products = createMockProducts(1);
    const wrapper = mountWithStubs(ProductsList, {
      props: {
        products,
        categories: mockCategories,
      },
    });

    const editButton = wrapper.find('[data-testid="edit-button"]');
    await editButton.trigger("click");

    expect(wrapper.emitted("edit")).toBeTruthy();
    expect(wrapper.emitted("edit")?.[0]).toEqual([1]);
  });

  it("emits delete event when delete button is clicked", async () => {
    const products = createMockProducts(1);
    const wrapper = mountWithStubs(ProductsList, {
      props: {
        products,
        categories: mockCategories,
      },
    });

    const deleteButton = wrapper.find('[data-testid="delete-button"]');
    await deleteButton.trigger("click");

    expect(wrapper.emitted("delete")).toBeTruthy();
    expect(wrapper.emitted("delete")?.[0]).toEqual([products[0]]);
  });

  it("handles empty products array", () => {
    const wrapper = mountWithStubs(ProductsList, {
      props: {
        products: [],
        categories: mockCategories,
      },
    });

    const rows = wrapper.findAll('[data-testid="product-row"]');
    expect(rows.length).toBe(0);
  });
});
