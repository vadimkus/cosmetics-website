import { notFound, permanentRedirect } from 'next/navigation'
import { Product } from '@/types'
import { ProductPageProps } from '@/types/common'
import ProductPageClientRefactored from './ProductPageClientPhaseA'
import { getBespokePdpLayout, getRoutineProducts } from '@/components/product/bespokePdp'
import PdpLocaleBar from '@/components/product/PdpLocaleBar'
import type { Metadata } from 'next'
import { getProductByIdCached } from '@/lib/productsDb'
import { getUnitsSold } from '@/lib/salesStats'
import { errorLog, debugLog } from '@/lib/logger'
import {
  getCanonicalProductSlug,
  getLocalizedProductDescription,
  getLocalizedProductName,
  getLocalizedProductPath,
  getLocalizedProductUrl,
  getProductAlternates,
  truncateText,
} from '@/lib/seo'

// ISR: serve cached HTML for up to 5 minutes; admin mutations in
// app/api/admin/products call revalidateTag('products', 'max') for instant
// invalidation. See lib/productsDb.ts -> getProductByIdCached.
export const revalidate = 300

async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await getProductByIdCached(id)
    if (product) {
      if (product.noDiscount === undefined) {
        product.noDiscount = false
      }
    } else {
      debugLog(`Product not found for ID: ${id}`)
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
    // notFound() here (before the response starts streaming) produces a real
    // HTTP 404. Calling it only in the page body yields a streamed 200 +
    // noindex meta (soft 404) because loading.tsx starts the stream first.
    notFound()
  }

  // 301 legacy CUID URLs to the canonical numeric URL (must happen here,
  // before streaming starts, to emit a real HTTP redirect status)
  const canonicalSlug = getCanonicalProductSlug(product)
  if (id !== canonicalSlug) {
    permanentRedirect(getLocalizedProductPath(canonicalSlug, 'en'))
  }

  const productName = getLocalizedProductName(product, 'en')
  const productDescriptionText = getLocalizedProductDescription(product, 'en')
  const productUrl = getLocalizedProductUrl(canonicalSlug, 'en')
  
  // Keep the title under ~60 chars so Google doesn't truncate/rewrite it.
  // The product name is the primary keyword; the suffix stays short (brand +
  // market). Long descriptive terms live in the H1/description instead.
  const productTitle = `${productName} | GENOSYS UAE`
  const productDescription = `${truncateText(productDescriptionText, 150)} Professional Korean dermacosmetics by GENOSYS. Official distributor in UAE. Free shipping over 1000 AED.`
  const productKeywords = [
    productName,
    `GENOSYS ${product.category}`,
    'Korean dermacosmetics UAE',
    'professional skincare Dubai',
    `${product.category.toLowerCase()} UAE`,
    'GENOSYS Middle East',
    'Korean beauty Dubai',
    'professional beauty UAE',
    'dermacosmetics products',
    'GENOSYS official distributor'
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
      // 'product' OG type + product:price (below) - prices are now exposed for
      // Shopping/social rich results (decision 2026-07-07).
      type: 'website',
      url: productUrl,
      siteName: 'GENOSYS',
      // og:image intentionally omitted - the file-based opengraph-image.tsx
      // (branded 1200x630 product card) is used instead of raw 800x800 photos,
      // which crop badly in link previews.
      locale: 'en_AE',
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
      // Retail AED price exposed for Shopping/social rich results.
      'product:price:amount': String(product.price),
      'product:price:currency': 'AED',
      'product:availability': product.inStock ? 'in stock' : 'out of stock',
      'product:brand': 'GENOSYS',
      'product:category': product.category,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    notFound()
  }

  const unitsSold = await getUnitsSold(product.id)

  // The products listed below have bespoke editorial layouts. Every other
  // product keeps the shared PDP.
  const BespokeLayout = getBespokePdpLayout(product, ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '25', '28', '24', '27', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '55', '56', '57', '58', '59', '62', '60', '61', '63', '64', '65', '66'])
  if (BespokeLayout) {
    return (
      <>
        {/* Bespoke layouts open on artwork rather than a header, and all three
            site headers hide on this route, so phones get no back button and no
            language control without this. Desktop keeps the site header. */}
        <PdpLocaleBar />
        <BespokeLayout
          product={product}
          unitsSold={unitsSold}
          routineProducts={await getRoutineProducts(product.productNumber || product.id)}
        />
      </>
    )
  }

  return <ProductPageClientRefactored product={product} unitsSold={unitsSold} />
}
