'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, Download, X } from 'lucide-react'
import { usePDFTracking } from '@/lib/pdfTracking'

interface PDFViewerClientProps {
  filename: string
  pdfUrl: string
}

// Detect if running on iOS
function isIOS(): boolean {
  if (typeof window === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as { MSStream?: unknown }).MSStream
}

export default function PDFViewerClient({ filename, pdfUrl }: PDFViewerClientProps) {
  const { trackDownload } = usePDFTracking()
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleClose = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }, [])

  const handleDownload = useCallback(async () => {
    try {
      await trackDownload(filename)
      // Open PDF in new tab - browser will handle it
      window.open(pdfUrl, '_blank')
    } catch (err) {
      console.error('Download error:', err)
    }
  }, [pdfUrl, filename, trackDownload])

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleIframeError = useCallback(() => {
    setIsLoading(false)
    setError('Failed to load PDF')
  }, [])

  // Show loading state while determining client side
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

  const ios = isIOS()

  // For iOS: Use Google Docs Viewer (most reliable on iOS)
  // For Android/Desktop: Use iframe with direct PDF URL
  
  let iframeSrc: string
  if (ios) {
    // iOS needs Google Docs viewer for proper PDF display
    const fullUrl = pdfUrl.startsWith('http') 
      ? pdfUrl 
      : `${window.location.origin}${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`
    iframeSrc = `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`
  } else {
    // Android and desktop can use direct PDF URL with toolbar
    iframeSrc = `${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-900 flex flex-col">
      {/* Top toolbar */}
      <div className="bg-gray-800 flex items-center justify-between px-4 h-[56px] text-white flex-shrink-0 safe-area-top">
        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h1 className="text-sm font-medium truncate mx-4 flex-1 text-center">
          {decodeURIComponent(filename).replace('.pdf', '').replace(/%20/g, ' ')}
        </h1>
        
        <button
          onClick={handleDownload}
          className="p-2 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors"
          aria-label="Download"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* PDF Content */}
      <div className="flex-1 relative bg-white">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-red-500" />
              <p className="text-sm text-gray-600">Loading PDF...</p>
              <p className="text-xs text-gray-400 mt-1">This may take a moment</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white p-6">
            <div className="text-center max-w-sm">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load PDF</h2>
              <p className="text-sm text-gray-500 mb-5">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Open in Browser
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PDF iframe */}
        <iframe
          src={iframeSrc}
          className="w-full h-full border-0"
          title={filename}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="autoplay"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>

      {/* Bottom safe area for notched phones */}
      <div className="bg-gray-800 h-safe-area-bottom flex-shrink-0" />
    </div>
  )
}
