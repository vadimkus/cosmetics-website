'use client'

import { useEffect, useState } from 'react'
import { isPWA } from '@/lib/pwaDetection'
import PDFModal from './PDFModal'

/**
 * Global PDF click handler for PWA mode
 * Intercepts all PDF link clicks and opens them in a modal
 */
export default function PDFClickHandler() {
  const [isPWAMode, setIsPWAMode] = useState(false)
  const [modalState, setModalState] = useState<{ isOpen: boolean; pdfUrl: string; filename: string }>({
    isOpen: false,
    pdfUrl: '',
    filename: ''
  })

  useEffect(() => {
    // Check PWA mode on mount and when window gains focus
    const checkPWAMode = () => {
      const pwaMode = isPWA()
      setIsPWAMode(pwaMode)
      return pwaMode
    }

    const currentPWAMode = checkPWAMode()
    window.addEventListener('focus', checkPWAMode)

    // Only set up click handler if in PWA mode
    if (!currentPWAMode) {
      return () => {
        window.removeEventListener('focus', checkPWAMode)
      }
    }

    // Intercept clicks on PDF links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Find the closest anchor tag or button
      const link = target.closest('a') || target.closest('button')
      if (!link) return

      // Skip if it's already handled by PDFDownloadButton or ProductDocumentation
      if (link.hasAttribute('data-pdf-handled') || 
          link.closest('[data-pdf-handled]') ||
          target.closest('[data-pdf-handled]')) {
        return
      }

      const href = link.getAttribute('href') || (link as HTMLAnchorElement).href
      if (!href) return

      // Check if it's a PDF link
      const hrefLower = href.toLowerCase()
      const downloadAttr = link.getAttribute('download')
      const isPDF = hrefLower.endsWith('.pdf') || 
                   hrefLower.includes('.pdf') ||
                   downloadAttr?.toLowerCase().endsWith('.pdf') ||
                   link.textContent?.toLowerCase().includes('pdf') ||
                   link.getAttribute('aria-label')?.toLowerCase().includes('pdf')

      if (!isPDF) return

      // Get filename from download attribute, href, or link text
      const filename = downloadAttr || 
                       href.split('/').pop()?.split('?')[0] || 
                       link.textContent?.trim() || 
                       'Document.pdf'

      // Prevent default behavior - MUST be in capture phase
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()

      // Open in modal
      setModalState({
        isOpen: true,
        pdfUrl: href,
        filename: filename
      })
    }

    // Add click listener to document
    document.addEventListener('click', handleClick, true) // Use capture phase

    return () => {
      document.removeEventListener('click', handleClick, true)
      window.removeEventListener('focus', checkPWAMode)
    }
  }, []) // Empty deps - check PWA mode inside effect

  if (!isPWAMode) return null

  return (
    <PDFModal
      isOpen={modalState.isOpen}
      onClose={() => setModalState({ isOpen: false, pdfUrl: '', filename: '' })}
      pdfUrl={modalState.pdfUrl}
      filename={modalState.filename}
    />
  )
}
