import { Metadata } from 'next'
import { getAllProducts } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
import BundleBuilderClient from './BundleBuilderClient'

export const metadata: Metadata = {
  title: 'Build Your Skincare Set - Custom Bundle | GENOSYS UAE',
  description: 'Build a custom GENOSYS Korean skincare set in the UAE: pick a cleanser, serum, cream, mask and more, then save up to 20% with automatic bundle discounts. Free UAE delivery over 1000 AED.',
  keywords: [
    'custom skincare set UAE',
    'build your skincare routine',
    'Korean skincare bundle Dubai',
    'GENOSYS bundle discount',
    'personalized skincare UAE',
  ],
  openGraph: {
    title: 'Build Your Skincare Set - Custom Bundle | GENOSYS UAE',
    description: 'Pick products across categories and save up to 20% with automatic bundle discounts. Free UAE delivery over 1000 AED.',
    type: 'website',
    url: 'https://genosys.ae/bundle-builder',
    siteName: 'GENOSYS',
    locale: 'en_AE',
    images: [{ url: 'https://genosys.ae/images/genosys-products.jpg', width: 1200, height: 630, alt: 'GENOSYS custom skincare set' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    title: 'Build Your Skincare Set - Custom Bundle | GENOSYS UAE',
    description: 'Pick products across categories and save up to 20% with automatic bundle discounts.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/bundle-builder',
    languages: {
      'en': 'https://genosys.ae/bundle-builder',
      'ar': 'https://genosys.ae/ar/bundle-builder',
      'ru': 'https://genosys.ae/ru/bundle-builder',
      'x-default': 'https://genosys.ae/bundle-builder',
    },
  },
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const maxDuration = 30 // Allow time for DB cold start + retry

// Products excluded from bundle builder by name (none currently - SRS was
// re-admitted 2026-07-06; category-level exclusions below still apply)
const EXCLUDED_PRODUCTS: string[] = []

/**
 * Fetch products with retry logic for Neon Postgres cold starts.
 * Neon suspends the database after inactivity; the first connection
 * after suspension can take 3-8 seconds, exceeding the 5s pool timeout.
 * Retrying once with a short delay gives the DB time to wake up.
 */
async function getProductsWithRetry(maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await getAllProducts()
    } catch (error) {
      errorLog(`[BundleBuilder] getAllProducts attempt ${attempt}/${maxRetries} failed:`, error)
      if (attempt === maxRetries) throw error
      // Wait before retry - gives Neon time to wake up
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  // Unreachable, but TypeScript needs it
  throw new Error('Failed to fetch products')
}

export default async function BundleBuilderPage() {
  // Fetch all products for the bundle builder (with retry for cold DB)
  const products = await getProductsWithRetry()
  
  // Filter out ineligible products from the builder:
  // - Beauty Boxes (they are bundles themselves)
  // - Hidden products
  // - Out of stock products
  // - Professional products (price on request)
  // - PRO Solution category (professional use only)
  // - Specifically excluded products
  const eligibleProducts = products.filter(product => 
    product.category !== 'Beauty Boxes' && 
    product.category !== 'PRO Solution' &&
    !product.isHidden &&
    !product.isPriceOnRequest &&
    product.inStock &&
    !EXCLUDED_PRODUCTS.some(name => product.name.toUpperCase().includes(name.toUpperCase()))
  )
  
  return <BundleBuilderClient products={eligibleProducts} />
}
