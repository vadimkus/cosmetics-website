'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { usePDFTracking } from '@/lib/pdfTracking'
import { trackPDFDownload } from '@/lib/analytics'

interface PDFDownloadButtonProps {
  href: string
  filename: string
  children: React.ReactNode
  className?: string
  external?: boolean
}

export default function PDFDownloadButton({ 
  href, 
  filename, 
  children, 
  className = '',
  external = false 
}: PDFDownloadButtonProps) {
  const { trackDownload } = usePDFTracking()
  const [isDownloading, setIsDownloading] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDownloading(true)
    
    try {
      // Track the download
      await trackDownload(filename)
      
      // Track in Google Analytics
      trackPDFDownload(filename)
      
      if (external) {
        // For external links, open in new tab
        window.open(href, '_blank', 'noopener,noreferrer')
      } else {
        // For internal links, create download link
        const link = document.createElement('a')
        link.href = href
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDownloading}
      className={`inline-flex items-center ${className} ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}
