'use client'

import { RefreshCw, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

interface ErrorPageProps {
  title?: string
  message?: string
  error?: string
  showRetry?: boolean
  showHome?: boolean
  showBack?: boolean
  onRetry?: () => void
  onBack?: () => void
  type?: 'error' | 'network' | 'not-found' | 'server'
}

export default function ErrorPage({
  title,
  message,
  error,
  showRetry = true,
  showHome = true,
  showBack = true,
  onRetry,
  onBack,
  type = 'error'
}: ErrorPageProps) {
  const { t, locale, dir } = useTranslation()
  const [isRetrying, setIsRetrying] = useState(false)
  
  // Use translations if title/message not provided
  const displayTitle = title || (type === 'not-found' ? t('common.pageNotFound') : t('common.somethingWentWrong'))
  const displayMessage = message || (type === 'not-found' ? t('common.pageNotFoundMessage') : t('common.errorMessage'))

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true)
      try {
        await onRetry()
      } finally {
        setIsRetrying(false)
      }
    } else {
      window.location.reload()
    }
  }

  const getIcon = () => {
    return (
      <Image
        src="/images/wrong/wrong.png"
        alt={t('common.errorAlt')}
        width={64}
        height={64}
        className="h-16 w-16"
      />
    )
  }

  const getBackgroundGradient = () => {
    switch (type) {
      case 'network':
        return 'from-orange-50 to-orange-100'
      case 'not-found':
        return 'from-blue-50 to-blue-100'
      case 'server':
        return 'from-red-50 to-red-100'
      default:
        return 'from-gray-50 to-gray-100'
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} flex items-center justify-center px-4`} dir={dir}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {getIcon()}
          </div>

          {/* Title */}
          <h1 className={`text-2xl font-bold text-gray-800 mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
            {displayTitle}
          </h1>

          {/* Message */}
          <p className={`text-gray-600 mb-6 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
            {displayMessage.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < displayMessage.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>

          {/* Error Details (if provided) */}
          {error && (
            <div className={`bg-gray-50 rounded-lg p-4 mb-6 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <p className="text-sm text-gray-500 mb-1">{t('common.errorDetails')}</p>
              <p className="text-sm text-red-600 font-mono break-all">
                {error.replace('Internal Server Error', 'Internal Server Boom-Boom')}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {showRetry && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className={`w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    {t('common.retrying')}
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5" />
                    {t('common.tryAgain')}
                  </>
                )}
              </button>
            )}

            <div className={`flex gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {showBack && (
                <button
                  onClick={onBack || (() => window.history.back())}
                  className={`flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                >
                  <ArrowLeft className={`h-5 w-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  {t('common.goBack')}
                </button>
              )}

              {showHome && (
                <Link
                  href={getLocalizedPath('/', locale)}
                  className={`flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                >
                  <Home className="h-5 w-5" />
                  {t('common.home')}
                </Link>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className={`text-xs text-gray-500 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t('common.ifThisShowsOn')}{' '}
              <a 
                href="mailto:sales@genosys.ae" 
                className="text-primary-600 hover:text-primary-700 underline"
              >
                sales@genosys.ae
              </a>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300 rounded-full opacity-20"></div>
        </div>
      </div>
    </div>
  )
}
