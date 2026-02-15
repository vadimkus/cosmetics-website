import { NextRequest, NextResponse } from 'next/server'
import { debugLog, errorLog } from '@/lib/logger'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { prisma } from '@/lib/database'
import { createMoySkladOrder, isMoySkladEnabled } from '@/lib/moysklad'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Admin auth check
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  // CSRF protection
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    const { id } = await params

    // Check MoySklad is configured
    if (!isMoySkladEnabled()) {
      return NextResponse.json(
        { success: false, error: 'MoySklad integration is not configured. Set MOYSKLAD_LOGIN and MOYSKLAD_PASSWORD.' },
        { status: 400 }
      )
    }

    // Fetch order with items
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if already pushed
    if (order.moySkladOrderId) {
      return NextResponse.json(
        { success: false, error: `Order already pushed to MoySklad (ID: ${order.moySkladOrderId})` },
        { status: 409 }
      )
    }

    debugLog(`📤 Admin: Pushing order ${order.orderNumber} to MoySklad (by ${auth.user.email})`)

    // Push to MoySklad
    const result = await createMoySkladOrder({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone || '',
      customerAddress: order.customerAddress || '',
      customerEmirate: order.customerEmirate || '',
      items: order.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total,
      shipping: order.shipping || 0,
      paymentMethod: order.paymentMethod || 'cod',
    })

    if (!result.success) {
      errorLog(`❌ MoySklad push failed for ${order.orderNumber}:`, result.error)
      return NextResponse.json(
        { success: false, error: result.error || 'MoySklad API error' },
        { status: 502 }
      )
    }

    // Save MoySklad order ID back to our database
    const moySkladId = result.moySkladOrderId ?? null
    await prisma.order.update({
      where: { id },
      data: {
        moySkladOrderId: moySkladId,
        moySkladSyncedAt: new Date(),
      }
    })

    debugLog(`✅ Order ${order.orderNumber} pushed to MoySklad: ${result.moySkladOrderId}`)

    return NextResponse.json({
      success: true,
      moySkladOrderId: result.moySkladOrderId,
      message: `Order ${order.orderNumber} successfully pushed to MoySklad`
    })

  } catch (error) {
    errorLog('❌ Error pushing order to MoySklad:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error while pushing to MoySklad' },
      { status: 500 }
    )
  }
}
