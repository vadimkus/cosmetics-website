'use client'

import { formatCurrency } from '@/lib/utils'

interface OrderBreakdownProps {
  subtotal: number
  discountAmount?: number
  loyaltyPointsRedeemed?: number
  loyaltyDiscountAmount?: number
  shipping: number
  vat: number
  total: number
  className?: string
}

export default function OrderBreakdown({
  subtotal,
  discountAmount = 0,
  loyaltyPointsRedeemed = 0,
  loyaltyDiscountAmount = 0,
  shipping,
  vat,
  total,
  className = ''
}: OrderBreakdownProps) {

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Order Breakdown</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        {loyaltyDiscountAmount > 0 && loyaltyPointsRedeemed > 0 && (
          <div className="flex justify-between text-blue-600">
            <span>GENOSYS Rewards ({loyaltyPointsRedeemed.toLocaleString()} pts):</span>
            <span>-{formatCurrency(loyaltyDiscountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping:</span>
          <span>{formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">VAT (5%):</span>
          <span>{formatCurrency(vat)}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span className="text-red-600">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}
