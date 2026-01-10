'use client'

import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Extended Window interface for Opera detection
interface WindowWithOpera extends Window {
  opera?: string
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
    // Only enable PWA functionality on mobile devices
    const windowWithOpera = window as WindowWithOpera
    const userAgent = navigator.userAgent || navigator.vendor || windowWithOpera.opera || ''
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    
    if (!isMobile) {
      return // Skip PWA setup on desktop
    }

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
      // Show native install prompt if available
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    } else {
      // Show manual instructions if prompt not available
      alert(
        'To install this app on your Android device:\n\n' +
        '1. Tap the menu button (three dots) in your browser\n' +
        '2. Select "Add to Home screen" or "Install app"\n' +
        '3. Tap "Add" or "Install" to confirm\n\n' +
        'Alternatively, look for an install banner at the top of your browser.\n\n' +
        'The app icon will appear on your home screen!'
      )
    }
    
    // Call onClose callback if provided (e.g., to close mobile menu)
    if (onClose) {
      onClose()
    }
  }

  const handleIOSClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // Show alert with instructions for iOS users
    alert(
      'To install this app on your iPhone:\n\n' +
      '1. Tap the Share button (square with arrow) at the bottom of your screen\n' +
      '2. Scroll down and tap "Add to Home Screen"\n' +
      '3. Tap "Add" in the top right corner\n\n' +
      'The app icon will appear on your home screen!'
    )
    
    // Call onClose callback if provided (e.g., to close mobile menu)
    if (onClose) {
      onClose()
    }
  }

  // Don't show if already installed
  if (isInstalled) {
    return null
  }

  // For iOS, show clickable button with instructions
  if (isIOS) {
    return (
      <button
        onClick={handleIOSClick}
        className={`text-gray-600 hover:text-primary-600 transition-colors py-1 md:py-2 px-1 md:px-2 touch-manipulation min-h-[36px] md:min-h-[44px] flex items-center justify-center text-xs md:text-sm w-full text-left ${className}`}
      >
        {t('pwa.installIOS') || 'Tap Share → Add to Home Screen'}
      </button>
    )
  }

  // For Android/Chrome, show install link (always clickable, shows instructions if prompt not ready)
  return (
    <button
      onClick={handleInstallClick}
      className={`inline-flex items-center gap-1 text-xs md:text-sm text-gray-600 hover:text-primary-600 transition-colors touch-manipulation min-h-[36px] md:min-h-[44px] flex items-center justify-center py-1 md:py-2 px-1 md:px-2 w-full text-left ${dir === 'rtl' ? 'flex-row-reverse' : ''} ${className}`}
    >
      <Download className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
      {t('pwa.installApp') || 'Install App'}
    </button>
  )
}

