'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAnimationStore } from '@/lib/animationStore'
import { useAuth } from './auth/AuthProvider'
import LoginModal from './LoginModal'
import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { getLocalizedPath } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'
import { debugLog, warnLog } from '@/lib/logger'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useRouter } from 'next/navigation'

interface HeroProps {
  initialLocale?: Locale
  initialDir?: 'ltr' | 'rtl'
}

export default function Hero({ initialLocale = 'en', initialDir = 'ltr' }: HeroProps = {}) {
  const { user } = useAuth()
  const { enabled: animationsEnabled } = useAnimationStore()
  const { isPWA } = usePWAMode()
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [videoError, setVideoError] = useState(false)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const desktopVideoRef = useRef<HTMLVideoElement>(null)

  // Handle login click - redirect to PWA login page if in PWA mode
  const handleLoginClick = useCallback(() => {
    if (isPWA) {
      const loginPath = initialLocale === 'en' ? '/pwa-login' : `/${initialLocale}/pwa-login`
      router.push(loginPath)
    } else {
      setShowLoginModal(true)
    }
  }, [isPWA, initialLocale, router])
  
  // Try to play video programmatically after load
  useEffect(() => {
    const tryPlayVideo = async (video: HTMLVideoElement | null) => {
      if (!video || videoError) return
      
      try {
        await video.play()
      } catch (error) {
        // Autoplay was prevented - this is normal, user interaction will be needed
        debugLog('Video autoplay prevented (normal browser behavior)')
      }
    }
    
    if (mobileVideoRef.current && !videoError) {
      tryPlayVideo(mobileVideoRef.current)
    }
    if (desktopVideoRef.current && !videoError) {
      tryPlayVideo(desktopVideoRef.current)
    }
  }, [videoError])
  
  // Use initialLocale prop directly - this ensures server and client render the same
  const locale = useMemo(() => initialLocale, [initialLocale])
  const dir = useMemo(() => initialDir, [initialDir])
  
  // Load messages based on initialLocale prop (not from hook)
  const messages = useMemo(() => {
    if (locale === 'ar') return arMessages
    if (locale === 'ru') return ruMessages
    return enMessages
  }, [locale])
  
  // Create translation function that uses the correct messages
  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.')
      let value: unknown = messages
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, unknown>)[k]
        } else {
          value = undefined
          break
        }
      }
      
      if (typeof value !== 'string') {
        warnLog(`Translation key not found: ${key}`)
        return key
      }
      
      // Simple parameter replacement
      if (params) {
        return Object.entries(params).reduce(
          (str, [paramKey, paramValue]) => 
            str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue)),
          value
        )
      }
      
      return value
    }
  }, [messages])
  
  // Memoize localized paths to ensure stable href values (prevents hydration mismatch)
  const productsPath = useMemo(() => getLocalizedPath('/products', locale), [locale])
  const aboutPath = useMemo(() => getLocalizedPath('/about', locale), [locale])
  const skinAnalysisPath = useMemo(() => getLocalizedPath('/skin-recommendation', locale), [locale])
  
  // Memoize translation strings to ensure stable content
  const orderNowText = useMemo(() => t('hero.orderNow'), [t])
  const loginText = useMemo(() => t('hero.login'), [t])
  const learnMoreText = useMemo(() => t('hero.learnMore'), [t])
  const titleText = useMemo(() => t('hero.title'), [t])
  const titleHighlightText = useMemo(() => t('hero.titleHighlight'), [t])
  const subtitleText = useMemo(() => t('hero.subtitle'), [t])
  
  return (
    <section className="min-h-[calc(100vh-64px)] md:min-h-0 md:pt-12 md:pb-12 flex-1" dir={dir}>
      <div className="container mx-auto px-3 md:px-4">
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col">
          {/* Title - Above video */}
          <motion.div 
            className="text-center pt-4 pb-3"
            initial={animationsEnabled ? { opacity: 0, y: 30 } : {}}
            animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
            transition={animationsEnabled ? { duration: 0.6, ease: "easeOut" } : {}}
          >
            <motion.h1 
              className="text-heading-2 font-bold text-gray-800 leading-tight font-display"
              initial={animationsEnabled ? { opacity: 0, y: 20 } : {}}
              animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
              transition={animationsEnabled ? { duration: 0.6, delay: 0.2, ease: "easeOut" } : {}}
            >
              {titleText}
              <motion.span 
                className="text-primary-600"
                initial={animationsEnabled ? { opacity: 0, scale: 0.8 } : {}}
                animate={animationsEnabled ? { opacity: 1, scale: 1 } : {}}
                transition={animationsEnabled ? { duration: 0.6, delay: 0.4, ease: "easeOut" } : {}}
              >
                {" "}{titleHighlightText}
              </motion.span>
            </motion.h1>
          </motion.div>
          
          {/* Video - Full width on mobile, hero style */}
          <div className="relative -mx-3 mb-4">
            <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
              {!videoError ? (
                <video 
                  ref={mobileVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onError={() => {
                    warnLog('Video failed to load, showing fallback')
                    setVideoError(true)
                  }}
                  onLoadedData={() => {
                    // Video loaded successfully
                    setVideoError(false)
                  }}
                >
                  <source src="/videos/start-video.mp4" type="video/mp4" />
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                  <div className="text-center p-8">
                    <Image 
                      src="/images/genosys-logo.png" 
                      alt="GENOSYS" 
                      width={200}
                      height={200}
                      className="mx-auto mb-4 opacity-80"
                      style={{ width: 'auto', height: 'auto' }}
                    />
                  </div>
                </div>
              )}
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>
          </div>
          
          {/* Content below video */}
          <div className="text-center px-1">
            {/* GENOSYS Logo */}
            <div className="mb-3 flex justify-center">
              <Image 
                src="/images/genosys-logo.png" 
                alt="GENOSYS Middle East FZ-LLC - Official Korean Dermacosmetics Distributor UAE" 
                width={120}
                height={120}
                className="h-12 w-auto"
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </div>
            
            {/* Subtitle */}
            <p className="text-body-sm text-gray-600 mb-4 leading-relaxed">
              {subtitleText}
            </p>
            
            {/* CTA Buttons - min-height ensures 44pt touch target (Apple HIG) */}
            <div className="flex flex-col gap-2.5 mb-4">
              {user ? (
                <motion.div
                  whileHover={animationsEnabled ? { scale: 1.02, y: -2 } : {}}
                  whileTap={animationsEnabled ? { scale: 0.98 } : {}}
                  transition={animationsEnabled ? { duration: 0.2 } : {}}
                >
                  <Link 
                    href={productsPath}
                    className="bg-primary-600 text-white px-5 py-3 min-h-[44px] rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center text-body-sm shadow-lg shadow-primary-600/25 block"
                  >
                    {orderNowText}
                    <ArrowRight className={`${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'} h-4 w-4`} />
                  </Link>
                </motion.div>
              ) : (
                <motion.button
                  onClick={handleLoginClick}
                  whileHover={animationsEnabled ? { scale: 1.02, y: -2 } : {}}
                  whileTap={animationsEnabled ? { scale: 0.98 } : {}}
                  transition={animationsEnabled ? { duration: 0.2 } : {}}
                  className="bg-primary-600 text-white px-5 py-3 min-h-[44px] rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center text-body-sm shadow-lg shadow-primary-600/25"
                >
                  {loginText}
                  <ArrowRight className={`${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'} h-4 w-4`} />
                </motion.button>
              )}
              <motion.div
                whileHover={animationsEnabled ? { scale: 1.02, y: -1 } : {}}
                whileTap={animationsEnabled ? { scale: 0.98 } : {}}
                transition={animationsEnabled ? { duration: 0.2 } : {}}
              >
                <Link 
                  href={aboutPath}
                  className="border-2 border-primary-600 text-primary-600 px-5 py-2.5 min-h-[44px] rounded-xl font-semibold hover:bg-primary-50 transition-all flex items-center justify-center text-body-sm block"
                >
                  {learnMoreText}
                </Link>
              </motion.div>
            </div>
            
            {/* AI Skin Analysis Link */}
            <motion.div
              initial={animationsEnabled ? { opacity: 0, y: 10 } : {}}
              animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
              transition={animationsEnabled ? { duration: 0.5, delay: 0.3 } : {}}
              className="mt-4"
            >
              <Link 
                href={skinAnalysisPath}
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors group"
              >
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium underline underline-offset-2 decoration-primary-300 hover:decoration-primary-500">
                  {locale === 'ar' ? 'تحليل البشرة بالذكاء الاصطناعي' : locale === 'ru' ? 'AI Анализ кожи' : 'AI Skin Analysis'}
                </span>
              </Link>
            </motion.div>
            
            {/* App Store Download Badge */}
            <motion.div
              initial={animationsEnabled ? { opacity: 0, y: 10 } : {}}
              animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
              transition={animationsEnabled ? { duration: 0.5, delay: 0.4 } : {}}
              className="mt-4"
            >
              <a 
                href="https://apps.apple.com/app/id6756648064"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-normal">
                    {locale === 'ar' ? 'حمّل من' : locale === 'ru' ? 'Загрузите в' : 'Download on the'}
                  </span>
                  <span className="text-base font-semibold -mt-0.5">App Store</span>
                </div>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block text-center">
          <h1 className="text-display-md font-bold text-gray-800 mb-4 font-display">
            {titleText}
            <span className="text-primary-600"> {titleHighlightText}</span>
          </h1>
          
          {/* Video */}
          <div className="mb-4">
            <div className="aspect-video w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-gray-100">
              {!videoError ? (
                <video 
                  ref={desktopVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onError={() => {
                    warnLog('Video failed to load, showing fallback')
                    setVideoError(true)
                  }}
                  onLoadedData={() => {
                    // Video loaded successfully
                    setVideoError(false)
                  }}
                >
                  <source src="/videos/start-video.mp4" type="video/mp4" />
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                  <div className="text-center p-8">
                    <Image 
                      src="/images/genosys-logo.png" 
                      alt="GENOSYS" 
                      width={300}
                      height={300}
                      className="mx-auto mb-4 opacity-80"
                      style={{ width: 'auto', height: 'auto' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-body-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            {subtitleText}
          </p>
          <div className={`flex gap-4 justify-center items-center ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            {user ? (
              <Link 
                href={productsPath}
                className="bg-primary-600 text-white px-8 py-4 min-h-[48px] rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center text-body-lg"
              >
                {orderNowText}
                <ArrowRight className={`${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5`} />
              </Link>
            ) : (
              <button
                onClick={handleLoginClick}
                className="bg-primary-600 text-white px-8 py-4 min-h-[48px] rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center text-body-lg"
              >
                {loginText}
                <ArrowRight className={`${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5`} />
              </button>
            )}
            <Link 
              href={aboutPath}
              className="border border-primary-600 text-primary-600 px-8 py-4 min-h-[48px] rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center text-body-lg"
            >
              {learnMoreText}
            </Link>
          </div>
          
          {/* AI Skin Analysis Link */}
          <div className="mt-6">
            <Link 
              href={skinAnalysisPath}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors group"
            >
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-base font-medium underline underline-offset-4 decoration-primary-300 hover:decoration-primary-500">
                {locale === 'ar' ? 'تحليل البشرة بالذكاء الاصطناعي' : locale === 'ru' ? 'AI Анализ кожи' : 'AI Skin Analysis'}
              </span>
            </Link>
          </div>
          
          {/* App Store Download Badge */}
          <div className="mt-5">
            <a 
              href="https://apps.apple.com/app/id6756648064"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-normal">
                  {locale === 'ar' ? 'حمّل من' : locale === 'ru' ? 'Загрузите в' : 'Download on the'}
                </span>
                <span className="text-xl font-semibold -mt-0.5">App Store</span>
              </div>
            </a>
          </div>
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
    </section>
  )
}
