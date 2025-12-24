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
