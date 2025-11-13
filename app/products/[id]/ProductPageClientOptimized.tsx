'use client'

import ErrorPage from '@/components/ErrorPage'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Product } from '@/types'
import ProductSchema from '@/components/ProductSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import ProductImageGallery from '@/components/product/ProductImageGallery'
import ProductInfo from '@/components/product/ProductInfo'
import ProductDescription from '@/components/product/ProductDescription'

interface ProductPageClientProps {
  product: Product
}

export default function ProductPageClientOptimized({ product }: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('50g')



  if (!product) {
    return <ErrorPage />
  }

  return (
    <>
      <ProductSchema product={product} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: product.category, url: `/products?category=${product.category}` },
          { name: product.name, url: `/products/${product.id}` }
        ]}
      />
      <div className="container mx-auto px-4 py-4 md:py-8 lg:py-16">
        <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm lg:text-base text-gray-600 mb-4 md:mb-6 lg:mb-8" aria-label="Breadcrumb">
          <Link
            href="/products"
            className="hover:text-primary-600 transition-colors flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Products
          </Link>
          <span className="flex items-center">/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs md:max-w-md flex items-center">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductImageGallery product={product} />
          <ProductInfo
            product={product}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </div>

        <ProductDescription product={product} />
      </div>
    </>
  )
}