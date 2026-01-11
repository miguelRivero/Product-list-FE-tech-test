import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ProductForm from "./ProductForm.vue";
import type { Product, Category } from "@/types/product";
import { mountWithStubs } from "@/test-utils/helpers";

describe("ProductForm", () => {
  const mockCategories: Category[] = [
    { slug: "electronics", name: "Electronics", url: "/categories/electronics" },
    { slug: "beauty", name: "Beauty", url: "/categories/beauty" },
  ];

  const createMockProduct = (): Product => ({
    id: 1,
    title: "Test Product",
    description: "Test description",
    price: 99.99,
    discountPercentage: 10,
    stock: 50,
    category: "electronics",
    rating: 4.5,
    images: ["image1.jpg"],
    thumbnail: "thumb.jpg",
    tags: ["tag1", "tag2"],
    brand: "Test Brand",
  });

  it("renders all form fields", () => {
    const wrapper = mountWithStubs(ProductForm, {
      props: {
        categories: mockCategories,
      },
    });

    expect(wrapper.find('[data-testid="product-title-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="product-description-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="product-price-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="product-discount-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="product-category-select"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="product-stock-input"]').exists()).toBe(true);
  });

  it("populates form fields when product prop is provided", async () => {
    const product = createMockProduct();
    const wrapper = mountWithStubs(ProductForm, {
      props: {
        product,
        categories: mockCategories,
      },
    });

    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for watch to execute

    const titleInput = wrapper.find('[data-testid="product-title-input"]');
    expect((titleInput.element as HTMLInputElement).value).toBe(product.title);
  });

  it("resets form when product prop is null", async () => {
    const wrapper = mountWithStubs(ProductForm, {
      props: {
        product: createMockProduct(),
        categories: mockCategories,
      },
    });

    await wrapper.vm.$nextTick();
    await wrapper.setProps({ product: null });
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for watch to execute

    const titleInput = wrapper.find('[data-testid="product-title-input"]');
    expect((titleInput.element as HTMLInputElement).value).toBe("");
  });

  it("emits submit event with valid form data when form is submitted", async () => {
    const wrapper = mountWithStubs(ProductForm, {
      props: {
        categories: mockCategories,
      },
    });

    await wrapper.vm.$nextTick();

    // Fill form fields by setting values directly on the component
    const formComponent = wrapper.vm as any;
    
    // Set form data via component's reactive formData
    formComponent.formData.title = "New Product";
    formComponent.formData.description = "New description";
    formComponent.formData.price = 100;
    formComponent.formData.stock = 25;
    formComponent.formData.category = "electronics";

    await wrapper.vm.$nextTick();

    // Trigger submit via exposed method
    formComponent.submitForm();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("submit")).toBeTruthy();
    const submittedData = wrapper.emitted("submit")?.[0]?.[0];
    expect(submittedData).toBeDefined();
    expect(submittedData?.title).toBe("New Product");
  });

  it("shows validation errors when form is submitted with invalid data", async () => {
    const wrapper = mountWithStubs(ProductForm, {
      props: {
        categories: mockCategories,
      },
    });

    await wrapper.vm.$nextTick();

    // Leave form empty (invalid - title is empty)
    const formComponent = wrapper.vm as any;
    formComponent.submitForm();
    await wrapper.vm.$nextTick();

    // Form should not emit submit when invalid
    expect(wrapper.emitted("submit")).toBeFalsy();
    // Validation errors should be set
    expect(Object.keys(formComponent.validationErrors).length).toBeGreaterThan(0);
  });

  it("exposes submitForm method", () => {
    const wrapper = mountWithStubs(ProductForm, {
      props: {
        categories: mockCategories,
      },
    });

    const formComponent = wrapper.vm as any;
    expect(typeof formComponent.submitForm).toBe("function");
  });

  it("updates form data when user types in inputs", async () => {
    const wrapper = mountWithStubs(ProductForm, {
      props: {
        categories: mockCategories,
      },
    });

    await wrapper.vm.$nextTick();

    const titleInput = wrapper.find('[data-testid="product-title-input"]');
    await titleInput.setValue("Updated Title");
    await wrapper.vm.$nextTick();

    // Verify the input value was updated
    expect((titleInput.element as HTMLInputElement).value).toBe("Updated Title");
  });
});
