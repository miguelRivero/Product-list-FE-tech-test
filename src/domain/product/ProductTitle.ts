import { InvalidProductTitleError } from "./errors";

/**
 * ProductTitle Value Object
 * Represents a product title with validation
 */
export class ProductTitle {
  private constructor(private readonly value: string) {
    // Value is already normalized in create(), so we can validate directly
    if (value.length === 0) {
      throw new InvalidProductTitleError("Product title cannot be empty");
    }
    if (value.length > 200) {
      throw new InvalidProductTitleError(
        `Product title cannot exceed 200 characters, got: ${value.length}`
      );
    }
  }

  static create(value: string): ProductTitle {
    // Normalize whitespace: trim and replace multiple spaces with single space
    const normalized = value.trim().replace(/\s+/g, " ");
    return new ProductTitle(normalized);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ProductTitle): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
