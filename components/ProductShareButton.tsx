'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { useProductShare } from '@/hooks/useWebShare'
import ShareButton from './ShareButton'
import { cn } from '@/lib/utils'
import { errorLog } from '@/lib/logger'

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
}

interface ProductShareButtonProps {
  product: Product
  className?: string
  variant?: 'icon' | 'button' | 'fab'
  size?: 'sm' | 'md' | 'lg'
  showPrice?: boolean
}

export default function ProductShareButton({
  product,
  className,
  variant = 'icon',
  size = 'md',
  showPrice = true
}: ProductShareButtonProps) {
  const { shareProduct, isSupported } = useProductShare()
  const [isSharing, setIsSharing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)
    const success = await shareProduct(product)
    
    if (success) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    }
    setIsSharing(false)
  }

  // Create share data for fallback
  const shareTitle = `${product.name} - GENOSYS`
  const priceText = showPrice ? ` - AED ${product.price}` : ''
  const shareText = `Check out this premium Korean beauty product: ${product.name}${priceText}\n\n${product.description.substring(0, 150)}${product.description.length > 150 ? '...' : ''}\n\nDiscover more at GENOSYS Middle East!`
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/products/${product.id}`

  // If Web Share API is supported and it's not an icon variant, use native sharing
  if (isSupported && variant !== 'icon') {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base', 
      lg: 'px-6 py-3 text-lg'
    }

    return (
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={cn(
          'inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50',
          sizeClasses[size],
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
            {variant === 'button' ? 'Share Product' : 'Share'}
          </>
        )}
      </button>
    )
  }

  // Use fallback ShareButton component
  return (
    <ShareButton
      title={shareTitle}
      text={shareText}
      url={shareUrl}
      className={className || ''}
      variant={variant}
      size={size}
      showFallback={true}
    />
  )
}

/**
 * Enhanced product share component with additional features
 */
interface EnhancedProductShareProps {
  product: Product
  className?: string
  showImage?: boolean
  showDetails?: boolean
}

export function EnhancedProductShare({ 
  product, 
  className,
  showImage = false,
  showDetails = true 
}: EnhancedProductShareProps) {
  const { shareProduct, shareProductWithImage, isSupported } = useProductShare()
  const [isSharing, setIsSharing] = useState(false)

  const handleShareWithImage = async () => {
    if (!showImage) {
      return handleShare()
    }

    setIsSharing(true)
    try {
      // Try to fetch the product image and convert to file
      const response = await fetch(product.image)
      const blob = await response.blob()
      const file = new File([blob], `${product.name}.jpg`, { type: blob.type })
      
      const success = await shareProductWithImage(product, file)
      if (success) {
        // Handle success (could show toast, etc.)
      }
    } catch {
      errorLog('Failed to share with image:', error)
      // Fallback to text sharing
      await shareProduct(product)
    }
    setIsSharing(false)
  }

  const handleShare = async () => {
    setIsSharing(true)
    await shareProduct(product)
    setIsSharing(false)
  }

  return (
    <div className={cn('bg-white rounded-lg border p-4', className)}>
      {showDetails && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">AED {product.price}</p>
          <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
        </div>
      )}
      
      <div className="flex gap-2">
        <ProductShareButton
          product={product}
          variant="button"
          size="sm"
          className="flex-1"
        />
        
        {showImage && (
          <button
            onClick={handleShareWithImage}
            disabled={isSharing}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSharing ? '...' : 'With Image'}
          </button>
        )}
      </div>
      
      {!isSupported && (
        <p className="text-xs text-gray-500 mt-2">
          Share via social media or copy link
        </p>
      )}
    </div>
  )
}