# DummyJSON API Documentation

## Base Information

- **Base URL**: `https://dummyjson.com`
- **Documentation**: https://dummyjson.com/docs
- **Rate Limits**: ~100 requests/minute (be mindful in tests)
- **CORS**: Enabled (safe to call from browser)

## Critical Limitation

⚠️ **DummyJSON does NOT persist POST/PUT/DELETE operations**

All write operations return success responses but **DO NOT** save data on the server.

**Implication for our app:**

- We must simulate persistence in frontend state (Pinia store)
- Optimistic updates are mandatory
- We must handle "fake" responses correctly

---

## Endpoints Used

### 1. GET /products - List Products (Paginated)

**URL:** `GET /products?limit={limit}&skip={skip}`

**Parameters:**

- `limit` (optional): Number of products to return (default: 30, max: 100)
- `skip` (optional): Number of products to skip (for pagination)
- `select` (optional): Comma-separated fields to return (we don't use this)

**Example Request:**

```bash
curl https://dummyjson.com/products?limit=10&skip=0
```

**Response:**

```json
{
  "products": [
    {
      "id": 1,
      "title": "Essence Mascara Lash Princess",
      "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects...",
      "category": "beauty",
      "price": 9.99,
      "discountPercentage": 7.17,
      "rating": 4.94,
      "stock": 5,
      "tags": ["beauty", "mascara"],
      "brand": "Essence",
      "sku": "RCH45Q1A",
      "weight": 2,
      "dimensions": {
        "width": 23.17,
        "height": 14.43,
        "depth": 28.01
      },
      "warrantyInformation": "1 month warranty",
      "shippingInformation": "Ships in 1 month",
      "availabilityStatus": "Low Stock",
      "reviews": [...],
      "returnPolicy": "30 days return policy",
      "minimumOrderQuantity": 24,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.618Z",
        "updatedAt": "2024-05-23T08:56:21.618Z",
        "barcode": "9164035109868",
        "qrCode": "https://dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
    }
  ],
  "total": 194,
  "skip": 0,
  "limit": 10
}
```

**Our Usage:**

- Display product list with pagination
- Calculate total pages: `Math.ceil(total / limit)`
- Load 10 products per page

**Implementation:**

```typescript
// src/services/api.ts
export const productsApi = {
  getProducts: async (limit = 10, skip = 0): Promise<ProductsResponse> => {
    const { data } = await api.get<ProductsResponse>(
      `/products?limit=${limit}&skip=${skip}`
    );
    return data;
  },
};
```

---

### 2. GET /products/:id - Single Product

**URL:** `GET /products/{id}`

**Example Request:**

```bash
curl https://dummyjson.com/products/1
```

**Response:**

```json
{
  "id": 1,
  "title": "Essence Mascara Lash Princess",
  "description": "...",
  "category": "beauty",
  "price": 9.99,
  "discountPercentage": 7.17,
  "rating": 4.94,
  "stock": 5,
  "brand": "Essence",
  "thumbnail": "...",
  "images": ["..."]
}
```

**Our Usage:**

- Detail view/modal
- Edit form pre-population

**Implementation:**

```typescript
getProduct: async (id: number): Promise<Product> => {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
};
```

---

### 3. GET /products/search - Search Products

**URL:** `GET /products/search?q={query}&limit={limit}&skip={skip}`

**Parameters:**

- `q` (required): Search query (searches in title, description, category, brand)
- `limit` (optional): Results per page
- `skip` (optional): Pagination offset

**Example Request:**

```bash
curl https://dummyjson.com/products/search?q=phone&limit=10
```

**Response:** Same structure as GET /products (ProductsResponse)

**Our Usage:**

- Search bar functionality
- Real-time search with debouncing (300ms)

**Implementation:**

```typescript
searchProducts: async (
  query: string,
  limit = 10,
  skip = 0
): Promise<ProductsResponse> => {
  const { data } = await api.get<ProductsResponse>(
    `/products/search?q=${encodeURIComponent(
      query
    )}&limit=${limit}&skip=${skip}`
  );
  return data;
};
```

**Note:** Search is full-text but not fuzzy (exact word matching).

---

### 4. GET /products/categories - List Categories

**URL:** `GET /products/categories`

**Example Request:**

```bash
curl https://dummyjson.com/products/categories
```

**Response:**

```json
[
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches"
]
```

**Our Usage:**

- Populate category dropdown filter
- Load once on app initialization

**Implementation:**

```typescript
getCategories: async (): Promise<string[]> => {
  const { data } = await api.get<string[]>("/products/categories");
  return data;
};
```

---

### 5. GET /products/category/:category - Filter by Category

**URL:** `GET /products/category/{category}?limit={limit}&skip={skip}`

**Example Request:**

```bash
curl https://dummyjson.com/products/category/smartphones?limit=10&skip=0
```

**Response:** Same structure as GET /products (ProductsResponse)

**Our Usage:**

- Category filter dropdown
- Show only products from selected category

**Implementation:**

```typescript
getProductsByCategory: async (
  category: string,
  limit = 10,
  skip = 0
): Promise<ProductsResponse> => {
  const { data } = await api.get<ProductsResponse>(
    `/products/category/${encodeURIComponent(
      category
    )}?limit=${limit}&skip=${skip}`
  );
  return data;
};
```

---

### 6. POST /products/add - Create Product (FAKE)

**URL:** `POST /products/add`

**⚠️ WARNING:** This does NOT persist data on the server!

**Request Body:**

```json
{
  "title": "New Product",
  "description": "Product description",
  "price": 99.99,
  "discountPercentage": 10,
  "stock": 50,
  "brand": "Brand Name",
  "category": "electronics"
}
```

**Response:**

```json
{
  "id": 195, // Fake ID generated by server
  "title": "New Product",
  "description": "Product description",
  "price": 99.99
  // ... rest of fields echoed back
}
```

**Our Strategy:**

1. Call API (returns fake success)
2. Generate our own ID (client-side): `Math.random()` or `Date.now()`
3. Add to Pinia store immediately
4. User sees product in list instantly

**Implementation:**

```typescript
// src/stores/products.ts
async function createProduct(productData: ProductFormData) {
  try {
    // 1. Call API (fake response)
    const response = await productsApi.createProduct(productData);

    // 2. Generate client-side ID (DummyJSON ID won't persist)
    const clientId = -Date.now(); // Negative to distinguish from real IDs

    // 3. Add to local state
    const newProduct: Product = {
      ...response,
      id: clientId,
      thumbnail: "/placeholder.png", // Default image
      images: [],
      rating: 0,
      discountPercentage: 0,
    };

    addProduct(newProduct);

    return newProduct;
  } catch (error) {
    console.error("Create product failed:", error);
    throw error;
  }
}
```

---

### 7. PUT /products/:id - Update Product (FAKE)

**URL:** `PUT /products/{id}`

**⚠️ WARNING:** This does NOT persist data on the server!

**Request Body:** Partial product data

```json
{
  "title": "Updated Title",
  "price": 149.99
}
```

**Response:**

```json
{
  "id": 1,
  "title": "Updated Title",
  "price": 149.99
  // ... rest of fields unchanged
}
```

**Our Strategy:**

1. Update Pinia store optimistically
2. Call API in background
3. If API fails, rollback changes

**Implementation:**

```typescript
async function updateProduct(id: number, updates: Partial<ProductFormData>) {
  // 1. Backup current state
  const originalProduct = products.value.find((p) => p.id === id);
  if (!originalProduct) throw new Error("Product not found");

  // 2. Optimistic update
  updateProductLocal(id, updates);

  try {
    // 3. Call API (fake response)
    await productsApi.updateProduct(id, updates);
  } catch (error) {
    // 4. Rollback on error
    updateProductLocal(id, originalProduct);
    throw error;
  }
}
```

---

### 8. DELETE /products/:id - Delete Product (FAKE)

**URL:** `DELETE /products/{id}`

**⚠️ WARNING:** This does NOT persist data on the server!

**Response:**

```json
{
  "id": 1,
  "title": "Essence Mascara Lash Princess",
  "isDeleted": true,
  "deletedOn": "2024-12-28T10:30:00.000Z"
}
```

**Our Strategy:**

1. Remove from Pinia store immediately
2. Call API in background
3. If API fails, restore from backup

**Implementation:**

```typescript
async function deleteProduct(id: number) {
  // 1. Backup
  const backup = products.value.find((p) => p.id === id);
  if (!backup) throw new Error("Product not found");

  // 2. Remove from UI
  removeProduct(id);

  try {
    // 3. Call API (fake response)
    await productsApi.deleteProduct(id);
  } catch (error) {
    // 4. Restore on error
    addProduct(backup);
    throw error;
  }
}
```

---

## Error Handling

### Common Errors

1. **Network Error** (no internet)

```typescript
   catch (error) {
     if (error.code === 'ERR_NETWORK') {
       // Show "No internet connection" message
     }
   }
```

2. **Timeout** (slow connection)

```typescript
const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000, // 10 seconds
});
```

3. **404 Not Found** (invalid product ID)

```typescript
   catch (error) {
     if (error.response?.status === 404) {
       // Show "Product not found" message
     }
   }
```

4. **Rate Limit** (too many requests)

```typescript
   catch (error) {
     if (error.response?.status === 429) {
       // Show "Too many requests, please wait" message
     }
   }
```

### Our Error Handling Strategy

```typescript
// src/services/api.ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handler
    const message =
      error.response?.data?.message || error.message || "Unknown error";
    console.error("API Error:", message);

    // You can add toast notification here
    // toast.error(message);

    return Promise.reject(error);
  }
);
```

---

## Testing Considerations

### Mocking API Calls

For unit tests, mock the API service:

```typescript
// tests/unit/services/api.spec.ts
import { vi } from "vitest";
import { productsApi } from "@/services/api";

vi.mock("@/services/api", () => ({
  productsApi: {
    getProducts: vi.fn().mockResolvedValue({
      products: [{ id: 1, title: "Test Product" }],
      total: 1,
      skip: 0,
      limit: 10,
    }),
  },
}));
```

### Rate Limits in E2E Tests

- DummyJSON has ~100 req/min limit
- Add delays between E2E test runs
- Use `--workers=1` in Playwright to avoid parallel requests

---

## Performance Optimization

### Caching Strategy (Future Enhancement)

```typescript
// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCachedProducts(limit: number, skip: number) {
  const key = `products-${limit}-${skip}`;
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await productsApi.getProducts(limit, skip);
  cache.set(key, { data, timestamp: Date.now() });

  return data;
}
```

**Note:** Not implemented in v1, but consider for optimization.

---

## API Changes / Future Considerations

- DummyJSON may add authentication in future (JWT tokens)
- Consider migrating to real backend for production
- Image uploads would require separate service (Cloudinary, S3)
- Search could be improved with Elasticsearch/Algolia

---

## Resources

- **DummyJSON Docs**: https://dummyjson.com/docs
- **Axios Docs**: https://axios-http.com/docs/intro
- **Our TypeScript Types**: `src/types/product.ts`
