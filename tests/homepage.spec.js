const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Jabran Rafique/);
  });

  test('should display main navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check for main navigation links in the page content
    const content = await page.textContent('body');
    expect(content).toContain('articles');
    expect(content).toContain('projects');
    expect(content).toContain('speak');
    expect(content).toContain('Resume');
  });

  test('should display author information', async ({ page }) => {
    await page.goto('/');
    
    // Check for the author's name
    const content = await page.textContent('body');
    expect(content).toContain('Jabran');
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Test articles link
    const articlesLink = page.getByRole('link', { name: /blog|articles/i }).first();
    await articlesLink.click();
    await expect(page).toHaveURL(/.*articles/);
  });
});
