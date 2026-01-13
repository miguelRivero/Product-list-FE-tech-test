import type { Product } from "@/domain/product/Product";
import type { ProductId } from "@/domain/product/ProductId";
import { ProductMapper } from "@/infrastructure/mappers/ProductMapper";
import type { ProductRepository } from "@/domain/product/ProductRepository";
import { logger } from "@/utils/logger";
import { productsApi } from "@/services/api";

/**
 * ProductRepositoryImpl
 * Infrastructure implementation of ProductRepository
 * Handles data access operations and delegates mapping to ProductMapper
 */
export class ProductRepositoryImpl implements ProductRepository {
  private handleError(error: unknown, message: string): void {
    const errorInstance =
      error instanceof Error ? error : new Error(String(error));
    logger.error(message, errorInstance);
  }

  async findById(id: ProductId): Promise<Product | null> {
    try {
      const apiProduct = await productsApi.getProduct(id.getValue());
      return ProductMapper.toDomain(apiProduct);
    } catch (error) {
      this.handleError(error, "Error fetching product");
      return null;
    }
  }

  async findAll(
    limit: number = 10,
    skip: number = 0
  ): Promise<{ products: Product[]; total: number }> {
    try {
      const response = await productsApi.getProducts(limit, skip);
      const products = response.products.map(apiProduct =>
        ProductMapper.toDomain(apiProduct)
      );
      return {
        products,
        total: response.total,
      };
    } catch (error) {
      this.handleError(error, "Error fetching products");
      throw error;
    }
  }

  async findByCategory(
    category: string,
    limit: number = 10,
    skip: number = 0
  ): Promise<{ products: Product[]; total: number }> {
    try {
      const response = await productsApi.getProductsByCategory(
        category,
        limit,
        skip
      );
      const products = response.products.map(apiProduct =>
        ProductMapper.toDomain(apiProduct)
      );
      return {
        products,
        total: response.total,
      };
    } catch (error) {
      this.handleError(error, "Error fetching products by category");
      throw error;
    }
  }

  async search(
    query: string,
    limit: number = 10,
    skip: number = 0
  ): Promise<{ products: Product[]; total: number }> {
    try {
      const response = await productsApi.searchProducts(query, limit, skip);
      const products = response.products.map(apiProduct =>
        ProductMapper.toDomain(apiProduct)
      );
      return {
        products,
        total: response.total,
      };
    } catch (error) {
      this.handleError(error, "Error searching products");
      throw error;
    }
  }

  async save(product: Product): Promise<Product> {
    try {
      const formData = ProductMapper.toFormData(product);

      // For client-generated IDs, we simulate creation
      if (product.getId().isClientGenerated()) {
        // Simulate API call (DummyJSON doesn't persist)
        await productsApi.createProduct(formData);
        return product;
      } else {
        // Update existing product
        await productsApi.updateProduct(product.getId().getValue(), formData);
        return product;
      }
    } catch (error) {
      this.handleError(error, "Error saving product");
      throw error;
    }
  }

  async delete(id: ProductId): Promise<void> {
    try {
      await productsApi.deleteProduct(id.getValue());
    } catch (error) {
      this.handleError(error, "Error deleting product");
      throw error;
    }
  }

  async exists(id: ProductId): Promise<boolean> {
    const product = await this.findById(id);
    return product !== null;
  }

  async existsByTitle(title: string): Promise<boolean> {
    try {
      // Use search API to find products by title (case-insensitive)
      // DummyJSON search is case-insensitive by default
      const response = await productsApi.searchProducts(title, 1, 0);

      // Check if any product matches the title exactly (case-insensitive)
      return response.products.some(
        product => product.title.toLowerCase() === title.toLowerCase()
      );
    } catch (error) {
      this.handleError(error, "Error checking if product title exists");
      // On error, assume it doesn't exist to avoid blocking creation
      return false;
    }
  }
}
