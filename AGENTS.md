# AI Agent Guidance

Personal website and blog built with Eleventy (11ty), Nunjucks templates, and Tailwind CSS.

## Quick Start

```bash
npm start   # Start dev server (port 8080)
npm test    # Run tests
npm run build  # Production build
```

## Documentation Structure

### Core Guidelines
- **[TESTING.md](./TESTING.md)** - Playwright testing patterns and best practices
- **[STYLING.md](./STYLING.md)** - Code style, formatting, and conventions

### Project-Specific Guides
- **[docs/workflows.md](./docs/workflows.md)** - Development workflows (dev, build, test, format)
- **[docs/tasks.md](./docs/tasks.md)** - Common tasks (add article, modify templates, update styles)
- **[docs/eleventy.md](./docs/eleventy.md)** - Eleventy filters, collections, and environment variables
- **[docs/architecture.md](./docs/architecture.md)** - Repository structure, tech stack, and CI/CD

## Essential Rules

### Do ✅
- Use Tailwind utility classes for styling
- Add tests for new features
- Test locally before committing: `npm start` and `npm test`

### Don't ❌
- Don't modify generated files in `public/` directory
- Don't change Node version without updating `volta` in `package.json`
- Don't bypass pre-commit hooks (code formatting is automatic)
