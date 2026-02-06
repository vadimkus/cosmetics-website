'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Share2, ExternalLink, Copy, Check, Home } from 'lucide-react'
import { errorLog } from '@/lib/logger'
import { useTranslation } from '@/hooks/useTranslation'

function ShareContent() {
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up timer on unmount
  useEffect(() => () => { if (copyTimerRef.current) clearTimeout(copyTimerRef.current) }, [])
  
  const title = searchParams.get('title') || ''
  const text = searchParams.get('text') || ''
  const url = searchParams.get('url') || ''
  
  const hasContent = title || text || url

  const handleCopy = async () => {
    const content = [title, text, url].filter(Boolean).join('\n')
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      errorLog('Failed to copy:', err)
    }
  }

  // If shared content contains a product URL, redirect to products
  useEffect(() => {
    if (url && url.includes('/products/')) {
      const productPath = url.split('/products/')[1]
      if (productPath) {
        window.location.href = `/products/${productPath}`
      }
    }
  }, [url])

  if (!hasContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('share.noContentTitle')}</h1>
          <p className="text-gray-600 mb-6">
            {t('share.noContentDescription')}
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <Home className="w-5 h-5" />
            {t('share.goToHomepage')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('share.sharedWithGenosys')}</h1>
          <p className="text-gray-600 mt-2">{t('share.sharedContent')}</p>
        </div>

        {/* Shared Content Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {title && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t('share.labelTitle')}</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">{title}</p>
            </div>
          )}
          
          {text && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t('share.labelText')}</label>
              <p className="text-gray-700 mt-1 whitespace-pre-wrap">{text}</p>
            </div>
          )}
          
          {url && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t('share.labelUrl')}</label>
              <a 
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-1 break-all"
              >
                {url}
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
              </a>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={handleCopy}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  {t('share.copied')}
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  {t('share.copyAll')}
                </>
              )}
            </button>
            
            <Link 
              href="/products"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {t('share.browseProducts')}
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="w-5 h-5" />
            {t('share.backToHomepage')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ShareClient() {
  const { t } = useTranslation()
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('share.loadingSharedContent')}</p>
        </div>
      </div>
    }>
      <ShareContent />
    </Suspense>
  )
}
