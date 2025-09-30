'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { useAuth } from '@/components/AuthProvider'
import ErrorPage from '@/components/ErrorPage'
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, Lock, Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import ProductSchema from '@/components/ProductSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

interface ProductPageClientProps {
  product: Product
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { user } = useAuth()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedColor, setSelectedColor] = useState('Beige')
  const [selectedSize, setSelectedSize] = useState('50g')

  if (!product) {
    return <ErrorPage />
  }

  const getPriceForSize = (size: string) => {
    if (product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31') {
      return size === '50g' ? 290 : 420
    }
    return product.price
  }

  const getProductImages = () => {
    if (product.images) {
      try {
        const parsedImages = JSON.parse(product.images)
        return Array.isArray(parsedImages) ? parsedImages : [product.image]
      } catch {
        return [product.image]
      }
    }
    return [product.image]
  }

  const productImages = getProductImages()

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setIsAdding(true)
    try {
      // Only pass selectedColor for product ID 41
      const colorToPass = product.id === '41' ? selectedColor : undefined
      // Only pass selectedSize for product ID 30, 29, 32, 28, and 31
      const sizeToPass = (product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31') ? selectedSize : undefined
      
      // Create a modified product with the correct price for products 30, 29, 32, 28, and 31
      const productToAdd = (product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31')
        ? { ...product, price: getPriceForSize(selectedSize) }
        : product
      
      await addItem(productToAdd, quantity, colorToPass, sizeToPass)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleFavorite = () => {
    if (!user) {
      router.push('/login')
      return
    }
    toggleFavorite(product)
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
        {/* Navigation Breadcrumb */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="w-full max-w-md mx-auto aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.id === '3' && selectedImage === 2 ? (
                <iframe
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/7VTkWKkYKwA"
                  title="HairGen BOOSTER Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
              <Image
                  src={productImages[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
              )}
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-2 justify-center">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Size and Price */}
            <div className="flex items-center gap-4 mt-12 pt-4">
              {(product.size || product.id === '41' || product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31' || product.id === '24') && (
                <div className="text-lg font-medium text-gray-700">
                  Size: {product.id === '41' ? '15g' : product.id === '31' ? '50g/230g' : (product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28') ? '50g/250g' : product.id === '24' ? '20g' : product.size}
                </div>
              )}
              <div className="text-2xl md:text-3xl font-bold text-primary-600">
                {getPriceForSize((product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31') ? selectedSize : 'default').toFixed(2)} AED
              </div>
              <div className="text-sm font-normal text-gray-600">(VAT included)</div>
            </div>

            {/* Color Selection - Only for product ID 41 */}
            {product.id === '41' && (
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">Color:</div>
                <div className="flex gap-3">
                  {['Beige', 'Ivory', 'Camel'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection - Only for product ID 30, 29, 32, 28, and 31 */}
            {(product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31') && (
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">Size:</div>
                <div className="flex gap-3">
                  {(product.id === '31' ? [
                    { size: '50g', price: 290 },
                    { size: '230g', price: 420 }
                  ] : [
                    { size: '50g', price: 290 },
                    { size: '250g', price: 420 }
                  ]).map((option) => (
                    <button
                      key={option.size}
                      onClick={() => setSelectedSize(option.size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        selectedSize === option.size
                          ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-medium">{option.size}</div>
                        <div className="text-sm text-gray-500">{option.price} AED</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                  <button
                      onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdding}
                  aria-label={isAdding ? "Adding to cart..." : `Add ${product.name} to cart`}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                  {isAdding ? 'Adding...' : 'Add to Cart'}
                </button>
                  
                <button
                  onClick={handleToggleFavorite}
                  aria-label={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      isFavorite(product.id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-400'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-gray-800">Free Shipping</div>
                  <div className="text-xs text-gray-600">On orders over 1,000 AED</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-700" />
                <div>
                  <div className="text-sm font-medium text-gray-800">Secure Payment</div>
                  <div className="text-xs text-gray-600">Stripe checkout</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked 
                    readOnly
                    className="h-4 w-4 text-green-600 border-green-300 rounded focus:ring-green-500 accent-green-600"
                  />
                <div>
                  <div className="text-sm font-medium text-gray-800">5% UAE Tax Payer</div>
                  <div className="text-xs text-gray-600">Supporting local economy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category and Stock */}
            <div className="flex items-center gap-4">
              <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                product.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
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
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.8/5)</span>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
              
              {/* Extended Product Description */}
              <div className="prose max-w-none">
                {product.id === '1' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Microneedling Therapy</h3>
                    <p className="text-gray-600 mb-4">
                      Microneedling therapy is a minimally invasive cosmetic procedure that involves using fine needles to create hundreds of tiny, invisible puncture wounds in the top layer of skin. This process stimulates the body&apos;s natural wound healing processes, resulting in cell and collagen turnover.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Types of GENOSYS microneedling device are subdivided to facial roller, roller/stamp for scalp, body roller, eye roller, Needle pen-K depending on the treatment area and purpose of treatment, allowing effective and safe treatment.
                    </p>
                  </>
                ) : product.id === '11' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600 mb-4">
                      Apply with a cotton pad to lip and eye area and hold for few seconds. Then, gently wipe off the makeup.
                    </p>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use as part of your daily skincare routine.
                      </p>
                    </div>
                    
                    {/* Product Documentation Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Product Documentation</h4>
                      <p className="text-blue-700 text-sm mb-3">
                        Download the complete product manual and usage guide for professional application.
                      </p>
                      <div className="flex gap-3">
                        <a
                          href="/documents/ppt/GENOSYS%20SKIN%20DEFENDER%20LIP%20%26%20EYE%20MAKEUP%20REMOVER.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View PDF
                        </a>
                        <a
                          href="/documents/ppt/GENOSYS%20SKIN%20DEFENDER%20LIP%20%26%20EYE%20MAKEUP%20REMOVER.pdf"
                          download="GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER.pdf"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download
                        </a>
                      </div>
                    </div>
                  </>
                ) : product.id === '12' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS EPI TURNOVER BOOSTING PEELING GEL is an enzyme-based exfoliating gel designed to 
                      gently remove dead skin cells without causing irritation. This innovative peeling gel utilizes 
                      natural enzymes and plant extracts to purify, nourish, and moisturize the skin, making it 
                      suitable for all skin types while promoting a smoother, more radiant complexion.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Gentle Exfoliation - Effectively removes dead skin cells, promoting smoother skin texture</li>
                      <li>Radiance Enhancement - Helps correct skin tone, resulting in a brighter complexion</li>
                      <li>Deep Moisturization - Provides hydration to the skin, preventing dryness</li>
                      <li>Pore Purification - Cleanses and purifies pores, reducing the likelihood of breakouts</li>
                      <li>Enzyme Technology - Natural enzyme-based exfoliation for gentle skin renewal</li>
                      <li>All Skin Types - Suitable for sensitive and all skin types</li>
                      <li>Professional Results - Delivers salon-quality exfoliation at home</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      Apply the gel to clean, dry skin and gently massage in a circular motion for up to one minute. 
                      Rinse off the clumped dead skin cells with lukewarm water. Use 1-2 times per week for optimal results.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Natural Enzymes</h5>
                        <p className="text-sm text-gray-600">
                          Facilitate gentle exfoliation by breaking down dead skin cells naturally, 
                          providing effective yet non-irritating skin renewal.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Retinol (Vitamin A)</h5>
                        <p className="text-sm text-gray-600">
                          Promotes skin renewal and improves texture while supporting cellular turnover 
                          for a more youthful appearance.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Provitamin A</h5>
                        <p className="text-sm text-gray-600">
                          Supports skin health and regeneration, providing essential nutrients for 
                          optimal skin function and recovery.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Vitamin E</h5>
                        <p className="text-sm text-gray-600">
                          Provides antioxidant protection and moisturization, helping to protect 
                          the skin from environmental damage while maintaining hydration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Vitamin C (Ascorbic Acid)</h5>
                        <p className="text-sm text-gray-600">
                          Brightens the skin and boosts collagen production, helping to reduce 
                          signs of aging and improve skin radiance.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Allantoin</h5>
                        <p className="text-sm text-gray-600">
                          Soothes and calms the skin, reducing irritation and providing gentle 
                          care for sensitive skin during exfoliation.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Form:</strong> Enzyme-based peeling gel</p>
                        <p><strong>Skin Type:</strong> All skin types, including sensitive skin</p>
                        <p><strong>Technology:</strong> Natural enzyme exfoliation</p>
                        <p><strong>Key Benefits:</strong> Gentle exfoliation, radiance enhancement, pore purification</p>
                        <p><strong>Usage:</strong> 1-2 times per week</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use as part of your weekly skincare routine to achieve smoother, 
                        more radiant skin.
                      </p>
                    </div>
                    
                    {/* Product Documentation Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Product Documentation</h4>
                      <p className="text-blue-700 text-sm mb-3">
                        Download the complete product manual and usage guide for professional application.
                      </p>
                      <div className="flex gap-3">
                        <a
                          href="/documents/ppt/GENOSYS%20EPI%20TURNOVER%20BOOSTING%20PEELING%20GEL.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View PDF
                        </a>
                        <a
                          href="/documents/ppt/GENOSYS%20EPI%20TURNOVER%20BOOSTING%20PEELING%20GEL.pdf"
                          download="GENOSYS EPI TURNOVER BOOSTING PEELING GEL.pdf"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download
                        </a>
                      </div>
                    </div>
                  </>
                ) : product.id === '13' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply the product evenly on face, avoiding lips and eye area. After 15-20 minutes, rinse with cold water.
                    </p>
                  </>
                ) : product.id === '14' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600 mb-4">
                      Shake well before use, then spray over the face with eyes closed at a distance of 10-20cm throughout the day. It can be sprayed over make-up.
                    </p>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use as part of your daily skincare routine.
                      </p>
                    </div>
                    
                    {/* Product Documentation Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Product Documentation</h4>
                      <p className="text-blue-700 text-sm mb-3">
                        Download the complete product manual and usage guide for professional application.
                      </p>
                      <div className="flex gap-3">
                        <a
                          href="/documents/ppt/GENOSYS%20MICROBIOME%20ENERGY%20INFUSING%20MIST.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View PDF
                        </a>
                        <a
                          href="/documents/ppt/GENOSYS%20MICROBIOME%20ENERGY%20INFUSING%20MIST.pdf"
                          download="GENOSYS MICROBIOME ENERGY INFUSING MIST.pdf"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download
                        </a>
                      </div>
                    </div>
                  </>
                ) : product.id === '15' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <div className="text-gray-600 space-y-2 mb-4">
                      <p><strong>To remove dead skin cells / residues after washing the face:</strong> Soak the cotton pad with toner and wipe it along the skin texture.</p>
                      <p><strong>To enhance the pore contraction effect and to soothe the skin:</strong> Soak the cotton pad with toner and apply them to the face. Leave them on for 5-10 minutes.</p>
            </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use as part of your daily skincare routine.
                      </p>
                </div>
                    
                    {/* Product Documentation Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Product Documentation</h4>
                      <p className="text-blue-700 text-sm mb-3">
                        Download the complete product manual and usage guide for professional application.
                      </p>
                      <div className="flex gap-3">
                        <a
                          href="/documents/ppt/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View PDF
                        </a>
                        <a
                          href="/documents/ppt/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf"
                          download="GENOSYS INTENSIVE PROBLEM CONTROL TONER.pdf"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download
                        </a>
                      </div>
                    </div>
                  </>
                ) : product.id === '16' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <div className="text-gray-600 space-y-2">
                      <p><strong>To remove dead skin cells/ residues after washing the face:</strong> Soak the cotton pad with toner and wipe it along the skin texture.</p>
                      <p><strong>To provide immediate moisture replenishment after washing the face:</strong> Spray the product for homecare (200ml) sufficiently with eyes closed and tap gently. It can be used even on the makeup.</p>
                      <p><strong>To provide intensive moisturizing and soothing effects:</strong> Soak the cotton pad with toner and apply them to the face. Leave them on for 5-10 minutes.</p>
                </div>
                  </>
                ) : product.id === '17' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS EyeCell EYE CONTOUR SERUM is a highly enriched all-in-one eye serum specifically designed to address 
                      multiple concerns around the delicate eye area. This advanced serum targets fine wrinkles, dark circles, 
                      and under-eye puffiness while promoting skin regeneration and providing comprehensive eye area care with 
                      its powerful peptide complex and botanical callus culture extracts.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Wrinkle Reduction - Stimulates collagen production and relaxes facial muscles for smoother skin</li>
                      <li>Dark Circle Diminishment - Anti-dark circle complex strengthens skin and visibly reduces dark circles</li>
                      <li>Puffiness Relief - Alleviates under-eye puffiness and swelling</li>
                      <li>Hydration and Firmness - Deeply moisturizes and plumps skin, enhancing elasticity</li>
                      <li>Antioxidant Protection - Botanical stem cell extracts provide soothing and whitening effects</li>
                      <li>Skin Regeneration - Promotes cellular renewal and skin repair</li>
                      <li>Professional Results - Delivers clinical-grade results for comprehensive eye care</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      Apply a small amount around the eye area in the morning and evening. Gently massage until fully absorbed 
                      using your ring finger for optimal absorption. For best results, use in conjunction with the Genosys 
                      EyeCell Eye Contour Cream as part of your daily eye care routine.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Palmitoyl Hexapeptide-12</h5>
                        <p className="text-sm text-gray-600">
                          Stimulates fibroblast growth for firming effects and improved skin elasticity around the delicate eye area.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Copper Tripeptide-1</h5>
                        <p className="text-sm text-gray-600">
                          Promotes collagen synthesis and skin regeneration, reducing fine lines and wrinkles for a more youthful appearance.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Acetyl Hexapeptide-8</h5>
                        <p className="text-sm text-gray-600">
                          Acts as muscle relaxant, reducing wrinkle appearance and expression lines for smoother skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Anti-Dark Circle Complex (Haloxyl™)</h5>
                        <p className="text-sm text-gray-600">
                          Specialized complex for dark circle reduction and skin strengthening, targeting under-eye discoloration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Vitis Vinifera (Grape) Callus Culture Extract</h5>
                        <p className="text-sm text-gray-600">
                          Provides antioxidant and skin-renewing properties with anti-aging benefits for enhanced skin health.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Rosa Damascena Callus Culture Extract</h5>
                        <p className="text-sm text-gray-600">
                          Offers moisturizing, soothing, and whitening effects with anti-aging benefits, helping to brighten the eye area.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Adenosine</h5>
                        <p className="text-sm text-gray-600">
                          Provides anti-aging and skin-soothing properties with wrinkle-reducing effects for improved skin texture.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Arbutin</h5>
                        <p className="text-sm text-gray-600">
                          Natural skin brightening agent that helps even skin tone and reduce the appearance of dark spots.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Form:</strong> Eye contour serum</p>
                        <p><strong>Skin Type:</strong> All skin types, especially mature and aging skin</p>
                        <p><strong>Technology:</strong> Advanced peptide and botanical callus culture technology</p>
                        <p><strong>Key Benefits:</strong> Wrinkle reduction, dark circle diminishment, puffiness relief</p>
                        <p><strong>Usage:</strong> Morning and evening</p>
                        <p><strong>Volume:</strong> 10ml</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For optimal results, use in conjunction with other Genosys EyeCell products as part of your daily eye care routine.
                      </p>
                    </div>
                  </>
                ) : product.id === '19' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS ALL FOR SENSITIVE SERUM is a specialized skin repairing serum designed specifically for sensitive skin. 
                      This advanced formula provides a protective moisture barrier while delivering anti-inflammatory and soothing 
                      properties to calm and repair sensitized skin. Perfect for those with reactive, easily irritated skin.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Skin Barrier Repair - Strengthens and rebuilds the skin's natural protective barrier</li>
                      <li>Anti-Inflammatory - Reduces redness and calms irritated, sensitive skin</li>
                      <li>Soothing Relief - Provides immediate comfort for sensitized skin</li>
                      <li>Moisture Barrier - Creates a protective layer to prevent moisture loss</li>
                      <li>Gentle Formula - Specifically designed for sensitive and reactive skin</li>
                      <li>Skin Repair - Helps repair damaged skin and restore healthy function</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      Apply the serum to clean skin in the morning and evening. Gently pat with fingers until fully absorbed. 
                      Use as part of your daily skincare routine for sensitive skin care.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">MultiEx BSASM® Plus</h5>
                        <p className="text-sm text-gray-600">
                          A patented complex that helps strengthen the skin barrier and provides long-lasting hydration 
                          while protecting sensitive skin from environmental stressors.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Phytolex SC</h5>
                        <p className="text-sm text-gray-600">
                          A plant-derived ingredient that provides natural anti-inflammatory benefits and helps 
                          soothe irritated skin while supporting the skin's natural healing process.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Hyaluronic Acid</h5>
                        <p className="text-sm text-gray-600">
                          A powerful humectant that attracts and retains moisture, providing deep hydration 
                          without causing irritation or clogging pores.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Phytosphingosine</h5>
                        <p className="text-sm text-gray-600">
                          A natural lipid that helps restore the skin's barrier function and provides gentle 
                          antimicrobial protection while being suitable for sensitive skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Aloe Barbadensis Leaf Extract</h5>
                        <p className="text-sm text-gray-600">
                          Known for its soothing and healing properties, aloe vera helps calm irritated skin, 
                          reduce inflammation, and provide natural moisture to sensitive skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Hamamelis Virginiana (Witch Hazel) Extract</h5>
                        <p className="text-sm text-gray-600">
                          A natural astringent that helps tighten pores, reduce inflammation, and provide 
                          gentle cleansing properties while being gentle on sensitive skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Beta-Glucan</h5>
                        <p className="text-sm text-gray-600">
                          A natural immune-boosting ingredient that helps strengthen the skin's defense mechanisms, 
                          reduce inflammation, and promote healing in sensitive skin.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Size:</strong> 30ml</p>
                        <p><strong>Skin Type:</strong> Sensitive, reactive, and easily irritated skin</p>
                        <p><strong>Formulation:</strong> Gentle, non-irritating serum</p>
                        <p><strong>Key Benefits:</strong> Barrier repair, anti-inflammatory, soothing</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and specifically formulated for sensitive skin. 
                        For best results, use as part of your daily sensitive skin care routine.
                      </p>
              </div>
                  </>
                ) : product.id === '30' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      INTENSIVE PROBLEM CONTROL CREAM is a specialized cream designed to address various skin concerns 
                      with powerful anti-microbial and anti-inflammatory properties. This advanced formula helps control 
                      sebum production while providing soothing relief for problematic skin.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Anti-microbial - Helps combat bacteria and prevent breakouts</li>
                      <li>Anti-inflammatory - Reduces redness and calms irritated skin</li>
                      <li>Sebum Control - Regulates oil production for balanced skin</li>
                      <li>Soothing Relief - Provides comfort for problematic skin</li>
                      <li>Skin Barrier Support - Strengthens the skin's natural defenses</li>
                      <li>Moisture Retention - Keeps skin hydrated without clogging pores</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      Apply a small amount to cleansed skin twice daily. Gently massage into the skin until fully absorbed. 
                      Use as part of your morning and evening skincare routine for best results.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Zinc PCA</h5>
                        <p className="text-sm text-gray-600">
                          A powerful sebum-regulating ingredient that helps control oil production and has antimicrobial properties 
                          to prevent breakouts and maintain clear skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Panthenol (Vitamin B5)</h5>
                        <p className="text-sm text-gray-600">
                          Provides deep hydration and has anti-inflammatory properties that help soothe irritated skin 
                          while promoting healing and skin barrier function.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Beta-Glucan</h5>
                        <p className="text-sm text-gray-600">
                          A natural immune-boosting ingredient that helps strengthen the skin's defense mechanisms, 
                          reduce inflammation, and promote healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Allantoin</h5>
                        <p className="text-sm text-gray-600">
                          A gentle, soothing ingredient that helps calm irritated skin, reduce redness, and promote 
                          skin healing while being suitable for sensitive skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Lactobacillus/Pumpkin Ferment Extract</h5>
                        <p className="text-sm text-gray-600">
                          A probiotic ingredient that helps balance the skin's microbiome, providing natural antimicrobial 
                          benefits and supporting healthy skin flora.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Trehalose</h5>
                        <p className="text-sm text-gray-600">
                          A natural sugar that acts as a humectant, helping to retain moisture and protect the skin 
                          from environmental stressors while maintaining skin hydration.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Full Ingredients List</h5>
                      <p className="text-blue-800 text-sm">
                        Aqua(Water), Dipropylene Glycol, 1,2-Hexanediol, Trehalose, Zinc PCA, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, 
                        Sodium Polyacrylate, Xylitol, Allantoin, Betaine, Lactobacillus/Pumpkin Ferment Extract, Panthenol, Beta-Glucan, 
                        Betula Platyphylla Japonica Bark Extract, Leuconostoc/Radish Root Ferment Filtrate, Phaseolus Radiatus Extract, 
                        Polyglutamic Acid, Rumex Crispus Root Extract, Disodium EDTA, Potassium Hydroxide, Butylene Glycol, Dimethicone, 
                        Glycerin, Hydrogenated Lecithin
                      </p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use as part of your daily skincare routine.
                      </p>
                    </div>
                  </>
                ) : product.id === '31' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS MULTI VITA RADIANCE CREAM combines a complex of 12 vitamins with potent antioxidants like Astaxanthin 
                      to provide effective protection against free radicals, thereby slowing down the skin's aging process. 
                      This advanced formula deeply nourishes and moisturizes the skin, evens out skin tone, and imparts a 
                      noticeable radiance while activating collagen production and shielding the skin from UV radiation and environmental stressors.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Brightening - Helps lighten pigmentation spots and improve overall skin tone</li>
                      <li>Deep Moisturizing - Provides intense hydration, leaving the skin soft and supple</li>
                      <li>Antioxidant Protection - Protects against free radicals, reducing signs of aging</li>
                      <li>Skin Nourishment - Supplies essential nutrients to enhance skin health and appearance</li>
                      <li>Collagen Activation - Stimulates collagen production for firmer, more youthful skin</li>
                      <li>UV Protection - Shields skin from harmful UV radiation and environmental stressors</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      Apply the cream to the face and gently massage in both morning and evening for optimal results.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Astaxanthin</h5>
                        <p className="text-sm text-gray-600">
                          A powerful antioxidant that is 6,000 times stronger than Vitamin C. It helps reduce skin pigmentation 
                          caused by free radicals and sun exposure, diminishes photodamage, and acts as an internal sunscreen.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">VITA 12 Complex</h5>
                        <p className="text-sm text-gray-600">
                          Provides nutrients to the skin, helps increase collagen production, and prevents skin water loss. 
                          This complex includes Vitamins A, B1, B3, B5, B6, B9, B12, C, E, F, H, and K for comprehensive skin nourishment.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Gluconolactone</h5>
                        <p className="text-sm text-gray-600">
                          A Poly-Hydroxy Acid (PHA) that improves skin tone by exfoliating dead skin cells and hydrates 
                          the skin by attracting water for enhanced moisture retention.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Glycyrrhiza Uralensis (Licorice) Root Extract</h5>
                        <p className="text-sm text-gray-600">
                          Inhibits pigmentation by preventing tyrosinase activation, brightens the skin, and improves skin tone 
                          for a more even complexion.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Macadamia Ternifolia Seed Oil</h5>
                        <p className="text-sm text-gray-600">
                          Contains linoleic acid, which prevents trans-epidermal water loss and creates a natural protective barrier. 
                          Palmitoleic acid in the oil aids in wound healing and soothes skin irritation.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Ascorbic Acid (Vitamin C)</h5>
                        <p className="text-sm text-gray-600">
                          A natural antioxidant that protects the skin against UV-induced damage caused by free radicals 
                          and inhibits melanin production for brighter, more even skin tone.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Ceramide NP</h5>
                        <p className="text-sm text-gray-600">
                          Reinforces the skin's natural protective lipid barrier and improves long-term moisturization 
                          for enhanced skin health and resilience.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Full Ingredients List</h5>
                      <p className="text-blue-800 text-sm">
                        Aqua (Water), Ethylhexyl Methoxycinnamate, Butylene Glycol, Ethylhexyl Salicylate, Titanium Dioxide, 
                        Isoamyl p-Methoxycinnamate, Dimethicone, Polysorbate 60, Glyceryl Stearate, Glycerin, Palmitoyl Pentapeptide-4, 
                        Sodium Hyaluronate, Rosa Damascena Callus Culture Extract, Vitis Vinifera (Grape) Callus Culture Extract, 
                        Centella Asiatica Extract, Scutellaria Baicalensis Root Extract, Lactobacillus/Soymilk Ferment Filtrate, 
                        Stearyl Alcohol, Cetyl Alcohol, PEG-100 Stearate, VP/Eicosene Copolymer, Palmitic Acid, Isohexadecane, 
                        Stearic Acid, Sorbitan Stearate, Glycine Soja (Soybean) Sterols, Polysorbate 80, Xanthan Gum, 
                        Magnesium Aluminum Silicate, Sorbitan Oleate, 1,2-Hexanediol, Disodium EDTA, Amorphophallus Konjac Root Extract, 
                        Myristic Acid, Myristyl Alcohol, Lauryl Alcohol, Dimethicone/Vinyl Dimethicone Crosspolymer, 
                        Sodium Acrylate/Sodium Acryloyldimethyl Taurate Copolymer, Fragrance, Caprylyl Glycol, Ethylhexylglycerin, 
                        Tropolone, Butylphenyl Methylpropional, Benzyl Benzoate, Citronellol, Hexyl Cinnamal, Limonene, Alpha-Isomethyl Ionone.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use as part of your daily skincare routine to achieve radiant, youthful-looking skin.
                      </p>
                    </div>
                    
                    {/* PDF Download Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Product Documentation</h4>
                      <p className="text-blue-700 text-sm mb-3">Download the complete product manual and usage guide for professional application.</p>
                      <div className="text-xs text-blue-600 mb-3">📄 File size: 2.1 MB</div>
                      <div className="flex gap-3">
                        <a 
                          href="/documents/ppt/GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View PDF
                        </a>
                        <a 
                          href="/documents/ppt/GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf" 
                          download="GENOSYS MULTI VITA RADIANCE CREAM.pdf" 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download
                        </a>
                      </div>
                    </div>
                  </>
                ) : product.id === '32' ? ( // Added detailed description for product 32
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS MULTI FUNCTIONAL ANTI-WRINKLE CREAM is an intensive anti-aging cream designed to enhance 
                      skin elasticity, reduce wrinkles, and promote a radiant complexion. This advanced formula combines 
                      powerful anti-aging ingredients to deliver comprehensive skin rejuvenation and protection.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Wrinkle Reduction - Smooths fine lines and wrinkles, improving skin texture</li>
                      <li>Firming - Enhances skin firmness and elasticity for a more youthful appearance</li>
                      <li>Collagen Synthesis - Promotes the production of collagen for skin rejuvenation</li>
                      <li>Antioxidant Protection - Shields the skin from oxidative stress and environmental damage</li>
                      <li>Brightening - Evens out skin tone and adds natural radiance</li>
                      <li>Deep Hydration - Provides intense moisture for plump, healthy-looking skin</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      Apply a thin layer of the cream to the face, neck, and décolleté with gentle patting motions. 
                      Use in the morning and/or evening for optimal results.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Bakuchiol</h5>
                        <p className="text-sm text-gray-600">
                          A natural alternative to retinol, known for its powerful anti-aging properties. 
                          It helps reduce fine lines and wrinkles while being gentle on sensitive skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Collagen & Elastin</h5>
                        <p className="text-sm text-gray-600">
                          Essential proteins that support skin structure and elasticity, helping to maintain 
                          firmness and prevent sagging for a more youthful appearance.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Adenosine</h5>
                        <p className="text-sm text-gray-600">
                          A powerful anti-aging ingredient that aids in reducing wrinkles and improving skin 
                          smoothness while promoting cellular renewal.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Propolis Extract</h5>
                        <p className="text-sm text-gray-600">
                          Offers exceptional anti-inflammatory and antioxidant benefits, helping to protect 
                          the skin from environmental damage while soothing irritation.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Mango Seed Butter</h5>
                        <p className="text-sm text-gray-600">
                          Provides deep hydration and nourishment, creating a protective barrier that helps 
                          retain moisture and keep skin soft and supple.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Niacinamide</h5>
                        <p className="text-sm text-gray-600">
                          Brightens the skin and improves tone while helping to minimize the appearance 
                          of pores and fine lines for a more even complexion.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Ceramide NP, Phytosphingosine, Cholesterol</h5>
                        <p className="text-sm text-gray-600">
                          These essential lipids strengthen the skin barrier and retain moisture, 
                          helping to prevent moisture loss and maintain healthy, resilient skin.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Size:</strong> 50g/250g</p>
                        <p><strong>Suitable for:</strong> All skin types, especially mature skin</p>
                        <p><strong>Country of Origin:</strong> South Korea</p>
                        <p><strong>Formulation:</strong> Advanced anti-aging cream with multi-functional benefits</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use as part of your daily skincare routine to achieve youthful, radiant skin.
                      </p>
                    </div>
                  </>
                ) : product.id === '41' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS SKIN CARING BLEMISH BALM CUSHION is a BB cushion that can be used after professional treatment. 
                      More than 60% of the product is composed of moisture essence, which enables a natural and healthy glow. 
                      Various peptide complex 40% - helps calm the irritated skin. (SPF 50 / PA++++)
                    </p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-blue-800 text-sm font-medium">
                        <strong>Includes:</strong> 1 x replacement refill - 15g
                      </p>
                      <p className="text-blue-800 text-sm font-medium mt-1">
                        <strong>Color Note:</strong> Beige is darker than Ivory to suit Fitzpatrick 2-4
                      </p>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>BB cushion that can be used after the professional treatment</li>
                      <li>Convenient and quick base makeup in the morning</li>
                      <li>Skin Protection from harmful environment</li>
                      <li>Sun protection</li>
                      <li>Skin cover up</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      Press the puff lightly onto cushion and pat evenly onto skin. We recommend patting the puff gently 
                      on the skin several times to enhance the long-lasting effect.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Repairing Pep9 Complex</h5>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>
                            <strong>Promotion of collagen induction and skin regeneration:</strong>
                            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                              <li>Hexapeptide-9</li>
                              <li>Copper Tripeptide-1</li>
                              <li>Palmitoyl Pentapeptide-4</li>
                              <li>Palmitoyl Tripeptide-1</li>
                              <li>Hexapeptide-11</li>
                              <li>Tripeptide-1</li>
                              <li>Alanine/Histidine/Lysine Polypeptide Copper HCl</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Firming:</strong> Acetyl Hexapeptide-8
                          </div>
                          <div>
                            <strong>Skin brightening:</strong> Nonapeptide-1
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Volufiline™</h5>
                        <p className="text-sm text-gray-600">
                          Sarsasapogenin from anemarrhena asphodeloides root. It provides a volume-enhancing benefit by a 
                          cosmetic lipofilling-like effect. And as rich in saponin, it has anti-inflammatory and antioxidant features.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Glutathione</h5>
                        <p className="text-sm text-gray-600">
                          As a powerful antioxidant, it helps brighten and even skin by blocking the tyrosinase activity. 
                          And it also has a beneficial effect for cystic acne or even the occasional breakout.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use as part of your daily skincare routine.
                      </p>
                    </div>
                  </>
                ) : product.id === '51' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK is an innovative fermented powder mask that combines 
                      traditional fermentation technology with modern skincare science. This unique powder-to-mask formula 
                      activates upon mixing with water, creating a powerful treatment that delivers concentrated nutrients 
                      and beneficial compounds directly to the skin for maximum anti-aging benefits.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Age Defying - Reduces fine lines and wrinkles through advanced fermentation technology</li>
                      <li>Bio-Ferment Technology - Harnesses the power of beneficial microorganisms for skin health</li>
                      <li>Deep Penetration - Powder-to-mask formula ensures maximum ingredient absorption</li>
                      <li>Antioxidant Protection - Neutralizes free radicals and environmental damage</li>
                      <li>Skin Renewal - Promotes cellular turnover for younger-looking skin</li>
                      <li>Hydration Boost - Provides intense moisture and plumping effects</li>
                      <li>Firming Action - Improves skin elasticity and firmness</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      Mix the powder with water or your preferred liquid to create a smooth paste. Apply evenly to clean skin, 
                      avoiding the eye area. Leave on for 15-20 minutes, then rinse thoroughly with lukewarm water. 
                      Use 1-2 times per week for optimal results.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Bio-Fermented Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Advanced fermentation process creates beneficial compounds, peptides, and amino acids that 
                          enhance skin barrier function and provide anti-aging benefits through natural biological processes.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Fermented Rice Extract</h5>
                        <p className="text-sm text-gray-600">
                          Rich in vitamins, minerals, and antioxidants, fermented rice provides gentle exfoliation 
                          and brightening effects while nourishing the skin with essential nutrients.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Fermented Soybean Extract</h5>
                        <p className="text-sm text-gray-600">
                          Contains isoflavones and peptides that help improve skin elasticity, reduce inflammation, 
                          and provide antioxidant protection against environmental stressors.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Fermented Green Tea Extract</h5>
                        <p className="text-sm text-gray-600">
                          Enhanced antioxidant properties through fermentation, providing superior protection against 
                          free radicals and helping to reduce signs of aging and environmental damage.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Fermented Ginseng Extract</h5>
                        <p className="text-sm text-gray-600">
                          Traditional Korean ingredient enhanced through fermentation, providing energizing and 
                          revitalizing effects while improving skin tone and reducing fatigue signs.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Hyaluronic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Provides intense hydration and plumping effects, helping to reduce the appearance of 
                          fine lines and wrinkles while maintaining optimal skin moisture levels.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Form:</strong> Powder mask (activates with water)</p>
                        <p><strong>Skin Type:</strong> All skin types, especially mature and aging skin</p>
                        <p><strong>Technology:</strong> Bio-fermentation process</p>
                        <p><strong>Key Benefits:</strong> Age defying, skin renewal, deep hydration</p>
                        <p><strong>Usage:</strong> 1-2 times per week</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use as part of your weekly skincare routine to achieve youthful, radiant skin.
                      </p>
                    </div>
                    
                    {/* Spacing between note and product documentation */}
                    <div className="mt-6"></div>
                    
                    {/* Product Documentation Section for Product 51 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Product Documentation</h4>
                      <p className="text-blue-700 text-sm mb-3">
                        Download the complete product manual and usage guide for professional application.
                      </p>
                      <div className="text-xs text-blue-600 mb-3">
                        📄 File size: 2.1 MB
                      </div>
                      <div className="flex gap-3">
                        <a
                          href="/documents/ppt/GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                          View PDF
                        </a>
                        <a
                          href="/documents/ppt/GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf"
                          download="GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK.pdf"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          Download
                        </a>
                      </div>
                    </div>
                  </>
                ) : product.id === '26' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS EGF REPAIR OXYMASK CREAM is a unique oxygen bubbling mask cream designed to rejuvenate 
                      dull and stressed skin. This innovative "S.O.S" cream effectively addresses skin damage from 
                      various causes, providing immediate relief and long-term skin regeneration through advanced 
                      oxygen therapy and skin-regenerating ingredients.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Oxygen Therapy - Supplies oxygen to the skin, improving cellular metabolism</li>
                      <li>Skin Regeneration - Accelerates healing process and reduces skin irritations</li>
                      <li>Anti-Inflammatory - Provides soothing effects for sensitive and damaged skin</li>
                      <li>Deep Hydration - Promotes intense moisture retention and skin plumping</li>
                      <li>Collagen Stimulation - Enhances skin elasticity and firmness</li>
                      <li>EGF Technology - Advanced epidermal growth factor for cellular renewal</li>
                      <li>Bubbling Action - Unique oxygen bubbling effect for enhanced penetration</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      Apply a thin layer of the cream mask evenly on dry skin. Do not rub; wait for the oxygen 
                      bubbles to form and cover the face. Once the bubbles start popping (after 1-2 minutes), 
                      gently massage and tap for better absorption. Do not rinse off. Use in the morning and evening.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">sh-Oligopeptide-1 (EGF)</h5>
                        <p className="text-sm text-gray-600">
                          Epidermal Growth Factor stimulates cell proliferation and aids in wound healing, 
                          promoting faster skin recovery and regeneration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Madecassoside</h5>
                        <p className="text-sm text-gray-600">
                          Derived from Centella Asiatica, it combats redness, reduces itching, and soothes 
                          sensitive skin while providing anti-inflammatory benefits.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Copper Tripeptide-1</h5>
                        <p className="text-sm text-gray-600">
                          Promotes collagen synthesis and has wound-healing properties, helping to improve 
                          skin texture and reduce signs of aging.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">SEPITONIC M3 (Mineral Complex)</h5>
                        <p className="text-sm text-gray-600">
                          Enhances cellular metabolism and revitalizes the skin, providing essential minerals 
                          for optimal skin function and health.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Salmon Oil</h5>
                        <p className="text-sm text-gray-600">
                          Rich in unsaturated fatty acids, it offers anti-inflammatory and wound-healing 
                          effects while providing deep nourishment to the skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Adenosine</h5>
                        <p className="text-sm text-gray-600">
                          Provides anti-aging benefits by reducing the appearance of wrinkles and fine lines, 
                          promoting smoother, more youthful-looking skin.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Form:</strong> Oxygen bubbling mask cream</p>
                        <p><strong>Skin Type:</strong> All skin types, especially damaged and stressed skin</p>
                        <p><strong>Technology:</strong> EGF and oxygen therapy</p>
                        <p><strong>Key Benefits:</strong> Skin regeneration, oxygen therapy, anti-inflammatory</p>
                        <p><strong>Usage:</strong> Morning and evening</p>
                        <p><strong>Special Feature:</strong> Unique oxygen bubbling effect</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and suitable for all skin types. 
                        For optimal bubbling, avoid rubbing the product during application. For best results, 
                        incorporate it into your daily skincare routine.
                      </p>
                    </div>
                  </>
                ) : product.id === '33' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS EyeCell EYE PEPTIDE GEL PATCH is a specialized treatment designed to rejuvenate and care for the delicate skin around the eyes. These crescent-shaped gel patches are infused with a potent blend of peptides, botanical extracts, and other active ingredients to address common eye area concerns including puffiness, dark circles, fine lines, and signs of fatigue.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Reduces Puffiness and Dark Circles - Effectively combats under-eye bags and dark circles for a refreshed appearance</li>
                      <li>Smooths Fine Lines and Wrinkles - Peptide complex works to diminish the appearance of fine lines, promoting smoother skin</li>
                      <li>Hydrates and Soothes - Deep hydration and soothing effect, reducing signs of fatigue and stress</li>
                      <li>Improves Skin Elasticity - Advanced peptide technology enhances skin firmness and elasticity</li>
                      <li>Anti-Aging Properties - Targets multiple signs of aging around the delicate eye area</li>
                      <li>Professional Results - Delivers clinical-grade results for comprehensive eye care</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      Cleanse the face thoroughly. Apply the gel patches under the eyes, ensuring good contact with the skin. 
                      Leave on for 20-40 minutes, then remove and discard the patches. For optimal results, use regularly as part of your skincare routine.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Peptide Complex</h5>
                        <p className="text-sm text-gray-600">
                          Includes Copper Tripeptide-1, Acetyl Hexapeptide-8, Palmitoyl Hexapeptide-12, Palmitoyl Oligopeptide, 
                          and Palmitoyl Tetrapeptide-7 to reduce fine lines and improve skin elasticity.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Hyaluronic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Increases skin moisture levels, plumping the eye area and providing deep hydration for a refreshed appearance.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Arbutin</h5>
                        <p className="text-sm text-gray-600">
                          Natural skin brightening agent that helps reduce the appearance of dark circles and evens skin tone.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Retinyl Palmitate</h5>
                        <p className="text-sm text-gray-600">
                          Vitamin A derivative that supports skin renewal and combats signs of aging around the eye area.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Botanical Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Chamomile, Lavender, Peppermint, and Rosemary extracts that soothe and revitalize the delicate eye area.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Form:</strong> Thermo-sensitive hydrogel patches</p>
                        <p><strong>Skin Type:</strong> All skin types, especially mature and aging skin</p>
                        <p><strong>Technology:</strong> Patented thermo-sensitive hydrogel technology</p>
                        <p><strong>Key Benefits:</strong> Puffiness reduction, dark circle diminishment, wrinkle smoothing</p>
                        <p><strong>Usage:</strong> 20-40 minutes per application</p>
                        <p><strong>Quantity:</strong> 60 patches</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use in conjunction with other Genosys EyeCell products as part of your daily eye care regimen.
                      </p>
                    </div>
                    
                    {/* Spacing between note and product documentation */}
                    <div className="mt-6"></div>
                    
                    {/* Product Documentation Section for Product 33 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Product Documentation</h4>
                      <p className="text-blue-700 text-sm mb-3">
                        Download the complete product manual and usage guide for professional application.
                      </p>
                      <div className="text-xs text-blue-600 mb-3">
                        📄 File size: 850 KB
                      </div>
                      <div className="flex gap-3">
                        <a
                          href="/documents/ppt/GENOSYS%20EyeCell%20EYE%20PEPTIDE%20GEL%20PATCH.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                          View PDF
                        </a>
                        <a
                          href="/documents/ppt/GENOSYS%20EyeCell%20EYE%20PEPTIDE%20GEL%20PATCH.pdf"
                          download="GENOSYS EyeCell EYE PEPTIDE GEL PATCH.pdf"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </>
                ) : product.id === '38' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS EZ CO₂ MASK KIT is a professional carboxy therapy system designed to deliver 
                      oxygen to the skin through the innovative "Bohr Effect" mechanism. This advanced CO₂ 
                      therapy kit combines a specialized gel and sheet mask to accelerate oxygen delivery 
                      to skin tissues, providing firming, brightening, and anti-blemish effects while 
                      preparing the skin for optimal absorption of active ingredients.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Oxygen Therapy - Accelerates oxygen delivery to skin tissues through CO₂ therapy</li>
                      <li>Skin Firming - Provides firming effects through improved cellular metabolism</li>
                      <li>Brightening - Helps correct skin tone and reduce hyperpigmentation</li>
                      <li>Anti-Blemish - Reduces blemishes and improves overall skin clarity</li>
                      <li>Catalytic Effect - Prepares skin for optimal absorption of active ingredients</li>
                      <li>Professional Results - Delivers salon-quality carboxy therapy at home</li>
                      <li>Microneedling Enhancement - Acts as a catalytic mask for better treatment results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      Apply the CO₂ gel evenly to clean skin, then place the sheet mask over the treated area. 
                      Leave on for 15-20 minutes to allow the CO₂ therapy to work. The fine particles of CO₂ 
                      generated by the contact between gel and mask will accelerate oxygen delivery to skin tissues. 
                      Remove mask and gently massage any remaining product into the skin.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">EZ CO₂ GEL Ingredients</h5>
                        <div className="text-sm text-gray-600 space-y-2">
                          <p><strong>Lactic Acid:</strong> Gentle exfoliation and skin renewal</p>
                          <p><strong>Portulaca Oleracea Extract:</strong> Antioxidant and anti-inflammatory properties</p>
                          <p><strong>Rosemary Leaf Extract:</strong> Antimicrobial and circulation-boosting effects</p>
                          <p><strong>Chamomile Flower Extract:</strong> Soothing and anti-inflammatory benefits</p>
                          <p><strong>Licorice Root Extract:</strong> Skin brightening and anti-inflammatory properties</p>
                          <p><strong>Scutellaria Baicalensis Root Extract:</strong> Antioxidant and anti-aging benefits</p>
                          <p><strong>Centella Asiatica Extract:</strong> Wound healing and anti-inflammatory effects</p>
                          <p><strong>Green Tea Leaf Extract:</strong> Antioxidant protection and skin renewal</p>
                        </div>
                      </div>
                      
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Form:</strong> Professional carboxy therapy kit (Gel + Sheet Mask)</p>
                        <p><strong>Skin Type:</strong> All skin types, especially dull and stressed skin</p>
                        <p><strong>Technology:</strong> CO₂ therapy with Bohr Effect mechanism</p>
                        <p><strong>Key Benefits:</strong> Oxygen therapy, skin firming, brightening, anti-blemish</p>
                        <p><strong>Usage:</strong> 1-2 times per week</p>
                        <p><strong>Kit Contents:</strong> Gel 20g x 5ea, Mask 12g x 5ea</p>
                        <p><strong>Special Feature:</strong> Catalytic mask for enhanced treatment absorption</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        The CO₂ therapy mechanism accelerates oxygen delivery to skin tissues, providing 
                        professional-grade results. For best results, use as part of your weekly skincare routine.
                      </p>
                    </div>
                  </>
                ) : product.id === '24' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS EyeCell EYE CONTOUR CREAM is a daily eye care product specifically designed to address 
                      multiple concerns around the delicate eye area. This advanced eye cream targets fine wrinkles, 
                      crow's feet, dark circles, and under-eye puffiness while promoting microcirculation to enhance 
                      overall skin health and provide comprehensive eye area care.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Fine Wrinkle Reduction - Targets and reduces fine lines around the eye area</li>
                      <li>Crow's Feet Diminishing - Helps diminish the appearance of crow's feet</li>
                      <li>Dark Circle Lightening - Lightens dark circles and under-eye discoloration</li>
                      <li>Puffiness Relief - Alleviates under-eye puffiness and swelling</li>
                      <li>Microcirculation Enhancement - Promotes blood circulation for healthier skin</li>
                      <li>Firming Effects - Provides firming and lifting benefits</li>
                      <li>Daily Care - Suitable for daily use in morning and evening routines</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      Apply the cream to pre-cleansed skin around the eyes in the morning and evening. 
                      Gently pat the product around the eye contour area using your ring finger for optimal 
                      absorption. For best results, use in conjunction with other Genosys EyeCell products.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Palmitoyl Hexapeptide-12</h5>
                        <p className="text-sm text-gray-600">
                          Stimulates fibroblast cell growth, imparting firming effects and helping to 
                          improve skin elasticity around the delicate eye area.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Copper Tripeptide-1</h5>
                        <p className="text-sm text-gray-600">
                          Promotes collagen synthesis in skin fibroblasts, aiding in skin regeneration 
                          and helping to reduce the appearance of fine lines and wrinkles.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Rosa Damascena Callus Culture Extract</h5>
                        <p className="text-sm text-gray-600">
                          Offers moisturizing, soothing, and whitening effects with anti-aging benefits, 
                          helping to brighten the eye area and reduce signs of aging.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Scutellaria Baicalensis Root Extract</h5>
                        <p className="text-sm text-gray-600">
                          Provides anti-inflammatory, antioxidant, antimicrobial, antifungal, antiviral, 
                          and free radical scavenging properties for comprehensive skin protection.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Sodium Hyaluronate</h5>
                        <p className="text-sm text-gray-600">
                          Hydrates the skin, reduces water loss, minimizes the appearance of wrinkles 
                          and fine lines, and improves skin elasticity for a more youthful appearance.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Form:</strong> Eye contour cream</p>
                        <p><strong>Skin Type:</strong> All skin types, especially mature and aging skin</p>
                        <p><strong>Technology:</strong> Advanced peptide and botanical technology</p>
                        <p><strong>Key Benefits:</strong> Fine wrinkle reduction, dark circle lightening, puffiness relief</p>
                        <p><strong>Usage:</strong> Morning and evening</p>
                        <p><strong>Volume:</strong> 20ml</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For optimal results, use in conjunction with other Genosys EyeCell products as part of 
                        your daily eye care routine.
                      </p>
                    </div>
                  </>
                ) : product.id === '46' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS HR³ MATRIX SCALP PEELING α is a gentle scalp peeling solution designed to cleanse 
                      and prepare the scalp for microneedling treatments. This advanced peeling formula effectively 
                      removes keratinized particles and impurities while providing a refreshing, cooling sensation 
                      that soothes the scalp and enhances treatment absorption.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Gentle Scalp Exfoliation - Effectively removes keratinized particles and dead skin cells</li>
                      <li>Refreshing Cooling Effect - Provides a soothing, cooling sensation for scalp comfort</li>
                      <li>Disinfecting Properties - Helps cleanse the scalp and prepare for treatment</li>
                      <li>Anti-Inflammatory Action - Reduces inflammation and soothes irritated scalp</li>
                      <li>Enhanced Blood Circulation - Stimulates blood flow to hair follicles</li>
                      <li>Treatment Preparation - Optimizes scalp condition for microneedling procedures</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Scalp Preparation:</strong> Ensure the scalp is clean and dry before application</li>
                        <li><strong>Application:</strong> Apply a small amount of the peeling solution to the scalp</li>
                        <li><strong>Massage:</strong> Gently massage the solution into the scalp using circular motions</li>
                        <li><strong>Processing Time:</strong> Allow the solution to work for 2-3 minutes</li>
                        <li><strong>Rinse:</strong> Thoroughly rinse with lukewarm water</li>
                        <li><strong>Follow-up:</strong> Proceed with your regular microneedling treatment protocol</li>
                      </ol>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Salicylic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Provides gentle exfoliation to remove dead skin cells and unclog hair follicles, 
                          promoting healthier scalp condition and improved treatment absorption.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Menthol</h5>
                        <p className="text-sm text-gray-600">
                          Delivers a refreshing, cooling sensation that soothes the scalp and provides 
                          immediate comfort during and after application.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Sophora Japonica Linn Extract</h5>
                        <p className="text-sm text-gray-600">
                          Provides antioxidant properties and helps reduce inflammation, promoting 
                          scalp health and creating an optimal environment for hair growth.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Green Tea Extract</h5>
                        <p className="text-sm text-gray-600">
                          Offers anti-inflammatory and antioxidant benefits, helping to soothe the scalp 
                          and protect against environmental damage.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Grapefruit Seed Oil</h5>
                        <p className="text-sm text-gray-600">
                          Provides natural antimicrobial properties to help cleanse the scalp and 
                          maintain a healthy scalp environment.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Form:</strong> Scalp peeling solution</p>
                        <p><strong>Target:</strong> Scalp preparation for microneedling treatments</p>
                        <p><strong>Technology:</strong> Gentle exfoliating and refreshing formula</p>
                        <p><strong>Key Benefits:</strong> Scalp cleansing, refreshing sensation, treatment preparation</p>
                        <p><strong>Usage:</strong> Professional and home care</p>
                        <p><strong>Volume:</strong> 100ml</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is designed for use in conjunction with microneedling treatments. 
                        For best results, use as part of the complete HR³ MATRIX treatment protocol. 
                        Avoid contact with eyes and discontinue use if irritation occurs.
                      </p>
                    </div>
                    
                    {/* Spacing between note and product documentation */}
                    <div className="mt-6"></div>
                    
                    {/* Product Documentation Section for Product 46 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Product Documentation</h4>
                      <p className="text-blue-700 text-sm mb-3">
                        Download the complete product manual and usage guide for professional application.
                      </p>
                      <div className="text-xs text-blue-600 mb-3">
                        📄 File size: 900 KB
                      </div>
                      <div className="flex gap-3">
                        <a
                          href="/documents/ppt/GENOSYS%20HR3%20MATRIX%20SCALP%20PEELING%20ALPHA.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                          View PDF
                        </a>
                        <a
                          href="/documents/ppt/GENOSYS%20HR3%20MATRIX%20SCALP%20PEELING%20ALPHA.pdf"
                          download="GENOSYS HR3 MATRIX SCALP PEELING ALPHA.pdf"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </>
                ) : product.id === '44' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS HR³ MATRIX SCALP SHAMPOO α is a functional shampoo specifically designed to improve 
                      hair loss conditions and promote scalp health. This KFDA-approved functional product helps 
                      control excess sebum, cools down scalp heat, and creates an optimal environment for healthy 
                      hair growth through its advanced ingredient complex.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Hair Loss Prevention - KFDA-approved functional product for improving hair loss symptoms</li>
                      <li>Scalp Cooling Effect - Reduces scalp heat and provides refreshing sensation</li>
                      <li>Sebum Control - Effectively manages excess sebum production for balanced scalp</li>
                      <li>Scalp Health - Promotes healthy scalp environment for optimal hair growth</li>
                      <li>Professional Quality - Advanced formulation with patented ingredients</li>
                      <li>Dermatologically Tested - Safe for regular use on all hair types</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Wet Hair:</strong> Thoroughly wet your hair with lukewarm water</li>
                        <li><strong>Apply Shampoo:</strong> Take an appropriate amount and massage gently into scalp</li>
                        <li><strong>Massage:</strong> Use fingertips to massage scalp for 2-3 minutes</li>
                        <li><strong>Rinse:</strong> Rinse thoroughly with lukewarm water</li>
                        <li><strong>Repeat if Needed:</strong> For best results, use twice weekly or as recommended</li>
                        <li><strong>Follow-up:</strong> Use in conjunction with HR³ MATRIX treatment protocol</li>
                      </ol>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Patented Viscum Album Extract</h5>
                        <p className="text-sm text-gray-600">
                          A patented extract that helps inhibit hair loss and promotes healthy hair growth 
                          by improving scalp circulation and nutrient delivery to hair follicles.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Patented HP-DCC Complex</h5>
                        <p className="text-sm text-gray-600">
                          Advanced complex that targets the root causes of hair loss, providing comprehensive 
                          scalp care and promoting stronger, healthier hair growth.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Saccharomyces Cerevisiae Extract</h5>
                        <p className="text-sm text-gray-600">
                          Fermented yeast extract that provides essential nutrients for hair follicles, 
                          promoting healthy hair growth and improving scalp condition.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Acorus Calamus Root Extract</h5>
                        <p className="text-sm text-gray-600">
                          Traditional herbal extract known for its scalp-soothing properties and ability 
                          to improve blood circulation in the scalp area.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Piroctone Olamine</h5>
                        <p className="text-sm text-gray-600">
                          Antimicrobial agent that helps maintain scalp health by preventing microbial 
                          growth and creating an optimal environment for hair growth.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Biotin</h5>
                        <p className="text-sm text-gray-600">
                          Essential B-vitamin that supports healthy hair growth and strengthens hair 
                          structure, promoting thicker and more resilient hair.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Salicylic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Gentle exfoliant that removes dead skin cells and excess sebum from the scalp, 
                          preventing clogged hair follicles and promoting healthy hair growth.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Menthol</h5>
                        <p className="text-sm text-gray-600">
                          Provides a refreshing, cooling sensation that soothes the scalp and 
                          stimulates blood circulation for improved nutrient delivery to hair follicles.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Form:</strong> Functional scalp shampoo</p>
                        <p><strong>Target:</strong> Hair loss prevention and scalp health</p>
                        <p><strong>Technology:</strong> Patented ingredient complex with KFDA approval</p>
                        <p><strong>Key Benefits:</strong> Hair loss prevention, scalp cooling, sebum control</p>
                        <p><strong>Usage:</strong> Professional and home care</p>
                        <p><strong>Volume:</strong> 300ml</p>
                        <p><strong>Approval:</strong> KFDA approved functional product</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is KFDA approved as a functional product for improving 
                        hair loss symptoms. For best results, use as part of the complete HR³ MATRIX treatment 
                        protocol. Regular use helps maintain optimal scalp health and promotes healthy hair growth.
                      </p>
                    </div>
                  </>
                ) : product.id === '47' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS HR³ MATRIX MESOPECIA KIT is a comprehensive hair and scalp treatment system designed to 
                      prevent hair loss and promote healthy hair regrowth by addressing the fundamental causes of hair loss. 
                      This advanced kit combines multiple treatment components to create a complete solution for hair 
                      health and vitality, suitable for both professional and home use.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Kit Components</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">HR³ MATRIX SCALP PEELING (100ml)</h5>
                        <p className="text-sm text-gray-600">
                          Deep-cleansing solution that removes keratin, sebum, and impurities while providing a refreshing cooling effect for optimal scalp preparation.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">HR³ MATRIX HAIR SOLUTION (5ml x 6 vials)</h5>
                        <p className="text-sm text-gray-600">
                          Premium scalp and hair care product that combats factors causing hair loss, accelerates angiogenesis, and inhibits substances responsible for hair thinning.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">GENOSYS STAMP (ROLLER)</h5>
                        <p className="text-sm text-gray-600">
                          Specialized device designed to enhance absorption of active ingredients into the scalp, optimizing treatment effectiveness and ensuring deeper penetration.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Inhibits Hair Loss Causes - Targets root causes including 5α-reductase inhibition to suppress DHT conversion</li>
                      <li>Stimulates Hair Growth - Supplies essential nutrients to hair follicles and promotes angiogenesis for new hair growth</li>
                      <li>Regulates Sebum Secretion - Controls excessive sebum production for balanced and healthy scalp environment</li>
                      <li>Deep Scalp Cleansing - Removes keratin, sebum, and impurities for optimal treatment absorption</li>
                      <li>Enhanced Absorption - Roller device ensures deeper penetration of active ingredients</li>
                      <li>Comprehensive Treatment - Complete system addressing all aspects of hair loss and scalp health</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Treatment Protocol</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Scalp Preparation:</strong> Apply HR³ MATRIX SCALP PEELING to cleanse and prepare the scalp</li>
                        <li><strong>Hair Parting:</strong> Part the hair in the area of hair loss for targeted treatment</li>
                        <li><strong>Roller Application:</strong> Use GENOSYS STAMP (ROLLER) to gently roll or stamp the scalp</li>
                        <li><strong>Solution Application:</strong> Apply HR³ MATRIX HAIR SOLUTION using the dropper while rolling</li>
                        <li><strong>Post-Treatment:</strong> Use HR³ MATRIX Shampoo and Tonic for optimal maintenance</li>
                      </ol>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Peptide Complex</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Sh-polypeptide-71:</strong> Supports hair follicle health and growth stimulation<br/>
                          <strong>Copper Tripeptide-1:</strong> Promotes collagen synthesis and hair strength<br/>
                          <strong>Pentapeptide-20:</strong> Aids in hair growth and follicle nourishment
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Botanical Extracts</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Sophora Japonica Bud Extract:</strong> Antioxidant properties for scalp protection<br/>
                          <strong>Portulaca Oleracea:</strong> Traditional herb for scalp nourishment<br/>
                          <strong>Polygonum Multiflorum Root:</strong> Known for hair strengthening properties<br/>
                          <strong>Angelica Gigas Root:</strong> Supports scalp health and circulation
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Active Components</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Niacinamide:</strong> Improves blood circulation in the scalp<br/>
                          <strong>Citrus Paradisi Seed Oil:</strong> Provides antimicrobial benefits for scalp health<br/>
                          <strong>5α-Reductase Inhibitors:</strong> Suppress DHT conversion to prevent hair loss
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Form:</strong> Complete hair and scalp treatment system</p>
                        <p><strong>Target:</strong> Hair loss prevention and regrowth stimulation</p>
                        <p><strong>Technology:</strong> Advanced peptide and botanical extract technology</p>
                        <p><strong>Key Benefits:</strong> Hair loss prevention, regrowth stimulation, scalp health</p>
                        <p><strong>Usage:</strong> Professional and home care</p>
                        <p><strong>Components:</strong> 3 specialized products for comprehensive treatment</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This comprehensive kit is designed for both professional and home use. 
                        For best results, follow the complete treatment protocol and use in conjunction with 
                        HR³ MATRIX Shampoo and Tonic for optimal hair health maintenance.
                      </p>
                    </div>
                  </>
                ) : product.id === '43' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS HR³ MATRIX HAIR TONIC α is a specialized scalp and hair treatment designed to revitalize 
                      and strengthen hair follicles while providing essential nutrients for optimal hair growth. This 
                      advanced tonic combines peptide technology with botanical extracts to create a comprehensive 
                      solution for hair health and vitality.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Peptide Technology</h5>
                        <p className="text-sm text-gray-600">
                          Advanced peptide complex including Sh-polypeptide-71 and Copper Tripeptide-1 for targeted hair follicle nourishment and growth stimulation.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Botanical Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Rich blend of traditional herbs and plant extracts including Sophora Japonica, Portulaca Oleracea, and Polygonum Multiflorum for natural scalp nourishment.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Scalp Revitalization</h5>
                        <p className="text-sm text-gray-600">
                          Niacinamide and botanical extracts work synergistically to improve scalp circulation and provide essential nutrients to hair follicles.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Strengthens Hair Follicles - Provides essential nutrients and peptides for stronger, healthier hair</li>
                      <li>Improves Scalp Health - Nourishes and revitalizes the scalp environment for optimal hair growth</li>
                      <li>Enhances Blood Circulation - Increases nutrient delivery to hair follicles through improved blood flow</li>
                      <li>Prevents Hair Loss - Targets fundamental causes of hair thinning and provides protective benefits</li>
                      <li>Promotes Hair Growth - Stimulates hair follicle activity and supports natural hair regrowth</li>
                      <li>Antioxidant Protection - Botanical extracts provide antioxidant benefits for scalp protection</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Peptide Complex</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Sh-polypeptide-71:</strong> Supports hair follicle health and growth stimulation<br/>
                          <strong>Copper Tripeptide-1:</strong> Promotes collagen synthesis and hair strength<br/>
                          <strong>Pentapeptide-20:</strong> Aids in hair growth and follicle nourishment
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Botanical Extracts</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Sophora Japonica Bud Extract:</strong> Antioxidant properties for scalp protection<br/>
                          <strong>Portulaca Oleracea:</strong> Traditional herb for scalp nourishment<br/>
                          <strong>Polygonum Multiflorum Root:</strong> Known for hair strengthening properties<br/>
                          <strong>Angelica Gigas Root:</strong> Supports scalp health and circulation
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Active Components</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Niacinamide:</strong> Improves blood circulation in the scalp<br/>
                          <strong>Citrus Paradisi Seed Oil:</strong> Provides antimicrobial benefits for scalp health
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Usage Instructions</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse scalp thoroughly with HR³ MATRIX SCALP PEELING</li>
                        <li><strong>Application:</strong> Apply the tonic evenly to the scalp and hair roots</li>
                        <li><strong>Massage:</strong> Gently massage into scalp for 2-3 minutes to enhance absorption</li>
                        <li><strong>Enhancement:</strong> Use with GENOSYS STAMP (ROLLER) for deeper penetration</li>
                        <li><strong>Frequency:</strong> Use 2-3 times per week for optimal results</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Form:</strong> Premium hair and scalp tonic</p>
                        <p><strong>Target:</strong> Hair health and scalp revitalization</p>
                        <p><strong>Technology:</strong> Advanced peptide and botanical extract technology</p>
                        <p><strong>Key Benefits:</strong> Hair strengthening, scalp health, circulation improvement</p>
                        <p><strong>Usage:</strong> Professional and home care</p>
                        <p><strong>System:</strong> Part of HR³ MATRIX MESOPECIA KIT</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is designed for both professional and home use. For best results, 
                        use as part of the complete HR³ MATRIX MESOPECIA KIT system. Consult with a hair care professional 
                        for personalized treatment protocols.
                      </p>
                    </div>
                    
                    {/* Spacing between note and product documentation */}
                    <div className="mt-6"></div>
                    
                    {/* Product Documentation Section for Product 43 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Product Documentation</h4>
                      <p className="text-blue-700 text-sm mb-3">
                        Download the complete product manual and usage guide for professional application.
                      </p>
                      <div className="text-xs text-blue-600 mb-3">
                        📄 File size: 650 KB
                      </div>
                      <div className="flex gap-3">
                        <a
                          href="/documents/ppt/GENOSYS%20HR3%20MATRIX%20HAIR%20TONIC%20ALPHA.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                          View PDF
                        </a>
                        <a
                          href="/documents/ppt/GENOSYS%20HR3%20MATRIX%20HAIR%20TONIC%20ALPHA.pdf"
                          download="GENOSYS HR3 MATRIX HAIR TONIC ALPHA.pdf"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </>
                ) : product.id === '45' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS HR³ MATRIX HAIR SOLUTION α is a premium scalp and hair care treatment specifically formulated 
                      to combat hair loss and promote healthy hair regrowth. This advanced solution addresses the fundamental 
                      causes of hair loss by accelerating angiogenesis, inhibiting hair loss substances, and providing 
                      essential nutrients to hair follicles for optimal growth and strength.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Advanced Peptide Technology</h5>
                        <p className="text-sm text-gray-600">
                          Features Sh-polypeptide-71, Copper Tripeptide-1, and Pentapeptide-20 for targeted hair follicle support and growth stimulation.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Botanical Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Rich blend of traditional herbs including Sophora Japonica, Portulaca Oleracea, and Polygonum Multiflorum for natural scalp nourishment.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Scalp Circulation Enhancement</h5>
                        <p className="text-sm text-gray-600">
                          Niacinamide and botanical extracts work together to improve blood circulation and nutrient delivery to hair follicles.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Prevents Hair Loss - Targets fundamental causes of hair loss and inhibits substances responsible for hair thinning</li>
                      <li>Promotes Hair Regrowth - Accelerates angiogenesis and stimulates hair follicle activity for new growth</li>
                      <li>Strengthens Hair Follicles - Provides essential nutrients and peptides for stronger, healthier hair</li>
                      <li>Improves Scalp Health - Nourishes and revitalizes the scalp environment for optimal hair growth</li>
                      <li>Enhances Blood Circulation - Increases nutrient delivery to hair follicles through improved blood flow</li>
                      <li>Antioxidant Protection - Sophora Japonica and other botanical extracts provide antioxidant benefits</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Peptide Complex</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Sh-polypeptide-71:</strong> Supports hair follicle health and growth stimulation<br/>
                          <strong>Copper Tripeptide-1:</strong> Promotes collagen synthesis and hair strength<br/>
                          <strong>Pentapeptide-20:</strong> Aids in hair growth and follicle nourishment
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Botanical Extracts</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Sophora Japonica Bud Extract:</strong> Antioxidant properties for scalp protection<br/>
                          <strong>Portulaca Oleracea:</strong> Traditional herb for scalp nourishment<br/>
                          <strong>Polygonum Multiflorum Root:</strong> Known for hair strengthening properties<br/>
                          <strong>Angelica Gigas Root:</strong> Supports scalp health and circulation
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Active Components</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Niacinamide:</strong> Improves blood circulation in the scalp<br/>
                          <strong>Citrus Paradisi Seed Oil:</strong> Provides antimicrobial benefits for scalp health
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Usage Instructions</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse scalp thoroughly with HR³ MATRIX SCALP PEELING</li>
                        <li><strong>Application:</strong> Apply the solution evenly to the scalp and hair roots</li>
                        <li><strong>Massage:</strong> Gently massage into scalp for 2-3 minutes to enhance absorption</li>
                        <li><strong>Enhancement:</strong> Use with GENOSYS STAMP (ROLLER) for deeper penetration</li>
                        <li><strong>Frequency:</strong> Use 2-3 times per week for optimal results</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Form:</strong> Premium hair and scalp solution</p>
                        <p><strong>Target:</strong> Hair loss prevention and regrowth</p>
                        <p><strong>Technology:</strong> Advanced peptide and botanical extract technology</p>
                        <p><strong>Key Benefits:</strong> Hair loss prevention, regrowth stimulation, scalp health</p>
                        <p><strong>Usage:</strong> Professional and home care</p>
                        <p><strong>System:</strong> Part of HR³ MATRIX MESOPECIA KIT</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is designed for both professional and home use. For best results, 
                        use as part of the complete HR³ MATRIX MESOPECIA KIT system. Consult with a hair care professional 
                        for personalized treatment protocols.
                      </p>
                    </div>
                    
                    {/* Spacing between note and product documentation */}
                    <div className="mt-6"></div>
                    
                    {/* Product Documentation Section for Product 45 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Product Documentation</h4>
                      <p className="text-blue-700 text-sm mb-3">
                        Download the complete product manual and usage guide for professional application.
                      </p>
                      <div className="text-xs text-blue-600 mb-3">
                        📄 File size: 1.1 MB
                      </div>
                      <div className="flex gap-3">
                        <a
                          href="/documents/ppt/GENOSYS%20HR3%20MATRIX%20HAIR%20SOLUTION%20ALPHA.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                          View PDF
                        </a>
                        <a
                          href="/documents/ppt/GENOSYS%20HR3%20MATRIX%20HAIR%20SOLUTION%20ALPHA.pdf"
                          download="GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA.pdf"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </>
                ) : product.id === '49' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS GENO-LED IR II is an advanced LED therapy device that combines infrared and red light technology 
                      to provide professional-grade skin rejuvenation treatments. This innovative device utilizes specific 
                      wavelengths of light to stimulate cellular activity, promote collagen production, and enhance overall 
                      skin health for both professional and home use.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Dual Light Technology</h5>
                        <p className="text-sm text-gray-600">
                          Combines infrared (IR) and red light therapy for comprehensive skin treatment and deep tissue penetration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Professional Grade</h5>
                        <p className="text-sm text-gray-600">
                          Medical-grade LED technology designed for both professional clinic use and safe home treatments.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Advanced Safety Features</h5>
                        <p className="text-sm text-gray-600">
                          Built-in safety mechanisms and timer controls ensure optimal treatment duration and user safety.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Stimulates Collagen Production - Red light therapy promotes natural collagen synthesis for firmer, younger-looking skin</li>
                      <li>Reduces Inflammation - Infrared light helps calm irritated skin and reduces redness and swelling</li>
                      <li>Improves Skin Texture - Regular use enhances skin smoothness and reduces fine lines and wrinkles</li>
                      <li>Accelerates Healing - Promotes faster recovery from skin treatments and reduces downtime</li>
                      <li>Enhances Circulation - Improves blood flow and oxygen delivery to skin cells</li>
                      <li>Safe and Non-Invasive - Gentle, pain-free treatment suitable for all skin types</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Treatment Applications</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Anti-Aging:</strong> Reduces fine lines, wrinkles, and age spots</li>
                        <li><strong>Acne Treatment:</strong> Helps control breakouts and reduces acne scarring</li>
                        <li><strong>Skin Rejuvenation:</strong> Improves overall skin tone and texture</li>
                        <li><strong>Post-Treatment Care:</strong> Enhances recovery after professional treatments</li>
                        <li><strong>General Maintenance:</strong> Regular use for ongoing skin health and vitality</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Technical Specifications</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Light Wavelengths:</strong> Red light (630-660nm) and Infrared (800-1000nm)</p>
                        <p><strong>Treatment Time:</strong> 10-20 minutes per session</p>
                        <p><strong>Frequency:</strong> 3-5 times per week for optimal results</p>
                        <p><strong>Safety:</strong> FDA-cleared for home use</p>
                        <p><strong>Power Source:</strong> Rechargeable battery with long-lasting performance</p>
                        <p><strong>Design:</strong> Ergonomic, portable, and easy to use</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This device is designed for professional and home use. For best results, 
                        use consistently as part of your skincare routine. Consult with a skincare professional 
                        for personalized treatment protocols.
                      </p>
                    </div>
                    
                    {/* Spacing between note and product documentation */}
                    <div className="mt-6"></div>
                    
                    {/* Product Documentation Section for Product 49 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Product Documentation</h4>
                      <p className="text-blue-700 text-sm mb-3">
                        Download the complete product manual and usage guide for professional application.
                      </p>
                      <div className="text-xs text-blue-600 mb-3">
                        📄 File size: 4.6 MB
                      </div>
                      <div className="flex gap-3">
                        <a
                          href="/documents/ppt/GENO-LED%20IR%20II_2025.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                          View PDF
                        </a>
                        <a
                          href="/documents/ppt/GENO-LED%20IR%20II_2025.pdf"
                          download="GENO-LED IR II_2025.pdf"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </>
                ) : product.id === '50' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS EyeCell EYE ZONE CARE KIT is a comprehensive professional-grade solution designed to address 
                      various concerns in the delicate eye area, including fine lines, dark circles, puffiness, and crow's feet. 
                      This advanced kit combines cosmeceuticals with a specialized micro-needle roller to enhance the absorption 
                      of active ingredients and stimulate collagen production for comprehensive eye rejuvenation.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Kit Components</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Eye Contour Serum (10ml)</h5>
                        <p className="text-sm text-gray-600">
                          Intensive serum formulated with plant stem cell extracts and biopeptides to reduce deep wrinkles, 
                          diminish dark circles, and alleviate puffiness around the eyes.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Eye Contour Cream (20g)</h5>
                        <p className="text-sm text-gray-600">
                          Rich cream that targets fine lines, dark circles, and under-eye swelling while strengthening 
                          the skin's protective barrier and maintaining optimal moisture levels.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Eye Peptide Gel Patches (101g, 60 patches)</h5>
                        <p className="text-sm text-gray-600">
                          Innovative hydrogel patches designed to soothe and hydrate the eye area, reduce puffiness, 
                          combat dark circles, and provide a lifting effect for improved skin texture and tone.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Eye Roller Dermaroller (0.25mm)</h5>
                        <p className="text-sm text-gray-600">
                          Micro-needle roller specifically designed for the eye area to facilitate absorption of active 
                          ingredients and activate collagen production, enhancing overall treatment effectiveness.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Comprehensive Eye Care - Multi-faceted approach addressing wrinkles, dark circles, and puffiness</li>
                      <li>Advanced Ingredients - Formulated with peptides, plant stem cell extracts, and hyaluronic acid</li>
                      <li>Enhanced Absorption - Micro-needle roller ensures deeper penetration of active ingredients</li>
                      <li>Professional and Home Use - Suitable for both professional treatments and daily home care</li>
                      <li>Complete System - All-in-one kit for comprehensive eye area rejuvenation</li>
                      <li>Visible Results - Delivers a more youthful, vibrant, and refreshed appearance</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Cleansing:</strong> Begin by thoroughly cleansing the face and eye area</li>
                        <li><strong>Serum Application:</strong> Apply the Eye Contour Serum gently around the eyes</li>
                        <li><strong>Micro-Needling:</strong> Use the Eye Roller Dermaroller over the serum-treated area for approximately 2 minutes, avoiding excessive pressure</li>
                        <li><strong>Patch Application:</strong> Place the Eye Peptide Gel Patches under the eyes and leave them on for 20-40 minutes</li>
                        <li><strong>Cream Application:</strong> Finish by applying the Eye Contour Cream to the treated area</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Form:</strong> Professional eye care system</p>
                        <p><strong>Skin Type:</strong> All skin types, especially mature and aging skin</p>
                        <p><strong>Technology:</strong> Micro-needling + advanced peptide technology</p>
                        <p><strong>Key Benefits:</strong> Wrinkle reduction, dark circle diminishment, puffiness relief</p>
                        <p><strong>Usage:</strong> Professional and home care</p>
                        <p><strong>Kit Contents:</strong> 4 components (serum, cream, patches, roller)</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        Regular use can lead to a more youthful, vibrant, and refreshed appearance around the eyes. 
                        For best results, use in conjunction with other Genosys EyeCell products as part of your daily eye care regimen.
                      </p>
                    </div>
                    
                    {/* Spacing between note and product documentation */}
                    <div className="mt-6"></div>
                    
                    {/* Product Documentation Section for Product 50 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Product Documentation</h4>
                      <p className="text-blue-700 text-sm mb-3">
                        Download the complete product manual and usage guide for professional application.
                      </p>
                      <div className="text-xs text-blue-600 mb-3">
                        📄 File size: 1.5 MB
                      </div>
                      <div className="flex gap-3">
                        <a
                          href="/documents/ppt/GENOSYS%20EyeCell%20EYE%20ZONE%20CARE%20SYSTEM.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                          View PDF
                        </a>
                        <a
                          href="/documents/ppt/GENOSYS%20EyeCell%20EYE%20ZONE%20CARE%20SYSTEM.pdf"
                          download="GENOSYS EyeCell EYE ZONE CARE SYSTEM.pdf"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600 mb-4">
                      Apply the product on the face and gently pat with fingers in the morning and evening.
                    </p>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use as part of your daily skincare routine.
                      </p>
                    </div>
                  </>
                )}
                    
                    {/* Product Documentation Section - Show for products with PDFs */}
                    {(product.id === '51' || product.id === '12' || product.id === '33' || 
                      product.id === '44' || 
                      product.id === '20' || product.id === '14' || product.id === '18' || product.id === '29' || 
                      product.id === '21' || product.id === '23' || product.id === '15' || product.id === '41' || product.id === '11' || 
                      product.id === '34' || product.id === '39' || product.id === '48' || product.id === '38' ||
                      product.name === 'GENOSYS SKIN REBOOT PDRN MASK PACK') && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Product Documentation</h4>
                        <p className="text-blue-700 text-sm mb-3">
                          Download the complete product manual and usage guide for professional application.
                        </p>
                        <div className="text-xs text-blue-600 mb-3">
                          📄 File size: {
                            product.id === '51' ? '2.1 MB' :
                            product.id === '12' ? '1.2 MB' :
                            product.id === '33' ? '850 KB' :
                            product.id === '44' ? '800 KB' :
                            product.id === '20' ? '750 KB' :
                            product.id === '14' ? '1.0 MB' :
                            product.id === '18' ? '1.3 MB' :
                            product.id === '29' ? '1.4 MB' :
                            product.id === '21' ? '1.1 MB' :
                            product.id === '23' ? '1.2 MB' :
                            product.id === '15' ? '750 KB' :
                            product.id === '41' ? '950 KB' :
                            product.id === '11' ? '800 KB' :
                            product.id === '34' ? '1.0 MB' :
                            product.id === '39' ? '1.2 MB' :
                            product.id === '48' ? '650 KB' :
                            product.id === '38' ? '2.8 MB' :
                            product.name === 'GENOSYS SKIN REBOOT PDRN MASK PACK' ? '1.8 MB' : 'N/A'
                          }
                        </div>
                        <div className="flex gap-3">
                          <a
                            href={`/documents/ppt/${
                              product.id === '51' ? 'GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf' :
                              product.id === '12' ? 'GENOSYS%20EPI%20TURNOVER%20BOOSTING%20PEELING%20GEL.pdf' :
                              product.id === '33' ? 'GENOSYS%20EyeCell%20EYE%20PEPTIDE%20GEL%20PATCH.pdf' :
                              product.id === '44' ? 'GENOSYS%20HR3%20MATRIX%20SCALP%20SHAMPOO%20ALPHA.pdf' :
                              product.id === '20' ? 'GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf' :
                              product.id === '14' ? 'GENOSYS%20MICROBIOME%20ENERGY%20INFUSING%20MIST.pdf' :
product.id === '18' ? 'GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20SERUM.pdf' :
product.id === '29' ? 'GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20CREAM.pdf' :
                              product.id === '21' ? 'GENOSYS%20MULTI%20VITA%20RADIANCE%20SERUM.pdf' :
                              product.id === '23' ? 'GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf' :
                              product.id === '15' ? 'GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf' :
                              product.id === '41' ? 'GENOSYS%20SKIN%20CARING%20BLEMISH%20BALM%20CUSHION.pdf' :
                              product.id === '11' ? 'GENOSYS%20SKIN%20DEFENDER%20LIP%20%26%20EYE%20MAKEUP%20REMOVER.pdf' :
                              product.id === '34' ? 'GENOSYS%20SKIN%20RESCUE%20OVERNIGHT%20CREAM%20MASK.pdf' :
                              product.id === '39' ? 'GENOSYS%20ULTRA%20SHIELD%20SUN%20CREAM.pdf' :
                              product.id === '48' ? 'HAIR%20GENTRON.pdf' :
                              product.id === '38' ? 'Genosys%20Ez%20Co2%20Mask.pdf' :
                              product.name === 'GENOSYS SKIN REBOOT PDRN MASK PACK' ? 'GENOSYS%20SKIN%20REBOOT%20PDRN%20MASK%20PACK.pdf' : ''
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View PDF
                          </a>
                          <a
                            href={`/documents/ppt/${
                              product.id === '51' ? 'GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf' :
                              product.id === '12' ? 'GENOSYS%20EPI%20TURNOVER%20BOOSTING%20PEELING%20GEL.pdf' :
                              product.id === '33' ? 'GENOSYS%20EyeCell%20EYE%20PEPTIDE%20GEL%20PATCH.pdf' :
                              product.id === '44' ? 'GENOSYS%20HR3%20MATRIX%20SCALP%20SHAMPOO%20ALPHA.pdf' :
                              product.id === '20' ? 'GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf' :
                              product.id === '14' ? 'GENOSYS%20MICROBIOME%20ENERGY%20INFUSING%20MIST.pdf' :
product.id === '18' ? 'GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20SERUM.pdf' :
product.id === '29' ? 'GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20CREAM.pdf' :
                              product.id === '21' ? 'GENOSYS%20MULTI%20VITA%20RADIANCE%20SERUM.pdf' :
                              product.id === '23' ? 'GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf' :
                              product.id === '15' ? 'GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf' :
                              product.id === '41' ? 'GENOSYS%20SKIN%20CARING%20BLEMISH%20BALM%20CUSHION.pdf' :
                              product.id === '11' ? 'GENOSYS%20SKIN%20DEFENDER%20LIP%20%26%20EYE%20MAKEUP%20REMOVER.pdf' :
                              product.id === '34' ? 'GENOSYS%20SKIN%20RESCUE%20OVERNIGHT%20CREAM%20MASK.pdf' :
                              product.id === '39' ? 'GENOSYS%20ULTRA%20SHIELD%20SUN%20CREAM.pdf' :
                              product.id === '48' ? 'HAIR%20GENTRON.pdf' :
                              product.name === 'GENOSYS SKIN REBOOT PDRN MASK PACK' ? 'GENOSYS%20SKIN%20REBOOT%20PDRN%20MASK%20PACK.pdf' : ''
                            }`}
                            download={`${
                              product.id === '51' ? 'GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK.pdf' :
                              product.id === '12' ? 'GENOSYS EPI TURNOVER BOOSTING PEELING GEL.pdf' :
                              product.id === '33' ? 'GENOSYS EyeCell EYE PEPTIDE GEL PATCH.pdf' :
                              product.id === '44' ? 'GENOSYS HR3 MATRIX SCALP SHAMPOO ALPHA.pdf' :
                              product.id === '20' ? 'GENOSYS INTENSIVE PROBLEM CONTROL TONER.pdf' :
                              product.id === '14' ? 'GENOSYS MICROBIOME ENERGY INFUSING MIST.pdf' :
product.id === '18' ? 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM.pdf' :
product.id === '29' ? 'GENOSYS MOISTURE REPLENISHING HYALURON CREAM.pdf' :
                              product.id === '21' ? 'GENOSYS MULTI VITA RADIANCE SERUM.pdf' :
                              product.id === '23' ? 'GENOSYS MULTI VITA RADIANCE CREAM.pdf' :
                              product.id === '15' ? 'GENOSYS INTENSIVE PROBLEM CONTROL TONER.pdf' :
                              product.id === '41' ? 'GENOSYS SKIN CARING BLEMISH BALM CUSHION.pdf' :
                              product.id === '11' ? 'GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER.pdf' :
                              product.id === '34' ? 'GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK.pdf' :
                              product.id === '39' ? 'GENOSYS ULTRA SHIELD SUN CREAM.pdf' :
                              product.id === '48' ? 'HAIR GENTRON.pdf' :
                              product.id === '38' ? 'Genosys Ez Co2 Mask.pdf' :
                              product.name === 'GENOSYS SKIN REBOOT PDRN MASK PACK' ? 'GENOSYS SKIN REBOOT PDRN MASK PACK.pdf' : ''
                            }`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                            Download
                          </a>
                        </div>
                      </div>
                )}
                    </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
