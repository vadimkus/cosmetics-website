'use client'

import Link from 'next/link'
import { ShoppingCart, Heart, User, LogOut, Menu } from 'lucide-react'
// import { useCart } from './CartProvider' // Unused for now
import { useCartStore } from '@/lib/cartStore'
import { useAuth } from './AuthProvider'
import { useFavorites } from './FavoritesProvider'
import LoginModal from './LoginModal'
import LanguageSwitcher from './LanguageSwitcher'
import { useState, useEffect, memo } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

const Header = memo(function Header() {
  const { getTotalItems } = useCartStore()
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()
  const { t, locale } = useTranslation()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isHeartBeating, setIsHeartBeating] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Heartbeat animation every 16 seconds
  useEffect(() => {
    if (!isClient) return

    const startHeartbeat = () => {
      setIsHeartBeating(true)
      // Stop the animation after 0.6 seconds (duration of one heartbeat)
      setTimeout(() => {
        setIsHeartBeating(false)
      }, 600)
    }

    // Start the first heartbeat immediately
    startHeartbeat()

    // Set up interval for every 16 seconds
    const interval = setInterval(startHeartbeat, 16000)

    return () => clearInterval(interval)
  }, [isClient])

  return (
    <header className="bg-white shadow-sm border-b" suppressHydrationWarning>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 header-main-flex">
          {/* Mobile Icons - Left Side */}
          <div className="md:hidden flex items-center gap-1 header-icons">
            {/* 1. Mobile Menu Button (Hamburger) */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center"
              aria-label={showMobileMenu ? t('common.closeMobileMenu') : t('common.openMobileMenu')}
              aria-expanded={showMobileMenu}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {/* 2. Language Switcher (EN) */}
            <LanguageSwitcher />
            
            {/* 3. Mobile User/Login Icon (Man) */}
            {isClient && user ? (
              <Link 
                href={getLocalizedPath('/profile', locale)} 
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center"
                aria-label={t('common.profile')}
              >
                <User className="h-5 w-5 text-green-600" aria-hidden="true" />
              </Link>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center"
                aria-label={t('common.login')}
              >
                <User className="h-5 w-5 text-green-600" aria-hidden="true" />
              </button>
            )}
            
            {/* 4. Mobile Favorites Icon (Heart) */}
            <Link 
              href={getLocalizedPath('/favorites', locale)} 
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center"
              aria-label={`${t('common.favorites')} with ${isClient ? favorites.length : 0} items`}
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
              {isClient && favorites.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center header-badge" aria-hidden="true">
                  {favorites.length}
                </span>
              )}
            </Link>
            
            {/* 5. Mobile Cart Icon */}
            <Link 
              href={getLocalizedPath('/cart', locale)} 
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center"
              aria-label={`${t('common.cart')} with ${isClient ? getTotalItems() : 0} items`}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {isClient && getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center header-badge" aria-hidden="true">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
          
          {/* Desktop Left Side */}
          <div className="hidden md:flex flex-col">
            <span className="text-lg md:text-2xl font-bold text-primary-600">
              Genosys Middle East FZ-LLC
            </span>
            <div className="flex text-sm text-gray-600 items-center gap-1 ml-0 md:ml-40 header-margin">
              {t('common.uae')}
              <Heart className={`h-3 w-3 text-primary-600 fill-current transition-transform duration-300 ${
                isHeartBeating ? 'animate-pulse' : ''
              }`} 
                     style={isHeartBeating ? {
                       animation: 'heartbeat 0.6s ease-in-out'
                     } : {}} />
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
            <Link href={getLocalizedPath('/', locale)} className="text-gray-700 hover:text-primary-600 transition-colors">
              {t('navigation.home')}
            </Link>
            <Link href={getLocalizedPath('/about', locale)} className="text-gray-700 hover:text-primary-600 transition-colors">
              {t('navigation.about')}
            </Link>
            <Link href={getLocalizedPath('/brand', locale)} className="text-gray-700 hover:text-primary-600 transition-colors">
              {t('navigation.brand')}
            </Link>
            <Link href={getLocalizedPath('/products', locale)} className="text-gray-700 hover:text-primary-600 transition-colors">
              {t('navigation.products')}
            </Link>
            {isClient && user && (
              <Link href={getLocalizedPath('/training', locale)} className="text-gray-700 hover:text-primary-600 transition-colors">
                {t('navigation.training')}
              </Link>
            )}
            <Link href={getLocalizedPath('/contact', locale)} className="text-gray-700 hover:text-primary-600 transition-colors">
              {t('navigation.contact')}
            </Link>
            <Link href={getLocalizedPath('/delivery', locale)} className="text-gray-700 hover:text-primary-600 transition-colors">
              {t('navigation.delivery')}
            </Link>
          </nav>
          
          <div className="hidden lg:flex items-center space-x-6 header-desktop-right">
            <div className="flex flex-col items-end text-right header-contact">
              <div className="text-sm text-gray-600">
                {t('footer.officialDistributor')}
              </div>
              <a 
                href="https://wa.me/971585487665" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1 header-contact-link"
              >
                +971 58 548 76 65 📱
              </a>
              <a 
                href="mailto:sales@genosys.ae"
                className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                sales@genosys.ae
              </a>
            </div>
            
            <div className="flex items-center space-x-4 header-icons">
              {isClient && user ? (
                <>
                  <Link 
                    href={getLocalizedPath('/profile', locale)} 
                    className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                    aria-label={t('common.profile')}
                  >
                    <User className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </Link>
                  <LanguageSwitcher />
                  <button 
                    onClick={logout}
                    className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                    aria-label={t('common.logout')}
                  >
                    <LogOut className="h-6 w-6" aria-hidden="true" />
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="p-2 text-gray-700 hover:text-primary-600 transition-colors flex items-center gap-2 touch-manipulation"
                    aria-label={t('common.login')}
                  >
                    <User className="h-5 w-5 text-green-600" aria-hidden="true" />
                    <span className="text-sm font-medium hidden sm:inline">{t('common.login')}</span>
                  </button>
                  <LanguageSwitcher />
                </>
              )}
              
              <Link 
                href={getLocalizedPath('/favorites', locale)} 
                className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={`${t('common.favorites')} with ${isClient ? favorites.length : 0} items`}
              >
                <Heart className="h-6 w-6" aria-hidden="true" />
                {isClient && favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center header-badge" aria-hidden="true">
                    {favorites.length}
                  </span>
                )}
              </Link>
              
              <Link 
                href={getLocalizedPath('/cart', locale)} 
                className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={`${t('common.cart')} with ${isClient ? getTotalItems() : 0} items`}
              >
                <ShoppingCart className="h-6 w-6" aria-hidden="true" />
                {isClient && getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center header-badge" aria-hidden="true">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t" role="navigation" aria-label="Mobile navigation">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
            <Link 
              href={getLocalizedPath('/', locale)} 
              className="text-gray-700 hover:text-primary-600 transition-colors py-3 border-b border-gray-100 font-semibold touch-manipulation min-h-[44px] flex items-center"
              onClick={() => setShowMobileMenu(false)}
            >
              {t('navigation.home')}
            </Link>
            <Link 
              href={getLocalizedPath('/about', locale)} 
              className="text-gray-700 hover:text-primary-600 transition-colors py-3 border-b border-gray-100 touch-manipulation min-h-[44px] flex items-center"
              onClick={() => setShowMobileMenu(false)}
            >
              {t('navigation.about')}
            </Link>
            <Link 
              href={getLocalizedPath('/brand', locale)} 
              className="text-gray-700 hover:text-primary-600 transition-colors py-3 border-b border-gray-100 touch-manipulation min-h-[44px] flex items-center"
              onClick={() => setShowMobileMenu(false)}
            >
              {t('navigation.brand')}
            </Link>
            <Link 
              href={getLocalizedPath('/products', locale)} 
              className="text-gray-700 hover:text-primary-600 transition-colors py-3 border-b border-gray-100 touch-manipulation min-h-[44px] flex items-center"
              onClick={() => setShowMobileMenu(false)}
            >
              {t('navigation.products')}
            </Link>
            {isClient && user && (
              <Link 
                href={getLocalizedPath('/training', locale)} 
                className="text-gray-700 hover:text-primary-600 transition-colors py-3 border-b border-gray-100 touch-manipulation min-h-[44px] flex items-center"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('navigation.training')}
              </Link>
            )}
            <Link 
              href={getLocalizedPath('/contact', locale)} 
              className="text-gray-700 hover:text-primary-600 transition-colors py-3 border-b border-gray-100 touch-manipulation min-h-[44px] flex items-center"
              onClick={() => setShowMobileMenu(false)}
            >
              {t('navigation.contact')}
            </Link>
            <Link 
              href={getLocalizedPath('/delivery', locale)}
              className="text-gray-700 hover:text-primary-600 transition-colors py-3 border-b border-gray-100 touch-manipulation min-h-[44px] flex items-center"
              onClick={() => setShowMobileMenu(false)}
            >
              {t('navigation.delivery')}
            </Link>
            <div className="py-3 border-b border-gray-100 min-h-[44px] flex items-center">
              <LanguageSwitcher />
            </div>
              
              {/* Mobile Login/Profile Section */}
              <div className="pt-4 border-t border-gray-200">
                {isClient && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-600">{user.email}</div>
                      </div>
                    </div>
                    <Link 
                      href={getLocalizedPath('/profile', locale)} 
                      className="block text-gray-700 hover:text-primary-600 transition-colors py-3 border-b border-gray-100 touch-manipulation min-h-[44px] flex items-center"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {t('common.profile')}
                    </Link>
                    <button 
                      onClick={() => {
                        logout()
                        setShowMobileMenu(false)
                      }}
                      className="block w-full text-left text-gray-700 hover:text-primary-600 transition-colors py-3 touch-manipulation min-h-[44px] flex items-center header-mobile-link"
                    >
                      {t('common.logout')}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setShowLoginModal(true)
                      setShowMobileMenu(false)
                    }}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 touch-manipulation min-h-[44px]"
                  >
                    <User className="h-5 w-5" />
                    {t('common.login')} / {t('common.register')}
                  </button>
                )}
              </div>

              {/* Mobile Contact Info */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">
                  {t('footer.officialDistributor')}
                </div>
                <a 
                  href="https://wa.me/971585487665" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1 mb-2"
                >
                  +971 58 548 76 65 📱
                </a>
                <a 
                  href="mailto:sales@genosys.ae"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  sales@genosys.ae
                </a>
              </div>
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
    </header>
  )
})

export default Header
