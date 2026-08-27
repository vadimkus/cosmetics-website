import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, findUserById } from '@/lib/userStorageDb'
import { verifySessionToken } from '@/lib/jwt'
import { handleApiError, handleNotFoundError } from '@/lib/apiErrorHandler'

/**
 * POST /api/auth/refresh
 *
 * Returns the CURRENT session user's latest data (used by AuthProvider to
 * pick up discount/profile changes). Identity comes exclusively from the
 * `genosys_session` cookie - the request body is ignored.
 *
 * Previously this accepted an arbitrary `{ email }` in the body and returned
 * full user PII for anyone, enabling customer-list enumeration. Now it is
 * session-authenticated and only ever returns the caller's own record.
 */
export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('genosys_session')
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const session = verifySessionToken(sessionCookie.value)
    if (!session || (!session.id && !session.email)) {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 })
    }

    const user = session.id
      ? await findUserById(session.id)
      : await findUserByEmail(session.email)

    if (!user) {
      return handleNotFoundError('User')
    }

    // Revocation check: reject sessions issued before a password reset / deletion.
    const userTv = (user as { tokenVersion?: number }).tokenVersion ?? 0
    if ((session.tv ?? 0) !== userTv) {
      return NextResponse.json({ success: false, error: 'Session revoked' }, { status: 401 })
    }

    const { password: __, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Body is optional/ignored now; a malformed body shouldn't matter, but
      // keep parity with prior behavior.
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
    }
    return handleApiError(error, 'AUTH_REFRESH')
  }
}
