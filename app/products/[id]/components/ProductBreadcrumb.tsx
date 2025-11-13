'use client'

import Link from 'next/link'
import { Product } from '@/types'

interface ProductBreadcrumbProps {
  product: Product
}

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-600 mb-3 md:mb-4 lg:mb-6 py-1 min-h-[28px] md:min-h-[32px]" aria-label="Breadcrumb">
      <Link 
        href="/"
        className="hover:text-primary-600 transition-colors flex items-center"
      >
        Home
      </Link>
      <span className="flex items-center text-gray-400">/</span>
      <Link 
        href="/products"
        className="hover:text-primary-600 transition-colors flex items-center"
      >
        Products
      </Link>
      <span className="flex items-center text-gray-400">/</span>
      <span className="text-gray-900 font-medium truncate max-w-[200px] md:max-w-xs lg:max-w-md flex items-center">
        {product.name}
      </span>
    </nav>
  )
}
