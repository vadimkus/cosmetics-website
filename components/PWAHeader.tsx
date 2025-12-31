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

      {/* Mobile Menu (Slide-down) - Professional Design */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 56px)' }}
        >
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setShowMobileMenu(false)}
          />
          
          {/* Menu Content - Slide from top */}
          <div 
            className={`relative bg-white rounded-b-2xl shadow-2xl max-h-[75vh] overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}
            dir={dir}
            style={{ 
              animation: 'slideDown 0.2s ease-out',
            }}
          >
            {/* User Section */}
            {user && (
              <div className={`px-5 py-4 bg-gradient-to-r from-red-50 to-red-100 border-b border-red-100 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {userInitial.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{user.name || user.email?.split('@')[0]}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="px-3 py-3">
              {/* Main Navigation */}
              <div className="space-y-1">
                <Link 
                  href={getLocalizedPath('/products', locale)} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-gray-800 hover:bg-gray-100 active:bg-gray-200 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-lg">🛍️</span>
                  <span className="font-medium">{t('navigation.products')}</span>
                </Link>
                
                <Link 
                  href={getLocalizedPath('/orders', locale)} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-gray-800 hover:bg-gray-100 active:bg-gray-200 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-lg">📦</span>
                  <span className="font-medium">{t('navigation.orders') || 'My Orders'}</span>
                </Link>

                <Link 
                  href={getLocalizedPath('/favorites', locale)} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-gray-800 hover:bg-gray-100 active:bg-gray-200 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-lg">❤️</span>
                  <span className="font-medium">{t('navigation.favorites') || 'Favorites'}</span>
                  {favoritesCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{favoritesCount}</span>
                  )}
                </Link>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200 my-3 mx-2" />

              {/* Secondary Navigation */}
              <div className="space-y-1">
                <Link 
                  href={`${getLocalizedPath('/', locale)}?full=true`} 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-base">🏠</span>
                  <span className="text-sm">{t('navigation.home')}</span>
                </Link>

                <Link 
                  href={getLocalizedPath('/about', locale)} 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-base">ℹ️</span>
                  <span className="text-sm">{t('navigation.about')}</span>
                </Link>

                <Link 
                  href={getLocalizedPath('/brand', locale)} 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-base">✨</span>
                  <span className="text-sm">{t('navigation.brand')}</span>
                </Link>

                <Link 
                  href={getLocalizedPath('/delivery', locale)} 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-base">🚚</span>
                  <span className="text-sm">{t('navigation.delivery')}</span>
                </Link>

                <Link 
                  href={getLocalizedPath('/contact', locale)} 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-base">📞</span>
                  <span className="text-sm">{t('navigation.contact')}</span>
                </Link>

                <Link 
                  href={getLocalizedPath('/faq', locale)} 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-base">❓</span>
                  <span className="text-sm">{t('navigation.faq')}</span>
                </Link>

                <Link 
                  href={getLocalizedPath('/locations', locale)} 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-base">📍</span>
                  <span className="text-sm">{t('navigation.locations')}</span>
                </Link>

                {user && (
                  <Link 
                    href={getLocalizedPath('/training', locale)} 
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <span className="text-base">🎓</span>
                    <span className="text-sm">{t('navigation.training')}</span>
                  </Link>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200 my-3 mx-2" />

              {/* Account Actions */}
              <div className="space-y-1">
                {user ? (
                  <>
                    <Link 
                      href={getLocalizedPath('/profile', locale)} 
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <span className="text-base">👤</span>
                      <span className="text-sm">{t('common.profile')}</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setShowMobileMenu(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <span className="text-base">🚪</span>
                      <span className="text-sm font-medium">{t('common.logout')}</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    href={getLocalizedPath('/login', locale)} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <span className="text-base">🔐</span>
                    <span className="font-medium">{t('common.login')}</span>
                  </Link>
                )}
              </div>
            </nav>

            {/* Bottom Safe Area */}
            <div className="h-4" />
          </div>
        </div>
      )}
      
      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Spacer to prevent content from being hidden behind fixed header */}
      <div 
        className="md:hidden" 
        style={{ height: 'calc(env(safe-area-inset-top, 0px) + 80px)' }}
        aria-hidden="true" 
      />
    </>
  )
}
