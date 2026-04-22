'use client'

import Link from 'next/link'
import { ShoppingCart, Heart, User, LogOut } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { useAuth } from '@/components/auth/AuthProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import LoginModal from '@/components/LoginModal'
import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useRouter } from 'next/navigation'

export default function HeaderRussianDesktop() {
  // Use selector pattern for better reactivity with Zustand persist
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()
  const { t, locale } = useTranslation()
  const { isPWA } = usePWAMode()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isHeartBeating, setIsHeartBeating] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)

  // Handle login click - redirect to PWA login page if in PWA mode
  const handleLoginClick = () => {
    if (isPWA) {
      const loginPath = locale === 'en' ? '/pwa-login' : `/${locale}/pwa-login`
      router.push(loginPath)
    } else {
      setShowLoginModal(true)
    }
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Heartbeat animation every 16 seconds
  useEffect(() => {
    if (!isClient) return

    const startHeartbeat = () => {
      setIsHeartBeating(true)
      setTimeout(() => {
        setIsHeartBeating(false)
      }, 600)
    }

    startHeartbeat()
    const interval = setInterval(startHeartbeat, 16000)

    return () => clearInterval(interval)
  }, [isClient])

  return (
    <>
      {/* Desktop Left Side */}
      <div className="hidden md:flex flex-col">
        <span className="text-lg md:text-2xl font-bold text-primary-600">
          Genosys Middle East FZ-LLC
        </span>
        <div className="flex text-sm text-gray-600 items-center gap-1 ml-0 md:ml-[4rem] header-margin whitespace-nowrap">
          <span className="whitespace-nowrap">{t('common.uae')}</span>
          <Heart className={`h-3 w-3 text-primary-600 fill-current transition-transform duration-300 flex-shrink-0 ${
            isHeartBeating ? 'animate-pulse' : ''
          }`} 
                 style={isHeartBeating ? {
                   animation: 'heartbeat 0.6s ease-in-out'
                 } : {}} />
        </div>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-4" role="navigation" aria-label="Основная навигация">
        <Link href={getLocalizedPath('/', 'ru')} className="text-gray-700 hover:text-primary-600 transition-colors">
          {t('navigation.home')}
        </Link>
        <Link href={getLocalizedPath('/about', 'ru')} className="text-gray-700 hover:text-primary-600 transition-colors">
          {t('navigation.about')}
        </Link>
        <Link href={getLocalizedPath('/brand', 'ru')} className="text-gray-700 hover:text-primary-600 transition-colors">
          {t('navigation.brand')}
        </Link>
        <Link href={getLocalizedPath('/products', 'ru')} className="text-gray-700 hover:text-primary-600 transition-colors">
          {t('navigation.products')}
        </Link>
        {isClient && user && (
          <Link href={getLocalizedPath('/training', 'ru')} className="text-gray-700 hover:text-primary-600 transition-colors">
            {t('navigation.training')}
          </Link>
        )}
        <Link href={getLocalizedPath('/contact', 'ru')} className="text-gray-700 hover:text-primary-600 transition-colors">
          {t('navigation.contact')}
        </Link>
        <Link href={getLocalizedPath('/delivery', 'ru')} className="text-gray-700 hover:text-primary-600 transition-colors">
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
        
        <div className="flex items-center space-x-2 header-icons">
          {isClient && user ? (
            <>
              <LanguageSwitcher />
              <Link 
                href={getLocalizedPath('/profile', 'ru')} 
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                aria-label={t('common.profile')}
              >
                <User className="h-6 w-6 text-green-600" aria-hidden="true" />
              </Link>
              <button 
                onClick={() => logout()}
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
                onClick={handleLoginClick}
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors touch-manipulation"
                aria-label={t('common.login')}
              >
                <User className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
          
          <Link 
            href={getLocalizedPath('/favorites', 'ru')} 
            className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`${t('common.favorites')} с ${isClient ? favorites.length : 0} товарами`}
          >
            <Heart className={`h-6 w-6 transition-colors ${isClient && favorites.length > 0 ? 'text-red-500' : ''}`} aria-hidden="true" />
            {isClient && favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center header-badge" aria-hidden="true">
                {favorites.length}
              </span>
            )}
          </Link>
          
          <Link 
            href={getLocalizedPath('/cart', 'ru')} 
            className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`${t('common.cart')} с ${isClient ? cartCount : 0} товарами`}
          >
            <ShoppingCart className={`h-6 w-6 transition-colors ${isClient && cartCount > 0 ? 'text-green-600' : ''}`} aria-hidden="true" />
            {isClient && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center header-badge" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

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

