import { test, expect } from '@playwright/test';

// Count canvas frames drawn in a time window (each frame starts with clearRect)
function countDraws(page, ms) {
  return page.evaluate(
    (ms) =>
      new Promise((resolve) => {
        const proto = CanvasRenderingContext2D.prototype;
        const original = proto.clearRect;
        let frames = 0;
        proto.clearRect = function (...args) {
          frames++;
          return original.apply(this, args);
        };
        setTimeout(() => {
          proto.clearRect = original;
          resolve(frames);
        }, ms);
      }),
    ms
  );
}

test.describe('Contour maps', { tag: ['@e2e'] }, () => {
  test('should draw the live map on the homepage hero', async ({ page }) => {
    await page.goto('/');

    const hero = page.locator('[data-contour-live]');
    await expect(hero.locator('canvas')).toBeAttached();
    await expect(hero).toHaveClass(/\bis-live\b/);
  });

  test('should report coordinates and elevation when the pointer moves over the map', async ({ page }) => {
    await page.goto('/');

    const hero = page.locator('[data-contour-live]');
    const box = await hero.boundingBox();
    await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.4);
    await page.mouse.move(box.x + box.width * 0.72, box.y + box.height * 0.42);

    await expect(page.locator('[data-contour-elev]')).toContainText(/Elevation \d+ m/);
    await expect(page.locator('[data-contour-pos]')).toContainText(/\d+\.\d{4}° N/);
  });

  test('should stop drawing when the map is scrolled out of view', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-contour-live]')).toHaveClass(/\bis-live\b/);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    expect(await countDraws(page, 1000)).toBe(0);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => countDraws(page, 500)).toBeGreaterThan(0);
  });

  test('should keep the map still for visitors who prefer reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('[data-contour-live]')).toHaveClass(/\bis-live\b/);

    expect(await countDraws(page, 1000)).toBe(0);
  });

  test('should show the pre-rendered map without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');

    const fallback = page.locator('[data-contour-static]');
    await expect(fallback).toBeVisible();
    await expect(fallback).toHaveAttribute('style', /\/contour\/home\.svg/);
    await context.close();
  });

  test('should serve a seeded SVG map for each article', async ({ request }) => {
    const response = await request.get('/contour/secret-sauces-of-git.svg');
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('svg');
    expect(await response.text()).toMatch(/^<svg[\s\S]*<path[\s\S]*<\/svg>$/);
  });

  test('should give each article header its own map', async ({ page }) => {
    await page.goto('/articles/secret-sauces-of-git/');
    await expect(page.locator('article header .contour-mask')).toHaveAttribute('style', /secret-sauces-of-git\.svg/);
  });
});
