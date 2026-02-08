import { Metadata } from 'next'
import { getAllProducts } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
import BundleBuilderClient from '../../bundle-builder/BundleBuilderClient'

export const metadata: Metadata = {
  title: 'أنشئ مجموعتك | GENOSYS',
  description: 'أنشئ روتينك الخاص للعناية بالبشرة. اختر المنتجات من كل فئة ووفر حتى 20% مع خصومات المجموعة.',
  openGraph: {
    title: 'أنشئ مجموعتك | GENOSYS',
    description: 'أنشئ روتينك الخاص للعناية بالبشرة ووفر حتى 20%.',
    type: 'website',
    locale: 'ar_AE',
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/bundle-builder',
    languages: {
      'en': 'https://genosys.ae/bundle-builder',
      'ar': 'https://genosys.ae/ar/bundle-builder',
      'ru': 'https://genosys.ae/ru/bundle-builder',
    },
  },
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Products excluded from bundle builder (professional products, kits, etc.)
const EXCLUDED_PRODUCTS = [
  'SKIN RENEWAL PEELING SYSTEM',
]

/** Retry wrapper for Neon Postgres cold starts */
async function getProductsWithRetry(maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await getAllProducts()
    } catch (error) {
      errorLog(`[BundleBuilder/ar] getAllProducts attempt ${attempt}/${maxRetries} failed:`, error)
      if (attempt === maxRetries) throw error
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  throw new Error('Failed to fetch products')
}

export default async function ArabicBundleBuilderPage() {
  const products = await getProductsWithRetry()
  
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
