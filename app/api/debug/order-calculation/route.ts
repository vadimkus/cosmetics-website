import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmirate } = await request.json()

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      )
    }

    // Calculate order totals with detailed logging
    console.log('🔍 Debugging order calculation...')
    console.log('Items received:', JSON.stringify(items, null, 2))
    
    const subtotal = items.reduce((total: number, item: any) => {
      const itemTotal = item.product.price * item.quantity
      console.log(`Item: ${item.product.name} - Price: ${item.product.price} x Qty: ${item.quantity} = ${itemTotal}`)
      return total + itemTotal
    }, 0)
    
    console.log('Subtotal calculated:', subtotal)
    
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
    
    console.log('Emirate:', customerEmirate)
    console.log('Base shipping cost:', baseShippingCost)
    console.log('Final shipping:', shipping)
    
    const discountAmount = 0 // You can add discount logic here if needed
    const totalBeforeVAT = subtotal - discountAmount + shipping
    const vat = totalBeforeVAT * 0.05
    const total = totalBeforeVAT + vat

    console.log('Discount amount:', discountAmount)
    console.log('Total before VAT:', totalBeforeVAT)
    console.log('VAT (5%):', vat)
    console.log('Final total:', total)

    const calculation = {
      items: items.map(item => ({
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
      totalBeforeVAT,
      vat,
      total,
      breakdown: {
        'Items Subtotal': subtotal,
        'Shipping': shipping,
        'Discount': -discountAmount,
        'Subtotal + Shipping': totalBeforeVAT,
        'VAT (5%)': vat,
        'Final Total': total
      }
    }

    return NextResponse.json({
      success: true,
      calculation,
      message: 'Order calculation debug completed'
    })

  } catch (error) {
    console.error('Error in order calculation debug:', error)
    return NextResponse.json(
      { error: 'Failed to calculate order' },
      { status: 500 }
    )
  }
}
