import { NextRequest, NextResponse } from 'next/server'
import { errorLog, debugLog } from '@/lib/logger'
import { MOBILE_CHECKOUT_CONFIG } from '@/lib/mobileCheckoutConfig'

/**
 * Mobile API Endpoint for Shipping Rates
 * GET /api/mobile/shipping-rates
 * 
 * Authentication: Requires x-api-key header matching MOBILE_APP_KEY
 * Returns: UAE shipping rates by emirate with VAT and free shipping threshold
 * 
 * ✅ FEATURES:
 * - Shipping costs per UAE emirate
 * - VAT rate (5%)
 * - Free shipping threshold
 * - Currency information (AED)
 * - Last updated timestamp
 */

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Security: Validate API Key
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.MOBILE_APP_KEY || 'genosys_secure_mobile_2025_v1'
    
    if (!apiKey || apiKey !== expectedKey) {
      debugLog('[MOBILE_API_SHIPPING] Unauthorized access attempt:', {
        providedKey: apiKey ? 'PROVIDED' : 'MISSING',
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      })
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid API key' 
        },
        { status: 401 }
      )
    }
    
    debugLog('[MOBILE_API_SHIPPING] Authenticated request - returning shipping rates')

    // Shipping rates configuration - shared with checkout endpoints
    const shippingData = MOBILE_CHECKOUT_CONFIG
    
    const totalDuration = Date.now() - startTime
    debugLog(`[MOBILE_API_SHIPPING] SUCCESS: Returned shipping rates in ${totalDuration}ms`)
    
    // Return shipping rates response
    return NextResponse.json({
      success: true,
      data: shippingData
    })
    
  } catch (error) {
    // Error Handling: Don't leak internal details
    const duration = Date.now() - startTime
    errorLog('[MOBILE_API_SHIPPING] Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error - Unable to fetch shipping rates' 
      },
      { status: 500 }
    )
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

