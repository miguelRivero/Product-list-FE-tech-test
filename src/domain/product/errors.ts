/**
 * Domain Errors
 * Base error class and specific domain error types
 */

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class InvalidProductIdError extends DomainError {}
export class InvalidMoneyError extends DomainError {}
export class InvalidDiscountPercentageError extends DomainError {}
export class InvalidProductTitleError extends DomainError {}
export class InvalidStockError extends DomainError {}
export class InvalidProductError extends DomainError {}
export class ProductNotFoundError extends DomainError {}
export class DuplicateProductTitleError extends DomainError {}
