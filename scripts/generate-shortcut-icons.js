/**
 * Generate Custom Shortcut Icons for PWA
 * 
 * This script generates custom icons for PWA shortcuts:
 * - Products (grid icon)
 * - Cart (shopping cart icon)
 * - Favorites (heart icon)
 * 
 * The icons are created as SVG and converted to PNG using sharp.
 * 
 * Usage: node scripts/generate-shortcut-icons.js
 * 
 * Requirements:
 * - sharp (for PNG generation)
 */

const fs = require('fs')
const path = require('path')

// Try to use sharp if available, otherwise create SVG-only icons
let sharp
try {
  sharp = require('sharp')
} catch (e) {
  console.log('⚠️  sharp not installed. Run: npm install sharp')
  console.log('    Creating SVG icons only (most browsers support SVG shortcuts)')
}

const ICON_SIZE = 192
const BACKGROUND_COLOR = '#dc2626' // Genosys red/primary color
const ICON_COLOR = '#ffffff'

// SVG icon definitions
const icons = {
  products: {
    name: 'shortcut-products',
    // Grid icon
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 ${ICON_SIZE} ${ICON_SIZE}">
      <rect width="${ICON_SIZE}" height="${ICON_SIZE}" rx="32" fill="${BACKGROUND_COLOR}"/>
      <g transform="translate(48, 48)" fill="none" stroke="${ICON_COLOR}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
        <rect x="0" y="0" width="40" height="40" rx="8"/>
        <rect x="56" y="0" width="40" height="40" rx="8"/>
        <rect x="0" y="56" width="40" height="40" rx="8"/>
        <rect x="56" y="56" width="40" height="40" rx="8"/>
      </g>
    </svg>`
  },
  cart: {
    name: 'shortcut-cart',
    // Shopping cart icon
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 ${ICON_SIZE} ${ICON_SIZE}">
      <rect width="${ICON_SIZE}" height="${ICON_SIZE}" rx="32" fill="${BACKGROUND_COLOR}"/>
      <g transform="translate(40, 40)" fill="none" stroke="${ICON_COLOR}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="32" cy="100" r="8" fill="${ICON_COLOR}"/>
        <circle cx="88" cy="100" r="8" fill="${ICON_COLOR}"/>
        <path d="M0 8h20l14.5 62H94l14-48H34"/>
      </g>
    </svg>`
  },
  favorites: {
    name: 'shortcut-favorites',
    // Heart icon
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 ${ICON_SIZE} ${ICON_SIZE}">
      <rect width="${ICON_SIZE}" height="${ICON_SIZE}" rx="32" fill="${BACKGROUND_COLOR}"/>
      <g transform="translate(40, 48)">
        <path d="M56 98L49.35 91.855C22.4 67.79 5 52.19 5 33.05C5 17.45 17.45 5 33.05 5C41.93 5 50.45 9.17 56 15.82C61.55 9.17 70.07 5 78.95 5C94.55 5 107 17.45 107 33.05C107 52.19 89.6 67.79 62.65 91.855L56 98Z" fill="${ICON_COLOR}"/>
      </g>
    </svg>`
  },
  search: {
    name: 'shortcut-search',
    // Search/magnifying glass icon
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 ${ICON_SIZE} ${ICON_SIZE}">
      <rect width="${ICON_SIZE}" height="${ICON_SIZE}" rx="32" fill="${BACKGROUND_COLOR}"/>
      <g transform="translate(40, 40)" fill="none" stroke="${ICON_COLOR}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="46" cy="46" r="36"/>
        <path d="M72 72L100 100"/>
      </g>
    </svg>`
  }
}

const outputDir = path.join(__dirname, '..', 'public', 'shortcuts')

async function generateIcons() {
  console.log('🎨 Generating PWA shortcut icons...\n')
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    console.log(`📁 Created directory: ${outputDir}`)
  }
  
  for (const [key, icon] of Object.entries(icons)) {
    const svgPath = path.join(outputDir, `${icon.name}.svg`)
    const pngPath = path.join(outputDir, `${icon.name}.png`)
    
    // Save SVG
    fs.writeFileSync(svgPath, icon.svg)
    console.log(`✅ Created: /shortcuts/${icon.name}.svg`)
    
    // Convert to PNG if sharp is available
    if (sharp) {
      try {
        await sharp(Buffer.from(icon.svg))
          .resize(ICON_SIZE, ICON_SIZE)
          .png()
          .toFile(pngPath)
        console.log(`✅ Created: /shortcuts/${icon.name}.png`)
      } catch (error) {
        console.error(`❌ Failed to create PNG for ${key}:`, error.message)
      }
    }
  }
  
  console.log('\n✨ Shortcut icons generated successfully!')
  console.log('\n📝 Update your manifest.json shortcuts with:')
  console.log(`
{
  "shortcuts": [
    {
      "name": "Browse Products",
      "short_name": "Products",
      "description": "Browse our premium beauty products",
      "url": "/products",
      "icons": [{ "src": "/shortcuts/shortcut-products.png", "sizes": "192x192", "type": "image/png" }]
    },
    {
      "name": "Shopping Cart",
      "short_name": "Cart",
      "description": "View your shopping cart",
      "url": "/cart",
      "icons": [{ "src": "/shortcuts/shortcut-cart.png", "sizes": "192x192", "type": "image/png" }]
    },
    {
      "name": "Favorites",
      "short_name": "Favorites",
      "description": "View your favorite products",
      "url": "/favorites",
      "icons": [{ "src": "/shortcuts/shortcut-favorites.png", "sizes": "192x192", "type": "image/png" }]
    }
  ]
}
`)
}

generateIcons().catch(console.error)

