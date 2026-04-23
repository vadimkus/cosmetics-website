import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from './prisma'
import { withPrismaRetry } from './prismaRetry'
import type { Product } from '@/types'

// Re-export Product type from types/index.ts for convenience
export type { Product }

/**
 * Check if a product should be hidden
 * @param product - The product to check
 * @returns true if product should be hidden
 */
function shouldHideProduct(product: Product): boolean {
  // Use database flag instead of hardcoded IDs
  return product.isHidden === true
}

export async function getAllProducts(): Promise<Product[]> {
  return withPrismaRetry(
    () =>
      prisma.product.findMany({
        where: { isHidden: false },
        include: { variants: true },
        orderBy: { name: 'asc' },
      }),
    { label: 'getAllProducts' }
  )
}

export async function getProductById(id: string): Promise<Product | null> {
  return withPrismaRetry(async () => {
    let product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true }
    })

    if (!product) {
      product = await prisma.product.findUnique({
        where: { productNumber: id },
        include: { variants: true }
      })
    }

    if (product && shouldHideProduct(product)) {
      return null
    }

    return product
  }, { label: 'getProductById' })
}

/**
 * ISR cache layer: shared across requests with tag-based invalidation.
 * Admin product mutations must call `revalidateTag('products', 'max')` to
 * expire entries immediately; otherwise entries age out after 5 minutes.
 */
const getProductByIdFromDb = unstable_cache(
  async (id: string): Promise<Product | null> => getProductById(id),
  ['product-by-id'],
  { revalidate: 300, tags: ['products'] }
)

/**
 * Preferred product fetch for page.tsx + generateMetadata + opengraph-image +
 * twitter-image. Composes two cache layers:
 *   1. `unstable_cache` — cross-request ISR with tag revalidation
 *   2. `react.cache()` — intra-request dedup so all four callers share one DB hit
 */
export const getProductByIdCached = cache(
  async (id: string): Promise<Product | null> => getProductByIdFromDb(id)
)

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    // Case-insensitive substring match on the comma-separated `category` field
    // in the DB. Products can belong to multiple categories, e.g. a product
    // with category = "Cushion BB, Sun, Cream" must appear on the Sun,
    // Cushion BB and Cream landing pages.
    const products = await prisma.product.findMany({
      where: {
        category: {
          contains: category,
          mode: 'insensitive',
        },
        isHidden: false,
      },
      include: { variants: true },
      orderBy: {
        name: 'asc',
      },
    })
    return products
  } catch (error) {
    errorLog('Error fetching products by category:', error)
    throw new Error('Failed to fetch products by category')
  }
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  try {
    // Exclude variants from the data (it's a relation, not a direct field)
    const { variants: _variants, ...dataWithoutVariants } = productData
    
    const product = await prisma.product.create({
      data: dataWithoutVariants
    })
    return product
  } catch (error) {
    errorLog('Error adding product:', error)
    throw new Error('Failed to add product')
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  try {
    // Exclude variants from the updates (it's a relation, not a direct field)
    const { variants: _variants, ...updatesWithoutVariants } = updates
    
    const product = await prisma.product.update({
      where: { id },
      data: updatesWithoutVariants
    })
    return product
  } catch (error) {
    errorLog('Error updating product:', error)
    throw new Error('Failed to update product')
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await prisma.product.delete({
      where: { id }
    })
    return true
  } catch (error) {
    errorLog('Error deleting product:', error)
    return false
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isHidden: false,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { category: { contains: query } }
        ]
      },
      include: { variants: true },
      orderBy: {
        name: 'asc'
      }
    })
    return products // No need to filter again since we filtered at DB level
  } catch (error) {
    errorLog('Error searching products:', error)
    throw new Error('Failed to search products')
  }
}

// Skin type compatibility matrix - which skin types work well together
const SKIN_TYPE_COMPATIBILITY: Record<string, string[]> = {
  'dry': ['dry', 'normal', 'sensitive'],
  'oily': ['oily', 'combination', 'normal'],
  'combination': ['combination', 'oily', 'normal', 'dry'],
  'normal': ['normal', 'dry', 'oily', 'combination', 'sensitive'],
  'sensitive': ['sensitive', 'dry', 'normal']
}

// GENOSYS Product-to-Concern mapping based on actual product formulations
// This provides sharp, accurate recommendations based on product capabilities
// Generic keys (hydration, sensitivity, etc.) are used by the skin-analysis scoring system.
// Page-specific keys (page-*) control which products appear on concern landing pages.
const GENOSYS_PRODUCT_CONCERNS: Record<string, string[]> = {
  // Cleansers
  'SNOW O₂ CLEANSER': ['hydration', 'brightening', 'sensitivity'],
  'SKIN DEFENDER LIP & EYE MAKEUP REMOVER': ['eye-care', 'sensitivity'],

  // Peelings
  'EPI TURNOVER BOOSTING PEELING GEL': ['brightening', 'anti-aging', 'pore-care', 'page-pigmentation', 'page-acne', 'scar-repair'],
  'SKIN RENEWAL PEELING SYSTEM': ['brightening', 'anti-aging', 'pore-care', 'page-pigmentation'],

  // Toners/Mists
  'MICROBIOME ENERGY INFUSING MIST': ['hydration', 'sensitivity', 'page-hydration', 'page-sensitivity'],
  'INTENSIVE PROBLEM CONTROL TONER': ['acne-blemishes', 'pore-care', 'page-acne'],
  'SNOW BOOSTER': ['hydration', 'sensitivity', 'page-hydration'],

  // Serums
  'EyeCell EYE CONTOUR SERUM': ['eye-care', 'anti-aging', 'brightening'],
  'MOISTURE REPLENISHING HYALURON SERUM': ['hydration', 'page-hydration', 'scar-repair'],
  'ALL FOR SENSITIVE SERUM': ['sensitivity', 'hydration', 'page-sensitivity'],
  'PROBLEM CONTROL SERUM': ['acne-blemishes', 'pore-care', 'page-acne'],
  'MULTI VITA RADIANCE SERUM': ['brightening', 'anti-aging', 'page-pigmentation'],
  'MULTI FUNCTIONAL ANTI-WRINKLE SERUM': ['anti-aging', 'page-anti-aging'],

  // Creams
  'ND Cell ANTI-WRINKLE CREAM': ['anti-aging', 'page-anti-aging'],
  'EyeCell EYE CONTOUR CREAM': ['eye-care', 'anti-aging', 'brightening', 'page-anti-aging'],
  'SOOTHING REPAIR POSTCREAM': ['sensitivity', 'hydration', 'page-sensitivity', 'scar-repair'],
  'EGF REPAIR OXYMASK CREAM': ['sensitivity', 'anti-aging', 'scar-repair'],
  'SKIN BARRIER PROTECTING CREAM': ['sensitivity', 'hydration', 'page-sensitivity', 'scar-repair'],
  'INTENSIVE HYDRO SOOTHING CREAM': ['hydration', 'sensitivity', 'page-hydration', 'page-sensitivity'],
  'MOISTURE REPLENISHING HYALURON CREAM': ['hydration', 'page-hydration'],
  'INTENSIVE PROBLEM CONTROL CREAM': ['acne-blemishes', 'pore-care', 'page-acne'],
  'MULTI VITA RADIANCE CREAM': ['brightening', 'anti-aging', 'page-pigmentation'],
  'MULTI FUNCTIONAL ANTI-WRINKLE CREAM': ['anti-aging', 'page-anti-aging'],

  // Eye Care
  'EyeCell EYE PEPTIDE GEL PATCH': ['eye-care', 'anti-aging', 'hydration'],
  'EyeCell EYE ZONE CARE KIT': ['eye-care', 'anti-aging', 'brightening'],

  // Masks
  'SKIN RESCUE OVERNIGHT CREAM MASK': ['hydration', 'anti-aging', 'sensitivity', 'page-hydration'],
  'HYDRO COOL MODELING MASK': ['hydration', 'sensitivity', 'page-hydration', 'page-sensitivity'],
  'SOOTHING BOMB SEA ALGAE MASK': ['hydration', 'sensitivity', 'page-sensitivity'],
  'PEPTIDE GEL MASK': ['hydration', 'sensitivity', 'anti-aging', 'page-anti-aging'],
  'EZ CO₂ MASK KIT': ['brightening', 'anti-aging', 'pore-care', 'page-pigmentation'],
  'BIO-FERMENT AGE DEFYING POWDER MASK': ['anti-aging', 'brightening', 'page-anti-aging'],
  'SKIN REBOOT PDRN MASK PACK': ['anti-aging', 'hydration', 'page-anti-aging'],

  // Sun Protection
  'ULTRA SHIELD SUN CREAM': ['sun-protection', 'sensitivity'],
  'MULTI SUN CREAM': ['sun-protection', 'sensitivity'],

  // BB Cushion (with SPF sun protection)
  'SKIN CARING BLEMISH BALM CUSHION': ['sun-protection', 'sensitivity', 'brightening'],
  'INTENSIVE BLEMISH BALM CREAM': ['sun-protection', 'sensitivity', 'brightening'],

  // PRO Solutions
  'POWER SOLUTION HES': ['hydration', 'anti-aging', 'page-hydration'],
  'POWER SOLUTION CVS': ['hydration', 'sensitivity', 'page-sensitivity'],
  'POWER SOLUTION CTS': ['anti-aging', 'scar-repair'],
  'POWER SOLUTION PCS': ['acne-blemishes', 'pore-care', 'page-acne'],
  'POWER SOLUTION SWS': ['brightening', 'page-pigmentation'],
  'POWER SOLUTION AWS': ['anti-aging', 'page-anti-aging'],

  // Devices
  'Microneedle Roller': ['anti-aging', 'acne-blemishes', 'page-acne', 'scar-repair'],
  'Needle Pen-K': ['anti-aging', 'acne-blemishes', 'page-acne', 'scar-repair'],
  'GENO-LED IR II': ['anti-aging', 'acne-blemishes', 'sensitivity', 'page-acne'],

  // Products without full curated entries — page-specific keys only
  'REVITA GLOW BLEMISH BALM CREAM [SPF 38 PA+++]': ['sun-protection', 'brightening', 'hydration', 'anti-aging'],
  'Bio Meso PDRN Ampoule 60000': ['anti-aging', 'hydration', 'brightening', 'page-anti-aging'],
  'SENSITIVE SKIN BEAUTY BOX': ['sensitivity', 'hydration', 'page-sensitivity'],
}

// GENOSYS Product-to-SkinType mapping
const GENOSYS_PRODUCT_SKIN_TYPES: Record<string, string[]> = {
  // For DRY skin
  'MOISTURE REPLENISHING HYALURON SERUM': ['dry', 'normal'],
  'MOISTURE REPLENISHING HYALURON CREAM': ['dry', 'normal'],
  'INTENSIVE HYDRO SOOTHING CREAM': ['dry', 'normal', 'sensitive'],
  
  // For OILY/COMBINATION skin
  'INTENSIVE PROBLEM CONTROL TONER': ['oily', 'combination'],
  'PROBLEM CONTROL SERUM': ['oily', 'combination'],
  'INTENSIVE PROBLEM CONTROL CREAM': ['oily', 'combination'],
  'POWER SOLUTION PCS': ['oily', 'combination'],
  
  // For SENSITIVE/DRY skin (combined)
  'ALL FOR SENSITIVE SERUM': ['sensitive', 'dry'],
  'SOOTHING REPAIR POSTCREAM': ['sensitive'],
  'SKIN BARRIER PROTECTING CREAM': ['sensitive', 'dry'],
  'SOOTHING BOMB SEA ALGAE MASK': ['sensitive'],
  
  // Universal products (all skin types)
  'SNOW O₂ CLEANSER': ['all'],
  'SNOW BOOSTER': ['all'],
  'MICROBIOME ENERGY INFUSING MIST': ['all'],
  'MULTI VITA RADIANCE SERUM': ['all'],
  'MULTI VITA RADIANCE CREAM': ['all'],
  'MULTI FUNCTIONAL ANTI-WRINKLE SERUM': ['all'],
  'MULTI FUNCTIONAL ANTI-WRINKLE CREAM': ['all'],
  'PEPTIDE GEL MASK': ['all'],
}

// Score weights for recommendation ranking — tuned for sharp, focused results
const SCORE_WEIGHTS = {
  genosysMapping: 40,       // Per matching concern in curated mapping
  exactSkinType: 30,        // Exact skin type match from curated mapping
  compatibleSkinType: 10,   // Compatible skin type
  concernMatch: 20,         // Per matching concern from DB field (fallback)
  ageGroupMatch: 5,         // Age group match
  highRating: 3,            // Products with 4.5+ rating
  universal: 5,             // Products marked as suitable for all skin types
}

const MAX_RECOMMENDATIONS = 4
const MIN_SCORE_THRESHOLD = 30

interface ScoredProduct extends Product {
  _score: number
  _matchedConcerns: string[]
}

export async function getSkinRecommendations(filters: {
  skinType?: string
  ageGroup?: string
  targetConcerns?: string[]
  // New: analysis metrics for smarter recommendations
  oilinessLevel?: number
  hydrationLevel?: number
  rednessLevel?: number
}): Promise<Product[]> {
  try {
    const { skinType, ageGroup, targetConcerns, oilinessLevel, hydrationLevel, rednessLevel } = filters
    
    debugLog('🔍 Fetching skin recommendations with filters:', { skinType, ageGroup, targetConcerns, oilinessLevel, hydrationLevel, rednessLevel })
    
    // Special handling for hair products
    if (targetConcerns && targetConcerns.includes('hair')) {
      debugLog('🔍 Hair category selected - returning hair products')
      
      const hairProducts = await prisma.product.findMany({
        where: {
          inStock: true,
          isHidden: false,
          targetConcerns: { contains: 'hair' }
        },
        include: { variants: true },
        orderBy: { rating: 'desc' },
        take: MAX_RECOMMENDATIONS
      })
      
      debugLog(`✅ Returning ${hairProducts.length} hair products (max ${MAX_RECOMMENDATIONS})`)
      return hairProducts
    }
    
    // Fetch ALL products with skin data for scoring
    // EXCLUDE hair/scalp products from face skin analysis recommendations
    const allProducts = await prisma.product.findMany({
      where: {
        inStock: true,
        isHidden: false,
        OR: [
          { skinType: { not: null } },
          { targetConcerns: { not: null } }
        ],
        AND: [
          { NOT: { targetConcerns: { contains: 'hair' } } },
          { NOT: { category: { contains: 'Hair' } } },
          { NOT: { category: { contains: 'hair' } } },
          { NOT: { category: { contains: 'Scalp' } } },
          { NOT: { category: { contains: 'scalp' } } },
          { NOT: { name: { contains: 'Hair ' } } },
          { NOT: { name: { contains: ' Hair' } } },
          { NOT: { name: { contains: 'Scalp' } } },
          { NOT: { name: { contains: 'Shampoo' } } },
          { NOT: { name: { contains: 'Hair Tonic' } } },
          { NOT: { name: { contains: 'Scalp Peeling' } } },
        ]
      },
      include: { variants: true }
    })
    
    debugLog(`📦 Found ${allProducts.length} products to score`)
    
    // Enhanced concerns based on analysis metrics
    const enhancedConcerns = [...(targetConcerns || [])]
    
    // Auto-add concerns based on analysis metrics
    if (oilinessLevel !== undefined) {
      if (oilinessLevel > 70 && !enhancedConcerns.includes('pore-care')) {
        enhancedConcerns.push('pore-care')
      }
      if (oilinessLevel < 30 && !enhancedConcerns.includes('hydration')) {
        enhancedConcerns.push('hydration')
      }
    }
    
    if (hydrationLevel !== undefined && hydrationLevel < 40) {
      if (!enhancedConcerns.includes('hydration')) {
        enhancedConcerns.push('hydration')
      }
    }
    
    if (rednessLevel !== undefined && rednessLevel > 50) {
      if (!enhancedConcerns.includes('sensitivity')) {
        enhancedConcerns.push('sensitivity')
      }
    }
    
    debugLog('📋 Enhanced concerns:', enhancedConcerns)
    
    // Score each product — only generic concern keys participate (page-* keys are excluded)
    const scoredProducts: ScoredProduct[] = allProducts.map(product => {
      let score = 0
      const matchedConcerns: string[] = []

      const curatedConcerns = GENOSYS_PRODUCT_CONCERNS[product.name]
      const curatedSkinTypes = GENOSYS_PRODUCT_SKIN_TYPES[product.name]

      // 1. Curated concern matching (cap at 2 matches to avoid generic products dominating)
      if (curatedConcerns && enhancedConcerns.length > 0) {
        let hits = 0
        for (const concern of enhancedConcerns) {
          if (hits >= 2) break
          if (curatedConcerns.includes(concern)) {
            score += SCORE_WEIGHTS.genosysMapping
            hits++
            if (!matchedConcerns.includes(concern)) matchedConcerns.push(concern)
          }
        }
      }

      // 2. Curated skin type matching
      if (curatedSkinTypes && skinType) {
        if (curatedSkinTypes.includes(skinType) || curatedSkinTypes.includes('all')) {
          score += SCORE_WEIGHTS.exactSkinType
        }
      }

      // 3. DB skin type fallback (only if not in curated list)
      if (!curatedSkinTypes && skinType && product.skinType) {
        if (product.skinType === skinType) {
          score += SCORE_WEIGHTS.exactSkinType
        } else if (SKIN_TYPE_COMPATIBILITY[skinType]?.includes(product.skinType)) {
          score += SCORE_WEIGHTS.compatibleSkinType
        }
      }

      if (product.skinType === 'all' || product.skinType === 'universal') {
        score += SCORE_WEIGHTS.universal
      }

      // 4. DB concern fallback (only if not in curated list, cap at 2)
      if (!curatedConcerns && enhancedConcerns.length > 0 && product.targetConcerns) {
        const productConcerns = parseJsonArray(product.targetConcerns)
        let hits = 0
        for (const concern of enhancedConcerns) {
          if (hits >= 2) break
          if (productConcerns.includes(concern)) {
            score += SCORE_WEIGHTS.concernMatch
            hits++
            if (!matchedConcerns.includes(concern)) matchedConcerns.push(concern)
          }
        }
      }

      // 5. Age group
      if (ageGroup && product.ageGroup) {
        if (product.ageGroup === ageGroup || product.ageGroup === 'all') {
          score += SCORE_WEIGHTS.ageGroupMatch
        }
      }

      // 6. Rating bonus
      if (product.rating && product.rating >= 4.5) {
        score += SCORE_WEIGHTS.highRating
      }

      return { ...product, _score: score, _matchedConcerns: matchedConcerns }
    })
    
    // Filter above minimum threshold and sort by score
    const recommendedProducts = scoredProducts
      .filter(p => p._score >= MIN_SCORE_THRESHOLD)
      .sort((a, b) => {
        if (b._score !== a._score) return b._score - a._score
        if (b._matchedConcerns.length !== a._matchedConcerns.length) {
          return b._matchedConcerns.length - a._matchedConcerns.length
        }
        return (b.rating || 0) - (a.rating || 0)
      })

    debugLog(`✅ Found ${recommendedProducts.length} products above threshold (${MIN_SCORE_THRESHOLD})`)
    debugLog(`🏆 Top ${MAX_RECOMMENDATIONS}:`, recommendedProducts.slice(0, MAX_RECOMMENDATIONS).map(p => ({
      name: p.name,
      score: p._score,
      matchedConcerns: p._matchedConcerns,
    })))

    if (recommendedProducts.length === 0) {
      debugLog(`🔄 No matches above threshold, returning top-rated (max ${MAX_RECOMMENDATIONS})`)
      return allProducts
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, MAX_RECOMMENDATIONS)
    }

    const topProducts = recommendedProducts.slice(0, MAX_RECOMMENDATIONS)
    debugLog(`📦 Returning ${topProducts.length} recommended products`)
    return topProducts.map(({ _score, _matchedConcerns, ...product }) => product)
  } catch (error) {
    errorLog('Error fetching skin recommendations:', error)
    throw new Error('Failed to fetch skin recommendations')
  }
}

// ─── SEO Landing Page Queries ──────────────────────────────────

/**
 * Parse a JSON array string safely, returning empty array on failure.
 * Handles both JSON arrays and comma-separated strings.
 */
function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch {
    // Try comma-separated fallback
    return value.split(',').map(s => s.trim()).filter(Boolean)
  }
}

/**
 * Get products matching specific skin concerns.
 * Used by /products/concern/[slug] SEO landing pages.
 * 
 * Matches via three strategies:
 * 1. Product's targetConcerns database field
 * 2. GENOSYS curated concern mappings (GENOSYS_PRODUCT_CONCERNS)
 * 3. Category fallbacks (e.g., "sun" category for sun-protection concern)
 */
export async function getProductsByConcern(
  concernKeys: string[],
  categoryFallbacks: string[] = []
): Promise<Product[]> {
  try {
    const allProducts = await getAllProducts()
    
    return allProducts.filter(product => {
      // Strategy 1: Match by targetConcerns field in database
      const dbConcerns = parseJsonArray(product.targetConcerns)
      if (dbConcerns.some(c => concernKeys.includes(c))) return true
      
      // Strategy 2: Match by GENOSYS curated product-to-concern mapping
      const curatedConcerns = GENOSYS_PRODUCT_CONCERNS[product.name] || []
      if (curatedConcerns.some(c => concernKeys.includes(c))) return true
      
      // Strategy 3: Match by category fallback
      if (categoryFallbacks.length > 0) {
        const productCategory = (product.category || '').toLowerCase()
        if (categoryFallbacks.some(cat => productCategory === cat || productCategory.includes(cat))) {
          return true
        }
      }
      
      return false
    })
  } catch (error) {
    errorLog('Error fetching products by concern:', error)
    return []
  }
}

// Note: getProductsByCategory already exists at the top of this file (line ~64)
// It's used by both the admin API and the new SEO landing pages.

export async function getProductsByNumbers(productNumbers: string[]): Promise<Product[]> {
  if (productNumbers.length === 0) return []
  try {
    const allProducts = await getAllProducts()
    return allProducts.filter(p =>
      (p.productNumber && productNumbers.includes(String(p.productNumber))) ||
      productNumbers.includes(String(p.id))
    )
  } catch (error) {
    errorLog('Error fetching products by numbers:', error)
    return []
  }
}

