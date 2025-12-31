'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/lib/cartStore'
import { useFavorites } from '@/components/FavoritesProvider'
import { usePWAMode } from '@/hooks/usePWAMode'
import { Minus, Plus, Heart, ShoppingCart } from 'lucide-react'

interface ProductActionFooterProps {
  product: Product
  selectedSize?: string
  selectedColor?: string
  locale?: string
}

export default function ProductActionFooter({
  product,
  selectedSize,
  selectedColor,
  locale = 'en'
}: ProductActionFooterProps) {
  const { isPWA, isClient } = usePWAMode()
  const { addItem } = useCartStore()
  const { isFavorite: checkIsFavorite, toggleFavorite } = useFavorites()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const isFavorite = checkIsFavorite(product.id)

  const incrementQuantity = () => {
    if (quantity < 99) setQuantity(q => q + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(q => q - 1)
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    
    // Simulate small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    addItem(product, quantity, selectedColor, selectedSize)

    // Reset quantity after adding
    setQuantity(1)
    setIsAdding(false)
  }

  const handleToggleFavorite = () => {
    toggleFavorite(product)
  }

  // Only render in PWA mode on mobile
  if (!isClient || !isPWA) {
    return null
  }

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed footer */}
      <div className="h-[140px] md:hidden" aria-hidden="true" />
      
      {/* Product Action Footer - PWA Only */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 bg-white md:hidden"
        style={{ 
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="p-4">
          {/* Quantity + Actions Row */}
          <div className="flex items-center gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-manipulation"
                aria-label={locale === 'ar' ? 'تقليل الكمية' : locale === 'ru' ? 'Уменьшить' : 'Decrease quantity'}
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-10 text-center font-semibold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                disabled={quantity >= 99}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-manipulation"
                aria-label={locale === 'ar' ? 'زيادة الكمية' : locale === 'ru' ? 'Увеличить' : 'Increase quantity'}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 bg-red-600 text-white h-12 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-700 active:bg-red-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors touch-manipulation"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>
                {isAdding 
                  ? (locale === 'ar' ? 'جاري الإضافة...' : locale === 'ru' ? 'Добавляем...' : 'Adding...')
                  : (locale === 'ar' ? 'أضف للسلة' : locale === 'ru' ? 'В корзину' : 'Add to Cart')
                }
              </span>
            </button>

            {/* Favorites Button */}
            <button
              onClick={handleToggleFavorite}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors touch-manipulation ${
                isFavorite
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={isFavorite 
                ? (locale === 'ar' ? 'إزالة من المفضلة' : locale === 'ru' ? 'Удалить из избранного' : 'Remove from favorites')
                : (locale === 'ar' ? 'إضافة للمفضلة' : locale === 'ru' ? 'Добавить в избранное' : 'Add to favorites')
              }
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

