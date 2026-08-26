'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { Star, ShoppingCart, Minus, Plus, Heart, Lock, MessageCircle, AlertTriangle, Share2, Check } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/components/cart/CartProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { useState, useCallback, useEffect, useRef } from 'react'
import { canUserSeePrices } from '@/lib/discountUtils'
import { getPricingDisplay } from '@/lib/pricingDisplay'
import { errorLog } from '@/lib/logger'
import { useTranslation } from '@/hooks/useTranslation'
import { translateSize } from '@/utils/sizeTranslations'
import { usePWAMode } from '@/hooks/usePWAMode'
import { getLocalizedPath } from '@/lib/i18n'

interface ProductInfoProps {
  product: Product
  selectedSize: string
  setSelectedSize: (size: string) => void
  quantity: number
  setQuantity: React.Dispatch<React.SetStateAction<number>>
}

export default function ProductInfo({ 
  product, 
  selectedSize, 
  setSelectedSize, 
  quantity, 
  setQuantity 
}: ProductInfoProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { t, locale } = useTranslation()
  const { isPWA } = usePWAMode()
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [isAdding, setIsAdding] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')
  const shareTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up timer on unmount
  useEffect(() => () => { if (shareTimerRef.current) clearTimeout(shareTimerRef.current) }, [])
  
  // Detect mobile for "Add to Bag" text
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Use "Add to Bag" for PWA and mobile web
  const useBagText = isPWA || isMobile

  const getPriceForSize = useCallback((size: string) => {
    if (product.id === '1') {
      return 230
    }
    if (product.id === '10') {
      return size === '180ml' ? 330 : 510
    }
    if (product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31') {
      return size === '50g' ? 290 : 420
    }
    if (product.id === '15') {
      return size === '200ml' ? 260 : 490
    }
    if (product.id === '16') {
      return size === '200ml' ? 260 : 490
    }
    if (product.id === '25') {
      return size === '20g' ? 204 : 440
    }
    return product.price
  }, [product])

  const handleAddToCart = useCallback(async () => {
    if (!user) {
      router.push(getLocalizedPath('/login', locale))
      return
    }

    setIsAdding(true)
    try {
      const sizeToPass = (product.id === '1' || product.id === '10' || product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31' || product.id === '15' || product.id === '16' || product.id === '25') ? selectedSize : undefined
      
      const productToAdd = (product.id === '1' || product.id === '10' || product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31' || product.id === '15' || product.id === '16' || product.id === '25')
        ? { ...product, price: getPriceForSize(selectedSize) }
        : product
      
      await addItem(productToAdd, quantity, undefined, sizeToPass)
    } catch (error) {
      errorLog('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }, [addItem, product, quantity, selectedSize, user, router, locale, getPriceForSize])

  const handleToggleFavorite = useCallback(() => {
    if (!user) {
      router.push(getLocalizedPath('/login', locale))
      return
    }
    toggleFavorite(product)
  }, [toggleFavorite, product, user, router, locale])

  const handleShare = useCallback(async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
    const shareData = {
      title: product.name,
      text: `${t('product.checkOutProduct')}: ${product.name} - GENOSYS Professional`,
      url: shareUrl
    }

    // Try native share API first (mobile devices)
    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled or share failed - silently ignore
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
        setShareStatus('copied')
        shareTimerRef.current = setTimeout(() => setShareStatus('idle'), 2000)
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setShareStatus('copied')
        shareTimerRef.current = setTimeout(() => setShareStatus('idle'), 2000)
      }
    }
  }, [product.name, t])

  return (
    <div className="lg:col-span-1">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
      <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>

      {/* Rating */}
      <div className="flex items-center mb-4">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-current" />
          ))}
        </div>
        <span className={`text-gray-600 text-sm ${locale === 'ar' ? 'mr-2' : 'ml-2'}`}>({(product.rating || 5.0).toFixed(1)}/5)</span>
      </div>

      {/* Price and Size */}
      <div className="flex items-center gap-4 mt-12 pt-4">
        {(product.size || product.id === '1' || product.id === '41' || product.id === '10' || product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31' || product.id === '24' || product.id === '16' || product.id === '25' || product.id === '37') && (
          <div className="text-sm font-medium text-gray-700">
            {t('product.size')}: {product.id === '1' ? '0.25mm/0.5mm/0.1mm/0.15mm/0.2mm' : product.id === '41' ? '15g' : product.id === '10' ? '180ml/500ml' : product.id === '31' ? '50g/230g' : (product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28') ? '50g/250g' : product.id === '15' ? '200ml/500ml' : product.id === '16' ? '200ml/1000ml' : product.id === '25' ? '20g/100g' : product.id === '24' ? '20g' : product.id === '37' ? '38g x 5ea (5 masks, 1 box)' : translateSize(product.size, locale, product.category)}
          </div>
        )}
        {canUserSeePrices(user) ? (
          <>
            {(() => {
              const basePrice = getPriceForSize((product.id === '1' || product.id === '10' || product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31' || product.id === '15' || product.id === '16' || product.id === '25') ? selectedSize : 'default')
              const productWithPrice = { ...product, price: basePrice }
              const pricing = getPricingDisplay(productWithPrice, user, { selectedSize })
              
              return (
                <div>
                  {pricing.hasDiscount ? (
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl md:text-3xl font-bold text-primary-600">
                          {pricing.displayPrice.toFixed(2)} AED
                        </span>
                        {pricing.originalPrice ? (
                          <span className="text-lg text-gray-500 line-through">
                            {pricing.originalPrice.toFixed(2)} AED
                          </span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[var(--status-green-deep)] font-medium">
                          {pricing.discountPercentage}% {t('product.off')}
                        </span>
                        <span className="text-sm text-gray-600">({t('product.vatIncluded')})</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-primary-600">
                        {pricing.displayPrice.toFixed(2)} AED
                      </div>
                      <div className="text-sm font-normal text-gray-600">({t('product.vatIncluded')})</div>
                    </div>
                  )}
                </div>
              )
            })()}
          </>
        ) : user ? (
          <div className="flex items-center text-gray-500">
            <Lock className={`h-5 w-5 ${locale === 'ar' ? 'ml-2' : 'mr-2'}`} />
            <span className="text-lg">{t('product.priceLocked')}</span>
          </div>
        ) : (
          <button
            onClick={() => router.push(getLocalizedPath('/login', locale))}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            {t('product.loginToSeePrice')}
          </button>
        )}
      </div>

      {/* Size Options */}
      {(product.id === '1' || product.id === '10' || product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31' || product.id === '15' || product.id === '16' || product.id === '25') && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">{t('product.selectSize')}</h4>
          <div className="flex flex-wrap gap-3">
            {product.id === '1' && (
              <>
                {[{ size: '0.25mm', price: 230 }, { size: '0.5mm', price: 230 }, { size: '0.1mm', price: 230 }, { size: '0.15mm', price: 230 }, { size: '0.2mm', price: 230 }].map((option) => (
                  <button
                    key={option.size}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSize === option.size
                        ? 'border-primary-600 bg-primary-50 text-primary-800'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedSize(option.size)}
                  >
                    <div className="text-center">
                      <div className="font-medium">{option.size}</div>
                      {user ? (
                        <div className="text-sm text-gray-500">{option.price} AED</div>
                      ) : (
                        <div className="text-sm text-gray-400">{t('product.loginToSeePrice')}</div>
                      )}
                    </div>
                  </button>
                ))}
              </>
            )}
            {product.id === '10' && (
              <>
                {[{ size: '180ml', price: 330 }, { size: '500ml', price: 510 }].map((option) => (
                  <button
                    key={option.size}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSize === option.size
                        ? 'border-primary-600 bg-primary-50 text-primary-800'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedSize(option.size)}
                  >
                    <div className="text-center">
                      <div className="font-medium">{option.size}</div>
                      {user ? (
                        <div className="text-sm text-gray-500">{option.price} AED</div>
                      ) : (
                        <div className="text-sm text-gray-400">{t('product.loginToSeePrice')}</div>
                      )}
                    </div>
                  </button>
                ))}
              </>
            )}
            {(product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31') && (
              <>
                {[{ size: '50g', price: 290 }, { size: '250g', price: 420 }].map((option) => (
                  <button
                    key={option.size}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSize === option.size
                        ? 'border-primary-600 bg-primary-50 text-primary-800'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedSize(option.size)}
                  >
                    <div className="text-center">
                      <div className="font-medium">{option.size}</div>
                      {user ? (
                        <div className="text-sm text-gray-500">{option.price} AED</div>
                      ) : (
                        <div className="text-sm text-gray-400">{t('product.loginToSeePrice')}</div>
                      )}
                    </div>
                  </button>
                ))}
              </>
            )}
            {(product.id === '15' || product.id === '16') && (
              <>
                {[{ size: '200ml', price: 260 }, { size: '500ml', price: 490 }].map((option) => (
                  <button
                    key={option.size}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSize === option.size
                        ? 'border-primary-600 bg-primary-50 text-primary-800'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedSize(option.size)}
                  >
                    <div className="text-center">
                      <div className="font-medium">{option.size}</div>
                      {user ? (
                        <div className="text-sm text-gray-500">{option.price} AED</div>
                      ) : (
                        <div className="text-sm text-gray-400">{t('product.loginToSeePrice')}</div>
                      )}
                    </div>
                  </button>
                ))}
              </>
            )}
            {product.id === '25' && (
              <>
                {[{ size: '20g', price: 180 }, { size: '100g', price: 450 }].map((option) => (
                  <button
                    key={option.size}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSize === option.size
                        ? 'border-primary-600 bg-primary-50 text-primary-800'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedSize(option.size)}
                  >
                    <div className="text-center">
                      <div className="font-medium">{option.size}</div>
                      {user ? (
                        <div className="text-sm text-gray-500">{option.price} AED</div>
                      ) : (
                        <div className="text-sm text-gray-400">{t('product.loginToSeePrice')}</div>
                      )}
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center mt-6">
        <h4 className={`text-sm font-medium text-gray-700 ${locale === 'ar' ? 'ml-4' : 'mr-4'}`}>{t('product.quantity')}:</h4>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity((prev: number) => Math.max(1, prev - 1))}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 text-gray-800 font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((prev: number) => prev + 1)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Disclaimer for professional products */}
      {product.disclaimer && (
        <div className="mt-6 p-4 bg-[var(--status-orange-bg)] border border-[var(--status-orange-line)] rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[var(--status-orange)] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--status-orange)] font-medium">{product.disclaimer}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        {product.isPriceOnRequest ? (
          <a
            href={`https://wa.me/971585487665?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Could you please provide pricing information?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[var(--brand-whatsapp-deep)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--brand-whatsapp-hover)] transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            {t('products.requestQuote')}
          </a>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('product.adding')}
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                {useBagText ? t('product.addToBag') : t('product.addToCart')}
              </>
            )}
          </button>
        )}
        <button
          onClick={handleToggleFavorite}
          className={`p-3 rounded-lg border ${
            isFavorite(product.id)
              ? 'border-red-500 bg-red-50 text-red-600'
              : 'border-gray-300 text-gray-600 hover:border-gray-400'
          } transition-colors flex items-center justify-center`}
          aria-label={isFavorite(product.id) ? t('product.removeFromFavorites') : t('product.addToFavorites')}
        >
          <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={handleShare}
          className={`p-3 rounded-lg border transition-colors flex items-center justify-center ${
            shareStatus === 'copied'
              ? 'border-[var(--status-green-deep)] bg-[var(--status-green-bg)] text-[var(--status-green-deep)]'
              : 'border-gray-300 text-gray-600 hover:border-gray-400'
          }`}
          aria-label={t('product.shareProduct')}
          title={shareStatus === 'copied' ? t('product.linkCopied') : t('product.shareProduct')}
        >
          {shareStatus === 'copied' ? (
            <Check className="h-5 w-5" />
          ) : (
            <Share2 className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  )
}