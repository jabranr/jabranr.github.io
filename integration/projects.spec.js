import { test, expect } from '@playwright/test';

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

  test('pagination should work correctly', async ({ page }) => {
      await page.goto('/projects');

      // Check for presence of pagination link (e.g., "Next" or page number)
      const pagination = page.locator('[data-testid="pagination"] > a');
      const initialProjectLinks = await page.locator(PROJECT_LINK_SELECTOR).count();

      await pagination.first().click();
      // Verify that we have navigated to the next page
      await expect(page).toHaveURL(/.*projects\/\d+\//);

      // Verify that page heading has page number
      const pageHeading = page.locator('h1');
      await expect(pageHeading).toContainText('Projects - Page 2');

      // check current page in pagination is. a span and not link
      const currentPage = page.locator('[data-testid="pagination"] > span[aria-current="page"]');
      await expect(currentPage).toHaveText('2');
    });
});
