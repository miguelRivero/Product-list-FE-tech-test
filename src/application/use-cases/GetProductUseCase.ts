import type { ProductRepository } from '@/domain/product/ProductRepository';
import { ProductId } from '@/domain/product/ProductId';
import { ProductNotFoundError } from '@/domain/product/errors';
import type { Product } from '@/domain/product/Product';

/**
 * GetProductUseCase
 * Application use case for fetching a single product by ID
 */
export class GetProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number): Promise<Product> {
    const productId = ProductId.create(id);
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ProductNotFoundError(`Product with ID ${id} not found`);
    }

    return product;
  }
}
