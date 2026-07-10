import { NextRequest, NextResponse, after } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { getProductById } from '@/lib/productsDb'
import { calculateDiscountedPrice } from '@/lib/discountUtils'
import { addOrder, OrderData, OrderItemData } from '@/lib/orderStorageDb'
import { generateUniqueOrderNumber } from '@/lib/orderNumber'
import { calculateVatIncluded } from '@/lib/mobileCheckoutConfig'
import { getPreferredEmail } from '@/lib/emailHelpers'
import { sendAdminNewOrderNotification } from '@/lib/email'
import { debugLog, errorLog } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

function isPartner(user: { discountType?: string | null } | null): boolean {
  const t = String(user?.discountType || '').toUpperCase()
  return t === 'CLINIC' || t === 'VIP'
}

interface SubmittedPartnerItem {
  id: string
  quantity: number
  size?: string
  color?: string
}

/**
 * Mobile (Apple/Android app) partner-order endpoint.
 * Same logic as the cookie-based /api/partners/order, but authenticated with
 * the app's `x-api-key` + `Authorization: Bearer <token>` (no cookies). Ships
 * via Vercel deploy — the app screen that calls it ships via Expo OTA.
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    const token = extractTokenFromHeader(request.headers.get('Authorization'))
    const auth = validateMobileAuth(apiKey, token)
    if (!auth.valid || !auth.payload) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Authentication required' },
        { status: auth.status || 401, headers: CORS }
      )
    }

    const user = await findUserByEmail(auth.payload.email)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404, headers: CORS })
    }
    if (!isPartner(user)) {
      return NextResponse.json({ success: false, error: 'Partner access only' }, { status: 403, headers: CORS })
    }

    const body = await request.json()
    const submitted: SubmittedPartnerItem[] = Array.isArray(body?.items) ? body.items : []
    if (submitted.length === 0) {
      return NextResponse.json({ success: false, error: 'No items in order' }, { status: 400, headers: CORS })
    }

    const orderNotesInput =
      typeof body?.orderNotes === 'string' && body.orderNotes.trim() ? body.orderNotes.trim().slice(0, 1000) : ''
    const emirate = typeof body?.emirate === 'string' && body.emirate.trim() ? body.emirate.trim() : 'Dubai'

    let subtotal = 0
    const orderItems: OrderItemData[] = []

    for (const line of submitted) {
      const productId = String(line?.id || '').trim()
      const quantity = Math.floor(Number(line?.quantity) || 0)
      if (!productId || quantity <= 0) {
        return NextResponse.json({ success: false, error: 'Invalid order line' }, { status: 400, headers: CORS })
      }
      const product = await getProductById(productId)
      if (!product) {
        return NextResponse.json({ success: false, error: `Product not found: ${productId}` }, { status: 400, headers: CORS })
      }
      const unitPrice = calculateDiscountedPrice(product, user).discountedPrice
      const lineTotal = Math.round(unitPrice * quantity * 100) / 100
      subtotal += lineTotal
      orderItems.push({
        productId: product.id,
        productName: product.name,
        price: unitPrice,
        quantity,
        image: product.image || '/images/placeholder.jpg',
        ...(line.size ? { size: String(line.size) } : {}),
        ...(line.color ? { color: String(line.color) } : {}),
      })
    }

    subtotal = Math.round(subtotal * 100) / 100
    const shipping = 0
    const total = subtotal
    const vat = calculateVatIncluded(total)
    const orderNumber = await generateUniqueOrderNumber({ channel: 'M', payment: 'COD' })

    const partnerTag = `PARTNER ORDER — ${user.name || user.email}`
    const orderNotes = orderNotesInput ? `${partnerTag}\n${orderNotesInput}` : partnerTag

    const dbOrder: OrderData = {
      orderNumber,
      customerEmail: user.email,
      customerName: user.name || user.email,
      customerPhone: user.phone || '',
      customerEmirate: emirate,
      customerAddress: user.address || 'Partner account',
      orderNotes,
      items: orderItems,
      subtotal,
      discountPercentage: Number(user.discountPercentage || 0),
      discountAmount: 0,
      shipping,
      vat,
      total,
      status: 'PENDING',
      paymentMethod: 'partner',
      paymentStatus: 'pending',
      locale: typeof body?.locale === 'string' ? body.locale : 'en',
    }

    let savedOrderId = 'pending'
    try {
      const saved = await addOrder(dbOrder)
      savedOrderId = saved.id
      debugLog('✅ Mobile partner order saved:', orderNumber, saved.id)
    } catch (dbError) {
      errorLog('❌ Mobile partner order DB save failed:', dbError)
      return NextResponse.json({ success: false, error: 'Could not save order' }, { status: 500, headers: CORS })
    }

    after(async () => {
      try {
        await sendAdminNewOrderNotification({
          orderNumber,
          customerName: user.name || user.email,
          customerEmail: getPreferredEmail(user),
          customerPhone: user.phone || 'N/A',
          total,
          itemCount: orderItems.length,
          items: orderItems.map(item => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            image: item.image || '/images/default-product.jpg',
            ...(item.size ? { size: item.size } : {}),
            ...(item.color ? { color: item.color } : {}),
          })),
          subtotal,
          shipping,
          vat,
          emirate,
          paymentStatus: 'PENDING',
          paymentMethod: 'Partner Replenishment Order (App)',
          discountPercentage: Number(user.discountPercentage || 0) || undefined,
        })
      } catch (emailError) {
        errorLog('❌ Failed to notify admin of mobile partner order:', orderNumber, emailError)
      }
    })

    return NextResponse.json(
      { success: true, orderNumber, orderId: savedOrderId, total },
      { headers: CORS }
    )
  } catch (error) {
    errorLog('❌ Mobile partner order error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create partner order' }, { status: 500, headers: CORS })
  }
}
