import { InvalidProductIdError } from './errors';
import { CLIENT_ID_RANGE } from '@/utils/constants';

/**
 * ProductId Value Object
 * Represents a product identifier with validation
 */
export class ProductId {
  private constructor(private readonly value: number) {
    if (value <= 0) {
      throw new InvalidProductIdError(`Product ID must be positive, got: ${value}`);
    }
  }

  static create(value: number): ProductId {
    return new ProductId(value);
  }

  static createClientId(value: number): ProductId {
    // Client IDs are in a specific range
    if (value < CLIENT_ID_RANGE.MIN || value > CLIENT_ID_RANGE.MAX) {
      throw new InvalidProductIdError(
        `Client ID must be in range [${CLIENT_ID_RANGE.MIN}, ${CLIENT_ID_RANGE.MAX}], got: ${value}`
      );
    }
    return new ProductId(value);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: ProductId): boolean {
    return this.value === other.value;
  }

  isClientGenerated(): boolean {
    return this.value >= CLIENT_ID_RANGE.MIN && this.value <= CLIENT_ID_RANGE.MAX;
  }

  toString(): string {
    return this.value.toString();
  }
}
