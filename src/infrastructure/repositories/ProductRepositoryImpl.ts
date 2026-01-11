import type { ProductDTO as DomainProductDTO } from "@/domain/product/ProductDTO";
import type { Product } from "@/domain/product/Product";
import type { Product as ProductDTO } from "@/types/product";
import { Product as ProductEntity } from "@/domain/product/Product";
import type { ProductId } from "@/domain/product/ProductId";
import type { ProductRepository } from "@/domain/product/ProductRepository";
import { logger } from "@/utils/logger";
import { productsApi } from "@/services/api";

/**
 * ProductRepositoryImpl
 * Infrastructure implementation of ProductRepository
 * Converts between API DTOs and domain entities
 */
export class ProductRepositoryImpl implements ProductRepository {
  private convertApiProductToDTO(apiProduct: ProductDTO): DomainProductDTO {
    return {
      id: apiProduct.id,
      title: apiProduct.title,
      description: apiProduct.description,
      category: apiProduct.category,
      price: apiProduct.price,
      discountPercentage: apiProduct.discountPercentage,
      stock: apiProduct.stock,
      rating: apiProduct.rating,
      images: apiProduct.images,
      thumbnail: apiProduct.thumbnail,
      tags: apiProduct.tags || [],
      brand: apiProduct.brand,
      sku: apiProduct.sku,
      weight: apiProduct.weight,
      dimensions: apiProduct.dimensions,
      warrantyInformation: apiProduct.warrantyInformation,
      shippingInformation: apiProduct.shippingInformation,
      availabilityStatus: apiProduct.availabilityStatus,
      reviews: apiProduct.reviews,
      returnPolicy: apiProduct.returnPolicy,
      minimumOrderQuantity: apiProduct.minimumOrderQuantity,
      meta: apiProduct.meta,
    };
  }

  async findById(id: ProductId): Promise<Product | null> {
    try {
      const apiProduct = await productsApi.getProduct(id.getValue());
      const dto = this.convertApiProductToDTO(apiProduct);
      return ProductEntity.fromDTO(dto);
    } catch (error) {
      logger.error("Error fetching product", error);
      return null;
    }
  }

  async findAll(
    limit: number = 10,
    skip: number = 0
  ): Promise<{ products: Product[]; total: number }> {
    try {
      const response = await productsApi.getProducts(limit, skip);
      const products = response.products.map(apiProduct => {
        const dto = this.convertApiProductToDTO(apiProduct);
        return ProductEntity.fromDTO(dto);
      });
      return {
        products,
        total: response.total,
      };
    } catch (error) {
      logger.error("Error fetching products", error);
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
      const products = response.products.map(apiProduct => {
        const dto = this.convertApiProductToDTO(apiProduct);
        return ProductEntity.fromDTO(dto);
      });
      return {
        products,
        total: response.total,
      };
    } catch (error) {
      logger.error("Error fetching products by category", error);
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
      const products = response.products.map(apiProduct => {
        const dto = this.convertApiProductToDTO(apiProduct);
        return ProductEntity.fromDTO(dto);
      });
      return {
        products,
        total: response.total,
      };
    } catch (error) {
      logger.error("Error searching products", error);
      throw error;
    }
  }

  async save(product: Product): Promise<Product> {
    try {
      const dto = product.toDTO();

      // For client-generated IDs, we simulate creation
      if (product.getId().isClientGenerated()) {
        // Simulate API call (DummyJSON doesn't persist)
        await productsApi.createProduct({
          title: dto.title,
          description: dto.description,
          price: dto.price,
          discountPercentage: dto.discountPercentage,
          stock: dto.stock,
          category: dto.category,
          tags: dto.tags,
          brand: dto.brand,
        });
        return product;
      } else {
        // Update existing product
        await productsApi.updateProduct(product.getId().getValue(), {
          title: dto.title,
          description: dto.description,
          price: dto.price,
          discountPercentage: dto.discountPercentage,
          stock: dto.stock,
          category: dto.category,
          tags: dto.tags,
          brand: dto.brand,
        });
        return product;
      }
    } catch (error) {
      logger.error("Error saving product", error);
      throw error;
    }
  }

  async delete(id: ProductId): Promise<void> {
    try {
      await productsApi.deleteProduct(id.getValue());
    } catch (error) {
      logger.error("Error deleting product", error);
      throw error;
    }
  }

  async exists(id: ProductId): Promise<boolean> {
    const product = await this.findById(id);
    return product !== null;
  }
}
