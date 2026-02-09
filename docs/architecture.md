# Project Architecture

This document describes the project structure and infrastructure.

## Repository Structure

```
.
├── _data/              # Eleventy data files (config, resume data, etc.)
├── _includes/          # Reusable Nunjucks templates/partials
├── articles/           # Blog articles in Markdown (.md)
├── assets/             # Static assets (images, fonts, etc.)
├── docs/               # AI agent documentation
├── integration/        # Playwright test files (.spec.js)
├── misc/               # Miscellaneous files
├── projects/           # Project pages
├── public/             # Generated CSS and static files
├── styles/             # Source CSS files (Tailwind)
├── .eleventy.js        # Eleventy configuration
├── index.njk           # Homepage template
├── resume.njk          # Resume page template
├── speaking.njk        # Speaking engagements page
├── sitemap.njk         # Sitemap template
└── rss.njk            # RSS feed template
```

## Key Configuration Files

| File | Purpose |
|------|---------|
| `.eleventy.js` | Eleventy configuration, plugins, filters, collections |
| `tailwind.config.js` | Tailwind CSS configuration |
| `playwright.config.js` | Playwright test configuration |
| `.editorconfig` | Editor settings (2 space indent, LF line endings) |
| `package.json` | Dependencies and npm scripts |
| `.env.development` | Development environment variables |
| `.env.production` | Production environment variables |

## Technology Stack

- **Static Site Generator**: Eleventy (11ty) v3.1.2
- **Template Engine**: Nunjucks
- **Styling**: Tailwind CSS v3.4.19
- **Testing**: Playwright
- **Build Tool**: npm scripts with npm-run-all
- **Node Version**: 22.17.0 (managed via Volta)
- **Code Formatting**: Prettier (via @jabraf/prettier config)
- **Git Hooks**: Husky with pretty-quick for pre-commit formatting

## CI/CD Pipeline

**GitHub Actions** workflow (`.github/workflows/ci.yml`):

**Triggers:**
- Pull requests (opened, synchronized, reopened)
- Pushes to `main` branch

**Steps:**
1. Checkout code
2. Setup Node.js 22 with npm cache
3. Install dependencies with `npm ci`
4. Build the site with `npm run build`
5. Install Chromium browser for Playwright
6. Run integration tests with `CI=true npm test`
7. Upload test reports as artifacts (if tests fail)

**Concurrency:** Cancels in-progress runs for the same ref to save resources.

## Version Tracking

Version is tracked via git commit hash stored in `version.txt`:
- Generated during build process
- Accessible in templates via `appVersion` filter
- First 7 characters of commit SHA

## Generated Files

**Do not modify these directly:**
- `public/*.css` - Generated from `styles/*.css` by Tailwind
- `_site/` - Eleventy build output (if present)
- `version.txt` - Generated during build
- `node_modules/` - Dependencies

These files are either build artifacts or should be managed through their source files.
