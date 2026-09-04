'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Product } from '@/types'
import { useCartStore } from '@/lib/cartStore'
import { useFavorites } from '@/components/FavoritesProvider'
import { usePWAMode } from '@/hooks/usePWAMode'
import { getLocalizedPath } from '@/lib/i18n'
import { Minus, Plus, Heart, ShoppingCart } from 'lucide-react'

// Navigation Icons
const HomeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 2l9 7.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z"/>
    <path d="M9 22V12h6v10"/>
  </svg>
)

const ListIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)

const BagIcon = ({ filled, className }: { filled?: boolean; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    {filled ? (
      <>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"/>
        <path d="M3 6h18" stroke="white" strokeWidth="1.5"/>
        <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="1.5" fill="none"/>
      </>
    ) : (
      <>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </>
    )}
  </svg>
)

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
  const typedLocale = locale as 'en' | 'ar' | 'ru'
  const { isPWA: isPWAFromHook, isClient } = usePWAMode()
  const { addItem, getTotalItems } = useCartStore()
  const { isFavorite: checkIsFavorite, toggleFavorite } = useFavorites()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isPWADirect, setIsPWADirect] = useState(false)

  // Direct PWA check as fallback for iOS - runs on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const nav = navigator as Navigator & { standalone?: boolean }
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOSStandalone = nav.standalone === true
      if (isStandalone || isIOSStandalone) {
        setIsPWADirect(true)
      }
    }
  }, [])

  // Use either detection method
  const isPWA = isPWAFromHook || isPWADirect

  const isFavorite = checkIsFavorite(product.id)
  const cartCount = isClient ? getTotalItems() : 0
  const hasItemsInCart = cartCount > 0

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

  // Colors matching mobile app
  const inactiveColor = 'text-[#8E8E93]'
  const greenColor = 'text-[#10b981]'

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed footer */}
      <div className="h-[220px] md:hidden" aria-hidden="true" />
      
      {/* Product Action Footer - PWA Only */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-[9999] bg-[var(--cera-cream)] md:hidden"
        style={{ 
          borderTop: '1px solid #e5e5e5',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        {/* Product Actions Row */}
        <div className="px-4 pt-3 pb-3 bg-white">
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
              className="flex-1 bg-red-600 text-white h-11 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-700 active:bg-red-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors touch-manipulation"
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
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors touch-manipulation ${
                isFavorite
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={isFavorite 
                ? (locale === 'ar' ? 'إزالة من المفضلة' : locale === 'ru' ? 'Удалить из избранного' : 'Remove from favorites')
                : (locale === 'ar' ? 'إضافة للمفضلة' : locale === 'ru' ? 'Добавить в избранное' : 'Add to favorites')
              }
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gray-200" />

        {/* Navigation Tabs - Same as MobileFooterNav */}
        <div className="flex items-center justify-around h-[70px] bg-gray-50/80">
          {/* Home Tab */}
          <Link
            href={getLocalizedPath('/products', typedLocale)}
            className={`flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors touch-manipulation ${inactiveColor}`}
          >
            <HomeIcon className="w-7 h-7" />
            <span className="text-[11px] mt-1 font-medium">
              {locale === 'ar' ? 'الرئيسية' : locale === 'ru' ? 'Главная' : 'Home'}
            </span>
          </Link>

          {/* Orders Tab */}
          <Link
            href={getLocalizedPath('/orders', typedLocale)}
            className={`flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors touch-manipulation ${inactiveColor}`}
          >
            <ListIcon className="w-7 h-7" />
            <span className="text-[11px] mt-1 font-medium">
              {locale === 'ar' ? 'الطلبات' : locale === 'ru' ? 'Заказы' : 'Orders'}
            </span>
          </Link>

          {/* Bag Tab */}
          <Link
            href={getLocalizedPath('/cart', typedLocale)}
            className={`flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors touch-manipulation ${hasItemsInCart ? greenColor : inactiveColor}`}
          >
            <div className="relative">
              <BagIcon filled={hasItemsInCart} className="w-7 h-7" />
              {hasItemsInCart && (
                <span className="absolute -top-1 -right-2 bg-[var(--cera-rose-ink)] text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-1 font-medium">
              {locale === 'ar' ? 'السلة' : locale === 'ru' ? 'Корзина' : 'Bag'}
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}

