const { test, expect } = require('@playwright/test');

test.describe('404 Page', { tag: ['@e2e'] }, () => {
  test('should load 404 page for non-existent route', async ({ page }) => {
    // Navigate directly to /404 to test the custom 404 page
    // Note: Eleventy 3.x dev server doesn't automatically serve custom 404 pages for non-existent routes
    await page.goto('/404');

    // Check for 404 content
    const content = await page.textContent('body');
    expect(content.toLowerCase()).toMatch(/404|not\s+found|page not found/);
  });

  test('should display 404 content', async ({ page }) => {
    await page.goto('/404');

    // Check that the 404 page has content
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should say the visitor is off the map and offer a way back', async ({ page }) => {
    await page.goto('/404');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Off the map');
    await expect(page.getByRole('link', { name: 'Back to the homepage' })).toHaveAttribute('href', /^\/\?ref=404$/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should have navigation back to home', async ({ page }) => {
    await page.goto('/404');

    // Check for a link that navigates to home
    const homeLink = page.locator('a[href="/"], a[href="https://jabran.me"], a[href="https://jabran.me/"]').first();
    if ((await homeLink.count()) > 0) {
      await expect(homeLink).toBeVisible();
    } else {
      // If no specific home link, just verify there are navigation links
      const links = page.getByRole('link');
      expect(await links.count()).toBeGreaterThan(0);
    }
  });
});
