import { Metadata } from 'next'
import { getAllProducts } from '@/lib/productsDb'
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

export default async function ArabicBundleBuilderPage() {
  const products = await getAllProducts()
  
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
