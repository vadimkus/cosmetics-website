'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePDFTracking } from '@/lib/pdfTracking'
import { errorLog } from '@/lib/logger'
import { trackPDFDownload } from '@/lib/analytics'
import { useTranslation } from '@/hooks/useTranslation'

interface PDFLinkButtonProps {
  href: string
  filename: string
  children: React.ReactNode
  className?: string
  download?: string
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

export default function PDFLinkButton({ 
  href, 
  filename, 
  children, 
  className = '',
  download
}: PDFLinkButtonProps) {
  const { trackDownload } = usePDFTracking()
  const [isPWAMode, setIsPWAMode] = useState(false)
  const router = useRouter()
  const { locale } = useTranslation()

  useEffect(() => {
    setIsPWAMode(isPWA())
  }, [])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    // In PWA mode, route to viewer instead of downloading
    if (isPWAMode) {
      try {
        // Track the view
        await trackDownload(filename)
        trackPDFDownload(filename)
        
        // Route to PDF viewer with locale support
        const encodedFile = encodeURIComponent(href)
        const localePrefix = locale === 'en' ? '' : `/${locale}`
        router.push(`${localePrefix}/pdf-viewer?file=${encodedFile}`)
      } catch {
        errorLog('Error routing to PDF viewer:', error)
      }
      return
    }

    // Regular browser: download or open
    try {
      // Track the download
      await trackDownload(filename)
      trackPDFDownload(filename)
      
      // Create download link
      const link = document.createElement('a')
      link.href = href
      link.download = download || filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch {
      errorLog('Error downloading PDF:', error)
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      download={!isPWAMode ? (download || filename) : undefined}
    >
      {children}
    </a>
  )
}
