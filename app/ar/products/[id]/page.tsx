import { notFound, permanentRedirect } from 'next/navigation'
import { Product } from '@/types'
import { ProductPageProps } from '@/types/common'
import ProductPageClientRefactored from '@/app/products/[id]/ProductPageClientRefactored'
import { getBespokePdpLayout, getRoutineProducts } from '@/components/product/bespokePdp'
import { getUnitsSold } from '@/lib/salesStats'
import type { Metadata } from 'next'
import { getProductByIdCached } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
import {
  getCanonicalProductSlug,
  getLocalizedProductDescription,
  getLocalizedProductName,
  getLocalizedProductPath,
  getLocalizedProductUrl,
  getProductAlternates,
  truncateText,
} from '@/lib/seo'

// ISR: cache for 5 min; admin routes must revalidateTag('products', 'max').
export const revalidate = 300

async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await getProductByIdCached(id)
    if (product) {
      if (product.noDiscount === undefined) {
        product.noDiscount = false
      }
    }
    return product
  } catch (error) {
    errorLog('Error fetching product:', error)
    return null
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    // Real HTTP 404 (see app/products/[id]/page.tsx for rationale)
    notFound()
  }

  // 301 legacy CUID URLs to the canonical numeric URL (real redirect status
  // is only possible before streaming starts)
  const canonicalSlug = getCanonicalProductSlug(product)
  if (id !== canonicalSlug) {
    permanentRedirect(getLocalizedProductPath(canonicalSlug, 'ar'))
  }

  const productName = getLocalizedProductName(product, 'ar')
  const productDescriptionText = getLocalizedProductDescription(product, 'ar')
  const productUrl = getLocalizedProductUrl(canonicalSlug, 'ar')
  
  // Enhanced product-specific meta tags in Arabic
  const productTitle = `${productName} | GENOSYS الإمارات`
  const productDescription = `${truncateText(productDescriptionText, 150)} مستحضرات تجميل كورية احترافية من GENOSYS. الموزع الرسمي في الإمارات. شحن مجاني للطلبات فوق 1000 درهم.`
  const productKeywords = [
    productName,
    `GENOSYS ${product.category}`,
    'مستحضرات التجميل الكورية الإمارات',
    'العناية بالبشرة الاحترافية دبي',
    `${product.category.toLowerCase()} الإمارات`,
    'GENOSYS الشرق الأوسط',
    'الجمال الكوري دبي',
    'التجميل الاحترافي الإمارات',
    'منتجات مستحضرات التجميل',
    'الموزع الرسمي GENOSYS'
  ]
  
  return {
    title: productTitle,
    description: productDescription,
    keywords: productKeywords,
    authors: [{ name: 'GENOSYS' }],
    creator: 'GENOSYS',
    publisher: 'GENOSYS',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: productTitle,
      description: productDescription,
      type: 'website',
      url: productUrl,
      siteName: 'GENOSYS',
      // og:image intentionally omitted — file-based opengraph-image.tsx
      // renders the branded localized 1200x630 product card instead.
      locale: 'ar_AE',
      countryName: 'United Arab Emirates',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@genosys_official',
      creator: '@genosys_official',
      title: productTitle,
      description: productDescription,
      // twitter:image comes from the file-based twitter-image.tsx card.
    },
    alternates: {
      canonical: productUrl,
      languages: getProductAlternates(canonicalSlug),
    },
    other: {
      // Retail AED price exposed for Shopping/social rich results (see EN page).
      'product:price:amount': String(product.price),
      'product:price:currency': 'AED',
      'product:availability': product.inStock ? 'in stock' : 'out of stock',
      'product:brand': 'GENOSYS',
      'product:category': product.category,
    },
  }
}

export default async function ArabicProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    notFound()
  }

  // The products listed below have bespoke editorial layouts, all fully
  // translated. Every other product keeps the shared PDP.
  // getUnitsSold is only called on that branch so the shared PDP keeps its
  // current query count.
  const BespokeLayout = getBespokePdpLayout(product, ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '24', '30', '33', '34', '35', '37', '38', '50', '51', '52', '53', '55', '56', '57', '58', '59', '60', '61', '63', '64', '65', '66'])
  if (BespokeLayout) {
    const [unitsSold, routineProducts] = await Promise.all([
      getUnitsSold(product.id),
      getRoutineProducts(product.productNumber || product.id),
    ])
    return (
      <BespokeLayout product={product} unitsSold={unitsSold} routineProducts={routineProducts} />
    )
  }

  return <ProductPageClientRefactored product={product} />
}

