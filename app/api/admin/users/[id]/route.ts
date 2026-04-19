import { NextRequest, NextResponse } from 'next/server'
import { updateUser, deleteUser } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { validateUserProfileInput } from '@/lib/validation'
import { requireBodySizeLimit, REQUEST_SIZE_LIMITS } from '@/lib/requestSizeLimit'
import { sendDiscountAssignmentEmail } from '@/lib/email'
import { getPreferredEmail, isApplePrivateRelayEmail } from '@/lib/emailHelpers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        profilePicture: true,
        isAdmin: true,
        canSeePrices: true,
        discountType: true,
        discountPercentage: true,
        birthday: true,
        lastLoginAt: true,
        lastLoginSource: true,
        lastActiveAt: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    errorLog('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

  // Request body size limit check (DoS prevention).
  // Admin may upload a base64-encoded profile picture in the JSON body —
  // default 1 MB JSON limit was rejecting real-world phone photos with 413.
  // Mirrors app/api/profile/update/route.ts (customer-facing self-edit).
  const sizeCheck = requireBodySizeLimit(request, REQUEST_SIZE_LIMITS.FORM_DATA)
  if (!sizeCheck.valid) {
    return sizeCheck.response!
  }

  try {
    const { id } = await params
    const updates = await request.json()
    debugLog('Admin user update request:', { id, updates })
    const { canSeePrices, discountType, discountPercentage, name: __name, email: __email, phone: __phone, address: __address, birthday: __birthday, profilePicture: __profilePicture } = updates

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

    // Get current user data to check if discount is being newly assigned
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { email: true, name: true, discountType: true, discountPercentage: true, contactEmail: true }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if discount is being assigned (either newly assigned or changed)
    const isDiscountBeingAssigned = (discountType !== undefined && discountType !== null && discountPercentage !== undefined && discountPercentage !== null && discountPercentage > 0) &&
      (currentUser.discountType !== discountType || currentUser.discountPercentage !== discountPercentage)

    // Update user in database
    const success = await updateUser(id, updates)
    
    if (!success) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Send discount assignment email if discount was assigned
    if (isDiscountBeingAssigned && discountType && discountPercentage && discountPercentage > 0) {
      // Get the preferred email (contactEmail if available, otherwise primary email)
      const emailToUse = getPreferredEmail(currentUser)
      
      // Skip sending to Apple Private Relay emails if no contact email is provided
      if (isApplePrivateRelayEmail(currentUser.email) && !currentUser.contactEmail) {
        debugLog(`⏭️ Skipping discount email for Apple Private Relay user without contact email: ${currentUser.email}`)
      } else {
        try {
          const emailResult = await sendDiscountAssignmentEmail({
            customerName: currentUser.name || 'Valued Customer',
            customerEmail: emailToUse,
            discountType: discountType as 'CLINIC' | 'VIP',
            discountPercentage: discountPercentage
          })
          
          if (emailResult.success) {
            debugLog(`✅ Discount assignment email sent successfully to ${emailToUse}`)
          } else {
            errorLog(`❌ Failed to send discount assignment email to ${emailToUse}:`, emailResult.error)
          }
        } catch (emailError) {
          errorLog('❌ Error sending discount assignment email:', emailError)
          // Don't fail the update if email fails
        }
      }
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