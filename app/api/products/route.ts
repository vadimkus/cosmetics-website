import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, getProductsByCategory } from '@/lib/productsDb'

export async function GET(request: NextRequest) {
  try {
    console.log('📦 Fetching products from DATABASE')
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    let products
    
    if (category) {
      console.log('📦 Fetching products by category:', category)
      products = await getProductsByCategory(category)
    } else {
      console.log('📦 Fetching all products')
      products = await getAllProducts()
    }
    
    console.log('✅ Retrieved', products.length, 'products from DATABASE')
    
    const response = NextResponse.json(products)
    
    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600')
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=3600')
    
    return response
  } catch (error) {
    console.error('❌ Error fetching products:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    
    // Return a more detailed error response for debugging
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
