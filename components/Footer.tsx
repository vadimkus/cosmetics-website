'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useLayoutEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath, getLocaleFromPath } from '@/lib/i18n'

export default function Footer() {
  const pathname = usePathname()
  const { t, locale } = useTranslation()
  // Read direction directly from window.location.pathname FIRST - this is always available
  // Then check DOM attributes set by blocking script
  // This ensures we get the correct value even if script hasn't run yet
  const getCurrentDir = (): 'ltr' | 'rtl' => {
    // On server, always return 'ltr' to match server render
    if (typeof window === 'undefined') return 'ltr'
    
    // PRIMARY: Check window.location.pathname directly (always available, no dependencies)
    // This is the most reliable source of truth
    if (typeof window !== 'undefined' && window.location) {
      const currentPath = window.location.pathname || ''
      if (currentPath.startsWith('/ar')) {
        return 'rtl'
      }
    }
    
    // SECONDARY: Check global variable set by blocking script (fastest if available)
    if (typeof window !== 'undefined' && (window as any).__GENOSYS_DIR__) {
      const storedDir = (window as any).__GENOSYS_DIR__
      if (storedDir === 'rtl' || storedDir === 'ltr') {
        return storedDir
      }
    }
    
    // TERTIARY: Read directly from DOM (set by blocking script)
    if (typeof document !== 'undefined' && document.documentElement) {
      const htmlDir = document.documentElement.getAttribute('dir') || 
                      document.documentElement.getAttribute('data-dir') ||
                      document.documentElement.dir
      if (htmlDir === 'rtl' || htmlDir === 'ltr') {
        return htmlDir
      }
    }
    
    // FALLBACK: Use pathname from hook (might not be available on first render)
    if (pathname) {
      const pathLocale = getLocaleFromPath(pathname)
      return pathLocale === 'ar' ? 'rtl' : 'ltr'
    }
    
    return 'ltr'
  }
  
  // Read direction directly on every render - no state needed
  // This ensures we always have the correct value, even on hard refresh
  const [mounted, setMounted] = useState(false)
  const footerDir = getCurrentDir()
  
  // Ensure HTML dir attribute is set correctly and trigger re-render if needed
  useLayoutEffect(() => {
    setMounted(true)
    
    // Use pathname if available, otherwise fall back to window.location
    const currentPath = pathname || (typeof window !== 'undefined' ? window.location.pathname : '')
    const pathLocale = getLocaleFromPath(currentPath)
    const dir = pathLocale === 'ar' ? 'rtl' : 'ltr'
    const lang = pathLocale === 'ar' ? 'ar' : 'en'
    
    // Set HTML dir attribute immediately (ensure it's set even if blocking script didn't run)
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', dir)
      document.documentElement.setAttribute('lang', lang)
      document.documentElement.dir = dir
      document.documentElement.lang = lang
      document.documentElement.style.direction = dir
      // Also set on body
      if (document.body) {
        document.body.setAttribute('dir', dir)
      }
    }
  }, [pathname])
  
  // Watch for changes to HTML dir attribute and force re-render
  useEffect(() => {
    if (typeof document === 'undefined') return
    
    const observer = new MutationObserver(() => {
      // Force re-render when dir attribute changes
      setMounted(prev => !prev)
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir']
    })
    
    return () => observer.disconnect()
  }, [])
  
  // Also sync on popstate (browser back/forward)
  useEffect(() => {
    if (!mounted) return
    const handlePopState = () => {
      // Force re-render by updating a dummy state
      setMounted(prev => !prev)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [mounted])

  return (
    <footer role="contentinfo" className="bg-white border-t border-gray-200 py-6 md:py-8" dir={footerDir} style={{ direction: footerDir }} suppressHydrationWarning>
      <div className="container mx-auto px-4">
        <div className={`flex flex-col items-center gap-4 md:gap-6 ${footerDir === 'rtl' ? 'text-right' : 'text-center'}`} suppressHydrationWarning>
          {/* Navigation Links */}
          <div className={`flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-6 text-sm w-full ${footerDir === 'rtl' ? 'flex-row-reverse' : ''}`} suppressHydrationWarning>
            <Link href={getLocalizedPath('/blog', locale)} className={`text-gray-600 hover:text-primary-600 transition-colors py-2 px-2 touch-manipulation min-h-[44px] flex items-center ${footerDir === 'rtl' ? 'text-right' : 'text-center'}`}>
              {t('navigation.blog')}
            </Link>
            <Link href={getLocalizedPath('/faq', locale)} className={`text-gray-600 hover:text-primary-600 transition-colors py-2 px-2 touch-manipulation min-h-[44px] flex items-center ${footerDir === 'rtl' ? 'text-right' : 'text-center'}`}>
              {t('navigation.faq')}
            </Link>
            <Link href={getLocalizedPath('/locations', locale)} className={`text-gray-600 hover:text-primary-600 transition-colors py-2 px-2 touch-manipulation min-h-[44px] flex items-center ${footerDir === 'rtl' ? 'text-right' : 'text-center'}`}>
              {t('common.locations')}
            </Link>
            <Link href={getLocalizedPath('/partners', locale)} className={`text-gray-600 hover:text-primary-600 transition-colors py-2 px-2 touch-manipulation min-h-[44px] flex items-center ${footerDir === 'rtl' ? 'text-right' : 'text-center'}`}>
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
              className="mb-2"
              priority={false}
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            <p className="text-sm mt-1 w-full text-center" dir={footerDir}>
              {t('footer.officialDistributor')}
            </p>
            <p className="text-sm mt-2 w-full text-center" dir={footerDir}>
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

