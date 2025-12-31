const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateMaskableIcon(inputPath, outputPath, size) {
  // For maskable icons, the safe zone is the inner 80%
  // So we need to add 10% padding on each side (20% total)
  const padding = Math.round(size * 0.1);
  const logoSize = size - (padding * 2);
  
  try {
    // Read the original icon
    const input = await sharp(inputPath)
      .resize(logoSize, logoSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toBuffer();
    
    // Create the maskable icon with padding
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([{
      input: input,
      top: padding,
      left: padding
    }])
    .png()
    .toFile(outputPath);
    
    console.log(`Generated: ${outputPath}`);
  } catch (err) {
    console.error(`Error generating ${outputPath}:`, err.message);
  }
}

async function main() {
  const publicDir = path.join(__dirname, '../public');
  
  // Generate 192x192 maskable
  await generateMaskableIcon(
    path.join(publicDir, 'icon-192x192.png'),
    path.join(publicDir, 'icon-192x192-maskable.png'),
    192
  );
  
  // Generate 512x512 maskable
  await generateMaskableIcon(
    path.join(publicDir, 'icon-512x512.png'),
    path.join(publicDir, 'icon-512x512-maskable.png'),
    512
  );
}

main().catch(console.error);
