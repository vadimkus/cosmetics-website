'use client'

/**
 * /cart.
 *
 * Reworked onto the editorial system in Aug 2026. This is a styling pass and
 * nothing else: the undo-remove timer, the free-mask and free-shipping
 * thresholds, the emirate shipping rates, the loyalty earn preview, the beauty
 * box and Black Friday blocks, the PWA/mobile-web branch and every total are
 * untouched. On a page that takes money, a redesign that also moves the
 * arithmetic is two changes to debug instead of one.
 *
 * Colour that carries meaning is kept off the palette, the same call /orders
 * made for its status badges: green for savings and unlocked free shipping,
 * amber for the login warning, red for destructive actions, and WhatsApp's own
 * green on its button.
 */

import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import CartItem from '@/components/cart/CartItem'
import CheckoutProgress from '@/components/checkout/CheckoutProgress'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnimationStore } from '@/lib/animationStore'
import { springPresets } from '@/lib/appleAnimations'
import FreeMaskPromotion from '@/components/FreeMaskPromotion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Lock, MessageCircle, Truck, Gift, ShoppingBag, Award, Trash2, Check } from 'lucide-react'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { isBlackFridaySaleActive } from '@/lib/blackFridayUtils'
import { getCartLinePricing, getCartRetailTotal, getCartTotalPrice } from '@/lib/cartPricing'
import { calculateVatIncluded, calculateMobileShipping, MOBILE_CHECKOUT_CONFIG } from '@/lib/mobileCheckoutConfig'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useIsMobileWeb } from '@/hooks/useIsMobile'
import { useRouter, useSearchParams } from 'next/navigation'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'


export default function CartClient() {
  const {
    items,
    addItem,
    removeItem,
    clearCart,
    selectedEmirate,
    setSelectedEmirate,
    _hasHydrated,
  } = useCart()
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
  const [recentlyRemoved, setRecentlyRemoved] = useState<typeof items[number] | null>(null)
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Combined flag for PWA or mobile web
  const isAppLikeMode = isPWA || isMobileWeb

  useEffect(() => () => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
  }, [])

  const handleRemoveItem = useCallback((item: typeof items[number]) => {
    removeItem(item.product.id, item.selectedColor, item.selectedSize, {
      fromBundle: item.fromBundle === true,
      bundleDiscountPercent: item.bundleDiscountPercent || 0,
      ...(item.homecare ? { homecare: item.homecare } : {}),
    })
    setRecentlyRemoved(item)
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    undoTimerRef.current = setTimeout(() => setRecentlyRemoved(null), 5000)
  }, [removeItem])

  const undoRemoveItem = useCallback(() => {
    if (!recentlyRemoved) return
    addItem(
      recentlyRemoved.product,
      recentlyRemoved.quantity,
      recentlyRemoved.selectedColor,
      recentlyRemoved.selectedSize,
      {
        fromBundle: recentlyRemoved.fromBundle === true,
        bundleDiscountPercent: recentlyRemoved.bundleDiscountPercent || 0,
        ...(recentlyRemoved.homecare ? { homecare: recentlyRemoved.homecare } : {}),
      },
    )
    setRecentlyRemoved(null)
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
  }, [addItem, recentlyRemoved])

  const handleClearCart = useCallback(() => {
    if (!window.confirm(t('cart.clearCartConfirm'))) return

    clearCart()
    setRecentlyRemoved(null)
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
  }, [clearCart, t])
  
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

  // Derive totals from the subscribed items array. Calling the stable Zustand
  // getter here can be cached by React Compiler and leave the summary stale.
  const subtotal = getCartTotalPrice(items, user)
  const shippingCost = calculateMobileShipping(subtotal, selectedEmirate || 'Dubai')
  const total = subtotal + shippingCost
  const freeShippingThreshold = MOBILE_CHECKOUT_CONFIG.freeShippingThreshold

  // GENOSYS Rewards earn preview (rewards track only; partners see nothing)
  const [loyaltyMultiplier, setLoyaltyMultiplier] = useState(0)
  useEffect(() => {
    if (!user) {
      setLoyaltyMultiplier(0)
      return
    }
    let cancelled = false
    fetch('/api/user/membership', { credentials: 'include' })
      .then(res => (res.ok ? res.json() : null))
      .then(json => {
        if (!cancelled) {
          setLoyaltyMultiplier(json?.success && json.track === 'REWARDS' ? Number(json.multiplier || 1) : 0)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [user])
  // Earn basis is products-only (shipping never earns points) — matches
  // awardPointsForDeliveredOrder in lib/loyalty.ts.
  const earnPreviewPoints = user && loyaltyMultiplier > 0 ? Math.floor(subtotal * loyaltyMultiplier) : 0
  
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
      <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-[100dvh] ${isAppLikeMode ? 'pb-8' : ''}`}>
        {/* PWA / Mobile Web Simple Navigation Header */}
        {isAppLikeMode && (
          <div className={`sticky top-0 z-10 flex items-center justify-between border-b border-[var(--cera-line)] bg-[var(--cera-cream)]/95 px-5 py-4 backdrop-blur ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="min-w-[80px]" />
            <h1 className="cera-serif flex-1 truncate px-2 text-center text-[17px]">
              {t('pwaProfile.bag') || 'Bag'}
            </h1>
            <div className="min-w-[80px]" />
          </div>
        )}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center py-8">
            <div className="animate-pulse">
              <div className="h-16 w-16 bg-[var(--cera-cream-deep)] rounded-full mx-auto mb-4" />
              <div className="h-6 bg-[var(--cera-cream-deep)] rounded w-32 mx-auto mb-2" />
              <div className="h-4 bg-[var(--cera-cream-deep)] rounded w-48 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    const emptyBackLabel = fromProfile ? (t('pwaProfile.account') || 'Account') : (t('pwaProfile.home') || 'Home')
    return (
      <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-[100dvh] ${isAppLikeMode ? 'pb-8' : ''}`}>
        {/* PWA / Mobile Web Simple Navigation Header */}
        {isAppLikeMode && (
          <div className={`sticky top-0 z-10 flex items-center justify-between border-b border-[var(--cera-line)] bg-[var(--cera-cream)]/95 px-5 py-4 backdrop-blur ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
              className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
              aria-label={emptyBackLabel}
            >
              <ArrowLeft className={`h-5 w-5 text-[var(--cera-rose)] ${isRTL ? 'rotate-180' : ''}`} />
              <span className="text-[15px] text-[var(--cera-rose)]">{emptyBackLabel}</span>
            </button>
            <h1 className="cera-serif flex-1 truncate px-2 text-center text-[17px]">
              {t('pwaProfile.bag') || 'Bag'}
            </h1>
            {/* Profile Icon - green dot only when logged in */}
            <button
              onClick={() => router.push(getLocalizedPath('/profile', locale))}
              className="min-w-[80px] flex justify-end"
              aria-label="Profile"
            >
              <div className="relative">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${user ? 'bg-[var(--cera-rose)]' : 'bg-[var(--cera-muted)]'}`}>
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
        
        {/* Breadcrumb sits above the content container so the empty-cart branch
            lands at the same offset as every other route. */}
        {!isAppLikeMode && (
          <PageBreadcrumb
            items={[
              { name: t('common.home'), href: getLocalizedPath('/', locale) },
              { name: t('common.products'), href: getLocalizedPath('/products', locale) },
              { name: t('common.cart') },
            ]}
          />
        )}

        <div className="container mx-auto px-4 pb-4 pt-3 md:pb-8 md:pt-4 lg:pb-16" dir={dir}>
          {/* Back to Products - Hide in PWA mode and mobile web */}
          {!isAppLikeMode && (
            <Link 
              href={getLocalizedPath('/products', locale)} 
              className={`mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--cera-rose-ink)] transition-opacity hover:opacity-70 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              <span>{t('cart.backToProducts') || 'Back to Products'}</span>
            </Link>
          )}

        <div className={`max-w-4xl mx-auto text-center py-8 md:py-16 ${dir === 'rtl' ? 'text-right' : ''}`}>
          <div className="flex flex-col items-center">
            <div className="relative mx-auto mb-6 w-full max-w-[300px] md:mb-4 md:max-w-[380px]">
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
                  src="/images/avatar/uni-transparent.png"
                  alt=""
                  aria-hidden="true"
                  width={1420}
                  height={1277}
                  className="mx-auto h-auto w-full"
                  priority
                />
              </motion.div>
              
              {/* Floating particles around Uni */}
              {animationsEnabled && (
                <>
                  <motion.div
                    className="absolute top-4 right-4 w-2 h-2 bg-[var(--cera-rose)] rounded-full opacity-60"
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
                    className="absolute top-8 left-6 w-1.5 h-1.5 bg-[var(--cera-blush-deep)] rounded-full opacity-50"
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
                    className="absolute bottom-6 right-8 w-1 h-1 bg-[var(--cera-rose)] rounded-full opacity-70"
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
            <h1 className={`cera-serif mb-3 text-[30px] leading-tight md:mb-4 md:text-[38px] ${dir === 'rtl' ? 'text-right' : ''}`}>{t('cart.empty')}</h1>
            <p className={`mb-8 hidden max-w-[46ch] text-[16px] leading-relaxed text-[var(--cera-muted)] md:block ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t('cart.emptyMessage')}
            </p>
            <Link
              href={getLocalizedPath('/products', locale)}
              className={`ed-cta min-h-[48px] px-7 py-3 text-[15px] touch-manipulation ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-4 w-4 md:h-5 md:w-5 flex-shrink-0 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              <span>{t('cart.continueShopping')}</span>
            </Link>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {recentlyRemoved && (
          <motion.div
            initial={animationsEnabled ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className={`fixed z-[70] flex max-w-[calc(100vw-2rem)] items-center gap-4 rounded-full bg-[var(--cera-ink)] px-5 py-3 text-white shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)] ${
              isAppLikeMode ? 'bottom-24' : 'bottom-6'
            } ${isRTL ? 'left-4 flex-row-reverse' : 'right-4'}`}
            role="status"
            aria-live="polite"
          >
            <span className="max-w-56 truncate text-sm">{t('cart.itemRemoved')}</span>
            <button
              type="button"
              onClick={undoRemoveItem}
              className="min-h-11 rounded-full px-3 text-[14px] font-semibold text-[var(--cera-blush-deep)] transition-colors hover:bg-white/10 hover:text-white"
            >
              {t('cart.undo')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    )
  }

  const backLabel = fromProfile ? (t('pwaProfile.account') || 'Account') : (t('pwaProfile.home') || 'Home')

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-[100dvh] ${isAppLikeMode ? 'pb-32' : ''}`}>
      {/* PWA / Mobile Web Simple Navigation Header */}
      {isAppLikeMode && (
        <div className={`sticky top-0 z-10 flex items-center justify-between border-b border-[var(--cera-line)] bg-[var(--cera-cream)]/95 px-5 py-4 backdrop-blur ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
            aria-label={backLabel}
          >
            <ArrowLeft className={`h-5 w-5 text-[var(--cera-rose)] ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-[15px] text-[var(--cera-rose)]">{backLabel}</span>
          </button>
          <h1 className="cera-serif flex-1 truncate px-2 text-center text-[17px]">
            {t('pwaProfile.bag') || 'Bag'}
          </h1>
          {/* Profile Icon - green dot only when logged in */}
          <button
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[80px] flex justify-end"
            aria-label="Profile"
          >
            <div className="relative">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${user ? 'bg-[var(--cera-rose)]' : 'bg-[var(--cera-muted)]'}`}>
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
      
      <div className="container mx-auto px-4 py-2 md:pb-8 md:pt-4 lg:pb-16 lg:pt-4" dir={dir}>
      <CheckoutProgress
        currentStep="cart"
        locale={locale}
        className="mb-4 md:mb-6"
      />

      {/* Mobile-only Uni Image/Video - Only show when cart is empty */}
      {items.length === 0 && (
        <div className="md:hidden w-full max-w-xs mx-auto aspect-square bg-[var(--cera-cream-deep)] rounded-lg overflow-hidden relative mb-4">
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
              aria-hidden="true"
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
      
      {/* Breadcrumb and back link share the content's measure, so they line up
          with the cards below rather than sitting further out. */}
      {!isAppLikeMode && <PageBreadcrumb
        items={[
          { name: t('common.home'), href: getLocalizedPath('/', locale) },
          { name: t('common.products'), href: getLocalizedPath('/products', locale) },
          { name: t('common.cart') },
        ]}
      />}

      {!isAppLikeMode && (
        <div className="mx-auto max-w-6xl px-4 pt-3 sm:px-6">
          <Link
            href={getLocalizedPath('/products', locale)}
            className={`mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--cera-rose-ink)] transition-opacity hover:opacity-70 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span>{t('cart.backToProducts') || 'Back to Products'}</span>
          </Link>
        </div>
      )}

      <div className="max-w-6xl mx-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className={`flex flex-col lg:flex-row gap-8 ${dir === 'rtl' ? 'lg:flex-row-reverse' : ''}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Cart Items.
              Products, promotions and delivery are three separate concerns, so
              they are three separate cards rather than one long panel with
              hairlines through it. */}
          <div className="flex flex-col gap-4 lg:w-2/3">
            <div className="cera-card overflow-visible md:overflow-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {isAppLikeMode ? (
                // Compact inline counter on mobile/PWA — page title is already in the sticky header
                <div className={`flex items-center gap-2 border-b border-[var(--cera-line)] px-3 py-2.5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <ShoppingBag className="h-4 w-4 text-[var(--cera-rose)]" aria-hidden="true" />
                  <span className="text-[14px] font-medium text-[var(--cera-body)]">
                    {totalItemCount} {totalItemCount === 1 ? t('cart.item') : t('cart.items')}
                  </span>
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className={`${dir === 'rtl' ? 'mr-auto' : 'ml-auto'} inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40`}
                    aria-label={t('cart.clearCart')}
                    title={t('cart.clearCart')}
                  >
                    <Trash2 className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div className={`flex items-center justify-between gap-4 border-b border-[var(--cera-line)] p-3 md:p-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <motion.h1
                    initial={animationsEnabled ? { opacity: 0, y: -10 } : {}}
                    animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
                    transition={animationsEnabled ? springPresets.default : {}}
                    className={`cera-serif flex items-center gap-2.5 text-[20px] md:text-[26px] ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}
                  >
                    <ShoppingBag className="h-5 w-5 text-[var(--cera-rose)] md:h-6 md:w-6" />
                    <span>{t('cart.shoppingCart')}</span>{' '}
                    <span className="text-[var(--cera-muted)]">{totalItemCount} {totalItemCount === 1 ? t('cart.item') : t('cart.items')}</span>
                  </motion.h1>
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                    aria-label={t('cart.clearCart')}
                    title={t('cart.clearCart')}
                  >
                    <Trash2 className="h-5 w-5" aria-hidden="true" />
                    <span className="hidden sm:inline">{t('cart.clearCart')}</span>
                  </button>
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
                      <CartItem
                        item={item}
                        loyaltyMultiplier={loyaltyMultiplier}
                        onRemove={handleRemoveItem}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Bundle Discount Block - Shows when beauty boxes in cart */}
            {user && hasBeautyBoxes && !blackFridayActive && (
              <div className="cera-card p-4 md:p-6">
                  <div className={`${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className="mb-3 text-center">
                      <p className="cera-serif text-[19px] text-[var(--cera-ink)]">
                        {t('products.beautyBoxDiscount')}
                      </p>
                    </div>
                    
                    <div className={`flex items-center justify-center gap-2 md:gap-3 my-3 md:my-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className="ed-row flex flex-col items-center px-4 py-3">
                        <div className="cera-numeral text-[22px] text-[var(--cera-rose-ink)]">15%</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--cera-muted)]">
                          {locale === 'ar' ? 'خصم' : locale === 'ru' ? 'СКИДКА' : 'OFF'}
                        </div>
                      </div>
                      <div className="text-[20px] text-[var(--cera-muted)]">=</div>
                      <div className="flex flex-col items-center rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
                        <div className="cera-numeral whitespace-nowrap text-[22px] text-green-700">
                          {beautyBoxSavings.toFixed(2)} {locale === 'ar' ? 'درهم' : locale === 'ru' ? 'AED' : 'AED'}
                        </div>
                        <div className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.08em] text-green-700">
                          {locale === 'ar' ? 'وفرت' : locale === 'ru' ? 'СЭКОНОМЛЕНО' : 'SAVED'}
                        </div>
                      </div>
                    </div>

                    <div className={`mt-3 border-t border-[var(--cera-line)] pt-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      <p className="text-center text-[13.5px] font-semibold text-green-700">
                        ✅ {t('products.beautyBoxSavings', { amount: beautyBoxSavings.toFixed(2) })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* Black Friday Discount Block - Only shows when Black Friday is active */}
            {user && blackFridayActive && (
              <div className="cera-card p-4 md:p-6">
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

                    <div className={`text-xs text-[var(--cera-body)] mt-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
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

            {/* Free Mask Promotion — its own block */}
            {user && (
              <div className="cera-card p-4 md:p-6">
                <FreeMaskPromotion subtotal={subtotal} />
              </div>
            )}

            {/* Free delivery meter — its own block */}
            {user && (
              <div className={`cera-card p-4 md:p-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <div className={`mb-2 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Truck className="h-5 w-5 text-[var(--cera-rose)]" aria-hidden="true" />
                    <h3 className="cera-serif text-[20px] leading-tight text-[var(--cera-ink)]">
                      {t('cart.freeDelivery')}
                    </h3>
                    {subtotal >= freeShippingThreshold ? (
                      <span className={`flex items-center gap-1 text-[12px] font-semibold text-green-700 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        {t('cart.unlocked')}
                      </span>
                    ) : (
                      <span dir="ltr" className="cera-numeral whitespace-nowrap text-[12px] text-[var(--cera-muted)]">
                        {subtotal < freeShippingThreshold ? `AED ${(freeShippingThreshold - subtotal).toFixed(2)} ${t('cart.more')}` : ''}
                      </span>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-[var(--cera-cream-deep)]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      subtotal >= freeShippingThreshold ? 'bg-green-600' : 'bg-[var(--cera-rose)]'
                    }`}
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>

                <p className={`text-[12px] text-[var(--cera-muted)] ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {subtotal >= freeShippingThreshold ? (
                    <span className="font-semibold text-[var(--cera-ink)]">
                      {t('cart.qualifyForFreeDelivery')}
                    </span>
                  ) : (
                    <span>{t('cart.spendForFreeDelivery')}</span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="cera-card overflow-visible md:overflow-hidden lg:sticky lg:top-4">
              <div className={`p-4 md:p-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <h2 className={`cera-serif mb-4 text-[22px] md:mb-6 md:text-[26px] ${dir === 'rtl' ? 'text-right' : ''}`}>{t('cart.orderSummary')}</h2>
                
                {/* User Status */}
                {!user && (
                  <div className={`mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 text-yellow-800 mb-1.5 md:mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Lock className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="font-semibold text-sm md:text-base">{t('cart.loginRequired')}</span>
                    </div>
                    <p className={`text-xs md:text-sm text-yellow-700 mb-2 md:mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('cart.loginRequiredMessage')}
                    </p>
                    <Link
                      href={getLocalizedPath('/login', locale)}
                      className={`ed-cta px-4 py-2 text-[13px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                    >
                      <Lock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      {t('common.login')}
                    </Link>
                  </div>
                )}

                {/* Shipping Location */}
                <div className="mb-4 md:mb-6">
                  <label htmlFor="cart-emirate" className={`ed-label ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {t('cart.deliveryLocation')}
                  </label>
                  <select
                    id="cart-emirate"
                    value={selectedEmirate}
                    onChange={(e) => setSelectedEmirate(e.target.value)}
                    className={`ed-field ${dir === 'rtl' ? 'text-right' : ''}`}
                    style={{ color: '#111827' }}
                    dir={dir}
                  >
                    {emirates.map((emirate) => (
                      <option key={emirate.name} value={emirate.name} style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                        {getEmirateDisplayName(emirate.name)} - AED {emirate.shippingCost}
                      </option>
                    ))}
                  </select>
                  <p className={`mt-1.5 text-[11.5px] text-[var(--cera-muted)] ${dir === 'rtl' ? 'text-right' : ''}`}>
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
                  <div className={`flex justify-between text-[14px] text-[var(--cera-body)] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>{t('cart.subtotal')} ({totalItemCount})</span>
                    {blackFridayActive && originalSubtotal > subtotal ? (
                      <div className={`flex items-center gap-1 md:gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <span className="font-semibold text-[var(--cera-ink)]">{user ? `${subtotal.toFixed(2)}` : t('cart.loginToSeePrice')}</span>
                        <span className="text-[12px] text-[var(--cera-muted)] line-through">{user ? `${originalSubtotal.toFixed(2)}` : ''}</span>
                      </div>
                    ) : (
                      <span>{user ? `AED ${subtotal.toFixed(2)}` : t('cart.loginToSeePrice')}</span>
                    )}
                  </div>
                  
                  <div className={`flex justify-between text-[14px] text-[var(--cera-body)] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>{t('cart.shippingTo')} {selectedEmirate ? getEmirateDisplayName(selectedEmirate) : ''}</span>
                    <span>{user ? (shippingCost === 0 ? <span className="text-green-600 font-semibold">{t('cart.freeDelivery')}</span> : `AED ${shippingCost}`) : t('cart.loginToSeePrice')}</span>
                  </div>
                  
                  <div className={`flex justify-between text-[14px] text-[var(--cera-body)] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>{t('cart.vat')}</span>
                    <span>{user ? `AED ${calculateVatIncluded(subtotal + shippingCost).toFixed(2)}` : t('cart.loginToSeePrice')}</span>
                  </div>
                  
                  <div className={`text-[11.5px] text-[var(--cera-muted)] ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {t('cart.allPricesIncludeVat')}
                  </div>
                  
                  <div className="border-t border-[var(--cera-line)] pt-3">
                    <div className={`flex items-baseline justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="cera-serif text-[19px] text-[var(--cera-ink)]">{t('cart.total')}</span>
                      {/* Only the figure gets display size. The signed-out
                          string is a sentence, and at 22px serif it crowds the
                          label it sits beside — worse in Arabic and Russian,
                          where it is longer still. */}
                      {user ? (
                        <span className="cera-serif cera-numeral text-[22px] text-[var(--cera-ink)]">
                          AED {total.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-[13.5px] text-[var(--cera-muted)]">{t('cart.loginToSeePrice')}</span>
                      )}
                    </div>
                  </div>

                  {/* GENOSYS Rewards — earn preview */}
                  {earnPreviewPoints > 0 && (
                    <div className={`mt-2 flex items-center gap-2 rounded-xl border border-[var(--cera-line)] bg-[var(--cera-cream)] px-3 py-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Award className="h-3.5 w-3.5 shrink-0 text-[var(--cera-rose)]" />
                      <span className={`text-[12px] text-[var(--cera-body)] ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {t('rewards.earnPreview', { points: earnPreviewPoints.toLocaleString() })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Free Masks Notice */}
                {user && subtotal >= 700 && (
                  <div className={`mb-4 md:mb-6 p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Gift className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
                      <span className="text-xs md:text-sm font-semibold text-green-700">
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
                      <span className="text-xs md:text-sm font-semibold text-green-700">
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
                    className="ed-cta w-full py-3.5 text-[15px] touch-manipulation md:py-4"
                  >
                    {t('cart.checkout')}
                  </Link>
                ) : (
                  <div className="space-y-2 md:space-y-3">
                    <Link
                      href={getLocalizedPath('/login', locale)}
                      className="ed-cta w-full py-3.5 text-[15px] touch-manipulation md:py-4"
                    >
                      {t('cart.loginToCheckout')}
                    </Link>
                    
                    <a
                      href={`https://wa.me/971585487665?text=${locale === 'ar' ? 'مرحباً، أنا مهتم بمنتجات مستحضرات التجميل الكورية الاحترافية. هل يمكنكم مساعدتي في الأسعار والطلب؟' : 'Hi, I\'m interested in your professional Korean dermacosmetics products. Can you help me with pricing and ordering?'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex w-full min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-[15px] font-semibold text-white transition-colors touch-manipulation hover:bg-[#1da851] md:py-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                    >
                      <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      {t('cart.contactSupport')}
                    </a>
                  </div>
                )}

                {/* Continue Shopping */}
                <div className="mt-5 border-t border-[var(--cera-line)] pt-5">
                  <Link
                    href={getLocalizedPath('/products', locale)}
                    className={`flex items-center gap-2 text-[13.5px] font-semibold text-[var(--cera-rose-ink)] transition-opacity hover:opacity-70 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                  >
                    <ArrowLeft className={`h-3.5 w-3.5 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    {t('cart.continueShopping')}
                  </Link>
                </div>

                {/* Contact Info */}
                {!user && (
                  <div className={`mt-5 border-t border-[var(--cera-line)] pt-5 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className="text-center">
                      <p className={`mb-3 text-[13.5px] text-[var(--cera-muted)] ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {t('cart.needHelp')}
                      </p>
                      <div className="space-y-2">
                        <a
                          href={`https://wa.me/971585487665?text=${locale === 'ar' ? 'مرحباً، أنا مهتم بمنتجات مستحضرات التجميل الكورية الاحترافية. هل يمكنكم مساعدتي في الأسعار والطلب؟' : 'Hi, I\'m interested in your professional Korean dermacosmetics products. Can you help me with pricing and ordering?'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex w-full min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-[15px] font-semibold text-white transition-colors touch-manipulation hover:bg-[#1da851] md:py-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
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
      <AnimatePresence>
        {recentlyRemoved && (
          <motion.div
            initial={animationsEnabled ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className={`fixed z-[70] flex max-w-[calc(100vw-2rem)] items-center gap-4 rounded-full bg-[var(--cera-ink)] px-5 py-3 text-white shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)] ${
              isAppLikeMode ? 'bottom-24' : 'bottom-6'
            } ${isRTL ? 'left-4 flex-row-reverse' : 'right-4'}`}
            role="status"
            aria-live="polite"
          >
            <span className="max-w-56 truncate text-sm">
              {t('cart.itemRemoved')}
            </span>
            <button
              type="button"
              onClick={undoRemoveItem}
              className="min-h-11 rounded-full px-3 text-[14px] font-semibold text-[var(--cera-blush-deep)] transition-colors hover:bg-white/10 hover:text-white"
            >
              {t('cart.undo')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  )
}
