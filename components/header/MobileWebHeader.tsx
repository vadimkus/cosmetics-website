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
import { useHideOnScroll } from '@/hooks/useHideOnScroll'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

/**
 * Mobile Web Header - PWA-like design for mobile web (non-PWA)
 * 
 * Only shows in mobile web mode (not PWA, not desktop).
 * Layout is a three-column grid so the wordmark is optically centred regardless of what
 * the flanks weigh:
 * - Left: Hamburger menu + Language switcher
 * - Center: Logo
 * - Right: Favorites heart + User avatar
 *
 * Every control is a 44px target, per Apple's HIG minimum and WCAG 2.5.5. The brand line
 * moved into the menu panel: it is a one-off statement, not something worth a permanent
 * row on every screen of a 390px-wide phone.
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
  // Steps aside on the way down and returns on the way up, the same rule the
  // app applies on every scrolling screen. Held open while either menu is out,
  // since both are anchored to this bar and would be left behind by it.
  const { ref: headerRef, hidden: headerHidden } = useHideOnScroll<HTMLElement>({
    enabled: !showMobileMenu && !showLangMenu,
  })
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
      {/* Fixed Mobile Web Header.

          Laid out as a three-column grid with the wordmark in the centre column, so it is
          optically centred whatever the flanks weigh. The previous flex row grouped the
          logo with the heart and left it 22px right of centre.

          Floats clear of the edges as a rounded bar, matching the tab bar at the
          foot of the page. The notch inset moves out of the bar and into its top
          offset, so the safe area becomes the gap above it rather than padding
          inside it. Deliberately no overflow-hidden: the language menu hangs off
          the bottom of this element and would be clipped by the radius. */}
      <header 
        ref={headerRef}
        data-hidden={headerHidden}
        className="cera-page genosys-page mobile-web-header mweb-hide-on-scroll fixed z-50 md:hidden"
        style={{ 
          top: 'calc(env(safe-area-inset-top, 0px) + var(--mweb-chrome-inset))',
          left: 'var(--mweb-chrome-inset)',
          right: 'var(--mweb-chrome-inset)',
          border: '1px solid var(--cera-line)',
          borderRadius: 'var(--mweb-chrome-radius)',
          boxShadow: 'var(--mweb-chrome-shadow)'
        }}
        dir={dir}
      >
        <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center px-2.5">
          {/* Left Side: Hamburger + Language */}
          <div className={`flex items-center justify-self-start ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Hamburger Menu */}
            <button
              ref={menuButtonRef}
              onClick={toggleMobileMenu}
              onTouchEnd={(e) => {
                e.preventDefault()
                if (isReady) toggleMobileMenu()
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--cera-ink)] transition-colors active:bg-[var(--cera-cream-deep)] touch-manipulation select-none"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
              aria-label={showMobileMenu ? t('common.closeMobileMenu') : t('common.openMobileMenu')}
              aria-expanded={showMobileMenu}
              disabled={!isReady}
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
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
                aria-label={t('common.language') || 'Language'}
                aria-expanded={showLangMenu}
                className="flex h-11 min-w-11 items-center justify-center gap-0.5 rounded-full px-2 text-[13px] font-semibold tracking-[0.06em] text-[var(--cera-muted)] transition-colors active:bg-[var(--cera-cream-deep)] touch-manipulation select-none"
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
                  <div className={`absolute top-full z-50 mt-1 min-w-[132px] overflow-hidden rounded-2xl border border-[var(--cera-line)] bg-white py-1 shadow-[0_20px_44px_-28px_rgba(23,20,15,0.45)] ${isRTL ? 'right-0' : 'left-0'}`}>
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
                          className={`block w-full px-4 py-3 text-start text-sm touch-manipulation transition-colors active:bg-[var(--cera-cream-deep)] ${locale === l ? 'bg-[var(--cera-blush)] font-semibold text-[var(--cera-rose-ink)]' : 'text-[var(--cera-body)]'}`}
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
            
            {/* The bare red "AI" that used to sit here was a duplicate: the hamburger
                already carries the same destination as a labelled "AI Skin Analysis" CTA,
                which is legible where two red letters were not. */}
          </div>
          
          {/* Center: Logo.

              upLOGO.png carries an opaque white rectangle and a band of dead padding, which
              read as a white sticker once the header became cream. This is the same
              wordmark on a genuinely transparent ground, so it sits on the surface
              instead of on a patch of its own. */}
          <Link href={getLocalizedPath('/products', locale)} className="flex items-center justify-self-center">
            <Image
              src="/images/genosys-wordmark-transparent.png"
              alt="GENOSYS"
              width={977}
              height={210}
              className="h-[22px] w-auto"
              priority
            />
          </Link>
          
          {/* Right Side: Favorites + Avatar */}
          <div className={`flex items-center justify-self-end ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Favorites Heart */}
            <Link 
              href={getLocalizedPath('/favorites', locale)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full transition-colors active:bg-[var(--cera-cream-deep)]"
              aria-label={t('navigation.favorites') || 'Favorites'}
            >
              <Heart 
                className={`w-[21px] h-[21px] transition-all ${favoritesCount > 0 ? 'fill-[var(--cera-rose)] text-[var(--cera-rose)]' : 'text-[var(--cera-ink)]'}`}
              />
              {favoritesCount > 0 && (
                <span className="absolute right-1 top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-[var(--cera-cream)] bg-[var(--cera-rose)] text-[9px] font-bold text-white">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </Link>
            
            <button 
              onClick={handleProfileClick}
              onTouchEnd={(e) => {
                e.preventDefault()
                if (isReady && !isNavigating) handleProfileClick()
              }}
              disabled={isNavigating || !isReady}
              className={`flex h-11 w-11 items-center justify-center touch-manipulation select-none transition-all ${isNavigating ? 'scale-95 opacity-50' : 'active:scale-95'}`}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
              aria-label={isOnProfilePage ? 'Go back' : 'Open profile'}
            >
              {user ? (
                <div className={`relative flex h-[34px] w-[34px] items-center justify-center rounded-full transition-colors ${isOnProfilePage ? 'bg-[var(--cera-muted)]' : 'bg-[var(--cera-cta)]'}`}>
                  <span className="text-[13px] font-semibold text-white">
                    {userInitial.toUpperCase()}
                  </span>
                  {/* Signed-in indicator. Green is kept: it reports status rather than
                      carrying brand, the same call made across the account area. */}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-[1.5px] border-[var(--cera-cream)] bg-green-500" />
                </div>
              ) : (
                <div className={`flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[var(--cera-line)] transition-colors ${isOnProfilePage ? 'bg-[var(--cera-cream-deep)]' : 'bg-white'}`}>
                  <svg className="h-[19px] w-[19px] text-[var(--cera-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu (Slide-down) - Professional Design */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          style={{ paddingTop: 'var(--mweb-header-space)' }}
        >
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setShowMobileMenu(false)}
          />
          
          {/* Menu Content - Slide from top, swipe up to close */}
          <div 
            ref={menuPanelRef}
            className={`cera-page genosys-page relative max-h-[70vh] overflow-y-auto rounded-b-[24px] shadow-[0_28px_60px_-24px_rgba(23,20,15,0.5)] ${isRTL ? 'text-right' : 'text-left'}`}
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
            <div className="flex justify-center pb-1 pt-2">
              <div className="h-1 w-10 rounded-full bg-[var(--cera-blush-deep)]" />
            </div>

            <p className="cera-eyebrow px-4 pb-2 pt-1 text-center">
              {locale === 'ar' ? 'العناية بالبشرة الفاخرة والجمال' : locale === 'ru' ? 'Премиальный уход за кожей и красота' : 'Premium Skincare & Beauty'}
            </p>
            
            {/* Sectioned Navigation.
                Note: Orders / Favorites / Profile / Home are intentionally NOT
                duplicated here - they already live in first-class spots of the
                mobile chrome (Orders + Home in the bottom tab bar; Favorites
                as the heart in the top header; Profile as the avatar in the
                top-right). Duplicating them just made the menu noisier. */}
            <nav className="px-4 pt-1 pb-3">
              {/* Section: primary destinations (shop-focused only) */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <Link
                  href={getLocalizedPath('/products', locale)}
                  className={`py-2.5 text-[var(--cera-ink)] hover:text-[var(--cera-rose-ink)] transition-colors text-[15px] font-semibold ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.products')}
                </Link>

                <Link
                  href={getLocalizedPath('/bundle-builder', locale)}
                  className={`py-2.5 text-[var(--cera-rose-ink)] transition-colors text-[15px] font-semibold ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  🎁 {t('bundleBuilder.title')}
                </Link>
              </div>

              {/* AI Skin Analysis - highlighted CTA */}
              <Link
                href={getLocalizedPath('/skin-recommendation', locale)}
                onClick={() => setShowMobileMenu(false)}
                className={`mt-3 flex items-center gap-2.5 w-full py-2.5 px-3 rounded-xl ed-panel text-[var(--cera-rose-ink)] transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-semibold">
                  {t('navigation.aiSkinAnalysis') || 'AI Skin Analysis'}
                </span>
              </Link>

              {/* Section: Explore */}
              <div className="mt-4 mb-1.5 flex items-center gap-2 px-1">
                <span className={`cera-eyebrow ${isRTL ? 'order-2' : ''}`}>
                  {locale === 'ar' ? 'استكشف' : locale === 'ru' ? 'Разделы' : 'Explore'}
                </span>
                <div className="flex-1 h-px bg-[var(--cera-line)]" />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                <Link
                  href={getLocalizedPath('/about', locale)}
                  className={`py-1.5 text-[var(--cera-body)] hover:text-[var(--cera-rose-ink)] transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.about')}
                </Link>

                <Link
                  href={getLocalizedPath('/brand', locale)}
                  className={`py-1.5 text-[var(--cera-body)] hover:text-[var(--cera-rose-ink)] transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.brand')}
                </Link>

                <Link
                  href={getLocalizedPath('/delivery', locale)}
                  className={`py-1.5 text-[var(--cera-body)] hover:text-[var(--cera-rose-ink)] transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.delivery')}
                </Link>

                <Link
                  href={getLocalizedPath('/contact', locale)}
                  className={`py-1.5 text-[var(--cera-body)] hover:text-[var(--cera-rose-ink)] transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.contact')}
                </Link>

                <Link
                  href={getLocalizedPath('/faq', locale)}
                  className={`py-1.5 text-[var(--cera-body)] hover:text-[var(--cera-rose-ink)] transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.faq')}
                </Link>

                <Link
                  href={getLocalizedPath('/locations', locale)}
                  className={`py-1.5 text-[var(--cera-body)] hover:text-[var(--cera-rose-ink)] transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('common.locations')}
                </Link>

                <Link
                  href={getLocalizedPath('/partners', locale)}
                  className={`py-1.5 text-[var(--cera-body)] hover:text-[var(--cera-rose-ink)] transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('navigation.partners')}
                </Link>

                <Link
                  href={getLocalizedPath('/blog', locale)}
                  className={`py-1.5 text-[var(--cera-body)] hover:text-[var(--cera-rose-ink)] transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {locale === 'ar' ? 'المدونة' : locale === 'ru' ? 'Блог' : 'Blog'}
                </Link>

                {user && (
                  <Link
                    href={getLocalizedPath('/training', locale)}
                    className={`py-1.5 text-[var(--cera-body)] hover:text-[var(--cera-rose-ink)] transition-colors text-sm ${isRTL ? 'text-right' : ''}`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t('navigation.training')}
                  </Link>
                )}
              </div>

              {/* Section: Get the app */}
              <div className="mt-4 mb-2 flex items-center gap-2 px-1">
                <span className={`cera-eyebrow ${isRTL ? 'order-2' : ''}`}>
                  {locale === 'ar' ? 'حمّل التطبيق' : locale === 'ru' ? 'Скачать приложение' : 'Get the app'}
                </span>
                <div className="flex-1 h-px bg-[var(--cera-line)]" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* App Store */}
                <a
                  href="https://apps.apple.com/ae/app/genosys-uae/id6756648064"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 py-2 px-3 bg-black text-white rounded-lg transition-colors active:bg-[#333] ${isRTL ? 'flex-row-reverse' : ''}`}
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
                  className={`flex items-center justify-center gap-2 py-2 px-3 bg-black text-white rounded-lg transition-colors active:bg-[#333] ${isRTL ? 'flex-row-reverse' : ''}`}
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
              <div className="mt-4 pt-3 border-t border-[var(--cera-line)]">
                {user ? (
                  <button
                    onClick={() => {
                      logout()
                      setShowMobileMenu(false)
                    }}
                    className={`w-full flex items-center gap-2 py-2.5 px-3 rounded-lg text-[var(--cera-rose-ink)] active:bg-[var(--cera-blush)] transition-colors text-sm font-semibold ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span>{t('common.logout')}</span>
                  </button>
                ) : (
                  <Link
                    href={getLocalizedPath('/login', locale)}
                    onClick={() => setShowMobileMenu(false)}
                    className={`w-full flex items-center gap-2 py-2.5 px-3 rounded-lg text-[var(--cera-rose-ink)] active:bg-[var(--cera-blush)] transition-colors text-sm font-semibold ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
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


      {/* Spacer to prevent content from being hidden behind fixed header.
          Tracks --mweb-header-space so the inset, the bar and the gap below it
          are stated once rather than restated here and in the menu panel. */}
      <div 
        className="md:hidden" 
        style={{ height: 'var(--mweb-header-space)' }}
        aria-hidden="true" 
      />
    </>
  )
}
