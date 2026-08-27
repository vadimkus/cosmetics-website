'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Share2, ExternalLink, Copy, Check, Home } from 'lucide-react'
import { errorLog } from '@/lib/logger'
import { useTranslation } from '@/hooks/useTranslation'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

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
      <div className={`cera-page genosys-page ${ceraSerif.variable} cera-page genosys-page ${ceraSerif.variable} min-h-screen flex items-center justify-center px-4`}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[var(--cera-cream-deep)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-[var(--cera-muted)]" />
          </div>
          <h1 className="cera-serif text-2xl text-[var(--cera-ink)] mb-2">{t('share.noContentTitle')}</h1>
          <p className="text-[var(--cera-body)] mb-6">
            {t('share.noContentDescription')}
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--cera-cta)] text-white rounded-full hover:bg-[var(--cera-rose-ink)] transition-colors"
          >
            <Home className="w-5 h-5" />
            {t('share.goToHomepage')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} cera-page genosys-page ${ceraSerif.variable} min-h-screen py-12 px-4`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--cera-cta)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="cera-serif text-2xl text-[var(--cera-ink)]">{t('share.sharedWithGenosys')}</h1>
          <p className="text-[var(--cera-body)] mt-2">{t('share.sharedContent')}</p>
        </div>

        {/* Shared Content Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {title && (
            <div className="mb-4">
              <label className="text-sm font-medium text-[var(--cera-muted)] uppercase tracking-wide">{t('share.labelTitle')}</label>
              <p className="text-lg font-semibold text-[var(--cera-ink)] mt-1">{title}</p>
            </div>
          )}
          
          {text && (
            <div className="mb-4">
              <label className="text-sm font-medium text-[var(--cera-muted)] uppercase tracking-wide">{t('share.labelText')}</label>
              <p className="text-[var(--cera-body)] mt-1 whitespace-pre-wrap">{text}</p>
            </div>
          )}
          
          {url && (
            <div className="mb-4">
              <label className="text-sm font-medium text-[var(--cera-muted)] uppercase tracking-wide">{t('share.labelUrl')}</label>
              <a 
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--cera-rose-ink)] hover:text-[var(--cera-ink)] mt-1 break-all"
              >
                {url}
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
              </a>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-[var(--cera-line)]">
            <button
              onClick={handleCopy}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[var(--cera-cream-deep)] text-[var(--cera-body)] rounded-lg hover:bg-[var(--cera-cream-deep)] transition-colors"
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
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[var(--cera-cta)] text-white rounded-lg hover:bg-[var(--cera-rose-ink)] transition-colors"
            >
              {t('share.browseProducts')}
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[var(--cera-body)] hover:text-[var(--cera-ink)] transition-colors"
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
      <div className={`cera-page genosys-page ${ceraSerif.variable} cera-page genosys-page ${ceraSerif.variable} min-h-screen flex items-center justify-center bg-[var(--cera-cream-deep)]`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--cera-line)] border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--cera-body)]">{t('share.loadingSharedContent')}</p>
        </div>
      </div>
    }>
      <ShareContent />
    </Suspense>
  )
}
