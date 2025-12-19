import { NextRequest, NextResponse } from 'next/server'
import { getSkinRecommendations } from '@/lib/productsDb'
import { debugLog, errorLog } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const skinType = searchParams.get('skinType')
    const ageGroup = searchParams.get('ageGroup')
    const targetConcerns = searchParams.get('targetConcerns')?.split(',') || []
    
    debugLog('🔍 Fetching skin recommendations:', { skinType, ageGroup, targetConcerns })
    
    // Use the proper skin recommendations function that handles hair products correctly
    const products = await getSkinRecommendations({
      ...(skinType && { skinType }),
      ...(ageGroup && { ageGroup }),
      ...(targetConcerns.length > 0 && { targetConcerns })
    })
    
    debugLog('✅ Found', products.length, 'recommended products')
    
    const response = NextResponse.json(products)
    
    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600')
    
    return response
  } catch (error) {
    errorLog('Error fetching skin recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skin recommendations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { skinType, ageGroup, targetConcerns } = body
    
    debugLog('🔍 Fetching skin recommendations via POST:', { skinType, ageGroup, targetConcerns })
    
    // Use the proper skin recommendations function that handles hair products correctly
    const products = await getSkinRecommendations({
      ...(skinType && { skinType }),
      ...(ageGroup && { ageGroup }),
      ...(targetConcerns && targetConcerns.length > 0 && { targetConcerns })
    })
    
    debugLog('✅ Found', products.length, 'recommended products')
    
    return NextResponse.json(products)
  } catch (error) {
    errorLog('Error fetching skin recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skin recommendations' },
      { status: 500 }
    )
  }
}
