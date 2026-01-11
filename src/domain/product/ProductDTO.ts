import type { Category } from '@/types/product';

/**
 * ProductDTO - Data Transfer Object for Product
 * Used for serialization/deserialization between domain and infrastructure layers
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
