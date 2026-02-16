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
  logoOpacity: 0.35,
  outputDir: path.join(__dirname, '../assets/images/og'),
  logoPath: path.join(__dirname, '../public/logo.png'),
  fontPath: path.join(__dirname, './fonts/PlayfairDisplay-Bold.ttf'),
};

// Register custom font
registerFont(CONFIG.fontPath, { family: 'Playfair Display', weight: 'bold' });

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
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
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
    path.join(__dirname, '../projects'),
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
    console.log(`⚠️  Skipping ${path.basename(filePath)}: No frontmatter found`);
    return null;
  }
  
  // Skip private/draft content
  if (frontmatter.private === true) {
    console.log(`⚠️  Skipping ${path.basename(filePath)}: Private content`);
    return null;
  }
  
  // Get title
  const title = frontmatter.title;
  if (!title) {
    console.log(`⚠️  Skipping ${path.basename(filePath)}: No title found`);
    return null;
  }
  
  // Generate slug from title
  const slug = slugify(title);
  const outputPath = path.join(CONFIG.outputDir, `${slug}.png`);
  
  // Skip if file exists and not forcing
  if (!force && fs.existsSync(outputPath)) {
    console.log(`✓ ${slug}.png already exists`);
    return null;
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
    const logo = await loadImage(CONFIG.logoPath);
    ctx.globalAlpha = CONFIG.logoOpacity;
    
    // Center the logo
    const logoSize = 600;
    const logoX = (CONFIG.width - logoSize) / 2;
    const logoY = (CONFIG.height - logoSize) / 2;
    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    
    // Reset opacity for text
    ctx.globalAlpha = 1.0;
    
    // Draw title with Playfair Display
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = 'bold 72px "Playfair Display"';
    ctx.textBaseline = 'middle';
    
    // Word wrap for title
    const maxWidth = CONFIG.width - 120; // 60px padding on each side
    const lineHeight = 86;
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
    
    // Center the title block vertically
    const titleBlockHeight = lines.length * lineHeight;
    let y = (CONFIG.height - titleBlockHeight) / 2 + lineHeight / 2;
    
    // Draw each line
    for (const line of lines) {
      ctx.fillText(line, 60, y);
      y += lineHeight;
    }
    
    // Draw author name at bottom right
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Jabran Rafique', CONFIG.width - 60, CONFIG.height - 60);
    
    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`✅ Generated ${slug}.png`);
    return outputPath;
  } catch (error) {
    console.error(`❌ Error generating ${slug}.png:`, error.message);
    return null;
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
  - Logo Opacity: ${CONFIG.logoOpacity}
  - Output Directory: ${CONFIG.outputDir}
  - Force Regenerate: ${force}\n`);
  
  const files = getContentFiles();
  console.log(`📁 Found ${files.length} content files\n`);
  
  let generated = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const file of files) {
    const result = await generateImage(file, force);
    if (result) {
      generated++;
    } else if (result === null && fs.readFileSync(file, 'utf-8').match(/private:\s*true/)) {
      skipped++;
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
