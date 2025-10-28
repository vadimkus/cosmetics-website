'use client'

import { Product } from '@/types'
import { Lock } from 'lucide-react'
import { User } from '@/types/user'

interface ProductVariantSelectorProps {
  product: Product
  selectedSize: string
  selectedColor: string
  availableSizes: Array<{ value: string; label: string; price: number }>
  availableColors: Array<{ value: string; label: string; hex?: string }>
  onSizeChange: (size: string) => void
  onColorChange: (color: string) => void
  user: User | null
}

export default function ProductVariantSelector({
  product,
  selectedSize,
  selectedColor,
  availableSizes,
  availableColors,
  onSizeChange,
  onColorChange,
  user
}: ProductVariantSelectorProps) {
  return (
    <>
      {/* Color Selection - Only for product ID 41 */}
      {product.id === '41' && availableColors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Color</label>
          </div>
          <div className="flex gap-2">
            {availableColors.map((color) => (
              <button
                key={color.value}
                onClick={() => onColorChange(color.value)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedColor === color.value
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {color.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">Size:</div>
          <div className="flex gap-3 flex-wrap">
            {availableSizes.map((option) => (
              <button
                key={option.value}
                onClick={() => onSizeChange(option.value)}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
                  selectedSize === option.value
                    ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span>{option.label}</span>
                  {user && user.canSeePrices ? (
                    <span className="text-xs text-gray-500">{option.price} AED</span>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}



