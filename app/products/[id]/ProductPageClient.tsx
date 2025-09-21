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

  if (!product) {
    return <ErrorPage />
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
      await addItem(product, quantity)
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
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm md:text-base text-gray-600 mb-4 md:mb-6" aria-label="Breadcrumb">
          <Link 
            href="/"
            className="hover:text-primary-600 transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link 
            href="/products"
            className="hover:text-primary-600 transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs md:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Back Button */}
        <div className="flex items-center mb-4 md:mb-8">
          <Link 
            href="/products"
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mr-4 text-sm md:text-base"
          >
            <ArrowLeft className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="w-full sm:w-2/3 mx-auto aspect-square bg-gray-100 rounded-lg overflow-hidden">
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

            {/* Size and Price */}
            <div className="flex items-center gap-4">
              {product.size && (
                <div className="text-lg font-medium text-gray-700">
                  Size: {product.size}
                </div>
              )}
              <div className="text-2xl md:text-3xl font-bold text-primary-600">
                {product.price.toFixed(2)} AED
              </div>
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
                      Microneedling therapy is a minimally invasive cosmetic procedure that involves using fine needles to create hundreds of tiny, invisible puncture wounds in the top layer of skin. This process stimulates the body's natural wound healing processes, resulting in cell and collagen turnover.
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
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Professional Use:</strong> This product is suitable for both professional salon use and home care. 
                        <a href="/documents/PPT/GENOSYS-SKIN-REBOOT-PDRN-MASK-PACK.pdf" className="text-blue-600 hover:text-blue-800 underline ml-1">
                          View professional manual
                        </a>
                      </p>
                    </div>
                  </>
                ) : product.id === '12' ? (
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
                      Apply the product on clean, dry skin and gently massage in a circular motion for up to one minute. Rinse the clumped dead skin cells with tepid water. Dermatologically tested.
                    </p>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use as part of your daily skincare routine.
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Professional Use:</strong> This product is suitable for both professional salon use and home care. 
                        <a href="/documents/PPT/GENOSYS-SKIN-REBOOT-PDRN-MASK-PACK.pdf" className="text-blue-600 hover:text-blue-800 underline ml-1">
                          View professional manual
                        </a>
                      </p>
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
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Professional Use:</strong> This product is suitable for both professional salon use and home care. 
                        <a href="/documents/PPT/GENOSYS-SKIN-REBOOT-PDRN-MASK-PACK.pdf" className="text-blue-600 hover:text-blue-800 underline ml-1">
                          View professional manual
                        </a>
                      </p>
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
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Professional Use:</strong> This product is suitable for both professional salon use and home care. 
                        <a href="/documents/PPT/GENOSYS-SKIN-REBOOT-PDRN-MASK-PACK.pdf" className="text-blue-600 hover:text-blue-800 underline ml-1">
                          View professional manual
                        </a>
                      </p>
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
                      Apply the product on the face and gently pat with fingers in the morning and evening.
                    </p>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use as part of your daily skincare routine.
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Professional Use:</strong> This product is suitable for both professional salon use and home care. 
                        <a href="/documents/PPT/GENOSYS-SKIN-REBOOT-PDRN-MASK-PACK.pdf" className="text-blue-600 hover:text-blue-800 underline ml-1">
                          View professional manual
                        </a>
                      </p>
                    </div>
                  </>
                ) : product.id === '19' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      30ml. Skin repairing serum for sensitive skin. It is a skin repairing serum that provides moisture barrier to skin and relieves the sensitized skin with its anti-inflammatory and soothing properties.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Ingredients</h4>
                    <p className="text-gray-600 mb-4">
                      MultiEx BSASM® Plus, Phytolex SC, Hyaluronic Acid, Phytosphingosine, Aloe Barbadensis Leaf Extract, Hamamelis Virginiana (Witch Hazel) Extract, Beta-Glucan.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use</h4>
                    <p className="text-gray-600 mb-4">
                      Apply the product on the face and gently pat with fingers in the morning and evening.
                    </p>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> Dermatologically tested.
                      </p>
                    </div>
                  </>
                ) : (
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
                      Apply the product on the face and gently pat with fingers in the morning and evening.
                    </p>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> This product is dermatologically tested and safe for all skin types. 
                        For best results, use as part of your daily skincare routine.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

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
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {isAdding ? 'Adding...' : 'Add to Cart'}
                </button>
                
                <button
                  onClick={handleToggleFavorite}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      isFavorite(product.id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-400'
                    }`} 
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
                  <div className="text-sm font-medium text-gray-800">Proud UAE Tax Payer</div>
                  <div className="text-xs text-gray-600">Supporting local economy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
