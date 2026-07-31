import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { verifySessionToken } from '@/lib/jwt'
import { validateBirthday } from '@/lib/validation'

/**
 * Web User Profile Endpoint (Session-based auth)
 * 
 * GET /api/user/profile - Get user profile
 * PUT /api/user/profile - Update user profile
 * 
 * Uses session cookie for authentication (signed JWT tokens)
 */

async function getUserFromSession(): Promise<{ email: string; userId: string } | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('genosys_session')
    
    if (!sessionCookie?.value) {
      return null
    }
    
    // Verify and decode session token (handles both JWT and legacy JSON format)
    const sessionData = verifySessionToken(sessionCookie.value)
    
    if (!sessionData?.email) {
      return null
    }
    
    return {
      email: sessionData.email,
      userId: sessionData.id
    }
  } catch (error) {
    errorLog('[USER_PROFILE] Session parse error:', error)
    return null
  }
}

export async function GET(_request: NextRequest) {
  const startTime = Date.now()
  debugLog('[USER_PROFILE] Get profile request started')

  try {
    const session = await getUserFromSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await findUserByEmail(session.email)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Return user profile (without password)
    const { password: __, ...userProfile } = user
    
    debugLog('[USER_PROFILE] Get profile completed', Date.now() - startTime, 'ms')
    
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
    errorLog('[USER_PROFILE] Get profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[USER_PROFILE] Update profile request started')

  try {
    const session = await getUserFromSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await findUserByEmail(session.email)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
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
      if (typeof sanitizedUpdates.name !== 'string' || (sanitizedUpdates.name as string).trim().length === 0) {
        return NextResponse.json(
          { success: false, error: 'Name must be a non-empty string' },
          { status: 400 }
        )
      }
      sanitizedUpdates.name = (sanitizedUpdates.name as string).trim()
    }

    // Validate phone if provided
    if (sanitizedUpdates.phone !== undefined && sanitizedUpdates.phone !== null && sanitizedUpdates.phone !== '') {
      if (typeof sanitizedUpdates.phone !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Phone must be a string' },
          { status: 400 }
        )
      }
      sanitizedUpdates.phone = (sanitizedUpdates.phone as string).trim()
    }

    // Validate address if provided
    if (sanitizedUpdates.address !== undefined && sanitizedUpdates.address !== null && sanitizedUpdates.address !== '') {
      if (typeof sanitizedUpdates.address !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Address must be a string' },
          { status: 400 }
        )
      }
      sanitizedUpdates.address = (sanitizedUpdates.address as string).trim()
    }

    // Validate gender if provided
    if (sanitizedUpdates.gender !== undefined && sanitizedUpdates.gender !== null && sanitizedUpdates.gender !== '') {
      if (typeof sanitizedUpdates.gender !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Gender must be a string' },
          { status: 400 }
        )
      }
      const g = (sanitizedUpdates.gender as string).trim()
      if (g.length > 64) {
        return NextResponse.json(
          { success: false, error: 'Gender is too long' },
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
          { success: false, error: birthdayValidation.error || 'Invalid birthday' },
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
          { success: false, error: 'Contact email must be a string' },
          { status: 400 }
        )
      } else {
        const v = (raw as string).trim()
        if (v.length === 0) {
          sanitizedUpdates.contactEmail = null
        } else if (v.length < 3 || v.length > 255) {
          return NextResponse.json(
            { success: false, error: 'Contact email must be between 3 and 255 characters' },
            { status: 400 }
          )
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
          return NextResponse.json(
            { success: false, error: 'Contact email must be a valid email address' },
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
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Update user profile
    const updateSuccess = await updateUser(user.id, sanitizedUpdates)
    
    if (!updateSuccess) {
      return NextResponse.json(
        { success: false, error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    // Get updated user data
    const updatedUser = await findUserByEmail(session.email)
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to retrieve updated profile' },
        { status: 500 }
      )
    }

    // Return updated profile (without password)
    const { password: __, ...userProfile } = updatedUser
    
    debugLog('[USER_PROFILE] Update profile completed', Date.now() - startTime, 'ms')
    
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
    errorLog('[USER_PROFILE] Update profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

