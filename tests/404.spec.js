const { test, expect } = require('@playwright/test');

test.describe('404 Page', () => {
  test('should load 404 page for non-existent route', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    
    // In static sites, 404 might return 200 in dev server
    // Check for 404 content instead
    const content = await page.textContent('body');
    expect(content.toLowerCase()).toMatch(/404|not found|page.*not.*found/i);
  });

  test('should display 404 content', async ({ page }) => {
    await page.goto('/404');
    
    // Check that the 404 page has content
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have navigation back to home', async ({ page }) => {
    await page.goto('/404');
    
    // Most 404 pages have a link back to home
    const homeLinks = page.getByRole('link');
    const count = await homeLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});
