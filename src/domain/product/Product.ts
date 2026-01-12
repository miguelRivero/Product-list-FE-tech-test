import { DiscountPercentage } from "./DiscountPercentage";
import { InvalidProductError } from "./errors";
import { Price } from "./Price";
import type { ProductDTO } from "./ProductDTO";
import { ProductId } from "./ProductId";
import { ProductTitle } from "./ProductTitle";
import { Stock } from "./Stock";

/**
 * Product Entity (Aggregate Root)
 * Represents a product with domain behavior and business rules
 */
export class Product {
  private constructor(
    private readonly id: ProductId,
    private title: ProductTitle,
    private description: string,
    private category: string, // Category name as string (matches API)
    private price: Price,
    private discountPercentage: DiscountPercentage,
    private stock: Stock,
    private rating: number,
    private readonly images: string[],
    private readonly thumbnail: string,
    private readonly tags: string[],
    private readonly brand?: string,
    private readonly sku?: string,
    // Preserve meta field for createdAt/updatedAt (used in ProductDetailMetadata)
    private readonly meta?: {
      createdAt: string;
      updatedAt: string;
      barcode?: string;
      qrCode?: string;
    }
  ) {
    this.validate();
  }

  static create(params: {
    id: ProductId;
    title: ProductTitle;
    description: string;
    category: string;
    price: Price;
    discountPercentage?: DiscountPercentage;
    stock: Stock;
    rating?: number;
    images?: string[];
    thumbnail?: string;
    tags?: string[];
    brand?: string;
    sku?: string;
    meta?: {
      createdAt: string;
      updatedAt: string;
      barcode?: string;
      qrCode?: string;
    };
  }): Product {
    return new Product(
      params.id,
      params.title,
      params.description,
      params.category,
      params.price,
      params.discountPercentage || DiscountPercentage.none(),
      params.stock,
      params.rating || 0,
      params.images || [],
      params.thumbnail || "",
      params.tags || [],
      params.brand,
      params.sku,
      params.meta
    );
  }

  private validate(): void {
    if (this.description.trim().length === 0) {
      throw new InvalidProductError("Product description cannot be empty");
    }
    if (this.description.length > 5000) {
      throw new InvalidProductError(
        `Product description cannot exceed 5000 characters, got: ${this.description.length}`
      );
    }
    if (this.rating < 0 || this.rating > 5) {
      throw new InvalidProductError(
        `Rating must be between 0 and 5, got: ${this.rating}`
      );
    }
  }

  // Getters
  getId(): ProductId {
    return this.id;
  }

  getTitle(): ProductTitle {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getCategory(): string {
    return this.category;
  }

  getPrice(): Price {
    return this.price;
  }

  getDiscountPercentage(): DiscountPercentage {
    return this.discountPercentage;
  }

  getStock(): Stock {
    return this.stock;
  }

  getRating(): number {
    return this.rating;
  }

  getImages(): string[] {
    return this.images;
  }

  getThumbnail(): string {
    return this.thumbnail;
  }

  getTags(): string[] {
    return this.tags;
  }

  getBrand(): string | undefined {
    return this.brand;
  }

  getSku(): string | undefined {
    return this.sku;
  }

  // Domain methods (behavior)
  updateTitle(newTitle: ProductTitle): void {
    this.title = newTitle;
  }

  updateDescription(newDescription: string): void {
    if (newDescription.trim().length === 0) {
      throw new InvalidProductError("Product description cannot be empty");
    }
    if (newDescription.length > 5000) {
      throw new InvalidProductError(
        `Product description cannot exceed 5000 characters, got: ${newDescription.length}`
      );
    }
    this.description = newDescription;
  }

  updatePrice(newPrice: Price): void {
    this.price = newPrice;
  }

  updateCategory(newCategory: string): void {
    if (!newCategory || newCategory.trim().length === 0) {
      throw new InvalidProductError("Product category cannot be empty");
    }
    this.category = newCategory;
  }

  applyDiscount(percentage: DiscountPercentage): void {
    this.discountPercentage = percentage;
  }

  updateStock(newStock: Stock): void {
    this.stock = newStock;
  }

  // Factory method to create from DTO
  static fromDTO(dto: ProductDTO): Product {
    return Product.create({
      id: ProductId.create(dto.id),
      title: ProductTitle.create(dto.title),
      description: dto.description,
      category: dto.category,
      price: Price.create(dto.price),
      discountPercentage: DiscountPercentage.create(
        dto.discountPercentage || 0
      ),
      stock: Stock.create(dto.stock),
      rating: dto.rating || 0,
      images: dto.images,
      thumbnail: dto.thumbnail,
      tags: dto.tags,
      brand: dto.brand,
      sku: dto.sku,
      meta: dto.meta,
    });
  }

  // Convert to DTO for infrastructure layer
  toDTO(): ProductDTO {
    return {
      id: this.id.getValue(),
      title: this.title.getValue(),
      description: this.description,
      category: this.category,
      price: this.price.getAmount(),
      discountPercentage: this.discountPercentage.getValue(),
      stock: this.stock.getValue(),
      rating: this.rating,
      images: this.images,
      thumbnail: this.thumbnail,
      tags: this.tags,
      brand: this.brand,
      sku: this.sku,
      meta: this.meta,
    };
  }
}
