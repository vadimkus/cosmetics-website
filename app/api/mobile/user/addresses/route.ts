import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'

/**
 * Mobile User Addresses Endpoint
 * 
 * GET /api/mobile/user/addresses - Get user's saved addresses
 * POST /api/mobile/user/addresses - Add/update address
 * DELETE /api/mobile/user/addresses - Clear address
 * 
 * Headers Required:
 * - x-api-key: Mobile app API key
 * - Authorization: Bearer <jwt_token>
 * 
 * Note: Currently using the single address field from User model.
 * For multiple addresses, you'd need to add an Address table to your schema.
 */

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_ADDRESSES] Get addresses request started')

  try {
    // Extract API key and JWT token
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    // Validate API key and token
    const authValidation = validateMobileAuth(apiKey, token)
    
    if (!authValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: authValidation.error
        },
        { status: authValidation.status || 500 }
      )
    }

    if (!authValidation.payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication token required' 
        },
        { status: 401 }
      )
    }

    const tokenPayload = authValidation.payload

    // Get user from database
    const user = await findUserByEmail(tokenPayload.email)
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      )
    }

    // Return user's address as an array (for consistency with mobile app expectations)
    const addresses = user.address ? [
      {
        id: 'primary',
        label: 'Primary Address',
        address: user.address,
        isDefault: true
      }
    ] : []
    
    debugLog('[MOBILE_ADDRESSES] Get addresses completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      data: addresses
    })

  } catch (error) {
    errorLog('[MOBILE_ADDRESSES] Get addresses error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_ADDRESSES] Add/update address request started')

  try {
    // Extract API key and JWT token
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    // Validate API key and token
    const authValidation = validateMobileAuth(apiKey, token)
    
    if (!authValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: authValidation.error
        },
        { status: authValidation.status || 500 }
      )
    }

    if (!authValidation.payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication token required' 
        },
        { status: 401 }
      )
    }

    const tokenPayload = authValidation.payload

    // Verify user exists
    const user = await findUserByEmail(tokenPayload.email)
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      )
    }

    // Parse request body
    const { address, label } = await request.json()

    // Validate address
    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Address is required and must be a non-empty string' 
        },
        { status: 400 }
      )
    }

    const trimmedAddress = address.trim()

    // Update user's address
    const updateSuccess = await updateUser(user.id, { address: trimmedAddress })
    
    if (!updateSuccess) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to save address' 
        },
        { status: 500 }
      )
    }

    debugLog('[MOBILE_ADDRESSES] Add/update address completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      message: 'Address saved successfully',
      data: {
        id: 'primary',
        label: label || 'Primary Address',
        address: trimmedAddress,
        isDefault: true
      }
    }, { status: 201 })

  } catch (error) {
    errorLog('[MOBILE_ADDRESSES] Add/update address error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_ADDRESSES] Delete address request started')

  try {
    // Extract API key and JWT token
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    // Validate API key and token
    const authValidation = validateMobileAuth(apiKey, token)
    
    if (!authValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: authValidation.error
        },
        { status: authValidation.status || 500 }
      )
    }

    if (!authValidation.payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication token required' 
        },
        { status: 401 }
      )
    }

    const tokenPayload = authValidation.payload

    // Verify user exists
    const user = await findUserByEmail(tokenPayload.email)
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      )
    }

    // Clear user's address
    const updateSuccess = await updateUser(user.id, { address: null })
    
    if (!updateSuccess) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete address' 
        },
        { status: 500 }
      )
    }

    debugLog('[MOBILE_ADDRESSES] Delete address completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    })

  } catch (error) {
    errorLog('[MOBILE_ADDRESSES] Delete address error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    },
  })
}
