import { Metadata } from 'next'
import { getAllProducts } from '@/lib/productsDb'
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

// Products excluded from bundle builder (professional products, kits, etc.)
const EXCLUDED_PRODUCTS = [
  'SKIN RENEWAL PEELING SYSTEM',
]

export default async function BundleBuilderPage() {
  // Fetch all products for the bundle builder
  const products = await getAllProducts()
  
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
