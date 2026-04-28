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

| Filter          | Purpose                           | Example                                      |
| --------------- | --------------------------------- | -------------------------------------------- |
| `format_date`   | Format dates with dayjs           | `{{ date \| format_date('MMMM DD, YYYY') }}` |
| `number_format` | Format numbers with locale        | `{{ count \| number_format }}`               |
| `absoluteUrl`   | Convert relative URLs to absolute | `{{ path \| absoluteUrl }}`                  |
| `appVersion`    | Get current git version           | `{{ '' \| appVersion }}`                     |
| `dump`          | Debug output (util.inspect)       | `{{ data \| dump }}`                         |

## Collections

Collections are groups of content defined in `.eleventy.js`:

- **`articles`**: All posts tagged with "articles"
- **`projects`**: All posts tagged with "projects"
- **`rss`**: Combined articles + projects sorted by date (for RSS feed)

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
