'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import LoginModal from '@/components/LoginModal'
import { useProductCard } from './hooks/useProductCard'
import ProductImage from './ProductImage'
import ProductInfo from './ProductInfo'
import ProductPrice from './ProductPrice'
import ProductActions from './ProductActions'
import ProductOptionDialog from '@/components/product/ProductOptionDialog'
import type { ProductCardProps, ProductCardAnimationProps } from './types'

/**
 * ProductCard Component
 * 
 * A well-structured product card component following composition pattern.
 * Each responsibility is delegated to focused sub-components:
 * 
 * - ProductImage: Image display, favorite button, sold out badge
 * - ProductInfo: Category, name, size, stock, description
 * - ProductPrice: Pricing logic and display
 * - ProductActions: CTA buttons (add to cart, login, etc.)
 * 
 * State management is centralized in useProductCard hook.
 * 
 * @example
 * ```tsx
 * <ProductCard product={product} />
 * ```
 */
const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const {
    // State
    isAdding,
    isTogglingFavorite,
    showLoginModal,
    isLoginMode,
    showOptionDialog,
    addedToCartMessage,
    inCartQty,
    canAdjustInline,
    
    // Derived values
    productPath,
    description,
    useAnimations,
    productAriaLabel,
    prefetchProps,
    
    // Accessibility IDs
    descriptionId,
    priceId,
    stockId,
    
    // Handlers
    handleAddToCart,
    handleIncrementCart,
    handleDecrementFromCart,
    handleOpenCart,
    handleFavorite,
    handleLoginClick,
    handleNavigate,
    handleChooseOptions,
    handleConfirmOptions,
    
    // Modal controls
    setShowLoginModal,
    setIsLoginMode,
    setShowOptionDialog,
    
    // Context values
    user,
    isFavorite,
    isPWA,
    animationsEnabled,
    locale,
    t,
  } = useProductCard(product)
  
  // Animation props - only applied when animations are enabled
  const animationProps: ProductCardAnimationProps = useAnimations ? {
    whileHover: { 
      y: -8,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    whileTap: { scale: 0.98 },
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  } : {}
  
  // Use motion.div or regular div based on animation state
  const MotionWrapper = useAnimations ? motion.div : 'div'

  const handleMorphClickCapture = (event: React.MouseEvent<HTMLElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !(event.target instanceof Element)
    ) {
      return
    }

    const morphLink = event.target.closest('a[data-product-morph-link]')
    if (!morphLink) return

    event.preventDefault()
    event.stopPropagation()
    handleNavigate()
  }
  
  return (
    <MotionWrapper 
      {...animationProps}
      onClickCapture={handleMorphClickCapture}
      className="product-card product-card-cq flex flex-col overflow-hidden rounded-[18px] border border-[var(--cera-line)] bg-white transition-shadow hover:shadow-[0_2px_4px_rgba(23,20,15,0.04),0_22px_44px_-26px_rgba(151,40,31,0.3)]"
      role="article"
      aria-label={productAriaLabel}
      aria-describedby={`${descriptionId} ${priceId} ${stockId}`}
    >
      {/* Live region for screen reader announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {addedToCartMessage}
      </div>
      
      {/* Product Image Section */}
      <ProductImage
        product={product}
        productPath={productPath}
        isPWA={isPWA}
        animationsEnabled={animationsEnabled}
        isFavorite={isFavorite(product.id)}
        isTogglingFavorite={isTogglingFavorite}
        onFavorite={handleFavorite}
        onNavigate={handleNavigate}
        locale={locale}
        t={t}
        prefetchProps={prefetchProps}
      />
      
      {/* Product Information Section */}
      <ProductInfo
        product={product}
        productPath={productPath}
        isPWA={isPWA}
        locale={locale}
        description={description}
        descriptionId={descriptionId}
        stockId={stockId}
        onNavigate={handleNavigate}
        t={t}
        prefetchProps={prefetchProps}
      />
      
      {/* Price Section */}
      <div className="px-3 md:px-4">
        <ProductPrice
          product={product}
          user={user}
          priceId={priceId}
          t={t}
        />
        
        {/* Actions Section */}
        <ProductActions
          product={product}
          user={user}
          isAdding={isAdding}
          inCartQty={inCartQty}
          canAdjustInline={canAdjustInline}
          onAddToCart={handleAddToCart}
          onIncrementCart={handleIncrementCart}
          onDecrementFromCart={handleDecrementFromCart}
          onOpenCart={handleOpenCart}
          onChooseOptions={handleChooseOptions}
          onLoginClick={handleLoginClick}
          t={t}
        />
      </div>
      
      {/* Bottom padding */}
      <div className="h-3 md:h-4" />

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          isLoginMode={isLoginMode}
          setIsLoginMode={setIsLoginMode}
        />
      )}

      {showOptionDialog && user ? (
        <ProductOptionDialog
          open={showOptionDialog}
          product={product}
          user={user}
          isAdding={isAdding}
          onClose={() => setShowOptionDialog(false)}
          onConfirm={handleConfirmOptions}
        />
      ) : null}
    </MotionWrapper>
  )
})

// Re-export sub-components for potential standalone use
export { default as ProductImage } from './ProductImage'
export { default as ProductInfo } from './ProductInfo'
export { default as ProductPrice } from './ProductPrice'
export { default as ProductActions } from './ProductActions'
export { useProductCard } from './hooks/useProductCard'
export type * from './types'

export default ProductCard
