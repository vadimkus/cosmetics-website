/**
 * Backfill Script: Migrate Product Variants to Database
 * 
 * This script migrates product variant data from productConfig.ts to the new ProductVariant table.
 * 
 * What it does:
 * 1. Reads all products from the database
 * 2. For each product, checks if it has size/color variants in productConfig.ts
 * 3. Creates ProductVariant records with proper pricing
 * 4. Marks one variant as default (usually the first/smallest size)
 * 
 * Usage:
 * npm run ts-node scripts/backfill-product-variants.ts
 * 
 * Or with tsx:
 * npx tsx scripts/backfill-product-variants.ts
 */

import { PrismaClient } from '@prisma/client'
import { PRODUCT_CONFIG } from '../data/productConfig'

const prisma = new PrismaClient()

interface VariantToCreate {
  productId: string
  size: string | null
  color: string | null
  price: number
  available: boolean
  isDefault: boolean
}

async function main() {
  console.log('🚀 Starting product variants backfill...\n')
  
  try {
    // Get all products from database
    const products = await prisma.product.findMany({
      select: {
        id: true,
        productNumber: true,
        name: true,
        price: true
      }
    })
    
    console.log(`📦 Found ${products.length} products in database\n`)
    
    let variantsCreated = 0
    let productsProcessed = 0
    let productsSkipped = 0
    
    for (const product of products) {
      const config = PRODUCT_CONFIG[product.id]
      
      if (!config) {
        console.log(`⚠️  No config found for product ${product.id} (${product.name})`)
        productsSkipped++
        continue
      }
      
      const variantsToCreate: VariantToCreate[] = []
      
      // Check if product has size variants
      if (config.sizes && config.sizes.length > 0) {
        config.sizes.forEach((sizeOption, index) => {
          const price = config.pricing.sizeVariants?.[sizeOption.value] || config.pricing.basePrice
          
          variantsToCreate.push({
            productId: product.id,
            size: sizeOption.value,
            color: null,
            price: price,
            available: sizeOption.available,
            isDefault: index === 0 // First size is default
          })
        })
        
        console.log(`✅ Product ${product.id} (${product.name}): ${config.sizes.length} size variants`)
      }
      // Check if product has color variants (no sizes)
      else if (config.colors && config.colors.length > 0) {
        config.colors.forEach((colorOption, index) => {
          const price = config.pricing.colorVariants?.[colorOption.value] || config.pricing.basePrice
          
          variantsToCreate.push({
            productId: product.id,
            size: null,
            color: colorOption.value,
            price: price,
            available: colorOption.available,
            isDefault: index === 0 // First color is default
          })
        })
        
        console.log(`✅ Product ${product.id} (${product.name}): ${config.colors.length} color variants`)
      }
      // Product has no variants - create single default variant with base price
      else {
        variantsToCreate.push({
          productId: product.id,
          size: null,
          color: null,
          price: config.pricing.basePrice,
          available: true,
          isDefault: true
        })
        
        console.log(`✅ Product ${product.id} (${product.name}): 1 default variant (no size/color options)`)
      }
      
      // Create all variants for this product
      if (variantsToCreate.length > 0) {
        for (const variant of variantsToCreate) {
          await prisma.productVariant.create({
            data: variant
          })
          variantsCreated++
        }
        productsProcessed++
      }
    }
    
    console.log('\n📊 Summary:')
    console.log(`   ✅ Products processed: ${productsProcessed}`)
    console.log(`   ⏭️  Products skipped: ${productsSkipped}`)
    console.log(`   🎯 Total variants created: ${variantsCreated}`)
    console.log('\n✨ Backfill completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during backfill:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Handle script execution
main()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

