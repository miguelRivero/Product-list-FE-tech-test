import type { ProductRepository } from '@/domain/product/ProductRepository';
import { ProductId } from '@/domain/product/ProductId';
import { ProductNotFoundError } from '@/domain/product/errors';

/**
 * DeleteProductUseCase
 * Application use case for deleting a product
 */
export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number): Promise<void> {
    const productId = ProductId.create(id);

    // Check if product exists
    const exists = await this.productRepository.exists(productId);
    if (!exists) {
      throw new ProductNotFoundError(`Product with ID ${id} not found`);
    }

    // Delete through repository
    await this.productRepository.delete(productId);
  }
}
