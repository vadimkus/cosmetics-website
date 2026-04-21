'use client'

import { memo } from 'react'
import { ShoppingCart, User, MessageCircle } from 'lucide-react'
import type { ProductActionsProps } from './types'

/**
 * ProductActions Component
 * 
 * Renders the call-to-action buttons including:
 * - Request Quote (for price on request products)
 * - Login to See Price (for unauthenticated users)
 * - Add to Cart/Bag (for authenticated users)
 * 
 * All buttons meet 44px minimum touch target for accessibility.
 */

// Shared button styles
const baseButtonStyles = `
  flex items-center justify-center gap-1.5 md:gap-2 
  px-2 md:px-3 py-2 md:py-2 
  rounded-lg font-medium transition-colors w-full 
  min-h-[44px] md:min-h-[40px] 
  text-body-xs active:scale-[0.98]
`

const touchStyles = {
  touchAction: 'manipulation' as const,
}

const ProductActions = memo(function ProductActions({
  product,
  user,
  isAdding,
  useBagText,
  onAddToCart,
  onLoginClick,
  t,
}: ProductActionsProps) {
  
  // Price on Request - WhatsApp contact
  if (product.isPriceOnRequest) {
    const whatsAppMessage = encodeURIComponent(
      `Hi, I'm interested in ${product.name}. Could you please provide pricing information?`
    )
    
    return (
      <div className="mt-2">
        <a
          href={`https://wa.me/971585487665?text=${whatsAppMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${baseButtonStyles} bg-green-500 text-white hover:bg-green-600`}
          style={touchStyles}
        >
          <MessageCircle 
            className="h-3.5 w-3.5 md:h-3.5 md:w-3.5" 
            aria-hidden="true" 
          />
          <span>{t('products.requestQuote')}</span>
        </a>
      </div>
    )
  }
  
  // Unauthenticated user - Login button.
  // Outlined/ghost style: still a clear CTA, but doesn't flood every card with
  // aggressive red. The real solid-red CTA is reserved for Add to Cart (below).
  if (!user) {
    return (
      <div className="mt-2">
        <button
          type="button"
          onClick={onLoginClick}
          className={`${baseButtonStyles} bg-white text-primary-700 border border-primary-600 hover:bg-primary-50`}
          aria-label={t('product.loginToSeePrice')}
          style={touchStyles}
        >
          <User 
            className="h-3.5 w-3.5 md:h-3.5 md:w-3.5" 
            aria-hidden="true" 
          />
          <span>{t('product.loginToSeePrice')}</span>
        </button>
      </div>
    )
  }
  
  // Authenticated user - Add to Cart/Bag button
  const buttonText = isAdding 
    ? t('product.adding') 
    : (useBagText ? t('product.addToBag') : t('product.addToCart'))
  
  const isDisabled = !product.inStock || isAdding
  
  const buttonClasses = `${baseButtonStyles} ${
    product.inStock && !isAdding
      ? 'bg-primary-600 text-white hover:bg-primary-700'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }`
  
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={onAddToCart}
        disabled={isDisabled}
        aria-label={buttonText}
        className={buttonClasses}
        style={touchStyles}
      >
        <ShoppingCart 
          className="h-3 w-3 md:h-3.5 md:w-3.5" 
          aria-hidden="true" 
        />
        <span>{buttonText}</span>
      </button>
    </div>
  )
})

export default ProductActions
