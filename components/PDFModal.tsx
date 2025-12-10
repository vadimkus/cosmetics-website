'use client'

import { useEffect } from 'react'
import { X, Download, ExternalLink } from 'lucide-react'
import { usePDFTracking } from '@/lib/pdfTracking'
import { errorLog } from '@/lib/logger'
import { trackPDFDownload } from '@/lib/analytics'

interface PDFModalProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  filename: string
}

export default function PDFModal({ isOpen, onClose, pdfUrl, filename }: PDFModalProps) {
  const { trackDownload } = usePDFTracking()

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleDownload = async () => {
    try {
      // Track the download
      await trackDownload(filename)
      
      // Track in Google Analytics
      trackPDFDownload(filename)
      
      // Create a temporary link to trigger download
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      errorLog('Error downloading PDF:', error)
    }
  }

  const handleOpenInNewTab = async () => {
    try {
      // Track the download (opening in new tab is also considered a download)
      await trackDownload(filename)
      
      // Track in Google Analytics
      trackPDFDownload(filename)
      
      // Open in new tab
      window.open(pdfUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      errorLog('Error opening PDF:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
      onClick={(e) => {
        // Close when clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 id="pdf-modal-title" className="text-lg font-semibold text-gray-900 truncate flex-1 mr-4">
            {filename.replace('.pdf', '')}
          </h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenInNewTab}
              className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              aria-label="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Open in Tab</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              aria-label="Download PDF"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full min-h-[400px]"
            title={filename}
          />
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            If the PDF doesn&apos;t load properly, try opening it in a new tab or downloading it.
          </p>
        </div>
      </div>
    </div>
  )
}
