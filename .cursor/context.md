# Vivara Products App - Project Context

## What We're Building

Product management app for Vivara.io technical assessment.

## User Stories

1. List products with pagination
2. Search products by title
3. Filter by category
4. View product details
5. Create/edit/delete products

## Technical Constraints

- DummyJSON API does NOT persist POST/PUT/DELETE
- Must handle 100 products with pagination (10 per page)
- Must simulate CRUD in frontend state
- Must be responsive (mobile/tablet/desktop)

## Architecture Decisions

- **Pinia Store**: Single source of truth for products
- **Composables**: Reusable logic (useProducts, useSearch)
- **Services Layer**: API abstraction (src/services/api.ts)
- **Optimistic Updates**: Update UI immediately, rollback on API error

## Current Status

- [ ] Project setup
- [ ] API service layer
- [ ] Pinia store
- [ ] Products list (paginated)
- [ ] Search functionality
- [ ] Category filters
- [ ] Product detail view
- [ ] Create/Edit form
- [ ] Delete with confirmation
- [ ] Unit tests (80%+ coverage)
- [ ] E2E tests (critical flows)
- [ ] Responsive design
- [ ] Documentation (README + TECHNICAL_DECISIONS.md)

## Known Limitations

- DummyJSON rate limits (be careful in tests)
- Search is basic full-text (not fuzzy)
- No authentication/authorization
- No real backend persistence
