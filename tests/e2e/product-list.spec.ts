import { test, expect } from "playwright/test";

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
});
