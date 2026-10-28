# Open Graph Image Generation

This project generates Open Graph (OG) images for every article and project.

## Features

- **Automatic generation**: a card for each article and project, plus a default card
- **Matches the page**: the top of each card shows the same contour map as the page header (same seed and `PAGE_MAP` settings from `assets/js/contour-core.js`), with more terrain below it (see [design-system.md](./design-system.md))
- **Design**:
  - Dark paper background (`#0a1510`) with contour lines
  - Section and year as a mono eyebrow (for example `ARTICLES · 2016`)
  - Title in Bricolage Grotesque, shrunk to fit three lines
  - Logo, name and `jabran.me` along the bottom, with an accent rule
  - 1200x630px, the size every social platform expects
- **JPEG output**: as PNG, antialiased contour lines made each card about 600 KB (31 MB in total); as JPEG they average about 115 KB (5.8 MB)
- **Smart caching**: only generates missing images (unless forced)
- **Private content handling**: skips draft/private articles

## Usage

### Generate missing images

```bash
npm run og-images
```

This will:

- Scan all articles and projects
- Skip private content
- Generate images only for pages without existing OG images
- Save to `public/og/`

### Regenerate all images

```bash
npm run og-images:force
```

Use this after design changes.

## How it works

1. **Convention-based naming**: images are named after the page slug
   - Article: `/articles/secret-sauces-of-git/` → `public/og/secret-sauces-of-git.jpg`
   - Project: `/projects/socialmedia-js/` → `public/og/socialmedia-js.jpg`
   - Everything else uses `public/og/default.jpg`

2. **Automatic integration**: the `ogImage` filter in `.eleventy.js`:
   - Looks for `public/og/<slug>.jpg` based on the page URL
   - Falls back to `/og/default.jpg`, then `/icon-1024x1024.png`

## File Structure

```
public/og/                     # Generated OG images (.jpg)
assets/js/contour-core.js      # Contour engine shared with the site
scripts/
  ├── generate-og-images.js    # Image generation script
  └── fonts/
      ├── BricolageGrotesque-ExtraBoldCondensed.ttf  # Titles and name
      └── GeistMono-Medium.ttf                       # Eyebrow and domain
```

## Customization

Edit `CONFIG` in `scripts/generate-og-images.js`:

- `CONFIG.colors`: background, text, contour and accent colours
- `CONFIG.jpeg`: output quality
- Title size and layout: `drawCard()`
- Contour density: `drawContours()`

## Troubleshooting

**Images not appearing on social media**

1. Verify the image exists in `public/og/`
2. Test with social media debuggers:
   - Facebook: https://developers.facebook.com/tools/debug/
   - LinkedIn: https://www.linkedin.com/post-inspector/
3. Clear social media cache (may take 24-48 hours)
