'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Heart } from 'lucide-react'
import { useFavorites } from '@/components/FavoritesProvider'
import ProductCard from '@/components/ProductCard'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAnimationStore } from '@/lib/animationStore'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'

// Mobile device detection
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  const ua = navigator.userAgent || ''
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || window.innerWidth < 768
}

export default function FavoritesClient() {
  const { t, locale, dir } = useTranslation()
  const { favorites } = useFavorites()
  const { enabled: animationsEnabled } = useAnimationStore()
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

  // Disable animations in PWA mode
  const shouldAnimate = animationsEnabled && !(isClient && isPWA)

  useEffect(() => {
    // Don't pulse in PWA mode
    if (isClient && isPWA) return
    
    // Pulse every 5 seconds
    const pulseInterval = setInterval(() => {
      setIsPulsing(true)
      setTimeout(() => setIsPulsing(false), 500) // Pulse duration
    }, 5000)

    return () => {
      clearInterval(pulseInterval)
    }
  }, [isClient, isPWA])

  if (favorites.length === 0) {
    return (
      <div className={`${isAppLikeMode ? 'min-h-screen bg-white pb-32' : ''}`} dir={dir}>
        {/* PWA/Mobile Web Simple Navigation Header */}
        {isAppLikeMode && (
          <div className={`flex items-center justify-between px-5 py-4 bg-white ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button 
              onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
              className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <svg className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-base text-red-600">
                {fromProfile ? (locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account') : (locale === 'ar' ? 'المنتجات' : locale === 'ru' ? 'Продукты' : 'Products')}
              </span>
            </button>
            <span className="text-base font-semibold text-gray-900">
              {t('common.favorites') || 'Favorites'}
            </span>
            {/* Profile Icon with green dot */}
            <button 
              onClick={() => router.push(getLocalizedPath('/profile', locale))}
              className="min-w-[80px] flex justify-end"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                  </span>
                </div>
                {user && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
                )}
              </div>
            </button>
          </div>
        )}
        
        <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
          {/* Navigation Breadcrumb - Hide in PWA/Mobile Web */}
          {!isAppLikeMode && (
            <nav className={`text-xs md:text-base text-gray-600 mb-2 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
              <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
              <span> / </span>
              <span className="text-gray-900 font-medium">{t('common.favorites')}</span>
            </nav>
          )}
          
          {/* Back to Home - Hide in PWA/Mobile Web */}
          {!isAppLikeMode && (
            <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              <span>{t('common.backToHome')}</span>
            </Link>
          )}

          <div className="max-w-md mx-auto text-center py-6 md:py-16">
          <div className="bg-white rounded-xl p-4 md:p-8">
            {/* Mobile: Custom image, Desktop: Custom image */}
            <div className="mb-2 md:mb-4 relative">
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
                  src="/images/avatar/uni.png"
                  alt="No favorites"
                  width={210}
                  height={210}
                  className="mx-auto"
                />
              </motion.div>
              
              {/* Floating particles around Uni - same as cart */}
              {shouldAnimate && (
                <>
                  <motion.div
                    className="absolute top-4 right-4 w-2 h-2 bg-red-400 rounded-full opacity-60"
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
                    className="absolute top-8 left-6 w-1.5 h-1.5 bg-red-300 rounded-full opacity-50"
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
                    className="absolute bottom-6 right-8 w-1 h-1 bg-red-500 rounded-full opacity-70"
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
            <h1 className="text-base md:text-2xl font-bold text-gray-900 mb-3 md:mb-6">{t('favorites.empty') || 'No Favorites Yet'}</h1>
            <Link
              href={getLocalizedPath('/products', locale)}
              className={`inline-flex items-center gap-1 bg-primary-600 text-white px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              {t('favorites.browseProducts') || 'Browse Products'}
            </Link>
          </div>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${isAppLikeMode ? 'min-h-screen bg-white pb-32' : ''}`} dir={dir}>
      {/* PWA/Mobile Web Simple Navigation Header */}
      {isAppLikeMode && (
        <div className={`flex items-center justify-between px-5 py-4 bg-white ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button 
            onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base text-red-600">
              {fromProfile ? (locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account') : (locale === 'ar' ? 'المنتجات' : locale === 'ru' ? 'Продукты' : 'Products')}
            </span>
          </button>
          <span className="text-base font-semibold text-gray-900">
            {t('common.favorites') || 'Favorites'}
          </span>
          {/* Profile Icon with green dot */}
          <button 
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[80px] flex justify-end"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                </span>
              </div>
              {user && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
              )}
            </div>
          </button>
        </div>
      )}
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        {/* Navigation Breadcrumb - Hide in PWA/Mobile Web */}
        {!isAppLikeMode && (
          <nav className={`text-xs md:text-base text-gray-600 mb-2 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
            <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">{t('common.favorites')}</span>
          </nav>
        )}
        
        {/* Back to Home - Hide in PWA/Mobile Web */}
        {!isAppLikeMode && (
          <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span>{t('common.backToHome')}</span>
          </Link>
        )}

        <div className="max-w-6xl mx-auto">
          {/* PWA/Mobile Web Title Section */}
          {isAppLikeMode && (
            <div className="px-0 pt-2 pb-4">
              <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <Heart className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {t('favorites.myFavorites') || 'My Favorites'}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Title - Hide in PWA/Mobile Web */}
          {!isAppLikeMode && (
            <div className="mb-4 md:mb-8">
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4 flex items-center gap-2">
                <Heart className={`h-6 w-6 md:h-8 md:w-8 text-red-500 transition-all duration-500 ${isPulsing && shouldAnimate ? 'animate-pulse scale-110' : ''}`} />
                {t('favorites.myFavorites')} ({favorites.length})
              </h1>
              <p className="text-xs md:text-base text-gray-600">
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
          <div className="max-w-md mx-auto text-center py-6 md:py-16">
            <div className="bg-gray-50 rounded-xl p-4 md:p-8">
              {/* Mobile: Custom image, Desktop: Heart icon */}
              <div className="md:hidden mb-2 relative">
                <motion.div
                  animate={shouldAnimate ? {
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={shouldAnimate ? {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : {}}
                  className="mx-auto relative"
                >
                  <Image
                    src="/images/avatar/uni.png"
                    alt="No products"
                    width={60}
                    height={60}
                    className="mx-auto"
                  />
                  
                  {/* Small sparkle effect */}
                  {shouldAnimate && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
                      animate={{
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 1,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>
              </div>
              <Heart className="hidden md:block h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-base md:text-2xl font-bold text-gray-900 mb-1 md:mb-3">{t('favorites.noProductsFound')}</h2>
              <p className="text-[11px] md:text-sm text-gray-500 mb-3 md:mb-6 leading-relaxed">
                {t('favorites.productsMayNoLongerBeAvailable')}
              </p>
              <Link
                href={getLocalizedPath('/products', locale)}
                className={`inline-flex items-center gap-1 bg-primary-600 text-white px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                {t('favorites.browseProducts') || 'Browse Products'}
              </Link>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
