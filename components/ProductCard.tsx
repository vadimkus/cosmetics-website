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
import { getLocalizedPath } from '@/lib/i18n'

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
  
  // Get Arabic translation for description if available
  const arabicTranslations = locale === 'ar' ? getProductTranslations(product.id) : null
  const description = arabicTranslations?.description || product.description

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
      
      <div className="p-3 md:p-4">
        <div className="mb-2">
          <span className="text-xs md:text-sm text-primary-600 font-medium">{product.category}</span>
        </div>
        
        <div className="mb-2">
          <Link href={productPath}>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>
        </div>
        
        {(product.size || product.id === '37') && (
          <div className="mb-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
              {t('product.size')}: {product.id === '37' ? '38g x 5ea (5 masks, 1 box)' : product.size}
            </span>
          </div>
        )}
        
        <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
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
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-primary-600">
                              {pricing.discountedPrice.toFixed(2)} AED
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {pricing.originalPrice.toFixed(2)} AED
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-green-600 font-medium">
                              {pricing.discountPercentage}% {t('product.off')}
                            </span>
                            <span className="text-xs text-gray-500">{t('product.vatIncluded')}</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-base font-bold text-primary-600">
                            {pricing.originalPrice.toFixed(2)} AED
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{t('product.vatIncluded')}</p>
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
              <span className="text-base font-bold text-gray-500">
                {t('product.loginToSeePrice')}
              </span>
            )}
            
            {product.inStock && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
                {product.id === '47' ? t('products.orderByRequest') : t('product.inStock')}
              </span>
            )}
          </div>
        </div>
        
        {/* Button Section */}
        {!user ? (
          <button
            onClick={handleLoginClick}
            className={`flex items-center justify-center gap-2 px-3 ${locale === 'ar' ? 'py-2' : 'py-2.5'} rounded-lg font-medium transition-colors touch-manipulation w-full bg-primary-600 text-white hover:bg-primary-700 ${locale === 'ar' ? 'min-h-[40px] text-xs' : 'min-h-[44px] text-sm'}`}
            aria-label={t('product.loginToSeePrice')}
          >
            <User className={`${locale === 'ar' ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} aria-hidden="true" />
            <span>{t('product.loginToSeePrice')}</span>
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            aria-label={isAdding ? t('product.adding') : t('product.addToCart')}
            className={`flex items-center justify-center gap-2 px-3 ${locale === 'ar' ? 'py-2' : 'py-2.5'} rounded-lg font-medium transition-colors touch-manipulation w-full ${locale === 'ar' ? 'min-h-[40px] text-xs' : 'min-h-[44px] text-sm'} ${
              product.inStock && !isAdding
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className={`${locale === 'ar' ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} aria-hidden="true" />
            <span>
              {isAdding ? t('product.adding') : t('product.addToCart')}
            </span>
          </button>
        )}
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
