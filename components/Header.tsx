'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, User, LogOut, Menu } from 'lucide-react'
// import { useCart } from './CartProvider' // Unused for now
import { useCartStore } from '@/lib/cartStore'
import { useAuth } from './AuthProvider'
import { useFavorites } from './FavoritesProvider'
import LoginModal from './LoginModal'
import LanguageSwitcher from './LanguageSwitcher'
import InstallLink from './InstallLink'
import { AnimationToggle } from './AnimationToggle'
import HeaderRussianMobile, { HeaderRussianMobileMenu } from './HeaderRussianMobile'
import HeaderRussianDesktop from './HeaderRussianDesktop'
import { useState, useEffect, memo } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { usePathname } from 'next/navigation'

const Header = memo(function Header() {
  const { getTotalItems } = useCartStore()
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()
  const { t, locale } = useTranslation()
  const { isPWA, isClient: isPWAClient } = usePWAMode()
  const pathname = usePathname()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isHeartBeating, setIsHeartBeating] = useState(false)
  
  // Check if we're on pages that have their own simple/light header in PWA mode
  const isProductDetailPage = pathname ? /\/products\/[a-zA-Z0-9_-]+$/.test(pathname) : false
  const isOnPWALightHeaderPage = pathname?.includes('/profile') || 
                                  pathname?.includes('/cart') || 
                                  pathname?.includes('/checkout') ||
                                  pathname?.includes('/orders') ||
                                  pathname?.includes('/privacy-policy') ||
                                  pathname?.includes('/terms') ||
                                  pathname?.includes('/faq') ||
                                  pathname?.includes('/contact') ||
                                  pathname?.includes('/about') ||
                                  isProductDetailPage
  
  // In PWA mode, hide header completely on pages with their own light header
  // On other pages, just switch to PWAHeader for mobile
  const showPWAMobileHeader = isPWAClient && isPWA
  const hidePWAHeader = isPWAClient && isPWA && isOnPWALightHeaderPage

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

  // Hide header completely on PWA pages with their own light header
  if (hidePWAHeader) {
    return null
  }
  
  return (
    <header className={`sticky top-0 z-50 bg-white shadow-sm border-b ${showPWAMobileHeader ? 'hidden md:block' : ''}`} suppressHydrationWarning>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 md:py-4 header-main-flex">
          {/* Mobile Icons - Russian Version (hidden in PWA mode) */}
          {locale === 'ru' && !showPWAMobileHeader && (
            <HeaderRussianMobile 
              showMobileMenu={showMobileMenu}
              setShowMobileMenu={setShowMobileMenu}
            />
          )}
          
          {/* Mobile Icons - English Version (LTR): hamburger, EN, man, heart, cart (hidden in PWA mode) */}
          {locale !== 'ar' && locale !== 'ru' && !showPWAMobileHeader && (
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
              {isClient && user ? (
                <Link 
                  href={getLocalizedPath('/profile', locale)} 
                  className="p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center ml-2"
                  aria-label={t('common.profile')}
                >
                  <User className="h-4 w-4 text-green-600" aria-hidden="true" />
                </Link>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center ml-2"
                  aria-label={t('common.login')}
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
              <Link 
                href={getLocalizedPath('/favorites', locale)} 
                className="relative p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center ml-2"
                aria-label={`${t('common.favorites')} with ${isClient ? favorites.length : 0} items`}
              >
                <Heart className={`h-4 w-4 transition-colors ${isClient && favorites.length > 0 ? 'text-red-500' : ''}`} aria-hidden="true" />
                {isClient && favorites.length > 0 && (
                  <span className="absolute top-0 right-0 bg-primary-600 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center header-badge" aria-hidden="true">
                    {favorites.length}
                  </span>
                )}
              </Link>
              {/* Hide cart icon on mobile in PWA mode (using footer nav instead) */}
              {!isPWA && (
                <Link 
                  href={getLocalizedPath('/cart', locale)} 
                  className="relative p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center ml-2"
                  aria-label={`${t('common.cart')} with ${isClient ? getTotalItems() : 0} items`}
                >
                  <ShoppingCart className={`h-4 w-4 transition-colors ${isClient && getTotalItems() > 0 ? 'text-green-600' : ''}`} aria-hidden="true" />
                  {isClient && getTotalItems() > 0 && (
                    <span className="absolute top-0 right-0 bg-primary-600 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center header-badge" aria-hidden="true">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              )}
              <AnimationToggle size="sm" className="md:hidden" />
              <Link 
                href={getLocalizedPath('/products', locale)} 
                className="p-0.5 hover:opacity-80 transition-opacity flex items-center justify-center ml-[10%] md:ml-2"
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
            </div>
          )}

          {/* Mobile Icons - Arabic Version (RTL): cart, heart, man, AR, hamburger - positioned on right (hidden in PWA mode) */}
          {locale === 'ar' && !showPWAMobileHeader && (
            <div className="md:hidden flex items-center gap-0.5 header-icons ml-auto">
              <Link 
                href={getLocalizedPath('/products', locale)} 
                className="p-0.5 hover:opacity-80 transition-opacity flex items-center justify-center mr-[10%] md:mr-2"
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
              {/* Hide cart icon on mobile in PWA mode (using footer nav instead) */}
              {!isPWA && (
                <Link 
                  href={getLocalizedPath('/cart', locale)} 
                  className="relative p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center mr-2"
                  aria-label={`${t('common.cart')} with ${isClient ? getTotalItems() : 0} items`}
                >
                  <ShoppingCart className={`h-4 w-4 transition-colors ${isClient && getTotalItems() > 0 ? 'text-green-600' : ''}`} aria-hidden="true" />
                  {isClient && getTotalItems() > 0 && (
                    <span className="absolute top-0 right-0 bg-primary-600 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center header-badge" aria-hidden="true">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              )}
              <AnimationToggle size="sm" className="md:hidden mr-2" />
              <Link 
                href={getLocalizedPath('/favorites', locale)} 
                className="relative p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center mr-2"
                aria-label={`${t('common.favorites')} with ${isClient ? favorites.length : 0} items`}
              >
                <Heart className={`h-4 w-4 transition-colors ${isClient && favorites.length > 0 ? 'text-red-500' : ''}`} aria-hidden="true" />
                {isClient && favorites.length > 0 && (
                  <span className="absolute top-0 right-0 bg-primary-600 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center header-badge" aria-hidden="true">
                    {favorites.length}
                  </span>
                )}
              </Link>
              {isClient && user ? (
                <Link 
                  href={getLocalizedPath('/profile', locale)} 
                  className="p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center mr-2"
                  aria-label={t('common.profile')}
                >
                  <User className="h-4 w-4 text-green-600" aria-hidden="true" />
                </Link>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center mr-2"
                  aria-label={t('common.login')}
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
              <div className="mr-2">
                <LanguageSwitcher />
              </div>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-1.5 text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-center"
                aria-label={showMobileMenu ? t('common.closeMobileMenu') : t('common.openMobileMenu')}
                aria-expanded={showMobileMenu}
              >
                <Menu className={`h-4 w-4 ${showMobileMenu ? 'text-green-600' : ''}`} aria-hidden="true" />
              </button>
            </div>
          )}
          
          {/* Desktop Header - Russian Version */}
          {locale === 'ru' && (
            <HeaderRussianDesktop />
          )}
          
          {/* Desktop Header - English Version (LTR) */}
          {locale !== 'ar' && locale !== 'ru' && (
            <>
              {/* Desktop Left Side */}
              <div className="hidden md:flex flex-col">
                <span className="text-lg md:text-2xl font-bold text-primary-600">
                  Genosys Middle East FZ-LLC
                </span>
                <div className="flex text-sm text-gray-600 items-center gap-1 ml-0 md:ml-28 header-margin">
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
                      <LanguageSwitcher />
                      <Link 
                        href={getLocalizedPath('/profile', locale)} 
                        className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                        aria-label={t('common.profile')}
                      >
                        <User className="h-6 w-6 text-green-600" aria-hidden="true" />
                      </Link>
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
                      <LanguageSwitcher />
                      <button 
                        onClick={() => setShowLoginModal(true)}
                        className="p-2 text-gray-700 hover:text-primary-600 transition-colors touch-manipulation"
                        aria-label={t('common.login')}
                      >
                        <User className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </>
                  )}
                  
                  <Link 
                    href={getLocalizedPath('/favorites', locale)} 
                    className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={`${t('common.favorites')} with ${isClient ? favorites.length : 0} items`}
                  >
                    <Heart className={`h-6 w-6 transition-colors ${isClient && favorites.length > 0 ? 'text-red-500' : ''}`} aria-hidden="true" />
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
                    <ShoppingCart className={`h-6 w-6 transition-colors ${isClient && getTotalItems() > 0 ? 'text-green-600' : ''}`} aria-hidden="true" />
                    {isClient && getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center header-badge" aria-hidden="true">
                        {getTotalItems()}
                      </span>
                    )}
                  </Link>
                  <AnimationToggle size="lg" className="hidden lg:flex" />
                </div>
              </div>
            </>
          )}

          {/* Desktop Header - Arabic Version (RTL) */}
          {locale === 'ar' && (
            <>
              {/* Desktop Right Side (appears on left for RTL) - Icons */}
              <div className="hidden lg:flex items-center space-x-reverse space-x-6 header-desktop-right">
                <div className="flex items-center space-x-reverse space-x-4 header-icons">
                  <Link 
                    href={getLocalizedPath('/cart', locale)} 
                    className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={`${t('common.cart')} with ${isClient ? getTotalItems() : 0} items`}
                  >
                    <ShoppingCart className={`h-6 w-6 transition-colors ${isClient && getTotalItems() > 0 ? 'text-green-600' : ''}`} aria-hidden="true" />
                    {isClient && getTotalItems() > 0 && (
                      <span className="absolute -top-1 -left-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center header-badge" aria-hidden="true">
                        {getTotalItems()}
                      </span>
                    )}
                  </Link>
                  <AnimationToggle size="lg" className="hidden lg:flex" />
                  
                  <Link 
                    href={getLocalizedPath('/favorites', locale)} 
                    className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={`${t('common.favorites')} with ${isClient ? favorites.length : 0} items`}
                  >
                    <Heart className={`h-6 w-6 transition-colors ${isClient && favorites.length > 0 ? 'text-red-500' : ''}`} aria-hidden="true" />
                    {isClient && favorites.length > 0 && (
                      <span className="absolute -top-1 -left-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center header-badge" aria-hidden="true">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                  
                  {isClient && user ? (
                    <>
                      <LanguageSwitcher />
                      <Link 
                        href={getLocalizedPath('/profile', locale)} 
                        className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                        aria-label={t('common.profile')}
                      >
                        <User className="h-6 w-6 text-green-600" aria-hidden="true" />
                      </Link>
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
                      <LanguageSwitcher />
                      <button 
                        onClick={() => setShowLoginModal(true)}
                        className="p-2 text-gray-700 hover:text-primary-600 transition-colors touch-manipulation"
                        aria-label={t('common.login')}
                      >
                        <User className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>
                
                <div className="flex flex-col items-start text-left header-contact">
                  <div className="text-sm text-gray-600">
                    {t('footer.officialDistributor')}
                  </div>
                  <a 
                    href="https://wa.me/971585487665" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1 header-contact-link"
                  >
                    📱 +971 58 548 76 65
                  </a>
                  <a 
                    href="mailto:sales@genosys.ae"
                    className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    sales@genosys.ae
                  </a>
                </div>
              </div>
              
              {/* Desktop Navigation - RTL */}
              <nav className="hidden md:flex space-x-reverse space-x-8" role="navigation" aria-label="Main navigation">
                <Link href={getLocalizedPath('/delivery', locale)} className="text-gray-700 hover:text-primary-600 transition-colors">
                  {t('navigation.delivery')}
                </Link>
                <Link href={getLocalizedPath('/contact', locale)} className="text-gray-700 hover:text-primary-600 transition-colors">
                  {t('navigation.contact')}
                </Link>
                {isClient && user && (
                  <Link href={getLocalizedPath('/training', locale)} className="text-gray-700 hover:text-primary-600 transition-colors">
                    {t('navigation.training')}
                  </Link>
                )}
                <Link href={getLocalizedPath('/products', locale)} className="text-gray-700 hover:text-primary-600 transition-colors">
                  {t('navigation.products')}
                </Link>
                <Link href={getLocalizedPath('/brand', locale)} className="text-gray-700 hover:text-primary-600 transition-colors">
                  {t('navigation.brand')}
                </Link>
                <Link href={getLocalizedPath('/about', locale)} className="text-gray-700 hover:text-primary-600 transition-colors">
                  {t('navigation.about')}
                </Link>
                <Link href={getLocalizedPath('/', locale)} className="text-gray-700 hover:text-primary-600 transition-colors">
                  {t('navigation.home')}
                </Link>
              </nav>
              
              {/* Desktop Left Side (appears on right for RTL) - Logo */}
              <div className="hidden md:flex flex-col items-end">
                <span className="text-lg md:text-2xl font-bold text-primary-600">
                  Genosys Middle East FZ-LLC
                </span>
                <div className="flex text-sm text-gray-600 items-center gap-1 mr-0 md:mr-40 header-margin">
                  <Heart className={`h-3 w-3 text-primary-600 fill-current transition-transform duration-300 ${
                    isHeartBeating ? 'animate-pulse' : ''
                  }`} 
                         style={isHeartBeating ? {
                           animation: 'heartbeat 0.6s ease-in-out'
                         } : {}} />
                  {t('common.uae')}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu - Russian Version */}
      {locale === 'ru' && (
        <HeaderRussianMobileMenu 
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />
      )}

      {/* Mobile Navigation Menu - Exclude Russian (handled by HeaderRussianMobileMenu) */}
      {showMobileMenu && locale !== 'ru' && (
        <div className="md:hidden bg-white border-t" role="navigation" aria-label="Mobile navigation">
          <div className="container mx-auto px-3 py-3">
            <nav className="grid grid-cols-3 gap-1">
              <Link 
                href={`${getLocalizedPath('/', locale)}?full=true`} 
                className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm font-medium touch-manipulation flex items-center"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('navigation.home')}
              </Link>
              <Link 
                href={getLocalizedPath('/about', locale)} 
                className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('navigation.about')}
              </Link>
              <Link 
                href={getLocalizedPath('/brand', locale)} 
                className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('navigation.brand')}
              </Link>
              <Link 
                href={getLocalizedPath('/products', locale)} 
                className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('navigation.products')}
              </Link>
              {isClient && user && (
                <Link 
                  href={getLocalizedPath('/training', locale)} 
                  className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.training')}
                </Link>
              )}
              <Link 
                href={getLocalizedPath('/contact', locale)} 
                className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('navigation.contact')}
              </Link>
              <Link 
                href={getLocalizedPath('/delivery', locale)}
                className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('navigation.delivery')}
              </Link>
              <Link 
                href={getLocalizedPath('/faq', locale)}
                className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('navigation.faq')}
              </Link>
              <Link 
                href={getLocalizedPath('/blog', locale)}
                className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('navigation.blog')}
              </Link>
              <Link 
                href={getLocalizedPath('/locations', locale)}
                className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('navigation.locations')}
              </Link>
              <Link 
                href={getLocalizedPath('/partners', locale)}
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
                    href={getLocalizedPath('/profile', locale)} 
                    className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t('common.profile')}
                  </Link>
                  <button 
                    onClick={() => {
                      logout()
                      setShowMobileMenu(false)
                    }}
                    className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center text-left"
                  >
                    {t('common.logout')}
                  </button>
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
    </header>
  )
})

export default Header
