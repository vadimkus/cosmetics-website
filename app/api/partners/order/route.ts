import { NextRequest, NextResponse, after } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { getProductById } from '@/lib/productsDb'
import { calculateDiscountedPrice } from '@/lib/discountUtils'
import { addOrder, OrderData, OrderItemData } from '@/lib/orderStorageDb'
import { generateUniqueOrderNumber } from '@/lib/orderNumber'
import { calculateVatIncluded } from '@/lib/mobileCheckoutConfig'
import { getPreferredEmail } from '@/lib/emailHelpers'
import { sendAdminNewOrderNotification } from '@/lib/email'
import { requireCsrfToken } from '@/lib/csrf'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { debugLog, errorLog } from '@/lib/logger'

export const runtime = 'nodejs'

// A partner is a logged-in user flagged as a clinic/wholesale account.
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

const partnerLimiter = rateLimitSimple({ windowMs: 10 * 60 * 1000, max: 10 })

export async function POST(request: NextRequest) {
  // CSRF protection (same pattern as retail checkout)
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  // Abuse protection
  const rl = await partnerLimiter(`partner-order:${getClientIdentifierFromNextRequest(request)}`)
  if (!rl.success) {
    return NextResponse.json({ error: rl.message || 'Too many requests' }, { status: 429 })
  }

  try {
    // ---- Auth: must be a logged-in partner account ----
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('genosys_session')
    const session = sessionCookie?.value ? verifySessionToken(sessionCookie.value) : null
    if (!session?.email) {
      return NextResponse.json({ error: 'Please log in.' }, { status: 401 })
    }

    const user = await findUserByEmail(session.email)
    if (!user) {
      return NextResponse.json({ error: 'Account not found.' }, { status: 401 })
    }
    if (!isPartner(user)) {
      return NextResponse.json({ error: 'Partner access only.' }, { status: 403 })
    }

    const body = await request.json()
    const submitted: SubmittedPartnerItem[] = Array.isArray(body?.items) ? body.items : []
    if (submitted.length === 0) {
      return NextResponse.json({ error: 'No items in order.' }, { status: 400 })
    }

    const orderNotesInput =
      typeof body?.orderNotes === 'string' && body.orderNotes.trim()
        ? body.orderNotes.trim().slice(0, 1000)
        : ''
    const emirate =
      typeof body?.emirate === 'string' && body.emirate.trim()
        ? body.emirate.trim()
        : (user.address ? 'Dubai' : 'Dubai')

    // ---- Server-side pricing (never trust client prices) ----
    let subtotal = 0
    const orderItems: OrderItemData[] = []

    for (const line of submitted) {
      const productId = String(line?.id || '').trim()
      const quantity = Math.floor(Number(line?.quantity) || 0)
      if (!productId || quantity <= 0) {
        return NextResponse.json({ error: 'Invalid order line.' }, { status: 400 })
      }

      const product = await getProductById(productId)
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${productId}` }, { status: 400 })
      }

      // Partner price = this account's own discount off retail (existing
      // accounts keep their negotiated %, new partner accounts default to 50%).
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
    const discountPct = Number(user.discountPercentage || 0)

    const orderNumber = await generateUniqueOrderNumber({ channel: 'W', payment: 'COD' })

    // Mark clearly as a partner order (no schema change needed for MVP).
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
      discountPercentage: discountPct > 0 ? discountPct : 0,
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
      debugLog('✅ Partner order saved:', orderNumber, saved.id)
    } catch (dbError) {
      errorLog('❌ Partner order DB save failed:', dbError)
      return NextResponse.json({ error: 'Could not save order. Please try again.' }, { status: 500 })
    }

    // Notify admin (Vadim) — same channel as retail orders. He then pushes to MoySklad.
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
          paymentMethod: 'Partner Replenishment Order',
          discountPercentage: discountPct > 0 ? discountPct : undefined,
        })
        debugLog('✅ Admin notified of partner order:', orderNumber)
      } catch (emailError) {
        errorLog('❌ Failed to notify admin of partner order:', orderNumber, emailError)
      }
    })

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: savedOrderId,
      total,
    })
  } catch (error) {
    errorLog('❌ Partner order error:', error)
    return NextResponse.json({ error: 'Failed to create partner order.' }, { status: 500 })
  }
}
