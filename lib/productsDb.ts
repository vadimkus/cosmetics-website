import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from './prisma'

export interface Product {
  id: string
  productNumber?: string | null
  name: string
  price: number
  description: string
  image: string
  images: string | null // JSON array of all images
  category: string
  inStock: boolean
  size?: string | null
  noDiscount?: boolean
  // Detailed product content
  productDetails?: string | null // JSON object with key-value pairs
  keyFeatures?: string | null // JSON array of features
  benefits?: string | null // JSON array of benefits
  ingredients?: string | null // JSON array of ingredients
  howToUse?: string | null // Usage instructions
  directions?: string | null // Detailed directions
  // Skin recommendation fields
  skinType?: string | null
  targetConcerns?: string | null // JSON array of concerns
  usage?: string | null
  ageGroup?: string | null
  rating?: number | null // Product rating out of 5
}

/**
 * Check if a product should be hidden
 * @param product - The product to check
 * @returns true if product should be hidden
 */
function shouldHideInProduction(product: Product): boolean {
  // Hide product ID 2 or productNumber 2 (hidden in all environments)
  return product.id === '2' || product.productNumber === '2'
}

/**
 * Filter out products that should be hidden in production
 * @param products - Array of products to filter
 * @returns Filtered array of products
 */
function filterHiddenProducts(products: Product[]): Product[] {
  return products.filter(product => !shouldHideInProduction(product))
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return filterHiddenProducts(products)
  } catch (error) {
    errorLog('Error fetching products from database:', error)
    throw new Error('Failed to fetch products')
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
    
    // Hide product 2 in production
    if (product && shouldHideInProduction(product)) {
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
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    return filterHiddenProducts(products)
  } catch (error) {
    errorLog('Error fetching products by category:', error)
    throw new Error('Failed to fetch products by category')
  }
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  try {
    const product = await prisma.product.create({
      data: productData
    })
    return product
  } catch (error) {
    errorLog('Error adding product:', error)
    throw new Error('Failed to add product')
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: updates
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
    return filterHiddenProducts(products)
  } catch (error) {
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
          targetConcerns: {
            contains: 'hair'
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
      
      debugLog(`✅ Returning ${hairProducts.length} hair products`)
      return filterHiddenProducts(hairProducts)
    }
    
    // Build where clause for database query
    const whereClause: any = {
      inStock: true,
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
    
    // Filter hidden products
    const filteredProducts = filterHiddenProducts(products)
    
    // If no products found with exact matches, try more flexible matching
    if (filteredProducts.length === 0) {
      debugLog('🔄 No exact matches found, trying flexible matching...')
      
      // Try without age group filter
      if (ageGroup) {
        const flexibleWhere = { ...whereClause }
        delete flexibleWhere.ageGroup
        
        const flexibleProducts = await prisma.product.findMany({
          where: flexibleWhere,
          orderBy: {
            name: 'asc'
          }
        })
        
        if (flexibleProducts.length > 0) {
          debugLog(`✅ Found ${flexibleProducts.length} products with flexible matching`)
          return filterHiddenProducts(flexibleProducts)
        }
      }
      
      // If still no products, return all products with skin type data
      debugLog('🔄 No flexible matches found, returning all products with skin data')
      const allProductsWithSkinData = await prisma.product.findMany({
        where: {
          inStock: true,
          skinType: { not: null }
        },
        orderBy: {
          name: 'asc'
        }
      })
      
      return filterHiddenProducts(allProductsWithSkinData)
    }
    
    return filteredProducts
  } catch (error) {
    errorLog('Error fetching skin recommendations:', error)
    throw new Error('Failed to fetch skin recommendations')
  }
}

