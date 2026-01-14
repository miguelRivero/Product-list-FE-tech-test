import { expect, test } from "playwright/test";

test.describe("Product Detail", () => {
  test("displays product details", async ({ page }) => {
    // First navigate to list to get a valid product ID
    await page.goto("/");
    await page.waitForSelector('[data-testid="products-table"]', {
      timeout: 10000,
    });

    // Navigate to first product detail
    const viewButton = page
      .getByTestId("product-row")
      .first()
      .getByTestId("view-button");
    await viewButton.click();

    // Wait for navigation
    await expect(page).toHaveURL(/\/products\/\d+/, { timeout: 5000 });

    // Verify product information is displayed (at least heading or product title should be visible)
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading.first()).toBeVisible({ timeout: 5000 });
  });

  test("navigates back to product list", async ({ page }) => {
    // Navigate to product detail first
    await page.goto("/");
    await page.waitForSelector('[data-testid="products-table"]', {
      timeout: 10000,
    });

    const viewButton = page
      .getByTestId("product-row")
      .first()
      .getByTestId("view-button");
    await viewButton.click();

    // Wait for navigation to detail page
    await expect(page).toHaveURL(/\/products\/\d+/, { timeout: 5000 });

    // Find and click back button/link
    const backLink = page.getByRole("link", { name: /back/i });
    await expect(backLink).toBeVisible({ timeout: 5000 });
    await backLink.click();

    // Should navigate back to product list
    await expect(page).toHaveURL("/", { timeout: 5000 });

    // Verify products table is visible
    await expect(page.getByTestId("products-table")).toBeVisible({
      timeout: 5000,
    });
  });
});
