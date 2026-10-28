import { test, expect } from '@playwright/test';

test.describe('Resume Page', { tag: ['@e2e'] }, () => {
  test('should load resume page', async ({ page }) => {
    await page.goto('/resume');
    await expect(page).toHaveTitle(/Jabran Rafique/);
  });

  test('should display resume content', async ({ page }) => {
    await page.goto('/resume');

    // Check for resume-related content
    const content = await page.textContent('body');
    expect(content).toContain('Jabran');
  });

  test('should not be indexed by search engines', async ({ page }) => {
    await page.goto('/resume');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  });

  test('should print without the site header and footer', async ({ page }) => {
    await page.goto('/resume');
    await page.emulateMedia({ media: 'print' });

    await expect(page.locator('body > header')).toBeHidden();
    await expect(page.locator('body > footer')).toBeHidden();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Jabran Rafique');
  });

  test('should have structured resume sections', async ({ page }) => {
    await page.goto('/resume');

    // Resume typically has sections - check for headings
    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);
  });
});
