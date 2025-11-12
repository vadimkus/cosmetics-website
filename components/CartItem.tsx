'use client'

import { CartItem as CartItemType } from '@/types'
import { useCart } from './CartProvider'
import { useAuth } from './AuthProvider'
import { Minus, Plus, Trash2, Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { calculateDiscountedPrice, canUserSeePrices } from '@/lib/discountUtils'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const { user } = useAuth()
  const { product, quantity, selectedColor, selectedSize } = item
  
  // Use selectedSize/selectedColor if available, otherwise fallback to product size
  const displaySize = (selectedSize && selectedSize.trim()) || (product.size && product.size.trim()) || null
  const displayColor = (selectedColor && selectedColor.trim()) || null

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity, selectedColor, selectedSize)
  }

  const handleRemove = () => {
    removeItem(product.id, selectedColor, selectedSize)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <Link href={`/products/${product.id}`} className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 mx-auto sm:mx-0 hover:opacity-80 transition-opacity">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg cursor-pointer"
            sizes="(max-width: 640px) 64px, 80px"
          />
        </Link>
        
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm md:text-base font-semibold text-gray-800 break-words hover:text-primary-600 transition-colors cursor-pointer leading-tight">{product.name}</h3>
          </Link>
          <p className="text-xs md:text-sm text-red-600">{product.category}</p>
          {(displaySize || displayColor) && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {displaySize && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs md:text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  Size: {displaySize}
                </span>
              )}
              {displayColor && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs md:text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
                  Color: {displayColor}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-center sm:justify-end space-x-3">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-3 sm:p-2 hover:bg-gray-100 transition-colors touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-gray-700 hover:text-gray-900"
              disabled={quantity <= 1}
            >
              <Minus className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
            <span className="px-3 md:px-4 py-3 sm:py-2 font-medium text-sm md:text-base text-black text-center min-w-[50px] sm:min-w-0">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-3 sm:p-2 hover:bg-gray-100 transition-colors touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-gray-700 hover:text-gray-900"
            >
              <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
          </div>
          
          <button
            onClick={handleRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-center sm:text-right">
          {canUserSeePrices(user) ? (
            <div>
              {(() => {
                const pricing = calculateDiscountedPrice(product, user)
                const totalPrice = pricing.discountedPrice * quantity
                const originalTotalPrice = pricing.originalPrice * quantity
                
                return (
                  <div>
                    {pricing.hasDiscount ? (
                      <div>
                        <div className="flex items-center justify-end gap-2">
                          <p className="text-base md:text-lg font-semibold text-gray-800">
                            {totalPrice.toFixed(2)} AED
                          </p>
                          <p className="text-sm text-gray-500 line-through">
                            {originalTotalPrice.toFixed(2)} AED
                          </p>
                        </div>
                        <p className="text-xs font-medium">
                          <span className="text-green-600">{pricing.discountPercentage}% OFF</span>
                          <span className="text-gray-400"> • </span>
                          <span className="text-red-600">VAT included</span>
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-base md:text-lg font-semibold text-gray-800">
                          {totalPrice.toFixed(2)} AED
                        </p>
                        <p className="text-xs text-red-600">VAT included</p>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          ) : (
            <div className="flex items-center justify-center text-gray-500">
              <Lock className="h-4 w-4 mr-1" />
              <span className="text-sm">Price access required</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
