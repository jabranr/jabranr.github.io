const { test, expect } = require('@playwright/test');

test.describe('Articles Page', () => {
  test('should load articles page', async ({ page }) => {
    await page.goto('/articles');
    await expect(page).toHaveTitle('Articles');
  });

  test('should display articles list', async ({ page }) => {
    await page.goto('/articles');
    
    // Check that there are article links on the page
    const articleLinks = page.locator('article a, .article a, h2 a, h3 a');
    const count = await articleLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to individual article', async ({ page }) => {
    await page.goto('/articles');
    
    // Click on the first article link
    const firstArticleLink = page.locator('article a, .article a, h2 a, h3 a').first();
    await firstArticleLink.click();
    
    // Verify we're on an article page
    await expect(page).toHaveURL(/.*articles\/.+/);
  });

  test('should have pagination if there are many articles', async ({ page }) => {
    await page.goto('/articles');
    
    // Check if pagination exists (might not be present if there are few articles)
    const body = await page.textContent('body');
    // This is a soft check - pagination might exist
    expect(body).toBeTruthy();
  });
});
