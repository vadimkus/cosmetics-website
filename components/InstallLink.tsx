'use client'

import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface InstallLinkProps {
  onClose?: () => void
  className?: string
}

export default function InstallLink({ onClose, className = '' }: InstallLinkProps = {}) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const { t, dir } = useTranslation()

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(iOS)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    }
    
    // Call onClose callback if provided (e.g., to close mobile menu)
    if (onClose) {
      onClose()
    }
  }

  // Don't show if already installed
  if (isInstalled) {
    return null
  }

  // For iOS, show instructions
  if (isIOS) {
    return (
      <span className={`text-gray-600 hover:text-primary-600 transition-colors py-1 md:py-2 px-1 md:px-2 touch-manipulation min-h-[36px] md:min-h-[44px] flex items-center justify-center text-xs md:text-sm ${className}`}>
        {t('pwa.installIOS') || 'Tap Share → Add to Home Screen'}
      </span>
    )
  }

  // For Android/Chrome, show install link (always show on mobile, even if prompt not ready)
  return (
    <button
      onClick={handleInstallClick}
      disabled={!deferredPrompt}
      className={`inline-flex items-center gap-1 text-xs md:text-sm text-gray-600 hover:text-primary-600 transition-colors touch-manipulation min-h-[36px] md:min-h-[44px] flex items-center justify-center py-1 md:py-2 px-1 md:px-2 ${!deferredPrompt ? 'opacity-50 cursor-not-allowed' : ''} ${dir === 'rtl' ? 'flex-row-reverse' : ''} ${className}`}
    >
      <Download className="h-3 w-3 md:h-4 md:w-4" />
      {t('pwa.installApp') || 'Install App'}
    </button>
  )
}

