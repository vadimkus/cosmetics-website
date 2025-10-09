'use client'

import Link from 'next/link'
import { Product } from '@/types'

interface ProductBreadcrumbProps {
  product: Product
}

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm md:text-sm text-gray-600 mb-4 md:mb-6 py-1 min-h-[32px] md:min-h-[36px]" aria-label="Breadcrumb">
      <Link 
        href="/"
        className="hover:text-primary-600 transition-colors flex items-center"
      >
        Home
      </Link>
      <span className="flex items-center">/</span>
      <Link 
        href="/products"
        className="hover:text-primary-600 transition-colors flex items-center"
      >
        Products
      </Link>
      <span className="flex items-center">/</span>
      <span className="text-gray-900 font-medium truncate max-w-xs md:max-w-md flex items-center">
        {product.name}
      </span>
    </nav>
  )
}
