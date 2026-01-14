import { describe, expect, it } from "vitest";

import { useImageError } from "./useImageError";

describe("useImageError", () => {
  it("provides placeholder image", () => {
    const { placeholderImage } = useImageError();

    expect(placeholderImage).toBeDefined();
    expect(typeof placeholderImage).toBe("string");
    expect(placeholderImage).toContain("data:image/svg+xml");
    expect(placeholderImage).toContain("No Image");
  });

  it("handles image error by setting placeholder", () => {
    const { handleImageError, placeholderImage } = useImageError();

    // Create a mock image element
    const img = document.createElement("img");
    img.src = "invalid-image.jpg";

    // Create a mock event
    const event = new Event("error");
    Object.defineProperty(event, "target", {
      value: img,
      writable: false,
    });

    // Call handler
    handleImageError(event as unknown as Event);

    expect(img.src).toBe(placeholderImage);
  });

  it("does not throw when event target is not an image", () => {
    const { handleImageError } = useImageError();

    // Create a mock event without target
    const event = new Event("error");

    // Should not throw
    expect(() => handleImageError(event)).not.toThrow();
  });

  it("handles event with null target", () => {
    const { handleImageError } = useImageError();

    const event = new Event("error");
    Object.defineProperty(event, "target", {
      value: null,
      writable: false,
    });

    expect(() => handleImageError(event as unknown as Event)).not.toThrow();
  });

  it("handles event with non-image target", () => {
    const { handleImageError } = useImageError();

    const div = document.createElement("div");
    const event = new Event("error");
    Object.defineProperty(event, "target", {
      value: div,
      writable: false,
    });

    expect(() => handleImageError(event as unknown as Event)).not.toThrow();
  });
});
