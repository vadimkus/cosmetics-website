'use client'

import Link from 'next/link'
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
      <div className={`container mx-auto px-4 py-8 md:py-16 ${dir === 'rtl' ? 'text-right' : ''}`} dir={dir}>
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="mb-8">
            <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('login.alreadyLoggedIn')}</h1>
            <p className="text-gray-600 text-lg mb-8">
              {t('login.loggedInAs')} {user.email}
            </p>
          </div>
          
          <Link
            href={getLocalizedPath('/products', locale)}
            className={`inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            {t('login.continueToProducts')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`container mx-auto px-4 py-8 md:py-16 ${dir === 'rtl' ? 'text-right' : ''}`} dir={dir}>
      {/* Navigation Breadcrumb */}
      <nav className={`flex items-center gap-2 text-sm md:text-base text-gray-600 mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`} aria-label="Breadcrumb">
        <Link
          href={getLocalizedPath('/', locale)}
          className="hover:text-primary-600 transition-colors flex items-center"
        >
          {t('common.home')}
        </Link>
        <span className="flex items-center">/</span>
        <span className="text-gray-900 font-medium flex items-center">
          {t('common.login')}
        </span>
      </nav>

      {/* Back to Home Link */}
      <div className="mb-8">
        <Link
          href={getLocalizedPath('/', locale)}
          className={`text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
        >
          {t('login.backToHome')}
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('login.title')}</h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('login.subtitle')}
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('login.signIn')}</h2>
              <p className="text-gray-600">
                {t('login.signInToAccount')}
              </p>
            </div>

            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors mb-4"
            >
              {t('login.signIn')}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                {t('login.dontHaveAccount')}
              </p>
              <button
                onClick={() => {
                  setIsLoginMode(false)
                  setShowLoginModal(true)
                }}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                {t('login.createAccount')}
              </button>
            </div>
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
