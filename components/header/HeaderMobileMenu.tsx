'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useAuth } from '@/components/AuthProvider'
import InstallLink from '@/components/InstallLink'

interface HeaderMobileMenuProps {
  showMobileMenu: boolean
  setShowMobileMenu: (show: boolean) => void
  isClient: boolean
}

/**
 * Mobile navigation menu
 * Works for all locales (English and Arabic)
 */
export default function HeaderMobileMenu({
  showMobileMenu,
  setShowMobileMenu,
  isClient
}: HeaderMobileMenuProps) {
  const { t, locale } = useTranslation()
  const { user, logout } = useAuth()

  if (!showMobileMenu) {
    return null
  }

  const linkClass = "text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors py-2.5 px-3 rounded-lg text-sm touch-manipulation flex items-center"

  const handleLinkClick = () => setShowMobileMenu(false)

  return (
    <div className="md:hidden bg-white border-t" role="navigation" aria-label="Mobile navigation">
      <div className="container mx-auto px-3 py-3">
        <nav className="grid grid-cols-3 gap-1">
          <Link 
            href={`${getLocalizedPath('/', locale)}?full=true`} 
            className={`${linkClass} font-medium`}
            onClick={handleLinkClick}
          >
            {t('navigation.home')}
          </Link>
          <Link 
            href={getLocalizedPath('/about', locale)} 
            className={linkClass}
            onClick={handleLinkClick}
          >
            {t('navigation.about')}
          </Link>
          <Link 
            href={getLocalizedPath('/brand', locale)} 
            className={linkClass}
            onClick={handleLinkClick}
          >
            {t('navigation.brand')}
          </Link>
          <Link 
            href={getLocalizedPath('/products', locale)} 
            className={linkClass}
            onClick={handleLinkClick}
          >
            {t('navigation.products')}
          </Link>
          <Link 
            href={getLocalizedPath('/bundle-builder', locale)} 
            className={`${linkClass} text-primary-600 font-medium`}
            onClick={handleLinkClick}
          >
            🎁 {t('bundleBuilder.title')}
          </Link>
          {isClient && user && (
            <Link 
              href={getLocalizedPath('/training', locale)} 
              className={linkClass}
              onClick={handleLinkClick}
            >
              {t('navigation.training')}
            </Link>
          )}
          <Link 
            href={getLocalizedPath('/contact', locale)} 
            className={linkClass}
            onClick={handleLinkClick}
          >
            {t('navigation.contact')}
          </Link>
          <Link 
            href={getLocalizedPath('/delivery', locale)}
            className={linkClass}
            onClick={handleLinkClick}
          >
            {t('navigation.delivery')}
          </Link>
          <Link 
            href={getLocalizedPath('/faq', locale)}
            className={linkClass}
            onClick={handleLinkClick}
          >
            {t('navigation.faq')}
          </Link>
          <Link 
            href={getLocalizedPath('/blog', locale)}
            className={linkClass}
            onClick={handleLinkClick}
          >
            {t('navigation.blog')}
          </Link>
          <Link 
            href={getLocalizedPath('/locations', locale)}
            className={linkClass}
            onClick={handleLinkClick}
          >
            {t('navigation.locations')}
          </Link>
          <Link 
            href={getLocalizedPath('/partners', locale)}
            className={linkClass}
            onClick={handleLinkClick}
          >
            {t('navigation.partners')}
          </Link>
          <div className={linkClass}>
            <InstallLink 
              onClose={handleLinkClick}
              className="w-full text-left text-gray-700 hover:text-primary-600 text-sm"
            />
          </div>
          {isClient && user && (
            <>
              <Link 
                href={getLocalizedPath('/profile', locale)} 
                className={linkClass}
                onClick={handleLinkClick}
              >
                {t('common.profile')}
              </Link>
              <button 
                onClick={() => {
                  logout()
                  handleLinkClick()
                }}
                className={`${linkClass} text-left`}
              >
                {t('common.logout')}
              </button>
            </>
          )}
        </nav>
      </div>
    </div>
  )
}
