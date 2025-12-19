import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'
import { generateEnhancedProductData } from '@/lib/pricingEngine'
import { ApiUser } from '@/types/user'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'

function getRecommendedProductId(currentIdRaw: unknown): string | null {
  const idStr = String(currentIdRaw || '').trim()
  if (!idStr) return null
  const map: Record<string, string> = {
    '22': '32',
    '32': '22',
    '20': '30',
    '30': '20',
    '21': '31',
    '31': '21',
    '49': '37',
    '37': '49',
    '4': '1',
    '5': '1',
    '6': '1',
    '7': '1',
    '8': '1',
    '9': '1',
    '15': '30',
    '19': '27',
    '18': '29',
    '29': '18',
    '10': '16',
    '25': '38',
    '33': '17',
    '17': '24',
    '24': '17',
    '44': '43',
    '43': '44',
    '45': '43',
    '46': '44',
  }
  return map[idStr] || null
}

function extractNoteFromProductDetails(productDetails: unknown): string | null {
  if (!productDetails) return null
  if (typeof productDetails === 'string') {
    try {
      const parsed = JSON.parse(productDetails)
      return extractNoteFromProductDetails(parsed)
    } catch {
      return null
    }
  }
  if (typeof productDetails !== 'object') return null
  const obj = productDetails as Record<string, unknown>
  const keys = Object.keys(obj || {})
  const wanted = new Set(['note', 'notes', 'warning', 'caution'])
  for (const k of keys) {
    if (wanted.has(String(k).trim().toLowerCase())) {
      const v = obj[k]
      const txt = typeof v === 'string' ? v.trim() : ''
      if (txt) return txt
    }
  }
  return null
}

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

    // Optional: locale hint for localized fields (en/ru/ar)
    const locale = (request.headers.get('x-locale') || request.nextUrl.searchParams.get('locale') || 'en').toLowerCase()
    
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
      } catch {
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
        nameRu: true,
        nameAr: true,
        price: true,
        description: true,
        descriptionRu: true,
        descriptionAr: true,
        image: true,
        images: true,
        category: true,
        inStock: true,
        rating: true,
        size: true,
        noDiscount: true,
        createdAt: true,
        updatedAt: true,
        // Product specifications for mobile app detail pages
        skinType: true,
        targetConcerns: true,
        usage: true,
        ageGroup: true,
        // Detailed product content
        productDetails: true,
        keyFeatures: true,
        benefits: true,
        ingredients: true,
        howToUse: true,
        directions: true,
        // Product variants (sizes/colors with pricing) - required for DB-driven variant pricing
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
            { isDefault: 'desc' }, // Default variant first
            { price: 'asc' }       // Then by price ascending
          ]
        }
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
    // Attach locale-specific display fields WITHOUT changing the canonical `name`.
    const wantAr = locale.startsWith('ar')
    const wantRu = locale.startsWith('ru')
    const productIdForTranslation = String((product as any)?.productNumber || (product as any)?.id || '').trim()
    const fileTranslations = wantAr
      ? getProductTranslations(productIdForTranslation)
      : wantRu
        ? getProductTranslationsRu(productIdForTranslation)
        : null
    const localizedName =
      (wantAr ? (product as any).nameAr : wantRu ? (product as any).nameRu : null) ||
      (enhancedProduct as any)?.name ||
      ''
    const localizedDescription =
      (fileTranslations?.description) ||
      (wantAr ? (product as any).descriptionAr : wantRu ? (product as any).descriptionRu : null) ||
      (enhancedProduct as any)?.description ||
      ''
    const enhancedProductWithLocale = {
      ...(enhancedProduct as any),
      localizedName,
      localizedDescription,
      // Localize rich content fields using the same translation maps as the website.
      productDetails: fileTranslations?.productDetails || (enhancedProduct as any)?.productDetails,
      keyFeatures: fileTranslations?.keyFeatures || (enhancedProduct as any)?.keyFeatures,
      benefits: fileTranslations?.benefits || (enhancedProduct as any)?.benefits,
      ingredients: fileTranslations?.ingredients || (enhancedProduct as any)?.ingredients,
      howToUse: fileTranslations?.howToUse || (enhancedProduct as any)?.howToUse,
      directions: fileTranslations?.directions || (enhancedProduct as any)?.directions,
      recommendedProductId: getRecommendedProductId((product as any)?.productNumber || (product as any)?.id),
      note: extractNoteFromProductDetails((product as any)?.productDetails),
    }
    const enhancementDuration = Date.now() - enhancementStartTime
    
    debugLog(`[MOBILE_API] Product enhancement completed in ${enhancementDuration}ms`)
    
    const totalDuration = Date.now() - startTime
    debugLog(`[MOBILE_API] SUCCESS: Enhanced product ${id} in ${totalDuration}ms`)
    
    // Return enhanced JSON response with cache-control headers
    return NextResponse.json({
      success: true,
      data: enhancedProductWithLocale,
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
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
  } catch {
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

