const { test, expect } = require('@playwright/test');

test.describe('Speaking Page', () => {
  test('should load speaking page', async ({ page }) => {
    await page.goto('/speaking');
    await expect(page).toHaveTitle('Speaking');
  });

  test('should display speaking content', async ({ page }) => {
    await page.goto('/speaking');
    
    // Check for speaking-related content
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('should have content sections', async ({ page }) => {
    await page.goto('/speaking');
    
    // Check for some structure
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });
});
