import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { updateUser } from '@/lib/userStorageDb'
import { errorLog } from '@/lib/logger'
import { requireCsrfToken } from '@/lib/csrf'
import { validateUserProfileInput } from '@/lib/validation'
import { requireBodySizeLimit, REQUEST_SIZE_LIMITS } from '@/lib/requestSizeLimit'
import { verifySessionToken } from '@/lib/jwt'

/**
 * Self-service profile update (session-authenticated).
 *
 * The target user is ALWAYS the session user — any `userId` in the body is
 * ignored. Only the allowlisted self-editable fields below are applied;
 * everything else (email, isAdmin, discount fields, canSeePrices, ...) is
 * stripped before reaching updateUser.
 */
const SELF_EDITABLE_FIELDS = [
  'name',
  'phone',
  'address',
  'birthday',
  'contactEmail',
  'profilePicture',
] as const

export async function POST(request: NextRequest) {
  // CSRF protection
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  // Request body size limit check (DoS prevention)
  // Use FORM_DATA limit (10MB) for profile updates to allow large profile pictures
  const sizeLimit = REQUEST_SIZE_LIMITS.FORM_DATA // 10MB to accommodate base64 images
  const sizeCheck = requireBodySizeLimit(request, sizeLimit)
  if (!sizeCheck.valid) {
    return sizeCheck.response!
  }

  try {
    // Authenticate via session cookie — the body's userId is never trusted.
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('genosys_session')
    const session = sessionCookie?.value ? verifySessionToken(sessionCookie.value) : null
    if (!session?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { updates } = await request.json()

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Updates are required' },
        { status: 400 }
      )
    }

    // Allowlist: drop any field a user must not set on themselves.
    const safeUpdates: Record<string, unknown> = {}
    for (const field of SELF_EDITABLE_FIELDS) {
      if (field in updates) safeUpdates[field] = updates[field]
    }

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No editable fields provided' },
        { status: 400 }
      )
    }

    // Server-side validation: Input length limits and file upload validation
    const validation = validateUserProfileInput(safeUpdates)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      )
    }

    // Update the SESSION user only
    const success = await updateUser(session.id, safeUpdates)

    if (!success) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    errorLog('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
