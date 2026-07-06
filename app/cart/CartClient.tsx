'use client'

import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import CartItem from '@/components/cart/CartItem'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnimationStore } from '@/lib/animationStore'
import { springPresets } from '@/lib/appleAnimations'
import FreeMaskPromotion from '@/components/FreeMaskPromotion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Lock, MessageCircle, Truck, Gift, ShoppingBag } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { isBlackFridaySaleActive } from '@/lib/blackFridayUtils'
import { getCartLinePricing, getCartRetailTotal } from '@/lib/cartPricing'
import { calculateVatIncluded, calculateMobileShipping, MOBILE_CHECKOUT_CONFIG } from '@/lib/mobileCheckoutConfig'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useIsMobileWeb } from '@/hooks/useIsMobile'
import { useRouter, useSearchParams } from 'next/navigation'


export default function CartClient() {
  const { items, getTotalPrice, getTotalItems, selectedEmirate, setSelectedEmirate, _hasHydrated } = useCart()
  const { user } = useAuth()
  const { t, locale, dir } = useTranslation()
  const { isPWA } = usePWAMode()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isRTL = dir === 'rtl'
  const fromProfile = searchParams?.get('from') === 'profile'
  const { enabled: animationsEnabled } = useAnimationStore()
  const [showUniVideo, setShowUniVideo] = useState(false)
  const uniVideoRef = useRef<HTMLVideoElement>(null)
  const { isMobileWeb } = useIsMobileWeb()

  // Combined flag for PWA or mobile web
  const isAppLikeMode = isPWA || isMobileWeb
  
  // Compute total items directly from items array for reactivity
  const totalItemCount = items.reduce((total, item) => total + item.quantity, 0)

  // Rule: free / promotion items must always render at the END of the cart,
  // even if the user adds more bundles/products after them. The native app
  // enforces this in CartContext; here we apply a display-time stable sort
  // so the website matches the same UX. An item is considered "free" when
  // its effective unit price is zero (promo, 100% bundle discount, etc.)
  // or when explicitly flagged as a promotion item in the future.
  const isFreeCartItem = (item: typeof items[number]) => {
    const price = Number(item?.product?.price)
    if (Number.isFinite(price) && price <= 0) return true
    const bundlePct = Number((item as { bundleDiscountPercent?: number })?.bundleDiscountPercent)
    if ((item as { fromBundle?: boolean })?.fromBundle && Number.isFinite(bundlePct) && bundlePct >= 100) return true
    return Boolean((item as { isPromotionItem?: boolean })?.isPromotionItem)
  }
  const displayItems = [...items].sort((a, b) => (isFreeCartItem(a) ? 1 : 0) - (isFreeCartItem(b) ? 1 : 0))
  
  // Start video after 3 seconds on mobile (for cart with items)
  useEffect(() => {
    if (items.length > 0) {
      const timer = setTimeout(() => {
        setShowUniVideo(true)
        if (uniVideoRef.current) {
          uniVideoRef.current.play().catch(() => {
            // Auto-play may fail, that's okay
          })
        }
      }, 3000)
      
      return () => clearTimeout(timer)
    }
    return () => {} // Cleanup function for when condition is false
  }, [items.length])
  
  // Black Friday countdown state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)
  const [saleProgress, setSaleProgress] = useState(0)
  const [isSaleActive, setIsSaleActive] = useState(false)

  // Emirates list with shipping costs — single source of truth shared with
  // checkout and the mobile backend (rates drift = display vs charge mismatch)
  const emirates = MOBILE_CHECKOUT_CONFIG.emirates

  // Function to translate emirate names based on locale
  const getEmirateDisplayName = (emirateName: string): string => {
    if (locale === 'ru') {
      const translations: Record<string, string> = {
        'Dubai': 'Дубай',
        'Abu Dhabi': 'Абу-Даби',
        'Sharjah': 'Шарджа',
        'Ajman': 'Аджман',
        'Ras Al Khaimah': 'Рас-эль-Хайма',
        'Fujairah': 'Фуджейра',
        'Umm Al Quwain': 'Умм-эль-Кайвайн'
      }
      return translations[emirateName] || emirateName
    }
    return emirateName
  }

  const subtotal = getTotalPrice(user)
  const shippingCost = calculateMobileShipping(subtotal, selectedEmirate || 'Dubai')
  const total = subtotal + shippingCost
  const freeShippingThreshold = MOBILE_CHECKOUT_CONFIG.freeShippingThreshold
  
  // Check if Black Friday sale is active
  const blackFridayActive = isBlackFridaySaleActive()
  
  // Check if cart contains beauty boxes and calculate bundle savings
  const beautyBoxSavings = items.reduce((savings, item) => {
    const pricing = getCartLinePricing(item, user)
    if (pricing.discountType === 'beauty_box') {
      return savings + pricing.discountAmount
    }
    return savings
  }, 0)
  
  const hasBeautyBoxes = beautyBoxSavings > 0
  
  // Calculate original subtotal (before Black Friday discount) for display
  const originalSubtotal = blackFridayActive && items.length > 0
    ? getCartRetailTotal(items, user)
    : subtotal

  // Black Friday countdown timer — only runs while the sale window is active
  // (isBlackFridaySaleActive gates the UI; no reason to tick every second
  // year-round for an expired campaign).
  useEffect(() => {
    if (!blackFridayActive) return

    const saleEndDate = new Date('2025-11-28T19:59:59Z').getTime() // Nov 28th, 2025 at 23:59:59 UAE time
    const saleStartDate = new Date('2025-11-25T20:00:00Z').getTime()
    const totalDuration = saleEndDate - saleStartDate

    const calculateTime = () => {
      const now = new Date().getTime()
      const difference = saleEndDate - now

      if (difference <= 0) {
        setIsSaleActive(false)
        setTimeLeft(null)
        setSaleProgress(100)
        return
      }

      setIsSaleActive(true)
      const elapsed = totalDuration - difference
      setSaleProgress(Math.min(100, (elapsed / totalDuration) * 100))
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      })
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)

    return () => clearInterval(timer)
  }, [blackFridayActive])

  // Show loading state while cart is hydrating from localStorage
  if (!_hasHydrated) {
    return (
      <div className={isAppLikeMode ? 'min-h-[100dvh] bg-white pb-8' : ''}>
        {/* PWA / Mobile Web Simple Navigation Header */}
        {isAppLikeMode && (
          <div className={`sticky top-0 z-10 bg-white/95 backdrop-blur flex items-center justify-between px-5 py-4 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="min-w-[80px]" />
            <h1 className="text-base font-semibold text-gray-900 text-center flex-1 truncate px-2">
              {t('pwaProfile.bag') || 'Bag'}
            </h1>
            <div className="min-w-[80px]" />
          </div>
        )}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center py-8">
            <div className="animate-pulse">
              <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2" />
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    const emptyBackLabel = fromProfile ? (t('pwaProfile.account') || 'Account') : (t('pwaProfile.home') || 'Home')
    return (
      <div className={isAppLikeMode ? 'min-h-[100dvh] bg-white pb-8' : ''}>
        {/* PWA / Mobile Web Simple Navigation Header */}
        {isAppLikeMode && (
          <div className={`sticky top-0 z-10 bg-white/95 backdrop-blur flex items-center justify-between px-5 py-4 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
              className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
              aria-label={emptyBackLabel}
            >
              <ArrowLeft className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} />
              <span className="text-base text-red-600">{emptyBackLabel}</span>
            </button>
            <h1 className="text-base font-semibold text-gray-900 text-center flex-1 truncate px-2">
              {t('pwaProfile.bag') || 'Bag'}
            </h1>
            {/* Profile Icon - green dot only when logged in */}
            <button
              onClick={() => router.push(getLocalizedPath('/profile', locale))}
              className="min-w-[80px] flex justify-end"
              aria-label="Profile"
            >
              <div className="relative">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${user ? 'bg-red-600' : 'bg-gray-400'}`}>
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                  </span>
                </div>
                {/* Green online dot - only when logged in */}
                {user && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
                )}
              </div>
            </button>
          </div>
        )}
        
        <div className="container mx-auto px-4 py-4 md:py-8 lg:py-16" dir={dir}>
          {/* Navigation Breadcrumb - Hide in PWA mode and mobile web */}
          {!isAppLikeMode && (
            <nav className={`text-xs md:text-base text-gray-600 mb-2 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
              <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
              <span> / </span>
              <Link href={getLocalizedPath('/products', locale)} className="hover:text-primary-600 transition-colors">{t('common.products')}</Link>
              <span> / </span>
              <span className="text-gray-900 font-medium">{t('common.cart')}</span>
            </nav>
          )}

          {/* Back to Products - Hide in PWA mode and mobile web */}
          {!isAppLikeMode && (
            <Link 
              href={getLocalizedPath('/products', locale)} 
              className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              <span>{t('cart.backToProducts') || 'Back to Products'}</span>
            </Link>
          )}

        <div className={`max-w-4xl mx-auto text-center py-8 md:py-16 ${dir === 'rtl' ? 'text-right' : ''}`}>
          <div className="flex flex-col items-center">
            <div className="mb-6 md:mb-4 relative">
              <motion.div
                animate={animationsEnabled && !isAppLikeMode ? {
                  y: [0, -8, 0],
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, -1, 0]
                } : {}}
                transition={animationsEnabled && !isAppLikeMode ? {
                  duration: 4,
                  repeat: Infinity,
                  ease: [0.25, 0.1, 0.25, 1.5], // Spring-like cubic bezier
                  times: [0, 0.5, 1]
                } : {}}
              >
                <Image
                  src="/images/avatar/uni.png"
                  alt="Empty cart"
                  width={200}
                  height={200}
                  className="w-auto h-auto max-w-[200px] md:max-w-[250px]"
                  priority
                />
              </motion.div>
              
              {/* Floating particles around Uni */}
              {animationsEnabled && (
                <>
                  <motion.div
                    className="absolute top-4 right-4 w-2 h-2 bg-primary-400 rounded-full opacity-60"
                    animate={{
                      y: [0, -20, 0],
                      x: [0, 10, 0],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: 0.5,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute top-8 left-6 w-1.5 h-1.5 bg-primary-300 rounded-full opacity-50"
                    animate={{
                      y: [0, -15, 0],
                      x: [0, -8, 0],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: 1,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute bottom-6 right-8 w-1 h-1 bg-primary-500 rounded-full opacity-70"
                    animate={{
                      y: [0, -12, 0],
                      x: [0, 6, 0],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      delay: 1.5,
                      ease: "easeInOut"
                    }}
                  />
                </>
              )}
            </div>
            <h1 className={`text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('cart.empty')}</h1>
            <p className={`hidden md:block text-gray-600 text-lg mb-8 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t('cart.emptyMessage')}
            </p>
            <Link
              href={getLocalizedPath('/products', locale)}
              className={`inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 md:px-8 md:py-3 rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors touch-manipulation min-h-[44px] min-w-[44px] text-sm md:text-base ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-4 w-4 md:h-5 md:w-5 flex-shrink-0 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              <span>{t('cart.continueShopping')}</span>
            </Link>
          </div>
        </div>
      </div>
      </div>
    )
  }

  const backLabel = fromProfile ? (t('pwaProfile.account') || 'Account') : (t('pwaProfile.home') || 'Home')

  return (
    <div className={isAppLikeMode ? 'min-h-[100dvh] bg-white pb-32' : ''}>
      {/* PWA / Mobile Web Simple Navigation Header */}
      {isAppLikeMode && (
        <div className={`sticky top-0 z-10 bg-white/95 backdrop-blur flex items-center justify-between px-5 py-4 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
            aria-label={backLabel}
          >
            <ArrowLeft className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-base text-red-600">{backLabel}</span>
          </button>
          <h1 className="text-base font-semibold text-gray-900 text-center flex-1 truncate px-2">
            {t('pwaProfile.bag') || 'Bag'}
          </h1>
          {/* Profile Icon - green dot only when logged in */}
          <button
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[80px] flex justify-end"
            aria-label="Profile"
          >
            <div className="relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${user ? 'bg-red-600' : 'bg-gray-400'}`}>
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                </span>
              </div>
              {/* Green online dot - only when logged in */}
              {user && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
              )}
            </div>
          </button>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-2 md:py-8 lg:py-16" dir={dir}>
      {/* Mobile-only Uni Image/Video - Only show when cart is empty */}
      {items.length === 0 && (
        <div className="md:hidden w-full max-w-xs mx-auto aspect-square bg-gray-100 rounded-lg overflow-hidden relative mb-4">
          {/* Video behind the image */}
          {showUniVideo && (
            <video
              ref={uniVideoRef}
              src="/videos/uni_alive.mp4"
              className="absolute inset-0 w-full h-full object-cover"
              loop
              muted
              playsInline
              autoPlay
            />
          )}
          {/* Image on top */}
          <div className="relative w-full h-full overflow-hidden">
            <motion.div
              className="w-full h-full"
              animate={animationsEnabled ? {
                scale: [1, 1.05, 1],
                rotate: [0, 0.5, -0.5, 0]
              } : {}}
              transition={animationsEnabled ? {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
            >
              <Image
                src="/images/avatar/uni.png"
                alt="Uni"
                width={640}
                height={640}
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>
            
            {/* Animated glow effect around Uni */}
            {animationsEnabled && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-100/20 via-transparent to-primary-100/20"
                animate={{
                  x: [-100, 100],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />
            )}
          </div>
        </div>
      )}
      
      {/* Navigation Breadcrumb - Hide in PWA mode and mobile web */}
      {!isAppLikeMode && (
        <nav className={`text-xs md:text-base text-gray-600 mb-2 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
          <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
          <span> / </span>
          <Link href={getLocalizedPath('/products', locale)} className="hover:text-primary-600 transition-colors">{t('common.products')}</Link>
          <span> / </span>
          <span className="text-gray-900 font-medium">{t('common.cart')}</span>
        </nav>
      )}
      
      {/* Back to Products - Hide in PWA mode and mobile web */}
      {!isAppLikeMode && (
        <Link 
          href={getLocalizedPath('/products', locale)} 
          className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          <span>{t('cart.backToProducts') || 'Back to Products'}</span>
        </Link>
      )}

      <div className="max-w-6xl mx-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className={`flex flex-col lg:flex-row gap-8 ${dir === 'rtl' ? 'lg:flex-row-reverse' : ''}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible md:overflow-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {isAppLikeMode ? (
                // Compact inline counter on mobile/PWA — page title is already in the sticky header
                <div className={`px-3 py-2.5 border-b border-gray-100 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <ShoppingBag className="h-4 w-4 text-green-600" aria-hidden="true" />
                  <span className="text-sm font-medium text-gray-700">
                    {totalItemCount} {totalItemCount === 1 ? t('cart.item') : t('cart.items')}
                  </span>
                </div>
              ) : (
                <div className="p-3 md:p-6 border-b border-gray-200">
                  <motion.h1
                    initial={animationsEnabled ? { opacity: 0, y: -10 } : {}}
                    animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
                    transition={animationsEnabled ? springPresets.default : {}}
                    className={`text-lg md:text-2xl font-bold text-gray-900 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}
                  >
                    <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                    <span className="text-sm md:text-base lg:text-lg">{t('cart.shoppingCart')}</span>{' '}
                    <span className="text-sm md:text-base lg:text-lg">{totalItemCount} {totalItemCount === 1 ? t('cart.item') : t('cart.items')}</span>
                  </motion.h1>
                </div>
              )}
              
              <motion.div 
                className="space-y-4 p-3 md:p-0" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                initial={animationsEnabled ? { opacity: 0 } : {}}
                animate={animationsEnabled ? { opacity: 1 } : {}}
                transition={animationsEnabled ? { delay: 0.1, ...springPresets.default } : {}}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {displayItems.map((item, index) => (
                    <motion.div
                      key={`${item.product.id}-${item.selectedColor || 'default'}-${item.selectedSize || 'default'}-${item.fromBundle ? 'bundle' : 'solo'}`}
                      initial={animationsEnabled ? { opacity: 0, y: 20 } : {}}
                      animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
                      transition={animationsEnabled ? { 
                        delay: index * 0.05,
                        ...springPresets.default 
                      } : {}}
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Bundle Discount Block - Shows when beauty boxes in cart */}
              {user && hasBeautyBoxes && !blackFridayActive && (
                <div className="px-3 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4">
                  <div className={`p-3 md:p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-400 rounded-lg shadow-sm ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className="mb-2 md:mb-3 text-center">
                      <p className="text-sm md:text-lg font-bold text-purple-700">
                        {t('products.beautyBoxDiscount')}
                      </p>
                    </div>
                    
                    <div className={`flex items-center justify-center gap-2 md:gap-3 my-3 md:my-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className="flex flex-col items-center bg-white rounded-lg px-2 md:px-4 py-2 md:py-3 border border-purple-300 shadow-sm">
                        <div className="text-lg md:text-2xl font-bold text-purple-600">15%</div>
                        <div className="text-[10px] md:text-xs text-purple-500 font-medium">
                          {locale === 'ar' ? 'خصم' : locale === 'ru' ? 'СКИДКА' : 'OFF'}
                        </div>
                      </div>
                      <div className="text-purple-400 text-lg md:text-2xl">=</div>
                      <div className="flex flex-col items-center bg-green-50 rounded-lg px-2 md:px-4 py-2 md:py-3 border border-green-300 shadow-sm">
                        <div className="text-lg md:text-2xl font-bold text-green-600 whitespace-nowrap">
                          {beautyBoxSavings.toFixed(2)} {locale === 'ar' ? 'درهم' : locale === 'ru' ? 'AED' : 'AED'}
                        </div>
                        <div className="text-[10px] md:text-xs text-green-500 font-medium whitespace-nowrap">
                          {locale === 'ar' ? 'وفرت' : locale === 'ru' ? 'СЭКОНОМЛЕНО' : 'SAVED'}
                        </div>
                      </div>
                    </div>

                    <div className={`mt-2 md:mt-3 pt-2 md:pt-3 border-t border-purple-200 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      <p className={`text-xs md:text-sm font-semibold text-green-700 text-center`}>
                        ✅ {t('products.beautyBoxSavings', { amount: beautyBoxSavings.toFixed(2) })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Black Friday Discount Block - Only shows when Black Friday is active */}
              {user && blackFridayActive && (
                <div className="px-6 pt-6 pb-4">
                  <div className={`p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-500 rounded-lg shadow-sm ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`mb-3 text-center md:text-left ${dir === 'rtl' ? 'md:text-right' : ''}`}>
                      <h3 className="text-lg md:text-xl font-bold text-red-700">
                        {locale === 'ar' ? 'عرض الجمعة السوداء' : 'Black Friday Sale'}
                      </h3>
                      <p className="text-sm font-semibold text-red-600">
                        {locale === 'ar' ? 'خصم 20% على جميع المنتجات' : '20% OFF on All Products'}
                      </p>
                    </div>
                    
                    {/* Countdown Timer */}
                    {timeLeft && (
                      <div className={`mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        <div className={`flex items-center gap-2 mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <span className="text-xs font-medium text-red-600">
                            {isSaleActive 
                              ? (locale === 'ar' ? 'الوقت المتبقي:' : 'Time remaining:')
                              : (locale === 'ar' ? 'يبدأ بعد:' : 'Starts in:')}
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          {/* Days */}
                          <div className="flex flex-col items-center bg-white rounded-md px-2 py-1.5 border border-red-300 min-w-[50px]">
                            <div className="text-lg font-bold tabular-nums text-red-600">
                              {timeLeft.days.toString().padStart(2, '0')}
                            </div>
                            <div className="text-[10px] text-red-500">
                              {locale === 'ar' ? 'ي' : 'D'}
                            </div>
                          </div>
                          <span className="text-lg font-bold text-red-500">:</span>
                          {/* Hours */}
                          <div className="flex flex-col items-center bg-white rounded-md px-2 py-1.5 border border-red-300 min-w-[50px]">
                            <div className="text-lg font-bold tabular-nums text-red-600">
                              {timeLeft.hours.toString().padStart(2, '0')}
                            </div>
                            <div className="text-[10px] text-red-500">
                              {locale === 'ar' ? 'س' : 'H'}
                            </div>
                          </div>
                          <span className="text-lg font-bold text-red-500">:</span>
                          {/* Minutes */}
                          <div className="flex flex-col items-center bg-white rounded-md px-2 py-1.5 border border-red-300 min-w-[50px]">
                            <div className="text-lg font-bold tabular-nums text-red-600">
                              {timeLeft.minutes.toString().padStart(2, '0')}
                            </div>
                            <div className="text-[10px] text-red-500">
                              {locale === 'ar' ? 'د' : 'M'}
                            </div>
                          </div>
                          <span className="text-lg font-bold text-red-500">:</span>
                          {/* Seconds */}
                          <div className="flex flex-col items-center bg-white rounded-md px-2 py-1.5 border border-red-300 min-w-[50px]">
                            <div className="text-lg font-bold tabular-nums text-red-600">
                              {timeLeft.seconds.toString().padStart(2, '0')}
                            </div>
                            <div className="text-[10px] text-red-500">
                              {locale === 'ar' ? 'ث' : 'S'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Progress Bar */}
                    {timeLeft && (
                      <div className="mb-3">
                        <div className={`flex items-center justify-between mb-1.5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <span className="text-xs font-medium text-red-600">
                            {isSaleActive 
                              ? (locale === 'ar' ? 'تقدم العرض' : 'Sale Progress')
                              : (locale === 'ar' ? 'قريباً' : 'Starting Soon')}
                          </span>
                          {isSaleActive && (
                            <span className="text-xs font-semibold text-red-600">
                              {Math.round(saleProgress)}%
                            </span>
                          )}
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden bg-red-100">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-red-500 to-orange-500"
                            style={{ width: `${isSaleActive ? saleProgress : 0}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className={`text-xs text-gray-700 mt-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      <span className="font-medium">
                        {locale === 'ar' ? 'الفترة: 26-28 نوفمبر' : 'Period: 26-28/11'}
                      </span>
                    </div>
                    {originalSubtotal > subtotal && (
                      <div className={`mt-3 pt-3 border-t border-red-200 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        <p className={`text-sm font-semibold text-green-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                          {locale === 'ar' 
                            ? `✅ وفرت ${(originalSubtotal - subtotal).toFixed(2)} درهم`
                            : `✅ You saved AED ${(originalSubtotal - subtotal).toFixed(2)}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Free Mask Promotion */}
              {user && (
                <div className={`px-6 ${blackFridayActive ? 'pb-6' : 'pt-6 pb-6'}`}>
                  <FreeMaskPromotion subtotal={subtotal} />
                  
                  {/* Free Delivery Notice */}
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className={`p-4 border border-gray-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-2 mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <Truck className={`h-5 w-5 ${subtotal >= freeShippingThreshold ? 'text-green-600' : 'text-primary-600'}`} />
                        <span className="text-sm font-medium text-gray-900">
                          {t('cart.freeDelivery')}
                        </span>
                        {subtotal >= freeShippingThreshold ? (
                          <span className="text-xs font-semibold text-green-600">
                            {t('cart.unlocked')}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">
                            {subtotal < freeShippingThreshold ? `AED ${(freeShippingThreshold - subtotal).toFixed(2)} ${t('cart.more')}` : ''}
                          </span>
                        )}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            subtotal >= freeShippingThreshold ? 'bg-green-600' : 'bg-gray-400'
                          }`}
                          style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                        />
                      </div>
                      
                      <p className={`text-xs text-gray-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {subtotal >= freeShippingThreshold ? (
                          <span className="font-medium text-green-600">
                            {t('cart.qualifyForFreeDelivery')}
                          </span>
                        ) : (
                          <span>{t('cart.spendForFreeDelivery')}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:sticky lg:top-4 overflow-visible md:overflow-hidden">
              <div className={`p-4 md:p-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <h2 className={`text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('cart.orderSummary')}</h2>
                
                {/* User Status */}
                {!user && (
                  <div className={`mb-4 md:mb-6 p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 text-yellow-800 mb-1.5 md:mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Lock className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="font-semibold text-sm md:text-base">{t('cart.loginRequired')}</span>
                    </div>
                    <p className={`text-xs md:text-sm text-yellow-700 mb-2 md:mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('cart.loginRequiredMessage')}
                    </p>
                    <Link
                      href={getLocalizedPath('/login', locale)}
                      className={`inline-flex items-center gap-1.5 md:gap-2 bg-primary-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                    >
                      <Lock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      {t('common.login')}
                    </Link>
                  </div>
                )}

                {/* Shipping Location */}
                <div className="mb-4 md:mb-6">
                  <label className={`block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {t('cart.deliveryLocation')}
                  </label>
                  <select
                    value={selectedEmirate}
                    onChange={(e) => setSelectedEmirate(e.target.value)}
                    className={`w-full p-2.5 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 text-sm md:text-base ${dir === 'rtl' ? 'text-right' : ''}`}
                    style={{ color: '#111827' }}
                    dir={dir}
                  >
                    {emirates.map((emirate) => (
                      <option key={emirate.name} value={emirate.name} style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                        {getEmirateDisplayName(emirate.name)} - AED {emirate.shippingCost}
                      </option>
                    ))}
                  </select>
                  <p className={`text-[10px] md:text-xs text-gray-500 mt-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {t('cart.shippingCostsVary')}
                  </p>
                </div>

                {/* Black Friday Notice */}
                {blackFridayActive && (
                  <div className={`mb-3 md:mb-4 p-3 md:p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className="text-center">
                      <div className="text-sm md:text-base font-bold text-red-600 mb-1">
                        {locale === 'ar' ? 'الجمعة السوداء' : 'Black Friday'} 
                        <span className="ml-1 bg-red-600 text-white px-2 py-0.5 rounded text-xs md:text-sm">-20%</span>
                      </div>
                      {originalSubtotal > subtotal && (
                        <div className="text-xs md:text-sm text-green-700 font-medium">
                          {locale === 'ar' 
                            ? `✓ وفرت ${(originalSubtotal - subtotal).toFixed(2)} درهم`
                            : `✓ You saved AED ${(originalSubtotal - subtotal).toFixed(2)}`}
                        </div>
                      )}
                    </div>
                  </div>
                )}


                {/* Price Breakdown */}
                <div className={`space-y-2 md:space-y-3 mb-4 md:mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <div className={`flex justify-between text-xs md:text-base text-gray-600 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>{t('cart.subtotal')} ({getTotalItems()})</span>
                    {blackFridayActive && originalSubtotal > subtotal ? (
                      <div className={`flex items-center gap-1 md:gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-gray-900 font-semibold">{user ? `${subtotal.toFixed(2)}` : t('cart.loginToSeePrice')}</span>
                        <span className="text-[10px] md:text-sm text-gray-500 line-through">{user ? `${originalSubtotal.toFixed(2)}` : ''}</span>
                      </div>
                    ) : (
                      <span>{user ? `AED ${subtotal.toFixed(2)}` : t('cart.loginToSeePrice')}</span>
                    )}
                  </div>
                  
                  <div className={`flex justify-between text-xs md:text-base text-gray-600 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>{t('cart.shippingTo')} {selectedEmirate ? getEmirateDisplayName(selectedEmirate) : ''}</span>
                    <span>{user ? (shippingCost === 0 ? <span className="text-green-600 font-semibold">{t('cart.freeDelivery')}</span> : `AED ${shippingCost}`) : t('cart.loginToSeePrice')}</span>
                  </div>
                  
                  <div className={`flex justify-between text-xs md:text-base text-gray-600 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>{t('cart.vat')}</span>
                    <span>{user ? `AED ${calculateVatIncluded(subtotal + shippingCost).toFixed(2)}` : t('cart.loginToSeePrice')}</span>
                  </div>
                  
                  <div className={`text-[10px] md:text-xs text-red-600 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {t('cart.allPricesIncludeVat')}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2 md:pt-3">
                    <div className={`flex justify-between text-base md:text-lg font-bold text-gray-900 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span>{t('cart.total')}</span>
                      <span>{user ? `AED ${total.toFixed(2)}` : t('cart.loginToSeePrice')}</span>
                    </div>
                  </div>
                </div>

                {/* Free Masks Notice */}
                {user && subtotal >= 700 && (
                  <div className={`mb-4 md:mb-6 p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Gift className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
                      <span className="text-xs md:text-sm font-semibold text-green-800">
                        {t('cart.twoFreeMasksAdded')}
                      </span>
                    </div>
                    <p className={`text-[10px] md:text-xs text-green-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('cart.seaAlgaeCollagenMasks')}
                    </p>
                  </div>
                )}
                {user && subtotal >= 500 && subtotal < 700 && (
                  <div className={`mb-4 md:mb-6 p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Gift className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
                      <span className="text-xs md:text-sm font-semibold text-green-800">
                        {t('cart.oneFreeMaskAdded')}
                      </span>
                    </div>
                    <p className={`text-[10px] md:text-xs text-green-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('cart.collagenMaskAdded')}
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                {user ? (
                  <Link
                    href={getLocalizedPath('/checkout', locale)}
                    className="w-full bg-primary-600 text-white py-2.5 md:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block text-sm md:text-base touch-manipulation min-h-[40px] md:min-h-[44px]"
                  >
                    {t('cart.checkout')}
                  </Link>
                ) : (
                  <div className="space-y-2 md:space-y-3">
                    <Link
                      href={getLocalizedPath('/login', locale)}
                      className="w-full bg-primary-600 text-white py-2.5 md:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block text-sm md:text-base touch-manipulation min-h-[40px] md:min-h-[44px]"
                    >
                      {t('cart.loginToCheckout')}
                    </Link>
                    
                    <a
                      href={`https://wa.me/971585487665?text=${locale === 'ar' ? 'مرحباً، أنا مهتم بمنتجات مستحضرات التجميل الكورية الاحترافية. هل يمكنكم مساعدتي في الأسعار والطلب؟' : 'Hi, I\'m interested in your professional Korean dermacosmetics products. Can you help me with pricing and ordering?'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full bg-green-600 text-white py-2.5 md:py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center block text-sm md:text-base touch-manipulation flex items-center justify-center gap-1.5 md:gap-2 min-h-[40px] md:min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                    >
                      <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      {t('cart.contactSupport')}
                    </a>
                  </div>
                )}

                {/* Continue Shopping */}
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                  <Link
                    href={getLocalizedPath('/products', locale)}
                    className={`flex items-center gap-1.5 md:gap-2 text-primary-600 hover:text-primary-700 transition-colors text-xs md:text-sm font-medium ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                  >
                    <ArrowLeft className={`h-3.5 w-3.5 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    {t('cart.continueShopping')}
                  </Link>
                </div>

                {/* Contact Info */}
                {!user && (
                  <div className={`mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className="text-center">
                      <p className={`text-xs md:text-sm text-gray-600 mb-2 md:mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {t('cart.needHelp')}
                      </p>
                      <div className="space-y-2">
                        <a
                          href={`https://wa.me/971585487665?text=${locale === 'ar' ? 'مرحباً، أنا مهتم بمنتجات مستحضرات التجميل الكورية الاحترافية. هل يمكنكم مساعدتي في الأسعار والطلب؟' : 'Hi, I\'m interested in your professional Korean dermacosmetics products. Can you help me with pricing and ordering?'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full bg-green-600 text-white py-2.5 md:py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center block text-sm md:text-base touch-manipulation flex items-center justify-center gap-1.5 md:gap-2 min-h-[40px] md:min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                        >
                          <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                          {t('cart.contactSupport')}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
