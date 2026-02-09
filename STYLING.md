# Code Style and Formatting Guidelines

This document provides comprehensive code style and formatting guidelines for AI agents and developers working on this project.

## Overview

This project follows consistent code style conventions enforced through automated tools and configuration files. Following these guidelines ensures code quality, readability, and maintainability.

## Automated Formatting Tools

### Prettier

**Configuration**: `@jabraf/prettier` package (referenced in `package.json`)

Code is automatically formatted on commit via Husky pre-commit hook.

**Manual Formatting:**
```bash
# Format specific files
npx prettier --write src/file.js

# Format all files
npx prettier --write .

# Check formatting without changing files
npx prettier --check .
```

### EditorConfig

**Configuration**: `.editorconfig`

Settings enforced by EditorConfig:
- **Indent Style**: Spaces
- **Indent Size**: 2 spaces
- **End of Line**: LF (Unix-style)
- **Charset**: UTF-8
- **Trim Trailing Whitespace**: Yes (except Markdown)
- **Insert Final Newline**: Yes

Ensure your editor supports EditorConfig or install the appropriate plugin.

## Language-Specific Guidelines

### JavaScript

#### General Style

```javascript
// ✅ Good: 2-space indentation, clear variable names
function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    total += item.price;
  }
  return total;
}

// ❌ Bad: 4-space indentation, unclear names
function calc(x) {
    let t = 0;
    for (const i of x) {
        t += i.p;
    }
    return t;
}
```

#### Module Syntax

```javascript
// ✅ Good: Use CommonJS for Node.js files
const fs = require('node:fs');
const path = require('node:path');

module.exports = function (config) {
  // ...
};

// ✅ Good: Use ES6 modules for test files
import { test, expect } from '@playwright/test';

export default function() {
  // ...
}
```

#### Variables and Constants

```javascript
// ✅ Good: const for immutable, let for mutable
const API_ENDPOINT = 'https://api.example.com';
const config = require('./config');
let currentPage = 1;

// ❌ Bad: var is outdated
var count = 0;

// ❌ Bad: let for values that don't change
let PI = 3.14159;
```

#### Functions

```javascript
// ✅ Good: Named functions for clarity
function formatDate(date, format) {
  return dayjs(date).format(format);
}

// ✅ Good: Arrow functions for callbacks
const filtered = items.filter(item => item.active);

// ✅ Good: Consistent parameter spacing
eleventyConfig.addFilter('format_date', function (value, format = 'MMMM DD, YYYY') {
  return dayjs(Number(value)).format(format);
});
```

#### Object and Array Literals

```javascript
// ✅ Good: Trailing commas for multi-line
const config = {
  testDir: './integration',
  fullyParallel: true,
  reporter: 'html',
};

// ✅ Good: Consistent spacing
const items = [1, 2, 3, 4];
const obj = { name: 'John', age: 30 };

// ❌ Bad: Inconsistent spacing
const items=[1,2,3,4];
```

### Nunjucks Templates

#### Template Structure

```njk
{# ✅ Good: Clear structure with comments #}
{% extends "layouts/base.njk" %}

{% block content %}
  <article>
    <h1>{{ title }}</h1>
    <time datetime="{{ date | format_date('YYYY-MM-DD') }}">
      {{ date | format_date('MMMM DD, YYYY') }}
    </time>
    {{ content | safe }}
  </article>
{% endblock %}
```

#### Variable Interpolation

```njk
{# ✅ Good: Consistent spacing in filters #}
{{ title | upper }}
{{ date | format_date('YYYY-MM-DD') }}
{{ url | absoluteUrl }}

{# ❌ Bad: Inconsistent spacing #}
{{title|upper}}
{{ date|format_date('YYYY-MM-DD' ) }}
```

#### Conditionals and Loops

```njk
{# ✅ Good: Proper indentation #}
{% if items.length > 0 %}
  <ul>
    {% for item in items %}
      <li>{{ item.name }}</li>
    {% endfor %}
  </ul>
{% else %}
  <p>No items found.</p>
{% endif %}

{# ✅ Good: Use set for complex logic #}
{% set hasArticles = collections.articles.length > 0 %}
{% if hasArticles %}
  {# Display articles #}
{% endif %}
```

### CSS / Tailwind

#### Tailwind Utility Classes

```html
<!-- ✅ Good: Use Tailwind utilities -->
<div class="mx-auto max-w-4xl px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-900">Title</h1>
  <p class="mt-4 text-gray-600">Description</p>
</div>

<!-- ❌ Bad: Custom classes when Tailwind utilities exist -->
<div class="custom-container">
  <h1 class="custom-title">Title</h1>
</div>
```

#### Custom CSS

Only add custom CSS when Tailwind utilities are insufficient:

```css
/* ✅ Good: Custom CSS for unique needs */
@layer components {
  .prose-custom {
    @apply max-w-none;
  }
}

/* ✅ Good: CSS variables for theme values */
:root {
  --primary-color: #1e40af;
}

/* ❌ Bad: Reinventing Tailwind utilities */
.margin-top-large {
  margin-top: 2rem;
}
```

#### CSS File Organization

```css
/* styles/main.css */

/* 1. Tailwind directives first */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 2. Then imports */
@import 'normalize.css';

/* 3. Custom base styles */
@layer base {
  body {
    @apply font-sans antialiased;
  }
}

/* 4. Custom components */
@layer components {
  .btn-primary {
    @apply rounded bg-blue-600 px-4 py-2 text-white;
  }
}

/* 5. Custom utilities */
@layer utilities {
  .content-auto {
    content-visibility: auto;
  }
}
```

### Markdown

#### Frontmatter

```markdown
---
title: "Article Title"
date: 2026-02-09
tags: articles
excerpt: "Brief description of the article"
---

## Article Content

First paragraph of the article...
```

#### Content Style

```markdown
<!-- ✅ Good: ATX-style headers -->
## Section Title
### Subsection

<!-- ❌ Bad: Setext-style headers -->
Section Title
-------------

<!-- ✅ Good: Fenced code blocks with language -->
```javascript
const greeting = 'Hello';
```

<!-- ❌ Bad: Indented code blocks -->
    const greeting = 'Hello';

<!-- ✅ Good: Unordered lists with consistent markers -->
- Item one
- Item two
  - Nested item

<!-- ✅ Good: Ordered lists -->
1. First step
2. Second step
3. Third step
```

### JSON Configuration Files

```json
{
  "name": "package-name",
  "version": "1.0.0",
  "scripts": {
    "start": "eleventy --serve",
    "build": "eleventy"
  },
  "dependencies": {
    "eleventy": "^3.0.0"
  }
}
```

**Style Rules:**
- 2-space indentation
- Double quotes for strings
- No trailing commas (invalid JSON)
- Sorted keys (when practical)

## File Naming Conventions

### General Rules

- **Lowercase with hyphens**: `my-new-file.js` ✅
- **Not camelCase**: `myNewFile.js` ❌
- **Not snake_case**: `my_new_file.js` ❌

### Specific Patterns

| File Type | Pattern | Example |
|-----------|---------|---------|
| Templates | `.njk` | `index.njk`, `base-layout.njk` |
| Markdown | `.md` | `article-title.md`, `README.md` |
| Tests | `.spec.js` | `homepage.spec.js` |
| Config | Varies | `.eleventy.js`, `tailwind.config.js` |
| Styles | `.css` | `main.css`, `resume.css` |
| Data | `.json`, `.js` | `config.js`, `resume.json` |

## Code Organization

### File Structure

```javascript
// 1. Node built-in modules first
const fs = require('node:fs');
const path = require('node:path');

// 2. External dependencies
const dayjs = require('dayjs');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

// 3. Local modules
const config = require('./_data/config');

// 4. Configuration/constants
const DEFAULT_FORMAT = 'MMMM DD, YYYY';

// 5. Main logic
module.exports = function (eleventyConfig) {
  // Implementation
};
```

### Function Organization

```javascript
// ✅ Good: Clear, focused functions
function formatDate(date, format = 'MMMM DD, YYYY') {
  if (format === 'unix') {
    return +dayjs();
  }
  
  if (date === undefined) {
    return dayjs().format(format);
  }
  
  return dayjs(Number(date)).format(format);
}

// ❌ Bad: Complex, hard to follow
function processDateAndMaybeOtherStuff(d, f, opts) {
  let result;
  if (opts && opts.unix) result = +dayjs();
  else if (!d) result = dayjs().format(f || 'MMMM DD, YYYY');
  else result = dayjs(Number(d)).format(f);
  return result;
}
```

## Comments and Documentation

### When to Comment

```javascript
// ✅ Good: Explain WHY, not WHAT
// Using depth: 5 to avoid truncating large nested objects
eleventyConfig.addFilter('dump', function (value) {
  return util.inspect(value, { depth: 5 });
});

// ❌ Bad: Stating the obvious
// This function adds a filter called dump
eleventyConfig.addFilter('dump', function (value) {
  return util.inspect(value);
});
```

### Documentation Comments

```javascript
/**
 * Formats a date using dayjs
 * @param {number|Date} value - Date to format
 * @param {string} format - Format string (default: 'MMMM DD, YYYY')
 * @returns {string} Formatted date
 */
eleventyConfig.addFilter('format_date', function (value, format = 'MMMM DD, YYYY') {
  // ...
});
```

### Nunjucks Comments

```njk
{# ✅ Good: Explain complex logic #}
{# Filtering for articles published in the last 30 days #}
{% set recentArticles = collections.articles | 
  filter(article => article.date > (Date.now() - 30 * 24 * 60 * 60 * 1000)) %}

{# ❌ Bad: Unnecessary comments #}
{# Loop through articles #}
{% for article in collections.articles %}
  {{ article.title }}
{% endfor %}
```

## Git Commit Messages

### Format

```
<type>: <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
✅ Good:
feat: add dark mode toggle to navigation

Implemented dark mode switcher using Tailwind's dark mode
classes. User preference is stored in localStorage.

Closes #123

✅ Good:
fix: correct date formatting in article metadata

Changed format from MM/DD/YYYY to MMMM DD, YYYY for 
better readability.

❌ Bad:
updated stuff

❌ Bad:
Fix
```

## Best Practices Summary

### Do's ✅

- ✅ Use 2-space indentation consistently
- ✅ Let Prettier handle formatting automatically
- ✅ Use Tailwind utilities before custom CSS
- ✅ Write clear, descriptive names
- ✅ Keep functions small and focused
- ✅ Add comments for complex logic
- ✅ Follow existing patterns in the codebase
- ✅ Run formatter before committing (happens automatically)

### Don'ts ❌

- ❌ Mix tabs and spaces
- ❌ Use var in JavaScript
- ❌ Create custom CSS classes for standard spacing/colors
- ❌ Write overly complex functions
- ❌ Use single-letter variable names (except loop counters)
- ❌ Bypass the pre-commit hooks
- ❌ Ignore EditorConfig settings

## Tools and IDE Setup

### Recommended VS Code Extensions

- **EditorConfig for VS Code**: Respect `.editorconfig`
- **Prettier**: Code formatting
- **Tailwind CSS IntelliSense**: Tailwind class autocomplete
- **Nunjucks**: Template syntax highlighting

### VS Code Settings

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["class:\\s*['\"]([^'\"]*)['\"]"]
  ]
}
```

## Verification Checklist

Before committing code:

- [ ] Code is properly indented (2 spaces)
- [ ] No trailing whitespace
- [ ] Files end with newline
- [ ] Prettier has been run (automatic on commit)
- [ ] No console.log statements left in production code
- [ ] Comments explain WHY, not WHAT
- [ ] Variable names are descriptive
- [ ] Tailwind utilities used where applicable
- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)

## Resources

- **Prettier**: https://prettier.io/docs/en/
- **EditorConfig**: https://editorconfig.org/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Nunjucks**: https://mozilla.github.io/nunjucks/templating.html

---

**Last Updated**: February 2026
