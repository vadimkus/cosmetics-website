'use client'

import { usePDFTracking } from '@/lib/pdfTracking'
import { errorLog } from '@/lib/logger'

interface PDFViewerClientProps {
  filename: string
  pdfUrl: string
}

export default function PDFViewerClient({ filename, pdfUrl }: PDFViewerClientProps) {
  const { trackDownload } = usePDFTracking()

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
    } catch (error) {
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
      <iframe
        id="pdf-frame"
        src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
        className="w-full border-0 flex-1"
        style={{ height: 'calc(100% - 60px)' }}
        title={filename}
      />
    </div>
  )
}
