import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'

/**
 * GET /api/auth/passkey
 * List all passkeys for the current user
 */
export async function GET(request: NextRequest) {
  try {
    // Check if user is logged in
    const sessionCookie = request.cookies.get('genosys_session')
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const session = verifySessionToken(sessionCookie.value)
    if (!session || !session.id) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    const passkeys = await prisma.passkey.findMany({
      where: { userId: session.id },
      select: {
        id: true,
        deviceName: true,
        deviceType: true,
        backedUp: true,
        createdAt: true,
        lastUsedAt: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ passkeys })
  } catch (error) {
    errorLog('[PASSKEY] Error listing passkeys:', error)
    return NextResponse.json(
      { error: 'Failed to list passkeys' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/auth/passkey
 * Delete a passkey by ID
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check if user is logged in
    const sessionCookie = request.cookies.get('genosys_session')
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const session = verifySessionToken(sessionCookie.value)
    if (!session || !session.id) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    const { passkeyId } = await request.json()

    if (!passkeyId) {
      return NextResponse.json(
        { error: 'Passkey ID is required' },
        { status: 400 }
      )
    }

    // Find the passkey and verify ownership
    const passkey = await prisma.passkey.findUnique({
      where: { id: passkeyId }
    })

    if (!passkey) {
      return NextResponse.json(
        { error: 'Passkey not found' },
        { status: 404 }
      )
    }

    if (passkey.userId !== session.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete the passkey
    await prisma.passkey.delete({
      where: { id: passkeyId }
    })

    debugLog('[PASSKEY] Deleted passkey:', passkeyId, 'for user:', session.email)

    return NextResponse.json({
      success: true,
      message: 'Passkey deleted successfully'
    })
  } catch (error) {
    errorLog('[PASSKEY] Error deleting passkey:', error)
    return NextResponse.json(
      { error: 'Failed to delete passkey' },
      { status: 500 }
    )
  }
}
