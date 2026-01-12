import type { ProductRepository } from "@/domain/product/ProductRepository";
import { ProductId } from "@/domain/product/ProductId";
import { ProductTitle } from "@/domain/product/ProductTitle";
import { Money } from "@/domain/product/Money";
import { Stock } from "@/domain/product/Stock";
import { DiscountPercentage } from "@/domain/product/DiscountPercentage";
import { ProductNotFoundError } from "@/domain/product/errors";
import type { ProductFormData } from "@/types/product";
import type { Product } from "@/domain/product/Product";

/**
 * UpdateProductUseCase
 * Application use case for updating an existing product
 */
export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    id: number,
    updates: Partial<ProductFormData>
  ): Promise<Product> {
    const productId = ProductId.create(id);
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ProductNotFoundError(`Product with ID ${id} not found`);
    }

    // Update using domain methods (invariant enforcement happens in entity)
    if (updates.title !== undefined) {
      product.updateTitle(ProductTitle.create(updates.title));
    }

    if (updates.description !== undefined) {
      product.updateDescription(updates.description);
    }

    if (updates.price !== undefined) {
      product.updatePrice(Money.create(updates.price));
    }

    if (updates.discountPercentage !== undefined) {
      const discount = DiscountPercentage.create(updates.discountPercentage);
      product.applyDiscount(discount);
    }

    if (updates.stock !== undefined) {
      product.updateStock(Stock.create(updates.stock));
    }

    if (updates.category !== undefined) {
      product.updateCategory(updates.category);
    }

    // Domain validation happens in Product entity methods
    // Save through repository
    return await this.productRepository.save(product);
  }
}
