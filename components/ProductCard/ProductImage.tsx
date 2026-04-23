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
  
  // Products whose card images need object-contain (banner-style / composite images that crop poorly)
  const productNum = product.productNumber || product.id
  const useContain = product.name.includes('INTENSIVE REPAIR COLLAGEN MASK')
    || product.category?.toLowerCase().includes('beauty box')
    || product.name.toLowerCase().includes('beauty box')
    || productNum === '63'
    || productNum === '16' || product.name === 'SNOW BOOSTER'
  const isRevitaGlow = productNum === '63'
  const imageClass = useContain
    ? `w-full h-24 sm:h-32 md:h-40 lg:h-48 object-contain ${isRevitaGlow ? 'bg-white p-1 scale-110' : 'bg-white p-2'}`
    : 'w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover'
  
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
          <div className="overflow-hidden pointer-events-none">
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
            className="overflow-hidden"
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

      {/* New Badge for Revita Glow BB Cream (product 63) */}
      {(product.productNumber === '63' || product.id === '63') && (
        <div className={`absolute top-2 ${locale === 'ar' ? 'right-2' : 'left-2'} z-20`}>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-500 text-white font-bold text-[10px] md:text-xs shadow-sm uppercase tracking-wide">
            {t('common.new')}
          </span>
        </div>
      )}
    </div>
  )
})

export default ProductImage
