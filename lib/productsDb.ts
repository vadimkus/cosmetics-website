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

// Score weights for recommendation ranking
const SCORE_WEIGHTS = {
  exactSkinType: 30,        // Exact skin type match
  compatibleSkinType: 15,   // Compatible skin type
  concernMatch: 20,         // Per matching concern
  ageGroupMatch: 10,        // Age group match
  highRating: 5,            // Products with 4.5+ rating
  universal: 5              // Products marked as suitable for all skin types
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
    // EXCLUDE hair products from face skin analysis recommendations
    const allProducts = await prisma.product.findMany({
      where: {
        inStock: true,
        isHidden: false,
        OR: [
          { skinType: { not: null } },
          { targetConcerns: { not: null } }
        ],
        // Exclude hair care products - these are for face skin analysis
        NOT: {
          OR: [
            { targetConcerns: { contains: 'hair' } },
            { category: { contains: 'Hair' } },
            { category: { contains: 'hair' } },
            { name: { contains: 'Hair' } },
            { name: { contains: 'Scalp' } }
          ]
        }
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
    
    // Score each product
    const scoredProducts: ScoredProduct[] = allProducts.map(product => {
      let score = 0
      const matchedConcerns: string[] = []
      
      // 1. Skin type scoring
      if (skinType && product.skinType) {
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
      
      // 2. Target concerns scoring - most important factor
      if (enhancedConcerns.length > 0 && product.targetConcerns) {
        try {
          const productConcerns = JSON.parse(product.targetConcerns) as string[]
          for (const concern of enhancedConcerns) {
            if (productConcerns.includes(concern)) {
              score += SCORE_WEIGHTS.concernMatch
              matchedConcerns.push(concern)
            }
          }
        } catch {
          // If targetConcerns is a comma-separated string
          const productConcerns = product.targetConcerns.split(',').map(c => c.trim())
          for (const concern of enhancedConcerns) {
            if (productConcerns.includes(concern)) {
              score += SCORE_WEIGHTS.concernMatch
              matchedConcerns.push(concern)
            }
          }
        }
      }
      
      // 3. Age group scoring
      if (ageGroup && product.ageGroup) {
        if (product.ageGroup === ageGroup || product.ageGroup === 'all') {
          score += SCORE_WEIGHTS.ageGroupMatch
        }
      }
      
      // 4. Rating bonus
      if (product.rating && product.rating >= 4.5) {
        score += SCORE_WEIGHTS.highRating
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

