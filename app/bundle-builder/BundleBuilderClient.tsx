'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, Plus, X, ShoppingBag, ChevronRight, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useCartStore } from '@/lib/cartStore'
import { useAnimationStore } from '@/lib/animationStore'
import { useBundleStore, ROUTINE_STEPS, type RoutineStep } from '@/lib/bundleStore'
import { useAuth } from '@/components/AuthProvider'
import { canUserSeePrices } from '@/lib/discountUtils'
import { Product } from '@/types'

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
 * Product Card for Bundle Selection
 */
function BundleProductCard({
  product,
  isSelected,
  onSelect,
  showPrices,
}: {
  product: Product
  isSelected: boolean
  onSelect: () => void
  showPrices: boolean
}) {
  const { t } = useTranslation()
  const { enabled: animationsEnabled } = useAnimationStore()
  
  const MotionDiv = animationsEnabled ? motion.div : 'div'
  
  return (
    <MotionDiv
      {...(animationsEnabled ? {
        whileHover: { y: -2 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2 }
      } : {})}
      onClick={onSelect}
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
        <div className="mt-2 flex items-center justify-between">
          {showPrices ? (
            <span className="text-base font-semibold text-gray-900">
              {product.price} {t('common.aed')}
            </span>
          ) : (
            <span className="text-xs text-gray-500">
              {t('product.loginToSeePrice')}
            </span>
          )}
          {!isSelected && showPrices && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Plus className="w-3 h-3" />
              {t('bundleBuilder.add')}
            </span>
          )}
        </div>
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
}: {
  onAddToCart: () => void
  onClear: () => void
  showPrices: boolean
}) {
  const { t } = useTranslation()
  const { items, getPricing, removeItem, canAddToCart } = useBundleStore()
  const pricing = getPricing()
  
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
        {items.map((item, index) => (
          <motion.div
            key={item.product.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
          >
            <div className="relative w-14 h-14 flex-shrink-0 bg-white rounded-lg overflow-hidden">
              <Image
                src={item.product.image}
                alt={item.product.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.product.name}
              </p>
              <p className="text-xs text-gray-500">
                {t(`bundleBuilder.steps.${item.step}`)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {showPrices && (
                <span className="text-sm font-medium text-gray-900">
                  {item.product.price}
                </span>
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
        ))}
      </div>
      
      {/* Pricing Summary - Only show if user can see prices */}
      {showPrices ? (
        <div className="border-t border-gray-200 pt-4 space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('bundleBuilder.subtotal')}</span>
            <span className="text-gray-900">{pricing.subtotal} {t('common.aed')}</span>
          </div>
          
          {/* Discount */}
          {pricing.discountPercent > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">
                {t('bundleBuilder.discount')} ({pricing.discountPercent}%)
              </span>
              <span className="text-green-600">-{pricing.discountAmount} {t('common.aed')}</span>
            </div>
          )}
          
          {/* Next Tier Hint */}
          {pricing.nextTierItems !== null && pricing.nextTierDiscount !== null && (
            <div className="bg-amber-50 text-amber-800 rounded-lg p-3 text-xs">
              <Sparkles className="w-4 h-4 inline mr-1" />
              {t('bundleBuilder.nextTierHint', { 
                items: pricing.nextTierItems, 
                discount: pricing.nextTierDiscount 
              })}
            </div>
          )}
          
          {/* Total */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-base font-semibold text-gray-900">
              {t('bundleBuilder.total')}
            </span>
            <span className="text-xl font-bold text-gray-900">
              {pricing.total} {t('common.aed')}
            </span>
          </div>
          
          {/* Savings Badge */}
          {pricing.discountAmount > 0 && (
            <div className="text-center">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                {t('bundleBuilder.youSave', { amount: pricing.discountAmount })}
              </span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={onAddToCart}
              disabled={!canAddToCart()}
              className={`
                w-full py-3.5 rounded-xl font-medium text-sm
                transition-all duration-200
                ${canAddToCart()
                  ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
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
    getPricing,
    clearBundle,
  } = useBundleStore()
  
  const [showMobileSummary, setShowMobileSummary] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
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
  
  // Handle add bundle to cart
  const handleAddToCart = () => {
    // Add each item to cart - discount will be applied at checkout based on bundle detection
    items.forEach(item => {
      addToCart(item.product, 1)
    })
    
    setAddedToCart(true)
    setTimeout(() => {
      setAddedToCart(false)
    }, 2000)
  }
  
  // Handle clear
  const handleClear = () => {
    clearBundle()
    setCurrentStep(0)
  }
  
  const pricing = getPricing()
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Back Button */}
            <Link
              href={getLocalizedPath('/products?categories=beauty-boxes', locale)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">
                {t('bundleBuilder.backToBeautyBoxes')}
              </span>
            </Link>
            
            {/* Title */}
            <h1 className="text-base sm:text-lg font-semibold text-gray-900">
              {t('bundleBuilder.title')}
            </h1>
            
            {/* Cart Preview (Mobile) */}
            <button
              onClick={() => setShowMobileSummary(true)}
              className="lg:hidden relative flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
            
            {/* Desktop: Show total */}
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <span className="text-gray-500">{items.length} {t('bundleBuilder.items')}</span>
              {pricing.discountPercent > 0 && (
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {pricing.discountPercent}% {t('bundleBuilder.off')}
                </span>
              )}
            </div>
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
                    showPrices={showPrices}
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
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
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
              />
            </div>
          </aside>
        </div>
      </div>
      
      {/* Mobile Bottom Bar */}
      {isMobile && items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-4 py-3 safe-area-inset-bottom">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm text-gray-500">{items.length} {t('bundleBuilder.items')}</span>
              {showPrices && pricing.discountPercent > 0 && (
                <span className="ml-2 text-xs text-green-600 font-medium">
                  {pricing.discountPercent}% {t('bundleBuilder.off')}
                </span>
              )}
            </div>
            {showPrices ? (
              <span className="text-lg font-bold text-gray-900">
                {pricing.total} {t('common.aed')}
              </span>
            ) : (
              <span className="text-xs text-gray-500">
                {t('product.loginToSeePrice')}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowMobileSummary(true)}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium text-sm active:scale-[0.98] transition-transform"
          >
            {t('bundleBuilder.viewBundle')}
          </button>
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
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Success Toast */}
      <AnimatePresence>
        {addedToCart && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            <Check className="w-5 h-5 text-green-400" />
            <span>{t('bundleBuilder.addedToCart')}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
