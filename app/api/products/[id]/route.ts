import { NextRequest, NextResponse } from 'next/server'
import { getProductById } from '@/lib/productsDb'
import { errorLog, debugLog } from '@/lib/logger'
import { generateEnhancedProductData } from '@/lib/pricingEngine'
import { prisma } from '@/lib/prisma'
import { ApiUser } from '@/types/user'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const enhanced = searchParams.get('enhanced') === 'true'
    const userId = searchParams.get('userId')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    const product = await getProductById(id)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // If enhanced mode is requested, apply pricing engine
    if (enhanced) {
      debugLog('🚀 Generating enhanced product data for:', id)
      
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
        } catch {
          debugLog('Failed to load user context:', error)
        }
      }
      
      // Generate enhanced product data
      const enhancedProduct = generateEnhancedProductData(product, user)
      
      const response = NextResponse.json({
        success: true,
        data: enhancedProduct,
        meta: {
          enhanced: true,
          userContext: user ? 'authenticated' : 'anonymous'
        }
      })
      
      // Shorter cache for enhanced data
      response.headers.set('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      
      return response
    }
    
    // Return standard product (backward compatibility)
    const response = NextResponse.json(product)
    
    // Temporarily disable caching for immediate updates
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch {
    errorLog('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
