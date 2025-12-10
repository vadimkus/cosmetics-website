import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'

/**
 * Secure Mobile API Endpoint for Products
 * GET /api/mobile/products
 * 
 * Authentication: Requires x-api-key header matching MOBILE_APP_KEY
 * Returns: Clean JSON with product data for mobile app
 */

export async function GET(request: NextRequest) {
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
    
    debugLog('[MOBILE_API] Authenticated request - fetching products')
    
    // Query products from database
    const dbStartTime = Date.now()
    const products = await prisma.product.findMany({
      where: {
        isHidden: false  // Exclude hidden products from mobile app
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        image: true,
        category: true,
        inStock: true,
        rating: true,     // Bonus field for mobile app
        size: true        // Bonus field for mobile app
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })
    
    const dbDuration = Date.now() - dbStartTime
    debugLog(`[MOBILE_API] Database query completed: ${products.length} products in ${dbDuration}ms`)
    
    // Transform data to match mobile app requirements
    const mobileProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
      stock: product.inStock,  // Map inStock to stock as requested
      // Bonus fields that might be useful for mobile
      rating: product.rating || 5.0,
      size: product.size
    }))
    
    const totalDuration = Date.now() - startTime
    debugLog(`[MOBILE_API] Success: Returned ${mobileProducts.length} products in ${totalDuration}ms`)
    
    // Return clean JSON response
    return NextResponse.json({
      success: true,
      data: mobileProducts,
      meta: {
        count: mobileProducts.length,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    // Error Handling: Don't leak database details
    const duration = Date.now() - startTime
    errorLog('[MOBILE_API] Database error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error - Unable to fetch products' 
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