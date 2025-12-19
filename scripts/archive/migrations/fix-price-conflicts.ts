/**
 * Fix Price Conflicts - Update Database to Match productConfig.ts
 * 
 * This script updates all database prices to match data/productConfig.ts
 * which is the canonical source for pricing (includes variant pricing).
 * 
 * Usage:
 *   npx tsx scripts/fix-price-conflicts.ts           # Dry run
 *   npx tsx scripts/fix-price-conflicts.ts --apply   # Apply changes
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { prisma } from '../lib/prisma'
import { PRODUCT_CONFIG } from '../data/productConfig'

interface PriceUpdate {
  productId: string
  name: string
  oldPrice: number
  newPrice: number
  change: number
}

async function fixPriceConflicts(dryRun: boolean = true) {
  console.log(`🔧 ${dryRun ? 'DRY RUN:' : 'APPLYING:'} Fix Price Conflicts\n`)
  console.log('Canonical source: data/productConfig.ts')
  console.log('=' .repeat(80))

  const updates: PriceUpdate[] = []

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
    }
  })

  console.log(`\nChecking ${dbProducts.length} products...\n`)

  // Check each product against productConfig
  for (const dbProduct of dbProducts) {
    const productId = dbProduct.productNumber || dbProduct.id
    const config = PRODUCT_CONFIG[productId]

    if (!config) {
      continue // No config, keep database price
    }

    const canonicalPrice = config.pricing.basePrice
    const dbPrice = dbProduct.price

    // Check if prices differ
    if (Math.abs(canonicalPrice - dbPrice) > 0.01) {
      updates.push({
        productId: dbProduct.id,
        name: dbProduct.name,
        oldPrice: dbPrice,
        newPrice: canonicalPrice,
        change: canonicalPrice - dbPrice
      })

      console.log(`${updates.length}. ${dbProduct.name}`)
      console.log(`   Old: AED ${dbPrice} → New: AED ${canonicalPrice} (${canonicalPrice > dbPrice ? '+' : ''}${(canonicalPrice - dbPrice).toFixed(2)})`)
    }
  }

  console.log('\n' + '=' .repeat(80))
  console.log('📊 SUMMARY')
  console.log('=' .repeat(80))
  console.log(`Products to update: ${updates.length}`)

  if (updates.length === 0) {
    console.log('\n✅ All prices are already correct!')
    return
  }

  // Calculate statistics
  const increases = updates.filter(u => u.change > 0).length
  const decreases = updates.filter(u => u.change < 0).length
  const totalChange = updates.reduce((sum, u) => sum + u.change, 0)

  console.log(`Price increases: ${increases}`)
  console.log(`Price decreases: ${decreases}`)
  console.log(`Net price change: AED ${totalChange.toFixed(2)}`)

  if (dryRun) {
    console.log('\n⚠️  DRY RUN MODE - No changes were made')
    console.log('To apply these changes, run:')
    console.log('  npx tsx scripts/fix-price-conflicts.ts --apply')
    return
  }

  // Apply updates
  console.log('\n💾 Applying updates...\n')

  let successCount = 0
  let failCount = 0

  for (const update of updates) {
    try {
      await prisma.product.update({
        where: { id: update.productId },
        data: { price: update.newPrice }
      })
      successCount++
      console.log(`✅ ${update.name}: ${update.oldPrice} → ${update.newPrice}`)
    } catch {
      failCount++
      console.error(`❌ ${update.name}: Failed -`, error)
    }
  }

  console.log('\n' + '=' .repeat(80))
  console.log(`✅ Successfully updated: ${successCount}`)
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount}`)
  }
  console.log('\n🎉 Database prices synced with productConfig.ts!')
}

async function main() {
  const args = process.argv.slice(2)
  const applyChanges = args.includes('--apply')

  try {
    await fixPriceConflicts(!applyChanges)
  } catch {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => {
    console.log('\n👋 Script complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })







