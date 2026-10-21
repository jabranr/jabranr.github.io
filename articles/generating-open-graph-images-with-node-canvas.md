---
layout: post
title: Generating Open Graph images at build time with node-canvas
date: 2026-09-23 07:00:00
categories: articles
tags: [articles, eleventy, node-canvas, open-graph, build-tools]
excerpt: 'How I generate per-article Open Graph images for this site using node-canvas instead of a headless browser.'
comment: true
private: false
---

Every article on this site needs an Open Graph image for link previews on Twitter, Slack, and elsewhere. I didn't want to hand-design one per post, and I didn't want to spin up a headless browser just to render a title on a background. `node-canvas` turned out to be enough.

---

Eleventy builds this site as static HTML, so there's no runtime available to generate an OG image per request. The image has to exist as a file in `public/og/` before the site is deployed, one per article and project.

Doing this by hand does not scale past a handful of posts, and pulling in Puppeteer just to screenshot an HTML template felt heavier than the problem warranted — it means shipping Chromium into the build pipeline for something that is really just "draw text on a coloured rectangle."

I wrote a small Node script that reads the title straight out of each article's frontmatter and draws the OG image with `node-canvas`, no browser involved.

Each article starts with a frontmatter block like this:

```yaml
---
title: My Article Title
private: false
---
```

The script does three things for every article and project file:

- Pulls out `title` and `private` using a small regular expression — no need for a full YAML parser just for two fields
- Skips anything marked private, or anything missing a title
- Draws the title, word-wrapped, onto a 1200×630 canvas using a serif display font, with the site logo faded into the background

Output filenames are derived from the file's slug rather than the title, which matters because that's how the site resolves each page's URL — using the title instead would have silently produced OG images that don't match their pages.

### Word wrapping on a canvas

Canvas has no built-in text wrapping, so the script measures each candidate line with `ctx.measureText()` and breaks once it exceeds the available width:

```js
const maxWidth = CONFIG.width - 120; // 60px padding either side
for (let i = 1; i < words.length; i++) {
  const testLine = currentLine + ' ' + words[i];
  if (ctx.measureText(testLine).width > maxWidth) {
    lines.push(currentLine);
    currentLine = words[i];
  } else {
    currentLine = testLine;
  }
}
```

Once the lines are known, the title block is vertically centred on the canvas so short and long titles both look balanced.

### Skipping unnecessary regeneration

Regenerating every image on every build would slow things down for no reason, since most articles never change their title after publishing. So the script checks whether an image already exists and only regenerates it when a `--force` flag is passed:

```bash
node generate-og-images.js          # generate missing images only
node generate-og-images.js --force  # regenerate everything
```

This keeps local builds fast while still giving me a way to regenerate all images after a design tweak, like a font or colour change.

### Gotcha

Registering custom fonts with `registerFont()` has to happen before any canvas is created — calling it lazily inside the per-image function silently falls back to a system font instead of throwing, which is a confusing failure mode to debug if you don't already know to check for it.

### References

- [node-canvas on GitHub](https://github.com/Automattic/node-canvas)
- [MDN: CanvasRenderingContext2D.measureText()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText)
