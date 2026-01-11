import { test, expect } from "playwright/test";

test.describe("Product Detail", () => {
  test("displays product details", async ({ page }) => {
    // First navigate to list to get a valid product ID
    await page.goto("/");
    await page.waitForSelector('[data-testid="products-table"]', { timeout: 10000 });
    
    // Navigate to first product detail
    const viewButton = page.getByTestId("product-row").first().getByTestId("view-button");
    await viewButton.click();

    // Wait for navigation
    await expect(page).toHaveURL(/\/products\/\d+/, { timeout: 5000 });

    // Verify product information is displayed (at least heading or product title should be visible)
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading.first()).toBeVisible({ timeout: 5000 });
  });
});
