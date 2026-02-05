'use client'

import { useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  height?: 'auto' | 'full' | 'medium' | 'large'
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  closeOnBackdropClick = true,
  height = 'large'
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when sheet is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose()
    }
  }, [closeOnBackdropClick, onClose])

  // Height classes
  const heightClasses = {
    auto: 'max-h-[90vh]',
    medium: 'h-[60vh]',
    large: 'h-[75vh] md:h-[65vh]',
    full: 'h-[95vh]'
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-end justify-center"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'bottom-sheet-title' : undefined}
    >
      {/* Backdrop */}
      <div 
        className={`
          absolute inset-0 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
      />
      
      {/* Sheet */}
      <div 
        ref={sheetRef}
        className={`
          relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          ${heightClasses[height]}
          flex flex-col
        `}
      >
        {/* Drag handle indicator */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
            {title && (
              <h2 
                id="bottom-sheet-title" 
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}
            {!title && <div />}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}
