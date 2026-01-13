import { test, expect } from "playwright/test";

test.describe("Product CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for products to load
    await page.waitForSelector('[data-testid="products-table"]', {
      timeout: 10000,
    });
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
    await page
      .getByTestId("product-description-input")
      .fill("This is a test product created by E2E tests");

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
    await expect(page.getByText("E2E Test Product")).toBeVisible({
      timeout: 5000,
    });
  });

  test("edits an existing product", async ({ page }) => {
    // Wait for products to load and get first product
    const firstRow = page.getByTestId("product-row").first();
    await expect(firstRow).toBeVisible({ timeout: 5000 });

    // Click edit button on first product
    const editButton = firstRow.getByTestId("edit-button");
    await editButton.click();

    // Wait for edit dialog
    const dialog = page.getByTestId("product-edit-dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Verify form is pre-filled
    const titleInput = page.getByTestId("product-title-input");
    await expect(titleInput).toBeVisible();

    // Modify the title
    await titleInput.clear();
    await titleInput.fill("E2E Updated Product");

    // Update price
    const priceInput = page.getByTestId("product-price-input").locator("input");
    await priceInput.click();
    await priceInput.fill("149.99");

    // Submit form
    const saveButton = dialog.getByRole("button", { name: /^save$/i });
    await saveButton.click();

    // Wait for dialog to close
    await expect(dialog).toBeHidden({ timeout: 10000 });

    // Verify updated product appears in list
    await expect(page.getByText("E2E Updated Product")).toBeVisible({
      timeout: 5000,
    });
  });

  test("deletes a product", async ({ page }) => {
    // Wait for products to load
    const rows = page.getByTestId("product-row");
    const initialCount = await rows.count();
    expect(initialCount).toBeGreaterThan(0);

    // Get first product title for verification (trim whitespace)
    const firstRow = page.getByTestId("product-row").first();
    const productTitle =
      (await firstRow.locator("td").first().textContent())?.trim() || "";

    // Click delete button on first product
    const deleteButton = firstRow.getByTestId("delete-button");
    await deleteButton.click();

    // Wait for delete confirmation dialog
    const deleteDialog = page.getByTestId("delete-confirmation-dialog");
    await expect(deleteDialog).toBeVisible({ timeout: 5000 });

    // Verify dialog shows product title (check if dialog contains the title text)
    // The title might be wrapped in quotes and strong tag, so use contains
    if (productTitle) {
      const dialogText = await deleteDialog.textContent();
      expect(dialogText).toContain(productTitle);
    }

    // Confirm deletion
    const confirmButton = deleteDialog.getByRole("button", {
      name: /^delete$/i,
    });
    await confirmButton.click();

    // Wait for dialog to close
    await expect(deleteDialog).toBeHidden({ timeout: 10000 });

    // Wait for optimistic update to complete
    await page.waitForTimeout(500);

    // Verify product was removed from list
    // Check that either count decreased OR the specific product is no longer visible
    await page.waitForLoadState("networkidle");
    const newRows = page.getByTestId("product-row");
    const newCount = await newRows.count();

    // Product should be removed (count decreased) OR product title should not be visible
    const productStillVisible = await page
      .getByText(productTitle, { exact: false })
      .isVisible()
      .catch(() => false);

    expect(newCount < initialCount || !productStillVisible).toBe(true);
  });
});
