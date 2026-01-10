import { test, expect } from "@playwright/test";

test.describe("Product CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for products to load
    await page.waitForSelector('[data-testid="products-table"]', { timeout: 10000 });
  });

  test("opens create product dialog", async ({ page }) => {
    // Click "Add new" button
    const addButton = page.getByRole("button", { name: /add new/i });
    await addButton.click();

    // Wait for dialog
    const dialog = page.getByTestId("product-create-dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });
    
    // Verify form fields are visible
    await expect(page.getByTestId("product-title-input")).toBeVisible();
    await expect(page.getByTestId("product-category-select")).toBeVisible();
  });

  test("creates a new product", async ({ page }) => {
    // Click "Add new" button
    const addButton = page.getByRole("button", { name: /add new/i });
    await addButton.click();

    // Wait for dialog
    const dialog = page.getByTestId("product-create-dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Fill form
    await page.getByTestId("product-title-input").fill("E2E Test Product");
    await page.getByTestId("product-description-input").fill("This is a test product created by E2E tests");
    await page.getByTestId("product-price-input").fill("99.99");
    await page.getByTestId("product-stock-input").fill("50");

    // Select category - wait for categories to load and select first available
    await page.waitForTimeout(500);
    const categorySelect = page.getByTestId("product-category-select");
    await categorySelect.click();
    await page.waitForTimeout(300);
    
    // Get first category option
    const categoryOptions = page.getByRole("option");
    const firstOption = categoryOptions.first();
    if (await firstOption.isVisible({ timeout: 2000 })) {
      await firstOption.click();
    }

    // Submit form
    const saveButton = dialog.getByRole("button", { name: /save/i });
    await saveButton.click();

    // Wait for success message or dialog to close
    await expect(
      dialog.getByText(/success|created/i).or(dialog.locator(":not([style*='display: none'])").filter({ hasText: /success/i }))
    ).toBeVisible({ timeout: 5000 }).catch(() => {
      // Dialog might close automatically, check if product appears in list
      return page.waitForSelector("text=E2E Test Product", { timeout: 3000 });
    });
  });
});
