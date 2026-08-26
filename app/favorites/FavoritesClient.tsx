'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Heart, LogIn } from 'lucide-react'
import { useFavorites } from '@/components/FavoritesProvider'
import ProductCard from '@/components/ProductCard'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAnimationStore } from '@/lib/animationStore'
import useReducedMotion from '@/hooks/useReducedMotion'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import AccountAvatar from '@/components/AccountAvatar'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

// Mobile device detection
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  const ua = navigator.userAgent || ''
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || window.innerWidth < 768
}

interface FavoritesClientProps {
  embedded?: boolean
}

export default function FavoritesClient({ embedded = false }: FavoritesClientProps) {
  const { t, locale, dir } = useTranslation()
  const { favorites } = useFavorites()
  const { enabled: animationsEnabled } = useAnimationStore()
  const { prefersReducedMotion } = useReducedMotion()
  const { isPWA, isClient } = usePWAMode()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const favoriteProducts = favorites
  const [isPulsing, setIsPulsing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const isRTL = dir === 'rtl'
  const fromProfile = searchParams?.get('from') === 'profile'
  
  // Mobile web detection
  useEffect(() => {
    setIsMobile(isMobileDevice())
    const handleResize = () => setIsMobile(isMobileDevice())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // App-like mode: PWA or mobile web
  const isAppLikeMode = isPWA || (isClient && isMobile && !isPWA)

  // Disable animations in PWA mode, or when the user has opted out system-wide.
  const shouldAnimate = animationsEnabled && !prefersReducedMotion && !(isClient && isPWA)

  useEffect(() => {
    // Don't pulse in PWA mode, or when user prefers reduced motion
    if (isClient && isPWA) return
    if (prefersReducedMotion) return

    const pulseInterval = setInterval(() => {
      setIsPulsing(true)
      setTimeout(() => setIsPulsing(false), 500)
    }, 5000)

    return () => {
      clearInterval(pulseInterval)
    }
  }, [isClient, isPWA, prefersReducedMotion])

  if (favorites.length === 0) {
    // min-h on desktop too: the empty state is short, and without it the cream stops
    // mid-page and a band of body white shows between the content and the footer.
    return (
      <div className={`cera-page genosys-page ${ceraSerif.variable} ${isAppLikeMode ? 'min-h-[100dvh] pb-32' : 'min-h-[72vh]'}`} dir={dir}>
        {/* PWA/Mobile Web Simple Navigation Header */}
        {isAppLikeMode && (
          <div className={`flex items-center justify-between border-b border-[var(--cera-line)] bg-[var(--cera-cream)] px-5 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button 
              onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
              className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <svg className={`w-5 h-5 text-[var(--cera-rose-ink)] ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-base text-[var(--cera-rose-ink)]">
                {fromProfile ? (locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account') : (locale === 'ar' ? 'المنتجات' : locale === 'ru' ? 'Продукты' : 'Products')}
              </span>
            </button>
            <span className="text-base font-semibold text-[var(--cera-ink)]">
              {t('common.favorites') || 'Favorites'}
            </span>
            {/* Profile Icon with green dot */}
            <button 
              onClick={() => router.push(getLocalizedPath('/profile', locale))}
              className="min-w-[80px] flex justify-end"
            >
              <AccountAvatar name={user?.name} signedIn={!!user} />
            </button>
          </div>
        )}
        
        {/* This was duplicated: two identical PageBreadcrumb blocks behind identical
            conditions, so the page rendered "Home / Favorites" twice. */}
        {!isAppLikeMode && !embedded && (
          <PageBreadcrumb
            items={[
              { name: t('common.home'), href: getLocalizedPath('/', locale) },
              { name: t('common.favorites') },
            ]}
          />
        )}

      {/* No "Back to Home" link here. The breadcrumb above already carries Home, and two
          controls to the same destination stacked on top of each other is noise. */}
      <div className={embedded ? 'py-0' : 'container mx-auto px-4 pb-16 pt-2 md:pb-24 md:pt-6'}>
          <div className="mx-auto max-w-[560px] text-center">
            {/* Uni — gently floating, and now on a transparent ground so she sits on the
                page instead of on a white card. Animations respect the animation store,
                PWA mode AND prefers-reduced-motion. */}
            <div className="relative mx-auto w-full max-w-[300px] md:max-w-[380px]">
              <motion.div
                animate={shouldAnimate ? {
                  y: [0, -8, 0],
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, -1, 0]
                } : {}}
                transition={shouldAnimate ? {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                } : {}}
                className="mx-auto"
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

              {shouldAnimate && (
                <>
                  <motion.div
                    className="absolute top-4 right-4 w-2 h-2 bg-[var(--cera-rose)] rounded-full opacity-60"
                    animate={{ y: [0, -20, 0], x: [0, 10, 0], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute top-8 left-6 w-1.5 h-1.5 bg-[var(--cera-blush-deep)] rounded-full opacity-50"
                    animate={{ y: [0, -15, 0], x: [0, -8, 0], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 1, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute bottom-6 right-8 w-1 h-1 bg-[var(--cera-rose)] rounded-full opacity-70"
                    animate={{ y: [0, -12, 0], x: [0, 6, 0], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.8, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
                  />
                </>
              )}
            </div>

            <p className="cera-eyebrow mt-6 md:mt-8">{t('common.favorites') || 'Favorites'}</p>
            <h1 className="cera-serif mt-3 text-[30px] leading-[1.1] text-[var(--cera-ink)] sm:text-[38px] md:text-[46px]">
              {t('favorites.heroTitle') || 'Save What You Love'}
            </h1>
            <p className="mx-auto mt-4 max-w-[42ch] text-[15px] leading-relaxed text-[var(--cera-body)] md:text-base">
              {t('favorites.heroSubtitle') || 'Tap the heart on any product to keep it close.'}
            </p>

            <div className={`mt-8 flex flex-wrap items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link
                href={getLocalizedPath('/products', locale)}
                className={`ed-cta h-[52px] px-7 text-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <span>{t('favorites.browseProducts') || 'Browse Products'}</span>
                <ArrowRight className={`h-[18px] w-[18px] ${isRTL ? 'rotate-180' : ''}`} />
              </Link>

              {/* Favourites live in local storage for guests, so signing in is the only
                  way they survive a new device. Offered, not demanded. */}
              {!user && (
                <Link
                  href={`${getLocalizedPath('/login', locale)}?redirect=${encodeURIComponent(getLocalizedPath('/favorites', locale))}`}
                  className={`ed-ghost h-[52px] px-6 text-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <LogIn className="h-[17px] w-[17px]" />
                  <span>{t('favorites.signIn')}</span>
                </Link>
              )}
            </div>

            {!user && (
              <p className="mt-4 text-[13px] text-[var(--cera-muted)]">{t('favorites.signInToSync')}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} ${isAppLikeMode ? 'min-h-[100dvh] pb-32' : ''}`} dir={dir}>
      {/* PWA/Mobile Web Simple Navigation Header */}
      {isAppLikeMode && (
        <div className={`flex items-center justify-between border-b border-[var(--cera-line)] bg-[var(--cera-cream)] px-5 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button 
            onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className={`w-5 h-5 text-[var(--cera-rose-ink)] ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base text-[var(--cera-rose-ink)]">
              {fromProfile ? (locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account') : (locale === 'ar' ? 'المنتجات' : locale === 'ru' ? 'Продукты' : 'Products')}
            </span>
          </button>
          <span className="text-base font-semibold text-[var(--cera-ink)]">
            {t('common.favorites') || 'Favorites'}
          </span>
          {/* Profile Icon with green dot */}
          <button 
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[80px] flex justify-end"
          >
            <AccountAvatar name={user?.name} signedIn={!!user} />
          </button>
        </div>
      )}
      
      {/* No "Back to Home" link: the breadcrumb above already carries Home. */}
      <div className={embedded ? 'py-0' : 'container mx-auto px-3 py-4 md:px-4 md:py-16'}>
        <div className="max-w-6xl mx-auto">
          {/* PWA/Mobile Web Title Section */}
          {isAppLikeMode && (
            <div className="px-0 pt-2 pb-4">
              <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-[var(--cera-blush)] flex items-center justify-center">
                  <Heart className="h-5 w-5 text-[var(--cera-rose)]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[var(--cera-ink)]">
                    {t('favorites.myFavorites') || 'My Favorites'}
                  </h1>
                  <p className="text-xs text-[var(--cera-muted)]">
                    {favorites.length === 1
                      ? t('favorites.itemCountOne') || '1 item'
                      : (t('favorites.itemCountMany') || '{count} items').replace('{count}', String(favorites.length))}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Title - Hide in PWA/Mobile Web */}
          {!isAppLikeMode && !embedded && (
            <div className="mb-4 md:mb-8">
              <h1 className="text-xl md:text-3xl font-bold text-[var(--cera-ink)] mb-2 md:mb-4 flex items-center gap-2">
                <Heart className={`h-6 w-6 md:h-8 md:w-8 text-[var(--cera-rose)] transition-all duration-500 ${isPulsing && shouldAnimate ? 'animate-pulse scale-110' : ''}`} />
                {t('favorites.myFavorites')} ({favorites.length})
              </h1>
              <p className="text-xs md:text-base text-[var(--cera-body)]">
                {t('favorites.savedProductsDescription')}
              </p>
            </div>
          )}

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Reached when every saved product has since been delisted, so the count is
             non-zero but nothing resolves. Same editorial treatment as the empty state
             above, one size down. */
          <div className="mx-auto max-w-[520px] py-10 text-center md:py-16">
            <motion.div
              animate={shouldAnimate ? { y: [0, -6, 0], rotate: [0, 1, -1, 0] } : {}}
              transition={shouldAnimate ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : {}}
              className="mx-auto w-full max-w-[220px]"
            >
              <Image
                src="/images/avatar/uni-transparent.png"
                alt=""
                aria-hidden="true"
                width={1420}
                height={1277}
                className="mx-auto h-auto w-full"
              />
            </motion.div>

            <h2 className="cera-serif mt-5 text-[24px] leading-tight text-[var(--cera-ink)] md:text-[32px]">
              {t('favorites.noProductsFound')}
            </h2>
            <p className="mx-auto mt-3 max-w-[40ch] text-sm leading-relaxed text-[var(--cera-muted)] md:text-[15px]">
              {t('favorites.productsMayNoLongerBeAvailable')}
            </p>
            <Link
              href={getLocalizedPath('/products', locale)}
              className={`ed-cta mt-6 h-[48px] px-6 text-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span>{t('favorites.browseProducts') || 'Browse Products'}</span>
              <ArrowRight className={`h-[18px] w-[18px] ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
