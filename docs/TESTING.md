# Testing Strategy

## Overview

Our testing approach follows the **Testing Pyramid**:

```
       /\
      /E2E\         Few (critical flows)
     /------\
    / INTEG  \      Some (feature integration)
   /----------\
  /   UNIT     \    Many (functions, composables)
 /--------------\
```

**Target Coverage:**

- **Unit tests**: 80%+ for critical paths (services, stores, composables)
- **Integration tests**: 60%+ for components
- **E2E tests**: Cover 5-7 critical user flows

---

## Testing Tools

### Vitest (Unit & Integration)

- **What**: Fast unit test runner (Vite-native)
- **Use for**: Composables, services, stores, utilities
- **Config**: `vitest.config.ts`

### Vue Test Utils (Component Testing)

- **What**: Official Vue testing library
- **Use for**: Component behavior, props, emits, slots
- **Config**: Works with Vitest

### Playwright (E2E)

- **What**: Cross-browser end-to-end testing
- **Use for**: Complete user flows (list → detail → edit → save)
- **Config**: `playwright.config.ts`

---

## Unit Tests

### What to Test

✅ **Composables** (`src/composables/*.spec.ts`)

- Logic correctness
- State management
- Side effects

✅ **Services** (`src/services/*.spec.ts`)

- API call construction
- Response parsing
- Error handling

✅ **Stores** (`src/stores/*.spec.ts`)

- Actions (fetch, create, update, delete)
- Getters (computed state)
- State mutations

✅ **Utilities** (`src/utils/*.spec.ts`)

- Pure functions
- Data transformations

---

### Example: Testing Composable

**File:** `src/composables/useProducts.spec.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useProducts } from "./useProducts";
import { setActivePinia, createPinia } from "pinia";

// Mock API service
vi.mock("@/services/api", () => ({
  productsApi: {
    getProducts: vi.fn().mockResolvedValue({
      products: [
        { id: 1, title: "Product 1", price: 10 },
        { id: 2, title: "Product 2", price: 20 },
      ],
      total: 2,
      skip: 0,
      limit: 10,
    }),
  },
}));

describe("useProducts", () => {
  beforeEach(() => {
    // Create fresh Pinia instance for each test
    setActivePinia(createPinia());
  });

  it("fetches products on mount", async () => {
    const { products, loading, fetchProducts } = useProducts();

    expect(loading.value).toBe(false);
    expect(products.value).toEqual([]);

    await fetchProducts();

    expect(loading.value).toBe(false);
    expect(products.value).toHaveLength(2);
    expect(products.value[0].title).toBe("Product 1");
  });

  it("handles loading state correctly", async () => {
    const { loading, fetchProducts } = useProducts();

    const promise = fetchProducts();
    expect(loading.value).toBe(true);

    await promise;
    expect(loading.value).toBe(false);
  });

  it("handles API errors", async () => {
    const { error, fetchProducts } = useProducts();

    // Mock API failure
    const { productsApi } = await import("@/services/api");
    vi.mocked(productsApi.getProducts).mockRejectedValueOnce(
      new Error("Network error")
    );

    await expect(fetchProducts()).rejects.toThrow("Network error");
    expect(error.value).toBe("Network error");
  });
});
```

---

### Example: Testing Pinia Store

**File:** `src/stores/products.spec.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useProductsStore } from "./products";

describe("Products Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initializes with empty state", () => {
    const store = useProductsStore();

    expect(store.products).toEqual([]);
    expect(store.total).toBe(0);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
  });

  it("adds product to state", () => {
    const store = useProductsStore();
    const newProduct = { id: 1, title: "Test Product", price: 99 };

    store.addProduct(newProduct);

    expect(store.products).toHaveLength(1);
    expect(store.products[0]).toEqual(newProduct);
    expect(store.total).toBe(1);
  });

  it("updates product locally", () => {
    const store = useProductsStore();
    store.addProduct({ id: 1, title: "Original", price: 100 });

    store.updateProductLocal(1, { title: "Updated", price: 150 });

    expect(store.products[0].title).toBe("Updated");
    expect(store.products[0].price).toBe(150);
  });

  it("removes product from state", () => {
    const store = useProductsStore();
    store.addProduct({ id: 1, title: "Product 1", price: 100 });
    store.addProduct({ id: 2, title: "Product 2", price: 200 });

    store.removeProduct(1);

    expect(store.products).toHaveLength(1);
    expect(store.products[0].id).toBe(2);
    expect(store.total).toBe(1);
  });
});
```

---

## Integration Tests (Components)

### What to Test

✅ **Component rendering** (does it display correctly?)
✅ **User interactions** (click, type, submit)
✅ **Props & Emits** (input/output contract)
✅ **Computed properties** (derived state)
❌ **NOT**: Internal implementation details

---

### Example: Testing Component

**File:** `src/components/products/ProductCard.spec.ts`

```typescript
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ProductCard from "./ProductCard.vue";

describe("ProductCard", () => {
  const mockProduct = {
    id: 1,
    title: "Test Product",
    description: "Test description",
    price: 99.99,
    stock: 10,
    category: "electronics",
    thumbnail: "/test.png",
  };

  it("renders product information", () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct },
    });

    expect(wrapper.text()).toContain("Test Product");
    expect(wrapper.text()).toContain("€99.99");
    expect(wrapper.text()).toContain("Stock: 10");
  });

  it("emits view event on click", async () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct },
    });

    await wrapper.find('[data-testid="view-button"]').trigger("click");

    expect(wrapper.emitted("view")).toBeTruthy();
    expect(wrapper.emitted("view")?.[0]).toEqual([mockProduct.id]);
  });

  it("shows low stock warning when stock < 5", () => {
    const lowStockProduct = { ...mockProduct, stock: 3 };
    const wrapper = mount(ProductCard, {
      props: { product: lowStockProduct },
    });

    expect(wrapper.find('[data-testid="low-stock-badge"]').exists()).toBe(true);
  });

  it("does not show low stock warning when stock >= 5", () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct },
    });

    expect(wrapper.find('[data-testid="low-stock-badge"]').exists()).toBe(
      false
    );
  });
});
```

---

## E2E Tests (Playwright)

### Critical User Flows

1. ✅ **List products** → View paginated list, search, filter
2. ✅ **View product detail** → Click product → See modal/detail
3. ✅ **Create product** → Click "Add new" → Fill form → Save → See in list
4. ✅ **Edit product** → Open product → Edit → Save → See changes
5. ✅ **Delete product** → Click delete → Confirm → Product removed
6. ✅ **Search products** → Type query → See filtered results
7. ✅ **Filter by category** → Select category → See filtered results

---

### Example: E2E Test

**File:** `tests/e2e/product-crud.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Product CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");
  });

  test("creates a new product", async ({ page }) => {
    // Click "Add new" button
    await page.click('button:has-text("Add new")');

    // Fill form
    await page.fill('[data-testid="title-input"]', "Test Product E2E");
    await page.fill('[data-testid="description-input"]', "Test description");
    await page.fill('[data-testid="price-input"]', "99.99");
    await page.fill('[data-testid="stock-input"]', "50");
    await page.selectOption('[data-testid="category-select"]', "electronics");

    // Submit form
    await page.click('button:has-text("Save")');

    // Verify product appears in list
    await expect(page.locator("text=Test Product E2E")).toBeVisible();
  });

  test("edits an existing product", async ({ page }) => {
    // Click on first product
    await page.click(
      '[data-testid="product-row"]:first-child [data-testid="edit-button"]'
    );

    // Modify title
    const titleInput = page.locator('[data-testid="title-input"]');
    await titleInput.clear();
    await titleInput.fill("Updated Product Title");

    // Save
    await page.click('button:has-text("Save")');

    // Verify changes
    await expect(page.locator("text=Updated Product Title")).toBeVisible();
  });

  test("deletes a product with confirmation", async ({ page }) => {
    // Get initial product count
    const initialCount = await page
      .locator('[data-testid="product-row"]')
      .count();

    // Click delete button
    await page.click(
      '[data-testid="product-row"]:first-child [data-testid="delete-button"]'
    );

    // Confirm deletion
    await page.click('button:has-text("Confirm")');

    // Verify product removed
    const newCount = await page.locator('[data-testid="product-row"]').count();
    expect(newCount).toBe(initialCount - 1);
  });

  test("searches products", async ({ page }) => {
    // Type in search box
    await page.fill('[data-testid="search-input"]', "phone");

    // Wait for debounce (300ms)
    await page.waitForTimeout(400);

    // Verify filtered results
    const products = page.locator('[data-testid="product-row"]');
    await expect(products).not.toHaveCount(0);

    // All visible products should contain "phone"
    const count = await products.count();
    for (let i = 0; i < count; i++) {
      const text = await products.nth(i).textContent();
      expect(text?.toLowerCase()).toContain("phone");
    }
  });

  test("filters by category", async ({ page }) => {
    // Select category
    await page.selectOption('[data-testid="category-filter"]', "smartphones");

    // Wait for API call
    await page.waitForLoadState("networkidle");

    // Verify category badge or filtered results
    await expect(page.locator("text=smartphones")).toBeVisible();
  });
});
```

---

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run with coverage
npm run test:unit -- --coverage

# Watch mode (during development)
npm run test:unit -- --watch

# Run specific file
npm run test:unit -- src/composables/useProducts.spec.ts

# Run tests matching pattern
npm run test:unit -- --grep="useProducts"
```

---

### E2E Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run with UI mode (shows browser)
npm run test:e2e:ui

# Run specific test
npm run test:e2e -- tests/e2e/product-crud.spec.ts

# Run in specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit

# Debug mode
npm run test:e2e -- --debug
```

---

## Coverage Goals

### Current Coverage Targets

| Type             | Target | Critical   |
| ---------------- | ------ | ---------- |
| **API Service**  | 90%+   | ✅ Yes     |
| **Pinia Stores** | 85%+   | ✅ Yes     |
| **Composables**  | 80%+   | ✅ Yes     |
| **Components**   | 60%+   | ⚠️ Partial |
| **Utilities**    | 95%+   | ✅ Yes     |

### How to Check Coverage

```bash
npm run test:unit -- --coverage

# Output:
# File                | % Stmts | % Branch | % Funcs | % Lines
# --------------------|---------|----------|---------|--------
# src/services/api.ts |   92.5  |   85.0   |   100   |   92.5
# src/stores/products |   88.0  |   75.0   |   90.0  |   88.0
# ...
```

---

## Testing Best Practices

### DO ✅

1. **Test behavior, not implementation**

```typescript
// ✅ GOOD
expect(wrapper.text()).toContain("Product added");

// ❌ BAD
expect(component.vm.internalState).toBe(true);
```

2. **Use data-testid for E2E selectors**

```html
<button data-testid="add-product-button">Add</button>
```

```typescript
await page.click('[data-testid="add-product-button"]');
```

3. **Mock external dependencies**

```typescript
vi.mock("@/services/api");
```

4. **Keep tests isolated** (no shared state between tests)

```typescript
beforeEach(() => {
  setActivePinia(createPinia());
});
```

5. **Test edge cases**

```typescript
it("handles empty product list", () => {
  // Test with products = []
});

it("handles API timeout", async () => {
  // Mock timeout error
});
```

---

### DON'T ❌

1. **Don't test library code**

```typescript
// ❌ Don't test if PrimeVue DataTable works
```

2. **Don't make tests dependent on each other**

```typescript
// ❌ BAD: Test 2 depends on Test 1
test("creates product", () => {
  /* adds to store */
});
test("edits product", () => {
  /* assumes product exists */
});
```

3. **Don't test CSS/styling**

```typescript
// ❌ BAD
expect(wrapper.find(".button").classes()).toContain("blue");
```

4. **Don't over-mock**

```typescript
// ❌ If you mock everything, you're testing mocks, not real code
```

---

## CI/CD Integration

### GitHub Actions

**File:** `.github/workflows/ci.yml`

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## Debugging Tests

### Vitest Debugging

```typescript
// Add console.log in tests
it('test something', () => {
  console.log('Debug:', someValue);
  expect(someValue).toBe(expected);
});

// Run with --reporter=verbose
npm run test:unit -- --reporter=verbose
```

---

### Playwright Debugging

```bash
# Run with --debug flag
npm run test:e2e -- --debug

# This opens Playwright Inspector
# You can step through test, pause, inspect DOM
```

---

## Future Improvements

### Not Implemented Yet (But Recommended)

1. **Visual Regression Testing** (Chromatic, Percy)

   - Catch UI regressions automatically

2. **Performance Testing** (Lighthouse CI)

   - Monitor bundle size, load times

3. **Accessibility Testing** (axe-core)

```typescript
import { injectAxe, checkA11y } from "axe-playwright";

test("page is accessible", async ({ page }) => {
  await injectAxe(page);
  await checkA11y(page);
});
```

4. **Component Visual Testing** (Storybook + Chromatic)
   - Test components in isolation

---

## Resources

- **Vitest Docs**: https://vitest.dev
- **Vue Test Utils**: https://test-utils.vuejs.org
- **Playwright Docs**: https://playwright.dev
- **Testing Library**: https://testing-library.com/docs/vue-testing-library/intro/
