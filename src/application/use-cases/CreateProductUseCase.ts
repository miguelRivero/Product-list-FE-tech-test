import type { ProductRepository } from '@/domain/product/ProductRepository';
import type { ProductDomainService } from '@/domain/product/ProductDomainService';
import { Product } from '@/domain/product/Product';
import { ProductId } from '@/domain/product/ProductId';
import { ProductTitle } from '@/domain/product/ProductTitle';
import { Money } from '@/domain/product/Money';
import { Stock } from '@/domain/product/Stock';
import { DiscountPercentage } from '@/domain/product/DiscountPercentage';
import { DuplicateProductTitleError } from '@/domain/product/errors';
import type { ProductFormData } from '@/types/product';

/**
 * CreateProductUseCase
 * Application use case for creating a new product
 */
export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productDomainService: ProductDomainService
  ) {}

  async execute(data: ProductFormData, clientId: number): Promise<Product> {
    // Create value objects from input data
    const id = ProductId.createClientId(clientId);
    const title = ProductTitle.create(data.title);
    const price = Money.create(data.price);
    const stock = Stock.create(data.stock);
    const discount = data.discountPercentage
      ? DiscountPercentage.create(data.discountPercentage)
      : DiscountPercentage.none();

    // Create placeholder image (SVG data URI)
    const placeholderImage =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23e2e2e2' width='300' height='200'/%3E%3Ctext fill='%236b7280' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

    // Check for duplicate title (optimized: uses existsByTitle instead of loading all products)
    const titleExists = await this.productRepository.existsByTitle(data.title);
    if (titleExists) {
      throw new DuplicateProductTitleError(
        `Product with title "${data.title}" already exists`
      );
    }

    // Create domain entity
    const product = Product.create({
      id,
      title,
      description: data.description,
      category: data.category,
      price,
      discountPercentage: discount,
      stock,
      images: [placeholderImage],
      thumbnail: placeholderImage,
      tags: data.tags,
      brand: data.brand,
    });

    // Save through repository
    return await this.productRepository.save(product);
  }
}
