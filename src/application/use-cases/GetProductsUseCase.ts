import type { ProductRepository } from '@/domain/product/ProductRepository';
import type { Product } from '@/domain/product/Product';

/**
 * GetProductsUseCase
 * Application use case for fetching products with filters
 */
export class GetProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    page: number = 1,
    limit: number = 10,
    category?: string,
    searchQuery?: string
  ): Promise<{ products: Product[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    let result: { products: Product[]; total: number };

    if (searchQuery) {
      result = await this.productRepository.search(searchQuery, limit, skip);
    } else if (category) {
      result = await this.productRepository.findByCategory(category, limit, skip);
    } else {
      result = await this.productRepository.findAll(limit, skip);
    }

    return {
      ...result,
      page,
      limit,
    };
  }
}
