const { test, expect } = require('@playwright/test');

// Selector for project links - targets links within main content area that go to projects
const PROJECT_LINK_SELECTOR = 'main a[href^="/projects/"]';

test.describe('Projects Page', () => {
  test('should load projects page', async ({ page }) => {
    await page.goto('/projects');
    await expect(page).toHaveTitle('Projects - Jabran Rafique');
  });

  test('should display projects list', async ({ page }) => {
    await page.goto('/projects');
    
    // Check that there are project links on the page
    const projectLinks = page.locator(PROJECT_LINK_SELECTOR);
    const count = await projectLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to individual project', async ({ page }) => {
    await page.goto('/projects');
    
    // Click on the first project link
    const firstProjectLink = page.locator(PROJECT_LINK_SELECTOR).first();
    await firstProjectLink.click();
    
    // Verify we're on a project page
    await expect(page).toHaveURL(/.*projects\/.+/);
  });
});
