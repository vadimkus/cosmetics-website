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
import { useTranslation } from '@/hooks/useTranslation'

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
  const { t, dir } = useTranslation()

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
        <div className="text-center py-4 text-gray-500">{t('common.loadingRecommendation')}</div>
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
        intro: t('product.pc22Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc22Benefit1Title'), text: t('product.pc22Benefit1Text') },
          { title: t('product.pc22Benefit2Title'), text: t('product.pc22Benefit2Text') },
          { title: t('product.pc22Benefit3Title'), text: t('product.pc22Benefit3Text') },
          { title: t('product.pc22Benefit4Title'), text: t('product.pc22Benefit4Text') }
        ]
      }
    }
    // Anti-aging combination (32 + 22) - Reverse order
    if ((currentProduct.id === '32' || currentProduct.productNumber === '32') && recommendedProduct.id === '22') {
      return {
        intro: t('product.pc32Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc32Benefit1Title'), text: t('product.pc32Benefit1Text') },
          { title: t('product.pc32Benefit2Title'), text: t('product.pc32Benefit2Text') },
          { title: t('product.pc32Benefit3Title'), text: t('product.pc32Benefit3Text') },
          { title: t('product.pc32Benefit4Title'), text: t('product.pc32Benefit4Text') }
        ]
      }
    }

    // Blemish control combination (20 + 30)
    if ((currentProduct.id === '20' || currentProduct.productNumber === '20') && recommendedProduct.id === '30') {
      return {
        intro: t('product.pc20Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc20Benefit1Title'), text: t('product.pc20Benefit1Text') },
          { title: t('product.pc20Benefit2Title'), text: t('product.pc20Benefit2Text') },
          { title: t('product.pc20Benefit3Title'), text: t('product.pc20Benefit3Text') },
          { title: t('product.pc20Benefit4Title'), text: t('product.pc20Benefit4Text') }
        ]
      }
    }

    // Blemish control combination (30 + 20) - Reverse order
    if ((currentProduct.id === '30' || currentProduct.productNumber === '30') && recommendedProduct.id === '20') {
      return {
        intro: t('product.pc30Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc30Benefit1Title'), text: t('product.pc30Benefit1Text') },
          { title: t('product.pc30Benefit2Title'), text: t('product.pc30Benefit2Text') },
          { title: t('product.pc30Benefit3Title'), text: t('product.pc30Benefit3Text') },
          { title: t('product.pc30Benefit4Title'), text: t('product.pc30Benefit4Text') }
        ]
      }
    }

    // Brightening/Radiance combination (21 + 31)
    if ((currentProduct.id === '21' || currentProduct.productNumber === '21') && recommendedProduct.id === '31') {
      return {
        intro: t('product.pc21Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc21Benefit1Title'), text: t('product.pc21Benefit1Text') },
          { title: t('product.pc21Benefit2Title'), text: t('product.pc21Benefit2Text') },
          { title: t('product.pc21Benefit3Title'), text: t('product.pc21Benefit3Text') },
          { title: t('product.pc21Benefit4Title'), text: t('product.pc21Benefit4Text') }
        ]
      }
    }

    // Blemish control toner + cream combination (15 + 30)
    if ((currentProduct.id === '15' || currentProduct.productNumber === '15') && recommendedProduct.id === '30') {
      return {
        intro: t('product.pc15Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc15Benefit1Title'), text: t('product.pc15Benefit1Text') },
          { title: t('product.pc15Benefit2Title'), text: t('product.pc15Benefit2Text') },
          { title: t('product.pc15Benefit3Title'), text: t('product.pc15Benefit3Text') },
          { title: t('product.pc15Benefit4Title'), text: t('product.pc15Benefit4Text') }
        ]
      }
    }

    // Sensitive skin/barrier repair combination (19 + 27)
    if ((currentProduct.id === '19' || currentProduct.productNumber === '19') && recommendedProduct.id === '27') {
      return {
        intro: t('product.pc19Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc19Benefit1Title'), text: t('product.pc19Benefit1Text') },
          { title: t('product.pc19Benefit2Title'), text: t('product.pc19Benefit2Text') },
          { title: t('product.pc19Benefit3Title'), text: t('product.pc19Benefit3Text') },
          { title: t('product.pc19Benefit4Title'), text: t('product.pc19Benefit4Text') }
        ]
      }
    }

    // Hydration/moisturizing combination (18 + 29)
    if ((currentProduct.id === '18' || currentProduct.productNumber === '18') && recommendedProduct.id === '29') {
      return {
        intro: t('product.pc18Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc18Benefit1Title'), text: t('product.pc18Benefit1Text') },
          { title: t('product.pc18Benefit2Title'), text: t('product.pc18Benefit2Text') },
          { title: t('product.pc18Benefit3Title'), text: t('product.pc18Benefit3Text') },
          { title: t('product.pc18Benefit4Title'), text: t('product.pc18Benefit4Text') }
        ]
      }
    }

    // Hydration/moisturizing combination (29 + 18) - Reverse order
    if ((currentProduct.id === '29' || currentProduct.productNumber === '29') && recommendedProduct.id === '18') {
      return {
        intro: t('product.pc29Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc29Benefit1Title'), text: t('product.pc29Benefit1Text') },
          { title: t('product.pc29Benefit2Title'), text: t('product.pc29Benefit2Text') },
          { title: t('product.pc29Benefit3Title'), text: t('product.pc29Benefit3Text') },
          { title: t('product.pc29Benefit4Title'), text: t('product.pc29Benefit4Text') }
        ]
      }
    }

    // Cleanser + toner combination (10 + 16)
    if ((currentProduct.id === '10' || currentProduct.productNumber === '10') && recommendedProduct.id === '16') {
      return {
        intro: `Complete your cleansing routine by combining the <strong>${currentName}</strong> with <strong>${recommendedName}</strong>. Together, they provide comprehensive deep cleansing and skin preparation for a refreshed, balanced complexion.`,
        benefits: [
          { title: 'Complete Cleansing Routine:', text: 'Oxygen bubble cleanser removes impurities while toner balances pH and refines skin texture' },
          { title: 'Deep Cleansing + Hydration:', text: 'Cleanser provides oxygen therapy for deep cleansing while toner moisturizes and soothes the skin' },
          { title: 'Skin Preparation:', text: 'Toner prepares skin for optimal absorption of subsequent skincare products after cleansing' },
          { title: 'Balanced pH Level:', text: 'Toner helps restore and balance skin\'s natural pH after cleansing for healthier skin barrier' }
        ]
      }
    }

    // Post-treatment recovery + professional treatment combination (25 + 38)
    if ((currentProduct.id === '25' || currentProduct.productNumber === '25') && recommendedProduct.id === '38') {
      return {
        intro: `Enhance your professional treatment results by combining the <strong>${currentName}</strong> with <strong>${recommendedName}</strong>. Together, they provide comprehensive treatment support and optimal recovery for professional skincare results.`,
        benefits: [
          { title: 'Complete Treatment Protocol:', text: 'CO₂ mask provides oxygen therapy and skin activation while post-cream promotes rapid recovery and healing' },
          { title: 'Enhanced Recovery:', text: 'Post-cream helps skin recover from redness and irritation while mask prepares skin for optimal treatment absorption' },
          { title: 'Synergistic Healing:', text: 'Centella complex in both products works together to soothe, repair, and regenerate skin after professional treatments' },
          { title: 'Professional Results:', text: 'Addresses both treatment preparation and post-treatment recovery for comprehensive professional skincare protocol' }
        ]
      }
    }

    // Eye care combination (33 + 17)
    if ((currentProduct.id === '33' || currentProduct.productNumber === '33') && recommendedProduct.id === '17') {
      return {
        intro: t('product.pc33Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc33Benefit1Title'), text: t('product.pc33Benefit1Text') },
          { title: t('product.pc33Benefit2Title'), text: t('product.pc33Benefit2Text') },
          { title: t('product.pc33Benefit3Title'), text: t('product.pc33Benefit3Text') },
          { title: t('product.pc33Benefit4Title'), text: t('product.pc33Benefit4Text') }
        ]
      }
    }

    // Eye care serum + cream combination (17 + 24 or 24 + 17)
    if (((currentProduct.id === '17' || currentProduct.productNumber === '17') && recommendedProduct.id === '24') ||
        ((currentProduct.id === '24' || currentProduct.productNumber === '24') && recommendedProduct.id === '17')) {
      // Determine which is serum and which is cream for proper description
      const isSerumFirst = (currentProduct.id === '17' || currentProduct.productNumber === '17')
      
      return {
        intro: t('product.pc24Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc24Benefit1Title'), text: t('product.pc24Benefit1Text') },
          { title: t('product.pc24Benefit2TitleSerumFirst'), text: isSerumFirst ? t('product.pc24Benefit2TextSerumFirst') : t('product.pc24Benefit2TextCreamFirst') },
          { title: t('product.pc24Benefit3Title'), text: isSerumFirst ? t('product.pc24Benefit3TextSerumFirst') : t('product.pc24Benefit3TextCreamFirst') },
          { title: t('product.pc24Benefit4Title'), text: t('product.pc24Benefit4Text') }
        ]
      }
    }

    // Hair care shampoo + tonic combination (44 + 43 or 43 + 44)
    if (((currentProduct.id === '44' || currentProduct.productNumber === '44') && recommendedProduct.id === '43') ||
        ((currentProduct.id === '43' || currentProduct.productNumber === '43') && recommendedProduct.id === '44')) {
      // Determine which is shampoo and which is tonic for proper description
      const isShampooFirst = (currentProduct.id === '44' || currentProduct.productNumber === '44')
      
      return {
        intro: t('product.pc44Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc44Benefit1Title'), text: t('product.pc44Benefit1Text') },
          { title: isShampooFirst ? t('product.pc44Benefit2TitleShampooFirst') : t('product.pc44Benefit2TitleTonicFirst'), text: isShampooFirst ? t('product.pc44Benefit2TextShampooFirst') : t('product.pc44Benefit2TextTonicFirst') },
          { title: isShampooFirst ? t('product.pc44Benefit3TitleShampooFirst') : t('product.pc44Benefit3TitleTonicFirst'), text: isShampooFirst ? t('product.pc44Benefit3TextShampooFirst') : t('product.pc44Benefit3TextTonicFirst') },
          { title: t('product.pc44Benefit4Title'), text: t('product.pc44Benefit4Text') }
        ]
      }
    }

    // Hair care ampoule + tonic combination (45 + 43)
    if ((currentProduct.id === '45' || currentProduct.productNumber === '45') && recommendedProduct.id === '43') {
      return {
        intro: t('product.pc45Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc45Benefit1Title'), text: t('product.pc45Benefit1Text') },
          { title: t('product.pc45Benefit2Title'), text: t('product.pc45Benefit2Text') },
          { title: t('product.pc45Benefit3Title'), text: t('product.pc45Benefit3Text') },
          { title: t('product.pc45Benefit4Title'), text: t('product.pc45Benefit4Text') }
        ]
      }
    }

    // Scalp peeling + shampoo combination (46 + 44)
    if ((currentProduct.id === '46' || currentProduct.productNumber === '46') && recommendedProduct.id === '44') {
      return {
        intro: t('product.pc46Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc46Benefit1Title'), text: t('product.pc46Benefit1Text') },
          { title: t('product.pc46Benefit2Title'), text: t('product.pc46Benefit2Text') },
          { title: t('product.pc46Benefit3Title'), text: t('product.pc46Benefit3Text') },
          { title: t('product.pc46Benefit4Title'), text: t('product.pc46Benefit4Text') }
        ]
      }
    }

    // Default generic description
    return {
      intro: t('product.pcDefaultIntro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
      benefits: [
        { title: t('product.pcDefaultBenefit1Title'), text: t('product.pcDefaultBenefit1Text') },
        { title: t('product.pcDefaultBenefit2Title'), text: t('product.pcDefaultBenefit2Text') },
        { title: t('product.pcDefaultBenefit3Title'), text: t('product.pcDefaultBenefit3Text') },
        { title: t('product.pcDefaultBenefit4Title'), text: t('product.pcDefaultBenefit4Text') }
      ]
    }
  }

  const description = getDescription()

  return (
    <div className="mt-6 md:mt-8 border-t-2 border-gray-200 pt-6 md:pt-8" dir={dir}>
      {/* Product Recommendation Section */}
      <div className="bg-white border-2 border-red-200 rounded-xl p-4 md:p-6 shadow-lg">
        <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-red-600 flex-shrink-0" />
          <h3 className={`text-lg md:text-xl font-bold text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('product.perfectCombination')}</h3>
        </div>
        
        <p className={`text-gray-700 mb-4 md:mb-6 text-xs md:text-sm leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`} dangerouslySetInnerHTML={{ __html: description.intro }} />

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
              <p className="text-xs text-gray-600 mb-1 md:mb-2">{t('product.size')}: {recommendedProduct.size}</p>
            )}
            {!recommendedProduct.size && recommendedProduct.id === '32' && (
              <p className="text-xs text-gray-600 mb-1 md:mb-2">{t('product.size')}: 50g</p>
            )}
            {canSeePrice ? (
              <div className={`flex flex-wrap items-center gap-1 md:gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {pricing.hasDiscount ? (
                  <>
                    <span className="text-base md:text-lg font-bold text-red-600">
                      {pricing.discountedPrice.toFixed(2)} {dir === 'rtl' ? 'درهم' : 'AED'}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 line-through">
                      {pricing.originalPrice.toFixed(2)} {dir === 'rtl' ? 'درهم' : 'AED'}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                      {pricing.discountPercentage}% {t('product.off')}
                    </span>
                  </>
                ) : (
                  <span className="text-base md:text-lg font-bold text-red-600">
                    {pricing.originalPrice.toFixed(2)} {dir === 'rtl' ? 'درهم' : 'AED'}
                  </span>
                )}
              </div>
            ) : (
              <p className={`text-xs md:text-sm text-gray-500 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('product.loginToSeePrice')}</p>
            )}
            <p className={`text-xs text-gray-600 mt-1 md:mt-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {dir === 'rtl' ? '← اضغط لعرض التفاصيل' : 'Click to view details →'}
            </p>
          </Link>

          {/* Benefits of Combination */}
          <div className="bg-white rounded-lg p-3 md:p-4 border-2 border-red-300">
            <h4 className={`font-semibold text-sm md:text-base text-gray-900 mb-2 md:mb-3 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
              <span>{t('product.whyCombineTheseProducts')}</span>
            </h4>
            <ul className={`space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {description.benefits.map((benefit, index) => (
                <li key={index} className={`flex items-start gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-red-600 mt-0.5 md:mt-1 flex-shrink-0">✓</span>
                  <span className="break-words"><strong>{benefit.title}</strong> {benefit.text}</span>
                </li>
              ))}
            </ul>
            
            {user && (
              <button
                onClick={handleAddBothToCart}
                className={`mt-3 md:mt-4 w-full flex items-center justify-center gap-2 bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors font-medium text-xs md:text-sm touch-manipulation min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                {t('product.addToCart')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

