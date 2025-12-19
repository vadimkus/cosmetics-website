/**
 * Sync Database Prices from Canonical Products List
 * 
 * This script updates all database product prices to match the canonical
 * price list in lib/products.ts (which is the website's source of truth).
 * 
 * Usage: npx tsx scripts/sync-database-prices-from-products.ts [--apply]
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { prisma } from '../lib/prisma'
import { products } from '../lib/products'

interface PriceMismatch {
  id: string
  name: string
  canonicalPrice: number
  databasePrice: number
  difference: number
}

async function syncDatabasePrices(dryRun: boolean = true) {
  console.log('🔄 Syncing database prices with canonical product list...\n')
  console.log(`Mode: ${dryRun ? '🔍 DRY RUN (no changes)' : '✍️  APPLY CHANGES'}\n`)
  console.log('=' .repeat(80))

  try {
    const mismatches: PriceMismatch[] = []
    const matches: string[] = []
    const notInDb: string[] = []
    
    // Check each product in canonical list
    for (const canonicalProduct of products) {
      // Find product in database
      const dbProduct = await prisma.product.findFirst({
        where: {
          OR: [
            { id: canonicalProduct.id },
            { productNumber: canonicalProduct.id }
          ]
        },
        select: {
          id: true,
          name: true,
          price: true,
          productNumber: true
        }
      })

      if (!dbProduct) {
        notInDb.push(`Product ${canonicalProduct.id}: ${canonicalProduct.name}`)
        continue
      }

      // Compare prices
      const canonicalPrice = canonicalProduct.price
      const databasePrice = dbProduct.price
      
      if (Math.abs(canonicalPrice - databasePrice) > 0.01) {
        // Price mismatch found
        mismatches.push({
          id: dbProduct.id,
          name: canonicalProduct.name,
          canonicalPrice,
          databasePrice,
          difference: canonicalPrice - databasePrice
        })
      } else {
        matches.push(canonicalProduct.name)
      }
    }

    // Display results
    console.log(`\n📊 COMPARISON RESULTS`)
    console.log('=' .repeat(80))
    console.log(`✅ Prices matching: ${matches.length}`)
    console.log(`❌ Price mismatches: ${mismatches.length}`)
    console.log(`⚠️  Not in database: ${notInDb.length}`)

    if (mismatches.length > 0) {
      console.log('\n\n❌ PRICE MISMATCHES FOUND:\n')
      console.log('=' .repeat(80))
      
      mismatches.forEach((mismatch, index) => {
        console.log(`\n${index + 1}. ${mismatch.name} (ID: ${mismatch.id})`)
        console.log(`   Database:  AED ${mismatch.databasePrice}`)
        console.log(`   Canonical: AED ${mismatch.canonicalPrice}`)
        console.log(`   Difference: ${mismatch.difference > 0 ? '+' : ''}${mismatch.difference} AED`)
      })

      if (!dryRun) {
        console.log('\n\n💾 APPLYING UPDATES...\n')
        console.log('=' .repeat(80))
        
        let updateCount = 0
        for (const mismatch of mismatches) {
          try {
            await prisma.product.update({
              where: { id: mismatch.id },
              data: { price: mismatch.canonicalPrice }
            })
            
            console.log(`✅ Updated ${mismatch.name}: ${mismatch.databasePrice} → ${mismatch.canonicalPrice} AED`)
            updateCount++
          } catch (error) {
            console.error(`❌ Failed to update ${mismatch.name}:`, error)
          }
        }
        
        console.log(`\n✅ Successfully updated ${updateCount}/${mismatches.length} products`)
      } else {
        console.log('\n\n⚠️  DRY RUN MODE - No changes applied')
        console.log('To apply these updates, run: npx tsx scripts/sync-database-prices-from-products.ts --apply')
      }
    } else {
      console.log('\n✅ All database prices match canonical prices!')
    }

    if (notInDb.length > 0) {
      console.log('\n\n⚠️  PRODUCTS NOT FOUND IN DATABASE:\n')
      console.log('=' .repeat(80))
      notInDb.forEach(product => console.log(`  - ${product}`))
    }

  } catch (error) {
    console.error('\n❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const applyChanges = args.includes('--apply')

// Run the sync
syncDatabasePrices(!applyChanges)
  .then(() => {
    console.log('\n👋 Script finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })
