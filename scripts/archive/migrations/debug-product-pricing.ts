/**
 * Debug Script: Test Product Pricing API
 * 
 * This script tests the mobile API endpoints to debug why products
 * are returning the same price for different sizes.
 * 
 * Usage: npx tsx scripts/debug-product-pricing.ts
 */

// Load environment variables first
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { prisma } from '../lib/prisma'
import { generateEnhancedProductData, generateBatchEnhancedProductData } from '../lib/pricingEngine'

async function debugProductPricing() {
  console.log('🔍 Starting Product Pricing Debug...\n')

  try {
    // Test 1: Check Product 10 (Cleanser) in database
    console.log('📦 Test 1: Checking Product 10 (Cleanser) in Database')
    console.log('=' .repeat(80))
    
    const product10 = await prisma.product.findFirst({
      where: {
        OR: [
          { id: '10' },
          { productNumber: '10' }
        ]
      },
      select: {
        id: true,
        productNumber: true,
        name: true,
        price: true,
        description: true,
        image: true,
        images: true,
        category: true,
        inStock: true,
        rating: true,
        size: true,
        noDiscount: true,
        createdAt: true,
        updatedAt: true,
        skinType: true,
        targetConcerns: true,
        usage: true,
        ageGroup: true,
        productDetails: true,
        keyFeatures: true,
        benefits: true,
        ingredients: true,
        howToUse: true,
        directions: true,
        variants: {
          select: {
            id: true,
            size: true,
            color: true,
            price: true,
            available: true,
            isDefault: true,
            stockQuantity: true
          },
          orderBy: [
            { isDefault: 'desc' },
            { price: 'asc' }
          ]
        }
      }
    })

    if (!product10) {
      console.log('❌ Product 10 not found in database!')
    } else {
      console.log('✅ Product 10 found:')
      console.log(`   Name: ${product10.name}`)
      console.log(`   Base Price: AED ${product10.price}`)
      console.log(`   Variants in DB: ${product10.variants?.length || 0}`)
      
      if (product10.variants && product10.variants.length > 0) {
        console.log('\n   Database Variants:')
        product10.variants.forEach((variant, index) => {
          console.log(`   ${index + 1}. Size: ${variant.size || 'N/A'} | Color: ${variant.color || 'N/A'} | Price: AED ${variant.price} | Default: ${variant.isDefault} | Available: ${variant.available}`)
        })
      } else {
        console.log('   ⚠️  No variants found in database!')
      }
    }

    // Test 2: Generate Enhanced Data (simulating API response)
    console.log('\n\n📡 Test 2: Simulating API Response Generation')
    console.log('=' .repeat(80))
    
    if (product10) {
      const enhancedProduct = generateEnhancedProductData(product10 as any, null)
      
      console.log('Enhanced Product Data:')
      console.log(`   Display Price: AED ${enhancedProduct.displayPrice}`)
      console.log(`   Original Price: AED ${enhancedProduct.originalPrice || 'N/A'}`)
      console.log(`   Variants Count: ${enhancedProduct.variants.length}`)
      
      if (enhancedProduct.variants.length > 0) {
        console.log('\n   Enhanced Variants (as mobile app will receive):')
        enhancedProduct.variants.forEach((variant, index) => {
          console.log(`   ${index + 1}. Size: ${variant.size || 'N/A'} | Price: AED ${variant.price} | Default: ${variant.isDefault} | Available: ${variant.available}`)
        })
      }
    }

    // Test 3: Check all products with variants
    console.log('\n\n📋 Test 3: Checking All Products with Variants')
    console.log('=' .repeat(80))
    
    const productsWithVariants = await prisma.product.findMany({
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
          },
          orderBy: [
            { isDefault: 'desc' },
            { price: 'asc' }
          ]
        }
      }
    })

    console.log(`Found ${productsWithVariants.length} products with variants:\n`)
    
    productsWithVariants.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (ID: ${product.id})`)
      console.log(`   Base Price: AED ${product.price}`)
      console.log(`   Variants:`)
      
      product.variants.forEach((variant) => {
        console.log(`      - Size: ${variant.size || 'N/A'} | Color: ${variant.color || 'N/A'} | Price: AED ${variant.price} | Default: ${variant.isDefault}`)
      })
      
      // Check if all variants have the same price
      const prices = product.variants.map(v => v.price)
      const uniquePrices = Array.from(new Set(prices))
      
      if (uniquePrices.length === 1) {
        console.log(`   ⚠️  WARNING: All variants have the same price (AED ${uniquePrices[0]})`)
      } else {
        console.log(`   ✅ Variants have different prices: ${uniquePrices.map(p => `AED ${p}`).join(', ')}`)
      }
      
      console.log()
    })

    // Test 4: Batch generation test
    console.log('\n📦 Test 4: Testing Batch Generation (as used by /api/mobile/products)')
    console.log('=' .repeat(80))
    
    const allProducts = await prisma.product.findMany({
      where: {
        isHidden: false
      },
      select: {
        id: true,
        productNumber: true,
        name: true,
        price: true,
        description: true,
        image: true,
        images: true,
        category: true,
        inStock: true,
        rating: true,
        size: true,
        noDiscount: true,
        createdAt: true,
        updatedAt: true,
        skinType: true,
        targetConcerns: true,
        usage: true,
        ageGroup: true,
        productDetails: true,
        keyFeatures: true,
        benefits: true,
        ingredients: true,
        howToUse: true,
        directions: true,
        variants: {
          select: {
            id: true,
            size: true,
            color: true,
            price: true,
            available: true,
            isDefault: true,
            stockQuantity: true
          },
          orderBy: [
            { isDefault: 'desc' },
            { price: 'asc' }
          ]
        }
      },
      take: 5 // Just test first 5 products
    })

    const enhancedProducts = generateBatchEnhancedProductData(allProducts as any, null)
    
    console.log(`Generated enhanced data for ${enhancedProducts.length} products\n`)
    
    enhancedProducts.forEach((product) => {
      if (product.variants.length > 0) {
        console.log(`${product.name}:`)
        console.log(`   Display Price: AED ${product.displayPrice}`)
        console.log(`   Variants:`)
        product.variants.forEach((variant) => {
          console.log(`      - Size: ${variant.size || 'N/A'} | Price: AED ${variant.price}`)
        })
        
        // Check for same-price issue
        const prices = product.variants.map(v => v.price)
        const uniquePrices = Array.from(new Set(prices))
        
        if (uniquePrices.length === 1) {
          console.log(`   ⚠️  ISSUE FOUND: All variants show same price (AED ${uniquePrices[0]})`)
        }
        console.log()
      }
    })

    console.log('\n✅ Debug complete!')

  } catch (error) {
    console.error('❌ Error during debugging:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the debug script
debugProductPricing()
  .then(() => {
    console.log('\n👋 Debug script finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Debug script failed:', error)
    process.exit(1)
  })
