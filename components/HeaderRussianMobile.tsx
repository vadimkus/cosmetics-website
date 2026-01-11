'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Menu } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { useAuth } from './AuthProvider'
import { useFavorites } from './FavoritesProvider'
import LanguageSwitcher from './LanguageSwitcher'
import InstallLink from './InstallLink'
import { AnimationToggle } from './AnimationToggle'
import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

interface HeaderRussianMobileProps {
  showMobileMenu: boolean
  setShowMobileMenu: (show: boolean) => void
}

export default function HeaderRussianMobile({ showMobileMenu, setShowMobileMenu }: HeaderRussianMobileProps) {
  const { getTotalItems } = useCartStore()
  const { favorites } = useFavorites()
  const { t } = useTranslation()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {/* Mobile Header for Russian */}
      {/* Note: User icon removed from mobile - accessible via hamburger menu */}
      <div className="md:hidden flex items-center gap-0.5 header-icons">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center"
          aria-label={showMobileMenu ? t('common.closeMobileMenu') : t('common.openMobileMenu')}
          aria-expanded={showMobileMenu}
        >
          <Menu className={`h-4 w-4 ${showMobileMenu ? 'text-green-600' : ''}`} aria-hidden="true" />
        </button>
        <div className="ml-2">
          <LanguageSwitcher />
        </div>
        <Link 
          href={getLocalizedPath('/favorites', 'ru')} 
          className="relative p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center ml-2"
          aria-label={`${t('common.favorites')} с ${isClient ? favorites.length : 0} товарами`}
        >
          <Heart className={`h-4 w-4 transition-colors ${isClient && favorites.length > 0 ? 'text-red-500' : ''}`} aria-hidden="true" />
          {isClient && favorites.length > 0 && (
            <span className="absolute top-0 right-0 bg-primary-600 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center header-badge" aria-hidden="true">
              {favorites.length}
            </span>
          )}
        </Link>
        <Link 
          href={getLocalizedPath('/cart', 'ru')} 
          className="relative p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center ml-2"
          aria-label={`${t('common.cart')} с ${isClient ? getTotalItems() : 0} товарами`}
        >
          <ShoppingCart className={`h-4 w-4 transition-colors ${isClient && getTotalItems() > 0 ? 'text-green-600' : ''}`} aria-hidden="true" />
          {isClient && getTotalItems() > 0 && (
            <span className="absolute top-0 right-0 bg-primary-600 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center header-badge" aria-hidden="true">
              {getTotalItems()}
            </span>
          )}
        </Link>
        <AnimationToggle size="sm" className="md:hidden" />
        <Link 
          href={getLocalizedPath('/products', 'ru')} 
          className="p-0.5 hover:opacity-80 transition-opacity flex items-center justify-center ml-[10%] md:ml-2"
          aria-label="Перейти к продукции"
        >
          <Image
            src="/Logo/upLOGO.png"
            alt="Логотип GENOSYS"
            width={180}
            height={54}
            className="w-[120px] h-auto"
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>
      </div>
    </>
  )
}

export function HeaderRussianMobileMenu({ showMobileMenu, setShowMobileMenu }: HeaderRussianMobileProps) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!showMobileMenu) return null

  return (
    <div className="md:hidden bg-white border-t" role="navigation" aria-label="Мобильная навигация">
      <div className="container mx-auto px-3 py-3">
        <nav className="grid grid-cols-3 gap-1">
          <Link 
            href={`${getLocalizedPath('/', 'ru')}?full=true`} 
            className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm font-medium touch-manipulation flex items-center"
            onClick={() => setShowMobileMenu(false)}
          >
            {t('navigation.home')}
          </Link>
          <Link 
            href={getLocalizedPath('/about', 'ru')} 
            className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
            onClick={() => setShowMobileMenu(false)}
          >
            {t('navigation.about')}
          </Link>
          <Link 
            href={getLocalizedPath('/brand', 'ru')} 
            className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
            onClick={() => setShowMobileMenu(false)}
          >
            {t('navigation.brand')}
          </Link>
          <Link 
            href={getLocalizedPath('/products', 'ru')} 
            className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
            onClick={() => setShowMobileMenu(false)}
          >
            {t('navigation.products')}
          </Link>
          {isClient && user && (
            <Link 
              href={getLocalizedPath('/training', 'ru')} 
              className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
              onClick={() => setShowMobileMenu(false)}
            >
              {t('navigation.training')}
            </Link>
          )}
          <Link 
            href={getLocalizedPath('/contact', 'ru')} 
            className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
            onClick={() => setShowMobileMenu(false)}
          >
            {t('navigation.contact')}
          </Link>
          <Link 
            href={getLocalizedPath('/delivery', 'ru')}
            className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
            onClick={() => setShowMobileMenu(false)}
          >
            {t('navigation.delivery')}
          </Link>
          <Link 
            href={getLocalizedPath('/faq', 'ru')}
            className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
            onClick={() => setShowMobileMenu(false)}
          >
            {t('navigation.faq')}
          </Link>
          <Link 
            href={getLocalizedPath('/blog', 'ru')}
            className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
            onClick={() => setShowMobileMenu(false)}
          >
            {t('navigation.blog')}
          </Link>
          <Link 
            href={getLocalizedPath('/locations', 'ru')}
            className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
            onClick={() => setShowMobileMenu(false)}
          >
            {t('navigation.locations')}
          </Link>
          <Link 
            href={getLocalizedPath('/partners', 'ru')}
            className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
            onClick={() => setShowMobileMenu(false)}
          >
            {t('navigation.partners')}
          </Link>
          <div className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center">
            <InstallLink 
              onClose={() => setShowMobileMenu(false)}
              className="w-full text-left text-gray-700 hover:text-primary-600 text-sm"
            />
          </div>
          {isClient && user && (
            <>
              <Link 
                href={getLocalizedPath('/profile', 'ru')} 
                className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('common.profile')}
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  )
}

