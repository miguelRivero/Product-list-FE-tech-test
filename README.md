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
├── assets/          # Static assets (images, logos)
├── composables/     # Reusable composition functions
├── router/          # Vue Router configuration
├── services/        # API service layer
├── stores/          # Pinia stores
├── styles/          # Global styles and SCSS variables
├── types/           # TypeScript type definitions
└── views/           # Route components
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

The application follows a layered architecture:

1. **API Service Layer** (`src/services/api.ts`) - Abstracts API calls
2. **Pinia Store** (`src/stores/products.ts`) - Global state management
3. **Composables** (`src/composables/`) - Reusable logic
4. **Components** (`src/views/`) - UI components

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture documentation.

## Key Features

- ✅ Product listing with pagination
- ✅ Search functionality
- ✅ Category filtering
- ✅ Product detail view
- ✅ Create/Edit/Delete products
- ✅ Optimistic updates (handles DummyJSON limitations)
- ✅ Responsive design

## Documentation

- [Architecture Decisions](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Testing Strategy](./docs/TESTING.md)
- [DDD Implementation](./docs/DDD_IMPLEMENTATION.md)
- [Agents Guide](./docs/agents.md)

## Notes

⚠️ **Important**: DummyJSON API does NOT persist POST/PUT/DELETE operations. The application simulates persistence in the frontend state using optimistic updates. See [docs/API.md](./docs/API.md) for details.
