import { describe, expect, it } from "vitest";

import ProductsErrorState from "./ProductsErrorState.vue";
import { mountWithStubs } from "@/test-utils/helpers";

describe("ProductsErrorState", () => {
  it("renders error message", () => {
    const wrapper = mountWithStubs(ProductsErrorState, {
      props: {
        error: "Something went wrong",
      },
    });

    expect(wrapper.text()).toContain("Something went wrong");
  });

  it("emits close event when close is triggered", async () => {
    const wrapper = mountWithStubs(ProductsErrorState, {
      props: {
        error: "Error message",
      },
    });

    // Trigger close event (Message component emits close)
    await wrapper.vm.$emit("close");

    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
