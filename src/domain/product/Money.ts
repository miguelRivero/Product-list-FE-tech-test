import { InvalidMoneyError } from "./errors";

/**
 * Money Value Object
 * Represents monetary values with currency
 */
export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string = "USD"
  ) {
    if (amount < 0) {
      throw new InvalidMoneyError(
        `Money amount cannot be negative, got: ${amount}`
      );
    }
    if (!Number.isFinite(amount)) {
      throw new InvalidMoneyError(
        `Money amount must be finite, got: ${amount}`
      );
    }
  }

  static create(amount: number, currency: string = "USD"): Money {
    return new Money(amount, currency);
  }

  static zero(currency: string = "USD"): Money {
    return new Money(0, currency);
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toString(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }
}
