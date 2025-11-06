import { NextRequest, NextResponse } from 'next/server'
import { updateUser, deleteUser } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { validateUserProfileInput } from '@/lib/validation'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  // CSRF protection (defense in depth)
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  // Request body size limit check (DoS prevention)
  const sizeLimit = getSizeLimitForContentType(request)
  const sizeCheck = requireBodySizeLimit(request, sizeLimit)
  if (!sizeCheck.valid) {
    return sizeCheck.response!
  }

  try {
    const { id } = await params
    const updates = await request.json()
    debugLog('Admin user update request:', { id, updates })
    const { canSeePrices, discountType, discountPercentage, name: _name, email: _email, phone: _phone, address: _address, birthday: _birthday, profilePicture: _profilePicture } = updates

    if (canSeePrices !== undefined && typeof canSeePrices !== 'boolean') {
      return NextResponse.json(
        { error: 'canSeePrices must be a boolean' },
        { status: 400 }
      )
    }

    if (discountType !== undefined && !['CLINIC', 'VIP', null].includes(discountType)) {
      return NextResponse.json(
        { error: 'discountType must be CLINIC, VIP, or null' },
        { status: 400 }
      )
    }

    if (discountPercentage !== undefined && discountPercentage !== null && (typeof discountPercentage !== 'number' || discountPercentage < 0 || discountPercentage > 100)) {
      return NextResponse.json(
        { error: 'discountPercentage must be a number between 0 and 100' },
        { status: 400 }
      )
    }

    // Server-side validation: Input length limits and file upload validation
    const validation = validateUserProfileInput(updates)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      )
    }

    // Update user in database
    const success = await updateUser(id, updates)
    
    if (!success) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    })
  } catch (error) {
    errorLog('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  // CSRF protection (defense in depth)
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    const { id } = await params

    // Get user info before deletion for analytics cleanup
    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true, name: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete related user actions from analytics (user_registered activities)
    try {
      const deletedActivities = await prisma.userAction.deleteMany({
        where: {
          action: 'user_registered',
          userEmail: user.email
        }
      })
      
      debugLog(`✅ Deleted ${deletedActivities.count} analytics activities for user ${user.email}`)
    } catch (analyticsError) {
      errorLog('❌ Failed to delete analytics activities:', analyticsError)
      // Don't fail user deletion if analytics cleanup fails
    }

    // Delete user from database
    const success = await deleteUser(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    errorLog('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}