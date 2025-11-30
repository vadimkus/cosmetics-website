'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, User, Menu } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { useAuth } from './AuthProvider'
import { useFavorites } from './FavoritesProvider'
import LoginModal from './LoginModal'
import LanguageSwitcher from './LanguageSwitcher'
import InstallLink from './InstallLink'
import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

export default function HeaderRussianMobile() {
  const { getTotalItems } = useCartStore()
  const { user } = useAuth()
  const { favorites } = useFavorites()
  const { t } = useTranslation()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {/* Mobile Header for Russian */}
      <div className="md:hidden flex items-center gap-0.5 header-icons">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center"
          aria-label={showMobileMenu ? t('common.closeMobileMenu') : t('common.openMobileMenu')}
          aria-expanded={showMobileMenu}
        >
          <Menu className={`h-4 w-4 ${showMobileMenu ? 'text-green-600' : ''}`} aria-hidden="true" />
        </button>
        <LanguageSwitcher />
        {isClient && user ? (
          <Link 
            href={getLocalizedPath('/profile', 'ru')} 
            className="p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center"
            aria-label={t('common.profile')}
          >
            <User className="h-4 w-4 text-green-600" aria-hidden="true" />
          </Link>
        ) : (
          <button 
            onClick={() => setShowLoginModal(true)}
            className="p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center"
            aria-label={t('common.login')}
          >
            <User className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        <Link 
          href={getLocalizedPath('/favorites', 'ru')} 
          className="relative p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center"
          aria-label={`${t('common.favorites')} с ${isClient ? favorites.length : 0} товарами`}
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
          {isClient && favorites.length > 0 && (
            <span className="absolute top-0 right-0 bg-primary-600 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center header-badge" aria-hidden="true">
              {favorites.length}
            </span>
          )}
        </Link>
        <Link 
          href={getLocalizedPath('/cart', 'ru')} 
          className="relative p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center"
          aria-label={`${t('common.cart')} с ${isClient ? getTotalItems() : 0} товарами`}
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          {isClient && getTotalItems() > 0 && (
            <span className="absolute top-0 right-0 bg-primary-600 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center header-badge" aria-hidden="true">
              {getTotalItems()}
            </span>
          )}
        </Link>
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

      {/* Mobile Navigation Menu for Russian */}
      {showMobileMenu && (
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
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          isLoginMode={isLoginMode}
          setIsLoginMode={setIsLoginMode}
        />
      )}
    </>
  )
}

