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
import { useBundleStore, ROUTINE_STEPS, type RoutineStep, type BundlePricing } from '@/lib/bundleStore'
import { useAuth } from '@/components/auth/AuthProvider'
import { canUserSeePrices, calculateDiscountedPrice } from '@/lib/discountUtils'
import { Product } from '@/types'
import type { User } from '@/types/user'
import BottomSheet from '@/components/ui/BottomSheet'

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
    <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto py-2 px-4 -mx-4 scrollbar-hide">
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
                ? 'bg-gray-900 text-white shadow-lg scale-105' 
                : hasItem 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : isPast
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
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
  user,
  locale,
}: {
  product: Product
  isSelected: boolean
  onSelect: () => void
  onViewDetails: (product: Product) => void
  showPrices: boolean
  user: User | null
  locale: string
}) {
  const { t } = useTranslation()
  const { enabled: animationsEnabled } = useAnimationStore()
  
  // Double-tap detection for mobile
  const lastTapRef = useRef<number>(0)
  const DOUBLE_TAP_DELAY = 300 // ms
  
  // Calculate user's discounted price
  const pricing = useMemo(() => calculateDiscountedPrice(product, user), [product, user])
  
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
          ? 'ring-2 ring-gray-900 shadow-lg bg-gray-50' 
          : 'bg-white hover:shadow-md border border-gray-100'
        }
      `}
    >
      {/* Selection Badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 bg-gray-900 text-white rounded-full p-1.5">
          <Check className="w-3 h-3" />
        </div>
      )}
      
      {/* No VIP discount badge in bundle builder — only bundle discount applies at checkout */}
      
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50 p-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-2"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      
      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        {/* Product Size */}
        {product.size && (
          <p className="text-xs text-gray-500 mt-1">
            {product.size}
          </p>
        )}
        {/* Product Description */}
        {getLocalizedDescription(product, locale) && (
          <p className="text-[11px] text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
            {getLocalizedDescription(product, locale)}
          </p>
        )}
        <div className="mt-2">
          {showPrices ? (
            <div className="flex flex-col">
              {/* Bundle builder: show retail price only — no VIP discount */}
              {(
                <span className="text-base font-semibold text-gray-900">
                  {product.price.toFixed(2)} {t('common.aed')}
                </span>
              )}
              <span className="text-[10px] text-gray-400 mt-0.5">
                5% {t('product.vatIncluded')}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-500">
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
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
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
  userDiscountPercent,
}: {
  onAddToCart: () => void
  onClear: () => void
  showPrices: boolean
  pricing: BundlePricing
  userDiscountPercent?: number
}) {
  const { t } = useTranslation()
  const { items, removeItem, canAddToCart } = useBundleStore()
  
  if (items.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">
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
          // Calculate bundle discounted price for display
          const bundleDiscountedPrice = pricing.discountPercent > 0 
            ? item.product.price * (1 - pricing.discountPercent / 100)
            : item.product.price
          return (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
            >
              {/* Image with size below */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-14 h-14 bg-white rounded-lg overflow-hidden">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                {item.product.size && (
                  <p className="text-[9px] text-gray-400 mt-0.5 text-center">
                    {item.product.size}
                  </p>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.product.name}
                </p>
                <p className="text-xs text-gray-500">
                  {t(`bundleBuilder.steps.${item.step}`)}
                </p>
                {/* Bundle discount badge per item */}
                {showPrices && pricing.discountPercent > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-green-600 font-medium mt-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    -{pricing.discountPercent}%
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                {showPrices && (
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                      {t('common.aed')} {bundleDiscountedPrice.toFixed(2)}
                    </span>
                    {pricing.discountPercent > 0 && (
                      <p className="text-[10px] text-gray-400 line-through">
                        {t('common.aed')} {item.product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                  aria-label={t('common.delete')}
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {/* Pricing Summary - Only show if user can see prices */}
      {showPrices ? (
        <div className="border-t border-gray-200 pt-4 space-y-2">
          {(() => {
            // Bundle builder: no VIP discount — only bundle tier discount on retail price
            const totalSavings = pricing.subtotal - pricing.total
            
            return (
              <>
                {/* Retail Subtotal */}
                {pricing.discountPercent > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('bundleBuilder.subtotal')}</span>
                    <span className="text-gray-400 line-through">{pricing.subtotal.toFixed(2)} {t('common.aed')}</span>
                  </div>
                )}
                {pricing.discountPercent === 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('bundleBuilder.subtotal')}</span>
                    <span className="text-gray-900">{pricing.subtotal.toFixed(2)} {t('common.aed')}</span>
                  </div>
                )}
                
                {/* Bundle Discount */}
                {pricing.discountPercent > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">
                      {t('bundleBuilder.discount')} ({pricing.discountPercent}%)
                    </span>
                    <span className="text-green-600">-{pricing.discountAmount.toFixed(2)} {t('common.aed')}</span>
                  </div>
                )}
                
                {/* Next Tier Hint */}
                {pricing.nextTierItems !== null && pricing.nextTierDiscount !== null && (
                  <div className="bg-amber-50 text-amber-800 rounded-lg p-3 text-xs mt-2">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    {t('bundleBuilder.nextTierHint', { 
                      items: pricing.nextTierItems, 
                      discount: pricing.nextTierDiscount 
                    })}
                  </div>
                )}
                
                {/* Total */}
                <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-100">
                  <div>
                    <span className="text-base font-semibold text-gray-900">
                      {t('bundleBuilder.total')}
                    </span>
                    <p className="text-[10px] text-gray-400">5% {t('product.vatIncluded')}</p>
                  </div>
                  <span className="text-xl font-bold text-gray-900">
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
                  ? 'bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {t('bundleBuilder.clearAll')}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Login to see prices message */
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-3">
              {t('product.loginToSeePrice')}
            </p>
            <p className="text-xs text-gray-400">
              {items.length} {t('bundleBuilder.items')} {t('bundleBuilder.selected')}
            </p>
          </div>
          
          {/* Clear button still available */}
          {items.length > 0 && (
            <button
              onClick={onClear}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
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
  const { addItem: addToCart } = useCartStore()
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
    const DISCOUNT_TIERS = [
      { minItems: 2, discount: 5 },
      { minItems: 3, discount: 10 },
      { minItems: 4, discount: 15 },
      { minItems: 5, discount: 20 },
    ]
    
    const itemCount = items.length
    
    // Calculate subtotal using user's discounted prices
    const subtotal = items.reduce((sum, item) => {
      const itemPricing = calculateDiscountedPrice(item.product, user)
      return sum + itemPricing.discountedPrice
    }, 0)
    
    let discountPercent = 0
    for (const tier of DISCOUNT_TIERS) {
      if (itemCount >= tier.minItems) {
        discountPercent = tier.discount
      }
    }
    
    // Apply bundle discount on top of user's discounted price
    const discountAmount = Math.round((subtotal * discountPercent) / 100 * 100) / 100
    const total = Math.round((subtotal - discountAmount) * 100) / 100
    
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
      discountPercent,
      discountAmount,
      total,
      itemCount,
      nextTierItems,
      nextTierDiscount,
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
      
      return category.includes(stepCategory)
    })
  }, [products, currentStepData])
  
  // Get selected product IDs for current step (allows multiple)
  const selectedProductIds = useMemo(() => {
    return items
      .filter(i => i.step === currentStepData?.id)
      .map(i => i.product.id)
  }, [items, currentStepData])
  
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
    const bundleDiscountPercent = pricing.discountPercent
    
    // Add each item to cart with bundle info (discount percentage at time of adding)
    items.forEach(item => {
      addToCart(item.product, 1, undefined, undefined, {
        fromBundle: true,
        bundleDiscountPercent: bundleDiscountPercent
      })
    })
    
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
    <div className="bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="relative flex items-center justify-between h-14 sm:h-16">
            {/* Back Button */}
            <Link
              href={getLocalizedPath('/products?categories=beauty-boxes', locale)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors z-10"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">
                {t('bundleBuilder.backToBeautyBoxes')}
              </span>
            </Link>
            
            {/* Title - Centered absolutely */}
            <h1 className="absolute left-1/2 -translate-x-1/2 text-base sm:text-lg font-semibold text-gray-900">
              {t('bundleBuilder.title')}
            </h1>
            
            {/* Cart Preview (Mobile) */}
            <button
              onClick={() => setShowMobileSummary(true)}
              className="lg:hidden relative flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors z-10"
            >
              <ShoppingBag className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-gray-900 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Progress Indicator - Sticky below header */}
      <div className="sticky top-14 sm:top-16 z-30 bg-gray-50 border-b border-gray-100">
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
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
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
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
              ))}
            </div>
            
            {/* Labels */}
            <div className="flex justify-between mt-2 text-[10px] sm:text-xs">
              <span className="text-gray-400">0</span>
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
                        ? 'text-green-600 font-medium' 
                        : 'text-gray-400'
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
                  pricing.discountPercent > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                  {pricing.discountPercent > 0 && (
                    <span className="text-green-600">• {pricing.discountPercent}% off</span>
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
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {t(`bundleBuilder.steps.${currentStepData?.id}`) || currentStepData?.name}
                </h2>
                {currentStepData?.required && (
                  <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                    {t('bundleBuilder.required')}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm sm:text-base">
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
                    user={user}
                    locale={locale}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <p className="text-gray-500">
                  {t('bundleBuilder.noProductsInCategory')}
                </p>
              </div>
            )}
            
            {/* Navigation Buttons - Desktop Only */}
            <div className="hidden lg:flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
                  transition-all duration-200
                  ${currentStep === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <ArrowLeft className="w-4 h-4" />
                {t('bundleBuilder.previous')}
              </button>
              
              {/* Skip Button (for optional steps) */}
              {!currentStepData?.required && !hasItemForStep(currentStepData?.id || '') && (
                <button
                  onClick={handleNextStep}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
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
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
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
            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('bundleBuilder.yourBundle')}
              </h3>
              <BundleSummary
                onAddToCart={handleAddToCart}
                onClear={handleClear}
                showPrices={showPrices}
                pricing={pricing}
                {...(user?.discountPercentage ? { userDiscountPercent: user.discountPercentage } : {})}
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
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <button
                onClick={() => setShowMobileSummary(true)}
                className="flex flex-col items-start text-sm text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{items.length} {t('bundleBuilder.items')}</span>
                  {showPrices && pricing.discountPercent > 0 && (
                    <span className="text-xs text-green-600 font-medium">
                      {pricing.discountPercent}% {t('bundleBuilder.off')}
                    </span>
                  )}
                </div>
                {/* Show total savings hint */}
                {showPrices && (() => {
                  const originalRetailTotal = items.reduce((sum, item) => sum + item.product.price, 0)
                  const totalSavings = originalRetailTotal - pricing.total
                  if (totalSavings > 0.01) {
                    return (
                      <span className="text-[10px] text-green-600">
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
                  <span className="text-base font-bold text-gray-900">
                    {pricing.total.toFixed(2)} {t('common.aed')}
                  </span>
                  <p className="text-[10px] text-gray-400">5% {t('product.vatIncluded')}</p>
                </button>
              ) : (
                <span className="text-xs text-gray-500">
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
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-[0.98]'
                }
              `}
            >
              <ArrowLeft className="w-4 h-4" />
              {t('bundleBuilder.previous')}
            </button>
            
            {/* Skip (for optional steps) */}
            {!currentStepData?.required && !hasItemForStep(currentStepData?.id || '') && currentStep < ROUTINE_STEPS.length - 1 && (
              <button
                onClick={handleNextStep}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-3 py-2.5"
              >
                {t('bundleBuilder.skip')}
              </button>
            )}
            
            {/* Next / View Bundle */}
            {currentStep < ROUTINE_STEPS.length - 1 ? (
              <button
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium text-sm active:scale-[0.98] transition-all hover:bg-primary-700"
              >
                {t('bundleBuilder.next')}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowMobileSummary(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium text-sm active:scale-[0.98] transition-all hover:bg-primary-700"
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
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>
              
              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('bundleBuilder.yourBundle')}
                </h3>
                <button
                  onClick={() => setShowMobileSummary(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
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
                  {...(user?.discountPercentage ? { userDiscountPercent: user.discountPercentage } : {})}
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
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {(() => {
                    const detailPricing = calculateDiscountedPrice(detailProduct, user)
                    const isProductSelected = selectedProductIds.includes(detailProduct.id)
                    const currentItemCount = items.length
                    const newItemCount = isProductSelected ? currentItemCount : currentItemCount + 1
                    
                    const DISCOUNT_TIERS = [
                      { minItems: 2, discount: 5 },
                      { minItems: 3, discount: 10 },
                      { minItems: 4, discount: 15 },
                      { minItems: 5, discount: 20 },
                    ]
                    
                    let bundleDiscountForItem = 0
                    for (const tier of DISCOUNT_TIERS) {
                      if (newItemCount >= tier.minItems) {
                        bundleDiscountForItem = tier.discount
                      }
                    }
                    
                    return (
                      <div className="flex flex-col h-full">
                        {/* Product Image */}
                        <div className="relative w-[250px] h-[250px] bg-gray-50 rounded-2xl overflow-hidden mx-auto mb-4">
                          <Image
                            src={detailProduct.image}
                            alt={detailProduct.name}
                            fill
                            className="object-contain p-4"
                            sizes="250px"
                          />
                          {showPrices && detailPricing.hasDiscount && (
                            <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                              -{detailPricing.discountPercentage}%
                            </div>
                          )}
                          {isProductSelected && (
                            <div className="absolute top-3 right-3 bg-gray-900 text-white rounded-full p-1.5">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        
                        {detailProduct.size && (
                          <p className="text-sm text-gray-500 text-center mb-2">{detailProduct.size}</p>
                        )}
                        
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                          {detailProduct.name}
                        </h3>
                        
                        {showPrices && bundleDiscountForItem > 0 && (
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
                              <Sparkles className="w-3 h-3" />
                              {bundleDiscountForItem}% {t('bundleBuilder.discount')}
                            </span>
                            {!isProductSelected && currentItemCount >= 1 && (
                              <span className="text-xs text-gray-400">
                                {locale === 'ru' ? 'при добавлении' : locale === 'ar' ? 'عند الإضافة' : 'when added'}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {getLocalizedDescription(detailProduct, locale) && (
                          <div className="mb-4 flex-1 overflow-y-auto">
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {getLocalizedDescription(detailProduct, locale)}
                            </p>
                          </div>
                        )}
                        
                        <div className="mb-4 text-center">
                          {showPrices ? (
                            <div className="flex flex-col items-center">
                              {detailPricing.hasDiscount ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-bold text-primary-600">
                                    {detailPricing.discountedPrice.toFixed(2)} {t('common.aed')}
                                  </span>
                                  <span className="text-sm text-gray-400 line-through">
                                    {detailPricing.originalPrice.toFixed(2)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-2xl font-bold text-gray-900">
                                  {detailProduct.price.toFixed(2)} {t('common.aed')}
                                </span>
                              )}
                              <span className="text-xs text-gray-400 mt-1">5% {t('product.vatIncluded')}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">{t('product.loginToSeePrice')}</span>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => {
                              handleProductSelect(detailProduct)
                              setDetailProduct(null)
                            }}
                            className={`
                              w-full py-3.5 rounded-xl font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98]
                              ${isProductSelected
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-gray-900 text-white hover:bg-gray-800'
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
                            className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
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
            const detailPricing = calculateDiscountedPrice(detailProduct, user)
            const isProductSelected = selectedProductIds.includes(detailProduct.id)
            
            // Calculate bundle discount for this item
            // If item is already selected, show current discount
            // If not selected, show what discount would be after adding
            const currentItemCount = items.length
            const newItemCount = isProductSelected ? currentItemCount : currentItemCount + 1
            
            // Discount tiers
            const DISCOUNT_TIERS = [
              { minItems: 2, discount: 5 },
              { minItems: 3, discount: 10 },
              { minItems: 4, discount: 15 },
              { minItems: 5, discount: 20 },
            ]
            
            let bundleDiscountForItem = 0
            for (const tier of DISCOUNT_TIERS) {
              if (newItemCount >= tier.minItems) {
                bundleDiscountForItem = tier.discount
              }
            }
            
            return (
              <div className="flex flex-col h-full">
                {/* Product Image */}
                <div className="relative w-[200px] h-[200px] bg-gray-50 rounded-2xl overflow-hidden mx-auto">
                  <Image
                    src={detailProduct.image}
                    alt={detailProduct.name}
                    fill
                    className="object-contain p-4"
                    sizes="200px"
                  />
                  {/* Discount Badge */}
                  {showPrices && detailPricing.hasDiscount && (
                    <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                      -{detailPricing.discountPercentage}%
                    </div>
                  )}
                  {/* Selected Badge */}
                  {isProductSelected && (
                    <div className="absolute top-3 right-3 bg-gray-900 text-white rounded-full p-1.5">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                {/* Product Size - Under Image */}
                {detailProduct.size && (
                  <p className="text-xs text-gray-500 text-center mt-2 mb-2">
                    {detailProduct.size}
                  </p>
                )}
                
                {/* Product Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
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
                      <span className="text-xs text-gray-400">
                        {locale === 'ru' ? 'при добавлении' : locale === 'ar' ? 'عند الإضافة' : 'when added'}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Full Description */}
                {getLocalizedDescription(detailProduct, locale) && (
                  <div className="mb-4 flex-1 overflow-y-auto">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {getLocalizedDescription(detailProduct, locale)}
                    </p>
                  </div>
                )}
                
                {/* Price */}
                <div className="mb-4">
                  {showPrices ? (
                    <div className="flex flex-col">
                      {detailPricing.hasDiscount ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary-600">
                            {detailPricing.discountedPrice.toFixed(2)} {t('common.aed')}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {detailPricing.originalPrice.toFixed(2)} {t('common.aed')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">
                          {detailProduct.price.toFixed(2)} {t('common.aed')}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 mt-0.5">
                        5% {t('product.vatIncluded')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {t('product.loginToSeePrice')}
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      handleProductSelect(detailProduct)
                      setDetailProduct(null)
                    }}
                    className={`
                      w-full py-3.5 rounded-xl font-medium text-sm transition-all active:scale-[0.98]
                      ${isProductSelected
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
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
                    className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
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
            <div className="bg-gray-900 text-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
              <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
                <Info className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t('bundleBuilder.doubleTapHint')}</p>
                <p className="text-xs text-gray-300 mt-0.5">{t('bundleBuilder.tapToViewDetails')}</p>
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
