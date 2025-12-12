'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import { getProductDocumentation } from '@/data/productConfig'
import { useTranslation } from '@/hooks/useTranslation'

interface ProductDocumentationProps {
  product: Product
}

// Detect if running as PWA (standalone mode) AND on mobile
function isPWA(): boolean {
  if (typeof window === 'undefined') return false
  
  // Only consider PWA mode on mobile devices
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  
  if (!isMobile) return false
  
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
}

export default function ProductDocumentation({ product }: ProductDocumentationProps) {
  const { locale, t } = useTranslation()
  const router = useRouter()
  const [isPWAMode, setIsPWAMode] = useState(false)
  const documentation = getProductDocumentation(product.id, locale)

  useEffect(() => {
    setIsPWAMode(isPWA())
  }, [])

  if (!documentation || documentation.length === 0) {
    return null
  }

  const handlePDFClick = (e: React.MouseEvent, url: string, title: string) => {
    e.preventDefault()
    
    // In PWA mode, route to viewer instead of downloading
    if (isPWAMode) {
      const encodedFile = encodeURIComponent(url)
      const localePrefix = locale === 'en' ? '' : `/${locale}`
      router.push(`${localePrefix}/pdf-viewer?file=${encodedFile}`)
    } else {
      // Regular browser: download or open
      const link = document.createElement('a')
      link.href = url
      link.download = title
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('product.productDocumentation')}</h3>
      
      <div className="space-y-4">
        {documentation.map((doc, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{doc.title}</h4>
              <p className="text-sm text-gray-600">
                {doc.type === 'pdf' && t('product.documentationDescription')}
                {doc.type === 'video' && t('product.documentationDescription')}
                {doc.type === 'link' && t('product.documentationDescription')}
              </p>
            </div>
            {doc.type === 'pdf' ? (
              <button
                onClick={(e) => handlePDFClick(e, doc.url, doc.title)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('product.download')}
              </button>
            ) : (
              <a
                href={doc.url}
                target={doc.type === 'link' ? '_blank' : undefined}
                rel={doc.type === 'link' ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                {doc.type === 'video' && (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                )}
                {doc.type === 'link' && (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
                {doc.type === 'video' ? t('product.viewPdf') : t('product.viewPdf')}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
