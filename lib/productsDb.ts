import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from './prisma'
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
  try {
    const products = await prisma.product.findMany({
      where: {
        isHidden: false // Filter at database level for better performance
      },
      orderBy: {
        name: 'asc'
      }
    })
    return products // No need to filter again since we filtered at DB level
  } catch (error) {
    errorLog('Error fetching products from database:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    errorLog('Error details:', { message: errorMessage, stack: errorStack })
    throw new Error(`Failed to fetch products: ${errorMessage}`)
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    // First try to find by UUID (primary key)
    let product = await prisma.product.findUnique({
      where: { id }
    })
    
    // If not found by UUID, try to find by productNumber
    if (!product) {
      product = await prisma.product.findUnique({
        where: { productNumber: id }
      })
    }
    
    // Hide product if isHidden flag is set
    if (product && shouldHideProduct(product)) {
      return null
    }
    
    return product
  } catch (error) {
    errorLog('Error fetching product by ID:', error)
    throw new Error('Failed to fetch product')
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { 
        category: {
          contains: category
        },
        isHidden: false // Filter at database level
      },
      orderBy: {
        name: 'asc'
      }
    })
    return products // No need to filter again since we filtered at DB level
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
        isHidden: false, // Filter at database level
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { category: { contains: query } }
        ]
      },
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
const GENOSYS_PRODUCT_CONCERNS: Record<string, string[]> = {
  // Cleansers
  'SNOW O₂ CLEANSER': ['hydration', 'brightening', 'sensitivity'],
  'SKIN DEFENDER LIP & EYE MAKEUP REMOVER': ['eye-care', 'sensitivity'],
  
  // Peelings
  'EPI TURNOVER BOOSTING PEELING GEL': ['brightening', 'anti-aging', 'pore-care'],
  'SKIN RENEWAL PEELING SYSTEM': ['brightening', 'anti-aging', 'pore-care'],
  
  // Toners/Mists
  'MICROBIOME ENERGY INFUSING MIST': ['hydration', 'sensitivity'],
  'INTENSIVE PROBLEM CONTROL TONER': ['acne-blemishes', 'pore-care'],
  'SNOW BOOSTER': ['hydration', 'sensitivity'],
  
  // Serums
  'EyeCell EYE CONTOUR SERUM': ['eye-care', 'anti-aging', 'brightening'],
  'MOISTURE REPLENISHING HYALURON SERUM': ['hydration'],
  'ALL FOR SENSITIVE SERUM': ['sensitivity', 'hydration'],
  'PROBLEM CONTROL SERUM': ['acne-blemishes', 'pore-care'],
  'MULTI VITA RADIANCE SERUM': ['brightening', 'anti-aging'],
  'MULTI FUNCTIONAL ANTI-WRINKLE SERUM': ['anti-aging'],
  
  // Creams
  'ND Cell ANTI-WRINKLE CREAM': ['anti-aging'],
  'EyeCell EYE CONTOUR CREAM': ['eye-care', 'anti-aging', 'brightening'],
  'SOOTHING REPAIR POSTCREAM': ['sensitivity', 'hydration'],
  'EGF REPAIR OXYMASK CREAM': ['sensitivity', 'anti-aging'],
  'SKIN BARRIER PROTECTING CREAM': ['sensitivity', 'hydration'],
  'INTENSIVE HYDRO SOOTHING CREAM': ['hydration', 'sensitivity'],
  'MOISTURE REPLENISHING HYALURON CREAM': ['hydration'],
  'INTENSIVE PROBLEM CONTROL CREAM': ['acne-blemishes', 'pore-care'],
  'MULTI VITA RADIANCE CREAM': ['brightening', 'anti-aging'],
  'MULTI FUNCTIONAL ANTI-WRINKLE CREAM': ['anti-aging'],
  
  // Eye Care
  'EyeCell EYE PEPTIDE GEL PATCH': ['eye-care', 'anti-aging', 'hydration'],
  'EyeCell EYE ZONE CARE KIT': ['eye-care', 'anti-aging', 'brightening'],
  
  // Masks
  'SKIN RESCUE OVERNIGHT CREAM MASK': ['hydration', 'anti-aging', 'sensitivity'],
  'HYDRO COOL MODELING MASK': ['hydration', 'sensitivity'],
  'SOOTHING BOMB SEA ALGAE MASK': ['hydration', 'sensitivity'],
  'PEPTIDE GEL MASK': ['hydration', 'sensitivity', 'anti-aging'],
  'EZ CO₂ MASK KIT': ['brightening', 'anti-aging', 'pore-care'],
  'BIO-FERMENT AGE DEFYING POWDER MASK': ['anti-aging', 'brightening'],
  'SKIN REBOOT PDRN MASK PACK': ['anti-aging', 'hydration'],
  
  // Sun Protection
  'ULTRA SHIELD SUN CREAM': ['sensitivity'],
  'MULTI SUN CREAM': ['sensitivity'],
  
  // BB Cushion
  'SKIN CARING BLEMISH BALM CUSHION': ['sensitivity', 'brightening'],
  'INTENSIVE BLEMISH BALM CREAM': ['sensitivity', 'brightening'],
  
  // PRO Solutions (for microneedling - higher tier recommendations)
  'POWER SOLUTION HES': ['hydration', 'anti-aging'],
  'POWER SOLUTION CVS': ['hydration', 'sensitivity'],
  'POWER SOLUTION CTS': ['anti-aging'],
  'POWER SOLUTION PCS': ['acne-blemishes', 'pore-care'],
  'POWER SOLUTION SWS': ['brightening'],
  'POWER SOLUTION AWS': ['anti-aging'],
  
  // Devices (recommend for severe concerns only)
  'Microneedle Roller': ['anti-aging', 'acne-blemishes'],
  'Needle Pen-K': ['anti-aging', 'acne-blemishes'],
  'GENO-LED IR II': ['anti-aging', 'acne-blemishes', 'sensitivity'],
}

// GENOSYS Product-to-SkinType mapping
const GENOSYS_PRODUCT_SKIN_TYPES: Record<string, string[]> = {
  // For DRY skin
  'MOISTURE REPLENISHING HYALURON SERUM': ['dry', 'normal'],
  'MOISTURE REPLENISHING HYALURON CREAM': ['dry', 'normal'],
  'SKIN BARRIER PROTECTING CREAM': ['dry', 'sensitive'],
  'INTENSIVE HYDRO SOOTHING CREAM': ['dry', 'normal', 'sensitive'],
  
  // For OILY/COMBINATION skin
  'INTENSIVE PROBLEM CONTROL TONER': ['oily', 'combination'],
  'PROBLEM CONTROL SERUM': ['oily', 'combination'],
  'INTENSIVE PROBLEM CONTROL CREAM': ['oily', 'combination'],
  'POWER SOLUTION PCS': ['oily', 'combination'],
  
  // For SENSITIVE skin
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

// Score weights for recommendation ranking - adjusted for sharper recommendations
const SCORE_WEIGHTS = {
  exactSkinType: 40,        // Exact skin type match (increased)
  compatibleSkinType: 15,   // Compatible skin type
  concernMatch: 35,         // Per matching concern (increased significantly)
  ageGroupMatch: 10,        // Age group match
  highRating: 5,            // Products with 4.5+ rating
  universal: 10,            // Products marked as suitable for all skin types
  genosysMapping: 50,       // Bonus for products in our curated mapping
}

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
        orderBy: { rating: 'desc' }
      })
      
      debugLog(`✅ Returning ${hairProducts.length} hair products`)
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
        // Exclude hair/scalp care products - these are for face skin analysis only
        AND: [
          { NOT: { targetConcerns: { contains: 'hair' } } },
          { NOT: { category: { contains: 'Hair' } } },
          { NOT: { category: { contains: 'hair' } } },
          { NOT: { category: { contains: 'Scalp' } } },
          { NOT: { category: { contains: 'scalp' } } },
          { NOT: { name: { contains: 'Hair ' } } },       // "Hair " with space to avoid matching "Chair" etc
          { NOT: { name: { contains: ' Hair' } } },       // " Hair" with space
          { NOT: { name: { contains: 'Scalp' } } },
          { NOT: { name: { contains: 'Shampoo' } } },
          { NOT: { name: { contains: 'Hair Tonic' } } },
          { NOT: { name: { contains: 'Scalp Peeling' } } },
        ]
      }
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
    
    // Score each product using our curated GENOSYS mappings + database fields
    const scoredProducts: ScoredProduct[] = allProducts.map(product => {
      let score = 0
      const matchedConcerns: string[] = []
      
      // Check if product is in our curated GENOSYS mapping (highest priority)
      const curatedConcerns = GENOSYS_PRODUCT_CONCERNS[product.name]
      const curatedSkinTypes = GENOSYS_PRODUCT_SKIN_TYPES[product.name]
      
      // 1. GENOSYS Curated Concerns Matching (highest weight)
      if (curatedConcerns && enhancedConcerns.length > 0) {
        for (const concern of enhancedConcerns) {
          if (curatedConcerns.includes(concern)) {
            score += SCORE_WEIGHTS.genosysMapping
            if (!matchedConcerns.includes(concern)) {
              matchedConcerns.push(concern)
            }
          }
        }
      }
      
      // 2. GENOSYS Curated Skin Type Matching
      if (curatedSkinTypes && skinType) {
        if (curatedSkinTypes.includes(skinType) || curatedSkinTypes.includes('all')) {
          score += SCORE_WEIGHTS.exactSkinType
        }
      }
      
      // 3. Database skin type scoring (fallback for products not in curated list)
      if (!curatedSkinTypes && skinType && product.skinType) {
        if (product.skinType === skinType) {
          score += SCORE_WEIGHTS.exactSkinType
        } else if (SKIN_TYPE_COMPATIBILITY[skinType]?.includes(product.skinType)) {
          score += SCORE_WEIGHTS.compatibleSkinType
        }
      }
      
      // Universal products (work for all skin types)
      if (product.skinType === 'all' || product.skinType === 'universal') {
        score += SCORE_WEIGHTS.universal
      }
      
      // 4. Database target concerns scoring (additional matching)
      if (!curatedConcerns && enhancedConcerns.length > 0 && product.targetConcerns) {
        try {
          const productConcerns = JSON.parse(product.targetConcerns) as string[]
          for (const concern of enhancedConcerns) {
            if (productConcerns.includes(concern)) {
              score += SCORE_WEIGHTS.concernMatch
              if (!matchedConcerns.includes(concern)) {
                matchedConcerns.push(concern)
              }
            }
          }
        } catch {
          // If targetConcerns is a comma-separated string
          const productConcerns = product.targetConcerns.split(',').map(c => c.trim())
          for (const concern of enhancedConcerns) {
            if (productConcerns.includes(concern)) {
              score += SCORE_WEIGHTS.concernMatch
              if (!matchedConcerns.includes(concern)) {
                matchedConcerns.push(concern)
              }
            }
          }
        }
      }
      
      // 5. Age group scoring
      if (ageGroup && product.ageGroup) {
        if (product.ageGroup === ageGroup || product.ageGroup === 'all') {
          score += SCORE_WEIGHTS.ageGroupMatch
        }
      }
      
      // 6. Rating bonus
      if (product.rating && product.rating >= 4.5) {
        score += SCORE_WEIGHTS.highRating
      }
      
      // 7. Category-based bonuses for concern matching
      // Anti-aging concerns should prioritize serums and creams
      if (enhancedConcerns.includes('anti-aging')) {
        if (product.category === 'Serum' || product.category === 'Cream') {
          score += 15
        }
      }
      
      // Hydration concerns should prioritize serums, creams, and masks
      if (enhancedConcerns.includes('hydration')) {
        if (product.category === 'Serum' || product.category === 'Cream' || product.category === 'Mask') {
          score += 15
        }
      }
      
      // Acne concerns should prioritize toners and serums
      if (enhancedConcerns.includes('acne-blemishes') || enhancedConcerns.includes('pore-care')) {
        if (product.category === 'Toner/Mist' || product.category === 'Serum') {
          score += 15
        }
      }
      
      // Eye care should heavily prioritize Eye care category
      if (enhancedConcerns.includes('eye-care')) {
        if (product.category === 'Eye care') {
          score += 30
        }
      }
      
      // Brightening should prioritize serums and masks
      if (enhancedConcerns.includes('brightening')) {
        if (product.category === 'Serum' || product.category === 'Mask' || product.category === 'Peeling') {
          score += 15
        }
      }
      
      return {
        ...product,
        _score: score,
        _matchedConcerns: matchedConcerns
      }
    })
    
    // Filter products with score > 0 and sort by score (highest first)
    const recommendedProducts = scoredProducts
      .filter(p => p._score > 0)
      .sort((a, b) => {
        // Primary: score
        if (b._score !== a._score) return b._score - a._score
        // Secondary: number of matched concerns
        if (b._matchedConcerns.length !== a._matchedConcerns.length) {
          return b._matchedConcerns.length - a._matchedConcerns.length
        }
        // Tertiary: rating
        return (b.rating || 0) - (a.rating || 0)
      })
    
    debugLog(`✅ Found ${recommendedProducts.length} scored products`)
    debugLog('🏆 Top 5 products:', recommendedProducts.slice(0, 5).map(p => ({
      name: p.name,
      score: p._score,
      matchedConcerns: p._matchedConcerns,
      skinType: p.skinType
    })))
    
    // If no products with score > 0, return top-rated products as fallback
    if (recommendedProducts.length === 0) {
      debugLog('🔄 No scored matches, returning top-rated products')
      return allProducts
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 20)
    }
    
    // Remove internal scoring fields before returning
    return recommendedProducts.map(({ _score, _matchedConcerns, ...product }) => product)
  } catch (error) {
    errorLog('Error fetching skin recommendations:', error)
    throw new Error('Failed to fetch skin recommendations')
  }
}

