# AI Agent Guidance

This document provides guidance for AI agents (GitHub Copilot, Claude Code, Augment, etc.) working on this codebase. Please read this carefully before making any changes.

## Project Overview

This is a personal website and blog built with:

- **Static Site Generator**: [Eleventy (11ty)](https://www.11ty.dev/) v3.1.2
- **Template Engine**: Nunjucks (.njk files)
- **Styling**: Tailwind CSS v3.4.19 with custom configuration
- **Testing**: Playwright for end-to-end integration tests
- **Build Tool**: npm scripts with npm-run-all
- **Node Version**: 22.17.0 (managed via Volta)
- **Code Formatting**: Prettier (via @jabraf/prettier config)
- **Git Hooks**: Husky with pretty-quick for pre-commit formatting

## Repository Structure

```
.
├── _data/              # Eleventy data files (config, resume data, etc.)
├── _includes/          # Reusable Nunjucks templates/partials
├── articles/           # Blog articles in Markdown (.md)
├── assets/             # Static assets (images, fonts, etc.)
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

## Development Workflow

### Starting Development

```bash
npm start               # Start dev server with watch mode (port 8080)
```

This runs both:
- Eleventy dev server with live reload
- Tailwind CSS watch mode for style changes

### Building

```bash
npm run build          # Full production build
```

Build process:
1. Builds CSS with Tailwind (minified)
2. Generates version.txt with git commit hash
3. Runs Eleventy build

### Testing

```bash
npm test               # Run Playwright tests (headless)
npm run test:headed    # Run with browser visible
npm run test:ui        # Open Playwright UI mode
npm run test:report    # View test report
```

See [TESTING.md](./TESTING.md) for detailed testing guidelines.

### Code Formatting

```bash
npx prettier --write <file>  # Format specific files
```

Code is automatically formatted on commit via Husky pre-commit hook.

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

## Code Style Guidelines

See [STYLING.md](./STYLING.md) for detailed code style guidelines.

**Quick Reference:**
- **Indentation**: 2 spaces (enforced by EditorConfig)
- **Line Endings**: LF (Unix-style)
- **Formatting**: Prettier with @jabraf/prettier config
- **Template Language**: Nunjucks for HTML templates
- **CSS**: Tailwind utility classes, avoid custom CSS when possible

## Common Tasks for AI Agents

### Adding a New Article

1. Create a new `.md` file in the `articles/` directory
2. Add frontmatter with required fields:
   ```yaml
   ---
   title: "Article Title"
   date: YYYY-MM-DD
   tags: articles
   excerpt: "Brief description"
   ---
   ```
3. Write content in Markdown
4. The article will automatically appear in the articles listing

### Modifying Templates

- Edit `.njk` files in root or `_includes/` directory
- Use Nunjucks syntax: `{{ variable }}`, `{% if condition %}`, etc.
- Test changes with `npm start` to see live preview

### Updating Styles

1. Prefer Tailwind utility classes over custom CSS
2. If custom CSS needed, add to `styles/main.css` or `styles/resume.css`
3. Tailwind config at `tailwind.config.js` for theme customization
4. CSS is automatically rebuilt during development

### Adding Integration Tests

1. Create `.spec.js` file in `integration/` directory
2. Follow existing test patterns (see `integration/homepage.spec.js`)
3. Use Playwright test API with page fixtures
4. Run tests to verify: `npm test`

## Important Conventions

### Eleventy Filters

Custom filters defined in `.eleventy.js`:
- `format_date`: Format dates with dayjs
- `number_format`: Format numbers with locale
- `absoluteUrl`: Convert relative URLs to absolute
- `appVersion`: Get current git version
- `dump`: Debug output (util.inspect)

### Collections

- `articles`: All posts tagged with "articles"
- `projects`: All posts tagged with "projects"
- `rss`: Combined articles + projects sorted by date

### Environment Variables

Loaded from `.env.development` or `.env.production` based on NODE_ENV.
Access via `config` object in templates (e.g., `env_APP_HOSTNAME`).

## Testing Strategy

- **Integration Tests**: Playwright tests in `integration/` directory
- **Test Approach**: E2E tests covering critical user paths
- **CI Pipeline**: Tests run automatically on PRs and main branch pushes
- **Coverage**: Homepage, articles, projects, resume, speaking, 404 page

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):
- Runs on PRs and pushes to main
- Installs dependencies with `npm ci`
- Builds the site
- Installs Playwright browsers
- Runs all integration tests
- Uploads test reports as artifacts

## Git Workflow

1. Changes are automatically formatted on commit (via Husky)
2. All PRs must pass CI checks before merging
3. Version tracking via git commit hash in `version.txt`

## Notes for AI Agents

### Do's ✅

- Follow existing patterns and conventions
- Use Tailwind utility classes for styling
- Add integration tests for new features/pages
- Maintain consistent code formatting
- Check that changes work with `npm start`
- Run tests before submitting: `npm test`
- Keep commits focused and atomic

### Don'ts ❌

- Don't add custom CSS unless necessary (use Tailwind)
- Don't modify generated files in `public/` directory
- Don't change Node version without updating Volta config
- Don't skip running tests for code changes
- Don't bypass pre-commit hooks
- Don't commit `node_modules/` or build artifacts

### Making Changes Safely

1. **Understand the context**: Review related files before changing
2. **Test locally**: Use `npm start` to preview changes
3. **Run tests**: Ensure `npm test` passes
4. **Check formatting**: Code will auto-format on commit
5. **Verify build**: Run `npm run build` to ensure production build works

## Getting Help

- **Eleventy Docs**: https://www.11ty.dev/docs/
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Playwright Docs**: https://playwright.dev/docs/intro
- **Nunjucks Docs**: https://mozilla.github.io/nunjucks/

## Related Documentation

- [TESTING.md](./TESTING.md) - Comprehensive testing guidelines
- [STYLING.md](./STYLING.md) - Code style and formatting guidelines
- [README.md](./README.md) - Project overview and basic usage

---

**Last Updated**: February 2026
