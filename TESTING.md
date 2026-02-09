# Testing Guidelines

This document provides comprehensive testing guidelines for AI agents and developers working on this project.

## Overview

This project uses **Playwright** for end-to-end integration testing. Tests verify that the built site works correctly from a user's perspective by automating browser interactions.

## Test Infrastructure

### Technology Stack

- **Framework**: Playwright v1.58.0
- **Test Runner**: @playwright/test
- **Browser**: Chromium (Desktop Chrome configuration)
- **Language**: JavaScript (ES6 modules)
- **Location**: `integration/` directory

### Configuration

Test configuration is in `playwright.config.js`:

```javascript
{
  testDir: './integration',           // Test files location
  fullyParallel: true,               // Run tests in parallel
  baseURL: 'http://localhost:8080',  // Dev server URL
  reporter: 'html',                  // HTML test reports
  retries: process.env.CI ? 2 : 0,   // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined,  // Parallel workers
}
```

### Web Server Setup

Playwright automatically:
1. Runs `npm run build` to build the site
2. Starts preview server on port 8080
3. Waits for server to be ready (120s timeout)
4. Runs tests
5. Shuts down server after tests complete

## Running Tests

### Basic Commands

```bash
# Run all tests (headless mode)
npm test

# Run with visible browser
npm run test:headed

# Open Playwright UI for interactive testing
npm run test:ui

# View last test report
npm run test:report
```

### Advanced Playwright Commands

```bash
# Run specific test file
npx playwright test integration/homepage.spec.js

# Run tests matching a pattern
npx playwright test --grep "navigation"

# Run in debug mode
npx playwright test --debug

# Update snapshots (if using visual regression)
npx playwright test --update-snapshots

# Generate test code (Codegen)
npx playwright codegen http://localhost:8080
```

## Test Structure

### Existing Test Files

| File | Purpose |
|------|---------|
| `homepage.spec.js` | Tests homepage functionality and navigation |
| `articles.spec.js` | Tests article listing and individual articles |
| `projects.spec.js` | Tests project pages |
| `resume.spec.js` | Tests resume page |
| `speaking.spec.js` | Tests speaking engagements page |
| `404.spec.js` | Tests 404 error page |

### Test File Pattern

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    // 1. Navigate to page
    await page.goto('/path');
    
    // 2. Perform actions
    await page.click('button');
    
    // 3. Assert expected outcome
    await expect(page).toHaveTitle(/Expected Title/);
  });
  
  test('should do another thing', async ({ page }) => {
    // Each test is independent
  });
});
```

## Writing Tests

### Best Practices

#### 1. **Use Descriptive Test Names**

✅ **Good:**
```javascript
test('should display article title and publication date', async ({ page }) => {
```

❌ **Bad:**
```javascript
test('check article', async ({ page }) => {
```

#### 2. **Test User Behaviors, Not Implementation**

✅ **Good:** Test what users see and do
```javascript
await expect(page.locator('h1')).toContainText('Welcome');
await page.getByRole('button', { name: 'Subscribe' }).click();
```

❌ **Bad:** Test specific HTML structure
```javascript
await expect(page.locator('div.container > div.header > h1')).toBeVisible();
```

#### 3. **Use Playwright's Built-in Waiting**

✅ **Good:** Automatic waiting with assertions
```javascript
await expect(page.locator('button')).toBeVisible();
await page.click('button'); // Waits automatically
```

❌ **Bad:** Manual waits
```javascript
await page.waitForTimeout(5000);
await page.click('button');
```

#### 4. **Keep Tests Independent**

Each test should:
- Start from a clean state
- Not depend on other tests
- Clean up after itself (if needed)

```javascript
test('first test', async ({ page }) => {
  // Don't rely on state from other tests
  await page.goto('/');
  // ...
});

test('second test', async ({ page }) => {
  // Each test gets fresh page context
  await page.goto('/');
  // ...
});
```

#### 5. **Use Appropriate Selectors**

Priority order:
1. **Role-based** (accessible): `page.getByRole('button', { name: 'Submit' })`
2. **Text-based**: `page.getByText('Welcome')`
3. **Label**: `page.getByLabel('Email')`
4. **Placeholder**: `page.getByPlaceholder('Enter email')`
5. **Test ID**: `page.getByTestId('submit-button')`
6. **CSS/XPath** (last resort): `page.locator('button.submit')`

### Common Patterns

#### Testing Page Load

```javascript
test('should load successfully', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Expected Title/);
  await expect(page).toHaveURL(/.*expected-path/);
});
```

#### Testing Navigation

```javascript
test('should navigate to article', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Articles' }).click();
  await expect(page).toHaveURL(/.*articles/);
});
```

#### Testing Content Visibility

```javascript
test('should display author information', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Jabran')).toBeVisible();
});
```

#### Testing Multiple Elements

```javascript
test('should display navigation links', async ({ page }) => {
  await page.goto('/');
  
  const articlesLinks = page.locator('a[href*="articles"]');
  expect(await articlesLinks.count()).toBeGreaterThan(0);
  
  // Or check specific count
  await expect(articlesLinks).toHaveCount(2);
});
```

#### Testing Forms

```javascript
test('should submit search form', async ({ page }) => {
  await page.goto('/');
  
  await page.getByLabel('Search').fill('test query');
  await page.getByRole('button', { name: 'Submit' }).click();
  
  await expect(page).toHaveURL(/.*search.*test.*query/);
});
```

## Adding New Tests

### When to Add Tests

Add tests when:
- ✅ Adding a new page or route
- ✅ Adding interactive features (forms, navigation, etc.)
- ✅ Fixing a bug (regression test)
- ✅ Critical user paths need verification

You may skip tests for:
- ❌ Minor styling changes
- ❌ Content-only updates
- ❌ Documentation changes

### Steps to Add a Test

1. **Create test file** in `integration/` directory:
   ```bash
   touch integration/new-feature.spec.js
   ```

2. **Write test** following patterns from existing tests:
   ```javascript
   import { test, expect } from '@playwright/test';

   test.describe('New Feature', () => {
     test('should work correctly', async ({ page }) => {
       await page.goto('/new-feature');
       // Add assertions
     });
   });
   ```

3. **Run test locally**:
   ```bash
   npm test
   ```

4. **Verify in CI**: Push changes and check GitHub Actions

## Debugging Tests

### Interactive Debugging

```bash
# Open Playwright UI
npm run test:ui

# Run with debugger attached
npx playwright test --debug

# Run specific test with visible browser
npx playwright test integration/homepage.spec.js --headed
```

### Visual Debugging

```javascript
// Take screenshot
await page.screenshot({ path: 'debug.png' });

// Take screenshot of element
await page.locator('button').screenshot({ path: 'button.png' });

// Enable trace
test.use({ trace: 'on' });
```

### Console Logs

```javascript
// Listen to console messages
page.on('console', msg => console.log('Browser console:', msg.text()));

// Check for errors
page.on('pageerror', error => console.log('Page error:', error));
```

## CI/CD Integration

### GitHub Actions Workflow

Tests run automatically on:
- Pull requests (opened, synchronized, reopened)
- Pushes to `main` branch

Workflow steps:
1. Checkout code
2. Setup Node.js 22
3. Install dependencies (`npm ci`)
4. Build site (`npm run build`)
5. Install Playwright browsers
6. Run tests (`CI=true npm run test`)
7. Upload test reports (on failure)

### Viewing CI Test Results

- **GitHub Actions**: Check "CI Checks" workflow
- **Test Reports**: Download artifact from failed runs
- **Logs**: View detailed logs in GitHub Actions

## Troubleshooting

### Common Issues

#### Tests Fail Locally but Pass in CI

- Check Node version matches (22.17.0)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm ci`
- Check for timing issues - add explicit waits

#### Tests Timeout

- Increase timeout in test:
  ```javascript
  test('slow test', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes
    // ...
  });
  ```
- Check if server starts correctly
- Look for infinite loops or unresponsive pages

#### Flaky Tests

- Use auto-waiting assertions instead of manual waits
- Increase retries in `playwright.config.js`
- Check for race conditions
- Ensure tests are independent

#### Cannot Find Element

- Use Playwright Inspector to identify selectors:
  ```bash
  npx playwright test --debug
  ```
- Check if element is in iframe or shadow DOM
- Verify element exists in built HTML

## Performance Considerations

### Test Execution Time

- Tests run in parallel by default
- Typical full suite: 1-2 minutes locally
- CI may take longer (building from scratch)

### Optimizing Tests

- Use `test.beforeEach` for repeated setup
- Share expensive setup across tests with `test.beforeAll`
- Mock external API calls when possible
- Reuse authentication state

## Resources

- **Playwright Documentation**: https://playwright.dev/docs/intro
- **Best Practices**: https://playwright.dev/docs/best-practices
- **API Reference**: https://playwright.dev/docs/api/class-test
- **Locators Guide**: https://playwright.dev/docs/locators

## Questions?

If you encounter issues or have questions about testing:
1. Check this guide first
2. Review existing test files for patterns
3. Consult Playwright documentation
4. Open an issue for project-specific problems

---

**Last Updated**: February 2026
