'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import LoginModal from '@/components/LoginModal'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

export default function LoginClient() {
  const { user } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const router = useRouter()
  const { t, locale, dir } = useTranslation()

  useEffect(() => {
    if (user) {
      router.push(getLocalizedPath('/products', locale))
    }
  }, [user, router, locale])

  if (user) {
    return (
      <div className={`container mx-auto px-3 md:px-4 py-4 md:py-16 ${dir === 'rtl' ? 'text-right' : ''}`} dir={dir}>
        <div className="max-w-md mx-auto text-center py-8 md:py-16">
          <div className="mb-4 md:mb-8">
            <div className="h-14 w-14 md:h-24 md:w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg className="h-7 w-7 md:h-12 md:w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">{t('login.alreadyLoggedIn')}</h1>
            <p className="text-gray-600 text-sm md:text-lg mb-4 md:mb-8">
              {t('login.loggedInAs')} {user.email}
            </p>
          </div>
          
          <Link
            href={getLocalizedPath('/products', locale)}
            className={`inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            {t('login.continueToProducts')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`container mx-auto px-3 md:px-4 py-4 md:py-16 min-h-0 ${dir === 'rtl' ? 'text-right' : ''}`} dir={dir}>
      {/* Navigation Breadcrumb */}
      <nav className={`text-xs md:text-base text-gray-600 mb-2 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
        <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
        <span> / </span>
        <span className="text-gray-900 font-medium">{t('common.login')}</span>
      </nav>

      {/* Back to Home */}
      <Link 
        href={getLocalizedPath('/', locale)} 
        className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-3 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
      >
        <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
        <span>{t('login.backToHome')}</span>
      </Link>

      <div className="max-w-md mx-auto">
        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-8">
          <div className="text-center mb-3 md:mb-6">
            <div className="h-10 w-10 md:h-16 md:w-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
              <svg className="h-5 w-5 md:h-8 md:w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-base md:text-2xl font-bold text-gray-900">{t('login.signIn')}</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
              {t('login.subtitle')}
            </p>
          </div>

          <button
            onClick={() => setShowLoginModal(true)}
            className="w-full bg-primary-600 text-white py-2 md:py-3 px-4 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-700 transition-colors mb-3 md:mb-4"
          >
            {t('login.signIn')}
          </button>

          <div className="text-center pt-3 md:pt-4 border-t border-gray-100">
            <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">
              {t('login.dontHaveAccount')}
            </p>
            <button
              onClick={() => {
                setIsLoginMode(false)
                setShowLoginModal(true)
              }}
              className="text-primary-600 hover:text-primary-700 font-medium text-xs md:text-sm"
            >
              {t('login.createAccount')}
            </button>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          isLoginMode={isLoginMode}
          setIsLoginMode={setIsLoginMode}
        />
      )}
    </div>
  )
}
