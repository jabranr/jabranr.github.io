# Open Graph Image Generation

This project automatically generates Open Graph (OG) images for all articles and projects.

## Features

- **Automatic generation**: Creates unique OG images for each article and project
- **Custom design**:
  - Dark background (#222222)
  - Logo watermark with low opacity
  - Title in Serif font
  - Author attribution ("Jabran Rafique") in bottom right
  - Optimal dimensions: 1200x630px (recommended for all social platforms)
- **Smart caching**: Only generates missing images (unless forced)
- **Private content handling**: Skips draft/private articles

## Usage

### Generate missing images

```bash
npm run og-images
```

This will:

- Scan all articles and projects
- Skip private content
- Generate images only for pages without existing OG images
- Save to `assets/images/og/`

### Regenerate all images

```bash
npm run og-images:force
```

Use this when you want to update all images (e.g., after design changes).

## How it works

1. **Convention-based naming**: Images are named after the page slug
   - Article: `/articles/secret-sauces-of-git/` → `secret-sauces-of-git.png`
   - Project: `/projects/socialmedia-js/` → `socialmedia-js.png`

2. **Automatic integration**: The `base.njk` template automatically:
   - Checks for OG image based on page URL
   - Uses generated image if it exists
   - Falls back to default icon if not found

## File Structure

```
public/og/          # Generated OG images
scripts/
  ├── generate-og-images.js  # Image generation script
  └── fonts/
      └── InstrumentSerif-Regular.ttf  # Custom font
      └── Inter-VariableFont_opsz,wght.ttf  # Custom font
```

## Customization

To customize the design, edit `scripts/generate-og-images.js`:

- `CONFIG.bgColor`: Background color
- `CONFIG.textColor`: Text color
- `CONFIG.logoOpacity`: Logo transparency (0-1)
- Font sizes: Modify in the canvas drawing code

## Troubleshooting

**Images not appearing on social media**

1. Verify image exists: Check `assets/images/og/` directory
2. Test with social media debuggers:
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/
3. Clear social media cache (may take 24-48 hours)

**Script fails to generate images**

- Ensure all dependencies are installed: `npm ci`
- Check that the logo exists: `public/logo.png`
- Verify font file exists: `scripts/fonts/PlayfairDisplay-Bold.ttf`

## Dependencies

- `canvas`: Node.js canvas implementation for image generation
- Playfair Display font (included in `scripts/fonts/`)
