'use client'

import { Product } from '@/types'
import { useProductPricing } from '@/hooks/useProductPricing'
import { useAuth } from '@/components/AuthProvider'

interface ProductPricingProps {
  product: Product
  selectedSize?: string
  selectedColor?: string
}

export default function ProductPricing({ 
  product, 
  selectedSize, 
  selectedColor 
}: ProductPricingProps) {
  const { user } = useAuth()
  const { currentPrice } = useProductPricing(product, selectedSize, selectedColor)

  if (!user) {
    return (
      <div className="flex items-center text-gray-500">
        <span className="text-sm">Please login to view pricing</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-2xl font-bold text-gray-900">
        {currentPrice.toFixed(2)} AED
      </div>
      <div className="text-sm font-normal text-gray-600">(VAT included)</div>
    </div>
  )
}
