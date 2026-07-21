'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import { useCart } from '@/components/cart/CartProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import { useAnimationStore } from '@/lib/animationStore'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import { usePrefetchProduct } from '@/hooks/usePrefetch'
import { getLocalizedPath } from '@/lib/i18n'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { canUserSeePrices } from '@/lib/discountUtils'
import { getPricingDisplay } from '@/lib/pricingDisplay'
import { trackAddToCart } from '@/lib/analytics'
import { translateCategory } from '@/utils/categoryTranslations'
import {
  navigateProductWithTransition,
  productTransitionName,
} from '@/lib/productViewTransition'
import type { UseProductCardReturn } from '../types'

/**
 * useProductCard Hook
 * 
 * Extracts all state management, event handlers, and derived values
 * from the ProductCard component for better separation of concerns.
 * 
 * @param product - The product to display
 * @returns All state, handlers, and computed values needed by ProductCard components
 */
export function useProductCard(product: Product): UseProductCardReturn {
  const router = useRouter()
  
  // Context hooks
  const { addItem, updateQuantity, removeItem, items: cartItems } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { user } = useAuth()
  const { t, locale, messages } = useTranslation()
  const { isPWA } = usePWAMode()
  const haptic = useHapticFeedback()
  const { getProductPrefetchProps } = usePrefetchProduct()
  const { enabled: animationsEnabled } = useAnimationStore()
  
  // Local state
  const [isAdding, setIsAdding] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [addedToCartMessage, setAddedToCartMessage] = useState('')
  const addTimerRef = useRef<NodeJS.Timeout | null>(null)
  const messageTimerRef = useRef<NodeJS.Timeout | null>(null)
  const favoriteTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up timers on unmount
  useEffect(() => () => {
    if (addTimerRef.current) clearTimeout(addTimerRef.current)
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current)
    if (favoriteTimerRef.current) clearTimeout(favoriteTimerRef.current)
  }, [])
  
  // Derived values
  const productId = product.productNumber || product.id
  const productPath = getLocalizedPath(`/products/${productId}`, locale)
  const prefetchProps = !isPWA ? getProductPrefetchProps(productId, locale) : {}
  
  // Accessibility IDs
  const descriptionId = `product-desc-${productId}`
  const priceId = `product-price-${productId}`
  const stockId = `product-stock-${productId}`
  
  // Detect mobile for "Add to Bag" text
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Use "Add to Bag" for PWA and mobile web
  const useBagText = isPWA || isMobile

  const matchingCartLines = cartItems.filter(item => item?.product?.id === product.id)
  const inCartQty = matchingCartLines.reduce(
    (total, item) => total + (item.quantity || 0),
    0,
  )
  // Inline quantity editing is safe only when the card maps to one exact,
  // non-bundle cart line. Multiple variants must be edited in the bag so a
  // tap can never change the wrong size/colour.
  const adjustableLine = matchingCartLines.length === 1 && !matchingCartLines[0]?.fromBundle
    ? matchingCartLines[0]
    : null
  const canAdjustInline = Boolean(adjustableLine)
  
  // Disable framer-motion animations in PWA mode
  const useAnimations = animationsEnabled && !isPWA
  
  // Get translation for description
  const productIdForTranslation = product.productNumber || product.id
  const arabicTranslations = locale === 'ar' ? getProductTranslations(productIdForTranslation) : null
  const russianTranslations = locale === 'ru' ? getProductTranslationsRu(productIdForTranslation) : null
  const translations = arabicTranslations || russianTranslations
  const description = translations?.description || product.description || ''
  
  // Build comprehensive aria-label for accessibility
  const productAriaLabel = [
    product.name,
    translateCategory(product.category, messages),
    product.inStock ? t('product.inStock') : t('product.soldOut'),
    canUserSeePrices(user) && !product.isPriceOnRequest 
      ? `${getPricingDisplay(product, user).displayPrice.toFixed(2)} AED`
      : '',
  ].filter(Boolean).join(', ')
  
  // Event handlers
  const handleAddToCart = useCallback(() => {
    haptic.success()
    setIsAdding(true)
    addItem(product, 1, '', '')
    // GA4 add_to_cart
    try {
      trackAddToCart({
        id: product.id,
        name: product.name,
        category: product.category || 'Cosmetics',
        price: product.price,
        quantity: 1,
      })
    } catch { /* best-effort */ }
    setAddedToCartMessage(`${product.name} ${t('product.addedToCart') || 'added to cart'}`)
    
    addTimerRef.current = setTimeout(() => {
      setIsAdding(false)
      messageTimerRef.current = setTimeout(() => setAddedToCartMessage(''), 1000)
    }, 500)
  }, [addItem, product, haptic, t])

  const handleIncrementCart = useCallback(() => {
    if (!adjustableLine) return
    haptic.light()
    updateQuantity(
      product.id,
      adjustableLine.quantity + 1,
      adjustableLine.selectedColor,
      adjustableLine.selectedSize,
      {
        fromBundle: false,
        ...(adjustableLine.homecare ? { homecare: adjustableLine.homecare } : {}),
      },
    )
  }, [adjustableLine, haptic, product.id, updateQuantity])

  const handleDecrementFromCart = useCallback(() => {
    if (!adjustableLine) return
    haptic.light()
    const lineIdentity = {
      fromBundle: false,
      ...(adjustableLine.homecare ? { homecare: adjustableLine.homecare } : {}),
    }
    if (adjustableLine.quantity <= 1) {
      removeItem(
        product.id,
        adjustableLine.selectedColor,
        adjustableLine.selectedSize,
        lineIdentity,
      )
      return
    }
    updateQuantity(
      product.id,
      adjustableLine.quantity - 1,
      adjustableLine.selectedColor,
      adjustableLine.selectedSize,
      lineIdentity,
    )
  }, [adjustableLine, haptic, product.id, removeItem, updateQuantity])

  const handleOpenCart = useCallback(() => {
    router.push(getLocalizedPath('/cart', locale))
  }, [locale, router])
  
  const handleFavorite = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    haptic.double()
    setIsTogglingFavorite(true)
    toggleFavorite(product)
    favoriteTimerRef.current = setTimeout(() => setIsTogglingFavorite(false), 300)
  }, [toggleFavorite, product, haptic])
  
  const handleLoginClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isPWA) {
      const loginPath = locale === 'en' ? '/pwa-login' : `/${locale}/pwa-login`
      router.push(loginPath)
    } else {
      setShowLoginModal(true)
    }
  }, [isPWA, locale, router])
  
  const handleNavigate = useCallback(() => {
    navigateProductWithTransition(
      productPath,
      () => router.push(productPath),
      productTransitionName(productId)
    )
  }, [router, productPath, productId])
  
  return {
    // State
    isAdding,
    isTogglingFavorite,
    showLoginModal,
    isLoginMode,
    isMobile,
    addedToCartMessage,
    inCartQty,
    canAdjustInline,
    
    // Derived values
    productId,
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
    handleIncrementCart,
    handleDecrementFromCart,
    handleOpenCart,
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
  }
}

export default useProductCard
