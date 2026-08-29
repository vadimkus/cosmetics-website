'use client'

import { User } from '@/types/user'
import { ShoppingCart, Heart, Minus, Plus, MessageCircle, Check } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

interface ProductQuantityCartProps {
  user: User | null
  onAddToCart: (quantity: number) => Promise<void>
  onToggleFavorite: () => void
  isFavorite: boolean
  inStock?: boolean
  isPriceOnRequest?: boolean
  productName?: string
  /** Units of the currently selected product variant already in the cart. */
  inCartQty?: number
  /** Removes one unit from the currently selected cart line. */
  onDecrementFromCart?: () => void
}

export default function ProductQuantityCart({
  user,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  inStock = true,
  isPriceOnRequest = false,
  productName = '',
  inCartQty = 0,
  onDecrementFromCart
}: ProductQuantityCartProps) {
  const { t, dir } = useTranslation()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleIncrease = () => setQuantity(prev => Math.min(prev + 1, 99))
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await onAddToCart(quantity)
    } finally {
      setIsAdding(false)
    }
  }

  // "+" on the in-cart stepper always adds exactly one unit,
  // mirroring the grid-card stepper behaviour.
  const handleIncrementInCart = async () => {
    setIsAdding(true)
    try {
      await onAddToCart(1)
    } finally {
      setIsAdding(false)
    }
  }

  const isInCart = inCartQty > 0 && inStock && !!user

  // For price on request products, show only the request quote button
  if (isPriceOnRequest) {
    return (
      <div className="space-y-3 md:space-y-4" dir={dir}>
        <div className={`flex gap-2 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <a
            href={`https://wa.me/971585487665?text=${encodeURIComponent(`Hi, I'm interested in ${productName}. Could you please provide pricing information?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-medium transition-colors flex items-center justify-center gap-2 touch-manipulation bg-[var(--brand-whatsapp-deep)] text-white hover:bg-[var(--brand-whatsapp-hover)]"
          >
            <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
            {t('products.requestQuote') || 'Request Quote'}
          </a>
          
          <button
            onClick={onToggleFavorite}
            disabled={!user}
            className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium transition-colors border-2 touch-manipulation flex items-center justify-center ${
              isFavorite
                ? 'bg-red-50 border-red-500 text-red-600 hover:bg-red-100'
                : 'border-[var(--color-border-secondary)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-primary)]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={isFavorite ? t('product.removeFromFavorites') : t('product.addToFavorites')}
          >
            <Heart className={`h-4 w-4 md:h-5 md:w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 md:space-y-4" dir={dir}>
      {/* Quantity Selector - hidden once the item is in the cart, because the
          stepper below then controls the cart quantity directly. */}
      {!isInCart && (
        <div className={`flex items-center gap-3 md:gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <label className="text-xs md:text-sm font-medium text-[var(--color-text-secondary)]">{t('product.quantity')}:</label>
          <div className="flex items-center border border-[var(--color-border-secondary)] rounded-lg">
            {/* Explicit text colors: the page inherits white text in system
                dark mode, which made the unstyled qty number invisible. */}
            <button
              onClick={handleDecrease}
              className="p-1.5 md:p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors touch-manipulation min-h-[36px] md:min-h-[44px] min-w-[36px] md:min-w-[44px] flex items-center justify-center"
              aria-label={t('product.decreaseQuantity')}
            >
              <Minus className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
            <span className="px-3 md:px-4 py-1.5 md:py-2 text-center min-w-[2.5rem] md:min-w-[3rem] font-medium text-sm md:text-base text-[var(--color-text-primary)]">
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="p-1.5 md:p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors touch-manipulation min-h-[36px] md:min-h-[44px] min-w-[36px] md:min-w-[44px] flex items-center justify-center"
              aria-label={t('product.increaseQuantity')}
            >
              <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={`flex gap-2 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        {isInCart ? (
          /* In-cart state: [-] [In Cart (N)] [+] stepper that adjusts the cart
             line directly - same pattern as the product-grid cards and the
             mobile app. */
          <div
            className="flex-1 flex items-center justify-between gap-2 rounded-lg font-medium min-h-[44px] px-1.5 py-1 bg-[var(--status-green-deep)] text-white transition-colors"
            role="group"
            aria-label={`${t('product.inBag')} (${inCartQty}) - ${productName}`}
          >
            <button
              type="button"
              onClick={onDecrementFromCart}
              disabled={isAdding}
              className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-white/15 hover:bg-white/25 active:bg-white/35 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              aria-label={t('cart.decreaseQuantity') || 'Decrease quantity'}
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="flex-1 flex items-center justify-center gap-1.5 text-sm md:text-base tabular-nums select-none" aria-live="polite">
              <Check className="h-4 w-4" aria-hidden="true" />
              {`${t('product.inBag')} (${inCartQty})`}
            </span>
            <button
              type="button"
              onClick={handleIncrementInCart}
              disabled={isAdding}
              className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-white/15 hover:bg-white/25 active:bg-white/35 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              aria-label={t('cart.increaseQuantity') || 'Increase quantity'}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
        <button
          onClick={handleAddToCart}
          disabled={isAdding || !inStock}
          className={`flex-1 px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-medium transition-colors flex items-center justify-center gap-2 touch-manipulation ${
            !inStock || isAdding
              ? 'bg-[var(--color-border-secondary)] text-[var(--color-text-tertiary)] cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
          {/* Guests get an actionable "Login to Shop" (routes to /login via the
              page handler) instead of a dead disabled button. */}
          {!inStock
            ? t('product.outOfStock')
            : isAdding
            ? t('product.adding')
            : !user
            ? t('product.loginToShop')
            : (t('product.addToBag'))}
        </button>
        )}
        
        <button
          onClick={onToggleFavorite}
          disabled={!user}
          className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium transition-colors border-2 touch-manipulation flex items-center justify-center ${
            isFavorite
              ? 'bg-red-50 border-red-500 text-red-600 hover:bg-red-100'
              : 'border-[var(--color-border-secondary)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-primary)]'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isFavorite ? t('product.removeFromFavorites') : t('product.addToFavorites')}
        >
          <Heart className={`h-4 w-4 md:h-5 md:w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  )
}



