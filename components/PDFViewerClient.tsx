'use client'

import { useState } from 'react'
import { X, Download } from 'lucide-react'
import { usePDFTracking } from '@/lib/pdfTracking'
import { errorLog } from '@/lib/logger'

interface PDFViewerClientProps {
  filename: string
  pdfUrl: string
}

export default function PDFViewerClient({ filename, pdfUrl }: PDFViewerClientProps) {
  const { trackDownload } = usePDFTracking()
  const [isDownloading, setIsDownloading] = useState(false)

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
    setIsDownloading(true)
    try {
      // Track the download
      await trackDownload(filename)
      
      // Create a temporary link to trigger download
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      errorLog('Error downloading PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Navigation bar with Close and Save buttons */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium touch-manipulation min-h-[44px]"
              aria-label="Close PDF viewer"
            >
              <X className="h-5 w-5" />
              Close
            </button>
            
            <h1 className="text-sm md:text-base font-semibold text-gray-900 truncate flex-1 mx-4 text-center">
              {filename.replace('.pdf', '')}
            </h1>
            
            <a
              href={pdfUrl}
              download={filename}
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Save PDF"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? 'Saving...' : 'Save'}
            </a>
          </div>
        </div>
      </nav>
      
      {/* PDF Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 w-full">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full border-0"
            title={filename}
            style={{ minHeight: 'calc(100vh - 80px)' }}
          />
        </div>
      </div>
    </div>
  )
}
