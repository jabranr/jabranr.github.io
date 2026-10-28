import { test, expect } from '@playwright/test';

// Selector for article links - targets links within article content areas
const ARTICLE_LINK_SELECTOR = 'main a[href^="/articles/"]';

test.describe('Articles Page', { tag: ['@e2e'] }, () => {
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

  test('should group articles by year', async ({ page }) => {
    await page.goto('/articles');

    const years = await page.locator('main h2').allTextContents();
    expect(years.length).toBeGreaterThan(1);
    expect(years.every((year) => /^\d{4}$/.test(year.trim()))).toBeTruthy();
  });

  test('should show the article with its date, reading time and social card', async ({ page }) => {
    await page.goto('/articles/secret-sauces-of-git/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Secret sauces of Git');
    await expect(page.locator('article header time')).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
    await expect(page.locator('article header')).toContainText(/\d+ minutes? read/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /\/og\/secret-sauces-of-git\.jpg$/
    );
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

test.describe('Article embeds', { tag: ['@e2e'] }, () => {
  test('should embed YouTube videos from the no-cookie domain', async ({ page }) => {
    await page.goto('/articles/roads-alignment-in-google-map-maker-with-help-of-google-earth-imagery/');

    const iframes = page.locator('article iframe');
    await expect(iframes).toHaveCount(2);
    for (const src of await iframes.evaluateAll((els) => els.map((el) => el.getAttribute('src')))) {
      expect(src).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\//);
    }
  });

  test('should show tweets and pens without third-party scripts', async ({ page }) => {
    for (const path of [
      '/articles/fetch-tweets-with-twitter-api-v1-1/',
      '/articles/first-tech-job/',
      '/articles/new-cocoa-programmers-ios-objective-c-and-swift/',
      '/articles/rebuilding-united-website-development-workflow/',
    ]) {
      await page.goto(path);
      await expect(page.locator('script[src*="twitter.com"], script[src*="codepen.io"]')).toHaveCount(0);
    }
  });

  test('should load Build to Learn without page errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/articles/build-to-learn-web-development/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Build to Learn');
    expect(errors).toEqual([]);
  });
});
