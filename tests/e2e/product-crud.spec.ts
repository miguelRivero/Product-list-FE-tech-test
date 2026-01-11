import { test, expect } from "playwright/test";

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
    
    // For InputNumber fields, use the nested input element
    const priceInput = page.getByTestId("product-price-input").locator("input");
    await priceInput.click();
    await priceInput.fill("99.99");
    
    const stockInput = page.getByTestId("product-stock-input").locator("input");
    await stockInput.click();
    await stockInput.fill("50");

    // Select category - more robust approach
    const categorySelect = page.getByTestId("product-category-select");
    await categorySelect.click();
    await page.waitForTimeout(300); // Wait for dropdown to open
    
    // Wait for options to be visible and click first one
    const firstOption = page.locator('[role="option"]').first();
    await expect(firstOption).toBeVisible({ timeout: 2000 });
    await firstOption.click();

    // Submit form
    const saveButton = dialog.getByRole("button", { name: /^save$/i });
    await saveButton.click();

    // Wait for dialog to close
    await expect(dialog).toBeHidden({ timeout: 10000 });
    
    // Verify product appears in list
    await expect(page.getByText("E2E Test Product")).toBeVisible({ timeout: 5000 });
  });
});
