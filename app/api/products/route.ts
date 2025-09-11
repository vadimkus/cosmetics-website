import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, getProductsByCategory } from '@/lib/productsDb'
import { products as fallbackProducts } from '@/lib/products'

export async function GET(request: NextRequest) {
  try {
    console.log('📦 Fetching products from DATABASE')
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    let products
    
    try {
      if (category) {
        console.log('📦 Fetching products by category:', category)
        products = await getProductsByCategory(category)
      } else {
        console.log('📦 Fetching all products')
        products = await getAllProducts()
      }
      
      // If database is empty, use fallback data
      if (products.length === 0) {
        console.log('⚠️ Database is empty, using fallback products')
        if (category) {
          products = fallbackProducts.filter(p => p.category === category)
        } else {
          products = fallbackProducts
        }
      }
      
      console.log('✅ Retrieved', products.length, 'products')
    } catch (dbError) {
      console.error('Database error, using fallback:', dbError)
      // Fallback to static data if database fails
      if (category) {
        products = fallbackProducts.filter(p => p.category === category)
      } else {
        products = fallbackProducts
      }
      console.log('✅ Retrieved', products.length, 'products from fallback')
    }
    
    const response = NextResponse.json(products)
    
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
