import { Product } from '@/types'
import { User } from '@/types/user'

/**
 * ProductCard Types
 * 
 * Centralized type definitions for the ProductCard component family.
 * All sub-components should import types from this file.
 */

// ============================================================================
// Main Component Props
// ============================================================================

export interface ProductCardProps {
  product: Product
}

// ============================================================================
// Sub-component Props
// ============================================================================

export interface ProductImageProps {
  product: Product
  productPath: string
  isPWA: boolean
  animationsEnabled: boolean
  isFavorite: boolean
  isTogglingFavorite: boolean
  onFavorite: (e?: React.MouseEvent | React.TouchEvent) => void
  onNavigate: () => void
  locale: string
  t: (key: string) => string
  prefetchProps: Record<string, unknown>
}

export interface ProductInfoProps {
  product: Product
  productPath: string
  isPWA: boolean
  locale: string
  description: string
  descriptionId: string
  stockId: string
  onNavigate: () => void
  t: (key: string) => string
  prefetchProps: Record<string, unknown>
}

export interface ProductPriceProps {
  product: Product
  user: User | null
  priceId: string
  t: (key: string) => string
}

export interface ProductActionsProps {
  product: Product
  user: User | null
  isAdding: boolean
  useBagText: boolean
  inCartQty: number
  canAdjustInline: boolean
  onAddToCart: () => void
  onIncrementCart: () => void
  onDecrementFromCart: () => void
  onOpenCart: () => void
  onChooseOptions: () => void
  onLoginClick: (e: React.MouseEvent) => void
  t: (key: string) => string
}

// ============================================================================
// Hook Return Types
// ============================================================================

export interface UseProductCardReturn {
  // State
  isAdding: boolean
  isTogglingFavorite: boolean
  showLoginModal: boolean
  isLoginMode: boolean
  isMobile: boolean
  addedToCartMessage: string
  inCartQty: number
  canAdjustInline: boolean
  
  // Derived values
  productId: string
  productPath: string
  description: string
  useBagText: boolean
  useAnimations: boolean
  productAriaLabel: string
  prefetchProps: Record<string, unknown>
  
  // Accessibility IDs
  descriptionId: string
  priceId: string
  stockId: string
  
  // Handlers
  handleAddToCart: () => void
  handleIncrementCart: () => void
  handleDecrementFromCart: () => void
  handleOpenCart: () => void
  handleFavorite: (e?: React.MouseEvent | React.TouchEvent) => void
  handleLoginClick: (e: React.MouseEvent) => void
  handleNavigate: () => void
  
  // Modal controls
  setShowLoginModal: (show: boolean) => void
  setIsLoginMode: (mode: boolean) => void
  
  // Context values
  user: User | null
  isFavorite: (id: string) => boolean
  isPWA: boolean
  animationsEnabled: boolean
  locale: string
  t: (key: string) => string
}

// ============================================================================
// Animation Types
// ============================================================================

import type { Easing } from 'framer-motion'

export interface ProductCardAnimationProps {
  whileHover?: {
    y?: number
    scale?: number
    boxShadow?: string
  }
  whileTap?: {
    scale?: number
  }
  initial?: {
    opacity?: number
    y?: number
  }
  animate?: {
    opacity?: number
    y?: number
  }
  transition?: {
    duration?: number
    ease?: Easing
  }
}

// ============================================================================
// Pricing Types
// ============================================================================

export interface PricingInfo {
  originalPrice: number
  discountedPrice: number
  hasDiscount: boolean
  discountPercentage: number
  isBeautyBox: boolean
}
