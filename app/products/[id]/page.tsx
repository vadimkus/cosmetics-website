import { notFound } from 'next/navigation'
import { Product } from '@/types'
import { ProductPageProps } from '@/types/common'
import ProductPageClientRefactored from './ProductPageClientRefactored'
import type { Metadata } from 'next'
import { getProductById } from '@/lib/productsDb'
import { errorLog, debugLog } from '@/lib/logger'
import { safeJsonParse } from '@/lib/utils'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'
// Disable caching for this route to prevent stale 404s
export const revalidate = 0

// Direct product fetch with error logging
async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await getProductById(id)
    if (product) {
      // Ensure noDiscount is explicitly set to prevent serialization issues
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
    return {
      title: 'Product Not Found - GENOSYS Middle East FZ-LLC',
      description: 'The requested product could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const images = product.images ? safeJsonParse<string[]>(product.images, [product.image]) : [product.image]
  const displayImages = images.length > 0 ? images : [product.image]
  
  // Enhanced product-specific meta tags
  const productTitle = `${product.name} - Professional Korean Dermacosmetics UAE | GENOSYS Middle East FZ-LLC`
  const productDescription = `${product.description.substring(0, 150)}... Professional Korean dermacosmetics by GENOSYS. Official distributor in UAE. Free shipping over 1000 AED.`
  const productKeywords = [
    product.name,
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
    authors: [{ name: 'GENOSYS Middle East FZ-LLC' }],
    creator: 'GENOSYS Middle East FZ-LLC',
    publisher: 'GENOSYS Middle East FZ-LLC',
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
      url: `https://genosys.ae/products/${product.id}`,
      siteName: 'GENOSYS Middle East FZ-LLC',
      images: displayImages.map((img: string) => ({
        url: `https://genosys.ae${img}`,
        width: 800,
        height: 800,
        alt: `${product.name} - Professional Korean Dermacosmetics`,
      })),
      locale: 'en_AE',
      countryName: 'United Arab Emirates',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@genosys_official',
      creator: '@genosys_official',
      title: productTitle,
      description: productDescription,
      images: displayImages.map((img: string) => ({
        url: `https://genosys.ae${img}`,
        alt: `${product.name} - Professional Korean Dermacosmetics`,
      })),
    },
    alternates: {
      canonical: `https://genosys.ae/products/${product.id}`,
      languages: {
        'en': `https://genosys.ae/products/${product.id}`,
        'ar': `https://genosys.ae/ar/products/${product.id}`,
        'ru': `https://genosys.ae/ru/products/${product.id}`,
      },
    },
    other: {
      'product:price:amount': product.price.toString(),
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

  return <ProductPageClientRefactored product={product} />
}
