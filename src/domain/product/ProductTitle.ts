import { InvalidProductTitleError } from './errors';

/**
 * ProductTitle Value Object
 * Represents a product title with validation
 */
export class ProductTitle {
  private constructor(private readonly value: string) {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new InvalidProductTitleError('Product title cannot be empty');
    }
    if (trimmed.length > 200) {
      throw new InvalidProductTitleError(
        `Product title cannot exceed 200 characters, got: ${trimmed.length}`
      );
    }
  }

  static create(value: string): ProductTitle {
    return new ProductTitle(value);
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
