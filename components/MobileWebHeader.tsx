'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, Heart, ChevronDown, X } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { useFavorites } from './FavoritesProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { getLocalizedPath } from '@/lib/i18n'

/**
 * Mobile Web Header - PWA-like design for mobile web (non-PWA)
 * 
 * Only shows in mobile web mode (not PWA, not desktop).
 * Layout:
 * - Left: Hamburger menu + Language switcher
 * - Center: Logo + Heart (favorites)
 * - Right: User avatar
 */
export default function MobileWebHeader() {
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()
  const { t, locale, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const router = useRouter()
  const pathname = usePathname()
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const lastClickTime = useRef(0)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  
  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Check if we're on profile page
  const isOnProfilePage = pathname?.includes('/profile')
  
  // Check if we're on pages that have their own simple header or clean design
  const isProductDetailPage = pathname ? /\/products\/[a-zA-Z0-9_-]+$/.test(pathname) : false
  const isLoginPage = pathname === '/login' || pathname === '/ru/login' || pathname === '/ar/login' || pathname?.endsWith('/login')
  const isOnSimpleHeaderPage = pathname?.includes('/profile') || 
                                pathname?.includes('/cart') || 
                                pathname?.includes('/checkout') ||
                                pathname?.includes('/orders') ||
                                pathname?.includes('/privacy-policy') ||
                                pathname?.includes('/terms') ||
                                pathname?.includes('/faq') ||
                                pathname?.includes('/contact') ||
                                pathname?.includes('/about') ||
                                pathname?.includes('/pwa-login') ||
                                pathname?.includes('/success') ||
                                pathname?.includes('/training') ||
                                pathname?.includes('/pdf-viewer') ||
                                pathname?.includes('/delivery') ||
                                pathname?.includes('/brand') ||
                                pathname?.includes('/favorites') ||
                                pathname?.includes('/locations') ||
                                pathname?.includes('/skin-recommendation') ||
                                pathname?.includes('/blog') ||
                                pathname?.includes('/signup') ||
                                pathname?.includes('/forgot-password') ||
                                pathname?.includes('/reset-password') ||
                                isLoginPage ||
                                isProductDetailPage
  
  // Handle profile button click - with debounce to prevent rapid clicks
  const handleProfileClick = useCallback(() => {
    const now = Date.now()
    if (now - lastClickTime.current < 500) return
    lastClickTime.current = now
    
    if (isNavigating) return
    
    setIsNavigating(true)
    
    if (isOnProfilePage) {
      router.push(getLocalizedPath('/products', locale))
    } else {
      router.push(getLocalizedPath('/profile', locale))
    }
    
    setTimeout(() => {
      setIsNavigating(false)
    }, 600)
  }, [isOnProfilePage, isNavigating, router, locale])
  
  // Close menu on route change
  useEffect(() => {
    setShowMobileMenu(false)
    setIsNavigating(false)
  }, [pathname])
  
  // Mark component as ready after hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])
  
  // Toggle mobile menu with debounce
  const toggleMobileMenu = useCallback(() => {
    const now = Date.now()
    if (now - lastClickTime.current < 200) return
    lastClickTime.current = now
    setShowMobileMenu(prev => !prev)
  }, [])
  
  // Only render on mobile web (not PWA, not desktop)
  // Hide on pages that have their own simple header
  if (!isClient || isPWA || !isMobile || isOnSimpleHeaderPage) {
    return null
  }
  
  const isRTL = dir === 'rtl'
  const favoritesCount = favorites?.length || 0
  
  // Get user initial for avatar
  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || 'G'
  
  return (
    <>
      {/* Fixed Mobile Web Header */}
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
          {/* Left Side: Hamburger + Language */}
          <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Hamburger Menu */}
            <button
              ref={menuButtonRef}
              onClick={toggleMobileMenu}
              onTouchEnd={(e) => {
                e.preventDefault()
                if (isReady) toggleMobileMenu()
              }}
              className="p-2.5 -m-1 text-gray-700 hover:text-gray-900 active:bg-gray-100 rounded-lg touch-manipulation select-none"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
              aria-label={showMobileMenu ? t('common.closeMobileMenu') : t('common.openMobileMenu')}
              aria-expanded={showMobileMenu}
              disabled={!isReady}
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 text-green-600" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  if (isReady) setShowLangMenu(prev => !prev)
                }}
                disabled={!isReady}
                className="flex items-center gap-0.5 text-green-600 font-semibold text-sm px-2 py-1.5 touch-manipulation select-none active:bg-green-50 rounded-md transition-colors"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
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
                      href={getLocalizedPath(pathname || '/', 'en')}
                      className={`block px-4 py-2.5 text-sm hover:bg-gray-50 ${locale === 'en' ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-700'}`}
                      onClick={() => setShowLangMenu(false)}
                    >
                      English
                    </Link>
                    <Link
                      href={getLocalizedPath(pathname || '/', 'ru')}
                      className={`block px-4 py-2.5 text-sm hover:bg-gray-50 ${locale === 'ru' ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-700'}`}
                      onClick={() => setShowLangMenu(false)}
                    >
                      Русский
                    </Link>
                    <Link
                      href={getLocalizedPath(pathname || '/', 'ar')}
                      className={`block px-4 py-2.5 text-sm hover:bg-gray-50 ${locale === 'ar' ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-700'}`}
                      onClick={() => setShowLangMenu(false)}
                    >
                      العربية
                    </Link>
                  </div>
                </>
              )}
            </div>
            
            {/* AI Link */}
            <Link
              href={getLocalizedPath('/skin-recommendation', locale)}
              className="px-2 py-1 rounded hover:bg-gray-100 transition-colors"
              aria-label={t('navigation.aiSkinAnalysis') || 'AI Skin Analysis'}
            >
              <span className="text-sm font-bold text-red-600">AI</span>
            </Link>
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
          
          {/* Right Side: User Avatar */}
          <button 
            onClick={handleProfileClick}
            onTouchEnd={(e) => {
              e.preventDefault()
              if (isReady && !isNavigating) handleProfileClick()
            }}
            disabled={isNavigating || !isReady}
            className={`flex items-center p-2.5 -m-1 touch-manipulation transition-all select-none ${isNavigating ? 'opacity-50 scale-95' : 'active:scale-95'}`}
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
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
            className={`relative bg-white rounded-b-2xl shadow-2xl max-h-[70vh] overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}
            dir={dir}
            style={{ 
              animation: 'slideDown 0.2s ease-out',
            }}
          >
            {/* 2-Column Navigation Grid */}
            <nav className="p-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {/* Column 1 */}
                <Link 
                  href={getLocalizedPath('/products', locale)} 
                  className={`py-2.5 text-gray-800 hover:text-red-600 transition-colors text-sm font-medium ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.products')}
                </Link>
                
                <Link 
                  href={getLocalizedPath('/orders', locale)} 
                  className={`py-2.5 text-gray-800 hover:text-red-600 transition-colors text-sm font-medium ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.orders') || 'Orders'}
                </Link>

                <Link 
                  href={getLocalizedPath('/favorites', locale)} 
                  className={`py-2.5 text-gray-800 hover:text-red-600 transition-colors text-sm font-medium ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.favorites') || 'Favorites'}
                  {favoritesCount > 0 && (
                    <span className={`${isRTL ? 'mr-1' : 'ml-1'} bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full`}>{favoritesCount}</span>
                  )}
                </Link>

                <Link 
                  href={getLocalizedPath('/profile', locale)} 
                  className={`py-2.5 text-gray-800 hover:text-red-600 transition-colors text-sm font-medium ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('common.profile')}
                </Link>

                {/* Divider spanning full width */}
                <div className="col-span-2 h-px bg-gray-200 my-2" />

                <Link 
                  href={getLocalizedPath('/', locale)} 
                  className={`py-2 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.home')}
                </Link>

                <Link 
                  href={getLocalizedPath('/about', locale)} 
                  className={`py-2 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.about')}
                </Link>

                <Link 
                  href={getLocalizedPath('/brand', locale)} 
                  className={`py-2 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.brand')}
                </Link>

                <Link 
                  href={getLocalizedPath('/delivery', locale)} 
                  className={`py-2 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.delivery')}
                </Link>

                <Link 
                  href={getLocalizedPath('/contact', locale)} 
                  className={`py-2 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.contact')}
                </Link>

                <Link 
                  href={getLocalizedPath('/faq', locale)} 
                  className={`py-2 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.faq')}
                </Link>

                <Link 
                  href={getLocalizedPath('/locations', locale)} 
                  className={`py-2 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('common.locations')}
                </Link>
                
                <Link 
                  href={getLocalizedPath('/blog', locale)} 
                  className={`py-2 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {locale === 'ar' ? 'المدونة' : locale === 'ru' ? 'Блог' : 'Blog'}
                </Link>
                
                <Link 
                  href={getLocalizedPath('/skin-recommendation', locale)} 
                  className={`py-2 text-red-600 hover:text-red-700 transition-colors text-sm font-medium ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.aiSkinAnalysis') || 'AI Skin Analysis'}
                </Link>

                {user && (
                  <Link 
                    href={getLocalizedPath('/training', locale)} 
                    className={`py-2 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t('navigation.training')}
                  </Link>
                )}

                {/* Divider spanning full width */}
                <div className="col-span-2 h-px bg-gray-200 my-2" />

                {/* Account Actions */}
                {user ? (
                  <button
                    onClick={() => {
                      logout()
                      setShowMobileMenu(false)
                    }}
                    className={`col-span-2 py-2.5 text-red-600 hover:text-red-700 transition-colors text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    {t('common.logout')}
                  </button>
                ) : (
                  <Link 
                    href={getLocalizedPath('/login', locale)} 
                    className={`col-span-2 py-2.5 text-red-600 hover:text-red-700 transition-colors text-sm font-medium ${isRTL ? 'text-right' : ''}`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t('common.login')}
                  </Link>
                )}
              </div>
            </nav>

            {/* Bottom Safe Area */}
            <div className="h-2" />
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
