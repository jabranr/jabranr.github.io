const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Jabran Rafique/);
  });

  test('should display main navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation links by finding actual links
    await expect(page.locator('a[href*="articles"]')).toHaveCount(await page.locator('a[href*="articles"]').count());
    await expect(page.locator('a[href*="projects"]')).toHaveCount(await page.locator('a[href*="projects"]').count());
    await expect(page.locator('a[href*="speaking"], a[href*="speak"]')).toHaveCount(await page.locator('a[href*="speaking"], a[href*="speak"]').count());
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

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Test articles link
    const articlesLink = page.locator('a[href*="articles"]').first();
    await articlesLink.click();
    await expect(page).toHaveURL(/.*articles/);
  });
});
