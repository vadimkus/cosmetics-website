'use client'

import { Truck, Shield, Star } from 'lucide-react'

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-3 py-4 border-y border-gray-200">
      <div className="text-center">
        <Truck className="h-6 w-6 mx-auto text-green-600 mb-1" />
        <p className="text-xs font-medium text-gray-700">Free Shipping</p>
        <p className="text-xs text-gray-500">On orders over 1,000 AED</p>
      </div>
      <div className="text-center">
        <Shield className="h-6 w-6 mx-auto text-green-600 mb-1" />
        <p className="text-xs font-medium text-gray-700">Secure Payment</p>
        <p className="text-xs text-gray-500">Stripe checkout</p>
      </div>
      <div className="text-center">
        <Star className="h-6 w-6 mx-auto text-yellow-600 mb-1" />
        <p className="text-xs font-medium text-gray-700">5% UAE Tax Payer</p>
        <p className="text-xs text-gray-500">Supporting local economy</p>
      </div>
    </div>
  )
}

