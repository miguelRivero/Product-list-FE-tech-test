import { InvalidStockError } from "./errors";

/**
 * Stock Value Object
 * Represents product stock quantity with validation and behavior
 */
export class Stock {
  private constructor(private readonly value: number) {
    if (!Number.isInteger(value)) {
      throw new InvalidStockError(`Stock must be an integer, got: ${value}`);
    }
    if (value < 0) {
      throw new InvalidStockError(`Stock cannot be negative, got: ${value}`);
    }
    if (value > 999999) {
      throw new InvalidStockError(`Stock cannot exceed 999999, got: ${value}`);
    }
  }

  static create(value: number): Stock {
    return new Stock(value);
  }

  static zero(): Stock {
    return new Stock(0);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: Stock): boolean {
    return this.value === other.value;
  }
}
