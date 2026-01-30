const { test, expect } = require('@playwright/test');

test.describe('Projects Page', () => {
  test('should load projects page', async ({ page }) => {
    await page.goto('/projects');
    await expect(page).toHaveTitle('Projects');
  });

  test('should display projects list', async ({ page }) => {
    await page.goto('/projects');
    
    // Check that there are project links on the page
    const projectLinks = page.locator('article a, .project a, h2 a, h3 a');
    const count = await projectLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to individual project', async ({ page }) => {
    await page.goto('/projects');
    
    // Click on the first project link
    const firstProjectLink = page.locator('article a, .project a, h2 a, h3 a').first();
    await firstProjectLink.click();
    
    // Verify we're on a project page
    await expect(page).toHaveURL(/.*projects\/.+/);
  });
});
