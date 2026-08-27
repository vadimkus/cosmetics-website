import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'
import { isNewCategoryDisplayName } from '@/lib/productBadges'

/**
 * Mobile API Endpoint for Categories
 * GET /api/mobile/categories
 * 
 * Authentication: Requires x-api-key header matching MOBILE_APP_KEY
 * Returns: List of all unique product categories
 * 
 * ✅ FEATURES:
 * - Returns distinct categories from products table
 * - Filters out hidden products
 * - Alphabetically sorted
 * - API key authentication
 */

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Security: Validate API Key
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.MOBILE_APP_KEY
    
    if (!expectedKey) {
      errorLog('[MOBILE_API_CATEGORIES] MOBILE_APP_KEY environment variable not configured')
      return NextResponse.json(
        { 
          success: false, 
          error: 'API service unavailable' 
        },
        { status: 503 }
      )
    }
    
    if (!apiKey || apiKey !== expectedKey) {
      debugLog('[MOBILE_API_CATEGORIES] Unauthorized access attempt:', {
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
    
    debugLog('[MOBILE_API_CATEGORIES] Authenticated request - fetching categories')
    
    // Query distinct categories from products
    const rows = await prisma.product.findMany({
      select: { category: true },
      where: { 
        isHidden: false // Only include visible products
      },
      distinct: ['category']
    })
    
    // Process and sort categories
    const categories = rows
      .map((r) => (r.category ?? '').trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
    
    // Category New badges - single source of truth in lib/productBadges.ts
    const categoriesWithBadges = categories.map(cat => ({
      name: cat,
      badge: isNewCategoryDisplayName(cat) ? 'new' as const : null
    }))

    const duration = Date.now() - startTime
    debugLog(`[MOBILE_API_CATEGORIES] SUCCESS: Retrieved ${categories.length} categories in ${duration}ms`)
    
    return NextResponse.json({
      success: true,
      data: categories, // backward compatible: plain string array
      categoriesWithBadges, // enhanced: includes badge metadata
      meta: {
        count: categories.length,
        timestamp: new Date().toISOString(),
        processingTime: `${duration}ms`
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
      }
    })
    
  } catch (error) {
    const duration = Date.now() - startTime
    errorLog('[MOBILE_API_CATEGORIES] Database error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error - Unable to fetch categories' 
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
