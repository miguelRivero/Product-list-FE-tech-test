import type { Product as DomainProduct } from '@/domain/product/Product';
import type { Product as ApiProduct } from '@/types/product';

/**
 * Adapter to convert domain Product entities to API Product type
 * This allows components to continue working with the existing Product type
 * while the store uses domain entities internally
 */
export function domainProductToApiProduct(domainProduct: DomainProduct): ApiProduct {
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
