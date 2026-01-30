# Testing

This project uses [Playwright](https://playwright.dev/) for integration testing.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (with browser visible)
```bash
npm run test:headed
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### View test report
```bash
npm run test:report
```

## Test Structure

Tests are located in the `tests/` directory and cover the following pages:

- **Homepage** (`tests/homepage.spec.js`) - Tests the main landing page, navigation links, and author information
- **Articles** (`tests/articles.spec.js`) - Tests the articles listing page and navigation to individual articles
- **Projects** (`tests/projects.spec.js`) - Tests the projects listing page and navigation to individual projects
- **Resume** (`tests/resume.spec.js`) - Tests the resume page structure and content
- **Speaking** (`tests/speaking.spec.js`) - Tests the speaking engagements page
- **404 Page** (`tests/404.spec.js`) - Tests the 404 error page

## Configuration

The Playwright configuration is located in `playwright.config.js`. Key settings include:

- **Base URL**: Tests run against `http://localhost:8080`
- **Web Server**: Automatically starts the Eleventy dev server before running tests
- **Browser**: Tests run in Chromium by default
- **Retries**: Tests automatically retry 2 times in CI environment

## Writing New Tests

To add new tests:

1. Create a new file in the `tests/` directory with the `.spec.js` extension
2. Import the test utilities: `const { test, expect } = require('@playwright/test');`
3. Group related tests using `test.describe()`
4. Write individual test cases using `test()`

Example:
```javascript
const { test, expect } = require('@playwright/test');

test.describe('My Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/my-page');
    await expect(page).toHaveTitle('My Page Title');
  });
});
```

## Continuous Integration

Tests are designed to run in CI environments with:
- Automatic retry on failure (2 retries)
- Single worker to avoid resource conflicts
- Headless browser execution

## Learn More

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
