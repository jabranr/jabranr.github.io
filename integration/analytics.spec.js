import { test, expect } from '@playwright/test';

const GOOGLE_TRACKING = /googletagmanager\.com|google-analytics\.com|analytics\.google\.com|doubleclick\.net/;

// Record third-party analytics requests made while a page loads
async function trackingRequests(page, path) {
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(path, { waitUntil: 'networkidle' });
  return requests;
}

test.describe('Analytics', { tag: ['@e2e'] }, () => {
  test('should not load Google Analytics or Tag Manager', async ({ page }) => {
    for (const path of ['/', '/articles/', '/resume/']) {
      const requests = await trackingRequests(page, path);
      expect(requests.filter((url) => GOOGLE_TRACKING.test(url))).toEqual([]);
    }
  });
});

// Cloudflare injects the Web Analytics beacon at the edge, so it only exists on deployed sites
test.describe('Cloudflare Web Analytics', { tag: ['@e2e', '@non-functional'] }, () => {
  test('should load the cookie-free Cloudflare beacon', async ({ page }) => {
    const requests = await trackingRequests(page, '/');
    expect(requests.some((url) => url.includes('static.cloudflareinsights.com/beacon.min.js'))).toBeTruthy();
  });
});
