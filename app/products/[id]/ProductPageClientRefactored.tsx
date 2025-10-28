'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { useAuth } from '@/components/AuthProvider'
import ErrorPage from '@/components/ErrorPage'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import { Product } from '@/types'
import ProductSchema from '@/components/ProductSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import ProductImageGallery from '@/components/product/ProductImageGallery'
import ProductDetails from '@/components/product/ProductDetails'
import ProductPriceDisplay from '@/components/product/ProductPriceDisplay'
import ProductVariantSelector from '@/components/product/ProductVariantSelector'
import ProductQuantityCart from '@/components/product/ProductQuantityCart'
import ProductContentDisplay from '@/components/product/ProductContentDisplay'
import TrustBadges from '@/components/product/TrustBadges'
import { 
  getPriceForSize, 
  hasProductSizeVariants, 
  hasProductColorVariants,
  getProductSizeOptions,
  getProductColorOptions
} from '@/utils/productPricing'

interface ProductPageClientProps {
  product: Product
}

export default function ProductPageClientRefactored({ product }: ProductPageClientProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { user } = useAuth()
  
  // Variant state
  const sizeOptions = getProductSizeOptions(product.id)
  const colorOptions = getProductColorOptions(product.id)
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]?.value || '50g')
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]?.value || 'Beige')

  // Calculate current price based on selected variant
  const currentPrice = useCallback(() => {
    if (hasProductSizeVariants(product.id)) {
      return getPriceForSize(product, selectedSize)
    }
    return product.price
  }, [product, selectedSize])

  // Handle add to cart
  const handleAddToCart = useCallback(async (quantity: number) => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      const colorToPass = hasProductColorVariants(product.id) ? selectedColor : undefined
      const sizeToPass = hasProductSizeVariants(product.id) ? selectedSize : undefined
      
      // Create a modified product with the correct price for variant products
      const productToAdd = hasProductSizeVariants(product.id)
        ? { ...product, price: getPriceForSize(product, selectedSize) }
        : product
      
      await addItem(productToAdd, quantity, colorToPass, sizeToPass)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }, [user, product, selectedSize, selectedColor, addItem, router])

  // Handle toggle favorite
  const handleToggleFavorite = useCallback(() => {
    if (!user) {
      router.push('/login')
      return
    }
    toggleFavorite(product)
  }, [user, product, toggleFavorite, router])

  if (!product) {
    return <ErrorPage />
  }

  // Prepare variant data for selector
  const availableSizes = sizeOptions.map(option => ({
    ...option,
    price: getPriceForSize(product, option.value)
  }))

  const availableColors = colorOptions

  return (
    <div className="bg-white min-h-screen">
      <ProductSchema product={product} />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: product.name, url: `/products/${product.id}` }
        ]}
      />

      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Back Button */}
        <div className="flex items-center mb-4 md:mb-8">
          <Link 
            href="/products"
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mr-4 text-sm md:text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Back to Products
          </Link>
        </div>

        {/* Main Product Layout - Single Column Vertical */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Left Column - Product Images and Purchase Controls */}
          <div className="space-y-4">
            <ProductImageGallery product={product} />
            
            {/* Size and Price - Below Image */}
            <ProductPriceDisplay 
              product={product}
              basePrice={currentPrice()}
              user={user}
            />

            {/* Variant Selectors - Below Price */}
            <ProductVariantSelector
              product={product}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              availableSizes={availableSizes}
              availableColors={availableColors}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
              user={user}
            />

            {/* Quantity and Cart - Below Variants */}
            <ProductQuantityCart
              user={user}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite(product.id)}
            />

            {/* Trust Badges - Below Cart */}
            <TrustBadges />
          </div>

          {/* Right Column - Product Details and Content */}
          <div className="space-y-6">
            <ProductDetails product={product} />

            {/* Detailed Product Content */}
            <ProductContentDisplay product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
