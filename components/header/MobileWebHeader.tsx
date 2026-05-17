'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback, TouchEvent as ReactTouchEvent } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, Heart, ChevronDown, X, LogOut, LogIn, Sparkles } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useIsMobile } from '@/hooks/useIsMobile'
import { getLocalizedPath, switchLocaleHardNav, type Locale } from '@/lib/i18n'
import { isSimpleHeaderPage } from '@/lib/simpleHeaderPages'

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
  const { isMobile } = useIsMobile()
  const lastClickTime = useRef(0)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuPanelRef = useRef<HTMLDivElement>(null)
  
  // Swipe-to-close state
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const touchStartY = useRef(0)
  const touchStartTime = useRef(0)
  const isScrolledToTop = useRef(true)
  
  // Check if we're on profile page
  const isOnProfilePage = pathname?.includes('/profile')

  // Shared "simple header page" helper ensures all three headers
  // (MobileWebHeader, PWAHeader, Header) agree on which routes own
  // their header. See lib/simpleHeaderPages.ts for the canonical list.
  const isOnSimpleHeaderPage = isSimpleHeaderPage(pathname)
  
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
  
  // Swipe-up-to-close handlers for menu panel
  const handleMenuTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    const panel = menuPanelRef.current
    // Only initiate swipe tracking when scrolled to top (or not scrollable)
    if (panel && panel.scrollTop <= 0) {
      isScrolledToTop.current = true
    } else {
      isScrolledToTop.current = false
    }
    touchStartY.current = e.touches[0]?.clientY ?? 0
    touchStartTime.current = Date.now()
    setIsSwiping(false)
  }, [])

  const handleMenuTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (!isScrolledToTop.current) return
    
    const currentY = e.touches[0]?.clientY ?? 0
    const deltaY = touchStartY.current - currentY // positive = swipe up
    
    if (deltaY > 10) {
      // Swiping up - apply offset with resistance
      setIsSwiping(true)
      setSwipeOffset(Math.min(deltaY * 0.6, 300))
    } else {
      // Swiping down or barely moved - reset
      if (isSwiping) {
        setSwipeOffset(0)
        setIsSwiping(false)
      }
    }
  }, [isSwiping])

  const handleMenuTouchEnd = useCallback(() => {
    if (!isSwiping) {
      setSwipeOffset(0)
      return
    }
    
    const elapsed = Date.now() - touchStartTime.current
    const velocity = swipeOffset / Math.max(elapsed, 1)
    
    // Close if swiped far enough (>80px) or fast enough (velocity > 0.3)
    if (swipeOffset > 80 || velocity > 0.3) {
      // Animate out then close
      setSwipeOffset(500)
      setTimeout(() => {
        setShowMobileMenu(false)
        setSwipeOffset(0)
        setIsSwiping(false)
      }, 200)
    } else {
      // Snap back
      setSwipeOffset(0)
      setIsSwiping(false)
    }
  }, [isSwiping, swipeOffset, setShowMobileMenu])

  // Reset swipe state when menu closes + lock body scroll when open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setSwipeOffset(0)
      setIsSwiping(false)
    }
    return () => { document.body.style.overflow = '' }
  }, [showMobileMenu])

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
              {/* NB: items are <button> (not <Link>) so we can set the
                  NEXT_LOCALE cookie + hard-navigate. iOS Safari mobile web
                  was swallowing client-side <Link> navigations for locale
                  switches, leaving users on the previous locale. */}
              {showLangMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowLangMenu(false)}
                  />
                  <div className={`absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 min-w-[100px] ${isRTL ? 'right-0' : 'left-0'}`}>
                    {(['en', 'ru', 'ar'] as Locale[]).map((l) => {
                      const label = l === 'en' ? 'English' : l === 'ru' ? 'Русский' : 'العربية'
                      const handleSelect = () => {
                        setShowLangMenu(false)
                        switchLocaleHardNav(l, pathname || '/')
                      }
                      return (
                        <button
                          key={l}
                          type="button"
                          onClick={handleSelect}
                          onTouchEnd={(e) => {
                            // Avoid the iOS Safari double-fire (touch + click)
                            // and ensure the navigation actually runs even
                            // when the synthetic click is suppressed.
                            e.preventDefault()
                            handleSelect()
                          }}
                          className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 active:bg-gray-100 touch-manipulation ${locale === l ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-700'}`}
                          style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                        >
                          {label}
                        </button>
                      )
                    })}
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
                {/* Online indicator - positioned inside the circle */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
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
          
          {/* Menu Content - Slide from top, swipe up to close */}
          <div 
            ref={menuPanelRef}
            className={`relative bg-white rounded-b-2xl shadow-2xl max-h-[70vh] overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}
            dir={dir}
            style={{ 
              animation: !isSwiping && swipeOffset === 0 ? 'slideDown 0.2s ease-out' : undefined,
              transform: swipeOffset > 0 ? `translateY(-${swipeOffset}px)` : undefined,
              transition: isSwiping ? 'none' : 'transform 0.25s ease-out',
              opacity: swipeOffset > 0 ? Math.max(1 - swipeOffset / 400, 0) : 1,
            }}
            onTouchStart={handleMenuTouchStart}
            onTouchMove={handleMenuTouchMove}
            onTouchEnd={handleMenuTouchEnd}
          >
            {/* Swipe indicator handle - hints at swipe-up-to-close */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            
            {/* Sectioned Navigation.
                Note: Orders / Favorites / Profile / Home are intentionally NOT
                duplicated here — they already live in first-class spots of the
                mobile chrome (Orders + Home in the bottom tab bar; Favorites
                as the heart in the top header; Profile as the avatar in the
                top-right). Duplicating them just made the menu noisier. */}
            <nav className="px-4 pt-1 pb-3">
              {/* Section: primary destinations (shop-focused only) */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <Link
                  href={getLocalizedPath('/products', locale)}
                  className={`py-2.5 text-gray-900 hover:text-red-600 transition-colors text-[15px] font-semibold ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.products')}
                </Link>

                <Link
                  href={getLocalizedPath('/bundle-builder', locale)}
                  className={`py-2.5 text-red-600 hover:text-red-700 transition-colors text-[15px] font-semibold ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  🎁 {t('bundleBuilder.title')}
                </Link>
              </div>

              {/* AI Skin Analysis — highlighted CTA */}
              <Link
                href={getLocalizedPath('/skin-recommendation', locale)}
                onClick={() => setShowMobileMenu(false)}
                className={`mt-3 flex items-center gap-2.5 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 text-red-600 hover:from-red-100 hover:to-pink-100 transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-semibold">
                  {t('navigation.aiSkinAnalysis') || 'AI Skin Analysis'}
                </span>
              </Link>

              {/* Section: Explore */}
              <div className="mt-4 mb-1.5 flex items-center gap-2 px-1">
                <span className={`text-[10px] uppercase tracking-widest font-semibold text-gray-400 ${isRTL ? 'order-2' : ''}`}>
                  {locale === 'ar' ? 'استكشف' : locale === 'ru' ? 'Разделы' : 'Explore'}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                <Link
                  href={getLocalizedPath('/about', locale)}
                  className={`py-1.5 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.about')}
                </Link>

                <Link
                  href={getLocalizedPath('/brand', locale)}
                  className={`py-1.5 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.brand')}
                </Link>

                <Link
                  href={getLocalizedPath('/delivery', locale)}
                  className={`py-1.5 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.delivery')}
                </Link>

                <Link
                  href={getLocalizedPath('/contact', locale)}
                  className={`py-1.5 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.contact')}
                </Link>

                <Link
                  href={getLocalizedPath('/faq', locale)}
                  className={`py-1.5 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.faq')}
                </Link>

                <Link
                  href={getLocalizedPath('/locations', locale)}
                  className={`py-1.5 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('common.locations')}
                </Link>

                <Link
                  href={getLocalizedPath('/partners', locale)}
                  className={`py-1.5 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.partners')}
                </Link>

                <Link
                  href={getLocalizedPath('/blog', locale)}
                  className={`py-1.5 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {locale === 'ar' ? 'المدونة' : locale === 'ru' ? 'Блог' : 'Blog'}
                </Link>

                {user && (
                  <Link
                    href={getLocalizedPath('/training', locale)}
                    className={`py-1.5 text-gray-600 hover:text-red-600 transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t('navigation.training')}
                  </Link>
                )}
              </div>

              {/* Section: Get the app */}
              <div className="mt-4 mb-2 flex items-center gap-2 px-1">
                <span className={`text-[10px] uppercase tracking-widest font-semibold text-gray-400 ${isRTL ? 'order-2' : ''}`}>
                  {locale === 'ar' ? 'حمّل التطبيق' : locale === 'ru' ? 'Скачать приложение' : 'Get the app'}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* App Store */}
                <a
                  href="https://apps.apple.com/ae/app/genosys-uae/id6756648064"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 py-2 px-3 bg-black text-white rounded-lg transition-colors active:bg-gray-800 ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                  aria-label={locale === 'ar' ? 'حمّل من App Store' : locale === 'ru' ? 'Загрузите в App Store' : 'Download on the App Store'}
                >
                  <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className={`flex flex-col leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                    <span className="text-[9px] font-normal opacity-90">
                      {locale === 'ar' ? 'حمّل من' : locale === 'ru' ? 'Загрузите в' : 'Download on the'}
                    </span>
                    <span className="text-sm font-semibold -mt-0.5">App Store</span>
                  </div>
                </a>

                {/* Google Play */}
                <a
                  href="https://play.google.com/store/apps/details?id=ae.genosys.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 py-2 px-3 bg-black text-white rounded-lg transition-colors active:bg-gray-800 ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                  aria-label={locale === 'ar' ? 'احصل عليه من Google Play' : locale === 'ru' ? 'Доступно в Google Play' : 'Get it on Google Play'}
                >
                  <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.808 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                  </svg>
                  <div className={`flex flex-col leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                    <span className="text-[9px] font-normal opacity-90">
                      {locale === 'ar' ? 'متوفر على' : locale === 'ru' ? 'Доступно в' : 'GET IT ON'}
                    </span>
                    <span className="text-sm font-semibold -mt-0.5">Google Play</span>
                  </div>
                </a>
              </div>

              {/* Account Actions */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                {user ? (
                  <button
                    onClick={() => {
                      logout()
                      setShowMobileMenu(false)
                    }}
                    className={`w-full flex items-center gap-2 py-2.5 px-3 rounded-lg text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors text-sm font-semibold ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span>{t('common.logout')}</span>
                  </button>
                ) : (
                  <Link
                    href={getLocalizedPath('/login', locale)}
                    onClick={() => setShowMobileMenu(false)}
                    className={`w-full flex items-center gap-2 py-2.5 px-3 rounded-lg text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors text-sm font-semibold ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                  >
                    <LogIn className="w-4 h-4 flex-shrink-0" />
                    <span>{t('common.login')}</span>
                  </Link>
                )}
              </div>
            </nav>

            {/* Bottom spacing */}
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
