import { test, expect } from '@playwright/test';

// Contact goes through /contact/ so Cloudflare Web Analytics can count it as a page view
test.describe('Contact', { tag: ['@e2e'] }, () => {
  test('should show the email address on an indexable /contact/ page', async ({ page }) => {
    await page.goto('/contact/');
    await expect(page).toHaveTitle('Contact - Jabran Rafique');
    await expect(page.locator('h1')).toHaveText('Contact');
    await expect(page.getByTestId('contact-email')).toHaveAttribute('href', 'mailto:hello@jabran.me');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'all');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/contact\/$/);
  });

  test('should link the footer to /contact/ instead of a mailto link', async ({ page }) => {
    for (const path of ['/', '/articles/', '/articles/secret-sauces-of-git/', '/projects/', '/speaking/']) {
      await page.goto(path);
      await expect(page.getByTestId('footer-contact'), path).toHaveAttribute('href', '/contact/');
      await expect(page.locator('footer a[href^="mailto:"]'), path).toHaveCount(0);
    }
  });

  test('should only use mailto links on the contact page', async ({ page }) => {
    for (const path of ['/', '/articles/', '/projects/', '/speaking/']) {
      await page.goto(path);
      await expect(page.locator('a[href^="mailto:"]'), path).toHaveCount(0);
    }
  });

  test('should open /contact/ from the command palette', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('ControlOrMeta+k');
    await page.keyboard.type('contact');
    await expect(page.getByRole('option').first()).toContainText('Contact');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/contact\/$/);
  });
});
