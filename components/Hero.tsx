'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useAuth } from './AuthProvider'
import LoginModal from './LoginModal'
import { useState, useMemo } from 'react'
import { getLocalizedPath } from '@/lib/i18n'
import BlackFridayCountdown from './BlackFridayCountdown'
import type { Locale } from '@/lib/i18n'
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'

interface HeroProps {
  initialLocale?: Locale
  initialDir?: 'ltr' | 'rtl'
}

export default function Hero({ initialLocale = 'en', initialDir = 'ltr' }: HeroProps = {}) {
  const { user } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  
  // Use initialLocale prop directly - this ensures server and client render the same
  const locale = useMemo(() => initialLocale, [initialLocale])
  const dir = useMemo(() => initialDir, [initialDir])
  
  // Load messages based on initialLocale prop (not from hook)
  const messages = useMemo(() => {
    return locale === 'ar' ? arMessages : enMessages
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
        console.warn(`Translation key not found: ${key}`)
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
  
  // Memoize translation strings to ensure stable content
  const orderNowText = useMemo(() => t('hero.orderNow'), [t])
  const loginText = useMemo(() => t('hero.login'), [t])
  const learnMoreText = useMemo(() => t('hero.learnMore'), [t])
  const titleText = useMemo(() => t('hero.title'), [t])
  const titleHighlightText = useMemo(() => t('hero.titleHighlight'), [t])
  const subtitleText = useMemo(() => t('hero.subtitle'), [t])
  
  return (
    <section className="bg-white pt-8 pb-12 md:pt-12 md:pb-20" dir={dir}>
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 md:mb-6">
          {titleText}
          <span className="text-primary-600"> {titleHighlightText}</span>
        </h1>
        
        {/* Video */}
        <div className="mb-6 md:mb-8">
          <div className="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden">
            <video 
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src="/videos/start-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        
        {/* GENOSYS Logo */}
        <div className="mb-6 md:mb-8 flex justify-center">
          <Image 
            src="/images/genosys-logo.png" 
            alt="GENOSYS Middle East FZ-LLC - Official Korean Dermacosmetics Distributor UAE" 
            width={160}
            height={160}
            className="h-16 md:h-20 w-auto"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </div>
        
        <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
          {subtitleText}
        </p>
        <div className={`flex flex-col gap-3 md:gap-4 justify-center items-center px-4 ${dir === 'rtl' ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
          {user ? (
            <Link 
              href={productsPath}
              className="w-full sm:w-auto bg-primary-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center text-base md:text-lg min-h-[44px] touch-manipulation"
            >
              {orderNowText}
              <ArrowRight className={`${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'} h-4 w-4 md:h-5 md:w-5`} />
            </Link>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full sm:w-auto bg-primary-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center text-base md:text-lg min-h-[44px] touch-manipulation"
            >
              {loginText}
              <ArrowRight className={`${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'} h-4 w-4 md:h-5 md:w-5`} />
            </button>
          )}
          <Link 
            href={aboutPath}
            className="w-full sm:w-auto border border-primary-600 text-primary-600 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center text-base md:text-lg min-h-[44px] touch-manipulation"
          >
            {learnMoreText}
          </Link>
        </div>

        {/* Black Friday Countdown Timer */}
        <BlackFridayCountdown />
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
