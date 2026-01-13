# Frontend Recruitment Technical Test

Product management application built with Vue 3, TypeScript, and PrimeVue.

## Tech Stack

- **Framework**: Vue 3 Composition API + TypeScript
- **Build Tool**: Vite
- **UI Library**: PrimeVue + Tailwind CSS
- **State Management**: Pinia
- **Testing**: Vitest (unit) + Playwright (E2E)
- **API**: DummyJSON (does NOT persist writes)

## Project Structure

```
src/
├── application/ # Application layer (use cases)
├── assets/ # Static assets (images, logos)
├── components/ # Vue components (organized by feature)
├── composables/ # Reusable composition functions
├── domain/ # Domain layer (entities, value objects)
├── infrastructure/ # Infrastructure layer (repositories, DI)
├── router/ # Vue Router configuration
├── services/ # API service layer
├── stores/ # Pinia stores
├── styles/ # Global styles and SCSS variables
├── test-utils/ # Testing utilities and helpers
├── types/ # TypeScript type definitions
├── utils/ # Utility functions
└── views/ # Route components
```

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Testing

```bash
# Unit tests
pnpm test:unit

# E2E tests
pnpm test:e2e

# E2E tests with UI
pnpm test:e2e:ui
```

## API Configuration

The application calls DummyJSON API directly from the frontend.

**Base URL**: `https://dummyjson.com`

**Note**: DummyJSON does NOT persist POST/PUT/DELETE operations. The application simulates persistence using optimistic updates in the Pinia store.

## Architecture

TThe application follows Domain-Driven Design (DDD) with a layered architecture:

1. **Presentation Layer** (`src/components/`, `src/views/`) - Vue components and views
2. **Composables** (`src/composables/`) - Reusable reactive logic
3. **State Management** (`src/stores/`) - Pinia stores for global state
4. **Application Layer** (`src/application/use-cases/`) - Use cases orchestrate business logic
5. **Domain Layer** (`src/domain/`) - Business logic, entities, and value objects
6. **Infrastructure Layer** (`src/infrastructure/`) - Repository implementations and DI container
7. **API Service** (`src/services/`) - External API communication

## Highlights for Reviewers

- ✨ **Clean Architecture**: Strict layer separation (Domain → Application → Infrastructure)
- 🎯 **222+ Unit Tests**: Comprehensive test coverage with Vitest
- 🔄 **Optimistic UI**: Handles API limitations with smart state management
- 🏗️ **DDD Patterns**: Value Objects, Entities, Repositories, Use Cases
- 📦 **Dependency Injection**: Centralized container for testability
- 🎨 **PrimeVue + Tailwind**: Modern, responsive UI
- 🔍 **Type Safety**: Strict TypeScript throughout
- 🗺️ **Mappers**: Clear separation between API, Domain, and View layers
- ♿ **Accessibility**: ARIA labels and semantic HTML

## Key Features

- ✅ Product listing with pagination
- ✅ Search functionality
- ✅ Category filtering
- ✅ Product detail view
- ✅ Create/Edit/Delete products
- ✅ Optimistic updates (handles DummyJSON limitations)
- ✅ Responsive design

## Notes

⚠️ **Important**: DummyJSON API does NOT persist POST/PUT/DELETE operations. The application simulates persistence in the frontend state using optimistic updates.
