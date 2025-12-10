'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import PDFViewerClient from '@/components/PDFViewerClient'

function PDFViewerContent() {
  const searchParams = useSearchParams()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [filename, setFilename] = useState<string>('document.pdf')

  useEffect(() => {
    const url = searchParams.get('url')
    const name = searchParams.get('filename') || 'document.pdf'
    
    if (url) {
      // Decode the URL
      const decodedUrl = decodeURIComponent(url)
      setPdfUrl(decodedUrl)
      setFilename(name)
    }
  }, [searchParams])

  if (!pdfUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No PDF URL provided</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return <PDFViewerClient filename={filename} pdfUrl={pdfUrl} />
}

export default function PDFViewerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading PDF viewer...</p>
        </div>
      </div>
    }>
      <PDFViewerContent />
    </Suspense>
  )
}
