'use client'

import { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { errorLog } from '@/lib/logger'
import type { ProductImageProps } from './types'

/**
 * ProductImage Component
 * 
 * Renders the product image section including:
 * - Clickable product image (with PWA/web-specific navigation)
 * - Favorite/heart button
 * - Sold out badge overlay
 * 
 * Optimized for both PWA touch interactions and web hover effects.
 */

// Blur placeholder for images
const BLUR_DATA_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="

const ProductImage = memo(function ProductImage({
  product,
  productPath,
  isPWA,
  animationsEnabled,
  isFavorite,
  isTogglingFavorite,
  onFavorite,
  onNavigate,
  locale,
  t,
  prefetchProps,
}: ProductImageProps) {
  
  const imageAlt = `${product.name} - GENOSYS Korean ${product.category || 'dermacosmetics'} professional skincare product UAE`
  
  // Square preview frame + object-contain, no padding. Product photos are
  // square (1024×1024) studio shots, so they fill the frame edge-to-edge
  // with zero cropping; non-square white-background renders letterbox
  // invisibly on the white frame. Revita Glow (63) keeps its slight zoom to
  // offset the large whitespace baked into its source render.
  const productNum = product.productNumber || product.id
  const isRevitaGlow = productNum === '63'
  const frameClass = 'relative w-full aspect-square overflow-hidden bg-white'
  const imageClass = `w-full h-full object-contain ${isRevitaGlow ? 'scale-110' : ''}`
  
  // PWA-specific touch handling styles
  const pwaStyles = {
    touchAction: 'manipulation' as const,
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none' as const,
  }
  
  // Keyboard navigation handler for PWA
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onNavigate()
    }
  }
  
  return (
    <div className="relative overflow-hidden">
      {/* Product Image - Use direct navigation for PWA, Link for web */}
      {isPWA ? (
        <div 
          role="button"
          tabIndex={0}
          onClick={onNavigate}
          onKeyDown={handleKeyDown}
          className="block w-full cursor-pointer active:opacity-80 transition-opacity"
          style={pwaStyles}
        >
          <div className={`${frameClass} pointer-events-none`}>
            <Image
              src={product.image}
              alt={imageAlt}
              width={300}
              height={300}
              className={imageClass}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              priority={false}
              quality={85}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => errorLog('Image failed to load:', product.image)}
            />
          </div>
        </div>
      ) : (
        <Link href={productPath} className="block" {...prefetchProps}>
          <motion.div
            whileHover={animationsEnabled ? { scale: 1.1 } : {}}
            transition={animationsEnabled ? { duration: 0.4, ease: "easeOut" } : {}}
            className={frameClass}
          >
            <Image
              src={product.image}
              alt={imageAlt}
              width={300}
              height={300}
              className={`${imageClass} cursor-pointer`}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              priority={false}
              quality={85}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => errorLog('Image failed to load:', product.image)}
            />
          </motion.div>
        </Link>
      )}
      
      {/* Favorite Button */}
      <button 
        type="button"
        onClick={onFavorite}
        disabled={isTogglingFavorite}
        className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-20 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95 ${
          isTogglingFavorite ? 'opacity-50' : ''
        }`}
        title={isFavorite ? t('product.removeFromFavorites') : t('product.addToFavorites')}
        aria-label={isFavorite ? t('product.removeFromFavorites') : t('product.addToFavorites')}
        style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      >
        <Heart 
          className={`h-4 w-4 transition-colors ${
            isFavorite 
              ? 'text-red-500 fill-current' 
              : 'text-gray-600 hover:text-red-500'
          }`}
          aria-hidden="true"
        />
      </button>
      
      {/* Sold Out Badge */}
      {!product.inStock && (
        <div className={`absolute top-2 ${locale === 'ar' ? 'left-2' : 'right-2'} z-30`}>
          <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white font-bold text-xs md:text-sm shadow-lg uppercase tracking-wide">
            {t('product.soldOut')}
          </span>
        </div>
      )}

      {/* NOTE: the "New" badge for recent launches renders in ProductInfo's
          category row — never over the image, which uses studio-style shots. */}
    </div>
  )
})

export default ProductImage
