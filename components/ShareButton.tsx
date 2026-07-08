'use client'

import { useState, useRef, useEffect } from 'react'
import { Share2, Check, Copy, MessageCircle, Send } from 'lucide-react'
import { Instagram } from '@/components/icons/BrandIcons'
import { useWebShare } from '@/hooks/useWebShare'
import { cn } from '@/lib/utils'
import { errorLog } from '@/lib/logger'

interface ShareButtonProps {
  title: string
  text: string
  url?: string
  className?: string
  variant?: 'icon' | 'button' | 'fab'
  size?: 'sm' | 'md' | 'lg'
  showFallback?: boolean
}

export default function ShareButton({
  title,
  text,
  url = '',
  className,
  variant = 'button',
  size = 'md',
  showFallback = true
}: ShareButtonProps) {
  const { share, isSupported } = useWebShare()
  const [isSharing, setIsSharing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showFallbackMenu, setShowFallbackMenu] = useState(false)
  const successTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up timer on unmount
  useEffect(() => () => { if (successTimerRef.current) clearTimeout(successTimerRef.current) }, [])

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  const handleShare = async () => {
    if (isSupported) {
      setIsSharing(true)
      const success = await share({ title, text, url: shareUrl })
      
      if (success) {
        setShowSuccess(true)
        successTimerRef.current = setTimeout(() => setShowSuccess(false), 2000)
      }
      setIsSharing(false)
    } else if (showFallback) {
      setShowFallbackMenu(true)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${title}\n\n${text}\n\n${shareUrl}`)
      setShowSuccess(true)
      setShowFallbackMenu(false)
      successTimerRef.current = setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      errorLog('Failed to copy to clipboard:', error)
    }
  }

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${text}\n\n${shareUrl}`)}`
    window.open(whatsappUrl, '_blank')
    setShowFallbackMenu(false)
  }

  const shareViaTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`${title}\n\n${text}`)}`
    window.open(telegramUrl, '_blank')
    setShowFallbackMenu(false)
  }

  const shareViaInstagram = () => {
    // Instagram doesn't have direct web sharing, so copy link and show success message
    copyToClipboard()
    // Success is already shown by copyToClipboard's setShowSuccess
  }

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  }

  const buttonSizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  if (variant === 'fab') {
    return (
      <div className="relative">
        <button
          onClick={handleShare}
          disabled={isSharing}
          className={cn(
            'fixed bottom-20 right-4 z-30 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center',
            sizeClasses[size],
            isSharing && 'scale-95',
            showSuccess && 'bg-green-500',
            className
          )}
        >
          {showSuccess ? (
            <Check className="h-5 w-5" />
          ) : isSharing ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Share2 className="h-5 w-5" />
          )}
        </button>

        {/* Fallback menu */}
        {showFallbackMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowFallbackMenu(false)}
            />
            <div className="fixed bottom-32 right-4 z-50 bg-white rounded-lg shadow-xl border p-2 min-w-[160px]">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
              >
                <Copy className="h-4 w-4 text-gray-500" />
                Copy Link
              </button>
              <button
                onClick={shareViaWhatsApp}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-green-500" />
                WhatsApp
              </button>
              <button
                onClick={shareViaTelegram}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
              >
                <Send className="h-4 w-4 text-blue-500" />
                Telegram
              </button>
              <button
                onClick={shareViaInstagram}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
              >
                <Instagram className="h-4 w-4 text-pink-500" />
                Instagram
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={handleShare}
          disabled={isSharing}
          title="Share"
          className={cn(
            'inline-flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors',
            sizeClasses[size],
            isSharing && 'opacity-50',
            showSuccess && 'text-green-500',
            className
          )}
        >
          {showSuccess ? (
            <Check className="h-5 w-5" />
          ) : isSharing ? (
            <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Share2 className="h-5 w-5" />
          )}
        </button>

        {/* Fallback menu for icon variant */}
        {showFallbackMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowFallbackMenu(false)}
            />
            <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-lg shadow-xl border p-2 min-w-[140px]">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
              >
                <Copy className="h-4 w-4 text-gray-500" />
                Copy
              </button>
              <button
                onClick={shareViaWhatsApp}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-green-500" />
                WhatsApp
              </button>
              <button
                onClick={shareViaTelegram}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
              >
                <Send className="h-4 w-4 text-blue-500" />
                Telegram
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  // Button variant (default)
  return (
    <div className="relative">
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={cn(
          'inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50',
          buttonSizeClasses[size],
          showSuccess && 'bg-green-500',
          className
        )}
      >
        {showSuccess ? (
          <>
            <Check className="h-4 w-4" />
            Shared!
          </>
        ) : isSharing ? (
          <>
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sharing...
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" />
            Share
          </>
        )}
      </button>

      {/* Fallback menu for button variant */}
      {showFallbackMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowFallbackMenu(false)}
          />
          <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-lg shadow-xl border p-2 min-w-[160px]">
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
            >
              <Copy className="h-4 w-4 text-gray-500" />
              Copy Link
            </button>
            <button
              onClick={shareViaWhatsApp}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-green-500" />
              WhatsApp
            </button>
            <button
              onClick={shareViaTelegram}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
            >
              <Send className="h-4 w-4 text-blue-500" />
              Telegram
            </button>
            <button
              onClick={shareViaInstagram}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
            >
              <Instagram className="h-4 w-4 text-pink-500" />
              Instagram
            </button>
          </div>
        </>
      )}
    </div>
  )
}