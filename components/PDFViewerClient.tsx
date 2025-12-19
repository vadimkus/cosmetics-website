'use client'

import { useState, useEffect } from 'react'
import { usePDFTracking } from '@/lib/pdfTracking'
import { errorLog } from '@/lib/logger'

interface PDFViewerClientProps {
  filename: string
  pdfUrl: string
}

// Detect if running on iOS
function isIOS(): boolean {
  if (typeof window === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
}

export default function PDFViewerClient({ filename, pdfUrl }: PDFViewerClientProps) {
  const { trackDownload } = usePDFTracking()
  const [iframeSrc, setIframeSrc] = useState<string>('')

  useEffect(() => {
    // For iOS devices, use Google Drive viewer to fix scrolling issues
    if (isIOS()) {
      // Convert relative URL to absolute URL for Google Drive viewer
      let fullUrl = pdfUrl
      if (!pdfUrl.startsWith('http://') && !pdfUrl.startsWith('https://')) {
        // Relative URL - make it absolute
        fullUrl = `${window.location.origin}${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`
      }
      // Use Google Drive viewer for iOS
      const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`
      setIframeSrc(googleViewerUrl)
    } else {
      // For non-iOS devices, use direct PDF URL
      setIframeSrc(`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`)
    }
  }, [pdfUrl])

  const handleClose = () => {
    // Use history.back() for better PWA experience - goes back to previous page
    if (window.history.length > 1) {
      window.history.back()
    } else {
      // Fallback to home if no history
      window.location.href = '/'
    }
  }

  const handleDownload = async () => {
    try {
      // Track the download
      await trackDownload(filename)
    } catch {
      errorLog('Error tracking PDF download:', error)
    }
    // The download will happen via the anchor tag's download attribute
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col" style={{ margin: 0, padding: 0, height: '100%', overflow: 'hidden' }}>
      {/* Navigation bar - Dark bar */}
      <nav className="bg-gray-800 flex items-center justify-between px-4 h-[60px] text-white font-sans flex-shrink-0">
        <button
          onClick={handleClose}
          className="bg-red-600 border-none text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-red-700 transition-colors touch-manipulation min-h-[44px]"
          aria-label="Back"
        >
          ⬅ Back
        </button>
        
        <span className="text-sm md:text-base truncate flex-1 mx-4 text-center">
          {filename.replace('.pdf', '')}
        </span>
        
        <a
          href={pdfUrl}
          download={filename}
          onClick={handleDownload}
          className="bg-blue-600 border-none text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-blue-700 transition-colors touch-manipulation min-h-[44px] no-underline inline-flex items-center"
          aria-label="Save PDF"
        >
          ⬇ Save
        </a>
      </nav>
      
      {/* PDF Container */}
      {iframeSrc && (
        <iframe
          id="pdf-frame"
          src={iframeSrc}
          className="w-full border-0 flex-1"
          style={{ height: 'calc(100% - 60px)' }}
          title={filename}
        />
      )}
    </div>
  )
}
