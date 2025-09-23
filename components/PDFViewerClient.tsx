'use client'

import { useState } from 'react'
import { ArrowLeft, Download, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { usePDFTracking } from '@/lib/pdfTracking'

interface PDFViewerClientProps {
  filename: string
  pdfUrl: string
}

export default function PDFViewerClient({ filename, pdfUrl }: PDFViewerClientProps) {
  const { trackDownload } = usePDFTracking()
  const [isDownloading, setIsDownloading] = useState(false)

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
      console.error('Error downloading PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleOpenInNewTab = async () => {
    try {
      // Track the download (opening in new tab is also considered a download)
      await trackDownload(filename)
      
      // Open in new tab
      window.open(pdfUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error opening PDF:', error)
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header with navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {filename.replace('.pdf', '')}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenInNewTab}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                Open in New Tab
              </button>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                {isDownloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* PDF Viewer */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-[calc(100vh-200px)] min-h-[600px]"
            title={filename}
          />
        </div>
        
        {/* Footer info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>If the PDF doesn&apos;t load properly, try opening it in a new tab or downloading it.</p>
        </div>
      </div>
    </div>
  )
}
