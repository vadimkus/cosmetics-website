'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Sparkles } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { calculateDiscountedPrice, canUserSeePrices } from '@/lib/discountUtils'
import { errorLog } from '@/lib/logger'
import { useTranslation } from '@/hooks/useTranslation'
import { translateSize } from '@/utils/sizeTranslations'
import { sanitizeHtml } from '@/lib/sanitize'
import { usePWAMode } from '@/hooks/usePWAMode'

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
  const [isMobile, setIsMobile] = useState(false)
  const { addItem } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { t, dir, locale } = useTranslation()
  const { isPWA } = usePWAMode()
  
  // Detect mobile for "Add to Bag" text
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Use "Add to Bag" for PWA and mobile web
  const useBagText = isPWA || isMobile

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
        intro: t('product.pcDefaultIntroNoProducts', { currentName: '', recommendedName: recommendedProduct.name }),
        benefits: [
          { title: t('product.pcDefaultBenefit1Title'), text: t('product.pcDefaultBenefit1Text') },
          { title: t('product.pcDefaultBenefit2Title'), text: t('product.pcDefaultBenefit2Text') },
          { title: t('product.pcDefaultBenefit3Title'), text: t('product.pcDefaultBenefit3Text') },
          { title: t('product.pcDefaultBenefit4Title'), text: t('product.pcDefaultBenefit4Text') }
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
    // Brightening/Radiance combination (31 + 21) - Reverse order
    if ((currentProduct.id === '31' || currentProduct.productNumber === '31') && recommendedProduct.id === '21') {
      return {
        intro: t('product.pc31Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc31Benefit1Title'), text: t('product.pc31Benefit1Text') },
          { title: t('product.pc31Benefit2Title'), text: t('product.pc31Benefit2Text') },
          { title: t('product.pc31Benefit3Title'), text: t('product.pc31Benefit3Text') },
          { title: t('product.pc31Benefit4Title'), text: t('product.pc31Benefit4Text') }
        ]
      }
    }
    // LED Therapy combination (49 + 37)
    if ((currentProduct.id === '49' || currentProduct.productNumber === '49') && recommendedProduct.id === '37') {
      return {
        intro: t('product.pc49Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc49Benefit1Title'), text: t('product.pc49Benefit1Text') },
          { title: t('product.pc49Benefit2Title'), text: t('product.pc49Benefit2Text') },
          { title: t('product.pc49Benefit3Title'), text: t('product.pc49Benefit3Text') },
          { title: t('product.pc49Benefit4Title'), text: t('product.pc49Benefit4Text') }
        ]
      }
    }
    // LED Therapy combination (37 + 49) - Reverse order
    if ((currentProduct.id === '37' || currentProduct.productNumber === '37') && recommendedProduct.id === '49') {
      return {
        intro: t('product.pc37Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc37Benefit1Title'), text: t('product.pc37Benefit1Text') },
          { title: t('product.pc37Benefit2Title'), text: t('product.pc37Benefit2Text') },
          { title: t('product.pc37Benefit3Title'), text: t('product.pc37Benefit3Text') },
          { title: t('product.pc37Benefit4Title'), text: t('product.pc37Benefit4Text') }
        ]
      }
    }
    // PRO Solution + Microneedle Roller combinations (4, 5, 6, 7, 8, 9 + 1)
    if ((currentProduct.id === '4' || currentProduct.productNumber === '4') && recommendedProduct.id === '1') {
      return {
        intro: t('product.pc4Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc4Benefit1Title'), text: t('product.pc4Benefit1Text') },
          { title: t('product.pc4Benefit2Title'), text: t('product.pc4Benefit2Text') },
          { title: t('product.pc4Benefit3Title'), text: t('product.pc4Benefit3Text') },
          { title: t('product.pc4Benefit4Title'), text: t('product.pc4Benefit4Text') }
        ]
      }
    }
    if ((currentProduct.id === '5' || currentProduct.productNumber === '5') && recommendedProduct.id === '1') {
      return {
        intro: t('product.pc5Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc5Benefit1Title'), text: t('product.pc5Benefit1Text') },
          { title: t('product.pc5Benefit2Title'), text: t('product.pc5Benefit2Text') },
          { title: t('product.pc5Benefit3Title'), text: t('product.pc5Benefit3Text') },
          { title: t('product.pc5Benefit4Title'), text: t('product.pc5Benefit4Text') }
        ]
      }
    }
    if ((currentProduct.id === '7' || currentProduct.productNumber === '7') && recommendedProduct.id === '1') {
      return {
        intro: t('product.pc7Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc7Benefit1Title'), text: t('product.pc7Benefit1Text') },
          { title: t('product.pc7Benefit2Title'), text: t('product.pc7Benefit2Text') },
          { title: t('product.pc7Benefit3Title'), text: t('product.pc7Benefit3Text') },
          { title: t('product.pc7Benefit4Title'), text: t('product.pc7Benefit4Text') }
        ]
      }
    }
    if ((currentProduct.id === '8' || currentProduct.productNumber === '8') && recommendedProduct.id === '1') {
      return {
        intro: t('product.pc8Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc8Benefit1Title'), text: t('product.pc8Benefit1Text') },
          { title: t('product.pc8Benefit2Title'), text: t('product.pc8Benefit2Text') },
          { title: t('product.pc8Benefit3Title'), text: t('product.pc8Benefit3Text') },
          { title: t('product.pc8Benefit4Title'), text: t('product.pc8Benefit4Text') }
        ]
      }
    }
    if ((currentProduct.id === '6' || currentProduct.productNumber === '6') && recommendedProduct.id === '1') {
      return {
        intro: t('product.pc6Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc6Benefit1Title'), text: t('product.pc6Benefit1Text') },
          { title: t('product.pc6Benefit2Title'), text: t('product.pc6Benefit2Text') },
          { title: t('product.pc6Benefit3Title'), text: t('product.pc6Benefit3Text') },
          { title: t('product.pc6Benefit4Title'), text: t('product.pc6Benefit4Text') }
        ]
      }
    }
    if ((currentProduct.id === '9' || currentProduct.productNumber === '9') && recommendedProduct.id === '1') {
      return {
        intro: t('product.pc9Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc9Benefit1Title'), text: t('product.pc9Benefit1Text') },
          { title: t('product.pc9Benefit2Title'), text: t('product.pc9Benefit2Text') },
          { title: t('product.pc9Benefit3Title'), text: t('product.pc9Benefit3Text') },
          { title: t('product.pc9Benefit4Title'), text: t('product.pc9Benefit4Text') }
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
        intro: t('product.pc10Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc10Benefit1Title'), text: t('product.pc10Benefit1Text') },
          { title: t('product.pc10Benefit2Title'), text: t('product.pc10Benefit2Text') },
          { title: t('product.pc10Benefit3Title'), text: t('product.pc10Benefit3Text') },
          { title: t('product.pc10Benefit4Title'), text: t('product.pc10Benefit4Text') }
        ]
      }
    }

    // Post-treatment recovery + professional treatment combination (25 + 38)
    if ((currentProduct.id === '25' || currentProduct.productNumber === '25') && recommendedProduct.id === '38') {
      return {
        intro: t('product.pc25Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc25Benefit1Title'), text: t('product.pc25Benefit1Text') },
          { title: t('product.pc25Benefit2Title'), text: t('product.pc25Benefit2Text') },
          { title: t('product.pc25Benefit3Title'), text: t('product.pc25Benefit3Text') },
          { title: t('product.pc25Benefit4Title'), text: t('product.pc25Benefit4Text') }
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

    // Scalp brush + hair tonic combination (61 + 43)
    if ((currentProduct.productNumber === '61') && recommendedProduct.id === '43') {
      return {
        intro: t('product.pc61Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc61Benefit1Title'), text: t('product.pc61Benefit1Text') },
          { title: t('product.pc61Benefit2Title'), text: t('product.pc61Benefit2Text') },
          { title: t('product.pc61Benefit3Title'), text: t('product.pc61Benefit3Text') },
          { title: t('product.pc61Benefit4Title'), text: t('product.pc61Benefit4Text') }
        ]
      }
    }

    // Bio-Ferment Mask + Anti-Wrinkle Serum combination (51 + 22)
    if (currentProduct.id === '51' && recommendedProduct.id === '22') {
      return {
        intro: t('product.pc51Intro', { currentName: `<strong>${currentName}</strong>`, recommendedName: `<strong>${recommendedName}</strong>` }),
        benefits: [
          { title: t('product.pc51Benefit1Title'), text: t('product.pc51Benefit1Text') },
          { title: t('product.pc51Benefit2Title'), text: t('product.pc51Benefit2Text') },
          { title: t('product.pc51Benefit3Title'), text: t('product.pc51Benefit3Text') },
          { title: t('product.pc51Benefit4Title'), text: t('product.pc51Benefit4Text') }
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
    <div className="mt-3 lg:mt-6 border-t-2 border-gray-200 pt-3 lg:pt-6" dir={dir}>
      {/* Product Recommendation Section */}
      <div className="bg-white border-2 border-red-200 rounded-xl p-2 lg:p-4 shadow-lg">
        <div className="flex items-center gap-1.5 lg:gap-2 mb-2 lg:mb-3" dir={dir} style={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}>
          <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 text-red-600 flex-shrink-0" />
          <h3 className="text-sm lg:text-lg font-bold text-gray-900" dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>{t('product.perfectCombination')}</h3>
        </div>
        
        <p className="text-gray-700 mb-2 lg:mb-4 text-[10px] lg:text-xs leading-relaxed" dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(description.intro || '') }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-4">
          {/* Recommended Product Preview */}
          <Link 
            href={`/products/${recommendedProduct.id}`}
            className="group bg-white rounded-lg p-2 lg:p-3 border-2 border-red-300 hover:border-red-500 transition-all shadow-md hover:shadow-xl"
          >
            <div className="relative w-full h-32 lg:h-40 mb-2 lg:mb-3 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={recommendedProduct.image}
                alt={recommendedProduct.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <h4 className="font-semibold text-xs lg:text-sm mb-0.5 lg:mb-1 text-gray-900 group-hover:text-red-600 transition-colors break-words">
              {recommendedProduct.name}
            </h4>
            {recommendedProduct.size && (
              <p className="text-[10px] lg:text-xs mb-0.5 lg:mb-1 text-gray-600">{t('product.size')}: {translateSize(recommendedProduct.size, locale, recommendedProduct.category)}</p>
            )}
            {!recommendedProduct.size && recommendedProduct.id === '32' && (
              <p className="text-[10px] lg:text-xs mb-0.5 lg:mb-1 text-gray-600">{t('product.size')}: 50g</p>
            )}
            {canSeePrice ? (
              <div className="flex flex-wrap items-center gap-0.5 lg:gap-1" dir={dir} style={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}>
                {pricing.hasDiscount ? (
                  <>
                    <span className="text-xs lg:text-base font-bold text-red-600">
                      {pricing.discountedPrice.toFixed(2)} {dir === 'rtl' ? 'درهم' : 'AED'}
                    </span>
                    <span className="text-[10px] lg:text-xs text-gray-500 line-through">
                      {pricing.originalPrice.toFixed(2)} {dir === 'rtl' ? 'درهم' : 'AED'}
                    </span>
                    <span className="text-[10px] lg:text-xs px-1 lg:px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                      {pricing.discountPercentage}% {t('product.off')}
                    </span>
                  </>
                ) : (
                  <span className="text-xs lg:text-base font-bold text-red-600">
                    {pricing.originalPrice.toFixed(2)} {dir === 'rtl' ? 'درهم' : 'AED'}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-[10px] lg:text-xs text-gray-500" dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>{t('product.loginToSeePrice')}</p>
            )}
            <p className="text-[10px] lg:text-xs mt-0.5 lg:mt-1 text-gray-600" dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
              {dir === 'rtl' ? '← اضغط لعرض التفاصيل' : t('product.clickToViewDetails')}
            </p>
          </Link>

          {/* Benefits of Combination */}
          <div className="bg-white rounded-lg p-2 lg:p-3 border-2 border-red-300">
            <h4 className="font-semibold text-xs lg:text-sm mb-1.5 lg:mb-2 text-gray-900 flex items-center gap-1.5 lg:gap-2" dir={dir} style={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}>
              <Sparkles className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-red-600 flex-shrink-0" />
              <span>{t('product.whyCombineTheseProducts')}</span>
            </h4>
            <ul className="space-y-1 lg:space-y-1.5 text-[10px] lg:text-xs text-gray-700" dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
              {description.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-1.5 lg:gap-2" dir={dir} style={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}>
                  <span className="text-red-600 mt-0.5 lg:mt-0.5 flex-shrink-0">✓</span>
                  <span className="break-words"><strong>{benefit.title}</strong> {benefit.text}</span>
                </li>
              ))}
            </ul>
            
            {user && (
              <button
                onClick={handleAddBothToCart}
                className="mt-2 lg:mt-3 px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-xs w-full flex items-center justify-center gap-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors font-medium touch-manipulation min-h-[44px]"
                dir={dir}
                style={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}
              >
                <ShoppingCart className="h-2.5 w-2.5 lg:h-3 lg:w-3 flex-shrink-0" />
                {useBagText ? t('product.addToBag') : t('product.addToCart')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

