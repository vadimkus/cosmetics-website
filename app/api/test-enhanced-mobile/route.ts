import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateEnhancedProductData } from '@/lib/pricingEngine'
import { debugLog } from '@/lib/logger'
import { requireDevelopment } from '@/lib/apiErrorHandler'

/**
 * TEST ENDPOINT: Enhanced Mobile API Product Data
 * GET /api/test-enhanced-mobile
 * 
 * This endpoint tests the enhanced product data generation
 * and shows the exact format that mobile apps will receive
 */

export async function GET(request: NextRequest) {
  // Development-only route
  const devCheck = requireDevelopment()
  if (devCheck) return devCheck

  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId') || '1' // Default to Microneedle Roller
    const userId = searchParams.get('userId') // Optional user for discount testing
    
    debugLog('🧪 Testing enhanced mobile API for product:', productId)
    
    // Get user context if provided
    let user = null
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          discountType: true,
          discountPercentage: true,
          canSeePrices: true
        }
      })
    }
    
    // Get product from database
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: productId },
          { productNumber: productId }
        ],
        isHidden: false
      }
    })
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: `Product ${productId} not found`
      }, { status: 404 })
    }
    
    // Generate enhanced product data
    const enhancedProduct = generateEnhancedProductData(product, user)
    
    // Return comprehensive test response
    return NextResponse.json({
      success: true,
      message: 'Enhanced Mobile API Test Results',
      testData: {
        originalProduct: {
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          inStock: product.inStock
        },
        enhancedProduct,
        userContext: user ? {
          id: user.id,
          email: user.email,
          discountType: user.discountType,
          discountPercentage: user.discountPercentage
        } : null,
        apiFormat: {
          description: 'This is the exact format your mobile app will receive',
          requiredFields: [
            'id', 'name', 'price', 'displayPrice', 'priceIncludingVat',
            'variants', 'colorVariants', 'badges', 'stock', 'rating'
          ],
          optionalFields: [
            'originalPrice', 'discountLabel', 'vatAmount', 'hasVariants',
            'isNewProduct', 'isBestSeller'
          ]
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        testEndpoint: '/api/test-enhanced-mobile',
        productionEndpoint: '/api/mobile/products',
        authentication: 'Requires x-api-key header in production'
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * Test multiple products at once
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productIds = ['1', '10', '41', '55'], userId } = body
    
    debugLog('🧪 Testing batch enhanced mobile API for products:', productIds)
    
    // Get user context if provided
    let user = null
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          discountType: true,
          discountPercentage: true,
          canSeePrices: true
        }
      })
    }
    
    // Get products from database
    const products = await prisma.product.findMany({
      where: {
        OR: productIds.map((id: string) => ({ id })),
        isHidden: false
      }
    })
    
    // Generate enhanced data for all products
    const enhancedProducts = products.map(product => ({
      original: {
        id: product.id,
        name: product.name,
        price: product.price
      },
      enhanced: generateEnhancedProductData(product, user)
    }))
    
    return NextResponse.json({
      success: true,
      message: 'Batch Enhanced Mobile API Test Results',
      testData: {
        productsCount: enhancedProducts.length,
        products: enhancedProducts,
        userContext: user ? {
          id: user.id,
          email: user.email,
          discountType: user.discountType,
          discountPercentage: user.discountPercentage
        } : null
      },
      summary: {
        productsWithVariants: enhancedProducts.filter(p => p.enhanced.hasVariants).length,
        productsWithDiscounts: enhancedProducts.filter(p => p.enhanced.originalPrice).length,
        productsWithBadges: enhancedProducts.filter(p => p.enhanced.badges.length > 0).length,
        totalBadges: enhancedProducts.reduce((sum, p) => sum + p.enhanced.badges.length, 0)
      },
      meta: {
        timestamp: new Date().toISOString(),
        testEndpoint: '/api/test-enhanced-mobile',
        productionEndpoint: '/api/mobile/products'
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Batch test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

