'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Sparkles } from 'lucide-react'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { calculateDiscountedPrice, canUserSeePrices } from '@/lib/discountUtils'
import { errorLog } from '@/lib/logger'

interface ProductRecommendationProps {
  recommendedProductId: string
  currentProduct?: Product | null
}

export default function ProductRecommendation({ 
  recommendedProductId,
  currentProduct
}: ProductRecommendationProps) {
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    async function fetchRecommendedProduct() {
      try {
        const response = await fetch(`/api/products/${recommendedProductId}`)
        if (response.ok) {
          const product = await response.json()
          // API returns product directly, not wrapped in { success, product }
          if (product && product.id) {
            setRecommendedProduct(product)
          }
        }
      } catch (error) {
        errorLog('Error fetching recommended product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (recommendedProductId) {
      fetchRecommendedProduct()
    }
  }, [recommendedProductId])

  const handleAddBothToCart = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      if (recommendedProduct) {
        // Add both products to cart
        await addItem(recommendedProduct, 1)
        // Note: Current product should be added separately by user
      }
    } catch (error) {
      errorLog('Error adding products to cart:', error)
    }
  }

  if (loading) {
    return (
      <div className="mt-8 border-t-2 border-gray-200 pt-8">
        <div className="text-center py-4 text-gray-500">Loading recommendation...</div>
      </div>
    )
  }

  if (!recommendedProduct) {
    return null
  }

  const pricing = calculateDiscountedPrice(recommendedProduct, user)
  const canSeePrice = canUserSeePrices(user)

  // Generate dynamic description based on product combination
  const getDescription = () => {
    if (!currentProduct) {
      return {
        intro: `Enhance your skincare routine by combining these complementary products.`,
        benefits: [
          { title: 'Enhanced Results:', text: 'Combined products work synergistically for better outcomes' },
          { title: 'Complete Care:', text: 'Addresses multiple skin concerns comprehensively' },
          { title: 'Optimal Formulation:', text: 'Products are designed to complement each other' },
          { title: 'Professional Routine:', text: 'Create a complete skincare regimen for best results' }
        ]
      }
    }

    const currentName = currentProduct.name.toUpperCase()
    const recommendedName = recommendedProduct.name.toUpperCase()

    // Anti-aging combination (22 + 32)
    if ((currentProduct.id === '22' || currentProduct.productNumber === '22') && recommendedProduct.id === '32') {
      return {
        intro: `Enhance your anti-aging routine by combining the <strong>${currentName}</strong> with <strong>${recommendedName}</strong>. Together, they provide comprehensive wrinkle reduction and skin firmness for maximum results.`,
        benefits: [
          { title: 'Enhanced Absorption:', text: 'Serum prepares skin for deeper cream penetration' },
          { title: '24/7 Protection:', text: 'Serum for daytime, cream for nighttime repair' },
          { title: 'Synergistic Effects:', text: 'Combined active ingredients work better together' },
          { title: 'Complete Routine:', text: 'Addresses all signs of aging comprehensively' }
        ]
      }
    }

    // Blemish control combination (20 + 30)
    if ((currentProduct.id === '20' || currentProduct.productNumber === '20') && recommendedProduct.id === '30') {
      return {
        intro: `Complete your blemish control routine by combining the <strong>${currentName}</strong> with <strong>${recommendedName}</strong>. Together, they provide comprehensive oil regulation and blemish prevention for clearer, healthier skin.`,
        benefits: [
          { title: 'Dual Action Treatment:', text: 'Serum targets active breakouts while cream provides ongoing protection' },
          { title: 'Oil Regulation:', text: 'Zinc PCA in both products works together to control excess sebum production' },
          { title: 'Hydrated Control:', text: 'Serum treats while cream maintains moisture balance without clogging pores' },
          { title: 'Complete Blemish Care:', text: 'Addresses both prevention and treatment of acne-prone skin' }
        ]
      }
    }

    // Brightening/Radiance combination (21 + 31)
    if ((currentProduct.id === '21' || currentProduct.productNumber === '21') && recommendedProduct.id === '31') {
      return {
        intro: `Maximize your skin brightening results by combining the <strong>${currentName}</strong> with <strong>${recommendedName}</strong>. Together, they provide comprehensive radiance enhancement and even skin tone for a naturally glowing complexion.`,
        benefits: [
          { title: 'Enhanced Brightening:', text: 'MELAZERO® complex in both products works synergistically to reduce melanin and even skin tone' },
          { title: 'Multi-Vitamin Boost:', text: 'VITA 12 Complex and vitamin C derivatives provide comprehensive antioxidant protection' },
          { title: '24/7 Radiance:', text: 'Serum for active brightening while cream maintains and protects your glow' },
          { title: 'Complete Brightening Routine:', text: 'Addresses hyperpigmentation, dullness, and uneven tone for radiant skin' }
        ]
      }
    }

    // Blemish control toner + cream combination (15 + 30)
    if ((currentProduct.id === '15' || currentProduct.productNumber === '15') && recommendedProduct.id === '30') {
      return {
        intro: `Complete your blemish control routine by combining the <strong>${currentName}</strong> with <strong>${recommendedName}</strong>. Together, they provide comprehensive oil regulation and blemish prevention for clearer, healthier skin.`,
        benefits: [
          { title: 'Prepared Skin Base:', text: 'Toner removes excess oil and sebum while preparing skin for optimal cream absorption' },
          { title: 'Dual Oil Control:', text: 'Anti Sebum P complex in toner and Zinc PCA in cream work together to regulate sebum production' },
          { title: 'Complete Hydration:', text: 'Toner provides quick hydration while cream maintains moisture balance without clogging pores' },
          { title: 'Full Blemish Care:', text: 'Addresses both cleansing/preparation and treatment/protection for acne-prone skin' }
        ]
      }
    }

    // Sensitive skin/barrier repair combination (19 + 27)
    if ((currentProduct.id === '19' || currentProduct.productNumber === '19') && recommendedProduct.id === '27') {
      return {
        intro: `Strengthen and protect your sensitive skin by combining the <strong>${currentName}</strong> with <strong>${recommendedName}</strong>. Together, they provide comprehensive barrier repair and protection for calm, resilient skin.`,
        benefits: [
          { title: 'Barrier Repair Synergy:', text: 'MultiEx BSASM® Plus in both products works together to restore and strengthen the skin barrier' },
          { title: 'Soothing Protection:', text: 'Serum provides anti-inflammatory relief while cream creates a protective barrier against irritants' },
          { title: 'Enhanced Moisture Retention:', text: 'Ceramides and amino acids in cream lock in hydration provided by serum\'s hyaluronic acid' },
          { title: 'Complete Sensitive Skin Care:', text: 'Addresses both immediate soothing needs and long-term barrier health for sensitive skin' }
        ]
      }
    }

    // Default generic description
    return {
      intro: `Enhance your skincare routine by combining <strong>${currentName}</strong> with <strong>${recommendedName}</strong>. Together, they provide comprehensive care for optimal results.`,
      benefits: [
        { title: 'Enhanced Results:', text: 'Combined products work synergistically for better outcomes' },
        { title: 'Complete Care:', text: 'Addresses multiple skin concerns comprehensively' },
        { title: 'Optimal Formulation:', text: 'Products are designed to complement each other' },
        { title: 'Professional Routine:', text: 'Create a complete skincare regimen for best results' }
      ]
    }
  }

  const description = getDescription()

  return (
    <div className="mt-6 md:mt-8 border-t-2 border-gray-200 pt-6 md:pt-8">
      {/* Product Recommendation Section */}
      <div className="bg-white border-2 border-red-200 rounded-xl p-4 md:p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Perfect Combination</h3>
        </div>
        
        <p className="text-gray-700 mb-4 md:mb-6 text-xs md:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: description.intro }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Recommended Product Preview */}
          <Link 
            href={`/products/${recommendedProduct.id}`}
            className="group bg-white rounded-lg p-3 md:p-4 border-2 border-red-300 hover:border-red-500 transition-all shadow-md hover:shadow-xl"
          >
            <div className="relative w-full h-40 md:h-48 mb-3 md:mb-4 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={recommendedProduct.image}
                alt={recommendedProduct.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <h4 className="font-semibold text-sm md:text-base text-gray-900 mb-1 md:mb-2 group-hover:text-red-600 transition-colors break-words">
              {recommendedProduct.name}
            </h4>
            {recommendedProduct.size && (
              <p className="text-xs text-gray-600 mb-1 md:mb-2">Size: {recommendedProduct.size}</p>
            )}
            {!recommendedProduct.size && recommendedProduct.id === '32' && (
              <p className="text-xs text-gray-600 mb-1 md:mb-2">Size: 50g</p>
            )}
            {canSeePrice ? (
              <div className="flex flex-wrap items-center gap-1 md:gap-2">
                {pricing.hasDiscount ? (
                  <>
                    <span className="text-base md:text-lg font-bold text-red-600">
                      AED {pricing.discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 line-through">
                      AED {pricing.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                      {pricing.discountPercentage}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-base md:text-lg font-bold text-red-600">
                    AED {pricing.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-xs md:text-sm text-gray-500">Login to see price</p>
            )}
            <p className="text-xs text-gray-600 mt-1 md:mt-2">Click to view details →</p>
          </Link>

          {/* Benefits of Combination */}
          <div className="bg-white rounded-lg p-3 md:p-4 border-2 border-red-300">
            <h4 className="font-semibold text-sm md:text-base text-gray-900 mb-2 md:mb-3 flex items-center gap-2">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
              <span>Why Combine These Products?</span>
            </h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-700">
              {description.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5 md:mt-1 flex-shrink-0">✓</span>
                  <span className="break-words"><strong>{benefit.title}</strong> {benefit.text}</span>
                </li>
              ))}
            </ul>
            
            {user && (
              <button
                onClick={handleAddBothToCart}
                className="mt-3 md:mt-4 w-full flex items-center justify-center gap-2 bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-xs md:text-sm"
              >
                <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                Add product to cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

