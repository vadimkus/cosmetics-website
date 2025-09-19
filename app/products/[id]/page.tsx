'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { useAuth } from '@/components/AuthProvider'
import ErrorPage from '@/components/ErrorPage'
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, Lock, Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Product } from '@/types'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { user } = useAuth()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }
        const productData = await response.json()
        setProduct(productData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    } else {
      setLoading(false)
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorPage
        title="Product Not Available"
        message="We're having trouble loading this product. This might be due to a network issue or the product may have been removed."
        error={error}
        type="error"
        onRetry={() => {
          setError(null)
          setLoading(true)
          // Re-fetch the product
          const fetchProduct = async () => {
            try {
              const response = await fetch(`/api/products/${params.id}`)
              if (!response.ok) {
                throw new Error('Failed to fetch product')
              }
              const productData = await response.json()
              setProduct(productData)
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to fetch product')
            } finally {
              setLoading(false)
            }
          }
          fetchProduct()
        }}
        onBack={() => router.push('/products')}
        showHome={false}
      />
    )
  }

  if (!product) {
    return (
      <ErrorPage
        title="Product Not Found"
        message="The product you're looking for doesn't exist or may have been removed from our catalog."
        type="not-found"
        onBack={() => router.push('/products')}
        showRetry={false}
        showHome={false}
      />
    )
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    setTimeout(() => setIsAdding(false), 500)
  }

  const handleFavorite = () => {
    toggleFavorite(product)
  }

  // Get product images from database or fallback to hardcoded ones
  const getProductImages = () => {
    // If product has images field from database, use those
    if (product.images) {
      try {
        const parsedImages = JSON.parse(product.images)
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          return parsedImages
        }
      } catch (error) {
        console.error('Error parsing product images:', error)
      }
    }
    
    // Fallback to hardcoded images for specific products
    if (product.id === '3') {
      return [product.image, '/images/Booster2.jpg', 'https://www.youtube.com/watch?v=7VTkWKkYKwA']
    } else if (product.id === '14') {
      return [product.image, '/images/MIST2.png']
    } else if (product.id === '15') {
      return [product.image, '/images/PRS2.png']
    } else if (product.id === '22') {
      return [product.image, '/images/mss2.png']
    } else if (product.id === '41') {
      return [product.image, '/images/CUSHC.png']
    }
    
    // Default to single image
    return [product.image]
  }

  const productImages = getProductImages()

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Breadcrumb */}
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
            <div className="w-2/3 mx-auto aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* Image Thumbnails */}
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  {product.id === '3' && index === 2 ? (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <div className="text-white text-xs text-center">
                        <div className="text-2xl mb-1">▶</div>
                        <div>Video</div>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded">
                  {product.category}
                </span>
                {product.inStock ? (
                  <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                    In Stock
                  </span>
                ) : (
                  <span className="text-sm text-red-600 font-medium bg-red-50 px-2 py-1 rounded">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              
              {/* Product Size Display */}
              {(() => {
                // Skip size display for product ID 47 (HR³ MATRIX MESOPECIA KIT)
                if (product.id === '47') {
                  return null;
                }
                
                // Special case for Needle Pen-K device
                if (product.id === '2') {
                  return (
                    <div className="mb-4">
                      <div className="inline-flex items-center bg-blue-50 text-blue-800 px-3 py-2 rounded-lg border border-blue-200">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-semibold text-sm">Size: 1 Device</span>
                      </div>
                    </div>
                  );
                }
                
                // Special case for Hair-GENTRON device
                if (product.id === '48') {
                  return (
                    <div className="mb-4">
                      <div className="inline-flex items-center bg-blue-50 text-blue-800 px-3 py-2 rounded-lg border border-blue-200">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-semibold text-sm">Size: 1 device</span>
                      </div>
                    </div>
                  );
                }
                
                // Special case for GENO-LED IR II device
                if (product.id === '49') {
                  return (
                    <div className="mb-4">
                      <div className="inline-flex items-center bg-blue-50 text-blue-800 px-3 py-2 rounded-lg border border-blue-200">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-semibold text-sm">Size: 1 Device</span>
                      </div>
                    </div>
                  );
                }
                
                // Special case for EyeCell EYE ZONE CARE KIT
                if (product.id === '50') {
                  return (
                    <div className="mb-4">
                      <div className="inline-flex items-center bg-blue-50 text-blue-800 px-3 py-2 rounded-lg border border-blue-200">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-semibold text-sm">Size: 1 box</span>
                      </div>
                    </div>
                  );
                }
                
                const sizeMatch = product.description.match(/(\d+(?:\.\d+)?)\s*(ml|g|kg|pieces?|ea|units?)/i);
                if (sizeMatch) {
                  const size = sizeMatch[0];
                  return (
                    <div className="mb-4">
                      <div className="inline-flex items-center bg-blue-50 text-blue-800 px-3 py-2 rounded-lg border border-blue-200">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-semibold text-sm">Size: {size}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(5.0)</span>
                </div>
              </div>
              
              {user && user.canSeePrices ? (
                <p className="text-3xl font-bold text-primary-600 mb-6">
                  {product.price.toFixed(2)} AED
                </p>
              ) : user ? (
                <div className="flex items-center text-gray-500 mb-6">
                  <Lock className="h-6 w-6 mr-2" />
                  <span className="text-2xl font-semibold">Price access required</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-500 mb-6">
                  <Lock className="h-6 w-6 mr-2" />
                  <span className="text-2xl font-semibold">Login to see price</span>
                </div>
              )}
            </div>

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
                      Microneedling is an effective treatment modality invented in an effort to overcome skin concerns such as aging or scar problems. By creating micro wounds on the skin and triggering skin's self-healing process, microneedling leads to skin regeneration and natural collagen production as well as dramatic increase in skin permeability of nutritive elements, realizing anti-aging.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Types of Microneedling Device</h4>
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
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply with a cotton pad to lip and eye area and hold for few seconds. Then, gently wipe off the makeup.
                    </p>
                  </>
                ) : product.id === '12' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply the product on clean, dry skin and gently massage in a circular motion for up to one minute. Rinse the clumped dead skin cells with tepid water. Dermatologically tested.
                    </p>
                  </>
                ) : product.id === '13' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
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
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Shake well before use, then spray over the face with eyes closed at a distance of 10-20cm throughout the day. It can be sprayed over make-up.
                    </p>
                  </>
                ) : product.id === '15' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <div className="text-gray-600 space-y-2">
                      <p><strong>To remove dead skin cells / residues after washing the face:</strong> Soak the cotton pad with toner and wipe it along the skin texture.</p>
                      <p><strong>To enhance the pore contraction effect and to soothe the skin:</strong> Soak the cotton pad with toner and apply them to the face. Leave them on for 5-10 minutes.</p>
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
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
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
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply the product around the eyes and massage in circular motion for absorption.
                    </p>
                  </>
                ) : product.id === '18' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply the product on the face and gently pat with fingers in the morning and evening.
                    </p>
                  </>
                ) : product.id === '19' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply the product on the face and gently pat with fingers in the morning and evening.
                    </p>
                  </>
                ) : product.id === '20' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply the product on the face and gently pat with fingers in the morning and evening.
                    </p>
                  </>
                ) : product.id === '21' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply the product on the face and gently pat with fingers in the morning and evening.
                    </p>
                  </>
                ) : product.id === '22' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply the product on the face and gently pat with fingers in the morning and evening.
                    </p>
                  </>
                ) : product.id === '23' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply gently on the neck and decollete in the morning and evening.
                    </p>
                  </>
                ) : product.id === '24' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply the product around the eyes and massage in circular motion for absorption.
                    </p>
                  </>
                ) : product.id === '25' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply the product on the face and gently massage. If necessary (depending on your needs), apply the product several times a day.
                    </p>
                  </>
                ) : product.id === '26' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <div className="text-gray-600 space-y-2">
                      <p>Spread the product evenly on the dry skin and do not rub until the bubbles cover the face. When bubbles start popping, gently massage and tap for better absorption. Do not rinse off. Apply the product in the morning and evening.</p>
                      <p><strong>For better bubbling, do not rub when you apply the product.</strong></p>
                    </div>
                  </>
                ) : product.id === '31' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600 mb-4">
                      Apply the product on the face and gently massage in the morning and evening.
                    </p>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-green-800 mb-2">📄 MULTI VITA RADIANCE CREAM Documentation</h4>
                      <a 
                        href="/documents/ppt/GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                      </a>
                    </div>
                  </>
                ) : product.id === '27' || product.id === '28' || product.id === '29' || product.id === '30' || product.id === '32' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply the product on the face and gently massage in the morning and evening.
                    </p>
                  </>
                ) : product.id === '33' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply patches under the eyes and/or the eye brow bones for 20~40 minutes and remove the patches.
                    </p>
                  </>
                ) : product.id === '34' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <div className="text-gray-600 space-y-2">
                      <p><strong>When skin needs special care, once or twice a week:</strong> Apply a sufficient amount of the product on the face at the last step of skin care routine.</p>
                      <p><strong>To provide extra skin protection effect after skin procedures:</strong> Apply the product to make the protective film over the skin</p>
                    </div>
                  </>
                ) : product.id === '35' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Mix the product and water with the ratio of 10:8. Plaster evenly on the treatment area. Peel off after 15-20 minutes.
                    </p>
                  </>
                ) : product.id === '36' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply the mask closely to the face and leave on for 15~20 minutes.
                    </p>
                  </>
                ) : product.id === '37' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Open the pouch and remove the transparent film from the mask sheet. Apply the mask closely to the face and leave on for 20~40 minutes. (If you keep the mask refrigerated, you can feel the better cooling effect.)
                    </p>
                  </>
                ) : product.id === '38' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      After cleansing and drying skin, apply the 20g of EZ CO₂ GEL on the face. Open the pouch of EZ CO₂ MASK and cover the face. The inner folded side (uncoated part) of the mask should contact the gel. Leave it for 5 to 10 minutes. Remove the mask/gel and cleanse face thoroughly. * Intensive sparkling can occur immediately after applying the mask. However, it will be gone after 20~30 seconds.
                    </p>
                  </>
                ) : product.id === '39' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply daily on face, neck and body frequently.
                    </p>
                  </>
                ) : product.id === '40' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply daily on face, neck and body frequently.
                    </p>
                  </>
                ) : product.id === '41' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600 mb-2">
                      Press the puff lightly onto cushion and pat evenly onto skin. We recommend patting the puff gently on the skin several times to enhance the long-lasting effect.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Replace Refill:</h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-1">
                      <li>Open the lid of the cushion and push the bottom of the refill up with thumbs to separate the refill.</li>
                      <li>Put the new refill in the container and adjust the position of the refill to fit the container.</li>
                      <li>Press the refill down until you hear 'clicking sound'</li>
                    </ol>
                  </>
                ) : product.id === '42' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Smooth evenly onto the face for protection and natural cover.
                    </p>
                  </>
                ) : product.id === '43' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Spray the product on the scalp in the morning and evening. Use circular massage for the better effect. Do not wash off. Leave it at least 3~4 hours.
                    </p>
                  </>
                ) : product.id === '44' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium Scalp Shampoo product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Take the moderate amount in hands and emulsify. Apply to damp hair and massage. Rinse off with water thoroughly.
                    </p>
                  </>
                ) : product.id === '45' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <div className="text-gray-600 space-y-3">
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-1">Professional Kit:</h5>
                        <p>Apply the product to the treatment area and start rolling (stamping).</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-1">Homecare Kit:</h5>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Remove the cap and metallic lid by pushing up the cap in the direction of the arrow on the cap.</li>
                          <li>Install the microneedle applicator to the entry of the product.</li>
                          <li>Start tapping vertically with a constant pressure.</li>
                          <li>After use, separate the applicator from the product by lifting up one side.</li>
                          <li>Clean the applicator in running water.</li>
                          <li>Soak the sponge in the disinfecting jar with alcohol and stamp the application part to it.</li>
                          <li>After drying, keep the application with cap on.</li>
                          <li>Apply the product one or two times a week.</li>
                        </ol>
                      </div>
                    </div>
                  </>
                ) : product.id === '46' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium {product.category.toLowerCase()} product is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Drop SCALP PEELING α 5ml into the glass cylinder and dip swab enough in the solvent. Hold right under the swab head and run rather powerfully.
                    </p>
                  </>
                ) : product.id === '47' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium Mesopecia KIT is carefully formulated with high-quality ingredients 
                      to deliver exceptional results. Perfect for professional use and home care routines.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2">
                      <li>Drop <strong>SCALP PEELING α</strong> 5ml into the glass cylinder and dip swab enough in the solvent.</li>
                      <li>Hold right under the swab head and run rather powerfully.</li>
                      <li>Dry scalp and hair.</li>
                      <li>Part the treatment area using a comb and <strong>roll (stamp)</strong> directly on the scalp.</li>
                      <li>While rolling (stamping), apply <strong>HAIR SOLUTION α</strong> using a dropper.</li>
                    </ol>
                  </>
                ) : product.id === '48' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium LED helmet device is carefully designed with advanced technology 
                      to deliver exceptional hair growth results. Perfect for both professional and home care use.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Non-invasive light therapy</li>
                      <li>Safe & painless treatment</li>
                      <li>Professional & home care use</li>
                      <li>Multiple LED light combinations</li>
                      <li>Massaging and heating functions</li>
                      <li>Music mode for relaxation</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <div className="text-gray-600 space-y-3">
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Wash scalp and hair.</li>
                        <li>Conduct a main treatment.</li>
                        <li>Apply Hair-GENTRON for 20-30 minutes.</li>
                      </ol>
                      <p><strong>Preset program (10mins):</strong> air pressure massage + heat + LED (red, blue, infrared) + music</p>
                      <div className="space-y-2">
                        <p><strong>Time Setting:</strong> 10 min / 20 min / 30 min</p>
                        <p><strong>LED Setting:</strong> RED+INFRARED, BLUE, NONE, RED+BLUE+INFRARED</p>
                        <p><strong>Music Setting:</strong> Includes one preset audio track, can add your own music via USB connection</p>
                        <p><strong>Heating Function:</strong> Can be turned on/off</p>
                        <p><strong>Massaging Function:</strong> Can be turned on/off</p>
                      </div>
                    </div>
                  </>
                ) : product.id === '49' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      This premium LED device is carefully designed with advanced technology 
                      to deliver exceptional skin care results. Perfect for both professional and home care use.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>1,710 LED and IR lamps for total skin care</li>
                      <li>Multiple wavelength options (423nm~830nm)</li>
                      <li>Face, scalp, and body total care</li>
                      <li>Dome shape for less light loss</li>
                      <li>High-brightness SMD LED elements</li>
                      <li>Gentle and safe treatment</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">LED Specifications:</h4>
                    <div className="text-gray-600 mb-4">
                      <p>Red (640nm) - 380ea | Blue (423nm) - 380ea | Green (532nm) - 380ea</p>
                      <p>Yellow (583nm) - 380ea | Infrared (830nm) - 190ea</p>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <div className="text-gray-600 space-y-3">
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Connect the adapter to the adapter power outlet on the side of the product.</li>
                        <li>Power button lights up and the device goes into standby mode.</li>
                        <li>Touch the Power ON/OFF button.</li>
                        <li>Adjust the time by touching Time setting button (5-30 minutes, settable per 5 minutes).</li>
                        <li>Touch Red, Blue, Green or Yellow button to select the desired LED light.</li>
                        <li>For LED + Infrared combination, touch the desired light button and IR button.</li>
                        <li>For alternating lights, touch Red button and then another light button (alternates every 3 seconds).</li>
                      </ol>
                      <div className="space-y-2">
                        <p><strong>Available Combinations:</strong> RED + IR / BLUE + IR / GREEN + IR / YELLOW + IR</p>
                        <p><strong>Alternating Modes:</strong> Red + Blue / Red + Green / Red + Yellow</p>
                        <p><strong>Settings:</strong> Language, Volume, and Time settings available in standby mode</p>
                      </div>
                    </div>
                  </>
                ) : product.id === '50' ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <p className="text-gray-600 mb-4">
                      Professional kit to treat various skin problems around eyes. This comprehensive kit combines 
                      cosmeceuticals with a roller specially designed for eye area to activate collagen production 
                      and increase the absorption of ingredients into skin.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Kit Components:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li><strong>EYE CONTOUR SERUM (10ml) + EYE ROLLER</strong> - Highly enriched all-in-one eye serum with roller for delicate care</li>
                      <li><strong>EYE CONTOUR CREAM (20g)</strong> - Daily cream for younger-looking eyes</li>
                      <li><strong>EYE PEPTIDE GEL PATCH (101g / 60ea)</strong> - Patented thermo-sensitive hydrogel mask</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Treats dehydration, dark circles, eye bags, and crow's feet</li>
                      <li>Activates collagen production</li>
                      <li>Increases ingredient absorption</li>
                      <li>Dermatologically tested</li>
                      <li>Efficacy test on improving wrinkles and moisturizing</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <div className="text-gray-600 space-y-2">
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Apply <strong>EYE CONTOUR SERUM</strong> under the eyes and under the eyebrows.</li>
                        <li>Roll the area gently with <strong>EYE ROLLER</strong> while applying the serum.</li>
                        <li>Apply <strong>EYE PEPTIDE GEL PATCHES</strong> under the eyes and/or the eye brow bones for 20-40 minutes and remove the patches.</li>
                        <li>Finish with <strong>EYE CONTOUR CREAM</strong>.</li>
                      </ol>
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
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                      <li>Professional-grade quality</li>
                      <li>Dermatologically tested</li>
                      <li>Safe for all skin types</li>
                      <li>Long-lasting results</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
                    <p className="text-gray-600">
                      Apply as directed by your skincare professional. For best results, use consistently 
                      as part of your daily skincare routine.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <label className="text-sm font-medium text-black">Quantity:</label>
                <div className="flex items-center border rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 sm:p-2 hover:bg-gray-100 transition-colors touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-gray-700 hover:text-gray-900"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-5 w-5 sm:h-4 sm:w-4" />
                  </button>
                  <span className="px-4 py-3 sm:py-2 font-medium text-center min-w-[60px] sm:min-w-0 text-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 sm:p-2 hover:bg-gray-100 transition-colors touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-gray-700 hover:text-gray-900"
                  >
                    <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdding || !user}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 md:py-4 rounded-lg font-semibold transition-colors touch-manipulation ${
                    product.inStock && !isAdding && user
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {!user ? 'Login' : isAdding ? 'Adding...' : 'Order'}
                </button>
                
                <button
                  onClick={handleFavorite}
                  className={`p-3 md:p-4 rounded-lg border-2 transition-colors touch-manipulation ${
                    isFavorite(product.id)
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:border-red-500 hover:text-red-600'
                  }`}
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      isFavorite(product.id) ? 'fill-current' : ''
                    }`} 
                  />
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
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
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
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
