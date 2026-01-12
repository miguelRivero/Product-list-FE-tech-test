/**
 * ProductDTO - Data Transfer Object for Product
 *
 * This DTO is used for serialization/deserialization between the domain layer and infrastructure layer.
 *
 * **Why separate from @/types/product.Product?**
 * - Domain Layer Independence: The domain layer should not depend on API-specific types
 * - Layer Separation: Keeps domain logic isolated from external API contracts
 * - Flexibility: Allows the domain DTO to evolve independently from API responses
 *
 * **Relationship to @/types/product.Product:**
 * - `@/types/product.Product` represents the API response structure (from DummyJSON)
 * - `ProductDTO` represents the domain's data transfer format
 * - ProductRepositoryImpl converts between these two types
 *
 * In practice, these are currently similar, but this separation enables:
 * - Future API migrations without changing domain code
 * - Domain-specific transformations (e.g., computed fields, normalized data)
 * - Better testability (domain tests don't need API types)
 */
export interface ProductDTO {
  id: number;
  title: string;
  description: string;
  category: string; // Category name (string) for API compatibility
  price: number;
  discountPercentage: number;
  stock: number;
  rating: number;
  images: string[];
  thumbnail: string;
  tags: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt: string;
    updatedAt: string;
    barcode?: string;
    qrCode?: string;
  };
}
