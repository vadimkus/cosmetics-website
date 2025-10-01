'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import ErrorPage from '@/components/ErrorPage'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import { Product } from '@/types'
import ProductSchema from '@/components/ProductSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import ProductImageGallery from '@/components/product/ProductImageGallery'
import ProductInfo from '@/components/product/ProductInfo'

interface ProductPageClientProps {
  product: Product
}

export default function ProductPageClientOptimized({ product }: ProductPageClientProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { user } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedSize, setSelectedSize] = useState('50g')

  const productImages = product?.images ? JSON.parse(product.images) : [product?.image]

  const handleAddToCart = useCallback(async () => {
    if (!user) {
      router.push('/login')
      return
    }
    
    setIsAdding(true)
    try {
      addItem(product)
      // Simulate a brief loading state
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setIsAdding(false)
    }
  }, [addItem, product, user, router])

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
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
          <Link
            href="/products"
            className="hover:text-primary-600 transition-colors flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
          <span className="flex items-center">/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs md:max-w-md flex items-center">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <ProductImageGallery 
            productImages={productImages} 
            productName={product.name}
          />

          {/* Product Information */}
          <ProductInfo
            product={product}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
            isAdding={isAdding}
          />
        </div>

        {/* Product Description */}
        <div className="mt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
