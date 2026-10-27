# Eleventy Conventions

This document covers Eleventy-specific conventions and configurations for this project.

## Template Engine

This project uses **Nunjucks** (.njk files) as the template engine.

**Syntax:**

- Variables: `{{ variable }}`
- Conditionals: `{% if condition %}...{% endif %}`
- Loops: `{% for item in items %}...{% endfor %}`

## Custom Filters

Custom filters are defined in `.eleventy.js`:

| Filter          | Purpose                           | Example                                                  |
| --------------- | --------------------------------- | -------------------------------------------------------- |
| `format_date`   | Format dates with dayjs           | `{{ date \| format_date('MMMM DD, YYYY') }}`             |
| `number_format` | Format numbers with locale        | `{{ count \| number_format }}`                           |
| `absoluteUrl`   | Convert relative URLs to absolute | `{{ path \| absoluteUrl }}`                              |
| `appVersion`    | Get current git version           | `{{ '' \| appVersion }}`                                 |
| `dump`          | Debug output (util.inspect)       | `{{ data \| dump }}`                                     |
| `ogImage`       | Social card for a page URL        | `{{ page.url \| ogImage \| absoluteUrl }}`               |
| `groupByYear`   | Group pages by year, newest first | `{% for g in articles \| groupByYear %}`                 |
| `vtName`        | View transition name for a URL    | `style="view-transition-name: {{ page.url \| vtName }}"` |

The `currentYear` Nunjucks global holds the build year (used in the footer).

## Collections

Collections are groups of content defined in `.eleventy.js`:

- **`articles`**: All posts tagged with "articles"
- **`projects`**: All posts tagged with "projects"
- **`rss`**: Combined articles + projects sorted by date (for RSS feed)
- **`contourMaps`**: Every contour SVG to render (articles, projects, homepage, 404, list pages, selected work)

## JavaScript Templates

| Template          | Output                | Purpose                                                            |
| ----------------- | --------------------- | ------------------------------------------------------------------ |
| `contour.11ty.js` | `/contour/<slug>.svg` | Seeded contour maps used as CSS masks (one per `contourMaps` item) |
| `search.11ty.js`  | `/search.json`        | Articles and projects for the command palette                      |

## Data Files

| File                | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `_data/site.js`     | Name, role, employer, description, email and social links |
| `_data/work.json`   | "Selected work" cards on the homepage                     |
| `_data/talks.json`  | Talks on the speaking page and homepage                   |
| `_data/resume.json` | Resume content                                            |

## Page Front Matter

| Key           | Used by    | Purpose                                                        |
| ------------- | ---------- | -------------------------------------------------------------- |
| `eyebrow`     | `page.njk` | Small label above the page title                               |
| `contour`     | `page.njk` | Slug of a contour SVG for the header band                      |
| `scripts`     | `base.njk` | Extra scripts to load with `defer` (e.g. the live contour map) |
| `stylesheets` | `base.njk` | Extra stylesheets (e.g. `/resume.css`)                         |
| `noindex`     | `base.njk` | Adds `noindex, nofollow`                                       |

**Access in templates:**

```njk
{% for article in collections.articles %}
  <h2>{{ article.data.title }}</h2>
{% endfor %}
```

## Environment Variables

Environment variables are loaded from `.env.development` or `.env.production` based on `NODE_ENV`.

**Access in templates:**

```njk
{{ env_APP_HOSTNAME }}
```

Variables are prefixed with `env_` and come from the `config` object defined in `_data/config.js`.

## Configuration File

The main Eleventy configuration is in `.eleventy.js`:

- Plugin registration
- Filter definitions
- Collection creation
- Passthrough copy rules
- Template engine settings
