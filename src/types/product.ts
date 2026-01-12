export interface Category {
  slug: string;
  name: string;
  url: string;
}

/**
 * Product interface - represents a product from the API
 * This type matches the DummyJSON API response structure
 */
export interface Product {
  id: number;
  title: string;
  /** Required: Description cannot be empty (validated in domain layer) */
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  /** Rating value (0-5), defaults to 0 if not provided in domain layer */
  rating: number;
  stock: number;
  tags?: string[];
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
  // Optional - not used in core features (list, search, filter, CRUD)
  reviews?: Review[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt: string;
    updatedAt: string;
    barcode?: string;
    qrCode?: string;
  };
  images: string[];
  thumbnail: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  stock: number;
  brand?: string;
  category: string;
  tags?: string[];
}
