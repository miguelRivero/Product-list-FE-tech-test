import axios, { AxiosError, AxiosInstance } from "axios";
import type { Product, ProductsResponse, ProductFormData } from "@/types/product";

// API base URL - supports BFF pattern via environment variable
// Defaults to DummyJSON for current implementation
// Can be switched to BFF by setting VITE_API_BASE_URL or VITE_BFF_URL
// Priority: VITE_BFF_URL > VITE_API_BASE_URL > default DummyJSON
const API_BASE_URL =
  import.meta.env.VITE_BFF_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "https://dummyjson.com";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // Timeout configurable via environment variable, default 10 seconds
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Global error handler
    const message =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "Unknown error";

    console.error("API Error:", message);

    // Handle specific error cases
    if (error.code === "ERR_NETWORK") {
      console.error("Network error: No internet connection");
    } else if (error.response?.status === 404) {
      console.error("Resource not found");
    } else if (error.response?.status === 429) {
      console.error("Rate limit exceeded: Too many requests");
    }

    return Promise.reject(error);
  }
);

// Products API
export const productsApi = {
  /**
   * Get paginated list of products
   * @param limit - Number of products per page (default: 10)
   * @param skip - Number of products to skip (default: 0)
   * @returns ProductsResponse with products array and pagination info
   */
  getProducts: async (
    limit = 10,
    skip = 0
  ): Promise<ProductsResponse> => {
    const { data } = await api.get<ProductsResponse>(
      `/products?limit=${limit}&skip=${skip}`
    );
    return data;
  },

  /**
   * Get single product by ID
   * @param id - Product ID
   * @returns Product object
   */
  getProduct: async (id: number): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  /**
   * Search products by query
   * @param query - Search query string
   * @param limit - Number of results per page (default: 10)
   * @param skip - Number of results to skip (default: 0)
   * @returns ProductsResponse with filtered products
   */
  searchProducts: async (
    query: string,
    limit = 10,
    skip = 0
  ): Promise<ProductsResponse> => {
    const { data } = await api.get<ProductsResponse>(
      `/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
    );
    return data;
  },

  /**
   * Get all categories
   * @returns Array of category strings
   */
  getCategories: async (): Promise<string[]> => {
    const { data } = await api.get<string[]>("/products/categories");
    return data;
  },

  /**
   * Get products by category
   * @param category - Category name
   * @param limit - Number of products per page (default: 10)
   * @param skip - Number of products to skip (default: 0)
   * @returns ProductsResponse with filtered products
   */
  getProductsByCategory: async (
    category: string,
    limit = 10,
    skip = 0
  ): Promise<ProductsResponse> => {
    const { data } = await api.get<ProductsResponse>(
      `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
    );
    return data;
  },

  /**
   * Create a new product
   * ⚠️ WARNING: DummyJSON does NOT persist this data
   * @param productData - Product form data
   * @returns Created product (fake response from DummyJSON)
   */
  createProduct: async (
    productData: ProductFormData
  ): Promise<Product> => {
    const { data } = await api.post<Product>("/products/add", productData);
    return data;
  },

  /**
   * Update an existing product
   * ⚠️ WARNING: DummyJSON does NOT persist this data
   * @param id - Product ID
   * @param updates - Partial product data to update
   * @returns Updated product (fake response from DummyJSON)
   */
  updateProduct: async (
    id: number,
    updates: Partial<ProductFormData>
  ): Promise<Product> => {
    const { data } = await api.put<Product>(`/products/${id}`, updates);
    return data;
  },

  /**
   * Delete a product
   * ⚠️ WARNING: DummyJSON does NOT persist this data
   * @param id - Product ID
   * @returns Deleted product info (fake response from DummyJSON)
   */
  deleteProduct: async (id: number): Promise<Product> => {
    const { data } = await api.delete<Product>(`/products/${id}`);
    return data;
  },
};

export default api;

