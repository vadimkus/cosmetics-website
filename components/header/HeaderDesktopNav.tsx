'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useAuth } from '@/components/AuthProvider'

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

  const linkClass = "text-gray-700 hover:text-primary-600 transition-colors"
  
  // Navigation links (in LTR order)
  const links = [
    { href: '/', label: t('navigation.home') },
    { href: '/about', label: t('navigation.about') },
    { href: '/brand', label: t('navigation.brand') },
    { href: '/products', label: t('navigation.products') },
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
      {orderedLinks.map((link) => (
        <Link 
          key={link.href}
          href={getLocalizedPath(link.href, locale)} 
          className={linkClass}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
