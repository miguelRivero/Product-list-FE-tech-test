import { describe, expect, it } from "vitest";

import ProductDetailNavigation from "./ProductDetailNavigation.vue";
import { mountWithStubs } from "@/test-utils/helpers";

describe("ProductDetailNavigation", () => {
  it("renders back link and action buttons", () => {
    const wrapper = mountWithStubs(ProductDetailNavigation, {
      global: {
        stubs: {
          RouterLink: {
            template: "<a><slot /></a>",
            props: ["to"],
          },
        },
      },
    });

    expect(wrapper.text()).toContain("Back");
    expect(wrapper.text()).toContain("Edit");
    expect(wrapper.text()).toContain("Delete");
  });

  it("emits edit event when edit button is clicked", async () => {
    const wrapper = mountWithStubs(ProductDetailNavigation, {
      global: {
        stubs: {
          RouterLink: {
            template: "<a><slot /></a>",
            props: ["to"],
          },
        },
      },
    });

    const editButton = wrapper.find('button[aria-label="Edit product"]');
    await editButton.trigger("click");

    expect(wrapper.emitted("edit")).toHaveLength(1);
  });

  it("emits delete event when delete button is clicked", async () => {
    const wrapper = mountWithStubs(ProductDetailNavigation, {
      global: {
        stubs: {
          RouterLink: {
            template: "<a><slot /></a>",
            props: ["to"],
          },
        },
      },
    });

    const deleteButton = wrapper.find('button[aria-label="Delete product"]');
    await deleteButton.trigger("click");

    expect(wrapper.emitted("delete")).toHaveLength(1);
  });

  it("renders router link with correct path", () => {
    const wrapper = mountWithStubs(ProductDetailNavigation, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a :data-to="to"><slot /></a>',
            props: ["to"],
          },
        },
      },
    });

    const routerLink = wrapper.find('a[data-to="/"]');
    expect(routerLink.exists()).toBe(true);
    expect(routerLink.text()).toContain("Back");
  });
});
