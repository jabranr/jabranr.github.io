---
layout: post
title: Falling back to a default Open Graph image in Eleventy
date: 2026-09-23 08:00:00
categories: articles
tags: [articles, eleventy, nunjucks, open-graph, static-sites]
excerpt: 'How I avoid broken social preview images on this site by having Eleventy fall back to a default OG image when a per-page one does not exist.'
comment: true
private: false
---

Not every page on this site has its own Open Graph image — some are generated per article, others simply don't have one yet. Without a fallback, pages missing an image end up with a broken preview when shared on Twitter or Slack, which looks worse than having no custom image at all.

---

Open Graph images for link previews live as static files, one per article slug. New pages get generated images automatically, but older pages, one-off pages like the resume, and anything added before the image pipeline existed simply don't have a file waiting for them.

A template that always points `og:image` at `/og/{{ slug }}.png` will happily reference a file that isn't there, and the social preview will just show a broken image icon. I wanted every page to have _some_ reasonable image, even if it's a generic one, rather than nothing.

I added a small template filter that checks whether a page's OG image exists on disk, and falls back to a default site icon if it doesn't. In a template it's used like this:

```
{{ page.url | ogImage }}
```

The filter takes the page's URL, works out the expected image filename from the last segment of that URL, and checks the filesystem for a matching file:

```js
eleventyConfig.addFilter('ogImage', function (value) {
  if (!value) return '/icon-1024x1024.png';

  const slug = value.split('/').filter(Boolean).pop();
  const exists = fs.existsSync(`./public/og/${slug}.png`);

  return exists ? `/og/${slug}.png` : '/icon-1024x1024.png';
});
```

The tradeoff here is doing a filesystem check at build time rather than trusting a naming convention blindly. It's slightly more work per page, but it means the site never links to a missing image, and I don't have to remember to backfill an OG image for every old post before it's safe to deploy.

### Why derive the slug from the URL and not the title

Titles change more often than URLs do — a small wording tweak to a title shouldn't suddenly break the link between a page and its image. The URL slug is stable once a page is published, so keying the lookup off that instead of the title means renaming a title later doesn't silently orphan the image.

### Gotcha

This only works because image generation and the fallback filter agree on the same naming convention — slug-based filenames. If one part of the pipeline ever switched to using the title instead, the fallback would kick in for every page, and every image would silently look wrong instead of failing loudly. Keeping that convention documented in one place, rather than duplicated in two scripts, would remove this fragility — something worth fixing later.

### References

- [Open Graph protocol](https://ogp.me/)
- [Eleventy: adding custom filters](https://www.11ty.dev/docs/filters/)
