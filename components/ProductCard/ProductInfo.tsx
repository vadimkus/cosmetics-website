'use client'

import { memo } from 'react'
import Link from 'next/link'
import { translateCategory } from '@/utils/categoryTranslations'
import { translateSize } from '@/utils/sizeTranslations'
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
  
  return (
    <div className="p-3 md:p-4 flex flex-col">
      {/* Category */}
      <div className="mb-2">
        <span className="text-xs md:text-sm text-primary-600 font-medium">
          {translateCategory(product.category, locale)}
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
            <h3 className="text-sm md:text-lg font-semibold text-gray-800 line-clamp-2 hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
          </div>
        ) : (
          <Link href={productPath} {...prefetchProps}>
            <h3 className="text-sm md:text-lg font-semibold text-gray-800 line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>
        )}
      </div>
      
      {/* Size and Stock Row */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
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
      
      {/* Description */}
      <p 
        id={descriptionId}
        className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-4 md:line-clamp-2"
      >
        {cleanDescription}
      </p>
    </div>
  )
})

export default ProductInfo
