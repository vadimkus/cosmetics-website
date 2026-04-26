/**
 * CENTRALIZED PRICING ENGINE FOR DATABASE-DRIVEN MOBILE APP
 * ========================================================
 * 
 * This engine calculates complete pricing data that the mobile app expects:
 * ✅ Base prices with variants (size/color)
 * ✅ User-specific discounts (Black Friday, customer discounts)
 * ✅ VAT calculation (5% UAE VAT)
 * ✅ Dynamic badges generation
 * ✅ Beauty Box bundle pricing
 * ✅ Complete calculated data for API responses
 */

import { Product } from '@/types'
import { User, ApiUser } from '@/types/user'
import { getProductConfig, getProductSizes, getProductColors, getProductImages, getProductVideoUrl, getProductDocumentation } from '@/data/productConfig'
import { calculateDiscountedPrice } from '@/lib/discountUtils'
import { debugLog } from '@/lib/logger'

/**
 * Resolves the correct key for productConfig lookups.
 * DB products use CUID as `id`, but productConfig keys are product numbers (e.g. '25').
 * This helper returns productNumber when available, falling back to id.
 */
function resolveConfigKey(product: { id: string; productNumber?: string | null }): string {
  return product.productNumber || product.id
}

// UAE VAT rate (5%)
export const UAE_VAT_RATE = 0.05

// Badge priorities (lower number = higher priority)
export enum BadgePriority {
  SALE = 1,
  BLACK_FRIDAY = 2,
  NEW = 3,
  BEST_SELLER = 4,
  PROFESSIONAL = 5,
  LIMITED_EDITION = 6
}

export interface CalculatedPrice {
  basePrice: number           // Original product price
  displayPrice: number        // Final price after all calculations
  originalPrice: number | undefined      // Original price (if different from displayPrice)
  vatAmount: number          // 5% UAE VAT amount
  priceIncludingVat: number  // Final price including VAT
  discountAmount: number | undefined    // Total discount amount
  discountPercentage: number | undefined // Discount percentage
  discountLabel: string | undefined     // Server-generated discount label
  hasDiscount: boolean       // Whether any discount is applied
  isBlackFriday: boolean | undefined    // Black Friday sale indicator
  isBeautyBox: boolean | undefined      // Beauty Box bundle indicator
}

export interface ProductVariant {
  size?: string
  color?: string
  price: number
  isDefault: boolean
  available: boolean
}

export interface ProductBadge {
  text: string
  color: string
  priority: number
  type: 'sale' | 'new' | 'best_seller' | 'professional' | 'limited_edition' | 'discount'
}

export interface EnhancedProductData {
  // Basic product data
  id: string
  name: string
  description: string
  image: string
  images?: string | null          // Additional product images (JSON array)
  videoUrl?: string | null        // Video URL (e.g., /videos/egf.mp4) – dynamic, no app update needed
  category: string
  stock: boolean
  rating: number
  
  // Enhanced pricing data
  price: number                    // Base price
  displayPrice: number            // Final calculated price
  originalPrice: number | undefined          // Original price (if different from displayPrice)
  priceIncludingVat: number      // Price with 5% UAE VAT
  vatAmount: number              // VAT amount
  discountLabel: string | undefined         // "15% off", "Black Friday 20% off"
  
  // Variants with calculated pricing
  variants: ProductVariant[]     // Size variants with pricing
  colorVariants: Array<{         // Color variants
    value: string
    label: string
    hex?: string
  }>
  
  // Dynamic badges
  badges: ProductBadge[]
  
  // Additional mobile-friendly data
  hasVariants: boolean
  isNewProduct: boolean
  isBestSeller: boolean
  
  // Product Specifications (for mobile app detail pages)
  size?: string | null            // Product size (e.g., "50ml", "100g")
  skinType?: string | null        // Skin type suitability (dry, oily, combination, etc.)
  formulation?: string | null     // Product formulation type
  keyBenefits?: string | null     // Key benefits (JSON array)
  origin?: string | null          // Country of origin
  
  // Detailed product content
  productDetails?: string | null  // JSON object with key-value pairs for product specs
  keyFeatures?: string | null     // JSON array of features with title and description
  benefits?: string | null        // JSON array of benefits
  ingredients?: string | null     // JSON array of ingredients with name and description
  howToUse?: string | null        // Step-by-step usage instructions
  directions?: string | null      // Detailed directions for use
  
  // Skin recommendation fields
  targetConcerns?: string | null  // JSON array of concerns like ["anti-aging", "acne", "hydration"]
  usage?: string | null           // morning, evening, all-day, morning-evening
  ageGroup?: string | null        // teen, young-adult, adult, mature
  
  // Product documentation (PDF guides, etc.)
  documentation?: Array<{ title: string; url: string; type: string }> | null
}

/**
 * Derive formulation type from product category or description
 */
function deriveFormulation(product: Product): string | null {
  const category = product.category.toLowerCase()
  const description = product.description.toLowerCase()
  
  // Determine formulation based on category and keywords
  if (category.includes('serum') || description.includes('serum')) return 'Serum'
  if (category.includes('cream') || description.includes('cream')) return 'Cream'
  if (category.includes('cleanser') || description.includes('cleanser')) return 'Cleanser'
  if (category.includes('toner') || description.includes('toner')) return 'Toner'
  if (category.includes('mask') || description.includes('mask')) return 'Mask'
  if (category.includes('gel') || description.includes('gel')) return 'Gel'
  if (category.includes('oil') || description.includes('oil')) return 'Oil'
  if (category.includes('mist') || description.includes('mist')) return 'Mist'
  if (category.includes('peeling') || description.includes('peeling')) return 'Peeling Gel'
  if (category.includes('cushion') || description.includes('cushion')) return 'Cushion'
  if (category.includes('sun') || description.includes('sunscreen') || description.includes('spf')) return 'Sunscreen'
  
  return null
}

/**
 * Derive product origin from description or default to South Korea
 */
function deriveOrigin(product: Product): string {
  const description = product.description.toLowerCase()
  
  // Check for explicit origin mentions
  if (description.includes('manufactured in south korea') || 
      description.includes('made in korea') ||
      description.includes('korean')) {
    return 'South Korea'
  }
  
  if (description.includes('manufactured in uae') || description.includes('made in uae')) {
    return 'UAE'
  }
  
  // Default to South Korea for GENOSYS products (K-beauty brand)
  return 'South Korea'
}

/**
 * Calculates complete pricing for a product including VAT and discounts.
 * Handles size/color variants and applies user-specific discounts (Black Friday, customer discounts).
 * 
 * @param product - The product to calculate pricing for
 * @param user - Optional user for personalized discounts (null for guest pricing)
 * @param selectedSize - Optional size variant (e.g., "50ml", "100ml")
 * @param selectedColor - Optional color variant
 * @returns Complete pricing data including VAT, discounts, and display prices
 * 
 * @example
 * ```ts
 * const pricing = calculateProductPricing(product, user, "100ml")
 * console.log(pricing.displayPrice) // Final price after discounts
 * console.log(pricing.priceIncludingVat) // Price with 5% UAE VAT
 * ```
 */
export function calculateProductPricing(
  product: Product,
  user: ApiUser | User | null = null,
  selectedSize?: string,
  selectedColor?: string
): CalculatedPrice {
  debugLog('🧮 Calculating pricing for product:', { productId: product.id, userId: user?.id, selectedSize, selectedColor })
  
  // Get base price (considering variants)
  let basePrice = product.price
  
  // Apply size variant pricing if selected
  if (selectedSize) {
    const config = getProductConfig(resolveConfigKey(product))
    if (config?.pricing?.sizeVariants?.[selectedSize]) {
      basePrice = config.pricing.sizeVariants[selectedSize]
    }
  }
  
  // Apply color variant pricing if needed (future expansion)
  if (selectedColor) {
    // Color variants typically don't affect price but can in the future
    const config = getProductConfig(resolveConfigKey(product))
    if (config?.pricing?.colorVariants?.[selectedColor]) {
      basePrice = config.pricing.colorVariants[selectedColor]
    }
  }
  
  // Calculate discounts using existing discount engine
  const discountedPrice = calculateDiscountedPrice(product, user)
  
  // Apply variant pricing to discount calculations if needed
  let finalDiscountedPrice = discountedPrice.discountedPrice
  if ((selectedSize || selectedColor) && discountedPrice.hasDiscount) {
    // Recalculate discount on variant price
    const discountAmount = basePrice * (discountedPrice.discountPercentage / 100)
    finalDiscountedPrice = basePrice - discountAmount
  }
  
  // Calculate VAT (5% UAE VAT)
  const vatAmount = finalDiscountedPrice * UAE_VAT_RATE
  const priceIncludingVat = finalDiscountedPrice + vatAmount
  
  // Generate discount label
  let discountLabel: string | undefined
  if (discountedPrice.hasDiscount) {
    if (discountedPrice.isBlackFriday) {
      discountLabel = `Black Friday ${discountedPrice.discountPercentage}% off`
    } else if (discountedPrice.isBeautyBox) {
      discountLabel = `Bundle ${discountedPrice.discountPercentage}% off`
    } else {
      discountLabel = `${discountedPrice.discountPercentage}% off`
    }
  }
  
  const result: CalculatedPrice = {
    basePrice,
    displayPrice: Math.round(finalDiscountedPrice * 100) / 100,
    originalPrice: discountedPrice.hasDiscount
      ? ((selectedSize || selectedColor) ? basePrice : discountedPrice.originalPrice)
      : undefined,
    vatAmount: Math.round(vatAmount * 100) / 100,
    priceIncludingVat: Math.round(priceIncludingVat * 100) / 100,
    discountAmount: discountedPrice.discountAmount,
    discountPercentage: discountedPrice.discountPercentage,
    discountLabel,
    hasDiscount: discountedPrice.hasDiscount,
    isBlackFriday: discountedPrice.isBlackFriday,
    isBeautyBox: discountedPrice.isBeautyBox
  }
  
  debugLog('✅ Pricing calculation complete:', result)
  return result
}

/**
 * Generates dynamic badges for a product based on its properties and pricing.
 * Badges are sorted by priority (sale > Black Friday > new > best seller > professional).
 * 
 * @param product - The product to generate badges for
 * @param _user - Optional user (reserved for future personalized badges)
 * @param pricingData - Optional pre-calculated pricing data
 * @returns Array of badges sorted by priority
 * 
 * @example
 * ```ts
 * const badges = generateProductBadges(product, user, pricingData)
 * // Returns: [{ text: "20% OFF", color: "red", priority: 1, type: "sale" }]
 * ```
 */
export function generateProductBadges(
  product: Product,
  _user: ApiUser | User | null = null,
  pricingData?: CalculatedPrice
): ProductBadge[] {
  const badges: ProductBadge[] = []
  
  // Discount badges (highest priority)
  if (pricingData?.hasDiscount) {
    if (pricingData.isBlackFriday) {
      badges.push({
        text: 'BLACK FRIDAY',
        color: '#DC2626', // red-600
        priority: BadgePriority.BLACK_FRIDAY,
        type: 'sale'
      })
    } else if (pricingData.isBeautyBox) {
      badges.push({
        text: 'BUNDLE OFFER',
        color: '#7C3AED', // purple-600
        priority: BadgePriority.SALE,
        type: 'sale'
      })
    } else if (pricingData.discountPercentage && pricingData.discountPercentage > 0) {
      badges.push({
        text: `${pricingData.discountPercentage}% OFF`,
        color: '#DC2626', // red-600
        priority: BadgePriority.SALE,
        type: 'discount'
      })
    }
  }
  
  // Use productNumber for badge ID matching (DB id is CUID, badge lists use product numbers)
  const badgeKey = resolveConfigKey(product)
  
  // Professional products badge
  if (product.category.toLowerCase().includes('professional') || 
      ['47', '48', '49', '50', '51'].includes(badgeKey)) {
    badges.push({
      text: 'PROFESSIONAL',
      color: '#7C3AED', // purple-600
      priority: BadgePriority.PROFESSIONAL,
      type: 'professional'
    })
  }
  
  // Best seller badge (based on product performance or manual flagging)
  const bestSellerIds = ['1', '10', '18', '21', '29', '31', '41'] // Top selling products
  if (bestSellerIds.includes(badgeKey)) {
    badges.push({
      text: 'BEST SELLER',
      color: '#059669', // green-600
      priority: BadgePriority.BEST_SELLER,
      type: 'best_seller'
    })
  }
  
  // New product badge (products created in last 30 days or manually flagged)
  const newProductIds = ['52', '63', 'cmgj9ifoi00008o07p4eqmfb7'] // Recently added
  if (newProductIds.includes(badgeKey) || newProductIds.includes(product.id)) {
    badges.push({
      text: 'NEW',
      color: '#059669', // green-600
      priority: BadgePriority.NEW,
      type: 'new'
    })
  }
  
  // Limited edition badge
  const limitedEditionIds = ['38', '47', '48'] // Special/limited products
  if (limitedEditionIds.includes(badgeKey)) {
    badges.push({
      text: 'LIMITED EDITION',
      color: '#DC2626', // red-600
      priority: BadgePriority.LIMITED_EDITION,
      type: 'limited_edition'
    })
  }
  
  // Sort badges by priority (lower number = higher priority)
  badges.sort((a, b) => a.priority - b.priority)
  
  // Return only top 2 badges to avoid clutter
  return badges.slice(0, 2)
}

/**
 * Generates product variants (size/color options) with calculated pricing.
 * Prioritizes database variants over config file variants for flexibility.
 * 
 * @param product - The product to generate variants for
 * @param user - Optional user for personalized pricing
 * @returns Array of variants with pricing and availability
 * 
 * @example
 * ```ts
 * const variants = generateProductVariants(product, user)
 * // Returns: [
 * //   { size: "50ml", price: 250, isDefault: true, available: true },
 * //   { size: "100ml", price: 450, isDefault: false, available: true }
 * // ]
 * ```
 */
export function generateProductVariants(
  product: Product,
  user: ApiUser | User | null = null
): ProductVariant[] {
  const variants: ProductVariant[] = []
  
  // PRIORITY 1: Use database variants if available
  // IMPORTANT: ignore DB variants that have no size/color.
  // Those "default" records should not affect pricing or trigger UI selectors.
  const realDbVariants = product.variants?.filter(v => v.size || v.color) || []

  if (realDbVariants.length > 0) {
    realDbVariants.forEach((dbVariant) => {
      // IMPORTANT:
      // When database variants exist, dbVariant.price must be the source of truth.
      // Do NOT pass selectedSize/selectedColor to calculateProductPricing here,
      // otherwise it may override dbVariant.price using PRODUCT_CONFIG mappings.
      const pricing = calculateProductPricing(
        { ...product, price: dbVariant.price },
        user
      )
      
      variants.push({
        ...(dbVariant.size && { size: dbVariant.size }),
        ...(dbVariant.color && { color: dbVariant.color }),
        price: pricing.displayPrice,
        isDefault: dbVariant.isDefault,
        available: dbVariant.available && product.inStock
      })
    })
    
    return variants
  }
  
  // FALLBACK: Use config file variants (for backward compatibility)
  const sizes = getProductSizes(resolveConfigKey(product))
  
  if (sizes.length === 0) {
    // No size variants, return default variant
    const pricing = calculateProductPricing(product, user)
    variants.push({
      size: 'default',
      price: pricing.displayPrice,
      isDefault: true,
      available: product.inStock
    })
  } else {
    // Generate variants for each size
    sizes.forEach((size, index) => {
      const pricing = calculateProductPricing(product, user, size.value)
      variants.push({
        size: size.value,
        price: pricing.displayPrice,
        isDefault: index === 0, // First size is default
        available: size.available && product.inStock
      })
    })
  }
  
  return variants
}

/**
 * Generates enhanced product data for mobile app consumption.
 * Combines pricing, variants, badges, and product specifications into a single object.
 * 
 * @param product - The product to enhance
 * @param user - Optional user for personalized pricing and badges
 * @returns Enhanced product data ready for API response
 * 
 * @example
 * ```ts
 * const enhanced = generateEnhancedProductData(product, user)
 * // Use in API response for mobile app
 * res.json(enhanced)
 * ```
 */
export function generateEnhancedProductData(
  product: Product,
  user: ApiUser | User | null = null
): EnhancedProductData {
  debugLog('🚀 Generating enhanced product data:', { productId: product.id, userId: user?.id })
  
  // Use productNumber for config lookups (DB id is CUID, config keys are product numbers)
  const configKey = resolveConfigKey(product)
  
  // Calculate pricing for base product.
  // If DB variants exist, use the DEFAULT DB variant as the product-level price source,
  // so list views and detail headers reflect the same pricing as the default selection.
  // IMPORTANT: only treat variants with size/color as "real" variants for pricing source.
  const realDbVariants = product.variants?.filter(v => v.size || v.color) || []
  const defaultDbVariant = realDbVariants.find(v => v.isDefault) || realDbVariants[0]
  const pricingSourceProduct = defaultDbVariant
    ? ({ ...product, price: defaultDbVariant.price } as Product)
    : product

  const pricingData = calculateProductPricing(pricingSourceProduct, user)
  
  // Generate variants with pricing
  const variants = generateProductVariants(product, user)
  
  // Get color variants (use configKey so DB products with CUID ids can match productConfig)
  const colors = getProductColors(configKey)
  const colorVariants = colors.map(color => {
    let hex: string | undefined
    if (color.value === 'Beige') hex = '#E6D5B8'
    else if (color.value === 'Ivory') hex = '#F5E6D3'
    else if (color.value === 'Camel') hex = '#A67C52'
    
    return {
      value: color.value,
      label: color.label,
      ...(hex && { hex })
    }
  })
  
  // Generate dynamic badges
  const badges = generateProductBadges(product, user, pricingData)
  
  // Determine if product is new or best seller
  const isNewProduct = badges.some(badge => badge.type === 'new')
  const isBestSeller = badges.some(badge => badge.type === 'best_seller')
  
  // Merge images: prioritize productConfig images (like the website does),
  // then fall back to DB product.images (combined with main image), then just the main image.
  // IMPORTANT: productConfig images already include the main image as the first element.
  // DB product.images only contains gallery images (not the main image), so we must
  // prepend product.image to match the web's ProductImageGallery behavior.
  const configImages = getProductImages(configKey)
  let mergedImages: string | null = null
  if (configImages.length > 0) {
    mergedImages = JSON.stringify(configImages)
  } else if (product.images) {
    // DB images are gallery-only — combine main image + gallery, avoiding duplicates
    try {
      const galleryImages = JSON.parse(product.images)
      if (Array.isArray(galleryImages) && galleryImages.length > 0) {
        const mainImage = product.image
        const combined = [mainImage, ...galleryImages.filter((img: string) => img !== mainImage)]
        mergedImages = JSON.stringify(combined)
      } else {
        mergedImages = product.images
      }
    } catch {
      // If parsing fails, pass through as-is
      mergedImages = product.images
    }
  }

  // Merge videoUrl: prioritize productConfig, fall back to DB
  const configVideoUrl = getProductVideoUrl(configKey)
  const mergedVideoUrl = configVideoUrl || product.videoUrl || null

  // Get product documentation (PDF guides) from productConfig
  const docs = getProductDocumentation(configKey)
  const documentation = docs.length > 0 ? docs : null

  const enhancedData: EnhancedProductData = {
    id: product.id,
    name: product.name,
    description: product.description,
    image: product.image,
    images: mergedImages,
    videoUrl: mergedVideoUrl,
    category: product.category,
    stock: product.inStock,
    rating: product.rating || 5.0,
    
    // Enhanced pricing
    price: pricingData.basePrice,
    displayPrice: pricingData.displayPrice,
    originalPrice: pricingData.originalPrice,
    priceIncludingVat: pricingData.priceIncludingVat,
    vatAmount: pricingData.vatAmount,
    discountLabel: pricingData.discountLabel,
    
    // Variants
    // Only include real variants (size/color).
    // Exclude generated 'default' and exclude size-less DB variants.
    variants: variants.filter(v =>
      v.color || (v.size && v.size !== 'default')
    ),
    colorVariants,
    
    // Dynamic badges
    badges,
    
    // Additional data
    hasVariants: variants.length > 1 || colorVariants.length > 0,
    isNewProduct,
    isBestSeller,
    
    // Product Specifications (for mobile app detail pages)
    size: product.size ?? null,
    skinType: product.skinType ?? null,
    formulation: deriveFormulation(product),
    keyBenefits: product.benefits || product.keyFeatures || null, // Use benefits or keyFeatures
    origin: deriveOrigin(product),
    
    // Detailed product content
    productDetails: product.productDetails ?? null,
    keyFeatures: product.keyFeatures ?? null,
    benefits: product.benefits ?? null,
    ingredients: product.ingredients ?? null,
    howToUse: product.howToUse ?? null,
    directions: product.directions ?? null,
    
    // Skin recommendation fields
    targetConcerns: product.targetConcerns ?? null,
    usage: product.usage ?? null,
    ageGroup: product.ageGroup ?? null,
    
    // Product documentation (PDF guides)
    documentation
  }
  
  debugLog('✅ Enhanced product data generated:', { 
    productId: product.id, 
    hasVariants: enhancedData.hasVariants,
    badgeCount: badges.length,
    displayPrice: enhancedData.displayPrice,
    discountLabel: enhancedData.discountLabel
  })
  
  return enhancedData
}

/**
 * Batch generates enhanced data for multiple products.
 * Optimized for product listing API responses.
 * 
 * @param products - Array of products to enhance
 * @param user - Optional user for personalized pricing
 * @returns Array of enhanced product data
 * 
 * @example
 * ```ts
 * const enhanced = generateBatchEnhancedProductData(products, user)
 * res.json({ products: enhanced })
 * ```
 */
export function generateBatchEnhancedProductData(
  products: Product[],
  user: ApiUser | User | null = null
): EnhancedProductData[] {
  debugLog('📦 Batch generating enhanced product data:', { productCount: products.length, userId: user?.id })
  
  const startTime = Date.now()
  const enhancedProducts = products.map(product => generateEnhancedProductData(product, user))
  const endTime = Date.now()
  
  debugLog(`✅ Batch processing complete: ${products.length} products in ${endTime - startTime}ms`)
  
  return enhancedProducts
}
