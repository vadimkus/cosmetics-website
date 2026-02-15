import { NextResponse } from 'next/server'
import { isMoySkladEnabled, createMoySkladOrder } from '@/lib/moysklad'

/**
 * TEST ENDPOINT — Verify MoySklad integration from Vercel.
 * GET /api/test-moysklad — check env vars
 * POST /api/test-moysklad — attempt a dry-run order creation
 * 
 * DELETE THIS FILE after debugging is complete.
 */

export async function GET() {
  const login = process.env.MOYSKLAD_LOGIN
  const password = process.env.MOYSKLAD_PASSWORD
  const enabled = isMoySkladEnabled()

  return NextResponse.json({
    enabled,
    loginPresent: !!login,
    loginLength: login?.length || 0,
    loginPreview: login ? `${login.substring(0, 5)}...` : null,
    passwordPresent: !!password,
    passwordLength: password?.length || 0,
    timestamp: new Date().toISOString(),
  })
}

export async function POST() {
  if (!isMoySkladEnabled()) {
    return NextResponse.json({ error: 'MoySklad not enabled — env vars missing' }, { status: 500 })
  }

  try {
    const result = await createMoySkladOrder({
      orderNumber: 'TEST-API-CHECK-DELETE-ME',
      customerName: 'API Test Customer',
      customerEmail: 'test@genosys.ae',
      customerPhone: '+971500000000',
      customerAddress: 'Test Address',
      customerEmirate: 'Dubai',
      items: [{
        productName: 'EPI TURNOVER BOOSTING PEELING GEL',
        quantity: 1,
        price: 125,
      }],
      total: 170,
      shipping: 45,
      paymentMethod: 'cod',
    })

    return NextResponse.json({
      success: result.success,
      moySkladOrderId: result.moySkladOrderId,
      error: result.error,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
