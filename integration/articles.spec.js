const { test, expect } = require('@playwright/test');

// Selector for article links - targets links within article content areas
const ARTICLE_LINK_SELECTOR = 'main a[href^="/articles/"]';

test.describe('Articles Page', () => {
  test('should load articles page', async ({ page }) => {
    await page.goto('/articles');
    await expect(page).toHaveTitle('Articles - Jabran Rafique');
  });

  test('should display articles list', async ({ page }) => {
    await page.goto('/articles');
    
    // Check that there are article links on the page
    const articleLinks = page.locator(ARTICLE_LINK_SELECTOR);
    const count = await articleLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to individual article', async ({ page }) => {
    await page.goto('/articles');
    
    // Click on the first article link
    const firstArticleLink = page.locator(ARTICLE_LINK_SELECTOR).first();
    await firstArticleLink.click();
    
    // Verify we're on an article page
    await expect(page).toHaveURL(/.*articles\/.+/);
  });
});
