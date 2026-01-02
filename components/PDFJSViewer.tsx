'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  X,
  Maximize2,
  RotateCw,
  Loader2
} from 'lucide-react'
import { usePDFTracking } from '@/lib/pdfTracking'
import { errorLog } from '@/lib/logger'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFJSViewerProps {
  pdfUrl: string
  filename: string
  onClose?: () => void
}

export default function PDFJSViewer({ pdfUrl, filename, onClose }: PDFJSViewerProps) {
  const { trackDownload } = usePDFTracking()
  const containerRef = useRef<HTMLDivElement>(null)
  
  // PDF state
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [rotation, setRotation] = useState<number>(0)
  
  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showControls, setShowControls] = useState<boolean>(true)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  
  // Touch/gesture state
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null)

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }
    
    // Initial update with slight delay to ensure DOM is ready
    const timeoutId = setTimeout(updateWidth, 100)
    updateWidth()
    
    window.addEventListener('resize', updateWidth)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', updateWidth)
    }
  }, [])

  // Auto-hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout
    
    const resetTimeout = () => {
      setShowControls(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setShowControls(false), 3000)
    }
    
    resetTimeout()
    window.addEventListener('touchstart', resetTimeout)
    window.addEventListener('mousemove', resetTimeout)
    
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('touchstart', resetTimeout)
      window.removeEventListener('mousemove', resetTimeout)
    }
  }, [])

  // Document loaded callback
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
    setError(null)
  }, [])

  // Document load error callback
  const onDocumentLoadError = useCallback((err: Error) => {
    errorLog('PDF load error:', err)
    setIsLoading(false)
    setError('Failed to load PDF. The file may be unavailable or corrupted.')
  }, [])

  // Navigation functions
  const goToPrevPage = useCallback(() => {
    setPageNumber(prev => Math.max(1, prev - 1))
  }, [])

  const goToNextPage = useCallback(() => {
    setPageNumber(prev => Math.min(numPages, prev + 1))
  }, [numPages])

  // Zoom functions
  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(3.0, prev + 0.25))
  }, [])

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(0.5, prev - 0.25))
  }, [])

  const resetZoom = useCallback(() => {
    setScale(1.0)
  }, [])

  // Rotation function
  const rotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360)
  }, [])

  // Download function
  const handleDownload = useCallback(async () => {
    try {
      await trackDownload(filename)
      
      // For external URLs, open in new tab
      if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
        window.open(pdfUrl, '_blank')
      } else {
        // For internal URLs, trigger download
        const link = document.createElement('a')
        link.href = pdfUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (err) {
      errorLog('Download error:', err)
    }
  }, [pdfUrl, filename, trackDownload])

  // Close handler
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose()
    } else if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }, [onClose])

  // Touch gesture handlers for pinch zoom
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch0 = e.touches[0]
      const touch1 = e.touches[1]
      if (touch0 && touch1) {
        const distance = Math.hypot(
          touch0.clientX - touch1.clientX,
          touch0.clientY - touch1.clientY
        )
        setLastTouchDistance(distance)
      }
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance !== null) {
      const touch0 = e.touches[0]
      const touch1 = e.touches[1]
      if (touch0 && touch1) {
        const distance = Math.hypot(
          touch0.clientX - touch1.clientX,
          touch0.clientY - touch1.clientY
        )
        
        const delta = distance - lastTouchDistance
        if (Math.abs(delta) > 10) {
          if (delta > 0) {
            setScale(prev => Math.min(3.0, prev + 0.1))
          } else {
            setScale(prev => Math.max(0.5, prev - 0.1))
          }
          setLastTouchDistance(distance)
        }
      }
    }
  }, [lastTouchDistance])

  const handleTouchEnd = useCallback(() => {
    setLastTouchDistance(null)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevPage()
          break
        case 'ArrowRight':
          goToNextPage()
          break
        case '+':
        case '=':
          zoomIn()
          break
        case '-':
          zoomOut()
          break
        case 'Escape':
          handleClose()
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevPage, goToNextPage, zoomIn, zoomOut, handleClose])

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-gray-900 flex flex-col"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top toolbar */}
      <div 
        className={`absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 text-white">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Title */}
          <h1 className="text-sm font-medium truncate mx-4 flex-1 text-center">
            {filename.replace('.pdf', '').replace(/%20/g, ' ')}
          </h1>
          
          {/* Download button */}
          <button
            onClick={handleDownload}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors"
            aria-label="Download"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto flex items-start justify-center pt-16 pb-32">
        {/* Loading overlay - only show when document is loading */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-red-500" />
              <p className="text-sm">Loading PDF...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900 p-6">
            <div className="text-center text-white max-w-md">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Unable to Load PDF</h2>
              <p className="text-sm text-gray-400 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Download Instead
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PDF Document */}
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className="pdf-document"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            rotate={rotation}
            {...(containerWidth > 0 ? { width: containerWidth - 16 } : {})}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-2xl mx-auto"
            loading={null}
          />
        </Document>
      </div>

      {/* Bottom toolbar */}
      <div 
        className={`absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-4 py-3">
          {/* Page navigation */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <span className="text-white text-sm font-medium min-w-[80px] text-center">
              {pageNumber} / {numPages || '?'}
            </span>
            
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Zoom and rotate controls */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5 text-white" />
            </button>
            
            <button
              onClick={resetZoom}
              className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors"
              aria-label="Reset zoom"
            >
              <span className="text-white text-xs font-medium">{Math.round(scale * 100)}%</span>
            </button>
            
            <button
              onClick={zoomIn}
              disabled={scale >= 3.0}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
            
            <div className="w-px h-6 bg-white/30 mx-2" />
            
            <button
              onClick={rotate}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors"
              aria-label="Rotate"
            >
              <RotateCw className="w-5 h-5 text-white" />
            </button>
            
            <button
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen()
                } else {
                  containerRef.current?.requestFullscreen()
                }
              }}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors hidden md:block"
              aria-label="Fullscreen"
            >
              <Maximize2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        
        {/* Safe area padding for notched phones */}
        <div className="h-safe-area-bottom bg-black/80" />
      </div>
    </div>
  )
}

