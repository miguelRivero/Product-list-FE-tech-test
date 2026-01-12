import { InvalidPriceError } from "./errors";

/**
 * Price Value Object
 * Represents product price with currency
 */
export class Price {
  private constructor(
    private readonly amount: number,
    private readonly currency: string = "USD"
  ) {
    if (amount < 0) {
      throw new InvalidPriceError(
        `Price amount cannot be negative, got: ${amount}`
      );
    }
    if (!Number.isFinite(amount)) {
      throw new InvalidPriceError(
        `Price amount must be finite, got: ${amount}`
      );
    }
  }

  static create(amount: number, currency: string = "USD"): Price {
    return new Price(amount, currency);
  }

  static zero(currency: string = "USD"): Price {
    return new Price(0, currency);
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  equals(other: Price): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toString(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }
}
