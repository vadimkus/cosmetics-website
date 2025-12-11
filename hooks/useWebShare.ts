'use client'

import { useCallback } from 'react'
import { debugLog, warnLog } from '@/lib/logger'

interface ShareData {
  title?: string
  text?: string
  url?: string
  files?: File[]
}

interface UseWebShareReturn {
  share: (data: ShareData) => Promise<boolean>
  isSupported: boolean
  canShareFiles: boolean
}

export const useWebShare = (): UseWebShareReturn => {
  const isSupported = typeof navigator !== 'undefined' && 'share' in navigator
  const canShareFiles = typeof navigator !== 'undefined' && 
    'canShare' in navigator && 
    navigator.canShare && 
    navigator.canShare({ files: [] })

  const share = useCallback(async (data: ShareData): Promise<boolean> => {
    if (!isSupported) {
      debugLog('Web Share API not supported')
      return false
    }

    try {
      // Check if the data can be shared
      if (navigator.canShare && !navigator.canShare(data)) {
        warnLog('Cannot share this data')
        return false
      }

      await navigator.share(data)
      debugLog('Content shared successfully', data)
      return true
    } catch (error) {
      // User cancelled or sharing failed
      if ((error as Error).name === 'AbortError') {
        debugLog('User cancelled sharing')
      } else {
        warnLog('Failed to share:', error)
      }
      return false
    }
  }, [isSupported])

  return {
    share,
    isSupported,
    canShareFiles
  }
}

/**
 * Hook specifically for sharing products
 */
interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
}

export const useProductShare = () => {
  const { share, isSupported } = useWebShare()

  const shareProduct = useCallback(async (product: Product): Promise<boolean> => {
    const productUrl = `${window.location.origin}/products/${product.id}`
    const shareData: ShareData = {
      title: `${product.name} - GENOSYS`,
      text: `Check out this premium beauty product: ${product.name}\n\n${product.description.substring(0, 100)}...`,
      url: productUrl
    }

    return await share(shareData)
  }, [share])

  const shareProductWithImage = useCallback(async (product: Product, imageFile?: File): Promise<boolean> => {
    const productUrl = `${window.location.origin}/products/${product.id}`
    
    if (imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
      // Share with image if supported
      const shareData: ShareData = {
        title: `${product.name} - GENOSYS`,
        text: `Check out this premium beauty product: ${product.name}`,
        url: productUrl,
        files: [imageFile]
      }
      return await share(shareData)
    } else {
      // Fallback to text sharing
      return await shareProduct(product)
    }
  }, [share, shareProduct])

  const shareCart = useCallback(async (items: Array<{name: string; quantity: number}>): Promise<boolean> => {
    const cartText = items.map(item => `• ${item.name} (${item.quantity})`).join('\n')
    const shareData: ShareData = {
      title: 'My GENOSYS Cart',
      text: `Check out my GENOSYS beauty products:\n\n${cartText}\n\nShop at: ${window.location.origin}`,
      url: `${window.location.origin}/cart`
    }

    return await share(shareData)
  }, [share])

  const sharePage = useCallback(async (title?: string, description?: string): Promise<boolean> => {
    const shareData: ShareData = {
      title: title || document.title,
      text: description || 'Discover premium Korean beauty products at GENOSYS Middle East',
      url: window.location.href
    }

    return await share(shareData)
  }, [share])

  return {
    shareProduct,
    shareProductWithImage,
    shareCart,
    sharePage,
    isSupported
  }
}