#!/usr/bin/env node
/**
 * Generate iOS Splash Screens for PWA
 * 
 * This script creates splash screen images for all iOS device sizes
 * using the GENOSYS logo centered on a branded background.
 * 
 * Run: node scripts/generate-ios-splash-screens.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// iOS Splash Screen Sizes (width x height)
// Reference: https://developer.apple.com/design/human-interface-guidelines/foundations/layout/
const SPLASH_SIZES = [
  // iPhone Portrait
  { name: 'iphone-se', width: 640, height: 1136, scale: 2 },           // iPhone SE (1st gen), 5, 5s, 5c
  { name: 'iphone-8', width: 750, height: 1334, scale: 2 },             // iPhone 8, 7, 6s, 6, SE (2nd gen)
  { name: 'iphone-8-plus', width: 1242, height: 2208, scale: 3 },       // iPhone 8 Plus, 7 Plus, 6s Plus, 6 Plus
  { name: 'iphone-x', width: 1125, height: 2436, scale: 3 },            // iPhone X, XS, 11 Pro
  { name: 'iphone-xr', width: 828, height: 1792, scale: 2 },            // iPhone XR, 11
  { name: 'iphone-xs-max', width: 1242, height: 2688, scale: 3 },       // iPhone XS Max, 11 Pro Max
  { name: 'iphone-12', width: 1170, height: 2532, scale: 3 },           // iPhone 12, 12 Pro, 13, 13 Pro, 14
  { name: 'iphone-12-mini', width: 1080, height: 2340, scale: 3 },      // iPhone 12 mini, 13 mini
  { name: 'iphone-12-pro-max', width: 1284, height: 2778, scale: 3 },   // iPhone 12 Pro Max, 13 Pro Max, 14 Plus
  { name: 'iphone-14-pro', width: 1179, height: 2556, scale: 3 },       // iPhone 14 Pro, 15, 15 Pro
  { name: 'iphone-14-pro-max', width: 1290, height: 2796, scale: 3 },   // iPhone 14 Pro Max, 15 Plus, 15 Pro Max
  
  // iPad Portrait
  { name: 'ipad', width: 1536, height: 2048, scale: 2 },                // iPad Air, 9.7", 10.2"
  { name: 'ipad-pro-11', width: 1668, height: 2388, scale: 2 },         // iPad Pro 11"
  { name: 'ipad-pro-12', width: 2048, height: 2732, scale: 2 },         // iPad Pro 12.9"
  
  // iPhone Landscape (for landscape-capable apps)
  { name: 'iphone-8-landscape', width: 1334, height: 750, scale: 2, landscape: true },
  { name: 'iphone-x-landscape', width: 2436, height: 1125, scale: 3, landscape: true },
  { name: 'iphone-12-landscape', width: 2532, height: 1170, scale: 3, landscape: true },
  { name: 'iphone-14-pro-landscape', width: 2556, height: 1179, scale: 3, landscape: true },
  
  // iPad Landscape
  { name: 'ipad-landscape', width: 2048, height: 1536, scale: 2, landscape: true },
  { name: 'ipad-pro-11-landscape', width: 2388, height: 1668, scale: 2, landscape: true },
  { name: 'ipad-pro-12-landscape', width: 2732, height: 2048, scale: 2, landscape: true },
];

// Brand colors
const BACKGROUND_COLOR = '#1f2937'; // Dark gray (theme color from manifest)
const LOGO_PATH = path.join(__dirname, '../public/Logo/BIGLogo-high.png');
const OUTPUT_DIR = path.join(__dirname, '../public/splash');

async function generateSplashScreen(size) {
  const { name, width, height } = size;
  const outputPath = path.join(OUTPUT_DIR, `splash-${name}.png`);
  
  try {
    // Get logo dimensions
    const logoMetadata = await sharp(LOGO_PATH).metadata();
    
    // Calculate logo size (40% of the smaller dimension, max 400px)
    const maxLogoSize = Math.min(width, height) * 0.4;
    const logoWidth = Math.min(Math.round(maxLogoSize), 400);
    
    // Resize logo maintaining aspect ratio
    const resizedLogo = await sharp(LOGO_PATH)
      .resize(logoWidth, null, { fit: 'inside' })
      .toBuffer();
    
    const resizedLogoMetadata = await sharp(resizedLogo).metadata();
    
    // Calculate position to center the logo
    const left = Math.round((width - resizedLogoMetadata.width) / 2);
    const top = Math.round((height - resizedLogoMetadata.height) / 2);
    
    // Create splash screen
    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: BACKGROUND_COLOR
      }
    })
    .composite([
      {
        input: resizedLogo,
        left,
        top
      }
    ])
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(outputPath);
    
    console.log(`✅ Generated: splash-${name}.png (${width}x${height})`);
    return { name, width, height, path: outputPath, success: true };
    
  } catch (error) {
    console.error(`❌ Failed to generate ${name}:`, error.message);
    return { name, width, height, success: false, error: error.message };
  }
}

async function generateAllSplashScreens() {
  console.log('🎨 Generating iOS Splash Screens for GENOSYS PWA');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`🖼️  Logo source: ${LOGO_PATH}`);
  console.log(`🎨 Background color: ${BACKGROUND_COLOR}`);
  console.log('');
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Check if logo exists
  if (!fs.existsSync(LOGO_PATH)) {
    console.error('❌ Logo file not found:', LOGO_PATH);
    process.exit(1);
  }
  
  const results = [];
  
  for (const size of SPLASH_SIZES) {
    const result = await generateSplashScreen(size);
    results.push(result);
  }
  
  console.log('');
  console.log('📊 Generation Summary:');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.length}`);
    failed.forEach(f => console.log(`   - ${f.name}: ${f.error}`));
  }
  
  console.log('');
  console.log('📱 Generated splash screens for:');
  successful.forEach(s => {
    console.log(`   - ${s.name} (${s.width}x${s.height})`);
  });
  
  // Generate meta tags helper
  console.log('');
  console.log('📋 Add these meta tags to your layout.tsx head:');
  console.log('');
  
  const metaTags = successful.map(s => {
    const orientation = s.name.includes('landscape') ? 'landscape' : 'portrait';
    return `<link rel="apple-touch-startup-image" href="/splash/splash-${s.name}.png" media="(device-width: ${Math.round(s.width/2)}px) and (device-height: ${Math.round(s.height/2)}px) and (-webkit-device-pixel-ratio: ${s.scale || 2}) and (orientation: ${orientation})" />`;
  });
  
  console.log(metaTags.join('\n'));
  
  console.log('');
  console.log('✅ Done! Splash screens generated successfully.');
}

// Run the generator
generateAllSplashScreens().catch(console.error);


