'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import LoginModal from '@/components/LoginModal'
import { useProductCard } from './hooks/useProductCard'
import ProductImage from './ProductImage'
import ProductInfo from './ProductInfo'
import ProductPrice from './ProductPrice'
import ProductActions from './ProductActions'
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
    addedToCartMessage,
    
    // Derived values
    productPath,
    description,
    useBagText,
    useAnimations,
    productAriaLabel,
    prefetchProps,
    
    // Accessibility IDs
    descriptionId,
    priceId,
    stockId,
    
    // Handlers
    handleAddToCart,
    handleFavorite,
    handleLoginClick,
    handleNavigate,
    
    // Modal controls
    setShowLoginModal,
    setIsLoginMode,
    
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
  
  return (
    <MotionWrapper 
      {...animationProps}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
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
          useBagText={useBagText}
          onAddToCart={handleAddToCart}
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
