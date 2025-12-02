'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Share2 } from 'lucide-react'
import { Product } from '@/types'
import { getProductVideoUrl } from '@/data/productConfig'
import { useTranslation } from '@/hooks/useTranslation'
import { errorLog } from '@/lib/logger'

interface ProductImageGalleryProps {
  product: Product
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [thumbnailErrors, setThumbnailErrors] = useState<Record<number, boolean>>({})
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, bottom: 0 })
  const shareMenuRef = useRef<HTMLDivElement>(null)
  const shareButtonRef = useRef<HTMLButtonElement>(null)
  const videoUrl = getProductVideoUrl(product.id)
  const { t, dir } = useTranslation()
  
  // Check if this is the Holiday Kit
  const isHolidayKit = product.id === 'cmhf1a6p400000xfa0iu3bw42' || product.productNumber === '54' || product.category === 'kits'
  
  // Generate fixed positions for stars and sparkles
  const holidayElements = useMemo(() => {
    if (!isHolidayKit) return { stars: [], sparkles: [] }
    
    const stars = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 0.3,
      duration: 3 + Math.random() * 2,
    }))
    
    const sparkles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 0.4,
      duration: 2 + Math.random() * 1.5,
    }))
    
    return { stars, sparkles }
  }, [isHolidayKit])

  const getProductImages = () => {
    if (product.images) {
      try {
        const parsedImages = JSON.parse(product.images)
        return Array.isArray(parsedImages) ? parsedImages : [product.image]
      } catch {
        return [product.image]
      }
    }
    return [product.image]
  }

  const productImages = getProductImages()

  // Reset error state when selected image changes
  useEffect(() => {
    setImageError(false)
  }, [selectedImage])

  // Close share menu when clicking outside
  useEffect(() => {
    if (!showShareMenu) return

    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showShareMenu])

  // Get share URL and text
  const getShareData = () => {
    const productUrl = typeof window !== 'undefined' ? window.location.href : ''
    const shareText = `${product.name} - ${product.description.substring(0, 100)}...`
    return { productUrl, shareText }
  }

  // Share via WhatsApp
  const shareWhatsApp = () => {
    if (isSharing) return
    setIsSharing(true)
    try {
      const { productUrl, shareText } = getShareData()
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`
      window.open(whatsappUrl, '_blank')
      setShowShareMenu(false)
    } catch (error) {
      errorLog('Error sharing to WhatsApp:', error)
    } finally {
      setTimeout(() => setIsSharing(false), 500)
    }
  }

  // Share via Telegram
  const shareTelegram = () => {
    if (isSharing) return
    setIsSharing(true)
    try {
      const { productUrl, shareText } = getShareData()
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`
      window.open(telegramUrl, '_blank')
      setShowShareMenu(false)
    } catch (error) {
      errorLog('Error sharing to Telegram:', error)
    } finally {
      setTimeout(() => setIsSharing(false), 500)
    }
  }

  // Share via Instagram (copy link - Instagram doesn't have direct web share URL)
  const shareInstagram = async () => {
    if (isSharing) return
    setIsSharing(true)
    try {
      const { productUrl } = getShareData()
      await navigator.clipboard.writeText(productUrl)
      const message = dir === 'rtl' ? 'تم نسخ الرابط! يمكنك لصقه في Instagram' : 'Link copied! You can paste it in Instagram'
      alert(message)
      setShowShareMenu(false)
    } catch (error) {
      errorLog('Failed to copy:', error)
      const { productUrl } = getShareData()
      alert(productUrl)
    } finally {
      setTimeout(() => setIsSharing(false), 500)
    }
  }

  // Toggle share menu and calculate position
  const toggleShareMenu = () => {
    if (!showShareMenu && shareButtonRef.current) {
      const rect = shareButtonRef.current.getBoundingClientRect()
      setDropdownPosition({
        left: dir === 'rtl' ? window.innerWidth - rect.right : rect.left,
        bottom: window.innerHeight - rect.top + 8 // 8px spacing
      })
    }
    setShowShareMenu(!showShareMenu)
  }

  return (
    <div className="space-y-2 md:space-y-4">
      {/* Main Image or Video */}
      <div className="w-full max-w-xs md:max-w-md mx-auto aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
        {/* Stock Badge */}
        <div className={`absolute top-2 md:top-3 ${dir === 'rtl' ? 'left-2 md:left-3' : 'right-2 md:right-3'} z-30`}>
          {product.inStock ? (
            <span className={`inline-flex items-center px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-green-500 text-white font-medium text-xs md:text-sm shadow-lg ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <span className={`w-1.5 h-1.5 bg-white rounded-full animate-pulse ${dir === 'rtl' ? 'ml-1.5' : 'mr-1.5'}`}></span>
              {t('product.inStock')}
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-red-600 text-white font-bold text-sm md:text-base shadow-xl uppercase tracking-wide">
              {t('product.soldOut')}
            </span>
          )}
        </div>
        
        {/* Share Button */}
        <button
          ref={shareButtonRef}
          onClick={toggleShareMenu}
          className={`absolute bottom-2 md:bottom-3 ${dir === 'rtl' ? 'right-2 md:right-3' : 'left-2 md:left-3'} z-30 flex items-center justify-center w-[15px] h-[15px] md:w-[22px] md:h-[22px] bg-white/95 backdrop-blur-sm hover:bg-white rounded-full border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${showShareMenu ? 'bg-white shadow-xl ring-2 ring-primary-500/20' : ''}`}
          aria-label={t('common.share')}
          title={t('common.share')}
          aria-expanded={showShareMenu}
        >
          <Share2 className={`h-[11px] w-[11px] md:h-[17px] md:w-[17px] text-gray-800 transition-colors duration-300 ${showShareMenu ? 'text-primary-600' : ''} ${dir === 'rtl' ? 'scale-x-[-1]' : ''}`} />
        </button>
        {product.id === '3' && selectedImage === 2 && videoUrl ? (
          <iframe
            className="w-full h-full rounded-lg"
            src={videoUrl}
            title={`${product.name} Video`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
          <>
            {imageError ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📷</div>
                  <div className="text-sm">Image not available</div>
                </div>
              </div>
            ) : (
              <Image
                src={(() => {
                  const imageSrc = productImages[selectedImage] || product.image
                  if (!imageSrc) return '/images/placeholder.png'
                  // For product 57 (Charming Look), add timestamp-based cache busting
                  // This ensures the new image loads on mobile devices
                  const separator = imageSrc.includes('?') ? '&' : '?'
                  let version = `${product.id}-${imageSrc.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'img'}`
                  // Special handling for product 57 to force image refresh
                  if (product.id === 'cmhoyw7d500008o9tdprqkkhb' || product.productNumber === '57') {
                    // Use a fixed version number that changes when image is updated
                    // Update this number when the image file changes
                    version = `v20251108-${version}`
                  }
                  return `${imageSrc}${separator}v=${version}`
                })()}
                alt={`${product.name} - GENOSYS Korean dermacosmetics product image ${selectedImage + 1} of ${productImages.length}`}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority={selectedImage === 0}
                quality={90}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                onError={() => {
                  setImageError(true)
                }}
                onLoad={() => {
                  setImageError(false)
                }}
              />
            )}
            
            {/* Holiday Star Animation Overlay */}
            {isHolidayKit && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                {holidayElements.stars.map((star) => (
                  <div
                    key={star.id}
                    className="absolute animate-twinkle"
                    style={{
                      left: `${star.left}%`,
                      top: `${star.top}%`,
                      animationDelay: `${star.delay}s`,
                      animationDuration: `${star.duration}s`,
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-yellow-400 drop-shadow-lg"
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ))}
                
                {/* Sparkle effects */}
                {holidayElements.sparkles.map((sparkle) => (
                  <div
                    key={`sparkle-${sparkle.id}`}
                    className="absolute animate-sparkle"
                    style={{
                      left: `${sparkle.left}%`,
                      top: `${sparkle.top}%`,
                      animationDelay: `${sparkle.delay}s`,
                      animationDuration: `${sparkle.duration}s`,
                    }}
                  >
                    <div className="w-2 h-2 bg-yellow-300 rounded-full shadow-lg"></div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Share Menu Dropdown - Outside image container to avoid overflow clipping */}
      {showShareMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowShareMenu(false)}
          />
          <div 
            ref={shareMenuRef}
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] md:min-w-[160px] overflow-hidden"
            style={{
              [dir === 'rtl' ? 'right' : 'left']: `${dropdownPosition.left}px`,
              bottom: `${dropdownPosition.bottom}px`,
              transform: dir === 'rtl' ? 'translateX(0)' : 'translateX(0)'
            }}
          >
            <button
              onClick={shareWhatsApp}
              disabled={isSharing}
              className={`w-full text-left px-3 py-2.5 md:py-3 text-sm transition-colors flex items-center gap-2 md:gap-3 touch-manipulation ${isSharing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="#25D366"/>
              </svg>
              <span className="font-medium text-gray-700">WhatsApp</span>
            </button>
            <button
              onClick={shareTelegram}
              disabled={isSharing}
              className={`w-full text-left px-3 py-2.5 md:py-3 text-sm transition-colors flex items-center gap-2 md:gap-3 touch-manipulation border-t border-gray-100 ${isSharing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.686z" fill="#0088cc"/>
              </svg>
              <span className="font-medium text-gray-700">Telegram</span>
            </button>
            <button
              onClick={shareInstagram}
              disabled={isSharing}
              className={`w-full text-left px-3 py-2.5 md:py-3 text-sm transition-colors flex items-center gap-2 md:gap-3 touch-manipulation border-t border-gray-100 ${isSharing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#E4405F"/>
              </svg>
              <span className="font-medium text-gray-700">Instagram</span>
            </button>
          </div>
        </>
      )}

      {/* Thumbnail Navigation */}
      {productImages.length > 1 && (
        <div className="flex gap-1.5 md:gap-2 justify-center">
          {productImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-12 h-12 md:w-16 md:h-16 rounded-md md:rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index
                  ? 'border-primary-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {thumbnailErrors[index] ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-xs text-gray-400">📷</span>
                </div>
              ) : (
                <Image
                  src={(() => {
                    const imageSrc = img || product.image
                    if (!imageSrc) return '/images/placeholder.png'
                    const separator = imageSrc.includes('?') ? '&' : '?'
                    const version = `${product.id}-${imageSrc.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'img'}`
                    return `${imageSrc}${separator}v=${version}`
                  })()}
                  alt={`${product.name} - GENOSYS product thumbnail ${index + 1} of ${productImages.length}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  onError={() => {
                    setThumbnailErrors(prev => ({ ...prev, [index]: true }))
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
