import type { Product as ApiProduct } from "@/types/product";
import type { ProductDTO as DomainProductDTO } from "@/domain/product/ProductDTO";
import type { Product } from "@/domain/product/Product";
import { Product as ProductEntity } from "@/domain/product/Product";
import type { ProductFormData } from "@/types/product";

/**
 * ProductMapper
 * Infrastructure layer mapper for converting between API types and Domain entities
 *
 * Responsibilities:
 * - Converts API Product responses to Domain Product entities
 * - Converts Domain Product entities to API payloads (for POST/PUT)
 * - Handles data transformation between infrastructure and domain layers
 */
export class ProductMapper {
  /**
   * Converts an API Product response to a Domain Product entity
   *
   * Note: Some fields from the API (weight, dimensions, warrantyInformation,
   * shippingInformation, availabilityStatus, reviews, returnPolicy, minimumOrderQuantity)
   * are included in ProductDTO but are not stored in the Product entity.
   * These fields will be lost during conversion to Domain entity.
   *
   * @param apiProduct - Product from API response
   * @returns Domain Product entity
   */
  static toDomain(apiProduct: ApiProduct): Product {
    const dto = this.apiToDTO(apiProduct);
    return ProductEntity.fromDTO(dto);
  }

  /**
   * Converts a Domain Product entity to an API Product payload
   * Used for POST/PUT requests to the API
   *
   * Note: Some fields (weight, dimensions, warrantyInformation, etc.) may be
   * undefined in the output because they are not stored in the Product entity,
   * even though they exist in ProductDTO.
   *
   * @param product - Domain Product entity
   * @returns API Product payload
   */
  static toApi(product: Product): ApiProduct {
    const dto = product.toDTO();
    return this.dtoToApi(dto);
  }

  /**
   * Converts a Domain Product entity to ProductFormData
   * Used for creating/updating products via API
   * @param product - Domain Product entity
   * @returns ProductFormData for API requests
   */
  static toFormData(product: Product): ProductFormData {
    const dto = product.toDTO();
    return {
      title: dto.title,
      description: dto.description,
      price: dto.price,
      discountPercentage: dto.discountPercentage,
      stock: dto.stock,
      category: dto.category,
      tags: dto.tags,
      brand: dto.brand,
    };
  }

  /**
   * Converts API Product to Domain ProductDTO
   * @param apiProduct - Product from API response
   * @returns Domain ProductDTO
   */
  private static apiToDTO(apiProduct: ApiProduct): DomainProductDTO {
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

  /**
   * Converts Domain ProductDTO to API Product
   * @param dto - Domain ProductDTO
   * @returns API Product
   */
  private static dtoToApi(dto: DomainProductDTO): ApiProduct {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      category: dto.category,
      price: dto.price,
      discountPercentage: dto.discountPercentage,
      stock: dto.stock,
      rating: dto.rating,
      images: dto.images,
      thumbnail: dto.thumbnail,
      tags: dto.tags,
      brand: dto.brand,
      sku: dto.sku,
      weight: dto.weight,
      dimensions: dto.dimensions,
      warrantyInformation: dto.warrantyInformation,
      shippingInformation: dto.shippingInformation,
      availabilityStatus: dto.availabilityStatus,
      reviews: dto.reviews,
      returnPolicy: dto.returnPolicy,
      minimumOrderQuantity: dto.minimumOrderQuantity,
      meta: dto.meta,
    };
  }
}
