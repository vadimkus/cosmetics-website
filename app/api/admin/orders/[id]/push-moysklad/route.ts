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

    const freePromoProductIds = order.items
      .filter(item => Number(item.price || 0) === 0 && item.size === '__PROMO__')
      .map(item => item.productId)

    const freePromoProducts = freePromoProductIds.length > 0
      ? await prisma.product.findMany({
        where: { id: { in: freePromoProductIds } },
        select: { id: true, price: true },
      })
      : []

    const productPriceById = new Map(freePromoProducts.map(product => [product.id, product.price]))

    // Push to MoySklad
    const result = await createMoySkladOrder({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone || '',
      customerAddress: order.customerAddress || '',
      customerEmirate: order.customerEmirate || '',
      items: order.items.map(item => {
        const bundleDiscount = Number(item.bundleDiscount || 0)
        const hasBundleDiscount = bundleDiscount > 0 && bundleDiscount < 100 && Number(item.price || 0) > 0
        const isFreePromo = Number(item.price || 0) === 0 && item.size === '__PROMO__'
        const retailPrice = isFreePromo
          ? productPriceById.get(item.productId) || item.price
          : hasBundleDiscount
            ? Math.round((item.price / (1 - bundleDiscount / 100)) * 100) / 100
            : item.price

        return {
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          retailPrice,
          ...(isFreePromo || hasBundleDiscount
            ? { discountPercent: isFreePromo ? 100 : bundleDiscount }
            : {}),
          color: item.color,
          size: item.size,
        }
      }),
      total: order.total,
      shipping: order.shipping || 0,
      paymentMethod: order.paymentMethod || 'cod',
      paymentStatus: order.paymentStatus || 'pending',
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

    debugLog(
      `✅ Order ${order.orderNumber} pushed to MoySklad: ` +
      `order=${result.moySkladOrderId}, invoice=${result.moySkladInvoiceId}, ` +
      `shipment=${result.moySkladDemandId}, paymentin=${result.moySkladPaymentInId || 'skipped'}`
    )

    return NextResponse.json({
      success: true,
      moySkladOrderId: result.moySkladOrderId,
      moySkladInvoiceId: result.moySkladInvoiceId,
      moySkladDemandId: result.moySkladDemandId,
      moySkladPaymentInId: result.moySkladPaymentInId,
      message: result.moySkladPaymentInId
        ? `Order ${order.orderNumber} successfully pushed to MoySklad with invoice, shipment, and incoming payment`
        : `Order ${order.orderNumber} successfully pushed to MoySklad with invoice and shipment`
    })

  } catch (error) {
    errorLog('❌ Error pushing order to MoySklad:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error while pushing to MoySklad' },
      { status: 500 }
    )
  }
}
