'use client'

import { Product } from '@/types'
import { useCart } from './CartProvider'
import { useFavorites } from './FavoritesProvider'
import { useAuth } from './AuthProvider'
import { ShoppingCart, Heart, Lock, User, MessageCircle } from 'lucide-react'
import { useState, memo, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAnimationStore } from '@/lib/animationStore'
import LoginModal from './LoginModal'
import { calculateDiscountedPrice, canUserSeePrices } from '@/lib/discountUtils'
import { debugLog, errorLog } from '@/lib/logger'
import { useTranslation } from '@/hooks/useTranslation'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getLocalizedPath } from '@/lib/i18n'
import { translateSize } from '@/utils/sizeTranslations'
import { translateCategory } from '@/utils/categoryTranslations'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useRouter } from 'next/navigation'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import { usePrefetchProduct } from '@/hooks/usePrefetch'

interface ProductCardProps {
  product: Product
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { user } = useAuth()
  const { t, locale } = useTranslation()
  const { isPWA } = usePWAMode()
  const router = useRouter()
  const haptic = useHapticFeedback()
  const { getProductPrefetchProps } = usePrefetchProduct()
  const productId = product.productNumber || product.id
  const productPath = getLocalizedPath(`/products/${productId}`, locale)
  const prefetchProps = !isPWA ? getProductPrefetchProps(productId, locale) : {}
  const [isAdding, setIsAdding] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  
  // Detect mobile for "Add to Bag" text
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Use "Add to Bag" for PWA and mobile web
  const useBagText = isPWA || isMobile
  
  // Get translation for description if available
  // Use productNumber for translations (translations are keyed by productNumber, not UUID)
  const productIdForTranslation = product.productNumber || product.id
  const arabicTranslations = locale === 'ar' ? getProductTranslations(productIdForTranslation) : null
  const russianTranslations = locale === 'ru' ? getProductTranslationsRu(productIdForTranslation) : null
  const translations = arabicTranslations || russianTranslations
  const description = translations?.description || product.description

  const handleAddToCart = useCallback(async () => {
    haptic.success() // Haptic feedback on add to cart
    setIsAdding(true)
    addItem(product, 1, '', '')
    // Simulate a brief loading state
    setTimeout(() => setIsAdding(false), 500)
  }, [addItem, product, haptic])

  const handleFavorite = useCallback(async (e?: React.MouseEvent | React.TouchEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    haptic.double() // Haptic feedback on favorite toggle (like double-tap)
    setIsTogglingFavorite(true)
    toggleFavorite(product)
    // Brief delay for visual feedback
    setTimeout(() => setIsTogglingFavorite(false), 300)
  }, [toggleFavorite, product])

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

  const { enabled: animationsEnabled } = useAnimationStore()

  // Disable framer-motion animations in PWA mode to prevent touch event interference
  const useAnimations = animationsEnabled && !isPWA
  const MotionWrapper = useAnimations ? motion.div : 'div'
  const animationProps = useAnimations ? {
    whileHover: { 
      y: -8,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    whileTap: { scale: 0.98 },
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {}

  return (
    <MotionWrapper 
      {...animationProps}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
    >
      <div className="relative overflow-hidden">
        {/* Product Image - Use direct navigation for PWA, Link for web */}
        {isPWA ? (
          <div 
            role="button"
            tabIndex={0}
            onClick={() => router.push(productPath)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                router.push(productPath)
              }
            }}
            className="block w-full cursor-pointer active:opacity-80 transition-opacity"
            style={{ 
              touchAction: 'manipulation', 
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none'
            }}
          >
            <div className="overflow-hidden pointer-events-none">
              <Image
                src={product.image}
                alt={`${product.name} - GENOSYS Korean ${product.category || 'dermacosmetics'} professional skincare product UAE`}
                width={300}
                height={300}
                className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                priority={false}
                quality={85}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onError={() => {
                  errorLog('Image failed to load:', product.image)
                }}
                onLoad={() => {
                  debugLog('Image loaded successfully:', product.image)
                }}
              />
            </div>
          </div>
        ) : (
          <Link href={productPath} className="block" {...prefetchProps}>
            <motion.div
              whileHover={animationsEnabled ? { scale: 1.1 } : {}}
              transition={animationsEnabled ? { duration: 0.4, ease: "easeOut" } : {}}
              className="overflow-hidden"
            >
              <Image
                src={product.image}
                alt={`${product.name} - GENOSYS Korean ${product.category || 'dermacosmetics'} professional skincare product UAE`}
                width={300}
                height={300}
                className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover cursor-pointer"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                priority={false}
                quality={85}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onError={() => {
                  errorLog('Image failed to load:', product.image)
                }}
                onLoad={() => {
                  debugLog('Image loaded successfully:', product.image)
                }}
              />
            </motion.div>
          </Link>
        )}
        <button 
          type="button"
          onClick={handleFavorite}
          disabled={isTogglingFavorite}
          className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-20 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95 ${
            isTogglingFavorite ? 'opacity-50' : ''
          }`}
          title={isFavorite(product.id) ? t('product.removeFromFavorites') : t('product.addToFavorites')}
          aria-label={isFavorite(product.id) ? t('product.removeFromFavorites') : t('product.addToFavorites')}
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isFavorite(product.id) 
                ? 'text-red-500 fill-current' 
                : 'text-gray-600 hover:text-red-500'
            }`}
            aria-hidden="true"
          />
        </button>
        {!product.inStock && (
          <div className={`absolute top-2 ${locale === 'ar' ? 'left-2' : 'right-2'} z-30`}>
            <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white font-bold text-xs md:text-sm shadow-lg uppercase tracking-wide">
              {t('product.soldOut')}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-3 md:p-4 flex flex-col">
        <div className="mb-2">
          <span className="text-xs md:text-sm text-primary-600 font-medium">{translateCategory(product.category, locale)}</span>
        </div>
        
        <div className="mb-2">
          {isPWA ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => router.push(productPath)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  router.push(productPath)
                }
              }}
              className="cursor-pointer active:opacity-70 transition-opacity"
              style={{ 
                touchAction: 'manipulation', 
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none'
              }}
            >
              <h3 className="text-sm md:text-lg font-semibold text-gray-800 line-clamp-2 hover:text-primary-600 transition-colors">
                {product.name}
              </h3>
            </div>
          ) : (
            <Link href={productPath} {...prefetchProps}>
              <h3 className="text-sm md:text-lg font-semibold text-gray-800 line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer">
                {product.name}
              </h3>
            </Link>
          )}
        </div>
        
        {/* Size and Stock Row */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {(product.size || product.id === '37') && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] md:text-xs font-medium bg-gray-100 text-gray-700">
              {t('product.size')}: {product.id === '37' ? '38g x 5ea (5 masks, 1 box)' : translateSize(product.size, locale, product.category)}
            </span>
          )}
          {product.inStock && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] md:text-xs font-medium bg-green-100 text-green-800">
              {product.id === '47' ? t('products.orderByRequest') : t('product.inStock')}
            </span>
          )}
        </div>
        
        <p 
          className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-4 md:line-clamp-2"
        >
          {description ? description.replace(/<[^>]*>/g, '').trim() : ''}
        </p>
        
        {/* Price Section - Above Button */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            {product.isPriceOnRequest ? (
              <div className="flex items-center gap-1 text-amber-600">
                <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm font-semibold">{t('products.priceOnRequest')}</span>
              </div>
            ) : canUserSeePrices(user) ? (
              <div className="flex-1">
                {(() => {
                  const pricing = calculateDiscountedPrice(product, user)
                  return (
                    <div>
                      {pricing.hasDiscount ? (
                        <div>
                          <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                            <span className="text-xs md:text-base font-bold text-primary-600">
                              {pricing.discountedPrice.toFixed(2)} AED
                            </span>
                            <span className="text-[10px] md:text-sm text-gray-500 line-through">
                              {pricing.originalPrice.toFixed(2)} AED
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px] md:text-xs text-green-600 font-medium">
                              {pricing.discountPercentage}% {t('product.off')}
                            </span>
                            <span className="text-[10px] md:text-xs text-gray-500">{t('product.vatIncluded')}</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {product.category === 'Beauty Boxes' ? (
                            <>
                              <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                                <span className="text-xs md:text-base font-bold text-primary-600">
                                  {pricing.originalPrice.toFixed(2)} AED
                                </span>
                                <span className="text-[10px] md:text-sm text-gray-500 line-through">
                                  {(pricing.originalPrice / 0.85).toFixed(2)} AED
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-[10px] md:text-xs text-green-600 font-medium">
                                  {pricing.discountPercentage}% {t('product.off')}
                                  {pricing.isBeautyBox && ` (${t('products.bundleDiscount')})`}
                                </span>
                                <span className="text-[10px] md:text-xs text-gray-500">{t('product.vatIncluded')}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="text-xs md:text-base font-bold text-primary-600">
                                {pricing.originalPrice.toFixed(2)} AED
                              </span>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-[10px] md:text-xs text-gray-500">{t('product.vatIncluded')}</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            ) : user ? (
              <div className="flex items-center text-gray-500">
                <Lock className="h-4 w-4 mr-1" />
                <span className="text-sm">{t('product.priceLocked')}</span>
              </div>
            ) : (
              <span className="hidden md:inline text-xs md:text-base font-bold text-gray-500">
                {t('product.loginToSeePrice')}
              </span>
            )}
          </div>
        </div>
        
        {/* Button Section - Always at the end */}
        <div className="mt-2">
          {/* CTA buttons with 44pt minimum touch target for accessibility */}
          {product.isPriceOnRequest ? (
            <a
              href={`https://wa.me/971585487665?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Could you please provide pricing information?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-3 py-2 md:py-2 rounded-lg font-medium transition-colors w-full bg-green-500 text-white hover:bg-green-600 min-h-[44px] md:min-h-[40px] text-body-xs active:scale-[0.98]"
              style={{ touchAction: 'manipulation' }}
            >
              <MessageCircle className="h-3.5 w-3.5 md:h-3.5 md:w-3.5" aria-hidden="true" />
              <span>{t('products.requestQuote')}</span>
            </a>
          ) : !user ? (
            <button
              type="button"
              onClick={handleLoginClick}
              className={`flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-3 py-2 md:py-2 rounded-lg font-medium transition-colors w-full bg-primary-600 text-white hover:bg-primary-700 min-h-[44px] md:min-h-[40px] text-body-xs active:scale-[0.98]`}
              aria-label={t('product.loginToSeePrice')}
              style={{ touchAction: 'manipulation' }}
            >
              <User className="h-3.5 w-3.5 md:h-3.5 md:w-3.5" aria-hidden="true" />
              <span>{t('product.loginToSeePrice')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              aria-label={isAdding ? t('product.adding') : (useBagText ? t('product.addToBag') : t('product.addToCart'))}
              className={`flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-3 py-2 md:py-2.5 rounded-lg font-medium transition-colors w-full min-h-[44px] md:min-h-[40px] text-body-xs active:scale-[0.98] ${
                product.inStock && !isAdding
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <ShoppingCart className="h-3 w-3 md:h-3.5 md:w-3.5" aria-hidden="true" />
              <span>
                {isAdding ? t('product.adding') : (useBagText ? t('product.addToBag') : t('product.addToCart'))}
              </span>
            </button>
          )}
        </div>
      </div>

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

export default ProductCard
