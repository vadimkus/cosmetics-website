'use client'

import { Product } from '@/types'
import { useCart } from './CartProvider'
import { useFavorites } from './FavoritesProvider'
import { useAuth } from './AuthProvider'
import { ShoppingCart, Heart, Lock, User } from 'lucide-react'
import { useState, memo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LoginModal from './LoginModal'
import { calculateDiscountedPrice, canUserSeePrices } from '@/lib/discountUtils'
import { debugLog, errorLog } from '@/lib/logger'
import { useTranslation } from '@/hooks/useTranslation'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getLocalizedPath } from '@/lib/i18n'
import { translateSize } from '@/utils/sizeTranslations'
import { translateCategory } from '@/utils/categoryTranslations'

interface ProductCardProps {
  product: Product
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { user } = useAuth()
  const { t, locale } = useTranslation()
  const productPath = getLocalizedPath(`/products/${product.productNumber || product.id}`, locale)
  const [isAdding, setIsAdding] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  
  // Get translation for description if available
  // Use productNumber for translations (translations are keyed by productNumber, not UUID)
  const productIdForTranslation = product.productNumber || product.id
  const arabicTranslations = locale === 'ar' ? getProductTranslations(productIdForTranslation) : null
  const russianTranslations = locale === 'ru' ? getProductTranslationsRu(productIdForTranslation) : null
  const translations = arabicTranslations || russianTranslations
  const description = translations?.description || product.description

  const handleAddToCart = useCallback(async () => {
    setIsAdding(true)
    addItem(product, 1, '', '')
    // Simulate a brief loading state
    setTimeout(() => setIsAdding(false), 500)
  }, [addItem, product])

  const handleFavorite = useCallback(async (e?: React.MouseEvent | React.TouchEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setIsTogglingFavorite(true)
    toggleFavorite(product)
    // Brief delay for visual feedback
    setTimeout(() => setIsTogglingFavorite(false), 300)
  }, [toggleFavorite, product])

  const handleLoginClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowLoginModal(true)
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="relative">
        <Link href={productPath} className="block">
          <Image
            src={product.image}
            alt={`${product.name} - GENOSYS Korean ${product.category || 'dermacosmetics'} professional skincare product UAE`}
            width={300}
            height={300}
            className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover cursor-pointer hover:scale-105 transition-transform"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            priority={false}
            quality={85}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={(e) => {
              errorLog('Image failed to load:', product.image, e)
            }}
            onLoad={() => {
              debugLog('Image loaded successfully:', product.image)
            }}
          />
        </Link>
        <button 
          onClick={handleFavorite}
          onTouchStart={(e: React.TouchEvent<HTMLButtonElement>) => {
            e.preventDefault()
            handleFavorite(e)
          }}
          disabled={isTogglingFavorite}
          className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors touch-manipulation z-20 min-h-[44px] min-w-[44px] flex items-center justify-center ${
            isTogglingFavorite ? 'opacity-50' : ''
          }`}
          title={isFavorite(product.id) ? t('product.removeFromFavorites') : t('product.addToFavorites')}
          aria-label={isFavorite(product.id) ? t('product.removeFromFavorites') : t('product.addToFavorites')}
          style={{ touchAction: 'manipulation' }}
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
      
      <div className="p-3 md:p-4 flex flex-col h-full">
        <div className="mb-2">
          <span className="text-xs md:text-sm text-primary-600 font-medium">{translateCategory(product.category, locale)}</span>
        </div>
        
        <div className="mb-2">
          <Link href={productPath}>
            <h3 className="text-sm md:text-lg font-semibold text-gray-800 line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>
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
            {canUserSeePrices(user) ? (
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
                                <span className="text-[10px] md:text-xs text-green-600 font-medium">15% off</span>
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
        <div className="mt-auto">
          {!user ? (
            <button
              onClick={handleLoginClick}
              className={`flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg font-medium transition-colors touch-manipulation w-full bg-primary-600 text-white hover:bg-primary-700 min-h-[36px] md:min-h-[40px] text-[10px] md:text-xs`}
              aria-label={t('product.loginToSeePrice')}
            >
              <User className="h-3 w-3 md:h-3.5 md:w-3.5" aria-hidden="true" />
              <span>{t('product.loginToSeePrice')}</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              aria-label={isAdding ? t('product.adding') : t('product.addToCart')}
              className={`flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2.5 rounded-lg font-medium transition-colors touch-manipulation w-full min-h-[36px] md:min-h-[40px] text-[10px] md:text-xs ${
                product.inStock && !isAdding
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="h-3 w-3 md:h-3.5 md:w-3.5" aria-hidden="true" />
              <span>
                {isAdding ? t('product.adding') : t('product.addToCart')}
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
    </div>
  )
})

export default ProductCard
