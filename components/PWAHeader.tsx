'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, Heart, ChevronDown, X } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { useFavorites } from './FavoritesProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { getLocalizedPath } from '@/lib/i18n'
import { AnimationToggle } from './AnimationToggle'
import InstallLink from './InstallLink'

/**
 * PWA Header - Matches mobile app design
 * 
 * Only shows in PWA/standalone mode on mobile.
 * Layout:
 * - Left: Language switcher + Animation toggle + Hamburger menu
 * - Center: Logo + Heart (favorites)
 * - Right: User avatar
 */
export default function PWAHeader() {
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()
  const { t, locale, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const router = useRouter()
  const pathname = usePathname()
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  // Check if we're on profile page
  const isOnProfilePage = pathname?.includes('/profile')
  
  // Handle profile button click - toggle behavior
  const handleProfileClick = () => {
    if (isOnProfilePage) {
      // Go back to previous page
      router.back()
    } else {
      // Navigate to profile
      router.push(getLocalizedPath('/profile', locale))
    }
  }
  
  // Close menu on route change
  useEffect(() => {
    setShowMobileMenu(false)
  }, [pathname])
  
  // Only render in PWA mode on mobile
  if (!isClient || !isPWA) {
    return null
  }
  
  const isRTL = dir === 'rtl'
  const favoritesCount = favorites?.length || 0
  
  // Get user initial for avatar
  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || 'G'
  
  return (
    <>
      {/* Fixed PWA Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 bg-white md:hidden"
        style={{ 
          paddingTop: 'env(safe-area-inset-top, 0px)',
          borderBottom: '0.5px solid rgba(0, 0, 0, 0.12)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}
        dir={dir}
      >
        <div className={`flex items-center justify-between h-14 px-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Left Side: Hamburger + Language + Animation Toggle */}
          <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Hamburger Menu (first) */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-1.5 text-gray-700 hover:text-gray-900"
              aria-label={showMobileMenu ? t('common.closeMobileMenu') : t('common.openMobileMenu')}
              aria-expanded={showMobileMenu}
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 text-green-600" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            
            {/* Language Switcher (second) */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-0.5 text-green-600 font-semibold text-sm px-1 py-0.5"
              >
                <span>{locale.toUpperCase()}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Language Dropdown */}
              {showLangMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowLangMenu(false)}
                  />
                  <div className={`absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 min-w-[100px] ${isRTL ? 'right-0' : 'left-0'}`}>
                    <Link
                      href={getLocalizedPath('/', 'en')}
                      className={`block px-4 py-2.5 text-sm hover:bg-gray-50 ${locale === 'en' ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-700'}`}
                      onClick={() => setShowLangMenu(false)}
                    >
                      English
                    </Link>
                    <Link
                      href={getLocalizedPath('/', 'ru')}
                      className={`block px-4 py-2.5 text-sm hover:bg-gray-50 ${locale === 'ru' ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-700'}`}
                      onClick={() => setShowLangMenu(false)}
                    >
                      Русский
                    </Link>
                    <Link
                      href={getLocalizedPath('/', 'ar')}
                      className={`block px-4 py-2.5 text-sm hover:bg-gray-50 ${locale === 'ar' ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-700'}`}
                      onClick={() => setShowLangMenu(false)}
                    >
                      العربية
                    </Link>
                  </div>
                </>
              )}
            </div>
            
            {/* Animation Toggle (two vertical bars) */}
            <AnimationToggle size="sm" className="text-gray-800" />
          </div>
          
          {/* Center: Logo + Heart */}
          <div className={`flex items-center gap-0.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href={getLocalizedPath('/products', locale)} className="flex items-center">
              <Image
                src="/Logo/upLOGO.png"
                alt="GENOSYS"
                width={260}
                height={75}
                className="h-[50px] w-auto"
                priority
              />
            </Link>
            
            {/* Favorites Heart */}
            <Link 
              href={getLocalizedPath('/favorites', locale)}
              className="relative p-1"
            >
              <Heart 
                className={`w-6 h-6 text-red-600 transition-all ${favoritesCount > 0 ? 'fill-red-600' : ''}`}
              />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-1 bg-red-600 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center border-2 border-white">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </Link>
          </div>
          
          {/* Right Side: User Avatar - Toggle behavior */}
          <button 
            onClick={handleProfileClick}
            className="flex items-center p-1 -m-1 touch-manipulation active:scale-95 transition-transform"
            aria-label={isOnProfilePage ? 'Go back' : 'Open profile'}
          >
            {user ? (
              <div className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isOnProfilePage ? 'bg-gray-600' : 'bg-red-600'}`}>
                <span className="text-white text-sm font-semibold">
                  {userInitial.toUpperCase()}
                </span>
                {/* Online indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
            ) : (
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isOnProfilePage ? 'bg-gray-200' : 'bg-gray-100'}`}>
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </button>
        </div>
        
        {/* Subtitle */}
        <div className="text-center pb-1.5">
          <p className="text-[10px] text-gray-500 tracking-wide font-medium">
            {locale === 'ar' ? 'العناية بالبشرة الفاخرة والجمال' : locale === 'ru' ? 'Премиальный уход за кожей и красота' : 'Premium Skincare & Beauty'}
          </p>
        </div>
      </header>

      {/* Mobile Menu (Slide-down) */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 80px)' }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30" 
            onClick={() => setShowMobileMenu(false)}
          />
          
          {/* Menu Content */}
          <div 
            className={`relative bg-white border-b shadow-lg max-h-[70vh] overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}
            dir={dir}
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="grid grid-cols-2 gap-2">
                <Link 
                  href={`${getLocalizedPath('/', locale)}?full=true`} 
                  className="text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg text-sm font-medium flex items-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.home')}
                </Link>
                <Link 
                  href={getLocalizedPath('/products', locale)} 
                  className="text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg text-sm font-medium flex items-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.products')}
                </Link>
                <Link 
                  href={getLocalizedPath('/about', locale)} 
                  className="text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg text-sm flex items-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.about')}
                </Link>
                <Link 
                  href={getLocalizedPath('/brand', locale)} 
                  className="text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg text-sm flex items-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.brand')}
                </Link>
                {user && (
                  <Link 
                    href={getLocalizedPath('/training', locale)} 
                    className="text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg text-sm flex items-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t('navigation.training')}
                  </Link>
                )}
                <Link 
                  href={getLocalizedPath('/contact', locale)} 
                  className="text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg text-sm flex items-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.contact')}
                </Link>
                <Link 
                  href={getLocalizedPath('/delivery', locale)}
                  className="text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg text-sm flex items-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.delivery')}
                </Link>
                <Link 
                  href={getLocalizedPath('/faq', locale)}
                  className="text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg text-sm flex items-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.faq')}
                </Link>
                <Link 
                  href={getLocalizedPath('/blog', locale)}
                  className="text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg text-sm flex items-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.blog')}
                </Link>
                <Link 
                  href={getLocalizedPath('/locations', locale)}
                  className="text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg text-sm flex items-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.locations')}
                </Link>
                <Link 
                  href={getLocalizedPath('/partners', locale)}
                  className="text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg text-sm flex items-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.partners')}
                </Link>
                <Link 
                  href={getLocalizedPath('/orders', locale)}
                  className="text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg text-sm flex items-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.orders') || 'Orders'}
                </Link>
                <div className="py-3 px-4 rounded-lg text-sm flex items-center">
                  <InstallLink 
                    onClose={() => setShowMobileMenu(false)}
                    className="w-full text-left text-gray-700 hover:text-green-600 text-sm"
                  />
                </div>
                {user ? (
                  <>
                    <Link 
                      href={getLocalizedPath('/profile', locale)} 
                      className="text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg text-sm flex items-center"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {t('common.profile')}
                    </Link>
                    <button 
                      onClick={() => {
                        logout()
                        setShowMobileMenu(false)
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors py-3 px-4 rounded-lg text-sm font-medium flex items-center text-left"
                    >
                      {t('common.logout')}
                    </button>
                  </>
                ) : (
                  <Link 
                    href={getLocalizedPath('/login', locale)} 
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors py-3 px-4 rounded-lg text-sm font-medium flex items-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t('common.login')}
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from being hidden behind fixed header */}
      <div 
        className="md:hidden" 
        style={{ height: 'calc(env(safe-area-inset-top, 0px) + 80px)' }}
        aria-hidden="true" 
      />
    </>
  )
}
