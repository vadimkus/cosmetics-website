'use client'

import { memo } from 'react'
import { Check, ShoppingCart, User, MessageCircle, Minus, Plus } from 'lucide-react'
import { isProductOptionSelectionRequired } from '@/lib/productOptions'
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
  inCartQty,
  canAdjustInline,
  onAddToCart,
  onIncrementCart,
  onDecrementFromCart,
  onOpenCart,
  onChooseOptions,
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
          className={`${baseButtonStyles} bg-[var(--brand-whatsapp-deep)] text-white hover:bg-[var(--brand-whatsapp-hover)]`}
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
          className={`${baseButtonStyles} border border-[var(--cera-line)] bg-white text-[var(--cera-ink)] hover:border-[var(--cera-blush-deep)] hover:bg-[var(--cera-cream)]`}
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
  // - In one exact cart line → neutral, touch-safe quantity stepper.
  // - Multiple variants/bundle lines → View Bag; never mutate an ambiguous
  //   aggregate from a compact product card.
  const isInCart = inCartQty > 0
  const inStateLabel = t('product.inBag')
  const addStateLabel = t('product.addToBag')
  const requiresOptions = isProductOptionSelectionRequired(product)

  if (isInCart) {
    const decLabel = `${t('cart.decreaseQuantity') || 'Decrease quantity'} - ${product.name}`
    const incLabel = `${t('cart.increaseQuantity') || 'Increase quantity'} - ${product.name}`
    const isBusy = isAdding

    if (isAdding) {
      return (
        <div className="mt-2">
          <div
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-[var(--cera-ok-line)] bg-[var(--cera-ok-bg)] px-3 text-body-xs font-semibold text-[var(--cera-ok)]"
            role="status"
            aria-live="polite"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            <span>{t('product.addedToBag')}</span>
          </div>
        </div>
      )
    }

    if (!product.inStock || !canAdjustInline) {
      return (
        <div className="mt-2">
          <button
            type="button"
            onClick={onOpenCart}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--cera-line)] bg-white px-3 text-body-xs font-semibold text-[var(--cera-ink)] transition-colors hover:border-[var(--cera-blush-deep)] hover:bg-[var(--cera-cream)]"
            aria-label={`${t('product.viewBag')} - ${product.name}`}
            style={touchStyles}
          >
            <ShoppingCart className="h-4 w-4 text-[var(--cera-rose)]" aria-hidden="true" />
            <span>{t('product.viewBag')} ({inCartQty})</span>
          </button>
        </div>
      )
    }

    return (
      <div className="mt-2">
        <div
          className="flex min-h-12 w-full items-stretch overflow-hidden rounded-lg border border-[var(--cera-ok)] bg-[var(--cera-ok)] font-medium text-white shadow-sm"
          role="group"
          aria-label={`${inStateLabel} (${inCartQty}) - ${product.name}`}
          style={touchStyles}
        >
          <button
            type="button"
            onClick={onDecrementFromCart}
            aria-label={decLabel}
            disabled={isBusy}
            className="inline-flex min-h-12 min-w-12 items-center justify-center border-e border-white/25 text-white transition-colors hover:bg-white/15 active:bg-white/25 disabled:cursor-not-allowed disabled:opacity-50"
            style={touchStyles}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span
            className="flex min-w-0 flex-1 items-center justify-center px-1 text-center text-body-xs font-semibold tabular-nums text-white select-none"
            aria-live="polite"
          >
            <span className="truncate">{inCartQty} {inStateLabel.toLowerCase()}</span>
          </span>
          <button
            type="button"
            onClick={onIncrementCart}
            aria-label={incLabel}
            disabled={isBusy}
            className="inline-flex min-h-12 min-w-12 items-center justify-center border-s border-white/25 text-white transition-colors hover:bg-white/15 active:bg-white/25 disabled:cursor-not-allowed disabled:opacity-50"
            style={touchStyles}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    )
  }

  const buttonText = isAdding
    ? t('product.adding')
    : requiresOptions
      ? t('product.chooseOptions')
      : addStateLabel
  const isDisabled = !product.inStock || isAdding

  let buttonColorClasses: string
  if (!product.inStock) {
    buttonColorClasses = 'bg-[var(--color-border-secondary)] text-[var(--color-text-tertiary)] cursor-not-allowed'
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
        onClick={requiresOptions ? onChooseOptions : onAddToCart}
        disabled={isDisabled}
        aria-label={`${buttonText} - ${product.name}`}
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
