'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import PDFViewerClient from '@/components/PDFViewerClient'
import { useTranslation } from '@/hooks/useTranslation'

function PDFViewerContent() {
  const searchParams = useSearchParams()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [filename, setFilename] = useState<string>('document.pdf')
  const { t } = useTranslation()

  useEffect(() => {
    const fileUrl = searchParams.get('file')
    
    if (fileUrl) {
      // Decode the URL
      const decodedUrl = decodeURIComponent(fileUrl)
      setPdfUrl(decodedUrl)
      
      // Extract filename from URL
      const urlParts = decodedUrl.split('/')
      const lastPart = urlParts[urlParts.length - 1]
      setFilename(lastPart && lastPart.includes('.pdf') ? lastPart : 'document.pdf')
    }
  }, [searchParams])

  if (!pdfUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Файл не указан!</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('common.goBack')}
          </button>
        </div>
      </div>
    )
  }

  return <PDFViewerClient filename={filename} pdfUrl={pdfUrl} />
}

export default function PDFViewerPage() {
  const { t } = useTranslation()
  
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    }>
      <PDFViewerContent />
    </Suspense>
  )
}
