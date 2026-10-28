import { test, expect } from '@playwright/test';

test.describe('Theme', { tag: ['@e2e'] }, () => {
  test('should follow the system colour scheme by default', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  });

  test('should toggle and remember the choice across pages', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Switch to dark theme' });
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();

    await page.goto('/articles/');
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  });

  test('should hide the toggle when JavaScript is off', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');

    await expect(page.locator('[data-theme-toggle]')).toBeHidden();
    await context.close();
  });
});
