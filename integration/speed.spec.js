const { test, expect } = require('@playwright/test');

test.describe('Speedometer Page', { tag: ['@e2e'] }, () => {
  test.use({
    permissions: ['geolocation'],
    geolocation: { latitude: 51.507351, longitude: -0.127758, accuracy: 10 },
  });

  test('should show current location from geolocation', async ({ page }) => {
    await page.goto('/speed/');

    await expect(page.locator('h1')).toHaveText('Live Speedometer');
    await expect(page.locator('#lat')).toHaveText('51.507351°', { timeout: 5000 });
    await expect(page.locator('#lng')).toHaveText('-0.127758°');
    await expect(page.locator('#statusText')).toHaveText('Live');
  });
});
