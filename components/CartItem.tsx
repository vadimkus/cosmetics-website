'use client'

import { CartItem as CartItemType } from '@/types'
import { useCart } from './CartProvider'
import { useAuth } from './AuthProvider'
import { Minus, Plus, Trash2, Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { calculateDiscountedPrice, canUserSeePrices } from '@/lib/discountUtils'
import { useTranslation } from '@/hooks/useTranslation'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const { user } = useAuth()
  const { t, dir } = useTranslation()
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
      <div className={`flex items-start gap-3 md:gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        {/* Left: Product Image + Size */}
        <div className="flex flex-col flex-shrink-0">
          <Link href={`/products/${product.id}`} className="relative w-20 h-20 md:w-24 md:h-24 hover:opacity-80 transition-opacity">
            <Image
              src={product.image}
              alt={`${product.name} - GENOSYS Korean ${product.category || 'dermacosmetics'} product in cart`}
              fill
              className="object-cover rounded-lg cursor-pointer"
              sizes="(max-width: 640px) 80px, 96px"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </Link>
          {/* Size below image */}
          {displaySize && (
            <span className="mt-2 text-center text-[10px] md:text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded px-1 py-0.5">
              {t('product.size')}: {displaySize}
            </span>
          )}
        </div>
        
        {/* Middle: Product Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm md:text-base font-bold text-gray-900 break-words hover:text-primary-600 transition-colors cursor-pointer leading-tight mb-1">{product.name}</h3>
          </Link>
          <p className="text-xs md:text-sm text-red-600 mb-2">{product.category}</p>
          
          {/* Color badge only - Size is shown below image */}
          {displayColor && (
            <div className="flex items-center gap-1.5 md:gap-2 mb-2 flex-nowrap overflow-x-auto">
              <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs lg:text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap flex-shrink-0">
                {t('product.color')}: {displayColor}
              </span>
            </div>
          )}
          
          {/* Price - Prominently displayed */}
          {canUserSeePrices(user) ? (
            <div className="mt-2">
              {(() => {
                const pricing = calculateDiscountedPrice(product, user)
                const totalPrice = pricing.discountedPrice * quantity
                const originalTotalPrice = pricing.originalPrice * quantity
                
                return (
                  <div>
                    {pricing.hasDiscount ? (
                      <div>
                        <div className={`flex items-baseline gap-1.5 flex-nowrap ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <p className="text-sm md:text-lg font-bold text-gray-900 whitespace-nowrap">
                            {totalPrice.toFixed(2)} AED
                          </p>
                          <p className="text-xs md:text-sm text-gray-500 line-through whitespace-nowrap">
                            {originalTotalPrice.toFixed(2)} AED
                          </p>
                        </div>
                        <div className={`flex items-center gap-1 mt-0.5 flex-nowrap ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[10px] md:text-xs font-medium text-green-600 whitespace-nowrap">
                            {pricing.discountPercentage}% {t('product.off')}
                          </span>
                          <span className="text-[10px] md:text-xs text-red-600 whitespace-nowrap">{t('product.vatIncluded')}</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-base md:text-lg font-bold text-gray-900">
                          {totalPrice.toFixed(2)} AED
                        </p>
                        <p className="text-xs text-red-600 mt-1">{t('product.vatIncluded')}</p>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          ) : (
            <div className={`flex items-center text-gray-500 mt-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Lock className={`h-4 w-4 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
              <span className="text-sm">{t('profile.priceAccessRequired')}</span>
            </div>
          )}
        </div>
        
        {/* Right: Quantity Controls + Delete */}
        <div className="flex flex-col items-center gap-1 md:gap-2 flex-shrink-0">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-2 md:p-2.5 hover:bg-gray-100 transition-colors touch-manipulation flex items-center justify-center text-gray-700 hover:text-gray-900"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <span className="px-3 md:px-4 py-2 md:py-2.5 font-medium text-sm md:text-base text-black text-center min-w-[36px] md:min-w-[40px]">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-2 md:p-2.5 hover:bg-gray-100 transition-colors touch-manipulation flex items-center justify-center text-gray-700 hover:text-gray-900"
            >
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>
          
          <button
            onClick={handleRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation ml-3 md:ml-0 -mt-1 md:mt-0"
          >
            <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
