'use client'

import Link from 'next/link'
import { ShoppingCart, Heart, User, LogOut } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { useAuth } from '@/components/auth/AuthProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

interface HeaderDesktopIconsProps {
  isRTL: boolean
  isClient: boolean
  handleLoginClick: () => void
}

/**
 * Desktop header icons (cart, favorites, user, etc.) and contact info
 * Handles both LTR and RTL layouts
 */
export default function HeaderDesktopIcons({
  isRTL,
  isClient,
  handleLoginClick
}: HeaderDesktopIconsProps) {
  // Use selector pattern for better reactivity with Zustand persist
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()
  const { t, locale } = useTranslation()

  // Badge position for RTL
  const badgePosition = isRTL ? "-top-1 -left-1" : "-top-1 -right-1"

  // Shared icon button shell — gives every header icon a consistent circular
  // hover surface, a keyboard `focus-visible` ring, and the 44x44 touch target
  // that was previously duplicated across some (but not all) links/buttons.
  const iconShell =
    'relative inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white touch-manipulation min-h-[44px] min-w-[44px]'

  const contactInfo = (
    <div className={`flex flex-col ${isRTL ? 'items-start text-left' : 'items-end text-right'} header-contact`}>
      <div className="text-sm text-gray-600">
        {t('footer.officialDistributor')}
      </div>
      <a 
        href="https://wa.me/971585487665" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-sm text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1 header-contact-link"
      >
        {isRTL ? '📱 +971 58 548 76 65' : '+971 58 548 76 65 📱'}
      </a>
      <a 
        href="mailto:sales@genosys.ae"
        className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
      >
        sales@genosys.ae
      </a>
    </div>
  )

  const icons = (
    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} header-icons`}>
      {/* Cart - first in RTL */}
      {isRTL && (
        <Link
          href={getLocalizedPath('/cart', locale)}
          className={iconShell}
          aria-label={`${t('common.cart')} with ${isClient ? cartCount : 0} items`}
        >
          <ShoppingCart className={`h-6 w-6 transition-colors ${isClient && cartCount > 0 ? 'text-green-600' : ''}`} aria-hidden="true" />
          {isClient && cartCount > 0 && (
            <span className={`absolute ${badgePosition} bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center header-badge`} aria-hidden="true">
              {cartCount}
            </span>
          )}
        </Link>
      )}

      {/* Favorites */}
      <Link
        href={getLocalizedPath('/favorites', locale)}
        className={iconShell}
        aria-label={`${t('common.favorites')} with ${isClient ? favorites.length : 0} items`}
      >
        <Heart className={`h-6 w-6 transition-colors ${isClient && favorites.length > 0 ? 'text-red-500' : ''}`} aria-hidden="true" />
        {isClient && favorites.length > 0 && (
          <span className={`absolute ${badgePosition} bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center header-badge`} aria-hidden="true">
            {favorites.length}
          </span>
        )}
      </Link>

      {/* User/Auth icons */}
      {isClient && user ? (
        <>
          <LanguageSwitcher />
          <Link
            href={getLocalizedPath('/profile', locale)}
            className={iconShell}
            aria-label={t('common.profile')}
          >
            <User className="h-6 w-6 text-green-600" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => logout()}
            className={iconShell}
            aria-label={t('common.logout')}
          >
            <LogOut className="h-6 w-6" aria-hidden="true" />
          </button>
        </>
      ) : (
        <>
          <LanguageSwitcher />
          <button
            type="button"
            onClick={handleLoginClick}
            className={iconShell}
            aria-label={t('common.login')}
          >
            <User className="h-5 w-5" aria-hidden="true" />
          </button>
        </>
      )}

      {/* Cart - last in LTR */}
      {!isRTL && (
        <Link
          href={getLocalizedPath('/cart', locale)}
          className={iconShell}
          aria-label={`${t('common.cart')} with ${isClient ? cartCount : 0} items`}
        >
          <ShoppingCart className={`h-6 w-6 transition-colors ${isClient && cartCount > 0 ? 'text-green-600' : ''}`} aria-hidden="true" />
          {isClient && cartCount > 0 && (
            <span className={`absolute ${badgePosition} bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center header-badge`} aria-hidden="true">
              {cartCount}
            </span>
          )}
        </Link>
      )}

    </div>
  )

  return (
    <div className={`hidden lg:flex items-center ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'} header-desktop-right`}>
      {isRTL ? (
        <>
          {icons}
          {contactInfo}
        </>
      ) : (
        <>
          {contactInfo}
          {icons}
        </>
      )}
    </div>
  )
}
