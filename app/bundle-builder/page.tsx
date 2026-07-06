import { Metadata } from 'next'
import { getAllProducts } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
import BundleBuilderClient from './BundleBuilderClient'

export const metadata: Metadata = {
  title: 'Build Your Skincare Set | GENOSYS',
  description: 'Create your personalized skincare routine. Select products from each category and save up to 20% with bundle discounts.',
  openGraph: {
    title: 'Build Your Skincare Set | GENOSYS',
    description: 'Create your personalized skincare routine and save up to 20%.',
    type: 'website',
  },
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const maxDuration = 30 // Allow time for DB cold start + retry

// Products excluded from bundle builder by name (none currently — SRS was
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
      // Wait before retry — gives Neon time to wake up
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
