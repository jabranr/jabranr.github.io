#!/usr/bin/env node

/**
 * Generate Open Graph images for all published posts and pages
 *
 * The top of each card shows the same contour map as the header of the page it
 * belongs to (see PAGE_MAP in assets/js/contour-core.js), so a shared link matches the page it opens.
 *
 * Usage:
 *   node scripts/generate-og-images.js          # Generate missing images
 *   node scripts/generate-og-images.js --force  # Regenerate all images
 */

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');
const Contour = require('../assets/js/contour-core.js');

// Configuration
const CONFIG = {
  width: 1200,
  height: 630,
  colors: {
    paper: '#0a1510',
    ink: '#e2efe7',
    muted: '#8fb09d',
    contour: 'rgba(150, 215, 178, 0.22)',
    contourIndex: 'rgba(150, 215, 178, 0.45)',
    accent: '#ff5c8f',
  },
  logo: {
    size: 44,
    path: path.join(__dirname, '../public/logo.png'),
  },
  fonts: {
    display: {
      name: 'Bricolage Grotesque OG',
      path: path.join(__dirname, './fonts/BricolageGrotesque-ExtraBoldCondensed.ttf'),
    },
    mono: {
      name: 'Geist Mono OG',
      path: path.join(__dirname, './fonts/GeistMono-Medium.ttf'),
    },
  },
  outputDir: path.join(__dirname, '../public/og'),
  // JPEG: as PNG, antialiased contour lines made cards ~5x larger (31 MB vs 5.8 MB for all cards)
  jpeg: { quality: 0.82, progressive: true, chromaSubsampling: false },
  defaultImage: {
    title: 'Software engineer for the progressive, performant and accessible web.',
    slug: 'default',
    outputPath: path.join(__dirname, '../public/og/default.jpg'),
  },
};

// Register custom fonts
for (const font of Object.values(CONFIG.fonts)) {
  registerFont(font.path, { family: font.name });
}

// Ensure output directory exists
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

/**
 * Extract frontmatter from markdown file
 */
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Convert boolean strings
    if (value === 'true') value = true;
    if (value === 'false') value = false;

    frontmatter[key] = value;
  }

  return frontmatter;
}

/**
 * Get all content files (articles and projects)
 */
function getContentFiles() {
  const files = [];
  const contentDirs = [path.join(__dirname, '../articles'), path.join(__dirname, '../projects')];

  for (const dir of contentDirs) {
    if (!fs.existsSync(dir)) continue;

    const dirFiles = fs.readdirSync(dir);
    for (const file of dirFiles) {
      if (file.endsWith('.md')) {
        files.push(path.join(dir, file));
      }
    }
  }

  return files;
}

/**
 * Word-wrap text to a width, returning lines
 */
function wrap(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = words[0];

  for (let i = 1; i < words.length; i++) {
    const test = line + ' ' + words[i];
    if (ctx.measureText(test).width > maxWidth) {
      lines.push(line);
      line = words[i];
    } else {
      line = test;
    }
  }
  lines.push(line);
  return lines;
}

/**
 * Draw the contour map for a slug, faded behind the title on the left
 */
function drawContours(ctx, slug) {
  const { width, height, colors } = CONFIG;
  const cell = 8;
  const map = Contour.PAGE_MAP;

  // Sample the page header's terrain (PAGE_MAP.width wide) scaled to the card width,
  // so the top of the card shows exactly the map in the page header
  const zoom = map.width / width;
  const terrain = Contour.createTerrain(Contour.hashString(slug), { width: map.width, tilt: map.tilt });
  const grid = Contour.sampleGrid((x, y, t) => terrain(x * zoom, y * zoom, t), width, height, cell, 0);
  const lines = new Path2DLike();
  const index = new Path2DLike();

  Contour.march(grid, cell, map.step, map.base, (li, level, x1, y1, x2, y2) => {
    (li % 5 === 0 ? index : lines).push(x1, y1, x2, y2);
  });

  ctx.lineCap = 'round';
  lines.stroke(ctx, colors.contour, 1.2);
  index.stroke(ctx, colors.contourIndex, 1.8);

  const fade = ctx.createLinearGradient(0, 0, width, 0);
  fade.addColorStop(0, 'rgba(10, 21, 16, 0.94)');
  fade.addColorStop(0.55, 'rgba(10, 21, 16, 0.7)');
  fade.addColorStop(1, 'rgba(10, 21, 16, 0)');
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, width, height);
}

// node-canvas has no Path2D, so batch segments and stroke them in one path
class Path2DLike {
  constructor() {
    this.segments = [];
  }

  push(...points) {
    this.segments.push(points);
  }

  stroke(ctx, color, lineWidth) {
    ctx.beginPath();
    for (const [x1, y1, x2, y2] of this.segments) {
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

/**
 * Render one card to a PNG file
 */
async function drawCard({ title, slug, eyebrow, outputPath }) {
  const { width, height, colors, fonts } = CONFIG;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const pad = 72;

  ctx.fillStyle = colors.paper;
  ctx.fillRect(0, 0, width, height);
  drawContours(ctx, slug);

  // Eyebrow
  ctx.fillStyle = colors.muted;
  ctx.font = `22px "${fonts.mono.name}"`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(eyebrow.toUpperCase().split('').join(' '), pad, pad + 16);

  // Title: shrink until it fits in three lines
  let size = 96;
  let lines;
  do {
    ctx.font = `${size}px "${fonts.display.name}"`;
    lines = wrap(ctx, title, width - pad * 2 - 80);
    size -= 6;
  } while (lines.length > 3 && size > 56);

  const lineHeight = (size + 6) * 1.02;
  ctx.fillStyle = colors.ink;
  let y = pad + 70 + lineHeight * 0.8;
  for (const line of lines) {
    ctx.fillText(line, pad, y);
    y += lineHeight;
  }

  // Footer: logo, name and an accent rule
  const footerY = height - pad;
  const logo = await loadImage(CONFIG.logo.path);
  ctx.drawImage(logo, pad - 4, footerY - CONFIG.logo.size + 8, CONFIG.logo.size, CONFIG.logo.size);
  ctx.fillStyle = colors.ink;
  ctx.font = `32px "${fonts.display.name}"`;
  ctx.fillText('Jabran Rafique', pad + CONFIG.logo.size + 10, footerY);

  ctx.fillStyle = colors.muted;
  ctx.font = `22px "${fonts.mono.name}"`;
  ctx.textAlign = 'right';
  ctx.fillText('jabran.me', width - pad, footerY);
  ctx.textAlign = 'left';

  ctx.fillStyle = colors.accent;
  ctx.fillRect(0, height - 8, width, 8);

  fs.writeFileSync(outputPath, canvas.toBuffer('image/jpeg', CONFIG.jpeg));
}

/**
 * Generate OG image for a content file
 */
async function generateImage(filePath, force = false) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const frontmatter = extractFrontmatter(content);

  if (!frontmatter) {
    console.log(`⚠️  Skipping ${path.basename(filePath)}: No frontmatter found`);
    return { status: 'skipped', reason: 'no_frontmatter' };
  }

  // Skip private/draft content
  if (frontmatter.private === true) {
    console.log(`⚠️  Skipping ${path.basename(filePath)}: Private content`);
    return { status: 'skipped', reason: 'private' };
  }

  // Get title
  const title = frontmatter.title;
  if (!title) {
    console.log(`⚠️  Skipping ${path.basename(filePath)}: No title found`);
    return { status: 'skipped', reason: 'no_title' };
  }

  // use file name as slug instead of title to be aligned with how 11ty renders the page
  const slug = path.basename(filePath, '.md');
  const outputPath = path.join(CONFIG.outputDir, `${slug}.jpg`);
  const section = path.basename(path.dirname(filePath));
  const year = String(frontmatter.date || '').slice(0, 4);

  // Skip if file exists and not forcing
  if (!force && fs.existsSync(outputPath)) {
    console.log(`✓ ${slug}.jpg already exists`);
    return { status: 'exists', path: outputPath };
  }

  try {
    console.log(`🎨 Generating ${slug}.jpg...`);
    await drawCard({ title, slug, eyebrow: [section, year].filter(Boolean).join(' · '), outputPath });
    console.log(`✅ Generated ${slug}.jpg`);
    return { status: 'generated', path: outputPath };
  } catch (error) {
    console.error(`❌ Error generating ${slug}.jpg:`, error.message);
    return { status: 'error', error: error.message };
  }
}

/**
 * Generate Default OG image
 */
async function generateDefaultImage({ title = CONFIG.defaultImage.title, force = false }) {
  const outputPath = path.join(CONFIG.defaultImage.outputPath);

  // Skip if file exists and not forcing
  if (!force && fs.existsSync(outputPath)) {
    console.log(`✓ ${CONFIG.defaultImage.slug}.jpg already exists`);
    return { status: 'exists', path: outputPath };
  }

  try {
    console.log(`🎨 Generating ${CONFIG.defaultImage.slug}.jpg...`);
    await drawCard({ title, slug: 'home', eyebrow: 'Senior Software Engineer · Tech Lead', outputPath });
    console.log(`✅ Generated ${CONFIG.defaultImage.slug}.jpg`);
    return { status: 'generated', path: outputPath };
  } catch (error) {
    console.error(`❌ Error generating ${CONFIG.defaultImage.slug}.jpg:`, error.message);
    return { status: 'error', error: error.message };
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');

  console.log('🚀 Starting OG image generation...\n');
  console.log(`Configuration:
  - Dimensions: ${CONFIG.width}x${CONFIG.height}
  - Background: ${CONFIG.colors.paper}
  - Output Directory: ${CONFIG.outputDir}
  - Force Regenerate: ${force}\n`);

  const files = getContentFiles();
  console.log(`📁 Found ${files.length} content files\n`);

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  const count = (result) => {
    if (result.status === 'generated') generated++;
    else if (result.status === 'skipped' || result.status === 'exists') skipped++;
    else if (result.status === 'error') errors++;
  };

  count(await generateDefaultImage({ force }));

  for (const file of files) {
    count(await generateImage(file, force));
  }

  console.log(`\n📊 Summary:
  - Generated: ${generated}
  - Skipped: ${skipped}
  - Errors: ${errors}
  - Total: ${files.length}\n`);

  console.log('✨ Done!\n');
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { generateImage, getContentFiles };
