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
      <div className="flex items-center gap-2 md:gap-4">
        {/* Left: Picture + Description + Size */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Link href={`/products/${product.id}`} className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 hover:opacity-80 transition-opacity">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-lg cursor-pointer"
              sizes="(max-width: 640px) 48px, 64px"
            />
          </Link>
          
          <div className="flex-1 min-w-0">
            <Link href={`/products/${product.id}`}>
              <h3 className="text-xs md:text-sm font-semibold text-gray-800 break-words hover:text-primary-600 transition-colors cursor-pointer leading-tight line-clamp-1">{product.name}</h3>
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <p className="text-[10px] md:text-xs text-red-600">{product.category}</p>
              {displaySize && (
                <span className="inline-flex items-center px-1 py-0.5 rounded text-[10px] md:text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  {displaySize}
                </span>
              )}
              {displayColor && (
                <span className="inline-flex items-center px-1 py-0.5 rounded text-[10px] md:text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                  {displayColor}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Right: Quantity Controls + Delete */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-1.5 md:p-2 hover:bg-gray-100 transition-colors touch-manipulation flex items-center justify-center text-gray-700 hover:text-gray-900"
              disabled={quantity <= 1}
            >
              <Minus className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
            <span className="px-2 md:px-3 py-1.5 md:py-2 font-medium text-xs md:text-sm text-black text-center min-w-[28px] md:min-w-[32px]">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-1.5 md:p-2 hover:bg-gray-100 transition-colors touch-manipulation flex items-center justify-center text-gray-700 hover:text-gray-900"
            >
              <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
          </div>
          
          <button
            onClick={handleRemove}
            className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
          >
            <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </button>
        </div>
      </div>
      
      {/* Price below on mobile, or can be shown inline on desktop */}
      <div className="mt-2 md:hidden">
        {canUserSeePrices(user) ? (
          <div>
            {(() => {
              const pricing = calculateDiscountedPrice(product, user)
              const totalPrice = pricing.discountedPrice * quantity
              const originalTotalPrice = pricing.originalPrice * quantity
              
              return (
                <div className="flex items-center gap-2">
                  {pricing.hasDiscount ? (
                    <>
                      <p className="text-sm font-semibold text-gray-800">
                        {totalPrice.toFixed(2)} AED
                      </p>
                      <p className="text-xs text-gray-500 line-through">
                        {originalTotalPrice.toFixed(2)} AED
                      </p>
                      <span className="text-[10px] text-green-600 font-medium">{pricing.discountPercentage}% OFF</span>
                    </>
                  ) : (
                    <p className="text-sm font-semibold text-gray-800">
                      {totalPrice.toFixed(2)} AED
                    </p>
                  )}
                </div>
              )
            })()}
          </div>
        ) : (
          <div className="flex items-center text-gray-500">
            <Lock className="h-3 w-3 mr-1" />
            <span className="text-xs">Price access required</span>
          </div>
        )}
      </div>
    </div>
  )
}
