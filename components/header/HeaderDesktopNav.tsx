'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useAuth } from '@/components/auth/AuthProvider'

interface HeaderDesktopNavProps {
  isRTL: boolean
  isClient: boolean
}

/**
 * Desktop navigation links for header
 * Handles both LTR and RTL layouts
 */
export default function HeaderDesktopNav({ isRTL, isClient }: HeaderDesktopNavProps) {
  const { t, locale } = useTranslation()
  const { user } = useAuth()
  const pathname = usePathname()

  const linkClass = "text-gray-700 hover:text-primary-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 rounded"
  
  // Navigation links (in LTR order)
  const links = [
    { href: '/', label: t('navigation.home') },
    { href: '/about', label: t('navigation.about') },
    { href: '/brand', label: t('navigation.brand') },
    { href: '/products', label: t('navigation.products') },
    { href: '/blog', label: t('navigation.blog') },
    ...(isClient && user ? [{ href: '/training', label: t('navigation.training') }] : []),
    { href: '/contact', label: t('navigation.contact') },
    { href: '/delivery', label: t('navigation.delivery') },
  ]

  // Reverse for RTL
  const orderedLinks = isRTL ? [...links].reverse() : links

  return (
    <nav 
      className={`hidden md:flex ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`} 
      role="navigation" 
      aria-label="Main navigation"
    >
      {orderedLinks.map((link) => {
        const localizedHref = getLocalizedPath(link.href, locale)
        const isActive = pathname === localizedHref
        return (
          <Link
            key={link.href}
            href={localizedHref}
            className={linkClass}
            aria-current={isActive ? 'page' : undefined}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
