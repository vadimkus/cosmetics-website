'use client'
import { errorLog } from '@/lib/logger'

import { useRouter } from 'next/navigation'
import { useCart } from '@/components/cart/CartProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import ErrorPage from '@/components/ErrorPage'
import { ArrowLeft, Sparkles, Star, Minus, Plus, ShoppingCart, Heart, Check, MessageCircle, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useCallback, useEffect } from 'react'
import { Product } from '@/types'
import ProductSchema from '@/components/schema/ProductSchema'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import ProductImageGallery from '@/components/product/ProductImageGallery'
import ProductDetails from '@/components/product/ProductDetails'
import ProductPriceDisplay from '@/components/product/ProductPriceDisplay'
import ProductVariantSelector from '@/components/product/ProductVariantSelector'
import ProductQuantityCart from '@/components/product/ProductQuantityCart'
import ProductContentDisplay from '@/components/product/ProductContentDisplay'
import ProductReviews from '@/components/product/ProductReviews'
import TrustBadges from '@/components/product/TrustBadges'
import ProductRecommendation from '@/components/product/ProductRecommendation'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { translateSize } from '@/utils/sizeTranslations'
import { translateCategory } from '@/utils/categoryTranslations'
import { 
  getPriceForSize, 
  hasProductSizeVariants, 
  hasProductColorVariants,
  getProductSizeOptions,
  getProductColorOptions
} from '@/utils/productPricing'

interface ProductPageClientProps {
  product: Product
}

export default function ProductPageClientRefactored({ product }: ProductPageClientProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { user } = useAuth()
  const { t, locale, dir } = useTranslation()
  const { isPWA } = usePWAMode()
  const isRTL = dir === 'rtl'
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  
  // Detect mobile web (non-PWA mobile)
  useEffect(() => {
    const checkMobileWeb = () => {
      const isMobile = window.innerWidth < 768
      setIsMobileWeb(isMobile && !isPWA)
    }
    checkMobileWeb()
    window.addEventListener('resize', checkMobileWeb)
    return () => window.removeEventListener('resize', checkMobileWeb)
  }, [isPWA])
  
  // Combined flag for PWA or mobile web
  const isAppLikeMode = isPWA || isMobileWeb
  
  // Variant state
  const sizeOptions = getProductSizeOptions(product.id)
  const colorOptions = getProductColorOptions(product.id)
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]?.value || '50g')
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]?.value || 'Beige')
  
  // Mobile footer state
  const [mobileQuantity, setMobileQuantity] = useState(1)
  const [isAddingMobile, setIsAddingMobile] = useState(false)
  const [isAddedMobile, setIsAddedMobile] = useState(false)
  
  // Share state
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')
  
  // Share handler
  const handleShare = useCallback(async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : `/products/${product.id}`
    const shareData = {
      title: product.name,
      text: `${t('product.checkOutProduct') || 'Check out'}: ${product.name} - GENOSYS Professional`,
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
        setTimeout(() => setShareStatus('idle'), 2000)
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setShareStatus('copied')
        setTimeout(() => setShareStatus('idle'), 2000)
      }
    }
  }, [product.id, product.name, t])
  
  // Calculate current price based on selected variant
  const currentPrice = useCallback(() => {
    if (hasProductSizeVariants(product.id)) {
      return getPriceForSize(product, selectedSize)
    }
    return product.price
  }, [product, selectedSize])

  // Handle add to cart
  const handleAddToCart = useCallback(async (quantity: number) => {
    if (!user) {
      router.push(getLocalizedPath('/login', locale))
      return
    }

    try {
      const colorToPass = hasProductColorVariants(product.id) ? selectedColor : undefined
      const sizeToPass = hasProductSizeVariants(product.id) ? selectedSize : undefined
      
      // Create a modified product with the correct price for variant products
      const productToAdd = hasProductSizeVariants(product.id)
        ? { ...product, price: getPriceForSize(product, selectedSize) }
        : product
      
      await addItem(productToAdd, quantity, colorToPass, sizeToPass)
    } catch (error) {
      errorLog('Error adding to cart:', error)
    }
  }, [user, product, selectedSize, selectedColor, addItem, router, locale])
  
  // Handle toggle favorite
  const handleToggleFavorite = useCallback(() => {
    if (!user) {
      router.push(getLocalizedPath('/login', locale))
      return
    }
    toggleFavorite(product)
  }, [user, product, toggleFavorite, router, locale])

  // Handle mobile add to cart
  const handleMobileAddToCart = useCallback(async () => {
    setIsAddingMobile(true)
    try {
      await handleAddToCart(mobileQuantity)
      // Show success state
      setIsAddingMobile(false)
      setIsAddedMobile(true)
      // Reset after 2 seconds
      setTimeout(() => {
        setIsAddedMobile(false)
      }, 2000)
    } catch {
      setIsAddingMobile(false)
    }
  }, [handleAddToCart, mobileQuantity])

  if (!product) {
    return <ErrorPage />
  }

  // Prepare variant data for selector
  const availableSizes = sizeOptions.map(option => ({
    ...option,
    price: getPriceForSize(product, option.value)
  }))

  const availableColors = colorOptions

  return (
    <div className="bg-white min-h-[100dvh] pb-24 lg:pb-0" dir={dir}>
      <ProductSchema product={product} />
      <BreadcrumbSchema 
        items={[
          { name: t('navigation.home'), url: getLocalizedPath('/', locale) },
          { name: t('navigation.products'), url: getLocalizedPath('/products', locale) },
          { name: product.name, url: getLocalizedPath(`/products/${product.id}`, locale) }
        ]}
      />

      {/* PWA / Mobile Web Simple Navigation Header */}
      {isAppLikeMode && (
        <div className={`flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button 
            onClick={() => router.push(getLocalizedPath('/products', locale))}
            className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base text-red-600">
              {t('navigation.products') || 'Products'}
            </span>
          </button>
          {/* Profile Icon - green dot only when logged in */}
          <button 
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
          >
            <div className="relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${user ? 'bg-red-600' : 'bg-gray-400'}`}>
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                </span>
              </div>
              {/* Green online dot - only when logged in */}
              {user && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
              )}
            </div>
          </button>
        </div>
      )}

      <div className="container mx-auto px-3 md:px-4 py-1 lg:py-8 lg:py-16">
        {/* Mobile Header - Product Name & Back Button (hide in PWA and mobile web mode) */}
        {!isAppLikeMode && (
          <div className="lg:hidden mb-1.5">
            {/* Back Link */}
            <Link 
              href={getLocalizedPath('/products', locale)}
              className={`inline-flex items-center text-gray-500 hover:text-primary-600 active:text-primary-700 transition-colors text-[10px] mb-6 font-medium touch-manipulation ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-3 w-3 flex-shrink-0 ${dir === 'rtl' ? 'ml-1 rotate-180' : 'mr-1'}`} />
              <span>{t('product.backToProducts')}</span>
            </Link>
          
          {/* Product Name - Centered */}
          <h1 className="text-sm lg:text-base md:text-lg font-bold text-gray-900 leading-tight text-center mb-0.5">
            {product.name}
          </h1>
          
          {/* Category & Size Badges - Centered (Stock badge is on image) */}
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="inline-block bg-primary-50 text-primary-700 px-1.5 py-0.5 text-[10px] lg:text-xs rounded-full font-medium">
              {product.category.split(',').map(cat => translateCategory(cat.trim(), locale)).join(' · ')}
            </span>
            {product.size && (
              <span className="inline-block bg-gray-100 text-gray-700 px-1.5 py-0.5 text-[10px] lg:text-xs rounded-full font-medium">
                {t('product.size')}: {product.size}
              </span>
            )}
          </div>
          
          {/* Rating - Centered */}
          <div className={`flex items-center justify-center gap-1 mt-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 lg:h-3.5 lg:w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[10px] lg:text-xs text-gray-600 font-medium">
              {(product.rating || 5.0).toFixed(1)}
            </span>
          </div>
          </div>
        )}

        {/* Desktop Back Button */}
        <div className={`hidden lg:flex items-center mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <Link 
            href={getLocalizedPath('/products', locale)}
            className={`inline-flex items-center text-gray-500 hover:text-primary-600 transition-colors text-sm font-medium ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${dir === 'rtl' ? 'ml-1.5 rotate-180' : 'mr-1.5'}`} />
            {t('product.backToProducts')}
          </Link>
        </div>

        {/* ============ UNIFIED RESPONSIVE LAYOUT ============ */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-12 ${dir === 'rtl' ? 'lg:grid-flow-row-dense' : ''}`}>
          {/* Left Column - Product Images and Purchase Controls */}
          <div className={`flex flex-col ${dir === 'rtl' ? 'lg:col-start-2' : ''}`}>
            
            {/* Desktop Product Header - Hidden on mobile */}
            <div className="hidden lg:block mb-4">
              {/* Category Badge */}
              <div className={`flex items-center justify-center flex-wrap gap-2 mb-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <span className="inline-block bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                  {product.category.split(',').map(cat => translateCategory(cat.trim(), locale)).join(' · ')}
                </span>
              </div>
              
              {/* Product Name */}
              <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2 text-center">
                {product.name}
              </h1>
              
              {/* Rating & Size */}
              <div className={`flex items-center justify-center flex-wrap gap-3 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-1.5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {(product.rating || 5.0).toFixed(1)}
                  </span>
                </div>
                {product.size && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span className={`text-gray-600 ${dir === 'rtl' ? 'flex flex-row-reverse gap-1' : ''}`}>
                      <span className="font-medium">{t('product.size')}:</span> {translateSize(product.size, locale, product.category)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Product Name - Above Image (PWA and Mobile Web) */}
            {isAppLikeMode && (
              <div className="lg:hidden mb-2 px-1">
                <h1 className="text-lg font-bold text-gray-900 leading-tight text-center">
                  {product.name}
                </h1>
              </div>
            )}

            {/* Image Gallery */}
            <div>
              <ProductImageGallery product={product} />
            </div>

            {/* Product Video - Only for Product ID 10 (Snow O2 Cleanser) */}
            {(product.id === '10' || product.productNumber === '10') && (
              <div className="mt-4 lg:mt-6 lg:max-w-sm lg:mx-auto">
                <div className="rounded-xl overflow-hidden shadow-lg bg-black">
                  <video
                    className="w-full aspect-video object-contain lg:aspect-auto"
                    controls
                    playsInline
                    preload="none"
                    poster="/Logo/BlackG.png"
                  >
                    <source src="/videos/Cleanser_02.mp4" type="video/mp4" />
                    {t('product.videoNotSupported') || 'Your browser does not support the video tag.'}
                  </video>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  {t('product.watchHowToUse') || 'Watch how to use'}
                </p>
              </div>
            )}
            
            {/* Size and Price - Below Image */}
            <div className="mt-1.5 lg:mt-4 flex justify-center">
              <ProductPriceDisplay 
                product={product}
                basePrice={currentPrice()}
                user={user}
              />
            </div>

            {/* Variant Selectors - Below Price */}
            <div className="mt-1.5 lg:mt-4">
              <ProductVariantSelector
                product={product}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                availableSizes={availableSizes}
                availableColors={availableColors}
                onSizeChange={setSelectedSize}
                onColorChange={setSelectedColor}
                user={user}
              />
            </div>

            {/* Quantity and Cart - Below Variants (Desktop only, mobile uses fixed footer) */}
            <div className="hidden lg:block mt-4">
              <ProductQuantityCart
                user={user}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite(product.id)}
                inStock={product.inStock}
                isPriceOnRequest={product.isPriceOnRequest ?? false}
                productName={product.name}
                productUrl={typeof window !== 'undefined' ? `${window.location.origin}/products/${product.id}` : `/products/${product.id}`}
              />
            </div>

            {/* Trust Badges - Below Cart (Desktop only, mobile shows after recommendations) */}
            <div className="hidden lg:block mt-4">
              <TrustBadges />
            </div>

            {/* Product Recommendation Section - Only for product 22 - Desktop only */}
            {(product.id === '22' || product.productNumber === '22') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="32"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 32 - Desktop only */}
            {(product.id === '32' || product.productNumber === '32') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="22"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 20 - Desktop only */}
            {(product.id === '20' || product.productNumber === '20') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="30"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 30 - Desktop only */}
            {(product.id === '30' || product.productNumber === '30') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="20"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 21 - Desktop only */}
            {(product.id === '21' || product.productNumber === '21') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="31"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 31 - Desktop only */}
            {(product.id === '31' || product.productNumber === '31') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="21"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 49 - Desktop only */}
            {(product.id === '49' || product.productNumber === '49') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="37"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 37 - Desktop only */}
            {(product.id === '37' || product.productNumber === '37') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="49"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - PRO Solution products (4, 5, 6, 7, 8, 9) - Desktop only */}
            {(product.id === '4' || product.productNumber === '4') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '5' || product.productNumber === '5') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '6' || product.productNumber === '6') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '7' || product.productNumber === '7') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '8' || product.productNumber === '8') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '9' || product.productNumber === '9') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 15 - Desktop only */}
            {(product.id === '15' || product.productNumber === '15') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="30"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 19 - Desktop only (mobile shows after NOTE block) */}
            {(product.id === '19' || product.productNumber === '19') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="27"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 18 - Desktop only */}
            {(product.id === '18' || product.productNumber === '18') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="29"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 29 - Desktop only */}
            {(product.id === '29' || product.productNumber === '29') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="18"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 10 - Desktop only */}
            {(product.id === '10' || product.productNumber === '10') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="16"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 25 - Desktop only */}
            {(product.id === '25' || product.productNumber === '25') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="38"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 33 - Desktop only */}
            {(product.id === '33' || product.productNumber === '33') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="17"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 17 - Desktop only */}
            {(product.id === '17' || product.productNumber === '17') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="24"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 24 - Desktop only */}
            {(product.id === '24' || product.productNumber === '24') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="17"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 44 - Desktop only */}
            {(product.id === '44' || product.productNumber === '44') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 43 - Desktop only */}
            {(product.id === '43' || product.productNumber === '43') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="44"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 45 - Desktop only */}
            {(product.id === '45' || product.productNumber === '45') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 46 - Desktop only */}
            {(product.id === '46' || product.productNumber === '46') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="44"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Scalp Brush (61) → Hair Tonic (43) - Desktop only */}
            {(product.productNumber === '61') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Bio-Ferment Mask (51) → Anti-Wrinkle Serum (22) - Desktop only */}
            {(product.id === '51') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="22"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Skincare Routine Block - Only for Problem Skin Care Beauty Box (product 55) - Desktop only */}
            {(product.id === '55' || product.productNumber === '55') && (
              <div className="hidden lg:block bg-blue-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">{t('product.recommendedProblemSkinRoutine')}</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSnowO2Title')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineProblemControlTonerTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineProblemControlTonerDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineProblemControlSerumTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineProblemControlSerumDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineProblemControlCreamTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineProblemControlCreamDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSoothingBombMaskTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSoothingBombMaskDescProblem')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skincare Routine Block - Only for Skin Brightening Beauty Box (product 56) - Desktop only */}
            {(product.id === '56' || product.productNumber === '56') && (
              <div className="hidden lg:block bg-orange-50 border-2 border-orange-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-orange-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">{t('product.recommendedSkinBrighteningRoutine')}</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSnowO2Title')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSnowBoosterTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowBoosterDescBrightening')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineMultiVitaSerumTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineMultiVitaSerumDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineMultiVitaCreamTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineMultiVitaCreamDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routinePeelingGelTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routinePeelingGelDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">6</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSoothingBombMaskTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSoothingBombMaskDescBrightening')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skincare Routine Block - Only for Charming Look Beauty Box (product 57) - Desktop only */}
            {(product.id === '57' || product.productNumber === '57') && (
              <div className="hidden lg:block bg-pink-50 border-2 border-pink-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-pink-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">{t('product.recommendedSkincareMakeupRoutine')}</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSnowO2Title')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSnowBoosterTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowBoosterDescMakeup')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineBBCushionTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineBBCushionDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineMakeupRemoverTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineMakeupRemoverDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineOvernightMaskTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineOvernightMaskDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skincare Routine Block - Only for Anti-Aging Beauty Box (product 58) - Desktop only */}
            {(product.id === '58' || product.productNumber === '58') && (
              <div className="hidden lg:block bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">{t('product.recommendedAntiAgingRoutine')}</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSnowO2Title')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSnowBoosterTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowBoosterDescAntiAging')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineAntiWrinkleSerumTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineAntiWrinkleSerumDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineAntiWrinkleCreamTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineAntiWrinkleCreamDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineCollagenMaskTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineCollagenMaskDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skincare Routine Block - Only for Deep Moisturizing Beauty Box (product 59) - Desktop only */}
            {(product.id === '59' || product.productNumber === '59') && (
              <div className="hidden lg:block bg-cyan-50 border-2 border-cyan-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-cyan-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">{t('product.recommendedDeepMoisturizingRoutine')}</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSnowO2Title')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSnowBoosterTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowBoosterDescMoisturizing')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineHyaluronSerumTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineHyaluronSerumDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineHyaluronCreamTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineHyaluronCreamDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSoothingBombMaskTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSoothingBombMaskDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skincare Routine Block - Only for Sensitive Skin Beauty Box (product 62) - Desktop only */}
            {(product.id === '62' || product.productNumber === '62') && (
              <div className="hidden lg:block bg-pink-50 border-2 border-pink-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-pink-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">{t('product.recommendedSensitiveSkinRoutine')}</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSnowO2Title')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSnowBoosterTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowBoosterDescSensitive')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineAllForSensitiveSerumTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineAllForSensitiveSerumDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSkinBarrierCreamTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSkinBarrierCreamDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineEGFOxymaskTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineEGFOxymaskDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">6</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{t('product.routineSoothingBombMaskTitle')}</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSoothingBombMaskDescSensitive')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Details and Content */}
          <div className={`space-y-6 ${dir === 'rtl' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
            {/* Product Details - Hidden on desktop (info shown in desktop header above image in left column) */}
            {/* Hidden on mobile (info shown in mobile header above image) */}
            <div className="hidden">
              <ProductDetails product={product} />
            </div>

            {/* Detailed Product Content */}
            <ProductContentDisplay product={product} />

            {/* Product Recommendations - Mobile only (shows after content) */}
            {(product.id === '19' || product.productNumber === '19') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="27"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '22' || product.productNumber === '22') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="32"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '32' || product.productNumber === '32') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="22"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '20' || product.productNumber === '20') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="30"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '30' || product.productNumber === '30') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="20"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '21' || product.productNumber === '21') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="31"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '31' || product.productNumber === '31') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="21"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '49' || product.productNumber === '49') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="37"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '37' || product.productNumber === '37') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="49"
                  currentProduct={product}
                />
              </div>
            )}
            {/* Product Recommendation Section - PRO Solution products (4, 5, 6, 7, 8, 9) - Mobile only */}
            {(product.id === '4' || product.productNumber === '4') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '5' || product.productNumber === '5') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '6' || product.productNumber === '6') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '7' || product.productNumber === '7') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '8' || product.productNumber === '8') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '9' || product.productNumber === '9') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '15' || product.productNumber === '15') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="30"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '18' || product.productNumber === '18') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="29"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '29' || product.productNumber === '29') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="18"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '10' || product.productNumber === '10') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="16"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '25' || product.productNumber === '25') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="38"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '33' || product.productNumber === '33') && (
              <div className="lg:hidden mt-2">
                <ProductRecommendation 
                  recommendedProductId="17"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '17' || product.productNumber === '17') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="24"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '24' || product.productNumber === '24') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="17"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '44' || product.productNumber === '44') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '43' || product.productNumber === '43') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="44"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '45' || product.productNumber === '45') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '46' || product.productNumber === '46') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="44"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Scalp Brush (61) → Hair Tonic (43) - Mobile only */}
            {(product.productNumber === '61') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Bio-Ferment Mask (51) → Anti-Wrinkle Serum (22) - Mobile only */}
            {(product.id === '51') && (
              <div className="lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="22"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Trust Badges - Mobile only, hidden in PWA */}
            {!isPWA && (
              <div className="lg:hidden mt-3">
                <TrustBadges />
              </div>
            )}

            {/* Product Reviews */}
            <ProductReviews productId={product.id} />
          </div>
        </div>
      </div>

      {/* Sticky Mobile Footer - Add to Cart or Request Quote */}
      <div 
        className="lg:hidden sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
        style={{
          paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 3%)`,
        }}
      >
        <div className="container mx-auto px-3 pt-3 pb-1">
          <div className={`flex items-center gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            {/* Quantity Controls - Hide for price on request products */}
            {!product.isPriceOnRequest && (
              <div className={`flex items-center border border-gray-300 rounded-lg bg-gray-50 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={() => setMobileQuantity(prev => prev > 1 ? prev - 1 : 1)}
                  className="p-2.5 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={t('product.decreaseQuantity')}
                >
                  <Minus className="h-4 w-4 text-gray-600" />
                </button>
                <span className="px-3 py-1.5 text-center min-w-[2.5rem] font-semibold text-gray-900">
                  {mobileQuantity}
                </span>
                <button
                  onClick={() => setMobileQuantity(prev => prev + 1)}
                  className="p-2.5 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={t('product.increaseQuantity')}
                >
                  <Plus className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            )}

            {/* Add to Cart Button or Request Quote */}
            {product.isPriceOnRequest ? (
              <a
                href={`https://wa.me/971585487665?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Could you please provide pricing information?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 active:bg-green-700 flex items-center justify-center gap-2 touch-manipulation min-h-[44px]"
                style={{ touchAction: 'manipulation' }}
              >
                <MessageCircle className={`h-5 w-5 flex-shrink-0 ${dir === 'rtl' ? 'order-last' : ''}`} />
                <span className="text-sm sm:text-base">{t('products.requestQuote') || 'Request Quote'}</span>
              </a>
            ) : (
              <button
                onClick={handleMobileAddToCart}
                disabled={isAddingMobile || isAddedMobile || !user || !product.inStock}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation min-h-[44px] ${
                  isAddedMobile
                    ? 'bg-green-500 text-white'
                    : !product.inStock || !user || isAddingMobile
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                {isAddedMobile ? (
                  <>
                    <Check className={`h-5 w-5 flex-shrink-0 ${dir === 'rtl' ? 'order-last' : ''}`} />
                    <span className="text-sm sm:text-base">{t('product.addedToBag') || 'Added to Bag!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className={`h-5 w-5 flex-shrink-0 ${dir === 'rtl' ? 'order-last' : ''}`} />
                    <span className="text-sm sm:text-base">{!product.inStock ? t('product.outOfStock') : isAddingMobile ? t('product.adding') : isAppLikeMode ? t('product.addToBag') : t('product.addToCart')}</span>
                  </>
                )}
              </button>
            )}

            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              disabled={!user}
              className={`p-3 rounded-lg transition-colors border-2 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isFavorite(product.id)
                  ? 'bg-red-50 border-red-500 text-red-600 active:bg-red-100'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400 active:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={isFavorite(product.id) ? t('product.removeFromFavorites') : t('product.addToFavorites')}
            >
              <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
            </button>
            
            {/* Share Button */}
            <button
              onClick={handleShare}
              className={`p-3 rounded-lg transition-colors border-2 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${
                shareStatus === 'copied'
                  ? 'border-green-500 bg-green-50 text-green-600'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400 active:bg-gray-50'
              }`}
              aria-label={t('product.shareProduct') || 'Share'}
              title={shareStatus === 'copied' ? (t('product.linkCopied') || 'Link copied!') : (t('product.shareProduct') || 'Share')}
            >
              {shareStatus === 'copied' ? (
                <Check className="h-5 w-5" />
              ) : (
                <Share2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
