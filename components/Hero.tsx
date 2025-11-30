'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useAuth } from './AuthProvider'
import LoginModal from './LoginModal'
import { useState, useMemo, useRef, useEffect } from 'react'
import { getLocalizedPath } from '@/lib/i18n'
import BlackFridayCountdown from './BlackFridayCountdown'
import type { Locale } from '@/lib/i18n'
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

interface HeroProps {
  initialLocale?: Locale
  initialDir?: 'ltr' | 'rtl'
}

export default function Hero({ initialLocale = 'en', initialDir = 'ltr' }: HeroProps = {}) {
  const { user } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [videoError, setVideoError] = useState(false)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  
  // Try to play video programmatically after load
  useEffect(() => {
    const tryPlayVideo = async (video: HTMLVideoElement | null) => {
      if (!video || videoError) return
      
      try {
        await video.play()
      } catch (error) {
        // Autoplay was prevented - this is normal, user interaction will be needed
        console.log('Video autoplay prevented (normal browser behavior)')
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
    <section className="bg-gradient-to-b from-white to-gray-50 min-h-[calc(100vh-64px)] md:min-h-0 md:pt-12 md:pb-20" dir={dir}>
      <div className="container mx-auto px-3 md:px-4">
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col">
          {/* Title - Above video */}
          <div className="text-center pt-4 pb-3">
            <h1 className="text-xl font-bold text-gray-800 leading-tight">
              {titleText}
              <span className="text-primary-600"> {titleHighlightText}</span>
            </h1>
          </div>
          
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
                    console.warn('Video failed to load, showing fallback')
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
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {subtitleText}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col gap-2.5 mb-4">
              {user ? (
                <Link 
                  href={productsPath}
                  className="bg-primary-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center text-sm shadow-lg shadow-primary-600/25 active:scale-[0.98]"
                >
                  {orderNowText}
                  <ArrowRight className={`${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'} h-4 w-4`} />
                </Link>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-primary-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center text-sm shadow-lg shadow-primary-600/25 active:scale-[0.98]"
                >
                  {loginText}
                  <ArrowRight className={`${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'} h-4 w-4`} />
                </button>
              )}
              <Link 
                href={aboutPath}
                className="border-2 border-primary-600 text-primary-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-50 transition-all flex items-center justify-center text-sm active:scale-[0.98]"
              >
                {learnMoreText}
              </Link>
            </div>

            {/* Black Friday Countdown Timer */}
            <BlackFridayCountdown />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block text-center">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 mb-6">
            {titleText}
            <span className="text-primary-600"> {titleHighlightText}</span>
          </h1>
          
          {/* Video */}
          <div className="mb-8">
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
                    console.warn('Video failed to load, showing fallback')
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
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {subtitleText}
          </p>
          <div className={`flex gap-4 justify-center items-center ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            {user ? (
              <Link 
                href={productsPath}
                className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center text-lg"
              >
                {orderNowText}
                <ArrowRight className={`${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5`} />
              </Link>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center text-lg"
              >
                {loginText}
                <ArrowRight className={`${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5`} />
              </button>
            )}
            <Link 
              href={aboutPath}
              className="border border-primary-600 text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center text-lg"
            >
              {learnMoreText}
            </Link>
          </div>

          {/* Black Friday Countdown Timer */}
          <BlackFridayCountdown />
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
