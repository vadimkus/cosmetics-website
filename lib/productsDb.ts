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
  // Skin recommendation fields
  skinType?: string | null
  targetConcerns?: string | null // JSON array of concerns
  usage?: string | null
  ageGroup?: string | null
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return products
  } catch (error) {
    console.error('Error fetching products from database:', error)
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
    
    return product
  } catch (error) {
    console.error('Error fetching product by ID:', error)
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
    return products
  } catch (error) {
    console.error('Error fetching products by category:', error)
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
    console.error('Error adding product:', error)
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
    console.error('Error updating product:', error)
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
    console.error('Error deleting product:', error)
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
    return products
  } catch (error) {
    console.error('Error searching products:', error)
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
    
    // Get ALL products first
    const allProducts = await prisma.product.findMany({
      where: {
        inStock: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    console.log(`📦 Total products in database: ${allProducts.length}`)
    console.log(`🔍 Target concerns:`, targetConcerns)
    console.log(`🔍 Target concerns type:`, typeof targetConcerns)
    console.log(`🔍 Target concerns length:`, targetConcerns ? targetConcerns.length : 'null')
    console.log(`🔍 Checking if hair is in target concerns:`, targetConcerns && targetConcerns.includes('hair'))
    
    // Special handling for hair products - return them regardless of other filters
    if (targetConcerns && targetConcerns.includes('hair')) {
      console.log('🔍 Hair category selected - returning specific hair products by ID')
      
      // Return only the specific hair products by their IDs
      const hairProductIds = ['45', '43', '44', '46']
      
      const hairProducts = allProducts.filter(product => 
        hairProductIds.includes(product.id)
      )
      
      console.log(`✅ Returning ${hairProducts.length} specific hair products (ignoring all other filters)`)
      return hairProducts
    } else {
      console.log('❌ Hair condition not met - targetConcerns:', targetConcerns, 'includes hair:', targetConcerns ? targetConcerns.includes('hair') : false)
    }
    
    // Filter products based on description analysis
    const filteredProducts = allProducts.filter(product => {
      const productName = product.name.toLowerCase()
      const productDesc = product.description.toLowerCase()
      
      // Check if product matches skin type based on description
      const matchesSkinType = !skinType || checkSkinTypeMatch(productName, productDesc, skinType)
      
      // Check if product matches target concerns based on description
      const matchesTargetConcerns = !targetConcerns || targetConcerns.length === 0 || 
        checkTargetConcernsMatch(productName, productDesc, targetConcerns)
      
      // Check if product matches age group based on description
      const matchesAgeGroup = !ageGroup || checkAgeGroupMatch(productName, productDesc, ageGroup)
      
      return matchesSkinType && matchesTargetConcerns && matchesAgeGroup
    })
    
    console.log(`✅ Found ${filteredProducts.length} products matching criteria`)
    
    // If no products found, return all products as fallback
    if (filteredProducts.length === 0) {
      console.log('🔄 No products found with specific criteria, returning all products')
      return allProducts
    }
    
    return filteredProducts
  } catch (error) {
    console.error('Error fetching skin recommendations:', error)
    throw new Error('Failed to fetch skin recommendations')
  }
}

// Helper function to check skin type match based on product description
function checkSkinTypeMatch(productName: string, productDesc: string, skinType: string): boolean {
  const skinTypeKeywords: Record<string, string[]> = {
    'dry': ['dry', 'moisture', 'hydrat', 'nourish', 'rich', 'intensive', 'replenish', 'soothing'],
    'oily': ['oily', 'oil control', 'mattify', 'pore', 'blemish', 'acne', 'purify', 'deep clean'],
    'combination': ['combination', 'balance', 'normal', 'gentle', 'mild'],
    'normal': ['normal', 'balance', 'gentle', 'mild', 'daily', 'basic'],
    'sensitive': ['sensitive', 'soothing', 'calm', 'gentle', 'mild', 'repair', 'barrier']
  }
  
  const keywords = skinTypeKeywords[skinType] || []
  return keywords.some(keyword => productName.includes(keyword) || productDesc.includes(keyword))
}

// Helper function to check target concerns match based on product description
function checkTargetConcernsMatch(productName: string, productDesc: string, targetConcerns: string[]): boolean {
  const concernKeywords: Record<string, string[]> = {
    'anti-aging': ['anti-aging', 'wrinkle', 'firming', 'age', 'mature', 'rejuvenat', 'repair', 'renewal'],
    'acne-blemishes': ['acne', 'blemish', 'spot', 'pore', 'purify', 'clear', 'control', 'problem'],
    'hydration': ['hydrat', 'moisture', 'water', 'hyaluron', 'soothing', 'nourish', 'replenish'],
    'brightening': ['brighten', 'radiance', 'vitamin c', 'glow', 'luminous', 'even', 'tone'],
    'sensitivity': ['sensitive', 'soothing', 'calm', 'gentle', 'mild', 'repair', 'barrier', 'protect'],
    'pore-care': ['pore', 'purify', 'deep clean', 'clarify', 'refine', 'minimize'],
    'eye-care': ['eye', 'patch', 'gel', 'crow', 'feet', 'bag', 'contour', 'zone'],
    'hair': ['hair solution', 'hair tonic', 'scalp shampoo', 'matrix hair', 'hr matrix', 'hair-gentron', 'hairgen booster', 'hr³ matrix hair', 'hr3 matrix hair']
  }
  
  return targetConcerns.some(concern => {
    const keywords = concernKeywords[concern] || []
    return keywords.some(keyword => productName.includes(keyword) || productDesc.includes(keyword))
  })
}

// Helper function to check age group match based on product description
function checkAgeGroupMatch(productName: string, productDesc: string, ageGroup: string): boolean {
  const ageKeywords: Record<string, string[]> = {
    'teen': ['teen', 'young', 'acne', 'blemish', 'clear', 'gentle', 'mild'],
    'young-adult': ['young', 'adult', 'balance', 'daily', 'normal', 'gentle'],
    'adult': ['adult', 'mature', 'anti-aging', 'repair', 'renewal', 'firming'],
    'mature': ['mature', 'anti-aging', 'wrinkle', 'firming', 'repair', 'renewal', 'age']
  }
  
  const keywords = ageKeywords[ageGroup] || []
  return keywords.some(keyword => productName.includes(keyword) || productDesc.includes(keyword))
}
