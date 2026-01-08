import { NextRequest, NextResponse } from 'next/server'
import { getSkinRecommendations } from '@/lib/productsDb'
import { debugLog, errorLog } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const skinType = searchParams.get('skinType')
    const ageGroup = searchParams.get('ageGroup')
    const targetConcerns = searchParams.get('targetConcerns')?.split(',').filter(Boolean) || []
    
    // New: analysis metrics for smarter recommendations
    // Parse and validate numeric parameters with safe defaults
    const parseLevel = (value: string | null): number | undefined => {
      if (!value) return undefined
      const parsed = parseInt(value, 10)
      return Number.isNaN(parsed) ? undefined : Math.min(Math.max(parsed, 0), 100)
    }
    const oilinessLevel = parseLevel(searchParams.get('oilinessLevel'))
    const hydrationLevel = parseLevel(searchParams.get('hydrationLevel'))
    const rednessLevel = parseLevel(searchParams.get('rednessLevel'))
    
    debugLog('🔍 Fetching skin recommendations:', { skinType, ageGroup, targetConcerns, oilinessLevel, hydrationLevel, rednessLevel })
    
    // Use the scoring-based recommendations function
    const products = await getSkinRecommendations({
      ...(skinType && { skinType }),
      ...(ageGroup && { ageGroup }),
      ...(targetConcerns.length > 0 && { targetConcerns }),
      ...(oilinessLevel !== undefined && { oilinessLevel }),
      ...(hydrationLevel !== undefined && { hydrationLevel }),
      ...(rednessLevel !== undefined && { rednessLevel })
    })
    
    debugLog('✅ Found', products.length, 'recommended products (scored & ranked)')
    
    const response = NextResponse.json(products)
    
    // Add caching headers (shorter cache for personalized results)
    response.headers.set('Cache-Control', 'private, max-age=300')
    
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
    const { skinType, ageGroup, targetConcerns, oilinessLevel, hydrationLevel, rednessLevel } = body
    
    debugLog('🔍 Fetching skin recommendations via POST:', { skinType, ageGroup, targetConcerns, oilinessLevel, hydrationLevel, rednessLevel })
    
    // Use the scoring-based recommendations function
    const products = await getSkinRecommendations({
      ...(skinType && { skinType }),
      ...(ageGroup && { ageGroup }),
      ...(targetConcerns && targetConcerns.length > 0 && { targetConcerns }),
      ...(oilinessLevel !== undefined && { oilinessLevel }),
      ...(hydrationLevel !== undefined && { hydrationLevel }),
      ...(rednessLevel !== undefined && { rednessLevel })
    })
    
    debugLog('✅ Found', products.length, 'recommended products (scored & ranked)')
    
    return NextResponse.json(products)
  } catch (error) {
    errorLog('Error fetching skin recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skin recommendations' },
      { status: 500 }
    )
  }
}
