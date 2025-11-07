'use client'

import { RefreshCw, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

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
  title = "Ghost in the machine!",
  message = "No worries, we'll get him!",
  error,
  showRetry = true,
  showHome = true,
  showBack = true,
  onRetry,
  onBack,
  type = 'error'
}: ErrorPageProps) {
  const [isRetrying, setIsRetrying] = useState(false)

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
        alt="Error"
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
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} flex items-center justify-center px-4`}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {getIcon()}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {title}
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {message}
          </p>

          {/* Error Details (if provided) */}
          {error && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-500 mb-1">What's going on:</p>
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
                className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5" />
                    Try Again
                  </>
                )}
              </button>
            )}

            <div className="flex gap-3">
              {showBack && (
                <button
                  onClick={onBack || (() => window.history.back())}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Go Back
                </button>
              )}

              {showHome && (
                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              If this goes on, send us a mail at{' '}
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
