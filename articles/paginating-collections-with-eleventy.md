---
layout: post
title: Paginating a growing collection with Eleventy
date: 2026-09-23 12:00:00
categories: articles
tags: [articles, eleventy, nunjucks, pagination, static-sites]
excerpt: "How this site splits a growing list of articles into pages using Eleventy's built-in pagination, and the one config detail that decides which page number a URL actually points to."
comment: true
private: false
---

The articles list on this site was a single long page for years. That was fine at a dozen posts, but once the count climbed past what fits on one screen without endless scrolling, a plain list stopped being useful — a reader landing on the page had to scroll past everything to find anything.

Eleventy already has an answer for this built into its templating layer, so the fix didn't need a plugin or a hand-rolled loop. A page's frontmatter can declare a `pagination` block, and Eleventy turns that single template into as many output pages as the data needs:

```yaml
pagination:
  data: collections.articles
  size: 10
  alias: articles
  reverse: true
```

`size: 10` is what actually decides how many articles land on each page — ten here, though it could be any number, and this repository's own config is the source of truth if it ever changes. `alias: articles` matters more than it looks: without it, the current page's slice of data is only reachable as `pagination.items`, a name that says nothing about what's inside it. Giving it an alias means the template body can just write {% raw %}`{% for article in articles %}`{% endraw %}, which reads the same whether you're looking at page one or page twelve. `reverse: true` flips the naturally-oldest-first order of the collection so page one shows the newest posts instead of the very first article ever published.

The part that took the most trial and error wasn't the pagination block itself — it was the permalink:

{% raw %}

```yaml
permalink: '/articles/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber + 1 }}/{% endif %}'
```

{% endraw %}

The naive version of this, without the `if`, would have written every single page — including the first one — to a URL like `/articles/1/`, `/articles/2/`, and so on, leaving nothing at plain `/articles/` at all. Readers linking to "the articles page" would have hit a 404, because that URL would never have been generated. The condition exists specifically to keep page zero (`pagination.pageNumber === 0`, Eleventy's pagination is zero-indexed) at the bare `/articles/` path, and only append a number from page two onward.

That zero-indexing is also why the pagination nav in the template adds one before displaying anything to a reader:

{% raw %}

```njk
{% if pagination.pageNumber > 0 %}Articles - Page {{ pagination.pageNumber + 1 }}{% else %}Articles{% endif %}
```

{% endraw %}

Nobody wants to land on a link labelled "Page 0" — the internal index and the number shown on screen are deliberately different values, and the `+ 1` is the only place that translation happens.

Getting the pagination _links_ themselves to highlight the current page correctly needed one more piece of Eleventy's pagination data — `pagination.hrefs`, an array of the URL each page will be written to, in the same order as `pagination.pages`:

{% raw %}

```njk
{% for pageEntry in pagination.pages %}
  {% if pagination.hrefs[loop.index0] == '/articles/1/' or page.url == pagination.hrefs[loop.index0] %}
    <span aria-current="page">{{ loop.index }}</span>
  {% else %}
    <a href="/articles/{% if loop.index != loop.first %}{{ loop.index }}/{% endif %}">{{ loop.index }}</a>
  {% endif %}
{% endfor %}
```

{% endraw %}

The `pagination.hrefs[loop.index0] == '/articles/1/'` check exists because of the same zero-index quirk as above: the first page's real URL is `/articles/`, not `/articles/1/`, so without that special case the very first pagination link would never render as "current" when a reader is actually looking at page one.

None of this needed a plugin, a manual chunking function, or a second data file — Eleventy already walks the collection and writes one file per page once the frontmatter describes how to slice it. The part actually worth double-checking on any project that copies this pattern is the permalink condition; get the zero-index handling wrong there and the homepage of your list either duplicates or vanishes, and the failure only shows up once someone tries to actually use the pagination.

### References

- [Eleventy: Pagination](https://www.11ty.dev/docs/pagination/)
- [Eleventy: Pagination data variables](https://www.11ty.dev/docs/pagination/#paged-navigation)
