'use client'

import { Product } from '@/types'
import { Star } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { translateSize } from '@/utils/sizeTranslations'
import { translateCategory } from '@/utils/categoryTranslations'
import { restockNote } from '@/lib/restockInfo'

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { t, dir, locale, messages } = useTranslation()
  
  return (
    <div className="space-y-6" dir={dir}>
      {/* Product Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          {product.name}
        </h1>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-sm text-[var(--color-text-secondary)]">({(product.rating || 5.0).toFixed(1)}/5)</span>
        </div>
      </div>

      {/* Size Display (if applicable) */}
      {(product.size || product.id === '37') && (
        <div className="text-sm font-medium text-[var(--color-text-secondary)]">
          {t('product.size')}: {product.id === '37' ? '38g x 5ea (5 masks, 1 box)' : translateSize(product.size, locale, product.category)}
        </div>
      )}

      {/* Category Badge */}
      <div className="flex items-center gap-2">
        <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-xs font-medium">
          {product.category.split(',').map(cat => translateCategory(cat.trim(), messages)).join(', ')}
        </span>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          product.inStock
            ? 'bg-[var(--status-green-bg)] text-[var(--status-green-deep)]'
            : restockNote(product.id, locale)
              ? 'bg-[var(--status-orange-bg)] text-[var(--status-orange)]'
              : 'bg-red-100 text-red-800'
        }`}>
          {product.inStock ? t('product.inStock') : (restockNote(product.id, locale) || t('product.outOfStock'))}
        </span>
      </div>
    </div>
  )
}



