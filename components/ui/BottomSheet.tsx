'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { X } from 'lucide-react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  height?: 'auto' | 'full' | 'medium' | 'large'
  enableSwipeDown?: boolean
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  closeOnBackdropClick = true,
  height = 'large',
  enableSwipeDown = true
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLDivElement>(null)
  
  // Swipe-down gesture state
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartY = useRef(0)
  const currentY = useRef(0)

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
  
  // Reset drag state when sheet opens/closes
  useEffect(() => {
    if (!isOpen) {
      setDragY(0)
      setIsDragging(false)
    }
  }, [isOpen])

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose()
    }
  }, [closeOnBackdropClick, onClose])
  
  // Swipe-down gesture handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enableSwipeDown) return
    touchStartY.current = e.touches[0].clientY
    currentY.current = e.touches[0].clientY
    setIsDragging(true)
  }, [enableSwipeDown])
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enableSwipeDown || !isDragging) return
    
    currentY.current = e.touches[0].clientY
    const deltaY = currentY.current - touchStartY.current
    
    // Only allow dragging down (positive deltaY)
    if (deltaY > 0) {
      setDragY(deltaY)
    }
  }, [enableSwipeDown, isDragging])
  
  const handleTouchEnd = useCallback(() => {
    if (!enableSwipeDown || !isDragging) return
    
    setIsDragging(false)
    
    // If dragged more than 100px, close the sheet
    if (dragY > 100) {
      onClose()
    }
    
    // Reset drag position with animation
    setDragY(0)
  }, [enableSwipeDown, isDragging, dragY, onClose])

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
        style={{
          opacity: isDragging ? Math.max(0.5 - dragY / 400, 0.1) : undefined
        }}
      />
      
      {/* Sheet */}
      <div 
        ref={sheetRef}
        className={`
          relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl
          ${!isDragging ? 'transition-transform duration-300 ease-out' : ''}
          ${heightClasses[height]}
          flex flex-col
        `}
        style={{
          transform: `translateY(${isOpen ? dragY : '100%'}px)`
        }}
      >
        {/* Drag handle indicator - touchable area for swipe */}
        <div 
          ref={dragHandleRef}
          className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header - also draggable */}
        {(title || showCloseButton) && (
          <div 
            className="flex items-center justify-between px-6 py-3 border-b border-gray-100 touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
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
