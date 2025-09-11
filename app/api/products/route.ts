import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/products'

export async function GET(request: NextRequest) {
  try {
    console.log('📦 Fetching products from JSON storage')
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    let filteredProducts = products
    
    if (category) {
      console.log('📦 Filtering products by category:', category)
      filteredProducts = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    }
    
    console.log('✅ Retrieved', filteredProducts.length, 'products from JSON storage')
    
    const response = NextResponse.json(filteredProducts)
    
    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600')
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=3600')
    
    return response
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
