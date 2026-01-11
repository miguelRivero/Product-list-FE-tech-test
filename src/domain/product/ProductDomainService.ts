import type { Product } from './Product';
import { DuplicateProductTitleError } from './errors';

/**
 * ProductDomainService
 * Domain service for cross-aggregate operations and complex business rules
 */
export class ProductDomainService {
  /**
   * Validate product creation against business rules
   * Business rule: Check for duplicate titles (case-insensitive)
   */
  validateProductCreation(product: Product, existingProducts: Product[]): void {
    const duplicate = existingProducts.find(
      (p) =>
        p.getTitle().getValue().toLowerCase() ===
        product.getTitle().getValue().toLowerCase()
    );

    if (duplicate) {
      throw new DuplicateProductTitleError(
        `Product with title "${product.getTitle().getValue()}" already exists`
      );
    }
  }
}
