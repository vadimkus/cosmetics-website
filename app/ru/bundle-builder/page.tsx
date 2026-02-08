import { Metadata } from 'next'
import { getAllProducts } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
import BundleBuilderClient from '../../bundle-builder/BundleBuilderClient'

export const metadata: Metadata = {
  title: 'Создай свой набор | GENOSYS',
  description: 'Создайте персональный уход за кожей. Выберите продукты из каждой категории и сэкономьте до 20% со скидками на наборы.',
  openGraph: {
    title: 'Создай свой набор | GENOSYS',
    description: 'Создайте персональный уход за кожей и сэкономьте до 20%.',
    type: 'website',
    locale: 'ru_RU',
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/bundle-builder',
    languages: {
      'en': 'https://genosys.ae/bundle-builder',
      'ar': 'https://genosys.ae/ar/bundle-builder',
      'ru': 'https://genosys.ae/ru/bundle-builder',
    },
  },
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const maxDuration = 30

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
      errorLog(`[BundleBuilder/ru] getAllProducts attempt ${attempt}/${maxRetries} failed:`, error)
      if (attempt === maxRetries) throw error
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  throw new Error('Failed to fetch products')
}

export default async function RussianBundleBuilderPage() {
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
