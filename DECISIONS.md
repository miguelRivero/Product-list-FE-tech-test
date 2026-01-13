# Architecture Decisions

This document outlines key architectural and technical decisions made during the development of this frontend technical test application.

## Why Clean Architecture for a Simple CRUD App?

While this is a relatively simple CRUD application, implementing Clean Architecture demonstrates several important capabilities:

- **Demonstrates scalability**: Shows how to structure large applications that will grow over time
- **Testability**: Isolated layers make unit testing straightforward - each layer can be tested independently
- **Maintainability**: Easy to swap API providers (e.g., from DummyJSON to a real backend) or add business logic without touching UI code
- **Professional standards**: Shows understanding of enterprise-level patterns and separation of concerns
- **Interview value**: Demonstrates knowledge of advanced architectural patterns beyond basic CRUD operations

## Key Technical Choices

### Optimistic UI Pattern

**Problem**: DummyJSON API doesn't persist writes (POST/PUT/DELETE operations)

**Solution**: Implemented optimistic updates with automatic rollback on errors

**Implementation**:

- UI updates immediately when user performs actions
- API calls happen in the background
- On error, state is rolled back to previous values
- User sees instant feedback while maintaining data consistency

**Trade-off**: More complex state management, but significantly better UX than waiting for API responses that will never persist anyway

**Location**: `src/stores/products.ts` - `createProduct`, `updateProduct`, `deleteProduct` methods

### Value Objects (Price, Stock, ProductId, ProductTitle, DiscountPercentage)

**Problem**: Primitive obsession leads to scattered validation logic and makes it easy to create invalid entities

**Solution**: Encapsulate business rules and validation in dedicated Value Object classes

**Benefits**:

- **Impossible to create invalid entities**: Validation happens at construction time
- **Centralized business rules**: All price calculations, stock validations, etc. in one place
- **Type safety**: TypeScript ensures correct usage throughout the codebase
- **Self-documenting**: Code clearly expresses business constraints

**Example**:

```typescript
// ❌ Bad: Primitive obsession
const price = -100; // Invalid, but TypeScript allows it

// ✅ Good: Value Object
const price = Price.create(100); // Throws error if invalid
const discountedPrice = price.applyDiscount(DiscountPercentage.create(10));
```

**Location**: `src/domain/product/` - `Price.ts`, `Stock.ts`, `ProductId.ts`, `ProductTitle.ts`, `DiscountPercentage.ts`

### Domain-Driven Design (DDD) Patterns

**Why DDD?**

- Separates business logic from technical concerns
- Makes the codebase self-documenting through domain language
- Enables complex business rules to evolve independently

**Patterns Used**:

1. **Entities**: `Product` - has identity and lifecycle
2. **Value Objects**: `Price`, `Stock`, `ProductId`, etc. - immutable, defined by their attributes
3. **Repositories**: `ProductRepository` - abstraction for data access
4. **Use Cases**: Application layer orchestrates domain logic
5. **Domain Services**: `ProductDomainService` - complex business logic that doesn't belong to a single entity

**Location**:

- Entities: `src/domain/product/Product.ts`
- Value Objects: `src/domain/product/*.ts`
- Repositories: `src/domain/product/ProductRepository.ts` (interface)
- Use Cases: `src/application/use-cases/`
- Domain Services: `src/domain/product/ProductDomainService.ts`

### Dependency Injection Container

**Problem**: Hard-coded dependencies make testing difficult and create tight coupling

**Solution**: Centralized DI container manages all dependencies

**Benefits**:

- Easy to swap implementations (e.g., mock repository for tests)
- Single source of truth for dependency creation
- Enables testing without complex setup

**Location**: `src/infrastructure/di/container.ts`

### ViewModel Mapper Pattern

**Problem**: Vue reactivity doesn't work well with domain entities (which use getters/setters)

**Solution**: `ProductViewModelMapper` converts domain entities to plain objects for the view layer

**Why not use domain entities directly?**

- Domain entities use getter methods (`product.getPrice()`) which Vue can't track reactively
- View layer needs plain objects with direct property access (`product.price`)
- Maintains separation: Domain layer stays pure, View layer gets what it needs

**Location**: `src/stores/ProductViewModelMapper.ts`

### Infrastructure Mapper Pattern

**Problem**: Repository was mixing data access concerns with transformation logic

**Solution**: Extracted `ProductMapper` to handle all API ↔ Domain conversions

**Benefits**:

- Repository focuses purely on data access
- Mapping logic is reusable and testable in isolation
- Clear separation of concerns

**Location**: `src/infrastructure/mappers/ProductMapper.ts`

## Challenges Overcome

### 1. Vue Reactivity with Domain Classes

**Challenge**: Vue's reactivity system doesn't work with domain entities that use getter methods

**Solution**: Created `ProductViewModelMapper` to convert domain entities to plain objects that Vue can track reactively

**Location**: `src/stores/ProductViewModelMapper.ts`

### 2. Client-side ID Generation

**Challenge**: Need to generate unique IDs for products created locally (since DummyJSON doesn't persist)

**Solution**:

- Used secure random number generation in range 10000-99999
- Checked for collisions before assignment
- Clear naming convention (`isClientGeneratedId()`) to distinguish from server IDs

**Location**: `src/utils/idGenerator.ts`

### 3. API Limitations (No Persistence)

**Challenge**: DummyJSON doesn't persist writes, but application should feel like it does

**Solution**:

- Optimistic updates in Pinia store
- Client-side state management
- Cache invalidation strategies
- Clear user feedback about operations

**Location**: `src/stores/products.ts`

### 4. Complex State Management

**Challenge**: Store file was growing large (438 lines) with mixed responsibilities

**Solution**:

- Extracted helper functions to `productStoreHelpers.ts`
- Separated error handling, cache invalidation, and optimistic update patterns
- Improved maintainability and testability

**Location**: `src/stores/helpers/productStoreHelpers.ts`

## Testing Strategy

### Unit Tests

- **Domain Layer**: Test value objects and entities in isolation
- **Use Cases**: Test business logic with mocked repositories
- **Components**: Test behavior, not implementation details
- **Coverage**: Aim for 80%+ on critical paths

### E2E Tests

- Full user flows (create, read, update, delete)
- Integration with API (mocked or real)
- User interaction patterns

**Location**:

- Unit: `src/**/*.spec.ts` (co-located with source)
- E2E: `tests/e2e/`

## Performance Considerations

1. **Lazy Loading Images**: `loading="lazy"` on product thumbnails
2. **API Caching**: Cache responses with TTL to reduce API calls
3. **Optimistic Updates**: Immediate UI feedback without waiting for API
4. **Code Splitting**: Vite automatically code-splits routes

## Future Improvements

If this were a production application, consider:

1. **Backend for Frontend (BFF)**: Add a backend layer to handle API transformations
2. **State Persistence**: Use IndexedDB to persist optimistic updates
3. **Offline Support**: Service workers for offline functionality
4. **Real-time Updates**: WebSocket integration for collaborative editing
5. **Advanced Caching**: Implement more sophisticated cache invalidation strategies

## References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
