'use client'

import { Product } from '@/types'
import { User } from '@/types/user'
import { useTranslation } from '@/hooks/useTranslation'

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
  product: _product,
  selectedSize,
  selectedColor,
  availableSizes,
  availableColors,
  onSizeChange,
  onColorChange,
  user
}: ProductVariantSelectorProps) {
  const { t, dir } = useTranslation()
  
  return (
    <div dir={dir}>
      {/* Color Selection - For products with color variants */}
      {availableColors.length > 0 && (
        <div className="space-y-3">
          <div className={`flex items-center justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <label className="block text-sm font-medium text-gray-700">{t('product.color')}</label>
          </div>
          <div className={`flex gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            {availableColors.map((color) => (
              <button
                key={color.value}
                onClick={() => onColorChange(color.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all touch-manipulation min-h-[44px] bg-white ${
                  selectedColor === color.value
                    ? 'border-primary-600 ring-2 ring-primary-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {/* Color swatch */}
                <div
                  className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm flex-shrink-0"
                  style={{
                    backgroundColor: color.hex || '#FFFFFF',
                    borderColor: selectedColor === color.value ? '#2563eb' : '#d1d5db',
                  }}
                />
                {/* Color label */}
                <span className={`text-sm font-medium ${
                  selectedColor === color.value ? 'text-primary-700' : 'text-gray-700'
                }`}>
                  {color.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">{t('product.size')}:</div>
          <div className={`flex gap-3 flex-wrap ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            {availableSizes.map((option) => (
              <button
                key={option.value}
                onClick={() => onSizeChange(option.value)}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 text-sm touch-manipulation min-h-[44px] ${
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
    </div>
  )
}



