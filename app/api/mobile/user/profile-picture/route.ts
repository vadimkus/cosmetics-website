import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { prisma } from '@/lib/database'
import { debugLog, errorLog } from '@/lib/logger'

export const runtime = 'nodejs'

/**
 * Mobile Profile Picture Upload
 * POST /api/mobile/user/profile-picture
 *
 * Headers:
 * - x-api-key
 * - Authorization: Bearer <jwt_token>
 *
 * Body: multipart/form-data
 * - profilePicture: File
 *
 * Stores image as a data URL in users.profilePicture (TEXT) to keep parity with website behavior.
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_PROFILE_PIC] Upload request started')

  try {
    const apiKey = request.headers.get('x-api-key')
    const token = extractTokenFromHeader(request.headers.get('Authorization'))
    const authValidation = validateMobileAuth(apiKey, token)

    if (!authValidation.valid) {
      return NextResponse.json(
        { success: false, error: authValidation.error },
        { status: authValidation.status || 401 }
      )
    }
    if (!authValidation.payload) {
      return NextResponse.json({ success: false, error: 'Authentication token required' }, { status: 401 })
    }

    const { userId, email } = authValidation.payload
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }
    if (String(user.email || '').toLowerCase() !== String(email || '').toLowerCase()) {
      return NextResponse.json({ success: false, error: 'Account mismatch' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('profilePicture')
    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'profilePicture file is required' }, { status: 400 })
    }

    // Basic type + size checks
    const mime = (file as File).type || 'image/jpeg'
    if (!mime.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 })
    }

    const arrayBuffer = await (file as File).arrayBuffer()
    const sizeBytes = arrayBuffer.byteLength || 0
    const maxBytes = 5 * 1024 * 1024 // 5MB
    if (sizeBytes > maxBytes) {
      return NextResponse.json({ success: false, error: 'Image too large (max 5MB)' }, { status: 413 })
    }

    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:${mime};base64,${base64}`

    await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: dataUrl }
    })

    debugLog('[MOBILE_PROFILE_PIC] Upload completed', Date.now() - startTime, 'ms')
    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      message: 'Profile picture uploaded successfully'
    })
  } catch (error) {
    errorLog('[MOBILE_PROFILE_PIC] Upload error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 })
}







