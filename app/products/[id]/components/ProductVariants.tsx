'use client'

import { Product } from '@/types'
import { useProductVariants } from '@/hooks/useProductVariants'

interface ProductVariantsProps {
  product: Product
  onSizeChange: (size: string) => void
  onColorChange: (color: string) => void
}

export default function ProductVariants({ 
  product, 
  onSizeChange, 
  onColorChange 
}: ProductVariantsProps) {
  const {
    selectedSize,
    selectedColor,
    availableSizes,
    availableColors,
    hasSizeVariants,
    hasColorVariants,
    setSelectedSize,
    setSelectedColor
  } = useProductVariants(product)

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
    onSizeChange(size)
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    onColorChange(color)
  }

  return (
    <div className="space-y-4">
      {/* Color Selection */}
      {hasColorVariants && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color: {selectedColor}
          </label>
          <div className="flex gap-2">
            {availableColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className={`w-8 h-8 rounded-full border-2 transition-colors ${
                  selectedColor === color.value
                    ? 'border-primary-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.label}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {hasSizeVariants && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size: {selectedSize}
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => handleSizeChange(size.value)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  selectedSize === size.value
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
