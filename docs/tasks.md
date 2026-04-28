# Common Tasks

This document provides step-by-step instructions for common development tasks.

## Adding a New Article

1. Create a new `.md` file in the `articles/` directory
2. Add frontmatter with required fields:
   ```yaml
   ---
   title: 'Article Title'
   date: YYYY-MM-DD
   tags: articles
   excerpt: 'Brief description'
   ---
   ```
3. Write content in Markdown below the frontmatter
4. The article will automatically appear in the articles listing

**File naming:** Use lowercase with hyphens (e.g., `my-new-article.md`)

## Modifying Templates

1. Locate the `.njk` file in root or `_includes/` directory
2. Edit using Nunjucks syntax
3. Test changes with `npm start` to see live preview

**Note:** Template changes are reflected immediately with live reload.

## Updating Styles

1. **Prefer Tailwind utility classes** over custom CSS
2. If custom CSS is needed, add to `styles/main.css` or `styles/resume.css`
3. For theme customization, edit `tailwind.config.js`
4. CSS is automatically rebuilt during development

**Example:** To add a new color, update `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      'custom-blue': '#1e40af'
    }
  }
}
```

## Adding Integration Tests

1. Create `.spec.js` file in `integration/` directory
2. Follow existing test patterns (see `integration/homepage.spec.js`)
3. Use Playwright test API with page fixtures
4. Run tests to verify: `npm test`

**Template:**

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path');
    await expect(page).toHaveTitle(/Expected/);
  });
});
```

## Adding a New Project

1. Create a new `.md` or `.njk` file in the `projects/` directory
2. Add frontmatter:
   ```yaml
   ---
   title: 'Project Name'
   date: YYYY-MM-DD
   tags: projects
   excerpt: 'Brief description'
   ---
   ```
3. Add project content
4. Project will appear in projects listing and RSS feed
