const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceImage = path.join(__dirname, '../public/Logo/black_logo.png');
const outputDir = path.join(__dirname, '../public');

// PWA icon sizes
const iconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-icon-180x180.png' }, // Apple touch icon
];

// Generate ICO file sizes (for favicon.ico)
const icoSizes = [16, 32];

async function generateIcons() {
  try {
    // Check if source image exists
    if (!fs.existsSync(sourceImage)) {
      throw new Error(`Source image not found: ${sourceImage}`);
    }

    console.log('📸 Generating PWA icons from:', sourceImage);

    // Generate PNG icons
    for (const { size, name } of iconSizes) {
      const outputPath = path.join(outputDir, name);
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);
      console.log(`✅ Generated ${name} (${size}x${size})`);
    }

    // Generate favicon.ico (multi-size ICO)
    // Note: sharp doesn't support ICO directly, so we'll create a 32x32 PNG as favicon.ico
    // Most modern browsers accept PNG as favicon
    const faviconPath = path.join(outputDir, 'favicon.ico');
    await sharp(sourceImage)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(faviconPath);
    console.log('✅ Generated favicon.ico');

    // Generate Apple touch icon (180x180)
    const appleIconPath = path.join(outputDir, 'apple-touch-icon.png');
    await sharp(sourceImage)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(appleIconPath);
    console.log('✅ Generated apple-touch-icon.png');

    console.log('\n🎉 All PWA icons generated successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Update manifest.json with new icon paths');
    console.log('2. Update app/layout.tsx with new icon references');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

