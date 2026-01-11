import { InvalidDiscountPercentageError } from './errors';

/**
 * DiscountPercentage Value Object
 * Represents a discount percentage with validation
 */
export class DiscountPercentage {
  private constructor(private readonly value: number) {
    if (value < 0 || value > 100) {
      throw new InvalidDiscountPercentageError(
        `Discount must be between 0 and 100, got: ${value}`
      );
    }
  }

  static create(value: number): DiscountPercentage {
    return new DiscountPercentage(value);
  }

  static none(): DiscountPercentage {
    return new DiscountPercentage(0);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: DiscountPercentage): boolean {
    return this.value === other.value;
  }
}
