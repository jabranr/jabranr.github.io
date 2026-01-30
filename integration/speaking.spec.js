const { test, expect } = require('@playwright/test');

test.describe('Speaking Page', () => {
  test('should load speaking page', async ({ page }) => {
    await page.goto('/speaking');
    await expect(page).toHaveTitle('Speaking - Jabran Rafique');
  });

  test('should display speaking content with headings', async ({ page }) => {
    await page.goto('/speaking');
    
    // Check for speaking page structure with headings
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
    
    // Verify the page has meaningful content
    const content = await page.textContent('body');
    expect(content.length).toBeGreaterThan(100);
  });

  test('should have main content area', async ({ page }) => {
    await page.goto('/speaking');
    
    // Check for main content section
    const main = page.locator('main, .main, [role="main"]').first();
    await expect(main).toBeVisible();
  });
});
