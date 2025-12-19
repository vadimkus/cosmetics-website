import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from '@/lib/database'

/**
 * Mobile account deletion endpoint
 * DELETE /api/mobile/user/account
 *
 * Requirements (App Store):
 * - Provide in-app account deletion.
 * - We "delete" by anonymizing the account (including email) while keeping order records
 *   for operational/legal purposes. Orders are linked by customerEmail; updating the user email
 *   relies on ON UPDATE CASCADE on the FK (Prisma default) to keep referential integrity.
 */
export async function DELETE(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_USER] Account deletion request started')

  try {
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    const authValidation = validateMobileAuth(apiKey, token)
    if (!authValidation.valid) {
      return NextResponse.json(
        { success: false, error: authValidation.error },
        { status: authValidation.status || 500 }
      )
    }
    if (!authValidation.payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, email } = authValidation.payload
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }
    if (String(user.email || '').toLowerCase() !== String(email || '').toLowerCase()) {
      return NextResponse.json({ success: false, error: 'Account mismatch' }, { status: 403 })
    }

    const deletedEmail = `deleted+${userId}@genosys.local`
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: deletedEmail,
        name: 'Deleted User',
        password: null,
        phone: null,
        address: null,
        profilePicture: null,
        birthday: null,
        discountType: null,
        discountPercentage: null,
        lastLoginAt: null,
        isAdmin: false,
        canSeePrices: true,
      },
    })

    const duration = Date.now() - startTime
    debugLog(`[MOBILE_USER] Account deleted/anonymized for ${email} in ${duration}ms`)

    return NextResponse.json({
      success: true,
      message: 'Account deleted',
    })
  } catch (error) {
    const duration = Date.now() - startTime
    errorLog('[MOBILE_USER] Account deletion error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 })
}





