'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePDFTracking } from '@/lib/pdfTracking'
import { errorLog } from '@/lib/logger'
import { trackPDFDownload } from '@/lib/analytics'
import { useTranslation } from '@/hooks/useTranslation'

interface PDFDownloadButtonProps {
  href: string
  filename: string
  children: React.ReactNode
  className?: string
  external?: boolean
}

// Detect if running as PWA (standalone mode) AND on mobile
function isPWA(): boolean {
  if (typeof window === 'undefined') return false
  
  // Only consider PWA mode on mobile devices
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  
  if (!isMobile) return false
  
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
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
  const [isPWAMode, setIsPWAMode] = useState(false)
  const router = useRouter()
  const { locale } = useTranslation()

  useEffect(() => {
    setIsPWAMode(isPWA())
  }, [])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    // In PWA mode, ALWAYS route to viewer (regardless of external flag)
    // This keeps users within the PWA app
    if (isPWAMode) {
      try {
        // Track the view
        await trackDownload(filename)
        trackPDFDownload(filename)
        
        // Route to PDF viewer with locale support
        const encodedFile = encodeURIComponent(href)
        const localePrefix = locale === 'en' ? '' : `/${locale}`
        router.push(`${localePrefix}/pdf-viewer?file=${encodedFile}`)
      } catch (error) {
        errorLog('Error routing to PDF viewer:', error)
      }
      return
    }

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
      errorLog('Error downloading PDF:', error)
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
