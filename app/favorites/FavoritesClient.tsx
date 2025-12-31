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

export default function FavoritesClient() {
  const { t, locale, dir } = useTranslation()
  const { favorites } = useFavorites()
  const { enabled: animationsEnabled } = useAnimationStore()
  const { isPWA, isClient } = usePWAMode()
  const favoriteProducts = favorites
  const [isPulsing, setIsPulsing] = useState(false)

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
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16" dir={dir}>
        {/* Navigation Breadcrumb */}
        <nav className={`text-xs md:text-base text-gray-600 mb-2 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
          <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
          <span> / </span>
          <span className="text-gray-900 font-medium">{t('common.favorites')}</span>
        </nav>
        
        {/* Back to Home */}
        <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          <span>{t('common.backToHome')}</span>
        </Link>

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
    )
  }

  return (
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-16" dir={dir}>
      {/* Navigation Breadcrumb */}
      <nav className={`text-xs md:text-base text-gray-600 mb-2 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
        <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
        <span> / </span>
        <span className="text-gray-900 font-medium">{t('common.favorites')}</span>
      </nav>
      
      {/* Back to Home */}
      <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        <span>{t('common.backToHome')}</span>
      </Link>

      <div className="max-w-6xl mx-auto">
        <div className="mb-4 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4 flex items-center gap-2">
            <Heart className={`h-6 w-6 md:h-8 md:w-8 text-red-500 transition-all duration-500 ${isPulsing && shouldAnimate ? 'animate-pulse scale-110' : ''}`} />
            {t('favorites.myFavorites')} ({favorites.length})
          </h1>
          <p className="text-xs md:text-base text-gray-600">
            {t('favorites.savedProductsDescription')}
          </p>
        </div>

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
  )
}
