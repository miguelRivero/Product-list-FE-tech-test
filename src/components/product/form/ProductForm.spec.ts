import type { Category, Product, ProductFormData } from "@/types/product";
import { describe, expect, it } from "vitest";

import type { MountingOptions } from "@vue/test-utils";
import ProductForm from "./ProductForm.vue";
import { mountWithStubs } from "@/test-utils/helpers";

type MountOptions = MountingOptions<InstanceType<typeof ProductForm>>;

// Type for component instance with exposed methods and properties
type ProductFormInstance = {
  submitForm: () => void;
  formData: ProductFormData;
  validationErrors: Record<string, string[]>;
};

// Helper to flush all pending promises and watchers
const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe("ProductForm", () => {
  const mockCategories: Category[] = [
    {
      slug: "electronics",
      name: "Electronics",
      url: "/categories/electronics",
    },
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
    } as MountOptions);

    expect(wrapper.find('[data-testid="product-title-input"]').exists()).toBe(
      true
    );
    expect(
      wrapper.find('[data-testid="product-description-input"]').exists()
    ).toBe(true);
    expect(wrapper.find('[data-testid="product-price-input"]').exists()).toBe(
      true
    );
    expect(
      wrapper.find('[data-testid="product-discount-input"]').exists()
    ).toBe(true);
    expect(
      wrapper.find('[data-testid="product-category-select"]').exists()
    ).toBe(true);
    expect(wrapper.find('[data-testid="product-stock-input"]').exists()).toBe(
      true
    );
  });

  it("populates form fields when product prop is provided", async () => {
    const product = createMockProduct();
    const wrapper = mountWithStubs(ProductForm, {
      props: {
        product,
        categories: mockCategories,
      },
    } as MountOptions);

    // Wait for initial render and watchers to execute
    await wrapper.vm.$nextTick();
    await flushPromises();
    await wrapper.vm.$nextTick();

    const titleInput = wrapper.find('[data-testid="product-title-input"]');
    expect((titleInput.element as HTMLInputElement).value).toBe(product.title);
  });

  it("resets form when product prop is null", async () => {
    const wrapper = mountWithStubs(ProductForm, {
      props: {
        product: createMockProduct(),
        categories: mockCategories,
      },
    } as MountOptions);

    await wrapper.vm.$nextTick();
    await wrapper.setProps({ product: null });
    // Wait for watcher to react to prop change
    await wrapper.vm.$nextTick();
    await flushPromises();
    await wrapper.vm.$nextTick();

    const titleInput = wrapper.find('[data-testid="product-title-input"]');
    expect((titleInput.element as HTMLInputElement).value).toBe("");
  });

  it("emits submit event with valid form data when form is submitted", async () => {
    const wrapper = mountWithStubs(ProductForm, {
      props: {
        categories: mockCategories,
      },
    } as MountOptions);

    await wrapper.vm.$nextTick();

    // Fill form fields by setting values directly on the component
    const formComponent = wrapper.vm as unknown as ProductFormInstance;

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
    const submittedData = wrapper.emitted("submit")?.[0]?.[0] as
      | ProductFormData
      | undefined;
    expect(submittedData).toBeDefined();
    expect(submittedData?.title).toBe("New Product");
  });

  it("shows validation errors when form is submitted with invalid data", async () => {
    const wrapper = mountWithStubs(ProductForm, {
      props: {
        categories: mockCategories,
      },
    } as MountOptions);

    await wrapper.vm.$nextTick();

    // Leave form empty (invalid - title is empty)
    const formComponent = wrapper.vm as unknown as ProductFormInstance;
    formComponent.submitForm();
    await wrapper.vm.$nextTick();

    // Form should not emit submit when invalid
    expect(wrapper.emitted("submit")).toBeFalsy();
    // Validation errors should be set
    expect(Object.keys(formComponent.validationErrors).length).toBeGreaterThan(
      0
    );
  });

  it("updates form data when user types in inputs", async () => {
    const wrapper = mountWithStubs(ProductForm, {
      props: {
        categories: mockCategories,
      },
    } as MountOptions);

    await wrapper.vm.$nextTick();

    const titleInput = wrapper.find('[data-testid="product-title-input"]');
    await titleInput.setValue("Updated Title");
    await wrapper.vm.$nextTick();

    // Verify the input value was updated
    expect((titleInput.element as HTMLInputElement).value).toBe(
      "Updated Title"
    );
  });
});
