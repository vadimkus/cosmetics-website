/**
 * Sync Database Prices with Canonical Product List
 * 
 * This script compares prices between:
 * 1. lib/products.ts (canonical source for website)
 * 2. Database (used by mobile API)
 * 
 * And updates the database to match the canonical prices.
 * 
 * Usage: 
 *   npx tsx scripts/sync-database-prices.ts           # Dry run (check only)
 *   npx tsx scripts/sync-database-prices.ts --apply   # Apply fixes
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { prisma } from '../lib/prisma'
import { products } from '../lib/products'

interface PriceMismatch {
  productId: string
  productNumber: string | null
  name: string
  canonicalPrice: number
  databasePrice: number
  difference: number
  percentageDiff: number
}

async function comparePrices() {
  console.log('🔍 Comparing prices between canonical list and database...\n')
  console.log('=' .repeat(80))

  const mismatches: PriceMismatch[] = []
  let totalProducts = 0
  let matchingProducts = 0

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

  console.log(`Found ${products.length} products in canonical list`)
  console.log(`Found ${dbProducts.length} products in database\n`)

  // Compare each product
  for (const canonicalProduct of products) {
    totalProducts++

    // Find matching product in database by ID
    const dbProduct = dbProducts.find(
      p => p.id === canonicalProduct.id || p.productNumber === canonicalProduct.id
    )

    if (!dbProduct) {
      console.log(`⚠️  Product ${canonicalProduct.id} (${canonicalProduct.name}) not found in database`)
      continue
    }

    const canonicalPrice = canonicalProduct.price
    const dbPrice = dbProduct.price

    if (Math.abs(canonicalPrice - dbPrice) > 0.01) {
      const difference = canonicalPrice - dbPrice
      const percentageDiff = ((difference / dbPrice) * 100)

      mismatches.push({
        productId: dbProduct.id,
        productNumber: dbProduct.productNumber,
        name: canonicalProduct.name,
        canonicalPrice,
        databasePrice: dbPrice,
        difference,
        percentageDiff
      })

      console.log(`❌ Product ${canonicalProduct.id}: ${canonicalProduct.name}`)
      console.log(`   Database: AED ${dbPrice} | Canonical: AED ${canonicalPrice} | Diff: ${difference > 0 ? '+' : ''}${difference.toFixed(2)} AED (${percentageDiff > 0 ? '+' : ''}${percentageDiff.toFixed(1)}%)`)
    } else {
      matchingProducts++
    }
  }

  console.log('\n' + '=' .repeat(80))
  console.log('📊 SUMMARY')
  console.log('=' .repeat(80))
  console.log(`Total products checked: ${totalProducts}`)
  console.log(`Matching prices: ${matchingProducts}`)
  console.log(`Price mismatches: ${mismatches.length}`)
  console.log(`Match rate: ${((matchingProducts / totalProducts) * 100).toFixed(1)}%`)

  return mismatches
}

async function syncPrices(mismatches: PriceMismatch[], dryRun: boolean = true) {
  if (mismatches.length === 0) {
    console.log('\n✅ All prices are already in sync!')
    return
  }

  console.log('\n' + '=' .repeat(80))
  if (dryRun) {
    console.log('🔍 DRY RUN - Changes that would be made:')
  } else {
    console.log('💾 APPLYING PRICE UPDATES...')
  }
  console.log('=' .repeat(80))

  for (const mismatch of mismatches) {
    console.log(`\n${mismatch.name} (ID: ${mismatch.productId})`)
    console.log(`  Current DB price: AED ${mismatch.databasePrice}`)
    console.log(`  New price: AED ${mismatch.canonicalPrice}`)
    console.log(`  Change: ${mismatch.difference > 0 ? '+' : ''}${mismatch.difference.toFixed(2)} AED`)

    if (!dryRun) {
      try {
        await prisma.product.update({
          where: {
            id: mismatch.productId
          },
          data: {
            price: mismatch.canonicalPrice
          }
        })
        console.log(`  ✅ Updated successfully`)
      } catch (error) {
        console.error(`  ❌ Failed to update:`, error)
      }
    }
  }

  if (dryRun) {
    console.log('\n⚠️  DRY RUN MODE - No changes were made to the database')
    console.log('To apply these changes, run: npx tsx scripts/sync-database-prices.ts --apply')
  } else {
    console.log('\n✅ All price updates applied successfully!')
  }
}

async function main() {
  const args = process.argv.slice(2)
  const applyChanges = args.includes('--apply')

  try {
    const mismatches = await comparePrices()
    await syncPrices(mismatches, !applyChanges)

    if (mismatches.length > 0 && !applyChanges) {
      console.log('\n📋 Products with price mismatches:')
      console.log('=' .repeat(80))
      
      // Sort by absolute difference (largest first)
      mismatches.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))
      
      console.log('\nTop 10 largest price differences:')
      mismatches.slice(0, 10).forEach((m, i) => {
        console.log(`${i + 1}. ${m.name}`)
        console.log(`   DB: AED ${m.databasePrice} → Canonical: AED ${m.canonicalPrice} (${m.difference > 0 ? '+' : ''}${m.difference} AED)`)
      })
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
    console.log('\n👋 Script finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })

