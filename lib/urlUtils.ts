/**
 * URL Utilities for SEO-friendly, keyword-rich URLs
 */

/**
 * Generate a clean, SEO-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[\s\W-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
}

/**
 * Generate a product URL slug with category and product name
 */
export function generateProductSlug(productName: string, category: string, productId: string): string {
  const categorySlug = generateSlug(category)
  const productSlug = generateSlug(productName)
  
  // Create a clean, keyword-rich URL
  return `${categorySlug}/${productSlug}-${productId}`
}

/**
 * Generate category URL slug
 */
export function generateCategorySlug(category: string): string {
  return generateSlug(category)
}

/**
 * Parse product slug to extract category, product name, and ID
 */
export function parseProductSlug(slug: string): { category: string; productName: string; productId: string } | null {
  const parts = slug.split('/')
  if (parts.length !== 2) return null
  
  const [categorySlug, productPart] = parts
  const productIdMatch = productPart?.match(/-([a-f0-9-]+)$/)
  
  if (!productIdMatch) return null
  
  const productId = productIdMatch[1] || ''
  const productName = productPart?.replace(`-${productId}`, '') || ''
  
  return {
    category: categorySlug || '',
    productName: productName.replace(/-/g, ' '),
    productId
  }
}

/**
 * SEO-friendly URL mappings for categories
 */
export const CATEGORY_URL_MAPPINGS: Record<string, string> = {
  'microneedling': 'microneedling-devices',
  'pro-solution': 'pro-solution-skincare',
  'cleanser': 'facial-cleansers',
  'peeling': 'exfoliating-peels',
  'toner-mist': 'toners-mists',
  'serum': 'facial-serums',
  'cream': 'moisturizing-creams',
  'mask': 'face-masks',
  'sun': 'sunscreen-protection',
  'cushion-bb': 'cushion-bb-cream',
  'scalp-hair': 'scalp-hair-care',
  'eye-care': 'eye-care-products',
  'device': 'skincare-devices'
}

/**
 * Get SEO-friendly category URL
 */
export function getCategoryUrl(category: string): string {
  const mapping = CATEGORY_URL_MAPPINGS[category.toLowerCase()]
  return mapping || generateCategorySlug(category)
}

/**
 * Generate optimized page URLs
 */
export const OPTIMIZED_URLS = {
  // Main pages
  home: '/',
  about: '/about-genosys-middle-east',
  brand: '/genosys-brand-story',
  products: '/korean-dermacosmetics-products',
  training: '/professional-skincare-training',
  contact: '/contact-genosys-uae',
  delivery: '/delivery-shipping-uae',
  
  // User pages
  login: '/login-account',
  profile: '/my-account',
  cart: '/shopping-cart',
  favorites: '/my-favorites',
  checkout: '/secure-checkout',
  success: '/order-success',
  
  // Special pages
  genosys: '/genosys-official',
  offline: '/offline-mode',
  
  // Document pages
  documents: '/professional-documents',
  
  // Admin (keep as is for security)
  admin: '/admin'
}

/**
 * Get optimized URL for a page
 */
export function getOptimizedUrl(page: keyof typeof OPTIMIZED_URLS): string {
  return OPTIMIZED_URLS[page]
}

/**
 * Generate product URL with full path
 */
export function getProductUrl(productName: string, category: string, productId: string): string {
  const categoryUrl = getCategoryUrl(category)
  const productSlug = generateProductSlug(productName, category, productId)
  return `/products/${categoryUrl}/${productSlug}`
}

/**
 * Generate category listing URL
 */
export function getCategoryListingUrl(category: string): string {
  const categorySlug = getCategoryUrl(category)
  return `/products/category/${categorySlug}`
}

/**
 * Validate if a URL slug is properly formatted
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && !slug.startsWith('-') && !slug.endsWith('-')
}

/**
 * Generate breadcrumb-friendly category names
 */
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'microneedling': 'Microneedling Devices',
  'pro-solution': 'PRO Solution Skincare',
  'cleanser': 'Facial Cleansers',
  'peeling': 'Exfoliating Peels',
  'toner-mist': 'Toners & Mists',
  'serum': 'Facial Serums',
  'cream': 'Moisturizing Creams',
  'mask': 'Face Masks',
  'sun': 'Sunscreen Protection',
  'cushion-bb': 'Cushion BB Cream',
  'scalp-hair': 'Scalp & Hair Care',
  'eye-care': 'Eye Care Products',
  'device': 'Skincare Devices'
}

/**
 * Get display name for category
 */
export function getCategoryDisplayName(category: string): string {
  return CATEGORY_DISPLAY_NAMES[category.toLowerCase()] || category
}
