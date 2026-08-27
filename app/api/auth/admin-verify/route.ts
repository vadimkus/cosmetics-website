import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/adminAuth'
import { errorLog } from '@/lib/logger'

/**
 * Verifies the current admin session.
 *
 * Auth comes exclusively from the signed `admin-session` cookie (set by
 * /api/auth/admin-login). The legacy behavior - accepting any email in the
 * request body and answering whether that account is an admin - was an
 * admin-account enumeration oracle and was removed.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminAuth(request)

    if (!auth.user) {
      return NextResponse.json(
        { error: 'Invalid admin session' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: auth.user.id,
        email: auth.user.email,
        name: auth.user.name,
        isAdmin: true
      }
    })
  } catch (error) {
    errorLog('Admin session verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
