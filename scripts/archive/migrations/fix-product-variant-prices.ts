/**
 * Fix Product Variant Prices Script
 * 
 * This script checks and fixes product variant prices that don't match
 * the expected prices from PRODUCT_CONFIG.
 * 
 * Usage: npx tsx scripts/fix-product-variant-prices.ts
 */

// Load environment variables first
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { prisma } from '../lib/prisma'
import { PRODUCT_CONFIG } from '../data/productConfig'

interface VariantFix {
  productId: string
  productName: string
  variantId: string
  size?: string
  color?: string
  currentPrice: number
  expectedPrice: number
  needsFix: boolean
}

async function checkAndFixVariantPrices(dryRun: boolean = true) {
  console.log(`🔍 ${dryRun ? 'CHECKING' : 'FIXING'} Product Variant Prices...\n`)
  console.log('=' .repeat(80))

  try {
    const variantFixes: VariantFix[] = []
    
    // Get all products with variants
    const products = await prisma.product.findMany({
      where: {
        isHidden: false,
        variants: {
          some: {}
        }
      },
      select: {
        id: true,
        productNumber: true,
        name: true,
        price: true,
        variants: {
          select: {
            id: true,
            size: true,
            color: true,
            price: true,
            isDefault: true
          }
        }
      }
    })

    console.log(`Found ${products.length} products with variants\n`)

    // Check each product against PRODUCT_CONFIG
    for (const product of products) {
      const productId = product.productNumber || product.id
      const config = PRODUCT_CONFIG[productId]
      
      if (!config) {
        console.log(`⚠️  ${product.name} (ID: ${productId}): No config found, skipping`)
        continue
      }

      console.log(`\n📦 ${product.name} (ID: ${productId})`)
      console.log(`   Base Price: AED ${product.price}`)
      
      for (const variant of product.variants) {
        let expectedPrice = config.pricing.basePrice
        
        // Check size variants
        if (variant.size && config.pricing.sizeVariants) {
          expectedPrice = config.pricing.sizeVariants[variant.size] || config.pricing.basePrice
        }
        
        // Check color variants (future expansion)
        if (variant.color && config.pricing.colorVariants) {
          expectedPrice = config.pricing.colorVariants[variant.color] || expectedPrice
        }
        
        const needsFix = Math.abs(variant.price - expectedPrice) > 0.01
        
        const fix: VariantFix = {
          productId: product.id,
          productName: product.name,
          variantId: variant.id,
          size: variant.size || undefined,
          color: variant.color || undefined,
          currentPrice: variant.price,
          expectedPrice,
          needsFix
        }
        
        variantFixes.push(fix)
        
        if (needsFix) {
          console.log(`   ❌ Variant (${variant.size || variant.color || 'default'}): AED ${variant.price} → Should be AED ${expectedPrice}`)
        } else {
          console.log(`   ✅ Variant (${variant.size || variant.color || 'default'}): AED ${variant.price} (correct)`)
        }
      }
    }

    // Summary
    const fixesNeeded = variantFixes.filter(f => f.needsFix)
    
    console.log('\n\n' + '=' .repeat(80))
    console.log('📊 SUMMARY')
    console.log('=' .repeat(80))
    console.log(`Total variants checked: ${variantFixes.length}`)
    console.log(`Variants needing fixes: ${fixesNeeded.length}`)
    console.log(`Variants correct: ${variantFixes.length - fixesNeeded.length}`)

    if (fixesNeeded.length > 0) {
      console.log('\n🔧 FIXES NEEDED:\n')
      
      for (const fix of fixesNeeded) {
        console.log(`${fix.productName}`)
        console.log(`   Variant: ${fix.size || fix.color || 'default'}`)
        console.log(`   Current: AED ${fix.currentPrice} → Expected: AED ${fix.expectedPrice}`)
        console.log()
      }

      if (!dryRun) {
        console.log('\n💾 APPLYING FIXES...\n')
        
        for (const fix of fixesNeeded) {
          try {
            await prisma.productVariant.update({
              where: {
                id: fix.variantId
              },
              data: {
                price: fix.expectedPrice
              }
            })
            
            console.log(`✅ Fixed ${fix.productName} - ${fix.size || fix.color || 'default'}: AED ${fix.currentPrice} → AED ${fix.expectedPrice}`)
          } catch {
            console.error(`❌ Failed to fix ${fix.productName} - ${fix.size || fix.color || 'default'}:`, error)
          }
        }
        
        console.log('\n✅ All fixes applied!')
      } else {
        console.log('\n⚠️  DRY RUN MODE - No changes made')
        console.log('To apply fixes, run: npx tsx scripts/fix-product-variant-prices.ts --apply')
      }
    } else {
      console.log('\n✅ All variant prices are correct!')
    }

  } catch {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const applyFixes = args.includes('--apply')

// Run the check/fix
checkAndFixVariantPrices(!applyFixes)
  .then(() => {
    console.log('\n👋 Script finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })
