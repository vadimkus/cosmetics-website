'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Plus, X, ShoppingBag, ChevronRight, Sparkles, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useCartStore } from '@/lib/cartStore'
import { useAnimationStore } from '@/lib/animationStore'
import { useBundleStore, ROUTINE_STEPS, DISCOUNT_TIERS, getBundleDiscountForCount, type RoutineStep, type BundlePricing } from '@/lib/bundleStore'
import { useAuth } from '@/components/auth/AuthProvider'
import { canUserSeePrices } from '@/lib/discountUtils'
import { getCartLinePricing } from '@/lib/cartPricing'
import { Product } from '@/types'
import type { ApiUser, User } from '@/types/user'
import BottomSheet from '@/components/ui/BottomSheet'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

interface BundleBuilderClientProps {
  products: Product[]
}

/**
 * Step Indicator - Shows progress through routine steps
 */
function StepIndicator({ 
  steps, 
  currentStep, 
  onStepClick,
  getItemCountForStep 
}: { 
  steps: RoutineStep[]
  currentStep: number
  onStepClick: (index: number) => void
  getItemCountForStep: (stepId: string) => number
}) {
  const { t } = useTranslation()
  
  return (
    // The scroll container centres its content with `w-max mx-auto` on the inner row rather
    // than `justify-center` on the scroller itself. Centring content that overflows leaves
    // the first steps unreachable - the overflow spills both ways and browsers will not
    // scroll back past the start edge. This keeps the row centred while it fits and lets it
    // scroll from the first step once it does not.
    <div className="overflow-x-auto py-2 px-4 -mx-4 scrollbar-hide">
      <div className="mx-auto flex w-max items-center gap-1 sm:gap-2">
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const itemCount = getItemCountForStep(step.id)
        const hasItem = itemCount > 0
        const isPast = index < currentStep
        
        return (
          <button
            key={step.id}
            onClick={() => onStepClick(index)}
            className={`
              flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-full text-xs sm:text-sm font-medium
              transition-all duration-300 whitespace-nowrap min-w-fit
              ${isActive 
                ? 'bg-[var(--cera-cta)] text-white shadow-lg scale-105' 
                : hasItem 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : isPast
                    ? 'bg-[var(--cera-cream-deep)] text-[var(--cera-muted)]'
                    : 'bg-[var(--cera-cream-deep)] text-[var(--cera-body)] hover:bg-[var(--cera-cream-deep)]'
              }
            `}
          >
            {hasItem ? (
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                {itemCount > 1 && <span className="text-xs">{itemCount}</span>}
              </span>
            ) : (
              <span className="text-sm">{step.icon}</span>
            )}
            <span className="hidden sm:inline">{t(`bundleBuilder.steps.${step.id}`) || step.name}</span>
            <span className="sm:hidden">{index + 1}</span>
          </button>
        )
      })}
      </div>
    </div>
  )
}

/**
 * Get localized description based on locale
 */
function getLocalizedDescription(product: Product, locale: string): string | undefined {
  if (locale === 'ru' && product.descriptionRu) return product.descriptionRu
  if (locale === 'ar' && product.descriptionAr) return product.descriptionAr
  return product.description
}

function getBundleRetailPrice(product: Product): number {
  const variants = (Array.isArray(product.variants) ? product.variants : []).filter(
    (variant) => String(variant.size || '').trim() || String(variant.color || '').trim()
  )
  const explicitSize = String(product.size || '').trim()
  const selectedVariant =
    (explicitSize && variants.find((variant) => String(variant.size || '').trim() === explicitSize)) ||
    variants.find((variant) => variant.isDefault) ||
    variants.find((variant) => variant.available !== false) ||
    variants[0]
  const variantPrice = Number(selectedVariant?.price)

  // Build Your Set should use actual selected/default retail, not regular
  // pricing-contract originals such as VIP/sale basePrice.
  if (Number.isFinite(variantPrice) && variantPrice > 0) return variantPrice

  return Number(product.price || 0) || 0
}

function toBundleCartProduct(product: Product, bundleDiscountPercent: number): Product {
  const retailPrice = getBundleRetailPrice(product)
  return {
    ...product,
    price: retailPrice,
    originalPrice: null,
    fromBundle: true,
    bundleDiscountPercent,
  } as Product & { originalPrice: null; fromBundle: boolean; bundleDiscountPercent: number }
}

function getBundleLinePricing(product: Product, user: User | ApiUser | null, bundleDiscountPercent: number) {
  return getCartLinePricing({
    product,
    quantity: 1,
    selectedColor: '',
    selectedSize: '',
    fromBundle: true,
    bundleDiscountPercent,
  }, user)
}

/**
 * Product Card for Bundle Selection
 * - Single click on unselected item: opens detail view
 * - Single click on selected item: deselects it
 * - Double click/tap: toggles selection (quick add/remove)
 */
function BundleProductCard({
  product,
  isSelected,
  onSelect,
  onViewDetails,
  showPrices,
  locale,
}: {
  product: Product
  isSelected: boolean
  onSelect: () => void
  onViewDetails: (product: Product) => void
  showPrices: boolean
  locale: string
}) {
  const { t } = useTranslation()
  const { enabled: animationsEnabled } = useAnimationStore()
  
  // Double-tap detection for mobile
  const lastTapRef = useRef<number>(0)
  const DOUBLE_TAP_DELAY = 300 // ms
  
  const handleClick = () => {
    const now = Date.now()
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap/click - quick add/remove (toggle)
      onSelect()
      lastTapRef.current = 0
    } else if (isSelected) {
      // Single click on selected item - deselect it
      onSelect()
      lastTapRef.current = 0
    } else {
      // Single click on unselected item - open detail view
      onViewDetails(product)
      lastTapRef.current = now
    }
  }
  
  const MotionDiv = animationsEnabled ? motion.div : 'div'
  
  return (
    <MotionDiv
      {...(animationsEnabled ? {
        whileHover: { y: -2 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2 }
      } : {})}
      onClick={handleClick}
      className={`
        relative cursor-pointer rounded-2xl overflow-hidden
        transition-all duration-300 select-none
        ${isSelected 
          ? 'ring-2 ring-[var(--cera-ink)] shadow-lg bg-[var(--cera-cream-deep)]' 
          : 'bg-white hover:shadow-md border border-[var(--cera-line)]'
        }
      `}
    >
      {/* Selection Badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 bg-[var(--cera-cta)] text-white rounded-full p-1.5">
          <Check className="w-3 h-3" />
        </div>
      )}
      
      {/* No VIP discount badge in bundle builder - only bundle discount applies at checkout */}
      
      {/* Product Image - same presentation as the products-page card: white
          square frame, photo edge-to-edge. object-cover center-crops the
          956×662 landscape studio shots to fill the tile (verified safe:
          products are centered), so no white letterbox bands appear. */}
      <div className="relative aspect-square bg-white overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      
      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <h3 className="text-sm font-medium text-[var(--cera-ink)] line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        {/* Product Size */}
        {product.size && (
          <p className="text-xs text-[var(--cera-muted)] mt-1">
            {product.size}
          </p>
        )}
        {/* Product Description */}
        {getLocalizedDescription(product, locale) && (
          <p className="text-[11px] text-[var(--cera-muted)] mt-1.5 line-clamp-2 leading-relaxed">
            {getLocalizedDescription(product, locale)}
          </p>
        )}
        <div className="mt-2">
          {showPrices ? (
            <div className="flex flex-col">
              {/* Bundle builder: show retail price only - no VIP discount */}
              {(
                <span className="text-base font-semibold text-[var(--cera-ink)]">
                  {getBundleRetailPrice(product).toFixed(2)} {t('common.aed')}
                </span>
              )}
              <span className="text-[10px] text-[var(--cera-muted)] mt-0.5">
                5% {t('product.vatIncluded')}
              </span>
            </div>
          ) : (
            <span className="text-xs text-[var(--cera-muted)]">
              {t('product.loginToSeePrice')}
            </span>
          )}
        </div>
        {!isSelected && showPrices && (
          <div className="mt-2 flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSelect()
              }}
              className="text-xs text-[var(--cera-muted)] hover:text-[var(--cera-body)] flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-[var(--cera-cream-deep)] active:bg-[var(--cera-cream-deep)] transition-colors"
            >
              <Plus className="w-3 h-3" />
              {t('bundleBuilder.add')}
            </button>
          </div>
        )}
      </div>
    </MotionDiv>
  )
}

/**
 * Bundle Summary Sidebar / Bottom Sheet
 */
function BundleSummary({
  onAddToCart,
  onClear,
  showPrices,
  pricing,
  user,
}: {
  onAddToCart: () => void
  onClear: () => void
  showPrices: boolean
  pricing: BundlePricing
  user: User | ApiUser | null
}) {
  const { t } = useTranslation()
  const { items, removeItem, canAddToCart } = useBundleStore()
  
  if (items.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--cera-cream-deep)] flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-[var(--cera-muted)]" />
        </div>
        <p className="text-[var(--cera-muted)] text-sm">
          {t('bundleBuilder.emptyBundle')}
        </p>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Items List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {items.map((item, index) => {
          const linePricing = getBundleLinePricing(item.product, user, pricing.bundleDiscountPercent ?? pricing.discountPercent)
          const retailPrice = linePricing.retailUnitPrice
          const displayPrice = linePricing.unitPrice
          const hasDiscount = linePricing.discountAmount > 0
          return (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 bg-[var(--cera-cream-deep)] rounded-xl p-3"
            >
              {/* Image with size below */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-14 h-14 bg-white rounded-lg overflow-hidden">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {item.product.size && (
                  <p className="text-[9px] text-[var(--cera-muted)] mt-0.5 text-center">
                    {item.product.size}
                  </p>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--cera-ink)] truncate">
                  {item.product.name}
                </p>
                <p className="text-xs text-[var(--cera-muted)]">
                  {t(`bundleBuilder.steps.${item.step}`)}
                </p>
                {/* Bundle discount badge per item */}
                {showPrices && hasDiscount && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-green-700 font-medium mt-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    -{linePricing.discountPercentage}%
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                {showPrices && (
                  <div className="text-right">
                    <span className="text-sm font-medium text-[var(--cera-ink)] whitespace-nowrap">
                      {t('common.aed')} {displayPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <p className="text-[10px] text-[var(--cera-muted)] line-through">
                        {t('common.aed')} {retailPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-1.5 rounded-full hover:bg-[var(--cera-cream-deep)] transition-colors"
                  aria-label={t('common.delete')}
                >
                  <X className="w-4 h-4 text-[var(--cera-muted)]" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {/* Pricing Summary - Only show if user can see prices */}
      {showPrices ? (
        <div className="border-t border-[var(--cera-line)] pt-4 space-y-2">
          {(() => {
            // Bundle builder: no VIP discount - only bundle tier discount on retail price
            const totalSavings = pricing.subtotal - pricing.total
            
            return (
              <>
                {/* Retail Subtotal */}
                {pricing.discountPercent > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--cera-muted)]">{t('bundleBuilder.subtotal')}</span>
                    <span className="text-[var(--cera-muted)] line-through">{pricing.subtotal.toFixed(2)} {t('common.aed')}</span>
                  </div>
                )}
                {pricing.discountPercent === 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--cera-muted)]">{t('bundleBuilder.subtotal')}</span>
                    <span className="text-[var(--cera-ink)]">{pricing.subtotal.toFixed(2)} {t('common.aed')}</span>
                  </div>
                )}
                
                {/* Discount row - label follows the discount that actually won (bundle vs VIP) */}
                {pricing.discountPercent > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">
                      {(pricing.appliedDiscountType === 'user' || pricing.appliedDiscountType === 'black_friday')
                        ? t('bundleBuilder.vipDiscount')
                        : pricing.appliedDiscountType === 'mixed'
                          ? t('bundleBuilder.discountApplied')
                          : t('bundleBuilder.discount')} ({pricing.discountPercent}%)
                    </span>
                    <span className="text-green-700">-{pricing.discountAmount.toFixed(2)} {t('common.aed')}</span>
                  </div>
                )}
                
                {/* Next Tier Hint */}
                {pricing.appliedDiscountType === 'bundle' && pricing.nextTierItems !== null && pricing.nextTierDiscount !== null && (
                  <div className="bg-amber-50 text-amber-800 rounded-lg p-3 text-xs mt-2">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    {t('bundleBuilder.nextTierHint', { 
                      items: pricing.nextTierItems, 
                      discount: pricing.nextTierDiscount 
                    })}
                  </div>
                )}
                
                {/* Total */}
                <div className="flex justify-between items-center pt-3 mt-2 border-t border-[var(--cera-line)]">
                  <div>
                    <span className="text-base font-semibold text-[var(--cera-ink)]">
                      {t('bundleBuilder.total')}
                    </span>
                    <p className="text-[10px] text-[var(--cera-muted)]">5% {t('product.vatIncluded')}</p>
                  </div>
                  <span className="text-xl font-bold text-[var(--cera-ink)]">
                    {pricing.total.toFixed(2)} {t('common.aed')}
                  </span>
                </div>
                
                {/* Total Savings Badge */}
                {totalSavings > 0.01 && (
                  <div className="text-center pt-1">
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                      {t('bundleBuilder.youSave', { amount: totalSavings.toFixed(2) })}
                    </span>
                  </div>
                )}
              </>
            )
          })()}
          
          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={onAddToCart}
              disabled={!canAddToCart()}
              className={`
                w-full py-3.5 rounded-xl font-medium text-sm
                transition-all duration-200
                ${canAddToCart()
                  ? 'bg-[var(--cera-rose)] text-white hover:bg-[var(--cera-rose-ink)] active:scale-[0.98]'
                  : 'bg-[var(--cera-cream-deep)] text-[var(--cera-muted)] cursor-not-allowed'
                }
              `}
            >
              {canAddToCart() 
                ? t('bundleBuilder.addToCart')
                : t('bundleBuilder.addMoreItems', { count: 2 - items.length })
              }
            </button>
            
            {items.length > 0 && (
              <button
                onClick={onClear}
                className="w-full py-2 text-sm text-[var(--cera-muted)] hover:text-[var(--cera-body)] transition-colors"
              >
                {t('bundleBuilder.clearAll')}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Login to see prices message */
        <div className="border-t border-[var(--cera-line)] pt-4 space-y-3">
          <div className="text-center py-4">
            <p className="text-sm text-[var(--cera-muted)] mb-3">
              {t('product.loginToSeePrice')}
            </p>
            <p className="text-xs text-[var(--cera-muted)]">
              {items.length} {t('bundleBuilder.items')} {t('bundleBuilder.selected')}
            </p>
          </div>
          
          {/* Clear button still available */}
          {items.length > 0 && (
            <button
              onClick={onClear}
              className="w-full py-2 text-sm text-[var(--cera-muted)] hover:text-[var(--cera-body)] transition-colors"
            >
              {t('bundleBuilder.clearAll')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Main Bundle Builder Client Component
 */
export default function BundleBuilderClient({ products }: BundleBuilderClientProps) {
  const { t, locale } = useTranslation()
  const router = useRouter()
  const { addBundleItems } = useCartStore()
  const { user } = useAuth()
  
  // Check if user can see prices
  const showPrices = canUserSeePrices(user)
  
  const {
    items,
    currentStep,
    setCurrentStep,
    addItem,
    hasItemForStep,
    getItemCountForStep,
    clearBundle,
  } = useBundleStore()
  
  // Compute pricing reactively based on items (using user's discounted prices)
  const pricing: BundlePricing = useMemo(() => {
    const itemCount = items.length
    const bundleDiscountPercent = getBundleDiscountForCount(itemCount)

    // Bundle and VIP/Black Friday discounts are mutually exclusive.
    // Reuse the cart/checkout line helper so desktop web, mobile web, and
    // checkout all show the same "best discount wins" outcome.
    const linePricings = items.map((item) =>
      getBundleLinePricing(item.product, user, bundleDiscountPercent)
    )
    const subtotal = linePricings.reduce((sum, line) => sum + line.retailLineTotal, 0)
    const total = linePricings.reduce((sum, line) => sum + line.lineTotal, 0)
    const discountAmount = Math.round((subtotal - total) * 100) / 100
    const discountedLines = linePricings.filter((line) => line.discountAmount > 0)
    const discountTypes = Array.from(new Set(discountedLines.map((line) => line.discountType)))
    let appliedDiscountType: BundlePricing['appliedDiscountType'] = 'none'
    if (discountTypes.length > 1) {
      appliedDiscountType = 'mixed'
    } else if (discountTypes.length === 1) {
      const onlyType = discountTypes[0]
      appliedDiscountType =
        onlyType === 'bundle' || onlyType === 'user' || onlyType === 'black_friday'
          ? onlyType
          : 'mixed'
    }
    const discountPercent = discountedLines.reduce((max, line) => Math.max(max, line.discountPercentage), 0)
    
    let nextTierItems: number | null = null
    let nextTierDiscount: number | null = null
    
    for (const tier of DISCOUNT_TIERS) {
      if (itemCount < tier.minItems) {
        nextTierItems = tier.minItems - itemCount
        nextTierDiscount = tier.discount
        break
      }
    }
    
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      bundleDiscountPercent,
      discountPercent,
      discountAmount,
      total: Math.round(total * 100) / 100,
      itemCount,
      nextTierItems,
      nextTierDiscount,
      appliedDiscountType,
    }
  }, [items, user])
  
  const [showMobileSummary, setShowMobileSummary] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [detailProduct, setDetailProduct] = useState<Product | null>(null)
  const [showDoubleTapHint, setShowDoubleTapHint] = useState(false)
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Show double-click/tap hint on first visit
  useEffect(() => {
    const hasSeenHint = localStorage.getItem('bundleDoubleTapHint')
    if (hasSeenHint) return
    
    setShowDoubleTapHint(true)
    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setShowDoubleTapHint(false)
      localStorage.setItem('bundleDoubleTapHint', 'true')
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])
  
  const currentStepData = ROUTINE_STEPS[currentStep]
  
  // Filter products for current step
  const stepProducts = useMemo(() => {
    if (!currentStepData) return []
    
    return products.filter(product => {
      const category = product.category.toLowerCase()
      const stepCategory = currentStepData.category.toLowerCase()
      
      // Handle special category mappings
      if (currentStepData.id === 'toner') {
        return category.includes('toner') || category.includes('mist')
      }
      if (currentStepData.id === 'eye-care') {
        return category.includes('eye')
      }
      if (currentStepData.id === 'serum') {
        // Bio Meso PDRN ampoules are serum-type treatments
        return category.includes('serum') || category.includes('bio meso')
      }
      
      return category.includes(stepCategory)
    })
  }, [products, currentStepData])
  
  // Selected product IDs across ALL steps. Must be global, not per-step:
  // multi-category products (e.g. cushions tagged "Cushion BB, Sun, Cream")
  // appear in more than one step, and addItem() toggles by product id
  // globally - a per-step indicator made the same product look unselected
  // in the sibling step, where "Add to Set" would silently REMOVE it.
  const selectedProductIds = useMemo(() => {
    return items.map(i => i.product.id)
  }, [items])
  
  // Handle product selection
  const handleProductSelect = (product: Product) => {
    if (currentStepData) {
      addItem(product, currentStepData.id)
    }
  }
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep < ROUTINE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  // Handle add bundle to cart - then redirect to checkout
  const handleAddToCart = () => {
    // Use the computed pricing (with user discounts) to get the bundle discount percentage
    const bundleDiscountPercent = pricing.bundleDiscountPercent ?? pricing.discountPercent
    
    // Add as one batch so the first item is not reconciled as a single
    // non-qualifying bundle line before the rest are present.
    addBundleItems(
      items.map(item => toBundleCartProduct(item.product, bundleDiscountPercent)),
      bundleDiscountPercent
    )
    
    // Clear the bundle after adding to cart
    clearBundle()
    
    // Redirect to checkout
    router.push(getLocalizedPath('/checkout', locale))
  }
  
  // Handle clear
  const handleClear = () => {
    clearBundle()
    setCurrentStep(0)
  }
  
  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable}`}>
      {/* Header */}
      <header className="mweb-float-sticky-top sticky top-0 z-40 border-b border-[var(--cera-line)] bg-[var(--cera-cream)]/90 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="relative flex items-center justify-between h-14 sm:h-16">
            {/* Back Button */}
            <Link
              href={getLocalizedPath('/products?categories=beauty-boxes', locale)}
              className="flex items-center gap-2 text-[var(--cera-body)] hover:text-[var(--cera-ink)] transition-colors z-10"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">
                {t('bundleBuilder.backToBeautyBoxes')}
              </span>
            </Link>
            
            {/* Title - Centered absolutely */}
            <h1 className="cera-serif absolute left-1/2 -translate-x-1/2 text-[19px] sm:text-[22px] text-[var(--cera-ink)]">
              {t('bundleBuilder.title')}
            </h1>
            
            {/* Cart Preview (Mobile) */}
            <button
              onClick={() => setShowMobileSummary(true)}
              className="lg:hidden relative flex items-center gap-1 text-[var(--cera-body)] hover:text-[var(--cera-ink)] transition-colors z-10"
            >
              <ShoppingBag className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-[var(--cera-cta)] text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Progress Indicator - Sticky below header */}
      <div className="sticky top-14 sm:top-16 z-30 bg-[var(--cera-cream-deep)] border-b border-[var(--cera-line)]">
        <div className="container mx-auto">
          <StepIndicator
            steps={ROUTINE_STEPS}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
            getItemCountForStep={getItemCountForStep}
          />
        </div>
        
        {/* Bundle Discount Progress Bar */}
        <div className="container mx-auto px-4 pb-3">
          <div className="relative">
            {/* Progress Track */}
            <div className="h-1.5 bg-[var(--cera-cream-deep)] rounded-full overflow-hidden">
              {/* Progress Fill - animate to current discount level */}
              <motion.div 
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${Math.min((items.length / 5) * 100, 100)}%` 
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            
            {/* Milestone Markers */}
            <div className="absolute top-0 left-0 right-0 h-1.5 flex">
              {[2, 3, 4, 5].map((milestone) => (
                <div 
                  key={milestone}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${(milestone / 5) * 100}%` }}
                >
                  <div 
                    className={`w-2 h-2 rounded-full border-2 transition-colors duration-300 ${
                      items.length >= milestone 
                        ? 'bg-green-500 border-green-500' 
                        : 'bg-white border-[var(--cera-line)]'
                    }`}
                  />
                </div>
              ))}
            </div>
            
            {/* Labels */}
            <div className="flex justify-between mt-2 text-[10px] sm:text-xs">
              <span className="text-[var(--cera-muted)]">0</span>
              <div className="flex-1 flex justify-between px-2">
                {[
                  { items: 2, discount: 5 },
                  { items: 3, discount: 10 },
                  { items: 4, discount: 15 },
                  { items: 5, discount: 20 },
                ].map((tier) => (
                  <span 
                    key={tier.items}
                    className={`transition-colors duration-300 ${
                      items.length >= tier.items 
                        ? 'text-green-700 font-medium' 
                        : 'text-[var(--cera-muted)]'
                    }`}
                    style={{ 
                      position: 'relative',
                      left: `${((tier.items - 2) / 3) * -5}%`
                    }}
                  >
                    {tier.items}={tier.discount}%
                  </span>
                ))}
              </div>
            </div>
            
            {/* Current Status Badge */}
            {items.length > 0 && (
              <div className="absolute -top-6 right-0">
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                  (pricing.bundleDiscountPercent ?? 0) > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-[var(--cera-cream-deep)] text-[var(--cera-body)]'
                }`}>
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                  {(pricing.bundleDiscountPercent ?? 0) > 0 && (
                    <span className="text-green-700">• {pricing.bundleDiscountPercent}% off</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex gap-8">
          {/* Product Selection Area */}
          <div className="flex-1">
            {/* Step Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{currentStepData?.icon}</span>
                <h2 className="cera-serif text-[24px] leading-tight text-[var(--cera-ink)] sm:text-[30px]">
                  {t(`bundleBuilder.steps.${currentStepData?.id}`) || currentStepData?.name}
                </h2>
                {currentStepData?.required && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                    {t('bundleBuilder.recommended')}
                  </span>
                )}
              </div>
              <p className="text-[var(--cera-muted)] text-sm sm:text-base">
                {t(`bundleBuilder.stepDescriptions.${currentStepData?.id}`) || currentStepData?.description}
              </p>
            </div>
            
            {/* Products Grid */}
            {stepProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {stepProducts.map(product => (
                  <BundleProductCard
                    key={product.id}
                    product={product}
                    isSelected={selectedProductIds.includes(product.id)}
                    onSelect={() => handleProductSelect(product)}
                    onViewDetails={(p) => setDetailProduct(p)}
                    showPrices={showPrices}
                    locale={locale}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[var(--cera-cream-deep)] rounded-2xl">
                <p className="text-[var(--cera-muted)]">
                  {t('bundleBuilder.noProductsInCategory')}
                </p>
              </div>
            )}
            
            {/* Navigation Buttons - Desktop Only */}
            <div className="hidden lg:flex items-center justify-between mt-8 pt-6 border-t border-[var(--cera-line)]">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
                  transition-all duration-200
                  ${currentStep === 0
                    ? 'text-[var(--cera-blush-deep)] cursor-not-allowed'
                    : 'text-[var(--cera-body)] hover:text-[var(--cera-ink)] hover:bg-[var(--cera-cream-deep)]'
                  }
                `}
              >
                <ArrowLeft className="w-4 h-4" />
                {t('bundleBuilder.previous')}
              </button>
              
              {/* Skip Button (any step without items - steps are recommendations, not gates) */}
              {!hasItemForStep(currentStepData?.id || '') && (
                <button
                  onClick={handleNextStep}
                  className="text-sm text-[var(--cera-muted)] hover:text-[var(--cera-body)] transition-colors"
                >
                  {t('bundleBuilder.skip')}
                </button>
              )}
              
              <button
                onClick={handleNextStep}
                disabled={currentStep === ROUTINE_STEPS.length - 1}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
                  transition-all duration-200
                  ${currentStep === ROUTINE_STEPS.length - 1
                    ? 'text-[var(--cera-blush-deep)] cursor-not-allowed'
                    : 'bg-[var(--cera-cta)] text-white hover:bg-[var(--cera-rose-ink)] active:scale-[0.98]'
                  }
                `}
              >
                {t('bundleBuilder.next')}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Desktop Sidebar Summary */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white border border-[var(--cera-line)] rounded-2xl p-5 shadow-sm">
              <h3 className="cera-serif mb-4 text-[20px] leading-tight text-[var(--cera-ink)]">
                {t('bundleBuilder.yourBundle')}
              </h3>
              <BundleSummary
                onAddToCart={handleAddToCart}
                onClear={handleClear}
                showPrices={showPrices}
                pricing={pricing}
                user={user}
              />
            </div>
          </aside>
        </div>
      </div>
      
      {/* Spacer for fixed mobile bottom bar */}
      {isMobile && <div className="bundle-builder-spacer" />}
      
      {/* Mobile Bottom Bar - Navigation Only */}
      {isMobile && (
        <div className="bundle-builder-mobile-bar">
          {/* Summary Line */}
          {items.length > 0 && (
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--cera-line)]">
              <button
                onClick={() => setShowMobileSummary(true)}
                className="flex flex-col items-start text-sm text-[var(--cera-body)]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{items.length} {t('bundleBuilder.items')}</span>
                  {showPrices && (pricing.bundleDiscountPercent ?? 0) > 0 && (
                    <span className="text-xs text-green-700 font-medium">
                      {pricing.bundleDiscountPercent}% {t('bundleBuilder.off')}
                    </span>
                  )}
                </div>
                {/* Show total savings hint */}
                {showPrices && (() => {
                  const originalRetailTotal = items.reduce((sum, item) => sum + getBundleRetailPrice(item.product), 0)
                  const totalSavings = originalRetailTotal - pricing.total
                  if (totalSavings > 0.01) {
                    return (
                      <span className="text-[10px] text-green-700">
                        {t('bundleBuilder.youSave', { amount: totalSavings.toFixed(0) })}
                      </span>
                    )
                  }
                  return null
                })()}
              </button>
              {showPrices ? (
                <button
                  onClick={() => setShowMobileSummary(true)}
                  className="text-right"
                >
                  <span className="text-base font-bold text-[var(--cera-ink)]">
                    {pricing.total.toFixed(2)} {t('common.aed')}
                  </span>
                  <p className="text-[10px] text-[var(--cera-muted)]">5% {t('product.vatIncluded')}</p>
                </button>
              ) : (
                <span className="text-xs text-[var(--cera-muted)]">
                  {t('product.loginToSeePrice')}
                </span>
              )}
            </div>
          )}
          
          {/* Navigation: Previous | Skip | Next */}
          <div className="flex items-center justify-between">
            {/* Previous */}
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className={`
                flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-medium text-sm
                transition-all duration-200
                ${currentStep === 0
                  ? 'text-[var(--cera-blush-deep)] cursor-not-allowed'
                  : 'text-[var(--cera-body)] hover:text-[var(--cera-ink)] hover:bg-[var(--cera-cream-deep)] active:scale-[0.98]'
                }
              `}
            >
              <ArrowLeft className="w-4 h-4" />
              {t('bundleBuilder.previous')}
            </button>
            
            {/* Skip (any step without items - steps are recommendations, not gates) */}
            {!hasItemForStep(currentStepData?.id || '') && currentStep < ROUTINE_STEPS.length - 1 && (
              <button
                onClick={handleNextStep}
                className="text-sm text-[var(--cera-muted)] hover:text-[var(--cera-body)] transition-colors px-3 py-2.5"
              >
                {t('bundleBuilder.skip')}
              </button>
            )}
            
            {/* Next / View Bundle */}
            {currentStep < ROUTINE_STEPS.length - 1 ? (
              <button
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[var(--cera-rose)] text-white rounded-xl font-medium text-sm active:scale-[0.98] transition-all hover:bg-[var(--cera-rose-ink)]"
              >
                {t('bundleBuilder.next')}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowMobileSummary(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[var(--cera-rose)] text-white rounded-xl font-medium text-sm active:scale-[0.98] transition-all hover:bg-[var(--cera-rose-ink)]"
              >
                {t('bundleBuilder.viewBundle')}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Mobile Summary Sheet */}
      <AnimatePresence>
        {showMobileSummary && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSummary(false)}
              className="fixed inset-0 z-50 bg-black/40"
            />
            
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden"
            >
              {/* Handle */}
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 bg-[var(--cera-blush-deep)] rounded-full" />
              </div>
              
              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-4 border-b border-[var(--cera-line)]">
                <h3 className="cera-serif text-[20px] leading-tight text-[var(--cera-ink)]">
                  {t('bundleBuilder.yourBundle')}
                </h3>
                <button
                  onClick={() => setShowMobileSummary(false)}
                  className="p-2 rounded-full hover:bg-[var(--cera-cream-deep)] transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--cera-muted)]" />
                </button>
              </div>
              
              {/* Content */}
              <div className="px-5 py-4 overflow-y-auto max-h-[calc(85vh-120px)]">
                <BundleSummary
                  onAddToCart={() => {
                    handleAddToCart()
                    setShowMobileSummary(false)
                  }}
                  onClear={() => {
                    handleClear()
                    setShowMobileSummary(false)
                  }}
                  showPrices={showPrices}
                  pricing={pricing}
                  user={user}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Product Detail View (Modal on Desktop, Bottom Sheet on Mobile) */}
      {detailProduct && (
        <>
          {/* Desktop Modal */}
          {!isMobile && (
            <div 
              className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && setDetailProduct(null)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
              
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col"
              >
                {/* Close Button */}
                <button
                  onClick={() => setDetailProduct(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[var(--cera-cream-deep)] hover:bg-[var(--cera-cream-deep)] transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--cera-muted)]" />
                </button>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {(() => {
                    const isProductSelected = selectedProductIds.includes(detailProduct.id)
                    const currentItemCount = items.length
                    const newItemCount = isProductSelected ? currentItemCount : currentItemCount + 1
                    const bundleDiscountForItem = getBundleDiscountForCount(newItemCount)
                    
                    return (
                      <div className="flex flex-col h-full">
                        {/* Product Image */}
                        <div className="relative w-[250px] h-[250px] bg-white rounded-2xl overflow-hidden mx-auto mb-4 border border-[var(--cera-line)]">
                          <Image
                            src={detailProduct.image}
                            alt={detailProduct.name}
                            fill
                            className="object-cover"
                            sizes="250px"
                          />
                          {isProductSelected && (
                            <div className="absolute top-3 right-3 bg-[var(--cera-cta)] text-white rounded-full p-1.5">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        
                        {detailProduct.size && (
                          <p className="text-sm text-[var(--cera-muted)] text-center mb-2">{detailProduct.size}</p>
                        )}
                        
                        <h3 className="cera-serif mb-2 text-center text-[22px] leading-tight text-[var(--cera-ink)]">
                          {detailProduct.name}
                        </h3>
                        
                        {showPrices && bundleDiscountForItem > 0 && (
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
                              <Sparkles className="w-3 h-3" />
                              {bundleDiscountForItem}% {t('bundleBuilder.discount')}
                            </span>
                            {!isProductSelected && currentItemCount >= 1 && (
                              <span className="text-xs text-[var(--cera-muted)]">
                                {locale === 'ru' ? 'при добавлении' : locale === 'ar' ? 'عند الإضافة' : 'when added'}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {getLocalizedDescription(detailProduct, locale) && (
                          <div className="mb-4 flex-1 overflow-y-auto">
                            <p className="text-sm text-[var(--cera-body)] leading-relaxed">
                              {getLocalizedDescription(detailProduct, locale)}
                            </p>
                          </div>
                        )}
                        
                        <div className="mb-4 text-center">
                          {showPrices ? (
                            <div className="flex flex-col items-center">
                              <span className="text-2xl font-bold text-[var(--cera-ink)]">
                                {getBundleRetailPrice(detailProduct).toFixed(2)} {t('common.aed')}
                              </span>
                              <span className="text-xs text-[var(--cera-muted)] mt-1">5% {t('product.vatIncluded')}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-[var(--cera-muted)]">{t('product.loginToSeePrice')}</span>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 pt-4 border-t border-[var(--cera-line)]">
                          <button
                            onClick={() => {
                              handleProductSelect(detailProduct)
                              setDetailProduct(null)
                            }}
                            className={`
                              w-full py-3.5 rounded-xl font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98]
                              ${isProductSelected
                                ? 'bg-[var(--cera-cream-deep)] text-[var(--cera-body)] hover:bg-[var(--cera-cream-deep)]'
                                : 'bg-[var(--cera-cta)] text-white hover:bg-[var(--cera-rose-ink)]'
                              }
                            `}
                          >
                            {isProductSelected ? (
                              <span className="flex items-center justify-center gap-2">
                                <Check className="w-4 h-4" />
                                {t('bundleBuilder.addedToSet')}
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" />
                                {t('bundleBuilder.addToSet')}
                              </span>
                            )}
                          </button>
                          <button
                            onClick={() => setDetailProduct(null)}
                            className="w-full py-2.5 text-sm text-[var(--cera-muted)] hover:text-[var(--cera-body)] transition-colors"
                          >
                            {t('bundleBuilder.continueBrowsing')}
                          </button>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Mobile Bottom Sheet */}
          {isMobile && (
            <BottomSheet
              isOpen={!!detailProduct}
              onClose={() => setDetailProduct(null)}
              height="large"
              showCloseButton={false}
            >
              {(() => {
            const isProductSelected = selectedProductIds.includes(detailProduct.id)
            
            // Bundle discount preview: current tier if selected, else the tier after adding
            const currentItemCount = items.length
            const newItemCount = isProductSelected ? currentItemCount : currentItemCount + 1
            const bundleDiscountForItem = getBundleDiscountForCount(newItemCount)
            
            return (
              <div className="flex flex-col h-full">
                {/* Product Image */}
                <div className="relative w-[200px] h-[200px] bg-white rounded-2xl overflow-hidden mx-auto border border-[var(--cera-line)]">
                  <Image
                    src={detailProduct.image}
                    alt={detailProduct.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  {/* Selected Badge */}
                  {isProductSelected && (
                    <div className="absolute top-3 right-3 bg-[var(--cera-cta)] text-white rounded-full p-1.5">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                {/* Product Size - Under Image */}
                {detailProduct.size && (
                  <p className="text-xs text-[var(--cera-muted)] text-center mt-2 mb-2">
                    {detailProduct.size}
                  </p>
                )}
                
                {/* Product Name */}
                <h3 className="cera-serif mb-1 text-[20px] leading-tight text-[var(--cera-ink)]">
                  {detailProduct.name}
                </h3>
                
                {/* Bundle Discount Badge */}
                {showPrices && bundleDiscountForItem > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      {bundleDiscountForItem}% {t('bundleBuilder.discount')}
                    </span>
                    {!isProductSelected && currentItemCount >= 1 && (
                      <span className="text-xs text-[var(--cera-muted)]">
                        {locale === 'ru' ? 'при добавлении' : locale === 'ar' ? 'عند الإضافة' : 'when added'}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Full Description */}
                {getLocalizedDescription(detailProduct, locale) && (
                  <div className="mb-4 flex-1 overflow-y-auto">
                    <p className="text-sm text-[var(--cera-body)] leading-relaxed">
                      {getLocalizedDescription(detailProduct, locale)}
                    </p>
                  </div>
                )}
                
                {/* Price - retail only in bundle builder (no VIP discount) */}
                <div className="mb-4">
                  {showPrices ? (
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-[var(--cera-ink)]">
                        {getBundleRetailPrice(detailProduct).toFixed(2)} {t('common.aed')}
                      </span>
                      <span className="text-xs text-[var(--cera-muted)] mt-0.5">
                        5% {t('product.vatIncluded')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-[var(--cera-muted)]">
                      {t('product.loginToSeePrice')}
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-[var(--cera-line)]">
                  <button
                    onClick={() => {
                      handleProductSelect(detailProduct)
                      setDetailProduct(null)
                    }}
                    className={`
                      w-full py-3.5 rounded-xl font-medium text-sm transition-all active:scale-[0.98]
                      ${isProductSelected
                        ? 'bg-[var(--cera-cream-deep)] text-[var(--cera-body)] hover:bg-[var(--cera-cream-deep)]'
                        : 'bg-[var(--cera-cta)] text-white hover:bg-[var(--cera-rose-ink)]'
                      }
                    `}
                  >
                    {isProductSelected ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        {t('bundleBuilder.addedToSet')}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        {t('bundleBuilder.addToSet')}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setDetailProduct(null)}
                    className="w-full py-2.5 text-sm text-[var(--cera-muted)] hover:text-[var(--cera-body)] transition-colors"
                  >
                    {t('bundleBuilder.continueBrowsing')}
                  </button>
                </div>
              </div>
            )
          })()}
            </BottomSheet>
          )}
        </>
      )}
      
      {/* Double-tap/click Hint */}
      <AnimatePresence>
        {showDoubleTapHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-sm"
          >
            <div className="bg-[var(--cera-ink)] text-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
              <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
                <Info className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t('bundleBuilder.doubleTapHint')}</p>
                <p className="text-xs text-[var(--cera-blush-deep)] mt-0.5">{t('bundleBuilder.tapToViewDetails')}</p>
              </div>
              <button
                onClick={() => {
                  setShowDoubleTapHint(false)
                  localStorage.setItem('bundleDoubleTapHint', 'true')
                }}
                className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  )
}
