'use client'

import { memo } from 'react'
import { ShoppingCart, User, MessageCircle, Minus, Plus } from 'lucide-react'
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
  inCartQty,
  onAddToCart,
  onDecrementFromCart,
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
  
  // Authenticated user.
  //
  // - Not in cart → single primary "Add to Bag/Cart" button.
  // - In cart    → green [-] [N in Bag] [+] stepper so the user can adjust
  //                quantity in place without leaving the grid.
  //
  // The stepper operates on cart line(s) for this product as a whole, so
  // multi-variant products (e.g. Snow O2 Cleanser 180ml / 500ml) show the
  // total quantity across variants. "+" adds one more of the default
  // variant (same behaviour as the original Add to Bag button); "-" removes
  // the most recently added line's unit and deletes the line when it hits
  // zero.
  const isInCart = inCartQty > 0
  const inStateLabel = useBagText ? t('product.inBag') : t('product.inCart')
  const addStateLabel = useBagText ? t('product.addToBag') : t('product.addToCart')

  if (isInCart && product.inStock) {
    const decLabel = `${t('cart.decreaseQuantity') || 'Decrease quantity'} — ${product.name}`
    const incLabel = `${t('cart.increaseQuantity') || 'Increase quantity'} — ${product.name}`
    const isBusy = isAdding
    const stepperBase = `
      flex items-center justify-between gap-2
      rounded-lg font-medium w-full
      min-h-[44px] md:min-h-[40px]
      px-1 md:px-1.5 py-1 md:py-1
      bg-green-600 text-white
      transition-colors
    `
    const stepBtn = `
      inline-flex items-center justify-center
      h-8 w-8 md:h-8 md:w-8 rounded-md
      bg-white/15 hover:bg-white/25 active:bg-white/35
      transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
    `

    return (
      <div className="mt-2">
        <div
          className={stepperBase}
          role="group"
          aria-label={`${inStateLabel} (${inCartQty}) — ${product.name}`}
          style={touchStyles}
        >
          <button
            type="button"
            onClick={onDecrementFromCart}
            aria-label={decLabel}
            disabled={isBusy}
            className={stepBtn}
            style={touchStyles}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span
            className="flex-1 text-center text-body-xs tabular-nums select-none"
            aria-live="polite"
          >
            {`${inStateLabel} (${inCartQty})`}
          </span>
          <button
            type="button"
            onClick={onAddToCart}
            aria-label={incLabel}
            disabled={isBusy}
            className={stepBtn}
            style={touchStyles}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    )
  }

  const buttonText = isAdding ? t('product.adding') : addStateLabel
  const isDisabled = !product.inStock || isAdding

  let buttonColorClasses: string
  if (!product.inStock) {
    buttonColorClasses = 'bg-gray-300 text-gray-500 cursor-not-allowed'
  } else if (isAdding) {
    buttonColorClasses = 'bg-primary-600 text-white cursor-wait opacity-90'
  } else {
    buttonColorClasses = 'bg-primary-600 text-white hover:bg-primary-700'
  }

  const buttonClasses = `${baseButtonStyles} ${buttonColorClasses}`

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={onAddToCart}
        disabled={isDisabled}
        aria-label={buttonText}
        aria-live="polite"
        className={buttonClasses}
        style={touchStyles}
      >
        <ShoppingCart className="h-3 w-3 md:h-3.5 md:w-3.5" aria-hidden="true" />
        <span>{buttonText}</span>
      </button>
    </div>
  )
})

export default ProductActions
