import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { trackUserActivity } from '@/lib/activityTracker'
import { validateBirthday } from '@/lib/validation'

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

    // Track user activity (throttled, non-blocking)
    trackUserActivity(user.id)

    // Return user profile (without password)
    const { password: __, ...userProfile } = user
    
    debugLog('[MOBILE_PROFILE] Get profile completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      data: {
        id: userProfile.id,
        email: userProfile.email,
        contactEmail: userProfile.contactEmail ?? null,
        name: userProfile.name,
        phone: userProfile.phone,
        address: userProfile.address,
        profilePicture: userProfile.profilePicture,
        gender: userProfile.gender ?? null,
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
    const allowedFields = ['name', 'phone', 'address', 'birthday', 'profilePicture', 'gender', 'contactEmail']
    const sanitizedUpdates: Record<string, unknown> = {}
    
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

    // Validate gender if provided
    if (sanitizedUpdates.gender !== undefined && sanitizedUpdates.gender !== null && sanitizedUpdates.gender !== '') {
      if (typeof sanitizedUpdates.gender !== 'string') {
        return NextResponse.json(
          {
            success: false,
            error: 'Gender must be a string'
          },
          { status: 400 }
        )
      }
      const g = sanitizedUpdates.gender.trim()
      if (g.length > 64) {
        return NextResponse.json(
          {
            success: false,
            error: 'Gender is too long'
          },
          { status: 400 }
        )
      }
      sanitizedUpdates.gender = g
    }

    // Validate birthday if provided (no future dates)
    if (sanitizedUpdates.birthday !== undefined && sanitizedUpdates.birthday !== null && sanitizedUpdates.birthday !== '') {
      const birthdayValidation = validateBirthday(sanitizedUpdates.birthday)
      if (!birthdayValidation.valid) {
        return NextResponse.json(
          {
            success: false,
            error: birthdayValidation.error || 'Invalid birthday',
          },
          { status: 400 }
        )
      }
      sanitizedUpdates.birthday = birthdayValidation.value
    }

    // Validate contactEmail if provided
    if (sanitizedUpdates.contactEmail !== undefined) {
      const raw = sanitizedUpdates.contactEmail
      if (raw === null || raw === '') {
        sanitizedUpdates.contactEmail = null
      } else if (typeof raw !== 'string') {
        return NextResponse.json(
          {
            success: false,
            error: 'Contact email must be a string'
          },
          { status: 400 }
        )
      } else {
        const v = raw.trim()
        if (v.length === 0) {
          sanitizedUpdates.contactEmail = null
        } else if (v.length < 3 || v.length > 255) {
          return NextResponse.json(
            {
              success: false,
              error: 'Contact email must be between 3 and 255 characters'
            },
            { status: 400 }
          )
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
          return NextResponse.json(
            {
              success: false,
              error: 'Contact email must be a valid email address'
            },
            { status: 400 }
          )
        } else {
          sanitizedUpdates.contactEmail = v
        }
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
        contactEmail: userProfile.contactEmail ?? null,
        name: userProfile.name,
        phone: userProfile.phone,
        address: userProfile.address,
        profilePicture: userProfile.profilePicture,
        gender: userProfile.gender ?? null,
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
