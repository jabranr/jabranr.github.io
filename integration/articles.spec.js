import { test, expect } from '@playwright/test';

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

  test('pagination should work correctly', async ({ page }) => {
    await page.goto('/articles');

    // Check for presence of pagination link (e.g., "Next" or page number)
    const pagination = page.locator('[data-testid="pagination"] > a');
    const initialArticleLinks = await page.locator(ARTICLE_LINK_SELECTOR).count();

    await pagination.first().click();
    // Verify that we have navigated to the next page
    await expect(page).toHaveURL(/.*articles\/\d+\//);

    // Verify that page heading has page number
    const pageHeading = page.locator('h1');
    await expect(pageHeading).toContainText('Articles - Page 2');

    // check current page in pagination is. a span and not link
    const currentPage = page.locator('[data-testid="pagination"] > span[aria-current="page"]');
    await expect(currentPage).toHaveText('2');
  });
});
