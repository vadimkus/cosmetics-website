'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Menu } from 'lucide-react'
import { useFavorites } from '@/components/FavoritesProvider'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

interface HeaderMobileIconsProps {
  isRTL: boolean
  isClient: boolean
  showMobileMenu: boolean
  setShowMobileMenu: (show: boolean) => void
}

/**
 * Shared mobile icons component for header
 * Handles both LTR (English) and RTL (Arabic) layouts
 * Note: User icon removed - accessible via hamburger menu
 */
export default function HeaderMobileIcons({
  isRTL,
  isClient,
  showMobileMenu,
  setShowMobileMenu,
}: HeaderMobileIconsProps) {
  const { favorites } = useFavorites()
  const { t, locale } = useTranslation()

  // Common icon button class
  const iconBtnClass = "p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center"
  
  // Spacing class based on direction
  const spacingClass = isRTL ? "mr-2" : "ml-2"

  // Build icons array in correct order
  const menuButton = (
    <button
      key="menu"
      onClick={() => setShowMobileMenu(!showMobileMenu)}
      className={iconBtnClass}
      aria-label={showMobileMenu ? t('common.closeMobileMenu') : t('common.openMobileMenu')}
      aria-expanded={showMobileMenu}
    >
      <Menu className={`h-4 w-4 ${showMobileMenu ? 'text-green-600' : ''}`} aria-hidden="true" />
    </button>
  )

  const languageSwitcher = (
    <div key="lang" className={spacingClass}>
      <LanguageSwitcher />
    </div>
  )

  const heartIcon = (
    <Link 
      key="heart"
      href={getLocalizedPath('/favorites', locale)} 
      className={`relative ${iconBtnClass}`}
      aria-label={`${t('common.favorites')} with ${isClient ? favorites.length : 0} items`}
    >
      <Heart className={`h-4 w-4 transition-colors ${isClient && favorites.length > 0 ? 'text-red-500' : ''}`} aria-hidden="true" />
      {isClient && favorites.length > 0 && (
        <span className="absolute top-0 right-0 bg-primary-600 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center header-badge" aria-hidden="true">
          {favorites.length}
        </span>
      )}
    </Link>
  )

  const aiLink = (
    <Link
      key="ai"
      href={getLocalizedPath('/skin-recommendation', locale)}
      className="px-2 py-1 rounded hover:bg-gray-100 transition-colors"
      aria-label={t('navigation.aiSkinAnalysis') || 'AI Skin Analysis'}
    >
      <span className="text-sm font-bold text-red-600">AI</span>
    </Link>
  )

  const logo = (
    <Link 
      key="logo"
      href={getLocalizedPath('/products', locale)} 
      className="p-0.5 hover:opacity-80 transition-opacity flex items-center justify-center"
      aria-label={t('navigation.goToProducts')}
    >
      <Image
        src="/Logo/upLOGO-transparent.png"
        alt="GENOSYS Logo"
        width={1009}
        height={203}
        className="w-[110px] h-auto"
        priority
      />
    </Link>
  )

  // Render icons in correct order based on direction
  // Note: User icon and cart icon removed from mobile - cart is in footer
  // Layout: left icons | center (logo + heart) | right icons
  if (isRTL) {
    return (
      <div className="md:hidden flex items-center justify-between w-full header-icons">
        {/* Right side in RTL (menu, lang) */}
        <div className="flex items-center gap-0.5">
          {menuButton}
          {languageSwitcher}
        </div>
        {/* Center (logo + heart) */}
        <div className="flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {heartIcon}
          {logo}
        </div>
        {/* Left side in RTL (AI) */}
        <div className="flex items-center">
          {aiLink}
        </div>
      </div>
    )
  }

  // LTR layout
  return (
    <div className="md:hidden flex items-center justify-between w-full header-icons">
      {/* Left side (menu, lang) */}
      <div className="flex items-center gap-0.5">
        {menuButton}
        {languageSwitcher}
      </div>
      {/* Center (logo + heart) */}
      <div className="flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
        {logo}
        {heartIcon}
      </div>
      {/* Right side (AI) */}
      <div className="flex items-center">
        {aiLink}
      </div>
    </div>
  )
}
