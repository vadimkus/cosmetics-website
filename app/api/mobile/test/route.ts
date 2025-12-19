import { NextRequest, NextResponse } from 'next/server'
import { debugLog } from '@/lib/logger'

/**
 * Mobile API Test Endpoint
 * GET /api/mobile/test
 * 
 * Purpose: Test mobile API authentication and configuration
 * Returns: API status and configuration info
 */

export async function GET(request: NextRequest) {
  try {
    // Check API Key
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.MOBILE_APP_KEY
    
    debugLog('[MOBILE_TEST] Test endpoint called', {
      hasApiKey: !!apiKey,
      hasExpectedKey: !!expectedKey,
      userAgent: request.headers.get('user-agent')
    })
    
    // Configuration Status
    const status = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      apiKeyConfigured: !!expectedKey,
      databaseConfigured: !!process.env.DATABASE_URL,
      authentication: {
        headerPresent: !!apiKey,
        keyValid: apiKey === expectedKey
      }
    }
    
    // Authentication Check
    if (!expectedKey) {
      return NextResponse.json({
        success: false,
        error: 'MOBILE_APP_KEY environment variable not configured',
        status,
        setup: {
          required: 'Add MOBILE_APP_KEY to your .env.local file',
          example: 'MOBILE_APP_KEY=your-secure-random-key-here'
        }
      }, { status: 503 })
    }
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing x-api-key header',
        status,
        setup: {
          required: 'Include x-api-key header in your request',
          example: 'curl -H "x-api-key: your-key" /api/mobile/test'
        }
      }, { status: 401 })
    }
    
    if (apiKey !== expectedKey) {
      return NextResponse.json({
        success: false,
        error: 'Invalid API key',
        status
      }, { status: 401 })
    }
    
    // Success Response
    return NextResponse.json({
      success: true,
      message: '🎉 Mobile API is properly configured and authenticated!',
      status,
      nextSteps: [
        'Your mobile API is ready to use',
        'Test the products endpoint: GET /api/mobile/products',
        'Check the setup guide: MOBILE_API_SETUP.md'
      ],
      endpoints: {
        products: '/api/mobile/products',
        test: '/api/mobile/test'
      }
    })
    
  } catch {
    return NextResponse.json({
      success: false,
      error: 'Test endpoint error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * Handle other HTTP methods
 */
export async function POST() {
  return NextResponse.json({ error: 'Use GET method for testing' }, { status: 405 })
}