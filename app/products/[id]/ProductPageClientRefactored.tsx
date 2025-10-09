'use client'

import { Product } from '@/types'
import ErrorPage from '@/components/ErrorPage'
import ProductSchema from '@/components/ProductSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import { ProductProvider } from './context/ProductContext'
import ProductBreadcrumb from './components/ProductBreadcrumb'
import ProductBackButton from './components/ProductBackButton'
import ProductImageGallery from './components/ProductImageGallery'
import ProductPricing from './components/ProductPricing'
import ProductVariants from './components/ProductVariants'
import ProductActions from './components/ProductActions'
import ProductDocumentation from './components/ProductDocumentation'
import { useProductContext } from './context/ProductContext'
import { useProductActions } from '@/hooks/useProductActions'
import { useProductVariants } from '@/hooks/useProductVariants'
import { useFavorites } from '@/components/FavoritesProvider'

interface ProductPageClientProps {
  product: Product
}

function ProductPageContent({ product }: ProductPageClientProps) {
  const { selectedImage, selectedSize, selectedColor, setSelectedImage } = useProductContext()
  const { handleToggleFavorite } = useProductActions()
  const { isFavorite } = useFavorites()
  const { hasVariants } = useProductVariants(product)

  const handleSizeChange = (_size: string) => {
    // Handle size change logic
  }

  const handleColorChange = (_color: string) => {
    // Handle color change logic
  }

  const handleToggleFavoriteClick = () => {
    handleToggleFavorite(product)
  }

  return (
    <div className="bg-white min-h-screen">
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
        <ProductBreadcrumb product={product} />
        <ProductBackButton />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Product Images */}
          <ProductImageGallery 
            product={product}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category and Stock */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                In Stock
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.8/5 based on 127 reviews)</span>
            </div>

            {/* Pricing */}
            <ProductPricing 
              product={product}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
            />

            {/* Variants */}
            {hasVariants && (
              <ProductVariants 
                product={product}
                onSizeChange={handleSizeChange}
                onColorChange={handleColorChange}
              />
            )}

            {/* Actions */}
            <ProductActions 
              product={product}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              isFavorite={isFavorite(product.id)}
              onToggleFavorite={handleToggleFavoriteClick}
            />

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  Professional-grade quality
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  KFDA approved
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  Safe for all skin types
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Documentation */}
        <ProductDocumentation product={product} />
      </div>
    </div>
  )
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  if (!product) {
    return <ErrorPage />
  }

  return (
    <ProductProvider>
      <ProductPageContent product={product} />
    </ProductProvider>
  )
}
