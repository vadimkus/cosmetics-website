import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'

/**
 * Mobile User Profile Endpoint
 * 
 * GET /api/mobile/user/profile - Get user profile
 * PUT /api/mobile/user/profile - Update user profile
 * 
 * Headers Required:
 * - x-api-key: Mobile app API key
 * - Authorization: Bearer <jwt_token>
 */

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_PROFILE] Get profile request started')

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

    // Get fresh user data from database
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

    // Return user profile (without password)
    const { password: __, ...userProfile } = user
    
    debugLog('[MOBILE_PROFILE] Get profile completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      data: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        phone: userProfile.phone,
        address: userProfile.address,
        profilePicture: userProfile.profilePicture,
        birthday: userProfile.birthday,
        canSeePrices: userProfile.canSeePrices,
        discountType: userProfile.discountType,
        discountPercentage: userProfile.discountPercentage,
        isAdmin: userProfile.isAdmin,
        lastLoginAt: userProfile.lastLoginAt,
        createdAt: userProfile.createdAt,
        updatedAt: userProfile.updatedAt
      }
    })

  } catch (error) {
    errorLog('[MOBILE_PROFILE] Get profile error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_PROFILE] Update profile request started')

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
    const updates = await request.json()
    
    // Validate and sanitize updates
    const allowedFields = ['name', 'phone', 'address', 'birthday', 'profilePicture']
    const sanitizedUpdates: any = {}
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        sanitizedUpdates[field] = updates[field]
      }
    }

    // Validate name if provided
    if (sanitizedUpdates.name !== undefined) {
      if (typeof sanitizedUpdates.name !== 'string' || sanitizedUpdates.name.trim().length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Name must be a non-empty string' 
          },
          { status: 400 }
        )
      }
      sanitizedUpdates.name = sanitizedUpdates.name.trim()
    }

    // Validate phone if provided
    if (sanitizedUpdates.phone !== undefined && sanitizedUpdates.phone !== null && sanitizedUpdates.phone !== '') {
      if (typeof sanitizedUpdates.phone !== 'string') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Phone must be a string' 
          },
          { status: 400 }
        )
      }
      sanitizedUpdates.phone = sanitizedUpdates.phone.trim()
    }

    // Validate address if provided
    if (sanitizedUpdates.address !== undefined && sanitizedUpdates.address !== null && sanitizedUpdates.address !== '') {
      if (typeof sanitizedUpdates.address !== 'string') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Address must be a string' 
          },
          { status: 400 }
        )
      }
      sanitizedUpdates.address = sanitizedUpdates.address.trim()
    }

    // Validate birthday if provided
    if (sanitizedUpdates.birthday !== undefined && sanitizedUpdates.birthday !== null && sanitizedUpdates.birthday !== '') {
      if (typeof sanitizedUpdates.birthday !== 'string') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Birthday must be a string' 
          },
          { status: 400 }
        )
      }
      // Basic date validation (you might want to add more sophisticated validation)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(sanitizedUpdates.birthday)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Birthday must be in YYYY-MM-DD format' 
          },
          { status: 400 }
        )
      }
    }

    // Check if there are any updates to apply
    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No valid fields to update' 
        },
        { status: 400 }
      )
    }

    // Update user profile
    const updateSuccess = await updateUser(user.id, sanitizedUpdates)
    
    if (!updateSuccess) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to update profile' 
        },
        { status: 500 }
      )
    }

    // Get updated user data
    const updatedUser = await findUserByEmail(tokenPayload.email)
    if (!updatedUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to retrieve updated profile' 
        },
        { status: 500 }
      )
    }

    // Return updated profile (without password)
    const { password: __, ...userProfile } = updatedUser
    
    debugLog('[MOBILE_PROFILE] Update profile completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        phone: userProfile.phone,
        address: userProfile.address,
        profilePicture: userProfile.profilePicture,
        birthday: userProfile.birthday,
        canSeePrices: userProfile.canSeePrices,
        discountType: userProfile.discountType,
        discountPercentage: userProfile.discountPercentage,
        isAdmin: userProfile.isAdmin,
        lastLoginAt: userProfile.lastLoginAt,
        createdAt: userProfile.createdAt,
        updatedAt: userProfile.updatedAt
      }
    })

  } catch (error) {
    errorLog('[MOBILE_PROFILE] Update profile error:', error)
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
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    },
  })
}
