'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { getLocalizedPath, getLocaleFromPath } from '@/lib/i18n'
import { useMemo } from 'react'
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

export default function Footer() {
  const pathname = usePathname()
  
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
        console.warn(`Translation key not found: ${key}`)
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
          </div>

          {/* Logo and Copyright */}
          <div className="flex flex-col items-center w-full">
            <Link 
              href={getLocalizedPath('/products', locale)}
              className="mb-1 md:mb-2 hover:opacity-80 transition-opacity"
              aria-label="Go to products"
            >
              <Image
                src="/Logo/upLOGO.png"
                alt="GENOSYS Middle East FZ-LLC - Official Korean Dermacosmetics Distributor UAE"
                width={180}
                height={54}
                className="w-[120px] md:w-[180px] h-auto"
                style={{ width: 'auto', height: 'auto' }}
                priority={false}
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
        </div>
      </div>
    </footer>
  )
}
