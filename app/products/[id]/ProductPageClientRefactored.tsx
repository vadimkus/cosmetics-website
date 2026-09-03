'use client'
import { errorLog } from '@/lib/logger'
import { trackProductView, trackAddToCart } from '@/lib/analytics'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/cart/CartProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import ErrorPage from '@/components/ErrorPage'
import LocaleSwitchInline from '@/components/LocaleSwitchInline'
import { Sparkles, Star, Minus, Plus, ShoppingCart, Heart, Check, MessageCircle, Share2, TrendingUp, Play } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { Product } from '@/types'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import ProductImageGallery from '@/components/product/ProductImageGallery'
import ProductPriceDisplay from '@/components/product/ProductPriceDisplay'
import ProductVariantSelector from '@/components/product/ProductVariantSelector'
import ProductQuantityCart from '@/components/product/ProductQuantityCart'
import ProductContentDisplay from '@/components/product/ProductContentDisplay'
import ProductQuickFactsHelper from '@/components/product/ProductQuickFactsHelper'
import ProductReviews from '@/components/product/ProductReviews'
import TrustBadges from '@/components/product/TrustBadges'
import ProductRecommendation from '@/components/product/ProductRecommendation'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useIsMobileWeb } from '@/hooks/useIsMobile'
import { translateSize } from '@/utils/sizeTranslations'
import { translateCategory } from '@/utils/categoryTranslations'
import { formatProductDisplayName } from '@/utils/formatProductDisplayName'
import { 
  getPriceForSize, 
  hasProductSizeVariants, 
  hasProductColorVariants,
  getProductSizeOptions,
  getProductColorOptions
} from '@/utils/productPricing'
import { ROUTINE_STEP_PRODUCT_IDS } from '@/lib/routineStepLinks'
import { getRoutineStepImage } from '@/lib/routineStepImages'
import { PRODUCT_ROUTINES } from '@/lib/productRoutines'
import ProductRoutineCard from '@/components/product/ProductRoutineCard'
import { UNITS_SOLD_DISPLAY_THRESHOLD, roundUnitsSold } from '@/lib/salesDisplay'
import { findSelectedStandardCartLine } from '@/lib/cartVariantSelection'
import AccountAvatar from '@/components/AccountAvatar'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

interface ProductPageClientProps {
  product: Product
  /** Real units sold (non-cancelled orders) - 0/undefined hides the badge. */
  unitsSold?: number
}

export default function ProductPageClientRefactored({ product, unitsSold = 0 }: ProductPageClientProps) {
  const router = useRouter()
  const { addItem, items: cartItems, updateQuantity } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { user } = useAuth()
  const { t, locale, dir, messages } = useTranslation()
  const { isPWA } = usePWAMode()
  const isRTL = dir === 'rtl'
  const { isMobileWeb } = useIsMobileWeb()

  // Combined flag for PWA or mobile web
  const isAppLikeMode = isPWA || isMobileWeb
  
  // Variant state
  const productNum = product.productNumber || product.id
  const useLegacyBeautyBoxRoutine = !PRODUCT_ROUTINES[String(productNum)]
  const sizeOptions = getProductSizeOptions(productNum, product)
  const colorOptions = getProductColorOptions(productNum)
  // An absent variant is an empty selection, never a synthetic product fact.
  // The old 50g/Beige fallbacks leaked into Beauty Box Quick Facts even though
  // boxes have no direct size or shade option of their own.
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]?.value || '')
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]?.value || '')
  
  // Mobile footer state
  const [mobileQuantity, setMobileQuantity] = useState(1)
  const [isAddingMobile, setIsAddingMobile] = useState(false)
  // Video player mounts only after the user taps play - until then a compact
  // play button keeps the layout tight and avoids loading video bytes.
  const [videoOpen, setVideoOpen] = useState(false)
  const [isAddedMobile, setIsAddedMobile] = useState(false)
  
  // Share state
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')
  const displayName = formatProductDisplayName(product.name)

  // Live review aggregate - source of truth for stars (seeded product.rating is not trusted)
  const [reviewAggregate, setReviewAggregate] = useState<{ averageRating: number | null; reviewCount: number } | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/products/${product.id}/reviews`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!cancelled && data) {
          setReviewAggregate({
            averageRating: data.averageRating ?? null,
            reviewCount: data.reviewCount ?? 0,
          })
        }
      })
      .catch(() => { /* silent - rating just won't show */ })
    return () => { cancelled = true }
  }, [product.id])

  const displayRating = reviewAggregate && reviewAggregate.reviewCount > 0 ? reviewAggregate.averageRating : null
  const displayReviewCount = reviewAggregate?.reviewCount ?? 0
  
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
    if (hasProductSizeVariants(productNum, product)) {
      return getPriceForSize(product, selectedSize)
    }
    return product.price
  }, [product, productNum, selectedSize])

  // Handle add to cart
  const handleAddToCart = useCallback(async (quantity: number) => {
    if (!user) {
      router.push(getLocalizedPath('/login', locale))
      return
    }

    try {
      const colorToPass = hasProductColorVariants(productNum) ? selectedColor : undefined
      const sizeToPass = hasProductSizeVariants(productNum, product) ? selectedSize : undefined
      
      // Create a modified product with the correct price for variant products
      const productToAdd = hasProductSizeVariants(productNum, product)
        ? { ...product, price: getPriceForSize(product, selectedSize) }
        : product
      
      await addItem(productToAdd, quantity, colorToPass, sizeToPass)
      // GA4 add_to_cart
      try {
        trackAddToCart({
          id: product.id,
          name: product.name,
          category: product.category || 'Cosmetics',
          price: productToAdd.price,
          quantity,
        })
      } catch { /* best-effort */ }
    } catch (error) {
      errorLog('Error adding to cart:', error)
      // Rethrow so callers (e.g. the mobile handler) don't show a false
      // "Added to Bag" success state when the add actually failed.
      throw error
    }
  }, [user, product, productNum, selectedSize, selectedColor, addItem, router, locale])

  // The PDP action belongs to the currently selected variant, not the product
  // aggregate. A 600 ml line must not make the 200 ml selection look in-cart.
  const selectedCartColor = hasProductColorVariants(productNum) ? selectedColor : ''
  const selectedCartSize = hasProductSizeVariants(productNum, product) ? selectedSize : ''
  const selectedCartLine = findSelectedStandardCartLine(
    cartItems,
    product.id,
    selectedCartColor,
    selectedCartSize,
  )
  const inCartQty = selectedCartLine?.quantity || 0

  const handleDecrementFromCart = useCallback(() => {
    if (inCartQty <= 0) return
    updateQuantity(product.id, inCartQty - 1, selectedCartColor, selectedCartSize)
  }, [inCartQty, product.id, selectedCartColor, selectedCartSize, updateQuantity])

  // Routine-step titles deep-link to each product's page (self-links skipped)
  const routineTitle = (key: string) => {
    const pid = ROUTINE_STEP_PRODUCT_IDS[key]
    const label = t(`product.${key}`)
    if (!pid || String(product.id) === pid || String(product.productNumber || '') === pid) return label
    return (
      <Link
        href={getLocalizedPath(`/products/${pid}`, locale)}
        className="underline decoration-gray-300 underline-offset-2 transition-colors hover:text-[var(--cera-rose-ink)] hover:decoration-primary-400"
      >
        {label}
      </Link>
    )
  }

  // Routine-step marker: numbered circle + product thumbnail side by side
  // (falls back to just the numbered circle when the step has no image).
  // Thumbnails deep-link to the step's product page, same as the title.
  const RoutineStepMarker = ({ n, titleKey }: { n: number; titleKey: string }) => {
    const img = getRoutineStepImage(titleKey)
    const numberCircle = (
      <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[var(--cera-cta)] text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">{n}</span>
    )
    if (!img) return numberCircle
    const pid = ROUTINE_STEP_PRODUCT_IDS[titleKey]
    const isSelf = !pid || String(product.id) === pid || String(product.productNumber || '') === pid
    const thumb = (
      <Image
        src={img}
        alt=""
        width={56}
        height={56}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-[var(--cera-line)] bg-white"
      />
    )
    return (
      <span className={`flex-shrink-0 flex items-start gap-1.5 sm:gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        {numberCircle}
        {isSelf ? (
          <span className="flex-shrink-0 block mt-0.5">{thumb}</span>
        ) : (
          <Link href={getLocalizedPath(`/products/${pid}`, locale)} className="flex-shrink-0 block mt-0.5 transition-opacity hover:opacity-80" aria-label={t(`product.${titleKey}`)}>
            {thumb}
          </Link>
        )}
      </span>
    )
  }

  // GA4 view_item - fire once per product view
  useEffect(() => {
    if (!product?.id) return
    try {
      trackProductView({
        id: product.id,
        name: product.name,
        category: product.category || 'Cosmetics',
        price: product.price,
      })
    } catch { /* best-effort */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id])
  
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
    <div className={`cera-page genosys-page min-h-[100dvh] pb-24 md:pb-0`} dir={dir}>
      {/* PWA / Mobile Web Simple Navigation Header.
          mweb-float-sticky-top is what makes this stick and float, and only on
          mobile web. In the PWA the bar stays static in flow as before. */}
      {isAppLikeMode && (
        <div className={`mweb-float-sticky-top z-40 flex items-center justify-between px-5 py-4 bg-white border-b border-[var(--cera-line)] ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button 
            onClick={() => router.push(getLocalizedPath('/products', locale))}
            className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className={`w-5 h-5 text-[var(--cera-rose-ink)] ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-[15px] text-[var(--cera-rose-ink)]">
              {t('navigation.products') || 'Products'}
            </span>
          </button>

          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* The site headers hide on product routes, so this bar is the only
                place a phone can change language without leaving the product. */}
            <LocaleSwitchInline />
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--cera-body)] hover:bg-[var(--cera-cream-deep)] active:bg-[var(--cera-cream-deep)] transition-colors"
              aria-label={t('product.shareProduct') || 'Share'}
            >
              {shareStatus === 'copied' ? (
                <Check className="h-5 w-5 text-[var(--cera-ok)]" />
              ) : (
                <Share2 className="h-5 w-5" />
              )}
            </button>
            {/* Profile Icon - green dot only when logged in */}
            <button 
              onClick={() => router.push(getLocalizedPath('/profile', locale))}
            >
            <AccountAvatar name={user?.name} signedIn={!!user} />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1200px] px-4 py-1 sm:px-6 md:py-8 lg:py-16">
        {/* Breadcrumb - hidden in app-like mode (PWA/mobile web) which has its own header.
            Share lives next to the product title (desktop) / in the mobile row below,
            not stranded at the end of the breadcrumb. */}
        {!isAppLikeMode && (
          <div className={`flex items-center justify-between gap-3 pt-2 md:pt-0 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            {/* `bare` because this crumb shares a flex row with the mobile share
                button. The row itself sits in the standard band below. */}
            <PageBreadcrumb
              bare
              className="min-w-0 flex-1"
              items={[
                { name: t('common.home'), href: getLocalizedPath('/', locale) },
                { name: t('common.products'), href: getLocalizedPath('/products', locale) },
                { name: product.name },
              ]}
            />
            <button
              onClick={handleShare}
              className={`md:hidden p-2 rounded-full flex-shrink-0 transition-colors ${
                shareStatus === 'copied'
                  ? 'text-[var(--cera-ok)] bg-[var(--cera-ok-bg)]'
                  : 'text-[var(--cera-muted)] hover:text-[var(--cera-rose-ink)] hover:bg-[var(--cera-cream-deep)]'
              }`}
              aria-label={t('product.shareProduct') || 'Share'}
              title={shareStatus === 'copied' ? (t('product.linkCopied') || 'Link copied!') : (t('product.shareProduct') || 'Share')}
            >
              {shareStatus === 'copied' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </button>
          </div>
        )}

        {/* Mobile Header - Product Name & metadata (hide in PWA and mobile web mode) */}
        {!isAppLikeMode && (
          <div className="md:hidden mb-1.5">
            {/* Product Name - Centered */}
            {/* Same mobile product name as the app-like branch below, so it takes the same
                serif treatment. The two had drifted apart. */}
            <h1 className="cera-serif mb-0.5 text-center text-[17px] leading-tight text-[var(--cera-ink)] md:text-lg">
              {displayName}
            </h1>

            {/* Category & Size Badges - Centered (Stock badge is on image) */}
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="inline-block bg-[var(--cera-blush)] text-[var(--cera-rose-ink)] px-1.5 py-0.5 text-[10px] lg:text-xs rounded-full font-medium">
                {product.category.split(',').map(cat => translateCategory(cat.trim(), messages)).join(' · ')}
              </span>
              {product.size && (
                <span className="inline-block bg-[var(--cera-cream-deep)] text-[var(--cera-body)] px-1.5 py-0.5 text-[10px] lg:text-xs rounded-full font-medium">
                  {t('product.size')}: {product.size}
                </span>
              )}
            </div>

            {/* Rating - Centered (honest: driven by real review count, not seeded product.rating) */}
            <div className={`flex items-center justify-center gap-1 mt-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {displayRating && displayRating > 0 ? (
                <>
                  <div className={`flex ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 lg:h-3.5 lg:w-3.5 ${i < Math.round(displayRating) ? 'fill-amber-400 text-[var(--cera-rose)]' : 'text-[var(--cera-blush-deep)]'}`}
                      />
                    ))}
                  </div>
                  <a href="#reviews" className="text-[10px] lg:text-xs text-[var(--cera-body)] font-medium hover:text-[var(--cera-rose-ink)] transition-colors">
                    {displayRating.toFixed(1)} ({displayReviewCount})
                  </a>
                </>
              ) : (
                <a
                  href="#reviews"
                  className="text-[11px] lg:text-xs text-[var(--cera-muted)] hover:text-[var(--cera-rose-ink)] font-medium transition-colors"
                >
                  {t('product.beTheFirstToReview')}
                </a>
              )}
            </div>
          </div>
        )}

        {/* ============ UNIFIED RESPONSIVE LAYOUT ============ */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 lg:gap-12 ${dir === 'rtl' ? 'md:grid-flow-row-dense' : ''}`}>
          {/* Left Column - Product Images and Purchase Controls */}
          <div className={`flex flex-col ${dir === 'rtl' ? 'md:col-start-2' : ''}`}>
            
            {/* Desktop Product Header - Hidden on mobile.
                Left-aligned on lg+ for scannability; the category badge + title +
                rating row all share the same x-edge so the eye reads top-down
                instead of chasing a centered midline. */}
            <div className="hidden md:block mb-4">
              {/* Category Badge */}
              <div className={`flex items-center flex-wrap gap-2 mb-3 ${dir === 'rtl' ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                <span className="inline-block bg-gradient-to-r from-[var(--cera-blush)] to-[var(--cera-blush)] text-[var(--cera-rose-ink)] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                  {product.category.split(',').map(cat => translateCategory(cat.trim(), messages)).join(' · ')}
                </span>
              </div>

              {/* Product Name - larger at lg+, tracking-tight for tighter line economy.
                  Share sits inline after the title, standard PDP placement. */}
              <div className={`flex items-start gap-2 mb-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <h1 className={`cera-serif text-3xl xl:text-4xl text-[var(--cera-ink)] leading-tight tracking-tight ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {displayName}
                </h1>
                <button
                  onClick={handleShare}
                  className={`p-2 mt-1 rounded-full flex-shrink-0 transition-colors ${
                    shareStatus === 'copied'
                      ? 'text-[var(--cera-ok)] bg-[var(--cera-ok-bg)]'
                      : 'text-[var(--cera-muted)] hover:text-[var(--cera-rose-ink)] hover:bg-[var(--cera-cream-deep)]'
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

              {/* Rating & Size (honest: driven by real review count) */}
              <div className={`flex items-center flex-wrap gap-3 text-sm ${dir === 'rtl' ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                {displayRating && displayRating > 0 ? (
                  <a href="#reviews" className={`flex items-center gap-1.5 hover:text-[var(--cera-rose-ink)] transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.round(displayRating) ? 'fill-amber-400 text-[var(--cera-rose)]' : 'text-[var(--cera-blush-deep)]'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[var(--cera-body)] font-medium">
                      {displayRating.toFixed(1)} <span className="text-[var(--cera-muted)] font-normal">({displayReviewCount})</span>
                    </span>
                  </a>
                ) : (
                  <a
                    href="#reviews"
                    className="text-[var(--cera-muted)] hover:text-[var(--cera-rose-ink)] font-medium transition-colors"
                  >
                    {t('product.beTheFirstToReview')}
                  </a>
                )}
                {product.size && (
                  <>
                    <span className="text-[var(--cera-blush-deep)]">|</span>
                    <span className={`text-[var(--cera-body)] ${dir === 'rtl' ? 'flex flex-row-reverse gap-1' : ''}`}>
                      <span className="font-medium">{t('product.size')}:</span> {translateSize(product.size, locale, product.category)}
                    </span>
                  </>
                )}
                {/* Social proof from real order data (see lib/salesStats.ts) */}
                {unitsSold >= UNITS_SOLD_DISPLAY_THRESHOLD && (
                  <>
                    <span className="text-[var(--cera-blush-deep)]">|</span>
                    <span className={`inline-flex items-center gap-1 text-[var(--cera-body)] font-medium ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <TrendingUp className="h-3.5 w-3.5 text-[var(--cera-rose-ink)]" aria-hidden="true" />
                      {t('product.unitsSold', { count: roundUnitsSold(unitsSold).toLocaleString() })}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Product Name - Above Image (PWA and Mobile Web) */}
            {isAppLikeMode && (
              <div className="md:hidden mb-2 px-1">
                <h1 className="cera-serif text-lg text-[var(--cera-ink)] leading-tight text-center">
                  {displayName}
                </h1>
              </div>
            )}

            {/* Customer-facing quick facts - kept high in the PDP hierarchy,
                directly below the product heading. */}
            <div className="mb-3 md:mb-4" data-product-quick-facts-slot="header">
              <ProductQuickFactsHelper
                product={product}
                unitsSold={unitsSold}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
              />
            </div>

            {/* Image Gallery */}
            <div>
              <ProductImageGallery product={product} />
            </div>

            {/* Product Video - dynamic from DB videoUrl field. The player sizes
                itself to the video's intrinsic aspect ratio (portrait clips
                stay tall and centered instead of letterboxing in a 16:9 box);
                max-h caps portrait videos so they don't dominate the page. */}
            {product.videoUrl && (
              <div className="mt-4 lg:mt-6 lg:max-w-sm lg:mx-auto">
                {!videoOpen ? (
                  <button
                    type="button"
                    onClick={() => setVideoOpen(true)}
                    aria-label={t('product.watchVideo') || 'Watch product video'}
                    className="group mx-auto flex flex-col items-center gap-2 py-2 focus:outline-none"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cera-cream-deep)] text-[var(--cera-body)] shadow-md transition-all group-hover:bg-[var(--cera-blush-deep)] group-hover:scale-105 group-active:scale-95">
                      <Play className="h-7 w-7 ml-0.5 fill-current" />
                    </span>
                    <span className="text-xs font-medium text-[var(--cera-muted)] group-hover:text-[var(--cera-body)] transition-colors">
                      {t('product.watchVideo') || 'Watch product video'}
                    </span>
                  </button>
                ) : (
                  <div className="flex justify-center">
                    <video
                      className="block h-auto w-auto max-h-[65vh] max-w-full overflow-hidden rounded-xl bg-white shadow-lg"
                      controls
                      autoPlay
                      playsInline
                      preload="auto"
                      onLoadedMetadata={(e) => {
                        // Browsers size a <video> from the poster's aspect ratio
                        // until playback starts; adopt the real video ratio as
                        // soon as metadata arrives so portrait clips render tall.
                        const v = e.currentTarget
                        if (v.videoWidth && v.videoHeight) {
                          v.style.aspectRatio = `${v.videoWidth} / ${v.videoHeight}`
                        }
                      }}
                      // Collapse back to the play button once the clip finishes
                      // so the page doesn't keep a dead black player on screen.
                      onEnded={() => setVideoOpen(false)}
                    >
                      <source src={product.videoUrl} type="video/mp4" />
                      {t('product.videoNotSupported') || 'Your browser does not support the video tag.'}
                    </video>
                  </div>
                )}
              </div>
            )}
            
            {/* Size and Price - Below Image */}
            <div className="mt-1.5 lg:mt-4 flex justify-center">
              <ProductPriceDisplay 
                product={product}
                basePrice={currentPrice()}
                user={user}
                selectedSize={hasProductSizeVariants(productNum, product) ? selectedSize : undefined}
                selectedColor={hasProductColorVariants(productNum) ? selectedColor : undefined}
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
                onSizeChange={(size) => {
                  setSelectedSize(size)
                  setIsAddedMobile(false)
                }}
                onColorChange={(color) => {
                  setSelectedColor(color)
                  setIsAddedMobile(false)
                }}
                user={user}
              />
            </div>

            {/* Quantity and Cart - Below Variants (Desktop only, mobile uses fixed footer) */}
            <div className="hidden md:block mt-4">
              <ProductQuantityCart
                user={user}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite(product.id)}
                inStock={product.inStock}
                isPriceOnRequest={product.isPriceOnRequest ?? false}
                productName={product.name}
                inCartQty={inCartQty}
                onDecrementFromCart={handleDecrementFromCart}
              />
            </div>

            {/* Trust Badges - Below Cart (Desktop only, mobile shows after recommendations).
                Stacked vertically because the left column is too narrow (~590px) to fit
                all three whitespace-nowrap badges on one line. */}
            <div className="hidden md:block mt-4">
              <TrustBadges layout="stacked" />
            </div>

            {/* Skincare Routine Block - Only for Problem Skin Care Beauty Box (product 55) - Desktop only */}
            {useLegacyBeautyBoxRoutine && (product.id === '55' || product.productNumber === '55') && (
              <div className="hidden md:block bg-white border border-[var(--cera-line)] rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[var(--cera-rose-ink)] flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-[var(--cera-ink)] leading-tight">{t('product.recommendedProblemSkinRoutine')}</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={1} titleKey="routineSnowO2Title" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowO2Title')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={2} titleKey="routineProblemControlTonerTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineProblemControlTonerTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineProblemControlTonerDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={3} titleKey="routineProblemControlSerumTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineProblemControlSerumTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineProblemControlSerumDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={4} titleKey="routineProblemControlCreamTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineProblemControlCreamTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineProblemControlCreamDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={5} titleKey="routineSoothingBombMaskTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSoothingBombMaskTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSoothingBombMaskDescProblem')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skincare Routine Block - Only for Skin Brightening Beauty Box (product 56) - Desktop only */}
            {useLegacyBeautyBoxRoutine && (product.id === '56' || product.productNumber === '56') && (
              <div className="hidden md:block bg-white border border-[var(--cera-line)] rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[var(--cera-rose-ink)] flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-[var(--cera-ink)] leading-tight">{t('product.recommendedSkinBrighteningRoutine')}</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={1} titleKey="routineSnowO2Title" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowO2Title')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={2} titleKey="routineSnowBoosterTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowBoosterTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowBoosterDescBrightening')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={3} titleKey="routineMultiVitaSerumTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineMultiVitaSerumTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineMultiVitaSerumDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={4} titleKey="routineMultiVitaCreamTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineMultiVitaCreamTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineMultiVitaCreamDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={5} titleKey="routinePeelingGelTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routinePeelingGelTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routinePeelingGelDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={6} titleKey="routineSoothingBombMaskTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSoothingBombMaskTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSoothingBombMaskDescBrightening')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skincare Routine Block - Only for Charming Look Beauty Box (product 57) - Desktop only */}
            {useLegacyBeautyBoxRoutine && (product.id === '57' || product.productNumber === '57') && (
              <div className="hidden md:block bg-white border border-[var(--cera-line)] rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[var(--cera-rose-ink)] flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-[var(--cera-ink)] leading-tight">{t('product.recommendedSkincareMakeupRoutine')}</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={1} titleKey="routineSnowO2Title" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowO2Title')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={2} titleKey="routineSnowBoosterTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowBoosterTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowBoosterDescMakeup')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={3} titleKey="routineBBCushionTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineBBCushionTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineBBCushionDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={4} titleKey="routineMakeupRemoverTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineMakeupRemoverTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineMakeupRemoverDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={5} titleKey="routineOvernightMaskTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineOvernightMaskTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineOvernightMaskDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skincare Routine Block - Only for Anti-Aging Beauty Box (product 58) - Desktop only */}
            {useLegacyBeautyBoxRoutine && (product.id === '58' || product.productNumber === '58') && (
              <div className="hidden md:block bg-white border border-[var(--cera-line)] rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[var(--cera-rose-ink)] flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-[var(--cera-ink)] leading-tight">{t('product.recommendedAntiAgingRoutine')}</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={1} titleKey="routineSnowO2Title" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowO2Title')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={2} titleKey="routineSnowBoosterTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowBoosterTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowBoosterDescAntiAging')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={3} titleKey="routineAntiWrinkleSerumTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineAntiWrinkleSerumTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineAntiWrinkleSerumDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={4} titleKey="routineAntiWrinkleCreamTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineAntiWrinkleCreamTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineAntiWrinkleCreamDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={5} titleKey="routineCollagenMaskTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineCollagenMaskTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineCollagenMaskDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skincare Routine Block - Only for Deep Moisturizing Beauty Box (product 59) - Desktop only */}
            {useLegacyBeautyBoxRoutine && (product.id === '59' || product.productNumber === '59') && (
              <div className="hidden md:block bg-white border border-[var(--cera-line)] rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[var(--cera-rose-ink)] flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-[var(--cera-ink)] leading-tight">{t('product.recommendedDeepMoisturizingRoutine')}</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={1} titleKey="routineSnowO2Title" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowO2Title')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={2} titleKey="routineSnowBoosterTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowBoosterTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowBoosterDescMoisturizing')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={3} titleKey="routineHyaluronSerumTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineHyaluronSerumTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineHyaluronSerumDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={4} titleKey="routineHyaluronCreamTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineHyaluronCreamTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineHyaluronCreamDesc')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <RoutineStepMarker n={5} titleKey="routineSoothingBombMaskTitle" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--cera-ink)] text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSoothingBombMaskTitle')}</h4>
                      <p className="text-[var(--cera-body)] text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSoothingBombMaskDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data-driven + Revita 63 + Cerabarrier 66 - desktop left column.
                Mobile web: same card after Product Details in ProductContentDisplay. */}
            <ProductRoutineCard product={product} className="hidden md:block mt-4" />

            {/* Product Recommendation Section - Only for product 22 - Desktop only */}
            {(product.id === '22' || product.productNumber === '22') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="32"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 32 - Desktop only */}
            {(product.id === '32' || product.productNumber === '32') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="22"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 20 - Desktop only */}
            {(product.id === '20' || product.productNumber === '20') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="30"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 30 - Desktop only */}
            {(product.id === '30' || product.productNumber === '30') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="20"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 21 - Desktop only */}
            {(product.id === '21' || product.productNumber === '21') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="31"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 31 - Desktop only */}
            {(product.id === '31' || product.productNumber === '31') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="21"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 49 - Desktop only */}
            {(product.id === '49' || product.productNumber === '49') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="37"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 37 - Desktop only */}
            {(product.id === '37' || product.productNumber === '37') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="49"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - PRO Solution products (4, 5, 6, 7, 8, 9) - Desktop only */}
            {(product.id === '4' || product.productNumber === '4') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '5' || product.productNumber === '5') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '6' || product.productNumber === '6') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '7' || product.productNumber === '7') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '8' || product.productNumber === '8') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '9' || product.productNumber === '9') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 15 - Desktop only */}
            {(product.id === '15' || product.productNumber === '15') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="30"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 19 - Desktop only (mobile shows after NOTE block) */}
            {(product.id === '19' || product.productNumber === '19') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="27"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 18 - Desktop only */}
            {(product.id === '18' || product.productNumber === '18') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="29"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 29 - Desktop only */}
            {(product.id === '29' || product.productNumber === '29') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="18"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 10 - Desktop only */}
            {(product.id === '10' || product.productNumber === '10') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="16"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 25 - Desktop only */}
            {(product.id === '25' || product.productNumber === '25') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="38"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 33 - Desktop only */}
            {(product.id === '33' || product.productNumber === '33') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="17"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 17 - Desktop only */}
            {(product.id === '17' || product.productNumber === '17') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="24"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 24 - Desktop only */}
            {(product.id === '24' || product.productNumber === '24') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="17"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 44 - Desktop only */}
            {(product.id === '44' || product.productNumber === '44') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 43 - Desktop only */}
            {(product.id === '43' || product.productNumber === '43') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="44"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 45 - Desktop only */}
            {(product.id === '45' || product.productNumber === '45') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 46 - Desktop only */}
            {(product.id === '46' || product.productNumber === '46') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="44"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Scalp Brush (61) → Hair Tonic (43) - Desktop only */}
            {(product.productNumber === '61') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Bio-Ferment Mask (51) → Anti-Wrinkle Serum (22) - Desktop only */}
            {(product.id === '51') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="22"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Hair Stamp (64) → HairGen Booster device (3) - Desktop only */}
            {(product.productNumber === '64') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="3"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Bio-Meso PDRN Ampoule 60000 (60) → Soothing Repair Postcream (25) - Desktop only */}
            {(product.productNumber === '60') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="25"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Bio-Meso PDRN Homecare Ampoule 5000 (65) → Soothing Repair Postcream (25) - Desktop only */}
            {(product.productNumber === '65') && (
              <div className="hidden md:block">
                <ProductRecommendation 
                  recommendedProductId="25"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Barrier-first night ritual: Overnight Mask (34) ↔ Cerabarrier Cleanser (66) */}
            {(product.id === '34' || product.productNumber === '34') && (
              <div className="hidden md:block">
                <ProductRecommendation
                  recommendedProductId="66"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '66' || product.productNumber === '66') && (
              <div className="hidden md:block">
                <ProductRecommendation
                  recommendedProductId="34"
                  currentProduct={product}
                />
              </div>
            )}

          </div>

          {/* Right Column - Product Details and Content */}
          <div className={`space-y-6 ${dir === 'rtl' ? 'md:col-start-1 md:row-start-1' : ''}`}>
            {/* Detailed Product Content */}
            <ProductContentDisplay product={product} />


            {/* Product Recommendations - Mobile only (shows after content) */}
            {(product.id === '19' || product.productNumber === '19') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="27"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '22' || product.productNumber === '22') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="32"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '32' || product.productNumber === '32') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="22"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '20' || product.productNumber === '20') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="30"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '30' || product.productNumber === '30') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="20"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '21' || product.productNumber === '21') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="31"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '31' || product.productNumber === '31') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="21"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '49' || product.productNumber === '49') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="37"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '37' || product.productNumber === '37') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="49"
                  currentProduct={product}
                />
              </div>
            )}
            {/* Product Recommendation Section - PRO Solution products (4, 5, 6, 7, 8, 9) - Mobile only */}
            {(product.id === '4' || product.productNumber === '4') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '5' || product.productNumber === '5') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '6' || product.productNumber === '6') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '7' || product.productNumber === '7') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '8' || product.productNumber === '8') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '9' || product.productNumber === '9') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="1"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '15' || product.productNumber === '15') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="30"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '18' || product.productNumber === '18') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="29"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '29' || product.productNumber === '29') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="18"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '10' || product.productNumber === '10') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="16"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '25' || product.productNumber === '25') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="38"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '33' || product.productNumber === '33') && (
              <div className="md:hidden mt-2">
                <ProductRecommendation 
                  recommendedProductId="17"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '17' || product.productNumber === '17') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="24"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '24' || product.productNumber === '24') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="17"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '44' || product.productNumber === '44') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '43' || product.productNumber === '43') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="44"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '45' || product.productNumber === '45') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '46' || product.productNumber === '46') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="44"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Scalp Brush (61) → Hair Tonic (43) - Mobile only */}
            {(product.productNumber === '61') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Bio-Ferment Mask (51) → Anti-Wrinkle Serum (22) - Mobile only */}
            {(product.id === '51') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="22"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Hair Stamp (64) → HairGen Booster device (3) - Mobile only */}
            {(product.productNumber === '64') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="3"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Bio-Meso PDRN Ampoule 60000 (60) → Soothing Repair Postcream (25) - Mobile only */}
            {(product.productNumber === '60') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="25"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Bio-Meso PDRN Homecare Ampoule 5000 (65) → Soothing Repair Postcream (25) - Mobile only */}
            {(product.productNumber === '65') && (
              <div className="md:hidden">
                <ProductRecommendation 
                  recommendedProductId="25"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Barrier-first night ritual: Overnight Mask (34) ↔ Cerabarrier Cleanser (66) - Mobile only */}
            {(product.id === '34' || product.productNumber === '34') && (
              <div className="md:hidden">
                <ProductRecommendation
                  recommendedProductId="66"
                  currentProduct={product}
                />
              </div>
            )}
            {(product.id === '66' || product.productNumber === '66') && (
              <div className="md:hidden">
                <ProductRecommendation
                  recommendedProductId="34"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Trust Badges - Mobile only, hidden in PWA */}
            {!isPWA && (
              <div className="md:hidden mt-3">
                <TrustBadges />
              </div>
            )}

            {/* Product Reviews (anchor target for rating links) */}
            <div id="reviews" className="scroll-mt-20">
              <ProductReviews productId={product.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Footer - Add to Cart or Request Quote */}
      <div 
        // The home indicator sits in the bar's own padding here, and moves out
        // into the gap beneath it once mweb-float-sticky-bottom applies.
        className="pdp-buy-bar mweb-float-sticky-bottom md:hidden sticky bottom-0 left-0 right-0 bg-white border-t border-[var(--cera-line)] shadow-lg z-50"
      >
        <div className="container mx-auto px-3 pt-3 pb-1">
          <div className={`flex items-center gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            {/* Quantity Controls - hidden for price-on-request products and
                once the item is in the cart (the stepper takes over). */}
            {!product.isPriceOnRequest && !(inCartQty > 0 && product.inStock && user) && (
              <div className={`flex items-center border border-[var(--cera-line)] rounded-lg bg-[var(--cera-cream-deep)] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={() => setMobileQuantity(prev => prev > 1 ? prev - 1 : 1)}
                  className="p-2.5 hover:bg-[var(--cera-cream-deep)] active:bg-[var(--cera-cream-deep)] transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={t('product.decreaseQuantity')}
                >
                  <Minus className="h-4 w-4 text-[var(--cera-body)]" />
                </button>
                <span className="px-3 py-1.5 text-center min-w-[2.5rem] font-semibold text-[var(--cera-ink)]">
                  {mobileQuantity}
                </span>
                <button
                  onClick={() => setMobileQuantity(prev => Math.min(prev + 1, 99))}
                  className="p-2.5 hover:bg-[var(--cera-cream-deep)] active:bg-[var(--cera-cream-deep)] transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={t('product.increaseQuantity')}
                >
                  <Plus className="h-4 w-4 text-[var(--cera-body)]" />
                </button>
              </div>
            )}

            {/* Add to Cart Button, in-cart stepper, or Request Quote */}
            {product.isPriceOnRequest ? (
              <a
                href={`https://wa.me/971585487665?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Could you please provide pricing information?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-[var(--cera-ink)] active:bg-[var(--cera-ink)] flex items-center justify-center gap-2 touch-manipulation min-h-[44px]"
                style={{ touchAction: 'manipulation' }}
              >
                <MessageCircle className={`h-5 w-5 flex-shrink-0 ${dir === 'rtl' ? 'order-last' : ''}`} />
                <span className="text-sm sm:text-base">{t('products.requestQuote') || 'Request Quote'}</span>
              </a>
            ) : inCartQty > 0 && product.inStock && user ? (
              /* In-cart stepper: [-] [In Bag (N)] [+] - adjusts the cart line
                 directly, same pattern as the mobile app and the grid cards. */
              <div
                className={`flex-1 flex items-center justify-between gap-2 rounded-lg font-semibold min-h-[44px] px-1.5 py-1 bg-[var(--cera-ink)] text-white ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                role="group"
                aria-label={`${isAppLikeMode ? t('product.inBag') : t('product.inCart')} (${inCartQty}) - ${product.name}`}
                style={{ touchAction: 'manipulation' }}
              >
                <button
                  type="button"
                  onClick={handleDecrementFromCart}
                  disabled={isAddingMobile}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-white/15 hover:bg-white/25 active:bg-white/35 transition-colors disabled:opacity-50 touch-manipulation"
                  aria-label={t('cart.decreaseQuantity') || 'Decrease quantity'}
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => router.push(getLocalizedPath('/cart', locale))}
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm sm:text-base tabular-nums min-h-9 rounded-md hover:bg-white/10 active:bg-white/20 transition-colors"
                  aria-label={`${t('product.viewBag') || 'View Bag'} (${inCartQty})`}
                >
                  <Check className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  {`${isAppLikeMode ? t('product.viewBag') : t('product.inCart')} (${inCartQty})`}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setIsAddingMobile(true)
                    try {
                      await handleAddToCart(1)
                    } catch { /* handled upstream */ } finally {
                      setIsAddingMobile(false)
                    }
                  }}
                  disabled={isAddingMobile}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-white/15 hover:bg-white/25 active:bg-white/35 transition-colors disabled:opacity-50 touch-manipulation"
                  aria-label={t('cart.increaseQuantity') || 'Increase quantity'}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleMobileAddToCart}
                disabled={isAddingMobile || isAddedMobile || !product.inStock}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation min-h-[44px] ${
                  isAddedMobile
                    ? 'bg-green-500 text-white'
                    : !product.inStock || isAddingMobile
                      ? 'bg-[var(--cera-blush-deep)] text-[var(--cera-muted)] cursor-not-allowed'
                      : 'bg-[var(--cera-rose)] text-white hover:bg-[var(--cera-rose-ink)] active:bg-[var(--cera-rose-ink)]'
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
                    {/* Guests get an actionable "Login to Shop" (handleAddToCart
                        routes to /login) instead of a dead disabled button. */}
                    <span className="text-sm sm:text-base">{!product.inStock ? t('product.outOfStock') : isAddingMobile ? t('product.adding') : !user ? t('product.loginToShop') : isAppLikeMode ? t('product.addToBag') : t('product.addToCart')}</span>
                  </>
                )}
              </button>
            )}

            {/* Favorite Button (Share moved to header to widen CTA) */}
            <button
              onClick={handleToggleFavorite}
              disabled={!user}
              className={`p-3 rounded-lg transition-colors border-2 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isFavorite(product.id)
                  ? 'bg-[var(--cera-blush)] border-red-500 text-[var(--cera-rose-ink)] active:bg-red-100'
                  : 'border-[var(--cera-line)] text-[var(--cera-body)] hover:border-[var(--cera-blush-deep)] active:bg-[var(--cera-cream-deep)]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={isFavorite(product.id) ? t('product.removeFromFavorites') : t('product.addToFavorites')}
            >
              <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
