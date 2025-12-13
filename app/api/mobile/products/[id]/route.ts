import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'
import { generateEnhancedProductData } from '@/lib/pricingEngine'
import { ApiUser } from '@/types/user'

/**
 * ENHANCED Mobile API Endpoint for Individual Product
 * GET /api/mobile/products/[id]
 * 
 * Authentication: Requires x-api-key header matching MOBILE_APP_KEY
 * Returns: Complete calculated product data with pricing, variants, badges, and VAT
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  
  try {
    // Security: Validate API Key
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.MOBILE_APP_KEY
    
    if (!expectedKey) {
      errorLog('[MOBILE_API] MOBILE_APP_KEY environment variable not configured')
      return NextResponse.json(
        { 
          success: false, 
          error: 'API service unavailable' 
        },
        { status: 503 }
      )
    }
    
    if (!apiKey || apiKey !== expectedKey) {
      debugLog('[MOBILE_API] Unauthorized access attempt:', {
        providedKey: apiKey ? 'PROVIDED' : 'MISSING',
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      })
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized - Invalid or missing API key' 
        },
        { status: 401 }
      )
    }

    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product ID is required' 
        },
        { status: 400 }
      )
    }

    // Optional: Get user context for personalized pricing
    const userId = request.headers.get('x-user-id')
    let user: ApiUser | null = null
    
    if (userId) {
      try {
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
        debugLog(`[MOBILE_API] User context loaded: ${user?.email || 'not found'}`)
      } catch (error) {
        debugLog('[MOBILE_API] Failed to load user context:', error)
      }
    }
    
    // Query product from database with all required fields
    const dbStartTime = Date.now()
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { productNumber: id }
        ],
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
        // Additional fields for mobile
        productDetails: true,
        keyFeatures: true,
        benefits: true,
        ingredients: true,
        howToUse: true,
        directions: true
      }
    })
    
    const dbDuration = Date.now() - dbStartTime
    debugLog(`[MOBILE_API] Database query completed in ${dbDuration}ms`)
    
    if (!product) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product not found' 
        },
        { status: 404 }
      )
    }
    
    // Generate enhanced product data with complete calculations
    const enhancementStartTime = Date.now()
    const enhancedProduct = generateEnhancedProductData(product, user)
    const enhancementDuration = Date.now() - enhancementStartTime
    
    debugLog(`[MOBILE_API] Product enhancement completed in ${enhancementDuration}ms`)
    
    const totalDuration = Date.now() - startTime
    debugLog(`[MOBILE_API] SUCCESS: Enhanced product ${id} in ${totalDuration}ms`)
    
    // Return enhanced JSON response
    return NextResponse.json({
      success: true,
      data: enhancedProduct,
      meta: {
        timestamp: new Date().toISOString(),
        processingTime: `${totalDuration}ms`,
        userContext: user ? 'authenticated' : 'anonymous',
        features: [
          'calculated_pricing',
          'dynamic_badges', 
          'size_variants',
          'color_variants',
          'uae_vat_included',
          'user_discounts',
          'beauty_box_bundles',
          'product_details'
        ]
      }
    })
    
  } catch (error) {
    const duration = Date.now() - startTime
    errorLog('[MOBILE_API] Error fetching product:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error - Unable to fetch product' 
      },
      { status: 500 }
    )
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

