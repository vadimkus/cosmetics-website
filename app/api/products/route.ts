import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, getProductsByCategory } from '@/lib/productsDb'
import { debugLog } from '@/lib/logger'
import { handleApiError } from '@/lib/apiErrorHandler'
import { generateBatchEnhancedProductData } from '@/lib/pricingEngine'
import { prisma } from '@/lib/prisma'
import { ApiUser } from '@/types/user'

// Force revalidation every 60 seconds
export const revalidate = 60

export async function GET(request: NextRequest) {
  try {
    debugLog('📦 Fetching enhanced products from DATABASE')
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const enhanced = searchParams.get('enhanced') === 'true' // Optional enhancement
    const userId = searchParams.get('userId') // Optional user context
    
    let products
    
    if (category) {
      debugLog('📦 Fetching products by category:', category)
      products = await getProductsByCategory(category)
    } else {
      debugLog('📦 Fetching all products')
      products = await getAllProducts()
    }
    
    debugLog('✅ Retrieved', products.length, 'products from DATABASE')
    
    // If enhanced mode is requested, apply pricing engine
    if (enhanced) {
      debugLog('🚀 Applying pricing engine enhancements')
      
      // Get user context if provided
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
        } catch (error) {
          debugLog('Failed to load user context:', error)
        }
      }
      
      // Generate enhanced product data
      const enhancedProducts = generateBatchEnhancedProductData(products, user)
      
      const response = NextResponse.json({
        success: true,
        data: enhancedProducts,
        meta: {
          count: enhancedProducts.length,
          enhanced: true,
          userContext: user ? 'authenticated' : 'anonymous',
          category: category || 'all'
        }
      })
      
      // Add caching headers (shorter cache for enhanced data)
      response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
      response.headers.set('CDN-Cache-Control', 'public, s-maxage=60')
      response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=60')
      
      return response
    }
    
    // Return standard products (backward compatibility)
    const response = NextResponse.json(products)
    
    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=60')
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=60')
    
    return response
  } catch (error) {
    return handleApiError(error, 'GET /api/products')
  }
}
