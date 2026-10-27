import { test, expect } from '@playwright/test';

test.describe('Homepage', { tag: ['@e2e'] }, () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Jabran Rafique/);
  });

  test('should display main navigation links', async ({ page }) => {
    await page.goto('/');

    // Check for navigation links by finding actual links
    await expect(page.locator('a[href*="articles"]')).toHaveCount(await page.locator('a[href*="articles"]').count());
    await expect(page.locator('a[href*="projects"]')).toHaveCount(await page.locator('a[href*="projects"]').count());
    await expect(page.locator('a[href*="speaking"], a[href*="speak"]')).toHaveCount(
      await page.locator('a[href*="speaking"], a[href*="speak"]').count()
    );
    await expect(page.locator('a[href*="resume"]')).toHaveCount(await page.locator('a[href*="resume"]').count());

    // Verify at least one of each type exists
    expect(await page.locator('a[href*="articles"]').count()).toBeGreaterThan(0);
  });

  test('should display author information', async ({ page }) => {
    await page.goto('/');

    // Check for the author's name
    const content = await page.textContent('body');
    expect(content).toContain('Jabran');
  });

  test('should show the name as the main heading with role and employer', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Jabran\s*Rafique/);
    await expect(page.locator('#main')).toContainText('Tech Lead at Sky');
  });

  test('should list selected work with links to each product', async ({ page }) => {
    await page.goto('/');

    const work = page.getByRole('region', { name: 'Selected work' });
    const cards = work.getByRole('listitem');
    await expect(cards).toHaveCount(4);
    for (const href of await cards.getByRole('link').evaluateAll((links) => links.map((a) => a.href))) {
      expect(href).toMatch(/^https:\/\//);
    }
  });

  test('should show the latest five articles and talks with photos', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('region', { name: 'Latest writing' }).getByRole('listitem')).toHaveCount(5);
    const talks = page.getByRole('region', { name: 'On stage' });
    await expect(talks.getByRole('img').first()).toHaveAttribute('alt', /Jabran speaking/);
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');

    // Test articles link
    const articlesLink = page.locator('a[href*="articles"]').first();
    await articlesLink.click();
    await expect(page).toHaveURL(/.*articles/);
  });
});
