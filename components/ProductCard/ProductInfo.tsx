'use client'

import { memo } from 'react'
import Link from 'next/link'
import { translateCategory } from '@/utils/categoryTranslations'
import { translateSize } from '@/utils/sizeTranslations'
import { formatProductDisplayName } from '@/utils/formatProductDisplayName'
import { useTranslation } from '@/hooks/useTranslation'
import { isNewLaunchProduct } from '@/lib/productBadges'
import type { ProductInfoProps } from './types'

/**
 * ProductInfo Component
 * 
 * Renders product information including:
 * - Category label
 * - Product name (clickable)
 * - Size badge
 * - Stock status indicator
 * - Product description
 * 
 * Handles both PWA touch navigation and web link navigation.
 */

const ProductInfo = memo(function ProductInfo({
  product,
  productPath,
  isPWA,
  locale,
  description,
  descriptionId,
  stockId,
  onNavigate,
  t,
  prefetchProps,
}: ProductInfoProps) {
  const { messages } = useTranslation()

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
  
  // Clean description - remove HTML tags
  const cleanDescription = description ? description.replace(/<[^>]*>/g, '').trim() : ''
  
  // Special size handling for specific products
  const displaySize = product.id === '37' 
    ? '38g x 5ea (5 masks, 1 box)' 
    : translateSize(product.size, locale, product.category)
  
  // Stock display text
  const stockText = product.id === '47' 
    ? t('products.orderByRequest') 
    : t('product.inStock')
  
  // Recent launches get a "New" pill on the category row (kept off the
  // image so studio-style product shots stay clean). See lib/productBadges.ts.
  const isNewLaunch = isNewLaunchProduct(product.id, product.productNumber)
  const displayName = formatProductDisplayName(product.name)
  const isBeautyBoxTitle = /Beauty\s+Box$/i.test(product.name)

  return (
    <div className="p-3 md:p-4 flex flex-col">
      {/* Category (+ New pill for recent launches) */}
      <div className="mb-2 flex items-center gap-2">
        {isNewLaunch && (
          <span className="inline-flex items-center rounded-full bg-gray-900 px-2 py-0.5 text-[9px] md:text-[10px] font-semibold uppercase tracking-wide text-white">
            {t('common.new')}
          </span>
        )}
        <span className="text-xs md:text-sm text-primary-600 font-medium">
          {translateCategory(product.category, messages)}
        </span>
      </div>
      
      {/* Product Name */}
      <div className="mb-2">
        {isPWA ? (
          <div
            role="button"
            tabIndex={0}
            onClick={onNavigate}
            onKeyDown={handleKeyDown}
            className="cursor-pointer active:opacity-70 transition-opacity"
            style={pwaStyles}
          >
            <h3
              className={`text-sm md:text-lg font-semibold text-gray-800 hover:text-primary-600 transition-colors ${
                isBeautyBoxTitle ? '' : 'line-clamp-2'
              }`}
            >
              {displayName}
            </h3>
          </div>
        ) : (
          <Link href={productPath} {...prefetchProps}>
            <h3
              className={`text-sm md:text-lg font-semibold text-gray-800 hover:text-primary-600 transition-colors cursor-pointer ${
                isBeautyBoxTitle ? '' : 'line-clamp-2'
              }`}
            >
              {displayName}
            </h3>
          </Link>
        )}
      </div>
      
      {/* Size and Stock Row */}
      <div className="product-card__meta flex items-center gap-2 mb-2 flex-wrap">
        {/* Size Badge */}
        {(product.size || product.id === '37') && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] md:text-xs font-medium bg-gray-100 text-gray-700">
            {t('product.size')}: {displaySize}
          </span>
        )}
        
        {/* Stock Status */}
        <span 
          id={stockId}
          className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] md:text-xs font-medium ${
            product.inStock ? 'bg-green-100 text-green-800' : 'sr-only'
          }`}
          aria-label={product.inStock ? t('product.inStock') : t('product.soldOut')}
        >
          {product.inStock ? stockText : t('product.soldOut')}
        </span>
      </div>
      
      {/* Description — clamped to 2 lines on all breakpoints (was 4 on mobile, too noisy) */}
      <p 
        id={descriptionId}
        className="product-card__desc text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2"
      >
        {cleanDescription}
      </p>
    </div>
  )
})

export default ProductInfo
