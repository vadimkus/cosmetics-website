import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'
import { generateBatchEnhancedProductData, EnhancedProductData } from '@/lib/pricingEngine'
import { buildPricingContract } from '@/lib/pricingContract'
import { ApiUser } from '@/types/user'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { withFullInciFallback } from '@/lib/localizedIngredients'
import { getCatalogQuickFacts, getQuickFactLocale } from '@/lib/productQuickFactsCatalog'

/**
 * Database product type - matches Prisma query select fields
 * Used for type-safe database operations
 */
interface DbProduct {
  id: string
  productNumber: string | null
  name: string
  nameRu: string | null
  nameAr: string | null
  price: number
  description: string
  descriptionRu: string | null
  descriptionAr: string | null
  image: string
  images: string | null
  category: string
  inStock: boolean
  rating: number | null
  size: string | null
  noDiscount: boolean
  isPriceOnRequest: boolean
  createdAt: Date
  updatedAt: Date
  skinType: string | null
  targetConcerns: string | null
  usage: string | null
  ageGroup: string | null
  productDetails: string | null
  keyFeatures: string | null
  benefits: string | null
  ingredients: string | null
  howToUse: string | null
  directions: string | null
  variants: {
    id: string
    size: string | null
    color: string | null
    price: number
    available: boolean
    isDefault: boolean
    stockQuantity: number | null
  }[]
}

// Note: LocalizedEnhancedProduct type is inferred from the map function to avoid
// exactOptionalPropertyTypes issues with undefined values from file translations.
// The response shape extends EnhancedProductData with: localizedName, localizedDescription,
// recommendedProductId, note, and localized content fields.

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
    '34': '66',
    '66': '34',
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
    // Sometimes stored as JSON string
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
 * ENHANCED Mobile API Endpoint for Products - DATABASE-DRIVEN ARCHITECTURE
 * GET /api/mobile/products
 * 
 * Authentication: Requires x-api-key header matching MOBILE_APP_KEY
 * Returns: Complete calculated product data with pricing, variants, badges, and VAT
 * 
 * ✅ FEATURES:
 * - Server-calculated pricing with discounts
 * - Dynamic badge generation
 * - Size/color variants with pricing
 * - UAE VAT calculation (5%)
 * - User-specific pricing (if authenticated)
 * - Beauty Box bundle pricing
 * - Black Friday discounts
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
    
    debugLog('[MOBILE_API] Authenticated request - fetching enhanced products')

    // Optional: locale hint for localized fields (en/ru/ar)
    const locale = (request.headers.get('x-locale') || request.nextUrl.searchParams.get('locale') || 'en').toLowerCase()

    // Optional: Get user context for personalized pricing (if user ID provided)
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
        // Continue without user context
      }
    }
    
    // Query products from database with all required fields for enhancement
    const dbStartTime = Date.now()
    const products = await prisma.product.findMany({
      where: {
        isHidden: false  // Exclude hidden products from mobile app
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
        videoUrl: true, // Product video (e.g., /videos/bio.mp4) — dynamic, no app update needed
        category: true,
        inStock: true,
        rating: true,
        size: true,
        noDiscount: true,  // Needed for discount calculations
        isPriceOnRequest: true, // Professional products with price on request only
        createdAt: true,   // Needed for "new" badge logic
        updatedAt: true,
        // Product specifications for mobile app
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
        // Product variants (sizes/colors with pricing)
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
            { isDefault: 'desc' },  // Default variant first
            { price: 'asc' }        // Then by price ascending
          ]
        }
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })
    
    const dbDuration = Date.now() - dbStartTime
    debugLog(`[MOBILE_API] Database query completed: ${products.length} products in ${dbDuration}ms`)
    
    // Generate enhanced product data with complete calculations
    const enhancementStartTime = Date.now()
    const enhancedProductsRaw = generateBatchEnhancedProductData(products, user)
    const enhancementDuration = Date.now() - enhancementStartTime
    
    debugLog(`[MOBILE_API] Product enhancement completed: ${enhancedProductsRaw.length} products in ${enhancementDuration}ms`)

    // Type the products as DbProduct for type-safe access
    const typedProducts = products as DbProduct[]
    
    // Attach locale-specific display fields WITHOUT changing the canonical `name` used for business logic.
    const productsById = new Map<string, DbProduct>(
      typedProducts.map((product) => [String(product.id), product])
    )
    const translationById = new Map<string, {
      nameRu: string | null
      nameAr: string | null
      descriptionRu: string | null
      descriptionAr: string | null
    }>(
      typedProducts.map((p) => [
        p.id,
        {
          nameRu: p.nameRu || null,
          nameAr: p.nameAr || null,
          descriptionRu: p.descriptionRu || null,
          descriptionAr: p.descriptionAr || null,
        },
      ])
    )

    // Precompute extra contract fields (mobile-friendly):
    // - recommendedProductId: for "Perfect Combination" block (backend-driven)
    // - note: dedicated field extracted from productDetails (avoids overloading directions)
    const extrasById = new Map<string, { recommendedProductId: string | null; note: string | null }>(
      typedProducts.map((dbp) => {
        const currentId = String(dbp.productNumber || dbp.id || '')
        return [
          String(dbp.id || ''),
          {
            recommendedProductId: getRecommendedProductId(currentId),
            note: extractNoteFromProductDetails(dbp.productDetails),
          },
        ]
      })
    )

    // Map enhanced products with localization
    const enhancedProducts = enhancedProductsRaw.map((p) => {
      const productId = String(p.id || '')
      const tr = translationById.get(productId) || {
        nameRu: null,
        nameAr: null,
        descriptionRu: null,
        descriptionAr: null
      }
      const wantAr = locale.startsWith('ar')
      const wantRu = locale.startsWith('ru')
      // Access productNumber from enhanced data - it's passed through from the original product
      const productNumber = (p as EnhancedProductData & { productNumber?: string | null }).productNumber
      const productIdForTranslation = String(productNumber || p.id || '').trim()
      const fileTranslations = wantAr
        ? getProductTranslations(productIdForTranslation)
        : wantRu
          ? getProductTranslationsRu(productIdForTranslation)
          : null
      const localizedName =
        (wantAr ? tr.nameAr : wantRu ? tr.nameRu : null) ||
        p.name ||
        ''
      const localizedDescription =
        (fileTranslations?.description) ||
        (wantAr ? tr.descriptionAr : wantRu ? tr.descriptionRu : null) ||
        p.description ||
        ''
      const extras = extrasById.get(productId) || { recommendedProductId: null, note: null }
      // Look up isPriceOnRequest from the original DB row
      const dbRow = productsById.get(productId)
      return {
        ...p,
        localizedName,
        localizedDescription,
        // Localize rich content fields using the same translation maps as the website.
        productDetails: fileTranslations?.productDetails ?? p.productDetails,
        keyFeatures: fileTranslations?.keyFeatures ?? p.keyFeatures,
        benefits: fileTranslations?.benefits ?? p.benefits,
        ingredients: withFullInciFallback(fileTranslations?.ingredients ?? p.ingredients, p.ingredients, locale),
        howToUse: fileTranslations?.howToUse ?? p.howToUse,
        directions: fileTranslations?.directions ?? p.directions,
        recommendedProductId: extras.recommendedProductId,
        note: extras.note,
        isPriceOnRequest: dbRow?.isPriceOnRequest ?? false,
        ...(dbRow ? { pricing: buildPricingContract(dbRow, user) } : {}),
        quickFacts: getCatalogQuickFacts(productIdForTranslation, getQuickFactLocale(locale)),
      }
    })
    
    const totalDuration = Date.now() - startTime
    debugLog(`[MOBILE_API] SUCCESS: Enhanced ${enhancedProducts.length} products in ${totalDuration}ms`)
    
    // Return enhanced JSON response matching mobile app requirements with cache-control headers
    return NextResponse.json({
      success: true,
      data: enhancedProducts,
      meta: {
        count: enhancedProducts.length,
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
          'quick_facts'
        ]
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
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