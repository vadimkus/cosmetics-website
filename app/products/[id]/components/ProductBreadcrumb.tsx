'use client'

import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { Product } from '@/types'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

interface ProductBreadcrumbProps {
  product: Product
  className?: string
}

export default function ProductBreadcrumb({ product, className = '' }: ProductBreadcrumbProps) {
  const { t, locale, dir } = useTranslation()
  const isRtl = dir === 'rtl'
  const Sep = isRtl ? ChevronLeft : ChevronRight

  return (
    <nav
      className={`flex items-center gap-1 md:gap-1.5 text-xs md:text-sm text-gray-500 mb-3 md:mb-4 lg:mb-5 ${className}`}
      aria-label="Breadcrumb"
      dir={dir}
    >
      <Link
        href={getLocalizedPath('/', locale)}
        className="hover:text-primary-600 transition-colors"
      >
        {t('common.home')}
      </Link>
      <Sep className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
      <Link
        href={getLocalizedPath('/products', locale)}
        className="hover:text-primary-600 transition-colors"
      >
        {t('common.products')}
      </Link>
      <Sep className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
      <span className="text-gray-900 font-medium truncate max-w-[160px] md:max-w-xs lg:max-w-md">
        {product.name}
      </span>
    </nav>
  )
}
