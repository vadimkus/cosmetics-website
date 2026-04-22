'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { getLocalizedPath, getLocaleFromPath } from '@/lib/i18n'
import { useMemo, useState, useEffect } from 'react'
import { warnLog } from '@/lib/logger'
import { usePWAMode } from '@/hooks/usePWAMode'
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

// Detect mobile device
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  const userAgent = navigator.userAgent || ''
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  return mobileRegex.test(userAgent) || window.innerWidth <= 768
}

export default function Footer() {
  const pathname = usePathname()
  const { isPWA, isClient } = usePWAMode()
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if mobile device
  useEffect(() => {
    setIsMobile(isMobileDevice())
    
    const handleResize = () => {
      setIsMobile(isMobileDevice())
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Get locale from pathname - handle null consistently
  // During SSR, pathname might be null, so we default to '/' which gives 'en'
  // On client, pathname will be available, so we use it
  // This ensures consistent initial render between server and client
  const effectivePath = pathname ?? '/'
  const locale = useMemo(() => {
    // If pathname is null, try to get from window.location on client
    if (!pathname && typeof window !== 'undefined' && window.location) {
      return getLocaleFromPath(window.location.pathname)
    }
    return getLocaleFromPath(effectivePath)
  }, [pathname, effectivePath])
  
  // Load messages based on locale
  const messages = useMemo(() => {
    if (locale === 'ar') return arMessages
    if (locale === 'ru') return ruMessages
    return enMessages
  }, [locale])
  
  // Create translation function
  const t = useMemo(() => {
    return (key: string): string => {
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
      
      return value
    }
  }, [messages])

  // Check if we're on the contact page - check synchronously to avoid hydration mismatch
  // If pathname is null (SSR), default to false so server and client match initially
  const isContactPage = useMemo(() => {
    if (!pathname) return false
    const path = pathname.toLowerCase()
    return path === '/contact' || path === '/ar/contact' || path.startsWith('/contact')
  }, [pathname])

  // Hide footer on mobile (sticky footer nav handles it) and in PWA mode
  if (isClient && (isPWA || isMobile)) {
    return null
  }

  return (
    <footer role="contentinfo" className={`bg-white border-t border-gray-200 ${isContactPage ? 'pt-0 pb-4 md:pb-8' : 'py-4 md:py-8'}`} suppressHydrationWarning>
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex flex-col items-center gap-0.5 md:gap-6 text-center">
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 md:gap-4 lg:gap-6 text-xs md:text-sm w-full footer-links">
            <Link
              href={getLocalizedPath('/blog', locale)}
              className="text-gray-600 hover:text-primary-600 transition-colors py-1 md:py-2 px-1 md:px-2 touch-manipulation min-h-[36px] md:min-h-[44px] flex items-center justify-center"
              suppressHydrationWarning
            >
              {t('navigation.blog')}
            </Link>
            <Link
              href={getLocalizedPath('/faq', locale)}
              className="text-gray-600 hover:text-primary-600 transition-colors py-1 md:py-2 px-1 md:px-2 touch-manipulation min-h-[36px] md:min-h-[44px] flex items-center justify-center"
              suppressHydrationWarning
            >
              {t('navigation.faq')}
            </Link>
            <Link
              href={getLocalizedPath('/locations', locale)}
              className="text-gray-600 hover:text-primary-600 transition-colors py-1 md:py-2 px-1 md:px-2 touch-manipulation min-h-[36px] md:min-h-[44px] flex items-center justify-center"
              suppressHydrationWarning
            >
              {t('common.locations')}
            </Link>
            <Link
              href={getLocalizedPath('/partners', locale)}
              className="text-gray-600 hover:text-primary-600 transition-colors py-1 md:py-2 px-1 md:px-2 touch-manipulation min-h-[36px] md:min-h-[44px] flex items-center justify-center"
              suppressHydrationWarning
            >
              {t('navigation.partners')}
            </Link>
            <Link
              href={getLocalizedPath('/privacy-policy', locale)}
              className="text-gray-600 hover:text-primary-600 transition-colors py-1 md:py-2 px-1 md:px-2 touch-manipulation min-h-[36px] md:min-h-[44px] flex items-center justify-center"
              suppressHydrationWarning
            >
              {t('navigation.privacyPolicy')}
            </Link>
          </div>

          {/* Logo and Copyright */}
          <div className="flex flex-col items-center w-full">
            <Link 
              href={getLocalizedPath('/products', locale)}
              className="mb-1 md:mb-2 hover:opacity-80 transition-opacity"
              aria-label={t('navigation.goToProducts')}
            >
              <Image
                src="/Logo/upLOGO.png"
                alt="GENOSYS Middle East FZ-LLC - Official Korean Dermacosmetics Distributor UAE"
                width={180}
                height={54}
                className="w-[120px] md:w-[180px] h-auto"
                loading="lazy"
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </Link>
            <p className="text-[10px] md:text-sm mt-0.5 md:mt-1 w-full text-center text-gray-500 footer-copyright" suppressHydrationWarning>
              {t('footer.officialDistributor')}
            </p>
            <p className="text-[10px] md:text-sm mt-1 md:mt-2 w-full text-center text-gray-400 footer-copyright" suppressHydrationWarning>
              {t('footer.copyright')}
            </p>
          </div>

          {/* Social + Payments (desktop-only; Footer already returns null on mobile/PWA) */}
          <div className="hidden md:flex md:flex-col md:items-center md:gap-4 md:pt-6 md:mt-2 md:border-t md:border-gray-100 md:w-full">
            {/* Social row */}
            <div className="flex items-center gap-3" aria-label="Social media">
              <a
                href="https://www.instagram.com/genosys.uae/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-pink-600 hover:border-pink-300 transition-colors"
                aria-label="Follow GENOSYS on Instagram"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.facebook.com/genosys.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
                aria-label="Follow GENOSYS on Facebook"
              >
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>

            {/* Payment methods row */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                {t('footer.weAccept')}
              </span>
              <ul
                className="flex flex-wrap items-center justify-center gap-1.5"
                aria-label="Accepted payment methods"
              >
                {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay', 'Tabby', 'Tamara'].map((method) => (
                  <li
                    key={method}
                    className="text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 tracking-wide"
                  >
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
