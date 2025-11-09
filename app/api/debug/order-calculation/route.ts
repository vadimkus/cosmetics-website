import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/adminAuth'
import { debugLog, errorLog } from '@/lib/logger'
import { requireCsrfToken } from '@/lib/csrf'
import { Product } from '@/types/index'

interface DebugCheckoutItem {
  product: Product
  quantity: number
}

export async function POST(request: NextRequest) {
  // Require admin authentication and CSRF protection
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    const { items, customerEmirate } = await request.json()

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      )
    }

    // Calculate order totals with detailed logging
    debugLog('🔍 Debugging order calculation...')
    debugLog('Items received:', JSON.stringify(items, null, 2))
    
    const subtotal = items.reduce((total: number, item: DebugCheckoutItem) => {
      const itemTotal = item.product.price * item.quantity
      debugLog(`Item: ${item.product.name} - Price: ${item.product.price} x Qty: ${item.quantity} = ${itemTotal}`)
      return total + itemTotal
    }, 0)
    
    debugLog('Subtotal calculated:', subtotal)
    
    // Calculate shipping (free for orders above 1000 AED)
    const emirates = [
      { name: 'Dubai', shippingCost: 45 },
      { name: 'Abu Dhabi', shippingCost: 70 },
      { name: 'Sharjah', shippingCost: 70 },
      { name: 'Ajman', shippingCost: 70 },
      { name: 'Ras Al Khaimah', shippingCost: 70 },
      { name: 'Fujairah', shippingCost: 70 },
      { name: 'Umm Al Quwain', shippingCost: 70 }
    ]
    
    const selectedEmirateData = emirates.find(e => e.name === customerEmirate)
    const baseShippingCost = selectedEmirateData?.shippingCost || 45
    const shipping = subtotal >= 1000 ? 0 : baseShippingCost
    
    debugLog('Emirate:', customerEmirate)
    debugLog('Base shipping cost:', baseShippingCost)
    debugLog('Final shipping:', shipping)
    
    const discountAmount = 0 // You can add discount logic here if needed
    const total = subtotal - discountAmount + shipping
    // Calculate VAT amount from VAT-inclusive prices
    // VAT = (VAT-inclusive amount / 1.05) * 0.05
    const vat = Math.round(((subtotal + shipping) / 1.05) * 0.05 * 100) / 100

    debugLog('Discount amount:', discountAmount)
    debugLog('Subtotal (VAT included):', subtotal)
    debugLog('Shipping (VAT included):', shipping)
    debugLog('VAT amount (calculated from inclusive prices):', vat)
    debugLog('Final total:', total)

    const calculation = {
      items: items.map((item: DebugCheckoutItem) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        itemTotal: item.product.price * item.quantity
      })),
      subtotal,
      emirate: customerEmirate,
      baseShippingCost,
      shipping,
      discountAmount,
      vat,
      total,
      breakdown: {
        'Items Subtotal (VAT included)': subtotal,
        'Shipping (VAT included)': shipping,
        'Discount': -discountAmount,
        'VAT (5% of inclusive amount)': vat,
        'Final Total': total
      }
    }

    return NextResponse.json({
      success: true,
      calculation,
      message: 'Order calculation debug completed'
    })

  } catch (error) {
    errorLog('Error in order calculation debug:', error)
    return NextResponse.json(
      { error: 'Failed to calculate order' },
      { status: 500 }
    )
  }
}
