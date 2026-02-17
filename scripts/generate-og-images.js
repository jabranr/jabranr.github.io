#!/usr/bin/env node

/**
 * Generate Open Graph images for all published posts and pages
 *
 * Usage:
 *   node scripts/generate-og-images.js          # Generate missing images
 *   node scripts/generate-og-images.js --force  # Regenerate all images
 */

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');

// Configuration
const CONFIG = {
  width: 1200,
  height: 630,
  bgColor: '#222222',
  textColor: '#f5f5f8',
  logo: {
    add: true,
    opacity: 0.1,
    path: path.join(__dirname, '../public/logo.png')
  },
  fonts: {
    sans: {
      name: 'Inter',
      weight: 'bold',
      size: '48px',
      path: path.join(__dirname, './fonts/Inter-VariableFont_opsz,wght.ttf')
    },
    serif: {
      name: 'Instrument Serif',
      weight: 'normal',
      style: 'normal',
      size: '120px',
      path: path.join(__dirname, './fonts/InstrumentSerif-Regular.ttf')
    }
  },
  outputDir: path.join(__dirname, '../assets/images/og'),
  defaultImage: {
    title: 'Software Engineer. Sometimes maker of things.',
    slug: 'icon-1024x1024',
    outputPath: path.join(__dirname, '../public/icon-1024x1024.png')
  }
};

// Register custom font
registerFont(CONFIG.fonts.serif.path, {
  family: CONFIG.fonts.serif.name,
  weight: CONFIG.fonts.serif.weight
});

registerFont(CONFIG.fonts.sans.path, {
  family: CONFIG.fonts.sans.name,
  weight: CONFIG.fonts.sans.weight
});

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
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
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
 * Create slug from title
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get all content files (articles and projects)
 */
function getContentFiles() {
  const files = [];
  const contentDirs = [
    path.join(__dirname, '../articles'),
    path.join(__dirname, '../projects')
  ];

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
 * Generate OG image using Canvas
 */
async function generateImage(filePath, force = false) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const frontmatter = extractFrontmatter(content);

  if (!frontmatter) {
    console.log(
      `⚠️  Skipping ${path.basename(filePath)}: No frontmatter found`
    );
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

  // Generate slug from title
  const slug = slugify(title);
  const outputPath = path.join(CONFIG.outputDir, `${slug}.png`);

  // Skip if file exists and not forcing
  if (!force && fs.existsSync(outputPath)) {
    console.log(`✓ ${slug}.png already exists`);
    return { status: 'exists', path: outputPath };
  }

  try {
    console.log(`🎨 Generating ${slug}.png...`);

    // Create canvas
    const canvas = createCanvas(CONFIG.width, CONFIG.height);
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = CONFIG.bgColor;
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

    // Load and draw logo with opacity
    if (CONFIG.logo.add) {
      const logo = await loadImage(CONFIG.logo.path);
      ctx.globalAlpha = CONFIG.logo.opacity;

      // Center the logo
      const logoSize = CONFIG.width;
      const logoX = (CONFIG.width - logoSize) / 2;
      const logoY = (CONFIG.height - logoSize) / 4;
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    }

    // Reset opacity for text
    ctx.globalAlpha = 1.0;

    // Draw title with Serif font
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = `${CONFIG.fonts.serif.style} ${CONFIG.fonts.serif.size} "${CONFIG.fonts.serif.name}"`;
    ctx.textBaseline = 'middle';

    // Word wrap for title
    const maxWidth = CONFIG.width - 120; // 60px padding on each side
    const lineHeight = 1.1 * parseFloat(CONFIG.fonts.serif.size);
    const words = title.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    // Center the title block but move it towards top when more characters
    const titleBlockHeight = lines.length * lineHeight;
    let y = (CONFIG.height - titleBlockHeight) / 2 + lineHeight / 2;

    // Draw each line
    for (const line of lines) {
      ctx.fillText(line, 60, y);
      y += lineHeight;
    }

    // Draw author name at bottom right
    ctx.font = `${CONFIG.fonts.sans.size} ${CONFIG.fonts.sans.name}`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Jabran Rafique', CONFIG.width - 40, CONFIG.height - 40);

    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ Generated ${slug}.png`);
    return { status: 'generated', path: outputPath };
  } catch (error) {
    console.error(`❌ Error generating ${slug}.png:`, error.message);
    return { status: 'error', error: error.message };
  }
}

/**
 * Generate Default OG image using Canvas
 */
async function generateDefaultImage({
  title = CONFIG.defaultImage.title,
  force = false
}) {
  // Generate slug from title
  const outputPath = path.join(CONFIG.defaultImage.outputPath);

  // Skip if file exists and not forcing
  if (!force && fs.existsSync(outputPath)) {
    console.log(`✓ ${CONFIG.defaultImage.slug}.png already exists`);
    return { status: 'exists', path: outputPath };
  }

  try {
    console.log(`🎨 Generating ${CONFIG.defaultImage.slug}.png...`);

    // Create canvas
    const canvas = createCanvas(CONFIG.width, CONFIG.height);
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = CONFIG.bgColor;
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

    // Load and draw logo with opacity
    if (CONFIG.logo.add) {
      const logo = await loadImage(CONFIG.logo.path);
      ctx.globalAlpha = CONFIG.logo.opacity;

      // Center the logo
      const logoSize = CONFIG.width;
      const logoX = (CONFIG.width - logoSize) / 2;
      const logoY = (CONFIG.height - logoSize) / 4;
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    }

    // Reset opacity for text
    ctx.globalAlpha = 1.0;

    // Draw title with Serif font
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = `${CONFIG.fonts.serif.style} ${CONFIG.fonts.serif.size} "${CONFIG.fonts.serif.name}"`;
    ctx.textBaseline = 'middle';

    // Word wrap for title
    const maxWidth = CONFIG.width - 120; // 60px padding on each side
    const lineHeight = 1.1 * parseFloat(CONFIG.fonts.serif.size);
    const words = title.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    // Center the title block but move it towards top when more characters
    const titleBlockHeight = lines.length * lineHeight;
    let y = (CONFIG.height - titleBlockHeight) / 2 + lineHeight / 2;

    // Draw each line
    for (const line of lines) {
      ctx.fillText(line, 60, y);
      y += lineHeight;
    }

    // Draw author name at bottom right
    ctx.font = `${CONFIG.fonts.sans.size} ${CONFIG.fonts.sans.name}`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Jabran Rafique', CONFIG.width - 40, CONFIG.height - 40);

    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ Generated ${CONFIG.defaultImage.slug}.png`);
    return { status: 'generated', path: outputPath };
  } catch (error) {
    console.error(
      `❌ Error generating ${CONFIG.defaultImage.slug}.png:`,
      error.message
    );
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
  - Background: ${CONFIG.bgColor}
  - Text Color: ${CONFIG.textColor}
  - Logo Opacity: ${CONFIG.logo.opacity}
  - Output Directory: ${CONFIG.outputDir}
  - Force Regenerate: ${force}\n`);

  const files = getContentFiles();
  console.log(`📁 Found ${files.length} content files\n`);

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  const defaultResult = await generateDefaultImage({
    title: 'Software Engineer. Sometimes maker of things.',
    force
  });

  if (defaultResult.status === 'generated') {
    generated++;
  } else if (
    defaultResult.status === 'skipped' ||
    defaultResult.status === 'exists'
  ) {
    skipped++;
  } else if (defaultResult.status === 'error') {
    errors++;
  }

  for (const file of files) {
    const result = await generateImage(file, force);

    if (result.status === 'generated') {
      generated++;
    } else if (result.status === 'skipped' || result.status === 'exists') {
      skipped++;
    } else if (result.status === 'error') {
      errors++;
    }
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
