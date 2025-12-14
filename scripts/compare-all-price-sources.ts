/**
 * Compare ALL Price Sources
 * 
 * Compares prices across:
 * 1. lib/products.ts (legacy static list)
 * 2. data/productConfig.ts (variant pricing & config)
 * 3. Database (current source of truth)
 * 
 * Identifies conflicts and recommends which should be canonical.
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { prisma } from '../lib/prisma'
import { products as staticProducts } from '../lib/products'
import { PRODUCT_CONFIG } from '../data/productConfig'

interface PriceComparison {
  productId: string
  productNumber: string | null
  name: string
  staticPrice?: number  // lib/products.ts
  configPrice?: number  // data/productConfig.ts
  dbPrice: number       // database
  hasConflict: boolean
  recommendedPrice: number
  source: 'static' | 'config' | 'db'
}

async function compareAllSources() {
  console.log('🔍 Comparing ALL price sources...\n')
  console.log('Sources:')
  console.log('  1. lib/products.ts (legacy static list)')
  console.log('  2. data/productConfig.ts (variant pricing)')
  console.log('  3. Database (current source of truth)')
  console.log('\n' + '=' .repeat(80))

  const comparisons: PriceComparison[] = []
  let conflicts = 0

  // Get all products from database
  const dbProducts = await prisma.product.findMany({
    where: {
      isHidden: false
    },
    select: {
      id: true,
      productNumber: true,
      name: true,
      price: true
    },
    orderBy: {
      id: 'asc'
    }
  })

  console.log(`\nFound ${staticProducts.length} products in lib/products.ts`)
  console.log(`Found ${Object.keys(PRODUCT_CONFIG).length} products in productConfig.ts`)
  console.log(`Found ${dbProducts.length} products in database\n`)

  // Compare each database product
  for (const dbProduct of dbProducts) {
    const productId = dbProduct.productNumber || dbProduct.id

    // Find in static list
    const staticProduct = staticProducts.find(p => p.id === productId)
    const staticPrice = staticProduct?.price

    // Find in config
    const configProduct = PRODUCT_CONFIG[productId]
    const configPrice = configProduct?.pricing.basePrice

    const dbPrice = dbProduct.price

    // Determine if there's a conflict
    const prices = [staticPrice, configPrice, dbPrice].filter(p => p !== undefined)
    const uniquePrices = [...new Set(prices)]
    const hasConflict = uniquePrices.length > 1

    // Determine recommended price (prefer config > static > db)
    let recommendedPrice = dbPrice
    let source: 'static' | 'config' | 'db' = 'db'

    if (configPrice !== undefined) {
      recommendedPrice = configPrice
      source = 'config'
    } else if (staticPrice !== undefined) {
      recommendedPrice = staticPrice
      source = 'static'
    }

    if (hasConflict) {
      conflicts++
      console.log(`❌ CONFLICT - ${dbProduct.name} (ID: ${productId})`)
      if (staticPrice !== undefined) {
        console.log(`   lib/products.ts: AED ${staticPrice}`)
      }
      if (configPrice !== undefined) {
        console.log(`   productConfig.ts: AED ${configPrice}`)
      }
      console.log(`   Database: AED ${dbPrice}`)
      console.log(`   → Recommended: AED ${recommendedPrice} (from ${source})`)
    }

    comparisons.push({
      productId: dbProduct.id,
      productNumber: dbProduct.productNumber,
      name: dbProduct.name,
      staticPrice,
      configPrice,
      dbPrice,
      hasConflict,
      recommendedPrice,
      source
    })
  }

  console.log('\n' + '=' .repeat(80))
  console.log('📊 SUMMARY')
  console.log('=' .repeat(80))
  console.log(`Total products: ${comparisons.length}`)
  console.log(`Products with price conflicts: ${conflicts}`)
  console.log(`Conflict rate: ${((conflicts / comparisons.length) * 100).toFixed(1)}%`)

  // Group by source of truth
  const bySource = {
    config: comparisons.filter(c => c.source === 'config').length,
    static: comparisons.filter(c => c.source === 'static' && c.source !== 'config').length,
    db: comparisons.filter(c => c.source === 'db').length
  }

  console.log('\nPrice sources:')
  console.log(`  productConfig.ts: ${bySource.config} products`)
  console.log(`  lib/products.ts: ${bySource.static} products`)
  console.log(`  Database only: ${bySource.db} products`)

  return comparisons.filter(c => c.hasConflict)
}

async function generateFixScript(conflicts: PriceComparison[]) {
  if (conflicts.length === 0) {
    console.log('\n✅ No conflicts found!')
    return
  }

  console.log('\n' + '=' .repeat(80))
  console.log('🔧 DATABASE UPDATE SCRIPT')
  console.log('=' .repeat(80))
  console.log('\nTo fix all conflicts, update database to recommended prices:\n')

  for (const conflict of conflicts) {
    if (conflict.dbPrice !== conflict.recommendedPrice) {
      console.log(`// ${conflict.name}`)
      console.log(`await prisma.product.update({`)
      console.log(`  where: { id: '${conflict.productId}' },`)
      console.log(`  data: { price: ${conflict.recommendedPrice} }`)
      console.log(`}) // ${conflict.dbPrice} → ${conflict.recommendedPrice}\n`)
    }
  }
}

async function main() {
  try {
    const conflicts = await compareAllSources()
    await generateFixScript(conflicts)

    if (conflicts.length > 0) {
      console.log('\n📋 Conflicts found! Priority for canonical prices:')
      console.log('  1. data/productConfig.ts (has variant pricing, most detailed)')
      console.log('  2. lib/products.ts (original source)')
      console.log('  3. Database (current value)')
      console.log('\nRun the generated update statements or use:')
      console.log('  npx tsx scripts/fix-price-conflicts.ts --apply')
    }

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => {
    console.log('\n👋 Analysis complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })






