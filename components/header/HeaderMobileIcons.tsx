'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Menu } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { useFavorites } from '@/components/FavoritesProvider'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

interface HeaderMobileIconsProps {
  isRTL: boolean
  isClient: boolean
  isPWA: boolean
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
  isPWA,
  showMobileMenu,
  setShowMobileMenu,
}: HeaderMobileIconsProps) {
  const { getTotalItems } = useCartStore()
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
      className={`relative ${iconBtnClass} ${spacingClass}`}
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

  const cartIcon = !isPWA ? (
    <Link 
      key="cart"
      href={getLocalizedPath('/cart', locale)} 
      className={`relative ${iconBtnClass} ${spacingClass}`}
      aria-label={`${t('common.cart')} with ${isClient ? getTotalItems() : 0} items`}
    >
      <ShoppingCart className={`h-4 w-4 transition-colors ${isClient && getTotalItems() > 0 ? 'text-green-600' : ''}`} aria-hidden="true" />
      {isClient && getTotalItems() > 0 && (
        <span className="absolute top-0 right-0 bg-primary-600 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center header-badge" aria-hidden="true">
          {getTotalItems()}
        </span>
      )}
    </Link>
  ) : null

  const aiLink = (
    <Link
      key="ai"
      href={getLocalizedPath('/skin-recommendation', locale)}
      className={`px-2 py-1 rounded hover:bg-gray-100 transition-colors ${spacingClass}`}
      aria-label={t('navigation.aiSkinAnalysis') || 'AI Skin Analysis'}
    >
      <span className="text-xs font-medium text-green-600">AI</span>
    </Link>
  )

  const logo = (
    <Link 
      key="logo"
      href={getLocalizedPath('/products', locale)} 
      className={`p-0.5 hover:opacity-80 transition-opacity flex items-center justify-center ${isRTL ? 'mr-[10%] md:mr-2' : 'ml-[10%] md:ml-2'}`}
      aria-label={t('navigation.goToProducts')}
    >
      <Image
        src="/Logo/upLOGO.png"
        alt="GENOSYS Logo"
        width={180}
        height={54}
        className="w-[120px] h-auto"
        style={{ width: 'auto', height: 'auto' }}
      />
    </Link>
  )

  // Render icons in correct order based on direction
  // Note: User icon removed from mobile - accessible via hamburger menu
  if (isRTL) {
    // RTL: logo, cart, AI, heart, lang, menu (reversed order visually)
    return (
      <div className="md:hidden flex items-center gap-0.5 header-icons ml-auto">
        {logo}
        {cartIcon}
        {aiLink}
        {heartIcon}
        {languageSwitcher}
        {menuButton}
      </div>
    )
  }

  // LTR: menu, lang, heart, cart, AI, logo
  return (
    <div className="md:hidden flex items-center gap-0.5 header-icons">
      {menuButton}
      {languageSwitcher}
      {heartIcon}
      {cartIcon}
      {aiLink}
      {logo}
    </div>
  )
}
