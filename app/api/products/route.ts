import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, getProductsByCategory } from '@/lib/productsDb'
import { debugLog } from '@/lib/logger'
import { handleApiError } from '@/lib/apiErrorHandler'

export async function GET(request: NextRequest) {
  try {
    debugLog('📦 Fetching products from DATABASE')
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    let products
    
    if (category) {
      debugLog('📦 Fetching products by category:', category)
      products = await getProductsByCategory(category)
    } else {
      debugLog('📦 Fetching all products')
      products = await getAllProducts()
    }
    
    debugLog('✅ Retrieved', products.length, 'products from DATABASE')
    
    const response = NextResponse.json(products)
    
    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600')
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=3600')
    
    return response
  } catch (error) {
    return handleApiError(error, 'GET /api/products')
  }
}
