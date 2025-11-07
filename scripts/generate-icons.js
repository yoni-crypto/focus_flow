/**
 * Icon Generation Script for FocusFlow PWA
 * 
 * This script generates PWA icons from a source image.
 * 
 * Requirements:
 * - Install sharp: npm install --save-dev sharp
 * - Create a source icon (icon.png) in the root directory (512x512px recommended)
 * 
 * Run: node scripts/generate-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceIcon = path.join(__dirname, '../icon.png');
const outputDir = path.join(__dirname, '../public/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Check if source icon exists
if (!fs.existsSync(sourceIcon)) {
  console.error('❌ Source icon not found:', sourceIcon);
  console.log('📝 Please create a 512x512px icon.png in the root directory');
  console.log('💡 You can use online tools like https://www.favicon-generator.org/');
  process.exit(1);
}

async function generateIcons() {
  console.log('🎨 Generating PWA icons...');
  
  try {
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(sourceIcon)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated: icon-${size}x${size}.png`);
    }
    
    console.log('✨ All icons generated successfully!');
    console.log(`📁 Icons saved to: ${outputDir}`);
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

