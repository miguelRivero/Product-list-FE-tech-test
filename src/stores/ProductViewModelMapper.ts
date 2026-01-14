import type { Product as DomainProduct } from "@/domain/product/Product";
import type { Product as ApiProduct } from "@/types/product";

/**
 * ProductViewModelMapper
 * Presentation layer mapper for converting Domain entities to View Models
 *
 * This mapper prepares domain Product entities for consumption by the View layer.
 * It converts domain entities to the API Product type that components expect.
 *
 * **Architectural Pattern: ViewModel (MVVM)**
 * - Domain entities are transformed into ViewModels suitable for UI components
 * - Separates domain concerns from presentation concerns
 * - Allows components to work with a stable API type while domain evolves
 */
export function toProductViewModel(domainProduct: DomainProduct): ApiProduct {
  const dto = domainProduct.toDTO();

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
    // Note: weight, dimensions, warrantyInformation, shippingInformation,
    // availabilityStatus, reviews, returnPolicy, minimumOrderQuantity are not
    // stored in Product entity, so they're not included in the DTO
    meta: dto.meta,
  };
}
