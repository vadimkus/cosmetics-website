'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { getLocalizedPath, getLocaleFromPath } from '@/lib/i18n'
import { useMemo } from 'react'
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'

export default function Footer() {
  const pathname = usePathname()
  
  // Get locale from pathname - consistent between server and client
  const effectivePath = pathname ?? '/'
  const locale = useMemo(() => getLocaleFromPath(effectivePath), [effectivePath])
  
  // Load messages based on locale
  const messages = useMemo(() => {
    return locale === 'ar' ? arMessages : enMessages
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

  return (
    <footer role="contentinfo" className="bg-white border-t border-gray-200 py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 md:gap-6 text-center">
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-6 text-sm w-full footer-links">
            <Link
              href={getLocalizedPath('/blog', locale)}
              className="text-gray-600 hover:text-primary-600 transition-colors py-2 px-2 touch-manipulation min-h-[44px] flex items-center justify-center"
            >
              {t('navigation.blog')}
            </Link>
            <Link
              href={getLocalizedPath('/faq', locale)}
              className="text-gray-600 hover:text-primary-600 transition-colors py-2 px-2 touch-manipulation min-h-[44px] flex items-center justify-center"
            >
              {t('navigation.faq')}
            </Link>
            <Link
              href={getLocalizedPath('/locations', locale)}
              className="text-gray-600 hover:text-primary-600 transition-colors py-2 px-2 touch-manipulation min-h-[44px] flex items-center justify-center"
            >
              {t('common.locations')}
            </Link>
            <Link
              href={getLocalizedPath('/partners', locale)}
              className="text-gray-600 hover:text-primary-600 transition-colors py-2 px-2 touch-manipulation min-h-[44px] flex items-center justify-center"
            >
              {t('navigation.partners')}
            </Link>
          </div>

          {/* Logo and Copyright */}
          <div className="flex flex-col items-center w-full">
            <Image
              src="/Logo/upLOGO.png"
              alt="GENOSYS Middle East FZ-LLC - Official Korean Dermacosmetics Distributor UAE"
              width={180}
              height={54}
              className="mb-2 h-auto w-auto"
              priority={false}
              quality={75}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            <p className="text-sm mt-1 w-full text-center footer-copyright">
              {t('footer.officialDistributor')}
            </p>
            <p className="text-sm mt-2 w-full text-center footer-copyright">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
