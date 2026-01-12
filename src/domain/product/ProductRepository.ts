import type { Product } from './Product';
import type { ProductId } from './ProductId';

/**
 * ProductRepository Interface (Domain Layer)
 * Defines the contract for product persistence operations
 */
export interface ProductRepository {
  findById(id: ProductId): Promise<Product | null>;
  findAll(limit?: number, skip?: number): Promise<{ products: Product[]; total: number }>;
  findByCategory(
    category: string,
    limit?: number,
    skip?: number
  ): Promise<{ products: Product[]; total: number }>;
  search(
    query: string,
    limit?: number,
    skip?: number
  ): Promise<{ products: Product[]; total: number }>;
  save(product: Product): Promise<Product>;
  delete(id: ProductId): Promise<void>;
  exists(id: ProductId): Promise<boolean>;
  /**
   * Check if a product with the given title exists (case-insensitive)
   * @param title - Product title to check
   * @returns true if a product with this title exists, false otherwise
   */
  existsByTitle(title: string): Promise<boolean>;
}
