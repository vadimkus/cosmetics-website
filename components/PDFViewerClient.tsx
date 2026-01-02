'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

// Dynamically import PDF.js viewer to avoid SSR issues
const PDFJSViewer = dynamic(() => import('./PDFJSViewer'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[9999] bg-gray-900 flex items-center justify-center">
      <div className="text-center text-white">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-red-500" />
        <p className="text-sm">Loading PDF viewer...</p>
      </div>
    </div>
  )
})

interface PDFViewerClientProps {
  filename: string
  pdfUrl: string
}

export default function PDFViewerClient({ filename, pdfUrl }: PDFViewerClientProps) {
  const [shouldUsePDFJS, setShouldUsePDFJS] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Always use PDF.js viewer for better experience
    // It works on all platforms including iOS
    setShouldUsePDFJS(true)
  }, [])

  // Show loading state while determining viewer type
  if (!isClient) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-red-500" />
          <p className="text-sm">Preparing document...</p>
        </div>
      </div>
    )
  }

  // Use PDF.js viewer
  if (shouldUsePDFJS) {
    return <PDFJSViewer pdfUrl={pdfUrl} filename={filename} />
  }

  // Fallback: This shouldn't be reached
  return null
}
