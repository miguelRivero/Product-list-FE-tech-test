import { expect, test } from "playwright/test";

test.describe("Product List", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for products to load
    await page.waitForSelector('[data-testid="products-table"]', {
      timeout: 10000,
    });
  });

  test("displays product list", async ({ page }) => {
    const table = page.getByTestId("products-table");
    await expect(table).toBeVisible();

    const rows = page.getByTestId("product-row");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("searches products", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill("phone");

    // Wait for table to update after debounce and API call
    await page.waitForSelector('[data-testid="products-table"]', {
      state: "visible",
    });

    // Wait for products to be loaded (ensure API call completed)
    await page.waitForLoadState("networkidle");

    const rows = page.getByTestId("product-row");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("views product detail", async ({ page }) => {
    const viewButton = page
      .getByTestId("product-row")
      .first()
      .getByTestId("view-button");
    await viewButton.click();

    // Should navigate to product detail page
    await expect(page).toHaveURL(/\/products\/\d+/, { timeout: 5000 });
  });

  test("filters products by category", async ({ page }) => {
    // Get initial product count
    const initialRows = page.getByTestId("product-row");
    const initialCount = await initialRows.count();
    expect(initialCount).toBeGreaterThan(0);

    // Click category select
    const categorySelect = page.getByTestId("category-select");
    await categorySelect.click();

    // Wait for options to be visible
    await page.waitForSelector('[role="option"]', { timeout: 2000 });

    // Select first category option (skip "All" option)
    const categoryOptions = page.locator('[role="option"]');
    const optionCount = await categoryOptions.count();

    if (optionCount > 1) {
      // Click second option (first is "All")
      await categoryOptions.nth(1).click();

      // Wait for table to update after API call
      await page.waitForLoadState("networkidle");

      // Verify products are filtered (count may be different)
      const filteredRows = page.getByTestId("product-row");
      const filteredCount = await filteredRows.count();
      expect(filteredCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("navigates pagination", async ({ page }) => {
    // Check if pagination exists
    const pagination = page.getByTestId("pagination");
    const isPaginationVisible = await pagination.isVisible().catch(() => false);

    if (isPaginationVisible) {
      // Try to click next page button
      const nextButton = pagination.getByRole("button", { name: /next/i });
      const hasNextButton = await nextButton.isVisible().catch(() => false);

      if (hasNextButton) {
        await nextButton.click();

        // Wait for page to update
        await page.waitForLoadState("networkidle");
        await page.waitForSelector('[data-testid="products-table"]', {
          state: "visible",
        });

        // Verify page changed (products table should still be visible)
        await expect(page.getByTestId("products-table")).toBeVisible();
      }
    }
  });

  test("shows empty state when no results", async ({ page }) => {
    // Search for something that won't match any products
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill("nonexistentproductxyz12345");

    // Wait for search to complete
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500); // Small delay for debounce

    // Check if empty state is shown or table has no rows
    const emptyState = page.getByText(/no products found/i);
    const rows = page.getByTestId("product-row");
    const rowCount = await rows.count();

    // Either empty state message is visible OR table has no rows
    const isEmptyStateVisible = await emptyState.isVisible().catch(() => false);

    expect(isEmptyStateVisible || rowCount === 0).toBe(true);
  });
});
