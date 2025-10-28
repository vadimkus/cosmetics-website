'use client'

import { Product } from '@/types'
import { User } from '@/types/user'
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { calculateDiscountedPrice, canUserSeePrices } from '@/lib/discountUtils'

interface ProductPriceDisplayProps {
  product: Product
  basePrice: number
  user: User | null
}

export default function ProductPriceDisplay({ product, basePrice, user }: ProductPriceDisplayProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-4 mt-12 pt-4 ml-[30%]">
      {canUserSeePrices(user) ? (
        <>
          {(() => {
            const productWithPrice = { ...product, price: basePrice }
            const pricing = calculateDiscountedPrice(productWithPrice, user)
            
            return (
              <div>
                {pricing.hasDiscount ? (
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl md:text-3xl font-bold text-primary-600">
                        {pricing.discountedPrice.toFixed(2)} AED
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {pricing.originalPrice.toFixed(2)} AED
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-600 font-medium">
                        {pricing.discountPercentage}% OFF
                      </span>
                      <span className="text-sm text-gray-600">(VAT included)</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-primary-600">
                      {pricing.originalPrice.toFixed(2)} AED
                    </div>
                    <div className="text-sm font-normal text-gray-600">(VAT included)</div>
                  </div>
                )}
              </div>
            )
          })()}
        </>
      ) : user ? (
        <div className="flex items-center text-gray-500">
          <Lock className="h-5 w-5 mr-2" />
          <span className="text-lg">Price locked</span>
        </div>
      ) : (
        <button
          onClick={() => router.push('/login')}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Login to see price
        </button>
      )}
    </div>
  )
}



