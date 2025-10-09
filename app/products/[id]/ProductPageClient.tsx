/* eslint-disable react/no-unescaped-entities */
'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { useAuth } from '@/components/AuthProvider'
import ErrorPage from '@/components/ErrorPage'
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, Minus, Plus, Lock } from 'lucide-react'
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
    if (product.id === '1') {
      return 230 // Same price for all needle sizes
    }
    if (product.id === '10') {
      return size === '180ml' ? 330 : 510
    }
    if (product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31') {
      return size === '50g' ? 290 : 420
    }
    if (product.id === '15') {
      return size === '200ml' ? 260 : 490
    }
    if (product.id === '16') {
      return size === '200ml' ? 260 : 490
    }
    if (product.id === '25') {
      return size === '20g' ? 204 : 440
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
      // Only pass selectedSize for product ID 1, 10, 30, 29, 32, 28, 31, 15, 16, and 25
      const sizeToPass = (product.id === '1' || product.id === '10' || product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31' || product.id === '15' || product.id === '16' || product.id === '25') ? selectedSize : undefined
      
      // Create a modified product with the correct price for products 1, 10, 30, 29, 32, 28, 31, 15, 16, and 25
      const productToAdd = (product.id === '1' || product.id === '10' || product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31' || product.id === '15' || product.id === '16' || product.id === '25')
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
              {(product.size || product.id === '1' || product.id === '41' || product.id === '10' || product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31' || product.id === '24' || product.id === '16' || product.id === '25') && (
                <div className="text-sm font-medium text-gray-700">
                  Size: {product.id === '1' ? '0.25mm/0.5mm/0.1mm/0.15mm/0.2mm' : product.id === '41' ? '15g' : product.id === '10' ? '180ml/500ml' : product.id === '31' ? '50g/230g' : (product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28') ? '50g/250g' : product.id === '15' ? '200ml/500ml' : product.id === '16' ? '200ml/1000ml' : product.id === '25' ? '20g/100g' : product.id === '24' ? '20g' : product.size}
                </div>
              )}
              {user && user.canSeePrices ? (
                <>
                  <div className="text-2xl md:text-3xl font-bold text-primary-600">
                    {getPriceForSize((product.id === '1' || product.id === '10' || product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31' || product.id === '15' || product.id === '16' || product.id === '25') ? selectedSize : 'default').toFixed(2)} AED
                  </div>
                  <div className="text-sm font-normal text-gray-600">(VAT included)</div>
                </>
              ) : user ? (
                <div className="flex items-center text-gray-500">
                  <Lock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Price locked</span>
                </div>
              ) : (
                <button
                  onClick={() => router.push('/login')}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Login to see price
                </button>
              )}
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

            {/* Size Selection - Only for product ID 1, 10, 30, 29, 32, 28, 31, 15, 16, and 25 */}
            {(product.id === '1' || product.id === '10' || product.id === '30' || product.id === '29' || product.id === '32' || product.id === '28' || product.id === '31' || product.id === '15' || product.id === '16' || product.id === '25') && (
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">Size:</div>
                <div className="flex gap-3">
                  {(product.id === '1' ? [
                    { size: '0.25mm', price: 230 },
                    { size: '0.5mm', price: 230 },
                    { size: '0.1mm', price: 230 },
                    { size: '0.15mm', price: 230 },
                    { size: '0.2mm', price: 230 }
                  ] : product.id === '10' ? [
                    { size: '180ml', price: 330 },
                    { size: '500ml', price: 510 }
                  ] : product.id === '31' ? [
                    { size: '50g', price: 290 },
                    { size: '230g', price: 420 }
                  ] : product.id === '15' ? [
                    { size: '200ml', price: 260 },
                    { size: '500ml', price: 490 }
                  ] : product.id === '16' ? [
                    { size: '200ml', price: 260 },
                    { size: '1000ml', price: 490 }
                  ] : product.id === '25' ? [
                    { size: '20g', price: 204 },
                    { size: '100g', price: 440 }
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
                        {user && user.canSeePrices ? (
                          <div className="text-sm text-gray-500">{option.price} AED</div>
                        ) : user ? (
                          <div className="text-sm text-gray-400 flex items-center justify-center">
                            <Lock className="h-3 w-3 mr-1" />
                            Price locked
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">Login to see price</div>
                        )}
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
                {product.inStock ? (product.id === '47' ? 'Order by Request' : 'In Stock') : 'Out of Stock'}
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      The GENOSYS Microneedle Roller is a professional-grade microneedling device featuring the patented Diskneedle Therapy System (DTS) for enhanced skin rejuvenation. This advanced device utilizes 450 ultra-thin needles that are 25% thinner than competitors, ensuring superior product absorption with minimal skin trauma.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Patented DTS Technology</h5>
                        <p className="text-sm text-gray-600">
                          Diskneedle Therapy System ensures safe and effective treatments with reduced recovery time.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Ultra-Thin Needles</h5>
                        <p className="text-sm text-gray-600">
                          450 needles per unit, 25% thinner than other brands for enhanced comfort and effectiveness.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Professional Grade</h5>
                        <p className="text-sm text-gray-600">
                          Manufactured in South Korea with precision engineering for professional use.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Enhanced Product Absorption - Creates microchannels for 300% better product penetration</li>
                      <li>Natural Collagen Induction - Stimulates skin's healing response for firmer, younger-looking skin</li>
                      <li>Reduced Fine Lines & Wrinkles - Promotes elastin production for improved skin texture</li>
                      <li>Scar Reduction - Effective for treating acne scars, surgical scars, and stretch marks</li>
                      <li>Pore Minimization - Helps reduce pore size and improve skin smoothness</li>
                      <li>Hyperpigmentation Treatment - Aids in reducing dark spots and uneven skin tone</li>
                      <li>Minimal Downtime - Less invasive than traditional treatments with faster recovery</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and sanitize the roller</li>
                        <li><strong>Application:</strong> Roll gently in vertical, horizontal, and diagonal directions</li>
                        <li><strong>Coverage:</strong> Treat each area for 2-3 minutes with light pressure</li>
                        <li><strong>Post-Treatment:</strong> Apply soothing serum or hyaluronic acid</li>
                        <li><strong>Frequency:</strong> Use once every 4-6 weeks for optimal results</li>
                        <li><strong>Maintenance:</strong> Clean and sanitize after each use</li>
                      </ol>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Product Details</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Technical Specifications</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Needle Count:</strong> 450 ultra-thin needles</p>
                        <p><strong>Needle Thickness:</strong> 25% thinner than competitors</p>
                        <p><strong>Technology:</strong> Patented Diskneedle Therapy System (DTS)</p>
                        <p><strong>Manufacturing:</strong> South Korea</p>
                        <p><strong>Professional Use:</strong> Licensed practitioners only</p>
                        <p><strong>Treatment Areas:</strong> Face, body, scalp applications</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This device is intended for professional use by licensed practitioners. 
                        Consult with a qualified professional to determine the appropriate treatment protocol 
                        based on your individual skin needs and concerns.
                      </p>
                    </div>
                  </>
                ) : product.id === '11' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      SKIN DEFENDER LIP & EYE MAKEUP REMOVER is an advanced biphasic makeup remover specifically 
                      designed for the delicate lip and eye areas. This innovative formula combines vitamin complex 
                      and firming peptides to provide gentle yet effective cleansing without irritation.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Biphasic Technology</h5>
                        <p className="text-sm text-gray-600">
                          Dual-layer formula with essence layer containing vitamins and firming peptides, plus oil layer for powerful cleansing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Gentle Formula</h5>
                        <p className="text-sm text-gray-600">
                          Specifically designed for delicate lip and eye areas with non-greasy, non-irritating properties.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Vitamin Complex</h5>
                        <p className="text-sm text-gray-600">
                          10 Vitamin Complex provides nourishment while cleansing, promoting healthy skin around the eyes and lips.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Firming Peptides</h5>
                        <p className="text-sm text-gray-600">
                          Palmitoyl Tripeptide-5 and Acetyl Tetrapeptide-5 help maintain skin firmness and elasticity.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Effective Makeup Removal - Removes even waterproof makeup from delicate areas</li>
                      <li>Gentle Cleansing - Non-irritating formula suitable for sensitive skin</li>
                      <li>Nourishing Properties - Vitamin complex provides skin nourishment</li>
                      <li>Firming Action - Peptides help maintain skin firmness and elasticity</li>
                      <li>Easy Application - Shake well before use for optimal results</li>
                      <li>Professional Quality - Dermatologically tested for safety and efficacy</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">10 Vitamin Complex</h5>
                        <p className="text-sm text-gray-600">
                          Comprehensive vitamin blend that provides nourishment and antioxidant protection while cleansing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Firming Peptides</h5>
                        <p className="text-sm text-gray-600">
                          Palmitoyl Tripeptide-5 and Acetyl Tetrapeptide-5 help maintain skin firmness and reduce signs of aging.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Botanical Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Rosa Damascena Flower Water, Carrot Root Extract, and Broccoli Extract provide natural nourishment.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Nourishing Oils</h5>
                        <p className="text-sm text-gray-600">
                          Carrot Seed Oil and Sea Buckthorn Oil provide essential fatty acids and vitamins for skin health.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Shake Well:</strong> Shake the bottle well before use to mix the biphasic layers</li>
                        <li><strong>Application:</strong> Apply a small amount to cotton pad or fingertips</li>
                        <li><strong>Gentle Removal:</strong> Gently wipe away makeup from lips and eye area</li>
                        <li><strong>Rinse:</strong> Rinse with lukewarm water if desired</li>
                        <li><strong>Follow-up:</strong> Continue with your regular skincare routine</li>
                        <li><strong>Storage:</strong> Store in a cool, dry place away from direct sunlight</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Biphasic makeup remover</p>
                        <p><strong>Size:</strong> 200ml</p>
                        <p><strong>Key Benefits:</strong> Gentle cleansing, makeup removal, skin nourishment</p>
                        <p><strong>Target Areas:</strong> Lips and eye area</p>
                        <p><strong>Usage:</strong> Daily makeup removal</p>
                        <p><strong>Testing:</strong> Dermatologically tested</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and specifically formulated for 
                        delicate lip and eye areas. For best results, shake well before use and store in a cool, 
                        dry place away from direct sunlight.
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Details</h3>
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
                ) : product.id === '15' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS INTENSIVE PROBLEM CONTROL TONER is a professional-grade toner specifically formulated 
                      to address problematic skin conditions and provide intensive care for acne-prone, sensitive, 
                      and irritated skin. This advanced toner combines powerful active ingredients with soothing 
                      botanical extracts to deliver comprehensive skin care benefits.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Intensive Problem Control - Targets acne, blemishes, and skin irritations effectively</li>
                      <li>Pore Minimizing - Helps reduce pore size and tighten skin texture</li>
                      <li>Skin Soothing - Calms irritated and sensitive skin with anti-inflammatory properties</li>
                      <li>Dead Skin Cell Removal - Gently exfoliates and removes impurities for clearer skin</li>
                      <li>pH Balancing - Restores optimal skin pH levels for healthy skin barrier</li>
                      <li>Professional Results - Delivers clinical-grade benefits for problem skin management</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="space-y-3 text-gray-600 text-sm">
                        <div>
                          <strong>Method 1 - Daily Cleansing:</strong>
                          <p>Soak a cotton pad with toner and gently wipe along the skin texture to remove dead skin cells and residues after washing the face.</p>
                        </div>
                        <div>
                          <strong>Method 2 - Intensive Treatment:</strong>
                          <p>Soak cotton pads with toner and apply them to the face. Leave them on for 5-10 minutes to enhance pore contraction effect and soothe the skin.</p>
                        </div>
                      </div>
            </div>

                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Salicylic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Beta-hydroxy acid that penetrates pores to dissolve dead skin cells and excess oil, 
                          helping to prevent acne breakouts and improve skin texture.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Witch Hazel Extract</h5>
                        <p className="text-sm text-gray-600">
                          Natural astringent that tightens pores, reduces inflammation, and provides soothing 
                          relief for irritated and sensitive skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Tea Tree Extract</h5>
                        <p className="text-sm text-gray-600">
                          Powerful antimicrobial and anti-inflammatory agent that helps combat acne-causing 
                          bacteria while soothing irritated skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Aloe Vera Extract</h5>
                        <p className="text-sm text-gray-600">
                          Soothing and healing ingredient that calms inflammation, reduces redness, and 
                          promotes skin healing for problem areas.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Niacinamide</h5>
                        <p className="text-sm text-gray-600">
                          Vitamin B3 derivative that helps regulate sebum production, minimize pores, and 
                          improve skin barrier function for healthier skin.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Form:</strong> Intensive problem control toner</p>
                        <p><strong>Target:</strong> Acne-prone, sensitive, and problematic skin</p>
                        <p><strong>Technology:</strong> Advanced active ingredient complex</p>
                        <p><strong>Key Benefits:</strong> Problem control, pore minimizing, skin soothing</p>
                        <p><strong>Usage:</strong> Professional and home care</p>
                        <p><strong>Volume:</strong> 200ml / 500ml</p>
                        <p><strong>Skin Type:</strong> Problematic, acne-prone, sensitive skin</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        Particularly effective for problematic and acne-prone skin. For best results, use as part 
                        of your daily skincare routine and follow with appropriate moisturizer.
                      </p>
                    </div>
                    
                    {/* Spacing between note and product documentation */}
                    <div className="mt-6"></div>
                    
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      SNOW BOOSTER is a premium daily moisturizing and skin refining toner designed for all skin types. 
                      This advanced formula combines powerful botanical extracts with innovative fermentation technology to 
                      provide deep hydration, pH balancing, and skin refinement for a healthy, glowing complexion.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Daily Moisturizing</h5>
                        <p className="text-sm text-gray-600">
                          Provides essential hydration and moisture replenishment for all skin types, maintaining optimal skin barrier function.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Skin Refining</h5>
                        <p className="text-sm text-gray-600">
                          Helps refine skin texture and improve overall skin quality through gentle exfoliation and pH balancing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">pH Balancing</h5>
                        <p className="text-sm text-gray-600">
                          Restores optimal skin pH levels after cleansing, promoting healthy skin function and barrier protection.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Botanical Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Enriched with natural botanical extracts that provide soothing, anti-inflammatory, and antioxidant benefits.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Deep Hydration - Provides immediate and long-lasting moisture to all skin types</li>
                      <li>Skin Refinement - Gently exfoliates and refines skin texture for smoother appearance</li>
                      <li>pH Restoration - Balances skin pH levels after cleansing for optimal skin health</li>
                      <li>Soothing Properties - Calms and soothes irritated or sensitive skin</li>
                      <li>Antioxidant Protection - Protects against environmental damage and free radicals</li>
                      <li>Versatile Usage - Suitable for daily use in both homecare and professional settings</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Phytolex SC</h5>
                        <p className="text-sm text-gray-600">
                          Advanced botanical complex that provides deep hydration and skin-soothing properties while supporting natural skin barrier function.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Nelumbo Nucifera Flower Extract</h5>
                        <p className="text-sm text-gray-600">
                          Sacred lotus extract known for its antioxidant properties, skin brightening effects, and ability to promote skin radiance.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Lactobacillus/Pumpkin Ferment Extract</h5>
                        <p className="text-sm text-gray-600">
                          Innovative fermentation technology that enhances ingredient absorption and provides probiotic benefits for skin microbiome health.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Betaine</h5>
                        <p className="text-sm text-gray-600">
                          Natural moisturizing agent that helps maintain skin hydration and provides gentle cleansing properties without stripping natural oils.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2 text-sm">Method 1: Skin Cleansing & Exfoliation</h5>
                          <p className="text-sm text-gray-600">
                            Soak a cotton pad with toner and gently wipe along the skin texture to remove dead skin cells and residues after cleansing.
                          </p>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2 text-sm">Method 2: Immediate Moisture Replenishment</h5>
                          <p className="text-sm text-gray-600">
                            Spray the product (200ml homecare version) generously with eyes closed and tap gently. Can be used even over makeup for instant hydration.
                          </p>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2 text-sm">Method 3: Intensive Moisturizing Treatment</h5>
                          <p className="text-sm text-gray-600">
                            Soak cotton pads with toner and apply to face as a hydrating mask. Leave on for 5-10 minutes for intensive moisturizing and soothing effects.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Daily moisturizing and skin refining toner</p>
                        <p><strong>Size Options:</strong> 200ml (Homecare) / 1000ml (Professional)</p>
                        <p><strong>Skin Types:</strong> All skin types</p>
                        <p><strong>Usage:</strong> Daily skincare routine</p>
                        <p><strong>Key Benefits:</strong> Hydration, skin refinement, pH balancing</p>
                        <p><strong>Testing:</strong> Dermatologically tested</p>
                        <p><strong>Efficacy:</strong> Proven skin hydration improvement</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use as part of your daily skincare routine. The 200ml size is perfect for homecare, 
                        while the 1000ml size is ideal for professional use in clinics and spas.
                      </p>
                    </div>
                  </>
                ) : product.id === '17' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                ) : product.id === '29' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      MOISTURE REPLENISHING HYALURON CREAM is an advanced moisturizing cream that provides 
                      long-lasting hydration through a sophisticated 4-step skin hydration system. This innovative 
                      formula combines multiple molecular weights of hyaluronic acid with mushroom extracts to 
                      deliver deep, sustained moisture that lasts up to 72 hours.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">4-Step Hydration System</h5>
                        <p className="text-sm text-gray-600">
                          Advanced multi-layered hydration that cools, attracts, replenishes, and locks in moisture 
                          for comprehensive skin hydration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">72-Hour Hydration Persistence</h5>
                        <p className="text-sm text-gray-600">
                          Clinically proven to maintain skin hydration for up to 72 hours, providing long-lasting 
                          moisture benefits.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hyaluronan 11 Multi-Complex</h5>
                        <p className="text-sm text-gray-600">
                          Advanced hyaluronic acid complex with multiple molecular weights for deep penetration 
                          and surface protection.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Mushroom Extract Complex</h5>
                        <p className="text-sm text-gray-600">
                          Powerful anti-inflammatory and antioxidant properties from various mushroom extracts 
                          for skin nourishment and protection.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Deep Hydration - Multi-layered moisture delivery for comprehensive skin hydration</li>
                      <li>Long-Lasting Results - 72-hour hydration persistence for sustained moisture</li>
                      <li>Skin Barrier Protection - Strengthens moisture barrier to prevent water loss</li>
                      <li>Cooling Sensation - Natural cooling agents provide instant skin refreshment</li>
                      <li>Anti-Aging Benefits - Reduces fine lines and improves skin elasticity</li>
                      <li>All Skin Types - Suitable for all skin types, including sensitive skin</li>
                      <li>Professional Results - Salon-quality hydration at home</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hyaluronan 11 Multi-Complex</h5>
                        <p className="text-sm text-gray-600">
                          Advanced hyaluronic acid complex with low, middle, and high molecular weights for 
                          comprehensive skin hydration and protection.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Mushroom Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Various mushroom extracts provide powerful anti-inflammatory and antioxidant 
                          properties for skin nourishment and protection.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Moisture Magnet Technology</h5>
                        <p className="text-sm text-gray-600">
                          Special ingredients that attract and retain moisture, creating a moisture 
                          reservoir in the skin for sustained hydration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Natural Cooling Agents</h5>
                        <p className="text-sm text-gray-600">
                          Natural-origin cooling agents provide instant skin refreshment and help 
                          lower skin temperature for a refreshing sensation.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-blue-800 text-sm space-y-2">
                        <li><strong>Cleanse:</strong> Start with clean, dry skin</li>
                        <li><strong>Apply:</strong> Take a small amount and gently massage onto face and neck</li>
                        <li><strong>Massage:</strong> Use upward circular motions until fully absorbed</li>
                        <li><strong>Frequency:</strong> Use morning and evening for best results</li>
                        <li><strong>Follow-up:</strong> Apply sunscreen during the day</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Advanced moisturizing cream</p>
                        <p><strong>Size:</strong> 50g/250g</p>
                        <p><strong>Key Benefits:</strong> Deep hydration, 72-hour persistence, skin barrier protection</p>
                        <p><strong>Skin Type:</strong> All skin types, especially dry and dehydrated skin</p>
                        <p><strong>Usage:</strong> Daily morning and evening application</p>
                        <p><strong>Technology:</strong> 4-step hydration system with multi-molecular hyaluronic acid</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and clinically proven for 
                        72-hour hydration persistence. For best results, use consistently as part of your daily 
                        skincare routine. Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '30' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                ) : product.id === 'cmgj9ifoi00008o07p4eqmfb7' ? ( // Product 53 - INTENSIVE REPAIR COLLAGEN MASK
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      INTENSIVE REPAIR COLLAGEN MASK is a professional-grade sheet mask designed to restore skin firmness and elasticity. 
                      This innovative mask provides intensive repair and anti-aging benefits with hydrolyzed collagen and hyaluronic acid 
                      for comprehensive skin nourishment and hydration.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Professional-Grade Quality</h5>
                        <p className="text-sm text-gray-600">
                          Advanced collagen mask technology that provides optimal skin contact and ingredient delivery.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Dermatologically Tested</h5>
                        <p className="text-sm text-gray-600">
                          Clinically tested formula safe for all skin types with proven results.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Long-Lasting Results</h5>
                        <p className="text-sm text-gray-600">
                          Provides sustained benefits for improved skin texture and appearance.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Safe for All Skin Types</h5>
                        <p className="text-sm text-gray-600">
                          Gentle yet effective formula suitable for sensitive and mature skin.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Intensive Hydration - Provides deep moisture for soft, supple skin</li>
                      <li>Enhanced Elasticity - Boosts collagen production for improved skin firmness</li>
                      <li>Reduces Fine Lines - Diminishes appearance of wrinkles for youthful complexion</li>
                      <li>Skin Brightening - Enhances radiance and evens skin tone</li>
                      <li>Deep Nourishment - Delivers essential nutrients for skin health</li>
                      <li>Anti-Aging Properties - Combats signs of aging for younger-looking skin</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hydrolyzed Collagen</h5>
                        <p className="text-sm text-gray-600">
                          Protein that supports skin structure and improves firmness.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hyaluronic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Powerful humectant that attracts and retains moisture.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Vitamin E</h5>
                        <p className="text-sm text-gray-600">
                          Antioxidant that protects skin from environmental damage.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Seaweed Extract</h5>
                        <p className="text-sm text-gray-600">
                          Rich in minerals and vitamins for skin nourishment.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Argan Oil</h5>
                        <p className="text-sm text-gray-600">
                          Moisturizes and softens skin with essential fatty acids.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Shea Butter</h5>
                        <p className="text-sm text-gray-600">
                          Natural emollient that soothes and hydrates skin.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and apply toner if desired</li>
                        <li><strong>Application:</strong> Remove mask from package and unfold carefully</li>
                        <li><strong>Placement:</strong> Apply mask to face, adjusting for proper fit</li>
                        <li><strong>Duration:</strong> Leave on for 15-20 minutes for optimal results</li>
                        <li><strong>Removal:</strong> Gently remove mask and massage remaining essence into skin</li>
                        <li><strong>Frequency:</strong> Use 2-3 times per week for best results</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Professional collagen sheet mask</p>
                        <p><strong>Size:</strong> 1 Sheet (23g)</p>
                        <p><strong>Key Benefits:</strong> Intensive repair, deep hydration, anti-aging</p>
                        <p><strong>Skin Type:</strong> All skin types, especially mature skin</p>
                        <p><strong>Usage:</strong> 2-3 times per week</p>
                        <p><strong>Technology:</strong> Hydrolyzed collagen delivery system</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-green-800 mb-2 text-sm">Note:</h5>
                      <p className="text-green-800 text-sm">
                        This product is dermatologically tested and clinically proven to improve skin hydration. For best results, use consistently as part of your weekly skincare routine. Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '32' ? ( // Added detailed description for product 32
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use as part of your daily skincare routine.
                      </p>
                    </div>
                  </>
                ) : product.id === '51' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                ) : product.id === '35' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS HYDRO COOL MODELING MASK is a professional modeling mask that provides immediate 
                      cooling and soothing effects to the skin. This advanced mask is specifically designed to 
                      soothe skin after professional treatments, improve hydration, and reduce pore size while 
                      delivering a refreshing cooling sensation for optimal skin comfort.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Immediate Cooling Effect - Provides instant cooling and refreshing sensation</li>
                      <li>Post-Treatment Soothing - Calms and soothes skin after professional treatments</li>
                      <li>Enhanced Hydration - Delivers deep moisture and improves skin hydration</li>
                      <li>Pore Minimizing - Helps reduce pore size for smoother skin texture</li>
                      <li>Skin Barrier Support - Strengthens and enhances skin barrier function</li>
                      <li>Collagen Synthesis - Stimulates collagen production for firmer skin</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Cleanse:</strong> Begin with thoroughly cleansed facial skin</li>
                        <li><strong>Application:</strong> Apply the modeling mask evenly to the face</li>
                        <li><strong>Processing Time:</strong> Leave the mask on for 15-20 minutes</li>
                        <li><strong>Removal:</strong> Gently rub the residue into the skin for additional benefits</li>
                        <li><strong>Rinse:</strong> Rinse off any remaining residue with lukewarm water</li>
                        <li><strong>Follow-up:</strong> Continue with your regular skincare routine</li>
                      </ol>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Centella Asiatica Extract</h5>
                        <p className="text-sm text-gray-600">
                          Powerful botanical extract that increases collagen synthesis, enhances skin barrier 
                          function, and provides anti-inflammatory benefits for improved skin health and texture.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Hyaluronic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Deep hydrating ingredient that attracts and retains moisture, providing intense 
                          hydration and plumping effects for smoother, more youthful-looking skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Ceramide</h5>
                        <p className="text-sm text-gray-600">
                          Essential lipid that strengthens the skin barrier, locks in moisture, and protects 
                          against environmental damage for healthier, more resilient skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Allantoin</h5>
                        <p className="text-sm text-gray-600">
                          Soothing and healing ingredient that calms irritated skin, promotes cell regeneration, 
                          and provides gentle exfoliation for improved skin texture.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Mentha Piperita (Peppermint) Extract</h5>
                        <p className="text-sm text-gray-600">
                          Natural cooling agent that provides refreshing sensation, soothes inflammation, 
                          and helps reduce skin redness and irritation.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">Chamaecyparis Obtusa Water</h5>
                        <p className="text-sm text-gray-600">
                          Purified water extract that provides gentle hydration and soothing properties, 
                          helping to calm and refresh the skin naturally.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Form:</strong> Professional modeling mask</p>
                        <p><strong>Target:</strong> Post-treatment skin soothing and hydration</p>
                        <p><strong>Technology:</strong> Advanced cooling and hydrating formula</p>
                        <p><strong>Key Benefits:</strong> Cooling effect, hydration, pore minimizing, skin soothing</p>
                        <p><strong>Usage:</strong> Professional and home care</p>
                        <p><strong>Volume:</strong> 1kg</p>
                        <p><strong>Skin Type:</strong> All skin types</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        Particularly beneficial after professional skin treatments. For best results, use as part 
                        of your regular skincare routine to maintain optimal skin health and comfort.
                      </p>
                    </div>
                  </>
                ) : product.id === '44' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                ) : product.id === '14' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      MICROBIOME ENERGY INFUSING MIST is an advanced revitalizing mist designed to restore and balance 
                      the skin's natural microbiome while providing instant hydration and radiance. This innovative 
                      formula combines cutting-edge probiotic technology with powerful hydrating ingredients to enhance 
                      skin's natural strength and glow.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Microbiome Technology</h5>
                        <p className="text-sm text-gray-600">
                          Advanced probiotic and prebiotic blend that corrects and maintains the natural balance of skin microbiome.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Instant Hydration</h5>
                        <p className="text-sm text-gray-600">
                          Powerful hyaluronic acid complex that provides immediate and long-lasting moisture to the skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Natural Radiance</h5>
                        <p className="text-sm text-gray-600">
                          Unique formula that revitalizes skin and enhances natural glow and radiance for a healthy complexion.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Barrier Protection</h5>
                        <p className="text-sm text-gray-600">
                          Strengthens skin's natural moisture barrier and enhances skin's natural defense mechanisms.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Microbiome Balance - Restores and maintains healthy skin microbiome</li>
                      <li>Instant Hydration - Provides immediate moisture and long-lasting hydration</li>
                      <li>Natural Radiance - Enhances skin's natural glow and radiance</li>
                      <li>Barrier Strengthening - Improves skin's natural moisture barrier function</li>
                      <li>Skin Revitalization - Energizes and revitalizes tired, stressed skin</li>
                      <li>Gentle Care - Suitable for all skin types, including sensitive skin</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">CUREBIOME (Probiotics & Prebiotics)</h5>
                        <p className="text-sm text-gray-600">
                          Advanced microbiome technology that corrects skin microbiome balance and promotes healthy skin flora.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">FENSEBIOME™ (Acetyl Heptapeptide-4)</h5>
                        <p className="text-sm text-gray-600">
                          Innovative peptide that enhances skin's natural defense mechanisms and microbiome health.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hyaluronan 10 Multi-Complex</h5>
                        <p className="text-sm text-gray-600">
                          Multi-molecular hyaluronic acid complex that provides deep hydration and plumping effects.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Butyrospermum Parkii (Shea) Butter</h5>
                        <p className="text-sm text-gray-600">
                          Natural emollient that provides additional moisture and helps maintain skin's natural barrier.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse your skin thoroughly before application</li>
                        <li><strong>Application:</strong> Hold the bottle 15-20cm away from your face and mist evenly</li>
                        <li><strong>Absorption:</strong> Gently pat the mist into your skin with your fingertips</li>
                        <li><strong>Frequency:</strong> Use morning and evening, or as needed throughout the day</li>
                        <li><strong>Layering:</strong> Can be used before or after other skincare products</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Microbiome energy infusing mist</p>
                        <p><strong>Size:</strong> 80ml</p>
                        <p><strong>Key Benefits:</strong> Microbiome balance, hydration, radiance, barrier protection</p>
                        <p><strong>Skin Type:</strong> All skin types</p>
                        <p><strong>Usage:</strong> Daily skincare routine, on-the-go hydration</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        Perfect for daily use and can be reapplied throughout the day for instant hydration. 
                        Store in a cool, dry place and shake well before use for best results.
                      </p>
                    </div>
                  </>
                ) : product.id === '28' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      INTENSIVE HYDRO SOOTHING CREAM is a premium hydrating and soothing cream designed to provide intensive 
                      moisture and calm irritated skin. This advanced formula combines powerful natural ingredients including 
                      aloe vera, snail secretion filtrate, and hyaluronic acid to deliver long-lasting hydration and skin comfort.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Intensive Hydration</h5>
                        <p className="text-sm text-gray-600">
                          Advanced hydrating formula that provides long-lasting moisture and helps maintain optimal skin hydration levels.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Soothing Properties</h5>
                        <p className="text-sm text-gray-600">
                          Calms down skin irritation and provides relief for sensitive, stressed, or damaged skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Natural Ingredients</h5>
                        <p className="text-sm text-gray-600">
                          Formulated with premium natural ingredients including aloe vera and snail secretion filtrate for gentle, effective care.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Professional & Home Use</h5>
                        <p className="text-sm text-gray-600">
                          Available in both homecare (50g) and professional (250g) sizes for versatile application.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Intensive Hydration - Provides long-lasting moisture for all skin types</li>
                      <li>Skin Soothing - Calms irritation and reduces redness and inflammation</li>
                      <li>Skin Repair - Promotes natural healing and skin regeneration</li>
                      <li>Barrier Protection - Strengthens skin's natural protective barrier</li>
                      <li>Gentle Care - Suitable for sensitive and irritated skin</li>
                      <li>Versatile Use - Perfect for both professional treatments and daily home care</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Aloe Barbadensis Leaf Extract</h5>
                        <p className="text-sm text-gray-600">
                          Natural soothing and healing ingredient that calms irritated skin and provides gentle hydration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Snail Secretion Filtrate</h5>
                        <p className="text-sm text-gray-600">
                          Premium ingredient rich in glycoproteins and growth factors that promote skin regeneration and healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hyaluronic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Powerful humectant that attracts and retains moisture, providing intense hydration and plumping effects.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Lactobacillus/Pumpkin Ferment Extract</h5>
                        <p className="text-sm text-gray-600">
                          Fermented ingredient that provides probiotics and nutrients for improved skin health and texture.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Beta-Glucan</h5>
                        <p className="text-sm text-gray-600">
                          Natural immune-boosting ingredient that enhances skin's defense mechanisms and promotes healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Phytolex SC</h5>
                        <p className="text-sm text-gray-600">
                          Advanced botanical complex that provides additional skin protection and soothing benefits.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse your skin thoroughly before application</li>
                        <li><strong>Application:</strong> Apply a generous amount to the face and neck area</li>
                        <li><strong>Massage:</strong> Gently massage in circular motions until fully absorbed</li>
                        <li><strong>Frequency:</strong> Use morning and evening for optimal results</li>
                        <li><strong>Professional Use:</strong> Can be used as a treatment mask for enhanced benefits</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Intensive hydro soothing cream</p>
                        <p><strong>Size Options:</strong> 50g (Homecare) / 250g (Professional)</p>
                        <p><strong>Key Benefits:</strong> Hydration, soothing, skin repair, barrier protection</p>
                        <p><strong>Skin Type:</strong> All skin types, especially sensitive and irritated skin</p>
                        <p><strong>Usage:</strong> Professional and home care</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        Perfect for daily use and post-treatment care. For best results, use as part of your 
                        daily skincare routine and reapply as needed for additional hydration.
                      </p>
                    </div>
                  </>
                ) : product.id === '4' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      POWER SOLUTION HES is a professional hydrating and firming ampoule specifically formulated for microneedling treatments. 
                      This advanced formula combines powerful hydrating agents with firming peptides to provide long-lasting moisturizing 
                      and plumping effects while relieving skin irritation and promoting optimal healing post-treatment.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Professional Microneedling Formula</h5>
                        <p className="text-sm text-gray-600">
                          Specifically designed for use with microneedling treatments to maximize ingredient penetration and effectiveness.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hydrating & Firming</h5>
                        <p className="text-sm text-gray-600">
                          Advanced formula that provides deep hydration while promoting skin firmness and elasticity.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Growth Factor Technology</h5>
                        <p className="text-sm text-gray-600">
                          Contains sh-polypeptide-7, a human growth hormone-like peptide for enhanced skin regeneration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Skin-Friendly Formulation</h5>
                        <p className="text-sm text-gray-600">
                          Free from harmful additives, parabens, ethanol, artificial fragrances, and sulfates for safe use.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Deep Hydration - Provides long-lasting moisturizing effects for plump, hydrated skin</li>
                      <li>Skin Firming - Promotes skin elasticity and firmness for youthful appearance</li>
                      <li>Irritation Relief - Soothes and calms skin irritation from microneedling treatments</li>
                      <li>Enhanced Penetration - Optimized for microneedling to maximize ingredient absorption</li>
                      <li>Skin Regeneration - Stimulates cellular renewal and healing processes</li>
                      <li>Professional Results - Delivers clinical-grade results for advanced skincare treatments</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">sh-Polypeptide-7</h5>
                        <p className="text-sm text-gray-600">
                          Human growth hormone-like peptide that stimulates skin regeneration and healing processes.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hyaluronic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Powerful humectant that attracts and retains moisture for deep hydration and plumping effects.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">BIOPHYTEX™</h5>
                        <p className="text-sm text-gray-600">
                          Advanced botanical complex that provides antioxidant protection and skin nourishment.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Copper Tripeptide-1</h5>
                        <p className="text-sm text-gray-600">
                          Healing peptide that promotes skin repair and reduces inflammation for faster recovery.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Panthenol</h5>
                        <p className="text-sm text-gray-600">
                          Soothing and hydrating ingredient that helps maintain skin barrier function and comfort.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Phytosphingosine</h5>
                        <p className="text-sm text-gray-600">
                          Natural lipid that supports skin barrier function and provides anti-inflammatory benefits.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and prepare for microneedling treatment</li>
                        <li><strong>Application:</strong> Apply 1-2 ampoules during microneedling treatment for optimal penetration</li>
                        <li><strong>Post-Treatment:</strong> Continue application for 3-5 days post-treatment for enhanced results</li>
                        <li><strong>Frequency:</strong> Use as directed by your skincare professional</li>
                        <li><strong>Storage:</strong> Store in cool, dry place and use within recommended timeframe</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Professional hydrating and firming ampoule</p>
                        <p><strong>Size:</strong> 2ml x 10ea</p>
                        <p><strong>Treatment:</strong> Microneedling, professional skincare</p>
                        <p><strong>Skin Type:</strong> All skin types, especially dry and aging skin</p>
                        <p><strong>Usage:</strong> Professional treatments, post-microneedling care</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and specifically formulated for professional use. 
                        For best results, use as directed by your skincare professional. Not recommended for home use without 
                        professional guidance. Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '5' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      POWER SOLUTION CVS is a professional skin revitalizing ampoule designed specifically for microneedling treatments. 
                      This advanced formula supplies essential nutrients to the skin while providing soothing and hydrating benefits 
                      to promote optimal healing and skin regeneration post-treatment.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Skin Revitalization</h5>
                        <p className="text-sm text-gray-600">
                          Advanced formula that revitalizes and rejuvenates skin for a healthy, radiant complexion.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Nutrient Supply</h5>
                        <p className="text-sm text-gray-600">
                          Delivers essential nutrients directly to the skin for optimal health and vitality.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Soothing & Hydrating</h5>
                        <p className="text-sm text-gray-600">
                          Calms irritated skin while providing deep hydration for comfort and healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Botanical Stem Cell Technology</h5>
                        <p className="text-sm text-gray-600">
                          Contains botanical stem cell extracts for enhanced skin regeneration and protection.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Skin Revitalization - Restores skin vitality and promotes healthy cell turnover</li>
                      <li>Nutrient Delivery - Supplies essential nutrients for optimal skin health</li>
                      <li>Soothing Relief - Calms and soothes irritated skin from treatments</li>
                      <li>Deep Hydration - Provides long-lasting moisture for plump, healthy skin</li>
                      <li>Enhanced Healing - Accelerates skin recovery and regeneration processes</li>
                      <li>Professional Results - Delivers clinical-grade revitalization for advanced treatments</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">sh-Polypeptide-7</h5>
                        <p className="text-sm text-gray-600">
                          Human growth hormone-like peptide that stimulates skin regeneration and healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Botanical Callus Culture Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Rosa Damascena and Vitis Vinifera extracts provide antioxidant protection and skin nourishment.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Panthenol</h5>
                        <p className="text-sm text-gray-600">
                          Soothing and hydrating ingredient that helps maintain skin barrier function.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Allantoin</h5>
                        <p className="text-sm text-gray-600">
                          Gentle healing ingredient that soothes irritated skin and promotes cell renewal.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hyaluronic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Powerful humectant that attracts and retains moisture for deep hydration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Lactobacillus Ferment Lysate</h5>
                        <p className="text-sm text-gray-600">
                          Probiotic ingredient that supports skin's natural barrier and overall health.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and prepare for microneedling treatment</li>
                        <li><strong>Application:</strong> Apply 1-2 ampoules during microneedling for optimal nutrient delivery</li>
                        <li><strong>Post-Treatment:</strong> Continue application for enhanced skin revitalization</li>
                        <li><strong>Frequency:</strong> Use as directed by your skincare professional</li>
                        <li><strong>Storage:</strong> Store in cool, dry place and use within recommended timeframe</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Professional skin revitalizing ampoule</p>
                        <p><strong>Size:</strong> 2ml x 10ea</p>
                        <p><strong>Treatment:</strong> Microneedling, skin revitalization</p>
                        <p><strong>Skin Type:</strong> All skin types, especially dull and tired skin</p>
                        <p><strong>Usage:</strong> Professional treatments, skin revitalization</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and specifically formulated for professional use. 
                        For best results, use as directed by your skincare professional. Not recommended for home use without 
                        professional guidance. Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '6' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      POWER SOLUTION CTS is a professional skin remodeling ampoule specifically formulated for microneedling treatments. 
                      This advanced formula helps the skin retain its natural elasticity and increases skin strength while promoting 
                      optimal healing and regeneration post-treatment.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Skin Remodeling</h5>
                        <p className="text-sm text-gray-600">
                          Advanced formula that helps remodel and restructure skin for improved texture and firmness.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Elasticity Enhancement</h5>
                        <p className="text-sm text-gray-600">
                          Promotes skin elasticity and natural flexibility for youthful, resilient skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Strength Building</h5>
                        <p className="text-sm text-gray-600">
                          Increases skin strength and resilience for better overall skin health.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Collagen Support</h5>
                        <p className="text-sm text-gray-600">
                          Contains collagen and peptides to support skin structure and firmness.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Skin Remodeling - Helps restructure and improve skin texture and appearance</li>
                      <li>Elasticity Enhancement - Promotes natural skin flexibility and resilience</li>
                      <li>Strength Building - Increases skin strength and overall health</li>
                      <li>Collagen Support - Provides essential building blocks for skin structure</li>
                      <li>Enhanced Healing - Accelerates skin recovery and regeneration processes</li>
                      <li>Professional Results - Delivers clinical-grade remodeling for advanced treatments</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">sh-Polypeptide-7</h5>
                        <p className="text-sm text-gray-600">
                          Human growth hormone-like peptide that stimulates skin regeneration and remodeling.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Collagen</h5>
                        <p className="text-sm text-gray-600">
                          Essential protein that provides structural support and improves skin firmness.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hyaluronic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Powerful humectant that provides deep hydration and plumping effects.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Copper Tripeptide-1</h5>
                        <p className="text-sm text-gray-600">
                          Healing peptide that promotes skin repair and reduces inflammation.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Botanical Callus Culture Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Rosa Damascena and Vitis Vinifera extracts provide antioxidant protection and nourishment.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Palmitoyl Hexapeptide-12</h5>
                        <p className="text-sm text-gray-600">
                          Advanced peptide that helps improve skin elasticity and firmness.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and prepare for microneedling treatment</li>
                        <li><strong>Application:</strong> Apply 1-2 ampoules during microneedling for optimal penetration</li>
                        <li><strong>Post-Treatment:</strong> Continue application for enhanced skin remodeling</li>
                        <li><strong>Frequency:</strong> Use as directed by your skincare professional</li>
                        <li><strong>Storage:</strong> Store in cool, dry place and use within recommended timeframe</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Professional skin remodeling ampoule</p>
                        <p><strong>Size:</strong> 2ml x 10ea</p>
                        <p><strong>Treatment:</strong> Microneedling, skin remodeling</p>
                        <p><strong>Skin Type:</strong> All skin types, especially aging and sagging skin</p>
                        <p><strong>Usage:</strong> Professional treatments, skin remodeling</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and specifically formulated for professional use. 
                        For best results, use as directed by your skincare professional. Not recommended for home use without 
                        professional guidance. Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '7' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      POWER SOLUTION PCS is a professional anti-blemish ampoule specifically formulated for microneedling treatments. 
                      This advanced formula controls excessive oil and sebum production while helping prevent skin breakouts 
                      and promoting clear, healthy skin post-treatment.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Anti-Blemish Formula</h5>
                        <p className="text-sm text-gray-600">
                          Specifically designed to target and prevent blemishes and skin breakouts.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Sebum Control</h5>
                        <p className="text-sm text-gray-600">
                          Controls excessive oil and sebum production for balanced, clear skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Breakout Prevention</h5>
                        <p className="text-sm text-gray-600">
                          Helps prevent skin breakouts and promotes clear, healthy complexion.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Natural Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Contains witch hazel and houttuynia cordata extracts for natural blemish control.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Blemish Control - Targets and prevents blemishes and skin imperfections</li>
                      <li>Sebum Regulation - Controls excessive oil production for balanced skin</li>
                      <li>Breakout Prevention - Helps prevent future skin breakouts</li>
                      <li>Clear Skin - Promotes clear, healthy complexion</li>
                      <li>Oil Balance - Restores natural oil balance for optimal skin health</li>
                      <li>Professional Results - Delivers clinical-grade blemish control for advanced treatments</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">sh-Polypeptide-7</h5>
                        <p className="text-sm text-gray-600">
                          Human growth hormone-like peptide that stimulates skin regeneration and healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Witch Hazel Extract</h5>
                        <p className="text-sm text-gray-600">
                          Natural astringent that helps control oil production and soothes irritated skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Houttuynia Cordata Extract</h5>
                        <p className="text-sm text-gray-600">
                          Natural anti-inflammatory ingredient that helps control blemishes and soothes skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Botanical Callus Culture Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Rosa Damascena and Vitis Vinifera extracts provide antioxidant protection and nourishment.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Pine Bark Extract</h5>
                        <p className="text-sm text-gray-600">
                          Natural antioxidant that helps protect skin from environmental damage.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Advanced Peptides</h5>
                        <p className="text-sm text-gray-600">
                          Acetyl Hexapeptide-8, Palmitoyl Hexapeptide-12, and Palmitoyl Tripeptide-1 for skin health.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and prepare for microneedling treatment</li>
                        <li><strong>Application:</strong> Apply 1-2 ampoules during microneedling for optimal penetration</li>
                        <li><strong>Post-Treatment:</strong> Continue application for enhanced blemish control</li>
                        <li><strong>Frequency:</strong> Use as directed by your skincare professional</li>
                        <li><strong>Storage:</strong> Store in cool, dry place and use within recommended timeframe</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Professional anti-blemish ampoule</p>
                        <p><strong>Size:</strong> 2ml x 10ea</p>
                        <p><strong>Treatment:</strong> Microneedling, blemish control</p>
                        <p><strong>Skin Type:</strong> All skin types, especially acne-prone and oily skin</p>
                        <p><strong>Usage:</strong> Professional treatments, blemish control</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and specifically formulated for professional use. 
                        For best results, use as directed by your skincare professional. Not recommended for home use without 
                        professional guidance. Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '8' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      POWER SOLUTION SWS is a professional anti-pigment ampoule specifically formulated for microneedling treatments. 
                      This advanced formula helps improve pigmentation, even skin tone, and brighten the skin surface while promoting 
                      optimal healing and skin clarity post-treatment.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Anti-Pigment Formula</h5>
                        <p className="text-sm text-gray-600">
                          Specifically designed to target and reduce hyperpigmentation and dark spots.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Skin Brightening</h5>
                        <p className="text-sm text-gray-600">
                          Helps brighten and even skin tone for a more radiant, uniform complexion.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Pigmentation Control</h5>
                        <p className="text-sm text-gray-600">
                          Targets existing pigmentation while preventing new dark spots from forming.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Natural Brightening Agents</h5>
                        <p className="text-sm text-gray-600">
                          Contains arbutin and kojic acid for natural, effective skin brightening.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Pigmentation Reduction - Targets and reduces hyperpigmentation and dark spots</li>
                      <li>Skin Brightening - Helps brighten and even skin tone for radiant complexion</li>
                      <li>Even Skin Tone - Promotes uniform skin color and texture</li>
                      <li>Dark Spot Prevention - Helps prevent new pigmentation from forming</li>
                      <li>Enhanced Clarity - Improves overall skin clarity and brightness</li>
                      <li>Professional Results - Delivers clinical-grade brightening for advanced treatments</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">sh-Polypeptide-7</h5>
                        <p className="text-sm text-gray-600">
                          Human growth hormone-like peptide that stimulates skin regeneration and healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Arbutin</h5>
                        <p className="text-sm text-gray-600">
                          Natural skin brightening agent that helps reduce hyperpigmentation and dark spots.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Kojic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Powerful natural brightening ingredient that inhibits melanin production.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Licorice Root Extract</h5>
                        <p className="text-sm text-gray-600">
                          Natural anti-inflammatory and brightening ingredient that soothes and evens skin tone.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Botanical Callus Culture Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Rosa Damascena and Vitis Vinifera extracts provide antioxidant protection and nourishment.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Fermented Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Aspergillus/Saccharomyces/Glycyrrhiza Uralensis Root Extract Ferment for enhanced skin health.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and prepare for microneedling treatment</li>
                        <li><strong>Application:</strong> Apply 1-2 ampoules during microneedling for optimal penetration</li>
                        <li><strong>Post-Treatment:</strong> Continue application for enhanced brightening results</li>
                        <li><strong>Frequency:</strong> Use as directed by your skincare professional</li>
                        <li><strong>Storage:</strong> Store in cool, dry place and use within recommended timeframe</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Professional anti-pigment ampoule</p>
                        <p><strong>Size:</strong> 2ml x 10ea</p>
                        <p><strong>Treatment:</strong> Microneedling, pigmentation control</p>
                        <p><strong>Skin Type:</strong> All skin types, especially hyperpigmented and uneven skin</p>
                        <p><strong>Usage:</strong> Professional treatments, pigmentation control</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and specifically formulated for professional use. 
                        For best results, use as directed by your skincare professional. Not recommended for home use without 
                        professional guidance. Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '9' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      POWER SOLUTION AWS is a professional anti-aging ampoule specifically formulated for microneedling treatments. 
                      This advanced formula helps reduce the appearance of wrinkles and improve skin firmness while promoting 
                      optimal healing and skin regeneration post-treatment.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Anti-Aging Formula</h5>
                        <p className="text-sm text-gray-600">
                          Specifically designed to target and reduce the appearance of wrinkles and fine lines.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Firmness Improvement</h5>
                        <p className="text-sm text-gray-600">
                          Helps improve skin firmness and elasticity for a more youthful appearance.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Wrinkle Reduction</h5>
                        <p className="text-sm text-gray-600">
                          Targets existing wrinkles while helping prevent new ones from forming.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Peptide Technology</h5>
                        <p className="text-sm text-gray-600">
                          Contains firming peptide complex and adenosine for advanced anti-aging benefits.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Wrinkle Reduction - Targets and reduces the appearance of wrinkles and fine lines</li>
                      <li>Skin Firming - Improves skin firmness and elasticity for youthful appearance</li>
                      <li>Anti-Aging - Helps prevent and reverse signs of aging</li>
                      <li>Elasticity Enhancement - Promotes natural skin flexibility and resilience</li>
                      <li>Skin Regeneration - Stimulates cellular renewal and healing processes</li>
                      <li>Professional Results - Delivers clinical-grade anti-aging for advanced treatments</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">sh-Polypeptide-7</h5>
                        <p className="text-sm text-gray-600">
                          Human growth hormone-like peptide that stimulates skin regeneration and healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Acetyl Hexapeptide-8</h5>
                        <p className="text-sm text-gray-600">
                          Advanced peptide that helps relax facial muscles and reduce expression lines.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Ceramide</h5>
                        <p className="text-sm text-gray-600">
                          Essential lipid that helps maintain skin barrier function and moisture retention.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Adenosine</h5>
                        <p className="text-sm text-gray-600">
                          Natural anti-aging ingredient that helps improve skin texture and reduce fine lines.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Allantoin</h5>
                        <p className="text-sm text-gray-600">
                          Soothing and healing ingredient that promotes skin regeneration and comfort.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Copper Tripeptide-1</h5>
                        <p className="text-sm text-gray-600">
                          Healing peptide that promotes skin repair and reduces inflammation for faster recovery.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and prepare for microneedling treatment</li>
                        <li><strong>Application:</strong> Apply 1-2 ampoules during microneedling for optimal penetration</li>
                        <li><strong>Post-Treatment:</strong> Continue application for enhanced anti-aging results</li>
                        <li><strong>Frequency:</strong> Use as directed by your skincare professional</li>
                        <li><strong>Storage:</strong> Store in cool, dry place and use within recommended timeframe</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Professional anti-aging ampoule</p>
                        <p><strong>Size:</strong> 2ml x 10ea</p>
                        <p><strong>Treatment:</strong> Microneedling, anti-aging</p>
                        <p><strong>Skin Type:</strong> All skin types, especially aging and mature skin</p>
                        <p><strong>Usage:</strong> Professional treatments, anti-aging</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and specifically formulated for professional use. 
                        For best results, use as directed by your skincare professional. Not recommended for home use without 
                        professional guidance. Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '37' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      PEPTIDE GEL MASK is a revolutionary thermo-sensitive hydrogel mask that provides instant cooling relief 
                      and deep hydration for post-treatment skin care. This patented technology transforms from gel to fluid 
                      upon contact with skin temperature, ensuring optimal ingredient delivery and maximum comfort.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Thermo-Sensitive Technology</h5>
                        <p className="text-sm text-gray-600">
                          Patented hydrogel that transforms from gel to fluid at body temperature for enhanced skin adhesion and ingredient penetration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Instant Cooling Effect</h5>
                        <p className="text-sm text-gray-600">
                          Provides immediate cooling relief by displacing skin heat with moisture, perfect for post-treatment care.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Advanced Peptide Formula</h5>
                        <p className="text-sm text-gray-600">
                          Contains Acetyl Hexapeptide-8 and other peptides for enhanced skin regeneration and healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Post-Treatment Care</h5>
                        <p className="text-sm text-gray-600">
                          Specifically recommended after dermatological procedures like laser treatments and microneedling.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Instant Cooling Relief - Provides immediate cooling sensation to soothe irritated skin</li>
                      <li>Deep Hydration - Delivers intense moisture for optimal skin recovery</li>
                      <li>Enhanced Penetration - Thermo-sensitive technology ensures maximum ingredient absorption</li>
                      <li>Post-Treatment Healing - Accelerates recovery after dermatological procedures</li>
                      <li>Skin Comfort - Reduces inflammation and irritation from treatments</li>
                      <li>Professional Results - Clinical-grade formula for advanced skincare treatments</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Acetyl Hexapeptide-8</h5>
                        <p className="text-sm text-gray-600">
                          Advanced peptide that helps relax facial muscles and reduce expression lines for smoother skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hyaluronic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Powerful humectant that attracts and retains moisture for deep hydration and plumping effects.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hydrolyzed Collagen</h5>
                        <p className="text-sm text-gray-600">
                          Bioactive collagen peptides that support skin structure and promote elasticity.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Chondrus Crispus Extract</h5>
                        <p className="text-sm text-gray-600">
                          Natural carrageenan extract that provides soothing and anti-inflammatory benefits.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Dipotassium Glycyrrhizate</h5>
                        <p className="text-sm text-gray-600">
                          Licorice root derivative that provides anti-inflammatory and soothing properties.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Botanical Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Arnica Montana and Chamomile extracts provide natural soothing and healing benefits.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and ensure it's dry before application</li>
                        <li><strong>Application:</strong> Apply the gel mask evenly to the treatment area, avoiding eye area</li>
                        <li><strong>Contact:</strong> The mask will transform from gel to fluid upon contact with skin temperature</li>
                        <li><strong>Duration:</strong> Leave on for 15-20 minutes for optimal results</li>
                        <li><strong>Removal:</strong> Gently remove and massage any remaining product into skin</li>
                        <li><strong>Frequency:</strong> Use as directed by your skincare professional</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Professional thermo-sensitive hydrogel mask</p>
                        <p><strong>Size:</strong> 38g x 5ea</p>
                        <p><strong>Treatment:</strong> Post-treatment care, cooling therapy</p>
                        <p><strong>Skin Type:</strong> All skin types, especially post-treatment skin</p>
                        <p><strong>Usage:</strong> Professional treatments, post-procedure care</p>
                        <p><strong>Technology:</strong> Patented thermo-sensitive hydrogel</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and specifically formulated for professional use. 
                        For best results, use as directed by your skincare professional. Not recommended for home use without 
                        professional guidance. Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '22' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      MULTI FUNCTIONAL ANTI-WRINKLE SERUM is an advanced anti-aging serum that combines the power of bakuchiol, 
                      a natural alternative to retinol, with cutting-edge peptide technology. This clinically-tested formula 
                      helps visibly smooth wrinkles, reinforce skin firmness, and restore youthful radiance for all skin types.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Natural Retinol Alternative</h5>
                        <p className="text-sm text-gray-600">
                          Features bakuchiol, a plant-derived alternative to retinol that provides anti-aging benefits without irritation.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Advanced Peptide Complex</h5>
                        <p className="text-sm text-gray-600">
                          Contains Anti-aging Peptide 6 and other peptides that target specific signs of aging for comprehensive results.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Lipid Barrier Technology</h5>
                        <p className="text-sm text-gray-600">
                          Innovative liposome delivery system with ceramides, cholesterol, and phytosphingosine for enhanced penetration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Clinical Validation</h5>
                        <p className="text-sm text-gray-600">
                          Clinically tested with proven results in improving skin age index and overall skin quality.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Wrinkle Reduction - Visibly smooths fine lines and deep wrinkles for younger-looking skin</li>
                      <li>Skin Firmness - Reinforces skin elasticity and firmness for a more lifted appearance</li>
                      <li>Gentle Formula - Natural bakuchiol provides retinol-like benefits without irritation or sensitivity</li>
                      <li>Enhanced Penetration - Lipid barrier technology ensures optimal ingredient delivery</li>
                      <li>Skin Tone Balance - Improves overall skin tone and texture for radiant complexion</li>
                      <li>Anti-Aging Protection - Comprehensive approach to preventing and reversing signs of aging</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Bakuchiol</h5>
                        <p className="text-sm text-gray-600">
                          Natural plant-derived alternative to retinol that provides anti-aging benefits without irritation or photosensitivity.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Anti-aging Peptide 6</h5>
                        <p className="text-sm text-gray-600">
                          Advanced peptide that targets specific aging mechanisms for comprehensive anti-wrinkle benefits.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Lipid Barrier Liposome</h5>
                        <p className="text-sm text-gray-600">
                          Ceramide NP, cholesterol, and phytosphingosine create a protective barrier while enhancing ingredient penetration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Collagen & Elastin</h5>
                        <p className="text-sm text-gray-600">
                          Essential proteins that support skin structure and elasticity for firm, youthful skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Propolis Extract</h5>
                        <p className="text-sm text-gray-600">
                          Natural bee-derived ingredient that provides antioxidant protection and skin healing benefits.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Adenosine & Niacinamide</h5>
                        <p className="text-sm text-gray-600">
                          Powerful combination that improves skin texture, reduces fine lines, and enhances skin barrier function.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and apply toner if desired</li>
                        <li><strong>Application:</strong> Apply 2-3 drops to face and neck, avoiding eye area</li>
                        <li><strong>Massage:</strong> Gently massage in upward motions until fully absorbed</li>
                        <li><strong>Follow-up:</strong> Apply moisturizer and sunscreen during daytime</li>
                        <li><strong>Frequency:</strong> Use once daily, preferably in the evening</li>
                        <li><strong>Results:</strong> Visible improvements typically seen within 4-6 weeks of consistent use</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Multi-functional anti-wrinkle serum</p>
                        <p><strong>Size:</strong> 30ml</p>
                        <p><strong>Key Benefits:</strong> Wrinkle reduction, skin firmness, anti-aging</p>
                        <p><strong>Skin Type:</strong> All skin types, especially aging and mature skin</p>
                        <p><strong>Usage:</strong> Daily anti-aging treatment</p>
                        <p><strong>Clinical Testing:</strong> Clinically tested for efficacy and safety</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and clinically proven. For best results, 
                        use consistently as part of your daily skincare routine. Suitable for all skin types, including 
                        sensitive skin. Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '18' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      MOISTURE REPLENISHING HYALURON SERUM is a revolutionary coconut water-based hydrating serum that delivers 
                      multi-depth hydration through an innovative 4-step hydration system. This advanced formula combines 
                      hyaluronic acid complex with mushroom extracts to provide deep moisture replenishment and long-lasting hydration.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">4-Step Hydration System</h5>
                        <p className="text-sm text-gray-600">
                          Advanced hydration technology that works in layers for comprehensive moisture delivery and retention.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Coconut Water Base</h5>
                        <p className="text-sm text-gray-600">
                          Natural coconut water provides electrolytes and natural hydration for optimal skin balance.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hyaluronic Acid Complex</h5>
                        <p className="text-sm text-gray-600">
                          Multi-molecular weight hyaluronic acids for layer-by-layer moisture replenishment and barrier formation.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Mushroom Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Powerful mushroom extracts provide anti-inflammatory and antioxidant protection for healthy skin.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Deep Hydration - Multi-layer moisture delivery for comprehensive skin hydration</li>
                      <li>Moisture Retention - Prevents moisture evaporation with barrier-forming technology</li>
                      <li>Natural Hydration - Coconut water provides electrolytes for optimal skin balance</li>
                      <li>Anti-Inflammatory - Mushroom extracts soothe and protect skin from environmental damage</li>
                      <li>Enhanced Penetration - Aquaporin stimulation improves moisture transport into skin</li>
                      <li>Long-Lasting Results - Sustained hydration that lasts throughout the day</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">4-Step Hydration Process</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Step 1: Electrolyte Balance</h5>
                        <p className="text-sm text-gray-600">
                          Coconut water electrolytes lead moisture into the skin and balance water content for optimal hydration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Step 2: Aquaporin Stimulation</h5>
                        <p className="text-sm text-gray-600">
                          Stimulates aquaporin formation to open water-transport channels and attract moisture to the skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Step 3: Multi-Layer Replenishment</h5>
                        <p className="text-sm text-gray-600">
                          Low and middle molecular weight hyaluronic acids replenish moisture layer by layer from deep within the skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Step 4: Barrier Formation</h5>
                        <p className="text-sm text-gray-600">
                          High molecular weight hyaluronic acid prevents moisture evaporation by forming a protective barrier on the skin surface.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Coconut Water Complex (78%)</h5>
                        <p className="text-sm text-gray-600">
                          Natural coconut water provides electrolytes, vitamins, and minerals for optimal skin hydration and balance.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hyaluronan 11 Multi-Complex</h5>
                        <p className="text-sm text-gray-600">
                          Advanced hyaluronic acid complex with multiple molecular weights for comprehensive hydration at all skin levels.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Glyceryl Glucoside</h5>
                        <p className="text-sm text-gray-600">
                          Aquaporin-stimulating ingredient that enhances moisture transport and improves skin's natural hydration mechanisms.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Mushroom Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Powerful mushroom extracts provide anti-inflammatory, antioxidant, and protective benefits for healthy skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Moisture Magnet Technology</h5>
                        <p className="text-sm text-gray-600">
                          Advanced ingredients that attract and retain moisture for long-lasting hydration and skin comfort.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and apply toner if desired</li>
                        <li><strong>Application:</strong> Apply 2-3 drops to face and neck, avoiding eye area</li>
                        <li><strong>Massage:</strong> Gently massage in upward motions until fully absorbed</li>
                        <li><strong>Follow-up:</strong> Apply moisturizer to lock in hydration</li>
                        <li><strong>Frequency:</strong> Use morning and evening for optimal results</li>
                        <li><strong>Results:</strong> Immediate hydration with long-lasting moisture retention</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Moisture replenishing hyaluron serum</p>
                        <p><strong>Size:</strong> 30ml</p>
                        <p><strong>Key Benefits:</strong> Deep hydration, moisture retention, skin balance</p>
                        <p><strong>Skin Type:</strong> All skin types, especially dry and dehydrated skin</p>
                        <p><strong>Usage:</strong> Daily hydration treatment</p>
                        <p><strong>Technology:</strong> 4-step hydration system</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and suitable for all skin types. 
                        For best results, use consistently as part of your daily skincare routine. Store in a cool, 
                        dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '2' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Needle Pen-K is a professional automatic microneedling device designed to enhance collagen production 
                      and improve transdermal nutrient delivery. This advanced device creates micro-channels in the skin 
                      to significantly increase the absorption rate of active skincare ingredients while promoting natural 
                      skin rejuvenation through controlled micro-injuries.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Automatic Microneedling</h5>
                        <p className="text-sm text-gray-600">
                          Advanced automatic technology for precise, controlled microneedling therapy with consistent results.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Collagen Production</h5>
                        <p className="text-sm text-gray-600">
                          Stimulates natural collagen and elastin production through controlled micro-injuries for skin rejuvenation.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Enhanced Absorption</h5>
                        <p className="text-sm text-gray-600">
                          Creates physical pathways through skin to dramatically increase absorption of active skincare ingredients.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Professional Grade</h5>
                        <p className="text-sm text-gray-600">
                          Medical-grade device manufactured in South Korea with precision engineering for optimal results.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Enhanced Product Absorption - Increases absorption rate of active skincare ingredients by up to 300%</li>
                      <li>Collagen Stimulation - Promotes natural collagen and elastin production for firmer, younger-looking skin</li>
                      <li>Skin Rejuvenation - Accelerates natural wound healing process for improved skin texture and tone</li>
                      <li>Precise Control - Automatic technology ensures consistent, controlled microneedling depth and speed</li>
                      <li>Professional Results - Medical-grade device delivers clinical-quality results at home</li>
                      <li>Versatile Treatment - Suitable for face, neck, and body for comprehensive skin improvement</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How It Works</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Micro-Channel Creation</h5>
                        <p className="text-sm text-gray-600">
                          Creates thousands of tiny micro-channels in the skin to enhance penetration of active ingredients.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Natural Healing Response</h5>
                        <p className="text-sm text-gray-600">
                          Triggers the body's natural wound healing process, stimulating collagen and elastin production.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Enhanced Penetration</h5>
                        <p className="text-sm text-gray-600">
                          Physical pathways allow deeper penetration of skincare products for maximum effectiveness.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and ensure device is properly sterilized</li>
                        <li><strong>Settings:</strong> Adjust needle depth and speed according to treatment area and skin sensitivity</li>
                        <li><strong>Application:</strong> Move device in gentle, overlapping motions across treatment area</li>
                        <li><strong>Post-Treatment:</strong> Apply recommended serums or treatments for enhanced absorption</li>
                        <li><strong>Recovery:</strong> Follow post-treatment care instructions for optimal healing</li>
                        <li><strong>Frequency:</strong> Use as directed by skincare professional or device instructions</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Professional automatic microneedling device</p>
                        <p><strong>Technology:</strong> Automatic microneedling with adjustable depth and speed</p>
                        <p><strong>Key Benefits:</strong> Collagen production, enhanced absorption, skin rejuvenation</p>
                        <p><strong>Skin Type:</strong> All skin types, especially aging and textured skin</p>
                        <p><strong>Usage:</strong> Professional and home use</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This is a professional medical device. For best results and safety, 
                        use as directed by a skincare professional. Ensure proper sterilization and follow 
                        all safety guidelines. Not recommended for use on active acne or inflamed skin.
                      </p>
                    </div>
                  </>
                ) : product.id === '10' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      SNOW O₂ CLEANSER is a revolutionary oxygen bubble cleanser that combines gentle cleansing with oxygen therapy 
                      for deep skin nourishment. This innovative formula naturally generates oxygen bubbles to effectively 
                      remove makeup, dirt, and impurities while providing a luxurious treatment sensation without irritation.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Oxygen Therapy Mechanism</h5>
                        <p className="text-sm text-gray-600">
                          Advanced oxygen therapy technology that provides deep cleansing and skin nourishment through natural oxygen bubbles.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Gentle Cleansing</h5>
                        <p className="text-sm text-gray-600">
                          Effective removal of makeup and impurities without excessive cleansing movement or skin irritation.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Natural Oxygen Bubbles</h5>
                        <p className="text-sm text-gray-600">
                          Naturally generated oxygen bubbles provide a luxurious treatment sensation while cleansing the skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">All-in-One Formula</h5>
                        <p className="text-sm text-gray-600">
                          Comprehensive cleanser that removes makeup, dirt, and impurities while nourishing the skin.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Deep Cleansing - Effectively removes makeup, dirt, and skin impurities without irritation</li>
                      <li>Oxygen Therapy - Provides skin with oxygen for improved circulation and nourishment</li>
                      <li>Gentle Formula - Suitable for all skin types, including sensitive skin</li>
                      <li>Luxurious Experience - Creates a spa-like treatment sensation with oxygen bubbles</li>
                      <li>No Irritation - Gentle cleansing without excessive movement or skin damage</li>
                      <li>Skin Nourishment - Provides essential nutrients while cleansing for healthy skin</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Phytolex SC</h5>
                        <p className="text-sm text-gray-600">
                          Advanced botanical complex that provides gentle cleansing and skin nourishment.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">MultiEx Phytrogen</h5>
                        <p className="text-sm text-gray-600">
                          Multi-functional plant extract that enhances oxygen delivery and skin health.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Methyl Perfluoroisobutyl Ether</h5>
                        <p className="text-sm text-gray-600">
                          Specialized ingredient that creates the oxygen bubble effect for enhanced cleansing and treatment sensation.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Application:</strong> Apply product to dry face, avoiding the eye area</li>
                        <li><strong>Wait:</strong> Allow oxygen bubbles to form naturally on the skin surface</li>
                        <li><strong>Activation:</strong> Wet your fingers and gently spread the product across the face</li>
                        <li><strong>Bubble Formation:</strong> Let the oxygen bubbles develop fully for maximum effect</li>
                        <li><strong>Massage:</strong> Gently massage with wet hands in circular motions</li>
                        <li><strong>Rinse:</strong> Rinse thoroughly with lukewarm water to remove all product and bubbles</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Oxygen bubble cleanser</p>
                        <p><strong>Size:</strong> 180ml (Homecare) / 500ml (Professional)</p>
                        <p><strong>Key Benefits:</strong> Deep cleansing, oxygen therapy, gentle formula</p>
                        <p><strong>Skin Type:</strong> All skin types, including sensitive skin</p>
                        <p><strong>Usage:</strong> Daily cleansing treatment</p>
                        <p><strong>Technology:</strong> Oxygen therapy mechanism</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and suitable for all skin types. 
                        For best results, use as part of your daily cleansing routine. Store in a cool, 
                        dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '20' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      PROBLEM CONTROL SERUM is a specialized anti-blemish serum designed for combination and oily acne-prone skin. 
                      This advanced formula helps fight skin breakouts by regulating excessive oil and sebum production while refining 
                      skin texture for a healthier, clearer complexion.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Sebum Regulation</h5>
                        <p className="text-sm text-gray-600">
                          Advanced sebum-regulating technology that controls excessive oil production for balanced, healthy skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Anti-Blemish Formula</h5>
                        <p className="text-sm text-gray-600">
                          Specifically designed to target and prevent skin breakouts while promoting clear, healthy skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Texture Refinement</h5>
                        <p className="text-sm text-gray-600">
                          Helps refine and smooth skin texture for a healthier-looking, clearer complexion.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Natural Ingredients</h5>
                        <p className="text-sm text-gray-600">
                          Formulated with zinc PCA and willow bark extract for gentle yet effective blemish control.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Breakout Prevention - Helps prevent and control skin breakouts for clearer skin</li>
                      <li>Sebum Control - Regulates excessive oil production for balanced, healthy skin</li>
                      <li>Texture Improvement - Refines skin texture for smoother, healthier-looking skin</li>
                      <li>Oil Balance - Restores natural oil balance for optimal skin health</li>
                      <li>Gentle Formula - Suitable for combination and oily skin types</li>
                      <li>Clear Complexion - Promotes a healthier, clearer skin appearance</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Zinc PCA</h5>
                        <p className="text-sm text-gray-600">
                          Powerful sebum-regulating ingredient that controls oil production and helps prevent breakouts.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Willow Bark Extract</h5>
                        <p className="text-sm text-gray-600">
                          Natural salicylic acid source that gently exfoliates and helps clear clogged pores.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Trehalose</h5>
                        <p className="text-sm text-gray-600">
                          Natural sugar that provides hydration and helps maintain skin barrier function.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Panthenol</h5>
                        <p className="text-sm text-gray-600">
                          Soothing and hydrating ingredient that helps calm irritated skin and promote healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Allantoin</h5>
                        <p className="text-sm text-gray-600">
                          Gentle healing ingredient that soothes irritated skin and promotes skin regeneration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Beta-Glucan</h5>
                        <p className="text-sm text-gray-600">
                          Natural immune-boosting ingredient that helps strengthen skin's natural defense mechanisms.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and apply toner if desired</li>
                        <li><strong>Application:</strong> Apply 2-3 drops to face and neck, focusing on problem areas</li>
                        <li><strong>Massage:</strong> Gently massage in upward motions until fully absorbed</li>
                        <li><strong>Follow-up:</strong> Apply moisturizer to lock in hydration</li>
                        <li><strong>Frequency:</strong> Use morning and evening for optimal results</li>
                        <li><strong>Results:</strong> Visible improvements typically seen within 2-4 weeks of consistent use</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Anti-blemish serum</p>
                        <p><strong>Size:</strong> 30ml</p>
                        <p><strong>Key Benefits:</strong> Sebum control, breakout prevention, texture refinement</p>
                        <p><strong>Skin Type:</strong> Combination and oily acne-prone skin</p>
                        <p><strong>Usage:</strong> Daily anti-blemish treatment</p>
                        <p><strong>Testing:</strong> Dermatologically tested and clinically proven</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and specifically formulated for 
                        combination and oily skin types. For best results, use consistently as part of your daily 
                        skincare routine. Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '21' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      MULTI VITA RADIANCE SERUM is an advanced skin brightening serum that combines multi vitamins with 
                      patented MELAZERO® melanin care complex for comprehensive skin radiance. This innovative formula 
                      helps even skin tone, revive skin's natural brightness, and provides a natural glow with 
                      moisturizing barrier protection.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">MELAZERO® Technology</h5>
                        <p className="text-sm text-gray-600">
                          Patented melanin care complex that targets skin surface melanin for effective brightening and even skin tone.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Multi Vitamin Complex</h5>
                        <p className="text-sm text-gray-600">
                          Advanced VITA 12 Complex with multiple vitamins for comprehensive skin nourishment and radiance.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Vitamin C Derivative</h5>
                        <p className="text-sm text-gray-600">
                          Stable 3-O-Ethyl Ascorbic Acid provides powerful antioxidant protection and skin brightening benefits.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Moisturizing Barrier</h5>
                        <p className="text-sm text-gray-600">
                          Panthenol-rich formula creates a protective barrier while providing deep hydration and skin comfort.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Skin Brightening - Targets melanin production for even skin tone and natural radiance</li>
                      <li>Even Skin Tone - Helps reduce dark spots and hyperpigmentation for uniform complexion</li>
                      <li>Natural Glow - Revives skin's natural brightness for healthy, radiant appearance</li>
                      <li>Antioxidant Protection - Vitamin C derivative provides powerful antioxidant benefits</li>
                      <li>Moisturizing - Creates protective barrier while providing deep hydration</li>
                      <li>Gentle Formula - Suitable for all skin types with anti-inflammatory properties</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">3-O-Ethyl Ascorbic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Stable vitamin C derivative that provides powerful antioxidant protection and skin brightening benefits.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">MELAZERO®</h5>
                        <p className="text-sm text-gray-600">
                          Patented melanin care complex that targets skin surface melanin for effective brightening and even skin tone.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">VITA 12 Complex</h5>
                        <p className="text-sm text-gray-600">
                          Multi-vitamin complex that provides comprehensive skin nourishment and radiance enhancement.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Niacinamide</h5>
                        <p className="text-sm text-gray-600">
                          Vitamin B3 that helps improve skin texture, reduce pore size, and enhance skin barrier function.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Glutathione</h5>
                        <p className="text-sm text-gray-600">
                          Powerful antioxidant that helps protect skin from environmental damage and promotes skin health.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Gluconolactone (PHA)</h5>
                        <p className="text-sm text-gray-600">
                          Gentle exfoliating acid that helps improve skin texture and enhance product penetration.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and apply toner if desired</li>
                        <li><strong>Application:</strong> Apply 2-3 drops to face and neck, avoiding eye area</li>
                        <li><strong>Massage:</strong> Gently massage in upward motions until fully absorbed</li>
                        <li><strong>Follow-up:</strong> Apply moisturizer and sunscreen during daytime</li>
                        <li><strong>Frequency:</strong> Use morning and evening for optimal results</li>
                        <li><strong>Results:</strong> Visible improvements typically seen within 4-6 weeks of consistent use</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Skin brightening serum</p>
                        <p><strong>Size:</strong> 30ml</p>
                        <p><strong>Key Benefits:</strong> Skin brightening, even skin tone, natural radiance</p>
                        <p><strong>Skin Type:</strong> All skin types, especially dull and uneven skin</p>
                        <p><strong>Usage:</strong> Daily brightening treatment</p>
                        <p><strong>Technology:</strong> MELAZERO® melanin care complex</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and suitable for all skin types. 
                        For best results, use consistently as part of your daily skincare routine. Always use sunscreen 
                        during daytime to protect skin from UV damage. Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '23' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      ND Cell ANTI-WRINKLE CREAM is a specialized anti-aging cream designed for the delicate neck and décolleté area. 
                      This advanced formula targets the special needs of these sensitive areas with a powerful peptide complex 
                      and vitamin blend for lifting, firming, and depigmentation.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Advanced Peptide Complex</h5>
                        <p className="text-sm text-gray-600">
                          Copper Tripeptide-1 and multiple peptides work synergistically to stimulate collagen production and skin renewal.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Lifting & Firming</h5>
                        <p className="text-sm text-gray-600">
                          Specialized formula that lifts and firms delicate skin around neck and décolleté area.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Depigmentation Effect</h5>
                        <p className="text-sm text-gray-600">
                          Excellent depigmentation properties help reduce age spots and uneven skin tone.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Vitamin Complex</h5>
                        <p className="text-sm text-gray-600">
                          Comprehensive vitamin blend (A, B5, C, E) provides antioxidant protection and skin nourishment.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Anti-Aging - Targets fine lines and wrinkles in delicate neck and décolleté area</li>
                      <li>Lifting Effect - Helps lift and firm sagging skin for more youthful appearance</li>
                      <li>Texture Refinement - Refines skin texture for smoother, younger-looking skin</li>
                      <li>Depigmentation - Reduces age spots and uneven skin tone</li>
                      <li>Collagen Stimulation - Peptides help stimulate natural collagen production</li>
                      <li>Hydration - Deep moisturizing for delicate skin areas</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Copper Tripeptide-1</h5>
                        <p className="text-sm text-gray-600">
                          Powerful peptide that stimulates collagen synthesis and promotes skin healing and renewal.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Acetyl Hexapeptide-8</h5>
                        <p className="text-sm text-gray-600">
                          "Botox-like" peptide that helps relax facial muscles and reduce expression lines.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Palmitoyl Hexapeptide-12</h5>
                        <p className="text-sm text-gray-600">
                          Advanced peptide that helps improve skin firmness and elasticity.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hyaluronic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Deep hydrating ingredient that plumps skin and reduces the appearance of fine lines.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Ceramide</h5>
                        <p className="text-sm text-gray-600">
                          Essential lipid that helps strengthen skin barrier and maintain moisture balance.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Squalane</h5>
                        <p className="text-sm text-gray-600">
                          Natural emollient that provides deep hydration and helps improve skin texture.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse neck and décolleté area thoroughly</li>
                        <li><strong>Application:</strong> Apply a small amount to neck and décolleté area</li>
                        <li><strong>Massage:</strong> Gently massage in upward motions from chest to neck</li>
                        <li><strong>Technique:</strong> Use upward strokes to help lift and firm the skin</li>
                        <li><strong>Frequency:</strong> Use morning and evening for optimal results</li>
                        <li><strong>Results:</strong> Visible improvements typically seen within 4-8 weeks of consistent use</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Anti-aging cream for neck and décolleté</p>
                        <p><strong>Size:</strong> 50g</p>
                        <p><strong>Key Benefits:</strong> Lifting, firming, depigmentation, texture refinement</p>
                        <p><strong>Target Area:</strong> Neck and décolleté area</p>
                        <p><strong>Usage:</strong> Daily anti-aging treatment</p>
                        <p><strong>Testing:</strong> Dermatologically tested and clinically proven</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and specifically formulated for 
                        the delicate neck and décolleté area. For best results, use consistently as part of your daily 
                        skincare routine. Always use sunscreen during daytime to protect treated areas from UV damage.
                      </p>
                    </div>
                  </>
                ) : product.id === '25' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      SOOTHING REPAIR POSTCREAM is a specialized regenerating cream designed for healthy skin recovery after 
                      professional treatments. This advanced formula helps irritated skin rapidly recover from redness, erythema, 
                      and edema while promoting healthy rejuvenation with centella complex and peptide technology.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Post-Treatment Recovery</h5>
                        <p className="text-sm text-gray-600">
                          Specifically formulated for skin recovery after professional dermatological operations and treatments.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Centella Complex</h5>
                        <p className="text-sm text-gray-600">
                          Powerful centella asiatica complex with asiaticoside, madecassic acid, and asiatic acid for healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Rapid Recovery</h5>
                        <p className="text-sm text-gray-600">
                          Helps skin rapidly recover from redness, erythema, and edema after professional treatments.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Peptide Technology</h5>
                        <p className="text-sm text-gray-600">
                          Advanced sh-Polypeptide-7 helps promote skin regeneration and healing processes.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Rapid Recovery - Helps skin quickly recover from professional treatment side effects</li>
                      <li>Redness Reduction - Soothes and reduces redness and inflammation</li>
                      <li>Erythema Relief - Helps alleviate erythema and skin irritation</li>
                      <li>Edema Reduction - Helps reduce swelling and edema after treatments</li>
                      <li>Skin Regeneration - Promotes healthy skin cell regeneration and renewal</li>
                      <li>Gentle Healing - Suitable for sensitive, post-treatment skin</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Centella Asiatica Complex</h5>
                        <p className="text-sm text-gray-600">
                          Powerful healing complex with asiaticoside, madecassic acid, and asiatic acid for skin recovery.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">sh-Polypeptide-7</h5>
                        <p className="text-sm text-gray-600">
                          Advanced peptide that helps promote skin regeneration and healing processes.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Dipotassium Glycyrrhizate</h5>
                        <p className="text-sm text-gray-600">
                          Licorice root extract that provides anti-inflammatory and soothing benefits.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Panthenol</h5>
                        <p className="text-sm text-gray-600">
                          Vitamin B5 that helps soothe irritated skin and promote healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Plant Callus Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Vitis Vinifera and Rosa Damascena callus culture extracts for enhanced healing properties.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Scutellaria Baicalensis</h5>
                        <p className="text-sm text-gray-600">
                          Chinese skullcap root extract with anti-inflammatory and antioxidant properties.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin gently after professional treatment</li>
                        <li><strong>Application:</strong> Apply a thin layer to affected areas</li>
                        <li><strong>Massage:</strong> Gently massage in circular motions until absorbed</li>
                        <li><strong>Frequency:</strong> Use as needed for post-treatment recovery</li>
                        <li><strong>Duration:</strong> Continue until skin fully recovers from treatment</li>
                        <li><strong>Results:</strong> Visible improvement in redness and irritation within 24-48 hours</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Post-treatment regenerating cream</p>
                        <p><strong>Size:</strong> 20g (Homecare) / 100g (Professional)</p>
                        <p><strong>Key Benefits:</strong> Recovery, soothing, healing, regeneration</p>
                        <p><strong>Target:</strong> Post-treatment skin recovery</p>
                        <p><strong>Usage:</strong> As needed after professional treatments</p>
                        <p><strong>Testing:</strong> Dermatologically tested and clinically proven</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and specifically formulated for 
                        post-treatment skin recovery. Use as directed by your skincare professional. Store in a cool, 
                        dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '27' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      SKIN BARRIER PROTECTING CREAM is an advanced skin barrier strengthening cream with enriched ceramide 
                      and amino acid complex. This innovative formula encourages healthy and soft skin by promoting water 
                      retention and protecting the skin barrier with MultiEx BSASM® Plus technology.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">MultiEx BSASM® Plus</h5>
                        <p className="text-sm text-gray-600">
                          Advanced technology that helps strengthen and protect the skin barrier for optimal skin health.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Enriched Ceramide Complex</h5>
                        <p className="text-sm text-gray-600">
                          High concentration of ceramides that help restore and maintain skin barrier function.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Amino Acid Complex</h5>
                        <p className="text-sm text-gray-600">
                          Essential amino acids that help support skin barrier integrity and moisture retention.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Water Retention</h5>
                        <p className="text-sm text-gray-600">
                          Promotes optimal water retention for healthy, hydrated, and soft skin.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Barrier Protection - Strengthens and protects the skin barrier from environmental damage</li>
                      <li>Moisture Retention - Promotes optimal water retention for healthy, hydrated skin</li>
                      <li>Skin Softening - Helps achieve soft, smooth, and supple skin texture</li>
                      <li>Barrier Repair - Helps repair and restore compromised skin barrier function</li>
                      <li>Long-lasting Hydration - Provides sustained moisture for all-day comfort</li>
                      <li>Gentle Formula - Suitable for sensitive and compromised skin</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Ceramide Complex</h5>
                        <p className="text-sm text-gray-600">
                          Essential lipids that help strengthen and maintain skin barrier function and integrity.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">MultiEx BSASM® Plus</h5>
                        <p className="text-sm text-gray-600">
                          Advanced technology that enhances skin barrier protection and moisture retention.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Amino Acid Complex</h5>
                        <p className="text-sm text-gray-600">
                          Essential amino acids that support skin barrier integrity and natural repair processes.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Shea Butter</h5>
                        <p className="text-sm text-gray-600">
                          Rich emollient that provides deep hydration and helps protect skin from environmental stress.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Macadamia Oil</h5>
                        <p className="text-sm text-gray-600">
                          Nourishing oil that helps restore skin barrier function and provides antioxidant protection.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and apply toner if desired</li>
                        <li><strong>Application:</strong> Apply a generous amount to face and neck</li>
                        <li><strong>Massage:</strong> Gently massage in upward motions until fully absorbed</li>
                        <li><strong>Frequency:</strong> Use morning and evening for optimal results</li>
                        <li><strong>Target Areas:</strong> Focus on areas with compromised skin barrier</li>
                        <li><strong>Results:</strong> Visible improvement in skin barrier function within 2-4 weeks</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Skin barrier strengthening cream</p>
                        <p><strong>Size:</strong> 100g</p>
                        <p><strong>Key Benefits:</strong> Barrier protection, moisture retention, skin softening</p>
                        <p><strong>Skin Type:</strong> All skin types, especially compromised skin</p>
                        <p><strong>Usage:</strong> Daily barrier protection and repair</p>
                        <p><strong>Technology:</strong> MultiEx BSASM® Plus</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and clinically proven to improve 
                        skin restorative force. For best results, use consistently as part of your daily skincare routine. 
                        Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '34' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      SKIN RESCUE OVERNIGHT CREAM MASK is a revitalizing overnight treatment that provides intensive care 
                      to fatigued skin. This innovative dual formula combines oxygen capsules with pink ceramide complex 
                      for comprehensive skin renewal and recovery.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Dual Formula Technology</h5>
                        <p className="text-sm text-gray-600">
                          Oxygen capsules burst smoothly when touching skin and melt with pink ceramide cream for maximum efficacy.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Oxygen Therapy</h5>
                        <p className="text-sm text-gray-600">
                          Italian oxygenated water capsules provide instant oxygen therapy for skin revitalization.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Pink Ceramide Complex</h5>
                        <p className="text-sm text-gray-600">
                          Unique pink ceramide complex provides intensive skin protection and recovery benefits.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Growth Factor Complex</h5>
                        <p className="text-sm text-gray-600">
                          Advanced growth factor complex (EGF, aFGF, bFGF, PIGF, IGF) promotes skin renewal and healing.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Skin Revitalization - Provides intensive care to fatigued and stressed skin</li>
                      <li>Oxygen Therapy - Delivers instant oxygen therapy for skin renewal and energy</li>
                      <li>Overnight Recovery - Works while you sleep to repair and rejuvenate skin</li>
                      <li>Erythema Improvement - Helps reduce redness and skin irritation</li>
                      <li>Moisture Retention - Improves transepidermal water loss for better hydration</li>
                      <li>Growth Factor Benefits - Stimulates natural skin renewal and healing processes</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Pink Ceramide Complex</h5>
                        <p className="text-sm text-gray-600">
                          Unique ceramide complex that provides intensive skin protection and recovery benefits.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Oxygen Capsules</h5>
                        <p className="text-sm text-gray-600">
                          Italian oxygenated water capsules that burst on contact for instant oxygen therapy.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Growth Factor Complex</h5>
                        <p className="text-sm text-gray-600">
                          EGF, aFGF, bFGF, PIGF, IGF work together to promote skin renewal and healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Pumpkin Extract</h5>
                        <p className="text-sm text-gray-600">
                          Cucurbita Pepo fruit extract provides antioxidant protection and skin nourishment.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Phytosphingosine</h5>
                        <p className="text-sm text-gray-600">
                          Natural lipid that helps strengthen skin barrier and improve moisture retention.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Swelling Controller</h5>
                        <p className="text-sm text-gray-600">
                          Special ingredient that helps control swelling and inflammation for comfortable application.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and apply toner if desired</li>
                        <li><strong>Application:</strong> Apply a generous amount to face and neck</li>
                        <li><strong>Massage:</strong> Gently massage until oxygen capsules burst and blend with cream</li>
                        <li><strong>Overnight:</strong> Leave on overnight for maximum benefits</li>
                        <li><strong>Frequency:</strong> Use 2-3 times per week for optimal results</li>
                        <li><strong>Results:</strong> Wake up to revitalized, refreshed skin</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Overnight cream mask</p>
                        <p><strong>Size:</strong> 100g</p>
                        <p><strong>Key Benefits:</strong> Revitalization, oxygen therapy, overnight recovery</p>
                        <p><strong>Skin Type:</strong> All skin types, especially fatigued skin</p>
                        <p><strong>Usage:</strong> Overnight treatment 2-3 times per week</p>
                        <p><strong>Technology:</strong> Dual formula with oxygen capsules</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and clinically proven to improve 
                        erythema and transepidermal water loss. For best results, use consistently as part of your 
                        weekly skincare routine. Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '36' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      SOOTHING BOMB SEA ALGAE MASK is an Eucalace® sheet mask inspired by the healing power of the ocean. 
                      This innovative mask provides intensive relief to the skin and moisturizes with sea algae complex 
                      and centella asiatica extract for comprehensive skin healing and hydration.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Eucalace® Technology</h5>
                        <p className="text-sm text-gray-600">
                          Advanced sheet mask technology that provides optimal skin contact and ingredient delivery.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Sea Algae Complex</h5>
                        <p className="text-sm text-gray-600">
                          Powerful sea algae extracts provide intensive relief and healing benefits for stressed skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Ocean Healing Power</h5>
                        <p className="text-sm text-gray-600">
                          Inspired by the healing power of the ocean for natural skin recovery and rejuvenation.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Centella Asiatica</h5>
                        <p className="text-sm text-gray-600">
                          Traditional healing herb that provides soothing and anti-inflammatory benefits.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Intensive Relief - Provides immediate relief to stressed and irritated skin</li>
                      <li>Deep Hydration - Sea algae complex delivers intense moisture for skin hydration</li>
                      <li>Soothing Effect - Centella asiatica provides calming and anti-inflammatory benefits</li>
                      <li>Skin Healing - Promotes natural skin healing and recovery processes</li>
                      <li>Ocean Therapy - Harnesses the healing power of marine ingredients</li>
                      <li>Convenient Use - Easy-to-use sheet mask format for quick application</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Jania Rubens Extract</h5>
                        <p className="text-sm text-gray-600">
                          Red algae extract that provides antioxidant protection and skin nourishment.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Undaria Pinnatifida Extract</h5>
                        <p className="text-sm text-gray-600">
                          Wakame seaweed extract that provides hydration and skin conditioning benefits.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Bambusa Vulgaris Extract</h5>
                        <p className="text-sm text-gray-600">
                          Bamboo extract that provides natural silica and skin strengthening benefits.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Centella Asiatica Extract</h5>
                        <p className="text-sm text-gray-600">
                          Traditional healing herb that provides soothing and anti-inflammatory benefits.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Witch Hazel Extract</h5>
                        <p className="text-sm text-gray-600">
                          Natural astringent that helps tone and soothe irritated skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Panthenol & Allantoin</h5>
                        <p className="text-sm text-gray-600">
                          Soothing ingredients that help calm irritated skin and promote healing.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin thoroughly and apply toner if desired</li>
                        <li><strong>Application:</strong> Remove mask from package and unfold carefully</li>
                        <li><strong>Placement:</strong> Apply mask to face, adjusting for proper fit</li>
                        <li><strong>Duration:</strong> Leave on for 15-20 minutes for optimal results</li>
                        <li><strong>Removal:</strong> Gently remove mask and massage remaining essence into skin</li>
                        <li><strong>Frequency:</strong> Use 2-3 times per week for best results</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Eucalace® sheet mask</p>
                        <p><strong>Size:</strong> 25g x 10ea</p>
                        <p><strong>Key Benefits:</strong> Intensive relief, deep hydration, soothing effect</p>
                        <p><strong>Skin Type:</strong> All skin types, especially stressed skin</p>
                        <p><strong>Usage:</strong> 2-3 times per week</p>
                        <p><strong>Technology:</strong> Eucalace® sheet mask technology</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and clinically proven to improve 
                        skin hydration. For best results, use consistently as part of your weekly skincare routine. 
                        Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '39' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      ULTRA SHIELD SUN CREAM [SPF 50+ PA++++] is a non-greasy, silky sunscreen with powerful UV protection 
                      and sunburn care effect. This advanced formula strongly defends skin against UV rays while promoting 
                      skin recovery from sun damage with innovative MicroHA™ and ProbioMETA™ technology.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Ultra-High Protection</h5>
                        <p className="text-sm text-gray-600">
                          SPF 50+ PA++++ provides maximum protection against both UVA and UVB rays.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Non-Greasy Formula</h5>
                        <p className="text-sm text-gray-600">
                          Silky, lightweight texture that absorbs quickly without leaving a greasy residue.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Sunburn Care Complex</h5>
                        <p className="text-sm text-gray-600">
                          Specialized complex that helps promote skin recovery from sun damage and exposure.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Reef-Safe Formula</h5>
                        <p className="text-sm text-gray-600">
                          Environmentally friendly formula that is safe for coral reefs and marine life.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Maximum UV Protection - SPF 50+ PA++++ provides superior sun protection</li>
                      <li>Sunburn Recovery - Helps promote skin recovery from sun damage and exposure</li>
                      <li>Non-Greasy Feel - Silky, lightweight texture for comfortable daily wear</li>
                      <li>Skin Recovery - MicroHA™ and ProbioMETA™ technology promote skin healing</li>
                      <li>Antioxidant Protection - Tropical antioxidant complex fights free radical damage</li>
                      <li>Reef-Safe - Environmentally conscious formula safe for marine ecosystems</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Sunburn Care Complex</h5>
                        <p className="text-sm text-gray-600">
                          Specialized complex that helps promote skin recovery from sun damage and exposure.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">MicroHA™</h5>
                        <p className="text-sm text-gray-600">
                          Ultra-low molecular weight hyaluronic acid for deep hydration and skin recovery.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">ProbioMETA™</h5>
                        <p className="text-sm text-gray-600">
                          Lactobacillus ferment that helps strengthen skin barrier and promote healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Tropical Antioxidant Complex</h5>
                        <p className="text-sm text-gray-600">
                          Powerful antioxidant blend that helps protect skin from environmental damage.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse skin and apply moisturizer if desired</li>
                        <li><strong>Application:</strong> Apply generously to all exposed skin areas</li>
                        <li><strong>Coverage:</strong> Ensure even coverage including face, neck, and ears</li>
                        <li><strong>Reapplication:</strong> Reapply every 2 hours or after swimming/sweating</li>
                        <li><strong>Daily Use:</strong> Use daily as the final step in your morning routine</li>
                        <li><strong>Results:</strong> Protected, healthy skin with improved recovery from sun exposure</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Daily sunscreen with sunburn care</p>
                        <p><strong>Size:</strong> 50g</p>
                        <p><strong>Protection:</strong> SPF 50+ PA++++</p>
                        <p><strong>Key Benefits:</strong> UV protection, sunburn care, skin recovery</p>
                        <p><strong>Skin Type:</strong> All skin types</p>
                        <p><strong>Usage:</strong> Daily sun protection</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and reef-safe. For best results, 
                        apply generously and reapply every 2 hours or after swimming/sweating. Store in a cool, 
                        dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '40' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      MULTI SUN CREAM [SPF 40 PA++] is an advanced daily sunscreen designed to provide comprehensive UV protection 
                      while maintaining a natural, glowing complexion. This innovative formula combines high-level sun protection 
                      with skin-nourishing ingredients to protect against both UVA and UVB rays while promoting healthy, radiant skin.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">High SPF Protection</h5>
                        <p className="text-sm text-gray-600">
                          SPF 40 PA++ provides strong protection against both UVA and UVB rays for comprehensive sun defense.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Non-Greasy Formula</h5>
                        <p className="text-sm text-gray-600">
                          Lightweight, non-greasy texture that absorbs quickly without leaving a white cast or sticky residue.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Skin Glowing Effect</h5>
                        <p className="text-sm text-gray-600">
                          Advanced formula that enhances natural skin radiance while providing sun protection.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Daily Use Formula</h5>
                        <p className="text-sm text-gray-600">
                          Gentle enough for daily use while providing robust protection for all skin types.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>UV Protection - Comprehensive protection against UVA and UVB rays</li>
                      <li>Skin Soothing - Calms and soothes skin irritated by sun exposure</li>
                      <li>Natural Glow - Enhances skin's natural radiance and luminosity</li>
                      <li>Moisture Lock - Helps maintain skin hydration while protecting from sun damage</li>
                      <li>Anti-Aging - Prevents premature aging caused by UV exposure</li>
                      <li>Gentle Care - Suitable for sensitive skin and daily use</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Palmitoyl Pentapeptide-4</h5>
                        <p className="text-sm text-gray-600">
                          Advanced peptide that helps repair and protect skin from environmental damage while promoting healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Sodium Hyaluronate</h5>
                        <p className="text-sm text-gray-600">
                          Deep hydrating ingredient that attracts and retains moisture for plump, hydrated skin.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Botanical Callus Culture Extracts</h5>
                        <p className="text-sm text-gray-600">
                          Rosa Damascena and Vitis Vinifera extracts provide antioxidant protection and skin nourishment.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Centella Asiatica Extract</h5>
                        <p className="text-sm text-gray-600">
                          Soothing and healing ingredient that calms irritated skin and promotes skin repair.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Scutellaria Baicalensis Root Extract</h5>
                        <p className="text-sm text-gray-600">
                          Powerful antioxidant that protects skin from free radical damage and environmental stress.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Lactobacillus/Soymilk Ferment Filtrate</h5>
                        <p className="text-sm text-gray-600">
                          Probiotic ingredient that supports skin's natural barrier function and overall skin health.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse your skin thoroughly before application</li>
                        <li><strong>Application:</strong> Apply generously to face, neck, and exposed areas 15-30 minutes before sun exposure</li>
                        <li><strong>Reapplication:</strong> Reapply every 2 hours or after swimming, sweating, or towel drying</li>
                        <li><strong>Daily Use:</strong> Use as the final step in your morning skincare routine</li>
                        <li><strong>Coverage:</strong> Ensure even coverage for optimal protection</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Daily sunscreen with SPF 40 PA++</p>
                        <p><strong>Size:</strong> 40g</p>
                        <p><strong>Protection:</strong> UVA/UVB protection, SPF 40, PA++</p>
                        <p><strong>Skin Type:</strong> All skin types, including sensitive skin</p>
                        <p><strong>Usage:</strong> Daily sun protection, outdoor activities</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, apply generously and reapply as needed. Perfect for daily use and outdoor activities. 
                        Store in a cool, dry place away from direct sunlight.
                      </p>
                    </div>
                  </>
                ) : product.id === '42' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      INTENSIVE BLEMISH BALM CREAM is a premium natural coverage cream designed to provide comprehensive skin protection 
                      and flawless coverage. This advanced formula combines natural coverage technology with SPF 30 PA++ protection 
                      to cover redness, blemishes, and imperfections while protecting skin from harmful environmental factors.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Natural Coverage Technology</h5>
                        <p className="text-sm text-gray-600">
                          Advanced formula that provides natural-looking coverage while allowing your skin's natural tone to shine through.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">SPF 30 PA++ Protection</h5>
                        <p className="text-sm text-gray-600">
                          Broad-spectrum sun protection that shields skin from harmful UV rays and environmental damage.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Blemish Coverage</h5>
                        <p className="text-sm text-gray-600">
                          Effectively covers redness, blemishes, and imperfections for a flawless, even complexion.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Post-Treatment Care</h5>
                        <p className="text-sm text-gray-600">
                          Ideal for covering redness and blemishes after dermatological treatments while promoting skin healing.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Natural Coverage - Provides flawless coverage while maintaining natural skin appearance</li>
                      <li>Sun Protection - SPF 30 PA++ shields skin from harmful UV rays and environmental damage</li>
                      <li>Blemish Concealing - Effectively covers redness, blemishes, and skin imperfections</li>
                      <li>Post-Treatment Care - Safe for use after dermatological procedures and treatments</li>
                      <li>Environmental Protection - Guards against harmful environmental factors and pollutants</li>
                      <li>Skin Tone Enhancement - Helps express and enhance your natural skin tone</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Adenosine</h5>
                        <p className="text-sm text-gray-600">
                          Anti-aging ingredient that helps reduce fine lines and wrinkles while promoting skin renewal.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Allantoin</h5>
                        <p className="text-sm text-gray-600">
                          Soothing and healing ingredient that calms irritated skin and promotes skin regeneration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Origanum Vulgare Leaf Extract</h5>
                        <p className="text-sm text-gray-600">
                          Natural antioxidant extract that provides protection against environmental damage and free radicals.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Phytolex SC</h5>
                        <p className="text-sm text-gray-600">
                          Advanced botanical complex that enhances skin protection and provides natural coverage benefits.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Preparation:</strong> Cleanse and moisturize your skin before application</li>
                        <li><strong>Application:</strong> Apply a small amount to areas needing coverage and blend gently</li>
                        <li><strong>Blending:</strong> Use fingertips or a beauty sponge to blend for natural-looking coverage</li>
                        <li><strong>Build Coverage:</strong> Layer for additional coverage on areas with more significant blemishes</li>
                        <li><strong>Setting:</strong> Allow to set for a few minutes before applying additional makeup if desired</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Natural coverage cream with SPF protection</p>
                        <p><strong>SPF Rating:</strong> SPF 30 PA++</p>
                        <p><strong>Coverage:</strong> Natural to medium coverage</p>
                        <p><strong>Key Benefits:</strong> Blemish coverage, sun protection, post-treatment care</p>
                        <p><strong>Skin Type:</strong> All skin types, especially sensitive and post-treatment skin</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        Perfect for daily use and post-treatment care. For best results, use as part of your 
                        daily skincare routine and reapply as needed throughout the day.
                      </p>
                    </div>
                  </>
                ) : product.id === '3' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      HairGen BOOSTER is an advanced auto-microneedling LED device specifically designed for comprehensive scalp treatment 
                      and hair loss prevention. This innovative device combines microneedling technology with LED light therapy to 
                      enhance scalp health, promote hair growth, and deliver nutrients directly to hair follicles for optimal results.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Auto-Microneedling Technology</h5>
                        <p className="text-sm text-gray-600">
                          Automated microneedling system that creates micro-channels in the scalp to enhance nutrient absorption 
                          and stimulate natural healing processes.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">LED Light Therapy</h5>
                        <p className="text-sm text-gray-600">
                          Advanced LED light system that stimulates hair follicles, improves scalp circulation, 
                          and promotes cellular regeneration for enhanced hair growth.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">HR³ MATRIX HAIR SOLUTION α</h5>
                        <p className="text-sm text-gray-600">
                          Premium anti-hair loss solution that supplies essential nutrients to combat factors 
                          causing hair loss and promote healthy hair growth.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">HR³ MATRIX HAIR STAMP</h5>
                        <p className="text-sm text-gray-600">
                          Patented delivery enhancer with microneedles that leads to scalp regeneration and 
                          collagen production through natural wound healing processes.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Enhanced Hair Growth - Stimulates hair follicles and promotes natural hair regrowth</li>
                      <li>Improved Scalp Health - Increases blood circulation and nutrient delivery to hair roots</li>
                      <li>Collagen Production - Promotes scalp regeneration and strengthens hair structure</li>
                      <li>Nutrient Absorption - Creates pathways for better penetration of hair care products</li>
                      <li>Professional Results - Advanced technology for both professional and home use</li>
                      <li>Non-Invasive Treatment - Safe and effective without side effects</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How It Works</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Microneedling:</strong> Creates micro-channels in the scalp to enhance product absorption</li>
                        <li><strong>LED Therapy:</strong> Light therapy stimulates hair follicles and improves scalp circulation</li>
                        <li><strong>Nutrient Delivery:</strong> HR³ MATRIX HAIR SOLUTION α provides essential nutrients for hair growth</li>
                        <li><strong>Regeneration:</strong> Natural wound healing process promotes collagen production and scalp health</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Auto-microneedling LED device for scalp treatment</p>
                        <p><strong>Technology:</strong> Microneedling + LED light therapy</p>
                        <p><strong>Key Components:</strong> HR³ MATRIX HAIR SOLUTION α + HR³ MATRIX HAIR STAMP</p>
                        <p><strong>Benefits:</strong> Hair growth stimulation, scalp health improvement, nutrient delivery</p>
                        <p><strong>Usage:</strong> Professional and home care</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This device is designed for professional and home use. For best results, 
                        use consistently as part of your hair care routine. Consult with a hair care professional 
                        for personalized treatment protocols.
                      </p>
                    </div>
                  </>
                ) : product.id === '48' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Hair-GENTRON is an advanced LED helmet device designed for professional hair loss treatment and scalp therapy. 
                      This innovative device combines multiple light therapy technologies with massaging and heating functions to 
                      promote hair growth, improve scalp circulation, and provide comprehensive hair and scalp care. Patent No. 10-2151442, 
                      Bronze medal winner of 2020 Korea invention patent competition.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Multi-LED Light Therapy</h5>
                        <p className="text-sm text-gray-600">
                          Infrared light + Red light + Blue light combination for comprehensive scalp treatment and hair follicle stimulation.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Massaging Function</h5>
                        <p className="text-sm text-gray-600">
                          Air pressure massaging system that can be used simultaneously with light therapy for enhanced treatment effectiveness.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Heating Function</h5>
                        <p className="text-sm text-gray-600">
                          Optional heating feature that can be added during treatment to improve blood circulation and enhance light penetration.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Music Mode</h5>
                        <p className="text-sm text-gray-600">
                          Built-in relaxation features to help users feel comfortable and relaxed during treatment sessions.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Hair Growth Stimulation - Promotes natural hair growth through advanced light therapy</li>
                      <li>Improved Blood Circulation - Enhances scalp blood flow for better nutrient delivery to hair follicles</li>
                      <li>Non-Invasive Treatment - Safe and painless therapy without side effects</li>
                      <li>Professional & Home Use - Suitable for both professional clinics and home care</li>
                      <li>Stress Relief - Massaging function helps reduce tension and stress</li>
                      <li>Optimal Light Distance - Guaranteed proper distance from light source to scalp for maximum effectiveness</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How It Works</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
                        <li><strong>Light Therapy:</strong> Infrared, red, and blue LED lights stimulate hair follicles and improve scalp health</li>
                        <li><strong>Massaging:</strong> Air pressure massaging improves blood circulation and enhances treatment effectiveness</li>
                        <li><strong>Heating:</strong> Optional heating function increases blood flow and light penetration</li>
                        <li><strong>Relaxation:</strong> Music mode and comfortable design ensure a pleasant treatment experience</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> LED helmet with massaging and heating functions</p>
                        <p><strong>Patent:</strong> No. 10-2151442 (Korea)</p>
                        <p><strong>Award:</strong> Bronze medal winner of 2020 Korea invention patent competition</p>
                        <p><strong>Light Types:</strong> Infrared + Red + Blue LED combination</p>
                        <p><strong>Features:</strong> Massaging, heating, music mode</p>
                        <p><strong>Usage:</strong> Professional and home care</p>
                        <p><strong>Origin:</strong> Made in South Korea</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This device is designed for professional and home use. For best results, 
                        use consistently as part of your hair care routine. Consult with a hair care professional 
                        for personalized treatment protocols.
                      </p>
                    </div>
                    
                    {/* Spacing between note and product documentation */}
                    <div className="mt-6"></div>
                    
                    {/* Product Documentation Section for Product 48 */}
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
                          href="/documents/ppt/HAIR%20GENTRON.pdf"
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
                          href="/documents/ppt/HAIR%20GENTRON.pdf"
                          download="HAIR GENTRON.pdf"
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
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
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
                ) : product.id === '52' || product.name === 'GENOSYS SKIN REBOOT PDRN MASK PACK' ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      GENOSYS SKIN REBOOT PDRN MASK PACK is a professional-grade treatment mask infused with PDRN 
                      (Polydeoxyribonucleotide) extracted from salmon DNA. This advanced mask promotes cellular 
                      regeneration, accelerates skin repair, and enhances overall skin health. Perfect for post-treatment 
                      care and intensive skin rejuvenation.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">PDRN Technology</h5>
                        <p className="text-sm text-gray-600">
                          Contains PDRN extracted from salmon DNA to promote cellular regeneration and accelerate 
                          skin healing and repair processes.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Ultra-Slim Fit Sheet</h5>
                        <p className="text-sm text-gray-600">
                          Ultra-slim fit sheet adheres seamlessly to the skin for effective delivery of active 
                          ingredients and maximum absorption.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Convenient Packaging</h5>
                        <p className="text-sm text-gray-600">
                          Contains 30 sheets per container with tissue-style packaging that allows for convenient 
                          one-by-one dispensing with built-in tweezers.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Skin Barrier Restoration</h5>
                        <p className="text-sm text-gray-600">
                          Clinical results show significant improvement in restoring the skin barrier damaged 
                          by physical irritation or environmental stress.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                      <li>Skin Regeneration - Accelerates cell regeneration and improves skin texture</li>
                      <li>Deep Hydration - Provides intense moisture for plump, dewy skin</li>
                      <li>Elasticity Enhancement - Boosts skin firmness and elasticity</li>
                      <li>Anti-Aging - Reduces fine lines and signs of aging</li>
                      <li>Soothing Effect - Calms inflammation and supports skin healing</li>
                      <li>Barrier Repair - Restores damaged skin barrier function</li>
                      <li>Professional Results - Delivers clinical-grade skin rejuvenation</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">PDRN (Polydeoxyribonucleotide)</h5>
                        <p className="text-sm text-gray-600">
                          DNA-based ingredient derived from salmon that accelerates skin regeneration, improves 
                          elasticity, and promotes healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Panthenol (Pro-Vitamin B5)</h5>
                        <p className="text-sm text-gray-600">
                          Deeply hydrates and soothes the skin while supporting the skin barrier and promoting 
                          wound healing.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hyaluronic Acid</h5>
                        <p className="text-sm text-gray-600">
                          Provides deep moisture retention, plumps the skin, and helps reduce the appearance 
                          of fine lines and wrinkles.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-800 mb-1 text-sm">Peptide Complex</h5>
                        <p className="text-sm text-gray-600">
                          Stimulates collagen production and improves skin firmness for a more youthful, 
                          resilient complexion.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <ol className="list-decimal list-inside text-blue-800 text-sm space-y-2">
                        <li><strong>Prepare:</strong> Cleanse your face and pat dry</li>
                        <li><strong>Extract:</strong> Take out one sheet mask with the built-in tweezers</li>
                        <li><strong>Apply:</strong> Apply the mask closely to the face, smoothing out any air bubbles</li>
                        <li><strong>Wait:</strong> Leave on for 10-15 minutes to allow active ingredients to absorb</li>
                        <li><strong>Remove:</strong> Remove the mask sheet and gently pat the remaining essence into your skin</li>
                        <li><strong>Store:</strong> Close the closure seal and cap tightly to prevent the product from drying out</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
                      <div className="space-y-2 text-blue-800 text-sm">
                        <p><strong>Type:</strong> Professional-grade PDRN mask pack</p>
                        <p><strong>Size:</strong> 30 sheets per container</p>
                        <p><strong>Key Benefits:</strong> Skin regeneration, barrier repair, anti-aging</p>
                        <p><strong>Skin Type:</strong> All skin types, especially damaged or aging skin</p>
                        <p><strong>Usage:</strong> 2-3 times per week or as needed for intensive care</p>
                        <p><strong>Technology:</strong> PDRN (salmon DNA) extraction technology</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is clinically proven to restore skin barrier function 
                        damaged by physical irritation. For optimal results, use consistently 2-3 times per week. 
                        Store in a cool, dry place and ensure the container is tightly sealed after each use to 
                        maintain product freshness.
                      </p>
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
                    {(product.id === '1' || product.id === '44' || 
                      product.id === '20' || product.id === '14' || product.id === '18' || product.id === '29' || 
                      product.id === '21' || product.id === '23' || product.id === '41' || 
                      product.id === '34' || product.id === '39' || product.id === '38' ||
                      product.name === 'GENOSYS SKIN REBOOT PDRN MASK PACK') && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Product Documentation</h4>
                        <p className="text-blue-700 text-sm mb-3">
                          Download the complete product manual and usage guide for professional application.
                        </p>
                        <div className="text-xs text-blue-600 mb-3">
                          📄 File size: {
                            product.id === '1' ? '1.5 MB' :
                            product.id === '44' ? '800 KB' :
                            product.id === '20' ? '750 KB' :
                            product.id === '14' ? '1.0 MB' :
                            product.id === '18' ? '1.3 MB' :
                            product.id === '29' ? '1.4 MB' :
                            product.id === '21' ? '1.1 MB' :
                            product.id === '23' ? '1.2 MB' :
                            product.id === '41' ? '950 KB' :
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
                              product.id === '1' ? 'Overview%20of%20Microneedling_S.pdf' :
                              product.id === '44' ? 'GENOSYS%20HR3%20MATRIX%20SCALP%20SHAMPOO%20ALPHA.pdf' :
                              product.id === '20' ? 'GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf' :
                              product.id === '14' ? 'GENOSYS%20MICROBIOME%20ENERGY%20INFUSING%20MIST.pdf' :
                              product.id === '18' ? 'GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20SERUM.pdf' :
                              product.id === '29' ? 'GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20CREAM.pdf' :
                              product.id === '21' ? 'GENOSYS%20MULTI%20VITA%20RADIANCE%20SERUM.pdf' :
                              product.id === '23' ? 'GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf' :
                              product.id === '41' ? 'GENOSYS%20SKIN%20CARING%20BLEMISH%20BALM%20CUSHION.pdf' :
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
                              product.id === '1' ? 'Overview%20of%20Microneedling_S.pdf' :
                              product.id === '44' ? 'GENOSYS%20HR3%20MATRIX%20SCALP%20SHAMPOO%20ALPHA.pdf' :
                              product.id === '20' ? 'GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf' :
                              product.id === '14' ? 'GENOSYS%20MICROBIOME%20ENERGY%20INFUSING%20MIST.pdf' :
product.id === '18' ? 'GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20SERUM.pdf' :
product.id === '29' ? 'GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20CREAM.pdf' :
                              product.id === '21' ? 'GENOSYS%20MULTI%20VITA%20RADIANCE%20SERUM.pdf' :
                              product.id === '23' ? 'GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf' :
                              product.id === '41' ? 'GENOSYS%20SKIN%20CARING%20BLEMISH%20BALM%20CUSHION.pdf' :
                              product.id === '34' ? 'GENOSYS%20SKIN%20RESCUE%20OVERNIGHT%20CREAM%20MASK.pdf' :
                              product.id === '39' ? 'GENOSYS%20ULTRA%20SHIELD%20SUN%20CREAM.pdf' :
                              product.id === '48' ? 'HAIR%20GENTRON.pdf' :
                              product.name === 'GENOSYS SKIN REBOOT PDRN MASK PACK' ? 'GENOSYS%20SKIN%20REBOOT%20PDRN%20MASK%20PACK.pdf' : ''
                            }`}
                            download={`${
                              product.id === '1' ? 'Overview of Microneedling_S.pdf' :
                              product.id === '44' ? 'GENOSYS HR3 MATRIX SCALP SHAMPOO ALPHA.pdf' :
                              product.id === '20' ? 'GENOSYS INTENSIVE PROBLEM CONTROL TONER.pdf' :
                              product.id === '14' ? 'GENOSYS MICROBIOME ENERGY INFUSING MIST.pdf' :
product.id === '18' ? 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM.pdf' :
product.id === '29' ? 'GENOSYS MOISTURE REPLENISHING HYALURON CREAM.pdf' :
                              product.id === '21' ? 'GENOSYS MULTI VITA RADIANCE SERUM.pdf' :
                              product.id === '23' ? 'GENOSYS MULTI VITA RADIANCE CREAM.pdf' :
                              product.id === '41' ? 'GENOSYS SKIN CARING BLEMISH BALM CUSHION.pdf' :
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
