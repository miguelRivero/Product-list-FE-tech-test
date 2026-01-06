# Architecture Decisions

## Tech Stack Choices

### Vue 3 + Composition API

**Why**: Required by Vivara. Provides better TypeScript support and logic reusability.

### Pinia for State Management

**Why**: Official Vue 3 store. Simpler than Vuex, great TypeScript support.

**Trade-off**: For a small app, could use composables only. Chose Pinia for:

- Centralized product state
- DevTools integration
- Easier testing

### PrimeVue Components

**Why**: Production-ready DataTable with pagination, Dialog, InputText.

**Trade-off**: Adds ~200KB to bundle. Alternatives considered:

- Headless UI (requires custom styling)
- Custom components (too time-consuming for test)

**Decision**: Use PrimeVue for rapid development, optimize later if needed.

### Tailwind CSS

**Why**: Rapid styling, responsive utilities, small bundle (tree-shakeable).

### Vitest + Playwright

**Why**: Vitest is Vite-native (fast), Playwright for E2E (cross-browser).

## Data Flow Architecture

```
┌─────────────────────────────────────────┐
│           DummyJSON API                 │
│  (does NOT persist POST/PUT/DELETE)     │
└─────────────────────────────────────────┘
                   ▲
                   │
         ┌─────────▼──────────┐
         │   API Service      │
         │  (src/services/)   │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │   Pinia Store      │
         │  (products store)  │
         │  - Handles CRUD    │
         │  - Simulates write │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │   Composables      │
         │  (useProducts)     │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │    Components      │
         │  (ProductList.vue) │
         └────────────────────┘
```

## Backend for Frontend (BFF) Architecture

### Overview

The current implementation calls DummyJSON API directly from the frontend, which works well for this technical assessment. However, in a production environment, a **Backend for Frontend (BFF)** pattern would provide significant architectural benefits. This section documents how BFF would integrate into our architecture as a future enhancement.

### What is BFF?

BFF is an architectural pattern where a dedicated backend service sits between the frontend and external APIs. It's tailored specifically to the needs of the frontend application, aggregating data, transforming responses, and handling cross-cutting concerns like caching and error handling.

### Why BFF for This Application?

**Current Architecture (Technical Test):**

- Direct API calls to DummyJSON from frontend
- Frontend handles all data transformation
- No persistence layer (simulated in Pinia store)
- Rate limiting affects frontend directly
- No server-side caching

**BFF Benefits (Production):**

- **Data Aggregation**: Combine multiple API calls into single requests
- **Data Transformation**: Shape responses to match frontend needs exactly
- **Persistence Layer**: Handle CRUD operations properly (replace DummyJSON limitations)
- **Caching**: Server-side caching reduces API calls and improves performance
- **Error Handling**: Centralized error handling and retry logic
- **Rate Limiting**: Manage rate limits server-side with queuing/backoff

### Updated Data Flow with BFF

```
┌─────────────────────────────────────────┐
│           DummyJSON API                 │
│  (or Real Backend in Production)        │
└─────────────────────────────────────────┘
                   ▲
                   │
         ┌─────────▼──────────┐
         │   BFF Layer        │
         │  (Node.js/Express) │
         │  - Aggregation     │
         │  - Transformation  │
         │  - Caching         │
         │  - Persistence     │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │   API Service      │
         │  (src/services/)   │
         │  Calls BFF API     │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │   Pinia Store      │
         │  (products store)  │
         │  - Handles CRUD    │
         │  - No optimistic   │
         │    workarounds     │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │   Composables      │
         │  (useProducts)     │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │    Components      │
         │  (ProductList.vue) │
         └────────────────────┘
```

### BFF Implementation Strategy

**Phase 1: Basic BFF (Proxy Layer)**

- BFF proxies requests to DummyJSON
- Transforms responses to frontend-friendly format
- Adds basic error handling
- No breaking changes to frontend

**Phase 2: Enhanced BFF (Caching & Persistence)**

- Implement Redis caching layer
- Replace DummyJSON with database (PostgreSQL/MongoDB)
- Remove optimistic update workarounds from frontend
- Real CRUD operations

**Phase 3: Production Ready**

- Request queuing for rate limits
- Advanced error handling (retry, circuit breaker)
- Monitoring and logging
- Performance optimization

### BFF Endpoint Design

**Recommended BFF API Structure:**

```typescript
// Products
GET    /api/products              // List with pagination
GET    /api/products/:id          // Single product
POST   /api/products              // Create (with real persistence)
PUT    /api/products/:id          // Update (with real persistence)
DELETE /api/products/:id          // Delete (with real persistence)

// Categories
GET    /api/categories            // List all categories
GET    /api/categories/:name      // Products in category

// Search
GET    /api/search?q=query        // Search products

// Aggregated Endpoints (Future)
GET    /api/dashboard             // Products + Categories + Stats
```

**Frontend-Friendly Response Format:**

```typescript
// Current DummyJSON Response
{
  products: [...],
  total: 194,
  skip: 0,
  limit: 10
}

// BFF Transformed Response
{
  data: [...],
  pagination: {
    currentPage: 1,
    totalPages: 20,
    pageSize: 10,
    totalItems: 194,
    hasNext: true,
    hasPrev: false
  }
}
```

### BFF Responsibilities

1. **Data Persistence**

   - Replace DummyJSON with real database
   - Handle CRUD operations properly
   - No more optimistic update workarounds needed

2. **Request Aggregation**

   ```typescript
   // Instead of multiple frontend calls:
   // GET /products
   // GET /categories

   // Single BFF call:
   // GET /api/dashboard
   // Returns: { products, categories }
   ```

3. **Caching Strategy**

   ```typescript
   // BFF can cache:
   // - Product lists (5 min TTL)
   // - Categories (1 hour TTL)
   // - Search results (1 min TTL)
   // - Individual products (10 min TTL)
   ```

4. **Error Handling**

   - Retry logic with exponential backoff
   - Circuit breaker pattern
   - Graceful degradation
   - User-friendly error messages

5. **Rate Limiting**
   - Server-side rate limit management
   - Request queuing
   - Backoff strategies

### Migration Path

**Step 1: Add BFF Proxy (Non-Breaking)**

- Deploy BFF that proxies requests to DummyJSON
- Frontend calls BFF instead of DummyJSON directly
- No frontend code changes needed (just update base URL)

**Step 2: Add Caching**

- Implement Redis caching in BFF
- Reduce DummyJSON API calls
- Improve response times

**Step 3: Add Persistence**

- Replace DummyJSON with database
- Implement real CRUD operations
- Remove optimistic update workarounds from frontend

**Step 4: Enhance Features**

- Add request aggregation
- Implement advanced search
- Add analytics and monitoring

### Trade-offs

**Pros:**

- ✅ Better separation of concerns
- ✅ Improved performance (caching, aggregation)
- ✅ Easier to test (mock BFF instead of external API)
- ✅ Production-ready architecture
- ✅ Real persistence (no workarounds)

**Cons:**

- ❌ Additional infrastructure to maintain
- ❌ Increased complexity
- ❌ Additional deployment steps
- ❌ Slight latency increase (minimal)

### Current vs. BFF Comparison

| Aspect             | Current (Direct API) | With BFF               |
| ------------------ | -------------------- | ---------------------- |
| **Persistence**    | Frontend simulation  | Real database          |
| **Caching**        | None                 | Server-side (Redis)    |
| **Rate Limiting**  | Frontend affected    | Server-side management |
| **Error Handling** | Basic                | Centralized + Retry    |
| **Data Format**    | DummyJSON format     | Frontend-optimized     |
| **Testing**        | Mock external API    | Mock BFF (simpler)     |
| **Complexity**     | Low                  | Medium                 |

### Recommendation

For the **technical test**, the current direct API approach is appropriate:

- Simpler setup
- Faster development
- Meets all requirements
- No additional infrastructure needed

For **production**, implement BFF:

- Better architecture
- Scalability
- Maintainability
- Real persistence

---

## State Management Strategy

### Local State (ref/reactive)

- UI state (modals, loading spinners)
- Form inputs
- Component-specific data

### Global State (Pinia)

- Products list (with pagination)
- Categories
- Selected product
- Search query / filters

### Why This Split?

- Local state: Fast, no boilerplate
- Global state: Shared across routes, persistent during session

## Simulating CRUD (DummyJSON Limitation)

### Problem

DummyJSON returns success responses for POST/PUT/DELETE, but doesn't persist.

### Solution: Optimistic Updates

**Create:**

```typescript
// 1. Call API (returns fake success)
const newProduct = await api.createProduct(data);

// 2. Add to Pinia store immediately
store.addProduct({ ...data, id: generateFakeId() });

// 3. User sees new product instantly
```

**Update:**

```typescript
// 1. Update UI optimistically
store.updateProduct(id, newData);

// 2. Call API in background
await api.updateProduct(id, newData);

// 3. If API fails, rollback
```

**Delete:**

```typescript
// 1. Store old data
const backup = store.products.find((p) => p.id === id);

// 2. Remove from UI
store.deleteProduct(id);

// 3. Call API
await api.deleteProduct(id);

// 4. If fails, restore from backup
```

## Testing Strategy

### Unit Tests (Vitest)

- ✅ Composables (useProducts, useCategories)
- ✅ Utility functions (formatCurrency, generateId)
- ✅ Pinia stores (actions, getters)
- ⚠️ Components (test logic, not markup)

### E2E Tests (Playwright)

- ✅ Happy path: List → Detail → Edit → Save
- ✅ Search functionality
- ✅ Category filtering
- ✅ Create new product
- ✅ Delete with confirmation

### Coverage Goal

- 80%+ for critical paths (CRUD operations, API service)
- 60%+ for UI components (focus on behavior)

## Performance Considerations

### Lazy Loading

- Routes lazy-loaded with `() => import()`
- PrimeVue components imported on-demand

### Pagination

- Load 10 products at a time
- DummyJSON supports `limit` and `skip` params

### Caching (Future)

- Store could cache API responses
- Invalidate on CRUD operations

## Security Considerations

### XSS Protection

- Vue escapes HTML by default
- Use `v-html` sparingly (never with user input)

### Input Validation

- Validate on frontend (UX)
- Assume backend validates (though DummyJSON doesn't)

## Accessibility

### Keyboard Navigation

- All interactive elements focusable
- Tab order logical

### Screen Readers

- Semantic HTML (`<table>`, `<button>`, `<form>`)
- aria-labels on icon buttons

### Color Contrast

- Follow WCAG AA (4.5:1 for text)
