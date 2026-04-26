import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/adminAuth'
import { debugLog, errorLog } from '@/lib/logger'
import { requireCsrfToken } from '@/lib/csrf'
import { requireDevelopment } from '@/lib/apiErrorHandler'
import { CartItem, Product } from '@/types/index'
import { getProductById } from '@/lib/productsDb'
import { findUserByEmail } from '@/lib/userStorageDb'
import { getCartDiscountSummary, getCartLinePricing } from '@/lib/cartPricing'
import { calculateMobileShipping, calculateVatIncluded } from '@/lib/mobileCheckoutConfig'
import {
  getValidatedBundleDiscountPercent,
  isSubmittedBundleLine,
} from '@/lib/checkoutPricingGuards'

interface DebugCheckoutItem {
  product?: Partial<Product>
  productId?: string
  quantity?: number
  selectedColor?: string
  selectedSize?: string
  fromBundle?: boolean
  bundleDiscountPercent?: number
}

interface DebugProductRecord {
  item: DebugCheckoutItem
  product: Product
  quantity: number
}

export async function POST(request: NextRequest) {
  // Development-only route
  const devCheck = requireDevelopment()
  if (devCheck) return devCheck

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
    const { items, customerEmirate, customerEmail } = await request.json()

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      )
    }

    const user = customerEmail ? await findUserByEmail(customerEmail) : null
    const productRecords: DebugProductRecord[] = []

    for (const item of items as DebugCheckoutItem[]) {
      const productId = String(item.productId || item.product?.id || item.product?.productNumber || '').trim()
      if (!productId) {
        return NextResponse.json(
          { error: 'Each item must include productId or product.id' },
          { status: 400 }
        )
      }

      const product = await getProductById(productId)
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${productId}` },
          { status: 404 }
        )
      }

      const quantity = Number(item.quantity || 1)
      if (!Number.isFinite(quantity) || quantity <= 0) {
        return NextResponse.json(
          { error: `Invalid quantity for ${product.name}` },
          { status: 400 }
        )
      }

      productRecords.push({ item, product, quantity })
    }

    const bundleLineCount = productRecords.filter(({ item, product }) =>
      isSubmittedBundleLine(item.bundleDiscountPercent, product)
    ).length

    const cartItems: CartItem[] = productRecords.map(({ item, product, quantity }) => {
      const bundlePct = getValidatedBundleDiscountPercent(
        item.bundleDiscountPercent,
        product,
        bundleLineCount
      )

      return {
        product,
        quantity,
        ...(item.selectedColor ? { selectedColor: item.selectedColor } : {}),
        ...(item.selectedSize ? { selectedSize: item.selectedSize } : {}),
        ...(bundlePct !== null ? { fromBundle: true, bundleDiscountPercent: bundlePct } : {}),
      }
    })

    // Calculate order totals with the same contract-backed line pricing used by checkout.
    debugLog('🔍 Debugging order calculation...')
    debugLog('Items received:', JSON.stringify(items, null, 2))
    
    const pricedItems = cartItems.map((item) => {
      const pricing = getCartLinePricing(item, user)
      debugLog(`Item: ${item.product.name} - Price: ${pricing.unitPrice} x Qty: ${pricing.quantity} = ${pricing.lineTotal}`)
      return {
        item,
        pricing,
      }
    })

    const subtotal = Math.round(pricedItems.reduce((total, { pricing }) => total + pricing.lineTotal, 0) * 100) / 100
    
    debugLog('Subtotal calculated:', subtotal)
    
    const baseShippingCost = calculateMobileShipping(0, customerEmirate)
    const shipping = calculateMobileShipping(subtotal, customerEmirate)
    
    debugLog('Emirate:', customerEmirate)
    debugLog('Base shipping cost:', baseShippingCost)
    debugLog('Final shipping:', shipping)
    
    const discountSummary = getCartDiscountSummary(cartItems, user)
    const discountAmount = discountSummary.totalSaved
    const total = subtotal + shipping
    const vat = calculateVatIncluded(total)

    debugLog('Discount amount:', discountAmount)
    debugLog('Subtotal (VAT included):', subtotal)
    debugLog('Shipping (VAT included):', shipping)
    debugLog('VAT amount (calculated from inclusive prices):', vat)
    debugLog('Final total:', total)

    const calculation = {
      items: pricedItems.map(({ item, pricing }) => ({
        name: item.product.name,
        price: pricing.unitPrice,
        retailPrice: pricing.retailUnitPrice,
        quantity: pricing.quantity,
        itemTotal: pricing.lineTotal,
        discountAmount: pricing.discountAmount,
        discountPercentage: pricing.discountPercentage,
        discountType: pricing.discountType,
      })),
      subtotal,
      discountSummary,
      emirate: customerEmirate,
      baseShippingCost,
      shipping,
      discountAmount,
      vat,
      total,
      breakdown: {
        'Retail Subtotal (VAT included)': discountSummary.retailTotal,
        'Discount': -discountAmount,
        'Discounted Subtotal (VAT included)': subtotal,
        'Shipping (VAT included)': shipping,
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
