'use client'
import { errorLog } from '@/lib/logger'

import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { useAuth } from '@/components/AuthProvider'
import ErrorPage from '@/components/ErrorPage'
import { ArrowLeft, Sparkles } from 'lucide-react'
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
import ProductReviews from '@/components/product/ProductReviews'
import TrustBadges from '@/components/product/TrustBadges'
import ProductRecommendation from '@/components/product/ProductRecommendation'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
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
  const { t, locale, dir } = useTranslation()
  
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
      router.push(getLocalizedPath('/login', locale))
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
      errorLog('Error adding to cart:', error)
    }
  }, [user, product, selectedSize, selectedColor, addItem, router])

  // Handle toggle favorite
  const handleToggleFavorite = useCallback(() => {
    if (!user) {
      router.push(getLocalizedPath('/login', locale))
      return
    }
    toggleFavorite(product)
  }, [user, product, toggleFavorite, router, locale])

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
    <div className="bg-white min-h-screen" dir={dir}>
      <ProductSchema product={product} />
      <BreadcrumbSchema 
        items={[
          { name: t('navigation.home'), url: getLocalizedPath('/', locale) },
          { name: t('navigation.products'), url: getLocalizedPath('/products', locale) },
          { name: product.name, url: getLocalizedPath(`/products/${product.id}`, locale) }
        ]}
      />

      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Back Button */}
        <div className={`flex items-center mb-4 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <Link 
            href={getLocalizedPath('/products', locale)}
            className={`flex items-center text-gray-600 hover:text-primary-600 transition-colors text-sm md:text-sm ${dir === 'rtl' ? 'ml-4 flex-row-reverse' : 'mr-4'}`}
          >
            <ArrowLeft className={`h-4 w-4 md:h-5 md:w-5 ${dir === 'rtl' ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {t('product.backToProducts')}
          </Link>
        </div>

        {/* Main Product Layout - Single Column Vertical */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 ${dir === 'rtl' ? 'lg:grid-flow-row-dense' : ''}`}>
          {/* Left Column - Product Images and Purchase Controls */}
          <div className={`space-y-4 ${dir === 'rtl' ? 'lg:col-start-2' : ''}`}>
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
              inStock={product.inStock}
            />

            {/* Trust Badges - Below Cart */}
            <TrustBadges />

            {/* Product Recommendation Section - Only for product 22 - Desktop only */}
            {(product.id === '22' || product.productNumber === '22') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="32"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 20 - Desktop only */}
            {(product.id === '20' || product.productNumber === '20') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="30"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 21 - Desktop only */}
            {(product.id === '21' || product.productNumber === '21') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="31"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 15 - Desktop only */}
            {(product.id === '15' || product.productNumber === '15') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="30"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 19 - Desktop only */}
            {(product.id === '19' || product.productNumber === '19') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="27"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 18 - Desktop only */}
            {(product.id === '18' || product.productNumber === '18') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="29"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 10 - Desktop only */}
            {(product.id === '10' || product.productNumber === '10') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="16"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 25 - Desktop only */}
            {(product.id === '25' || product.productNumber === '25') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="38"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 33 - Desktop only */}
            {(product.id === '33' || product.productNumber === '33') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="17"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 17 - Desktop only */}
            {(product.id === '17' || product.productNumber === '17') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="24"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 24 - Desktop only */}
            {(product.id === '24' || product.productNumber === '24') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="17"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 44 - Desktop only */}
            {(product.id === '44' || product.productNumber === '44') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 43 - Desktop only */}
            {(product.id === '43' || product.productNumber === '43') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="44"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 45 - Desktop only */}
            {(product.id === '45' || product.productNumber === '45') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 46 - Desktop only */}
            {(product.id === '46' || product.productNumber === '46') && (
              <div className="hidden lg:block">
                <ProductRecommendation 
                  recommendedProductId="44"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Skincare Routine Block - Only for Problem Skin Care Beauty Box (product 55) - Desktop only */}
            {(product.id === '55' || product.productNumber === '55') && (
              <div className="hidden lg:block bg-blue-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">Recommended Skincare Routine</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow O₂ Cleanser</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Start your routine by cleansing your face with Snow O₂. Apply to dry skin, wait for oxygen bubbles to form, then gently massage and rinse with lukewarm water.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Problem Control Toner</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">After cleansing, apply the toner to remove excess oil and sebum while adding quick hydration. This prepares your skin for the next steps.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Problem Control Serum</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Apply the serum to regulate excessive oil and sebum production. This helps fight breakouts and refines skin texture for clearer, healthier-looking skin.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Intensive Problem Control Cream</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Finish with the cream to control blemish-prone skin while keeping it hydrated. This provides ongoing protection and maintains moisture balance.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Soothing Bomb Sea Algae Mask</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Use the mask 2-3 times per week to complement your routine. It provides intensive relief and moisturizes skin with sea algae complex for enhanced results.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skincare Routine Block - Only for Skin Brightening Beauty Box (product 56) - Desktop only */}
            {(product.id === '56' || product.productNumber === '56') && (
              <div className="hidden lg:block bg-orange-50 border-2 border-orange-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-orange-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">Recommended Skincare Routine</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow O₂ Cleanser</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Start your routine by cleansing your face with Snow O₂. Apply to dry skin, wait for oxygen bubbles to form, then gently massage and rinse with lukewarm water.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow Booster Toner</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">After cleansing, apply the toner to moisturize and refine skin texture. It helps balance pH level and prepares your skin for the brightening treatment.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Multi Vita Radiance Serum</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Apply the serum to even skin tone and revive natural brightness. The MELAZERO® complex and multi vitamins work together to reduce dullness and reveal a brighter complexion.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Multi Vita Radiance Cream</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Finish with the cream to maintain and protect your brightened skin. It forms a moisturizing barrier and continues to even skin tone for a luminous glow.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">EPI Turnover Boosting Peeling Gel</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Use 1-2 times per week to remove dead skin cells and smooth texture. This gentle enzymatic peeling gel reveals brighter, smoother skin without irritation.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">6</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Soothing Bomb Sea Algae Mask</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Use 2-3 times per week to complement your routine. It provides intensive hydration and soothes skin while enhancing the brightening effects.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skincare Routine Block - Only for Charming Look Beauty Box (product 57) - Desktop only */}
            {(product.id === '57' || product.productNumber === '57') && (
              <div className="hidden lg:block bg-pink-50 border-2 border-pink-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-pink-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">Recommended Skincare & Makeup Routine</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow O₂ Cleanser</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Start your routine by cleansing your face with Snow O₂. Apply to dry skin, wait for oxygen bubbles to form, then gently massage and rinse with lukewarm water.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow Booster Toner</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">After cleansing, apply the toner to moisturize and refine skin texture. It helps balance pH level and prepares your skin for makeup application.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Skin Caring Blemish Balm Cushion</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Apply the BB cushion for natural coverage and skin protection. It covers redness and blemishes while providing SPF 50+ PA++++ protection for a flawless, radiant look.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Professional Biphasic Make Up Remover</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">At the end of the day, shake well and use the makeup remover to gently cleanse lip and eye makeup. The biphasic formula removes makeup without irritation while nourishing the delicate areas.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Skin Rescue Overnight Cream Mask</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Before bed, apply the overnight mask to revitalize and provide intensive care to fatigued skin. The oxygen capsules and pink ceramide complex work together to restore and protect your skin overnight.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skincare Routine Block - Only for Anti-Aging Beauty Box (product 58) - Desktop only */}
            {(product.id === '58' || product.productNumber === '58') && (
              <div className="hidden lg:block bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">Recommended Anti-Aging Routine</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow O₂ Cleanser</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Start your routine by cleansing your face with Snow O₂. Apply to dry skin, wait for oxygen bubbles to form, then gently massage and rinse with lukewarm water.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow Booster Toner</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">After cleansing, apply the toner to moisturize and refine skin texture. It helps balance pH level and prepares your skin for the anti-aging treatment.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Multi Functional Anti-Wrinkle Serum</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Apply the serum to visibly smooth wrinkles and reinforce skin firmness. The bakuchiol and anti-aging peptide complex work together to improve skin age index and reduce signs of aging.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Multifunctional Anti-Wrinkle Cream</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Finish with the cream to lock in the anti-aging benefits and provide ongoing protection. It continues to smooth wrinkles and enhance skin firmness throughout the day.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Collagen Mask</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Use 2-3 times per week to complement your routine. The collagen mask provides intensive hydration and supports skin elasticity for enhanced anti-aging results.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skincare Routine Block - Only for Deep Moisturizing Beauty Box (product 59) - Desktop only */}
            {(product.id === '59' || product.productNumber === '59') && (
              <div className="hidden lg:block bg-cyan-50 border-2 border-cyan-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-cyan-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">Recommended Deep Moisturizing Routine</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow O₂ Cleanser</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Start your routine by cleansing your face with Snow O₂. Apply to dry skin, wait for oxygen bubbles to form, then gently massage and rinse with lukewarm water.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow Booster Toner</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">After cleansing, apply the toner to moisturize and refine skin texture. It helps balance pH level and prepares your skin for deep hydration treatment.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Moisture Replenishing Hyaluron Serum</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Apply the serum to deeply replenish moisture and support the skin barrier. The hyaluronic acid complex delivers intensive hydration for plump, glowing skin.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Moisture Replenishing Hyaluron Cream</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Finish with the cream to lock in moisture and maintain hydration throughout the day. It forms a protective barrier and leaves your complexion soft, plump, and glowing.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Soothing Bomb Sea Algae Mask</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Use 2-3 times per week to complement your routine. It provides intensive hydration and soothes skin while enhancing the moisturizing effects for optimal results.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Details and Content */}
          <div className={`space-y-6 ${dir === 'rtl' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
            <ProductDetails product={product} />

            {/* Detailed Product Content */}
            <ProductContentDisplay product={product} />

            {/* Product Reviews */}
            <ProductReviews productId={product.id} />

            {/* Product Recommendation Section - Mobile only - After note block */}
            {/* Product Recommendation Section - Only for product 22 - Mobile only */}
            {(product.id === '22' || product.productNumber === '22') && (
              <div className="block lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="32"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 20 - Mobile only */}
            {(product.id === '20' || product.productNumber === '20') && (
              <div className="block lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="30"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 21 - Mobile only */}
            {(product.id === '21' || product.productNumber === '21') && (
              <div className="block lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="31"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 15 - Mobile only */}
            {(product.id === '15' || product.productNumber === '15') && (
              <div className="block lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="30"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 19 - Mobile only */}
            {(product.id === '19' || product.productNumber === '19') && (
              <div className="block lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="27"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 18 - Mobile only */}
            {(product.id === '18' || product.productNumber === '18') && (
              <div className="block lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="29"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 10 - Mobile only */}
            {(product.id === '10' || product.productNumber === '10') && (
              <div className="block lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="16"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 25 - Mobile only */}
            {(product.id === '25' || product.productNumber === '25') && (
              <div className="block lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="38"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 33 - Mobile only */}
            {(product.id === '33' || product.productNumber === '33') && (
              <div className="block lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="17"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 17 - Mobile only */}
            {(product.id === '17' || product.productNumber === '17') && (
              <div className="block lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="24"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 24 - Mobile only */}
            {(product.id === '24' || product.productNumber === '24') && (
              <div className="block lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="17"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 44 - Mobile only */}
            {(product.id === '44' || product.productNumber === '44') && (
              <div className="block lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 43 - Mobile only */}
            {(product.id === '43' || product.productNumber === '43') && (
              <div className="block lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="44"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 45 - Mobile only */}
            {(product.id === '45' || product.productNumber === '45') && (
              <div className="block lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="43"
                  currentProduct={product}
                />
              </div>
            )}

            {/* Product Recommendation Section - Only for product 46 - Mobile only */}
            {(product.id === '46' || product.productNumber === '46') && (
              <div className="block lg:hidden">
                <ProductRecommendation 
                  recommendedProductId="44"
                  currentProduct={product}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
