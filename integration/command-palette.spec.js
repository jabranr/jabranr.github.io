import { test, expect } from '@playwright/test';

test.describe('Command palette', { tag: ['@e2e'] }, () => {
  test('should open with the keyboard shortcut and close with Escape', async ({ page }) => {
    await page.goto('/');

    const palette = page.getByRole('dialog', { name: 'Search and commands' });
    await expect(palette).toBeHidden();

    await page.keyboard.press('ControlOrMeta+k');
    await expect(palette).toBeVisible();
    await expect(page.getByRole('combobox', { name: /search articles/i })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(palette).toBeHidden();
  });

  test('should open from the header search button and with the slash key', async ({ page }) => {
    await page.goto('/projects/');

    const palette = page.getByRole('dialog', { name: 'Search and commands' });
    await page.locator('header [data-cmdk-open]').click();
    await expect(palette).toBeVisible();
    await page.keyboard.press('Escape');

    await page.keyboard.press('/');
    await expect(palette).toBeVisible();
  });

  test('should search articles and open the selected result', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('ControlOrMeta+k');
    await page.keyboard.type('secret sauces');

    const firstResult = page.getByRole('option').first();
    await expect(firstResult).toContainText('Secret sauces of Git');
    await expect(firstResult).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/articles\/secret-sauces-of-git\/$/);
  });

  test('should show a helpful message when nothing matches', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('ControlOrMeta+k');
    await page.keyboard.type('zzzqqq');

    await expect(page.getByRole('option')).toHaveCount(0);
    await expect(page.getByRole('dialog')).toContainText('Nothing matches');
  });

  test('should switch the theme from an action', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/\blight\b/);

    await page.keyboard.press('ControlOrMeta+k');
    await page.keyboard.type('switch theme');
    await page.keyboard.press('Enter');

    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  });

  test('should keep the search trigger as a link to articles without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');

    const trigger = page.locator('header [data-cmdk-open]');
    await expect(trigger).toHaveAttribute('href', '/articles/');
    await trigger.click();
    await expect(page).toHaveURL(/\/articles\/$/);

    await context.close();
  });

  test('should serve a search index covering every article', async ({ request }) => {
    const response = await request.get('/search.json');
    expect(response.ok()).toBeTruthy();

    const items = await response.json();
    const articles = items.filter((item) => item.g === 'Articles');
    expect(articles.length).toBeGreaterThan(30);
    expect(items.every((item) => item.t && item.u.startsWith('/'))).toBeTruthy();
  });
});
