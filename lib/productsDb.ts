import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from './prisma'
import { Prisma } from '@prisma/client'
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
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
    errorLog('Error searching products:', error)
    throw new Error('Failed to search products')
  }
}

export async function getSkinRecommendations(filters: {
  skinType?: string
  ageGroup?: string
  targetConcerns?: string[]
}): Promise<Product[]> {
  try {
    const { skinType, ageGroup, targetConcerns } = filters
    
    debugLog('🔍 Fetching skin recommendations with filters:', { skinType, ageGroup, targetConcerns })
    
    // Special handling for hair products - return them regardless of other filters
    if (targetConcerns && targetConcerns.includes('hair')) {
      debugLog('🔍 Hair category selected - returning hair products')
      
      const hairProducts = await prisma.product.findMany({
        where: {
          inStock: true,
          isHidden: false, // Filter at database level
          targetConcerns: {
            contains: 'hair'
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
      
      debugLog(`✅ Returning ${hairProducts.length} hair products`)
      return hairProducts // No need to filter again since we filtered at DB level
    }
    
    // Build where clause for database query with proper typing
    // Using Prisma.ProductWhereInput ensures type safety while allowing dynamic field assignment
    const whereClause: Prisma.ProductWhereInput = {
      inStock: true,
      isHidden: false, // Filter hidden products at database level
      skinType: { not: null } // Only products with skin type data
    }
    
    // Add skin type filter
    if (skinType) {
      whereClause.skinType = skinType
    }
    
    // Add age group filter
    if (ageGroup) {
      whereClause.ageGroup = ageGroup
    }
    
    // Add target concerns filter
    if (targetConcerns && targetConcerns.length > 0) {
      // Create OR conditions for each target concern
      whereClause.OR = targetConcerns.map(concern => ({
        targetConcerns: {
          contains: concern
        }
      }))
    }
    
    debugLog('🔍 Database query where clause:', JSON.stringify(whereClause, null, 2))
    
    // Query products from database
    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc'
      }
    })
    
    debugLog(`✅ Found ${products.length} products matching criteria`)
    
    // If no products found with exact matches, try more flexible matching
    if (products.length === 0) {
      debugLog('🔄 No exact matches found, trying flexible matching...')
      
      // Try without age group filter
      if (ageGroup) {
        const flexibleWhere: Prisma.ProductWhereInput = { ...whereClause }
        delete flexibleWhere.ageGroup
        
        const flexibleProducts = await prisma.product.findMany({
          where: flexibleWhere,
          orderBy: {
            name: 'asc'
          }
        })
        
        if (flexibleProducts.length > 0) {
          debugLog(`✅ Found ${flexibleProducts.length} products with flexible matching`)
          return flexibleProducts // Already filtered at DB level
        }
      }
      
      // If still no products, return all products with skin type data
      debugLog('🔄 No flexible matches found, returning all products with skin data')
      const allProductsWithSkinData = await prisma.product.findMany({
        where: {
          inStock: true,
          isHidden: false, // Filter at database level
          skinType: { not: null }
        },
        orderBy: {
          name: 'asc'
        }
      })
      
      return allProductsWithSkinData // Already filtered at DB level
    }
    
    return products
  } catch {
    errorLog('Error fetching skin recommendations:', error)
    throw new Error('Failed to fetch skin recommendations')
  }
}

