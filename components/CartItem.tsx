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
    <div className="bg-white rounded-lg shadow-sm border p-2 md:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4">
        <Link href={`/products/${product.id}`} className="relative w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 mx-auto sm:mx-0 hover:opacity-80 transition-opacity">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg cursor-pointer"
            sizes="(max-width: 640px) 56px, 80px"
          />
        </Link>
        
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-800 break-words hover:text-primary-600 transition-colors cursor-pointer leading-tight">{product.name}</h3>
          </Link>
          <p className="text-[10px] md:text-xs lg:text-sm text-red-600 mt-0.5">{product.category}</p>
          {(displaySize || displayColor) && (
            <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mt-1.5 md:mt-2">
              {displaySize && (
                <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs lg:text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  Size: {displaySize}
                </span>
              )}
              {displayColor && (
                <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs lg:text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
                  Color: {displayColor}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-center sm:justify-end space-x-2 md:space-x-3">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-2 md:p-2 hover:bg-gray-100 transition-colors touch-manipulation min-w-[40px] min-h-[40px] md:min-w-0 md:min-h-0 flex items-center justify-center text-gray-700 hover:text-gray-900"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-2 md:px-4 py-2 md:py-2 font-medium text-xs md:text-sm lg:text-base text-black text-center min-w-[40px] md:min-w-0">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-2 md:p-2 hover:bg-gray-100 transition-colors touch-manipulation min-w-[40px] min-h-[40px] md:min-w-0 md:min-h-0 flex items-center justify-center text-gray-700 hover:text-gray-900"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={handleRemove}
            className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
          >
            <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
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
                        <div className="flex items-center justify-center sm:justify-end gap-1.5 md:gap-2">
                          <p className="text-sm md:text-base lg:text-lg font-semibold text-gray-800">
                            {totalPrice.toFixed(2)} AED
                          </p>
                          <p className="text-xs md:text-sm text-gray-500 line-through">
                            {originalTotalPrice.toFixed(2)} AED
                          </p>
                        </div>
                        <p className="text-[10px] md:text-xs font-medium mt-0.5">
                          <span className="text-green-600">{pricing.discountPercentage}% OFF</span>
                          <span className="text-gray-400"> • </span>
                          <span className="text-red-600">VAT included</span>
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm md:text-base lg:text-lg font-semibold text-gray-800">
                          {totalPrice.toFixed(2)} AED
                        </p>
                        <p className="text-[10px] md:text-xs text-red-600 mt-0.5">VAT included</p>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          ) : (
            <div className="flex items-center justify-center text-gray-500">
              <Lock className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
              <span className="text-xs md:text-sm">Price access required</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
