const sharp = require('sharp');
const path = require('path');

async function generateMobileScreenshot() {
  const width = 750;
  const height = 1334;
  const publicDir = path.join(__dirname, '../public');
  
  try {
    // Get the products image and resize for mobile
    const productsImage = await sharp(path.join(publicDir, 'images/genosys-products.jpg'))
      .resize(width, Math.round(width * 0.5625), { fit: 'cover' })
      .toBuffer();
    
    // Get the logo
    const logo = await sharp(path.join(publicDir, 'images/genosys-logo.png'))
      .resize(200, 80, { fit: 'contain', background: { r: 31, g: 41, b: 55, alpha: 0 } })
      .toBuffer();
    
    // Create the mobile screenshot with a nice layout
    await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([
      // Header background
      {
        input: Buffer.from(`<svg width="${width}" height="100">
          <rect width="${width}" height="100" fill="#1f2937"/>
        </svg>`),
        top: 0,
        left: 0
      },
      // Logo in header
      {
        input: logo,
        top: 10,
        left: Math.round((width - 200) / 2)
      },
      // Products image
      {
        input: productsImage,
        top: 100,
        left: 0
      },
      // Content area with text
      {
        input: Buffer.from(`<svg width="${width}" height="${height - 100 - Math.round(width * 0.5625)}">
          <rect width="${width}" height="${height - 100 - Math.round(width * 0.5625)}" fill="#f9fafb"/>
          <text x="${width/2}" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#1f2937">Premium Beauty Products</text>
          <text x="${width/2}" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#6b7280">Shop our exclusive collection</text>
          <rect x="225" y="140" width="300" height="50" rx="25" fill="#1f2937"/>
          <text x="${width/2}" y="172" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#ffffff">Browse Products</text>
        </svg>`),
        top: 100 + Math.round(width * 0.5625),
        left: 0
      }
    ])
    .png()
    .toFile(path.join(publicDir, 'images/screenshot-mobile.png'));
    
    console.log('Generated: public/images/screenshot-mobile.png');
  } catch (err) {
    console.error('Error generating mobile screenshot:', err.message);
  }
}

generateMobileScreenshot().catch(console.error);
