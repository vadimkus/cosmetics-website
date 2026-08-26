import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'

/**
 * Where the app hands over ActivityKit's tokens.
 *
 * PUT /api/mobile/user/live-activity-token
 *   { kind: 'push-to-start', token }            -> stored on the user
 *   { kind: 'activity', token, orderNumber }    -> stored on that order
 *
 * Two tokens, and they are not interchangeable. The push-to-start token is app-wide and
 * is the only way to raise a card while the app is not running. The per-activity token
 * updates or ends one card that already exists. Sending one where the other belongs gets
 * `DeviceTokenNotForTopic` back from Apple, which explains nothing.
 *
 * Neither is the Expo push token, which lives on `expoPushToken` and drives ordinary
 * notifications.
 *
 * Headers: x-api-key, Authorization: Bearer <jwt>
 */
export async function PUT(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    const jwt = extractTokenFromHeader(request.headers.get('Authorization'))
    const auth = validateMobileAuth(apiKey, jwt)
    if (!auth.valid) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status || 500 })
    }
    if (!auth.payload) {
      return NextResponse.json(
        { success: false, error: 'Authentication token required' },
        { status: 401 }
      )
    }

    const user = await findUserByEmail(auth.payload.email)
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    const body = (await request.json().catch(() => ({}))) as {
      kind?: string
      token?: string
      orderNumber?: string
    }
    const token = typeof body.token === 'string' ? body.token.trim() : ''
    if (!token) {
      return NextResponse.json({ success: false, error: 'token is required' }, { status: 400 })
    }
    // Hex, as ActivityKit produces. Rejecting anything else here saves a confusing 400
    // from Apple much later.
    if (!/^[0-9a-f]+$/i.test(token)) {
      return NextResponse.json(
        { success: false, error: 'token must be hexadecimal' },
        { status: 400 }
      )
    }

    if (body.kind === 'push-to-start') {
      await prisma.user.update({
        where: { id: user.id },
        data: { liveActivityStartToken: token },
      })
      debugLog('[LIVE_ACTIVITY_TOKEN] stored push-to-start token')
      return NextResponse.json({ success: true })
    }

    if (body.kind === 'activity') {
      const orderNumber = String(body.orderNumber || '').trim()
      if (!orderNumber) {
        return NextResponse.json(
          { success: false, error: 'orderNumber is required for an activity token' },
          { status: 400 }
        )
      }
      // Scoped to this customer's own order, so one account cannot attach a token to
      // somebody else's card.
      const updated = await prisma.order.updateMany({
        where: { orderNumber, customerEmail: user.email },
        data: { liveActivityToken: token },
      })
      if (updated.count === 0) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
      }
      debugLog(`[LIVE_ACTIVITY_TOKEN] stored activity token for order ${orderNumber}`)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: "kind must be 'push-to-start' or 'activity'" },
      { status: 400 }
    )
  } catch (error) {
    errorLog('[LIVE_ACTIVITY_TOKEN] PUT error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
