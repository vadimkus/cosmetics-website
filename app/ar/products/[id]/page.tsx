import { notFound } from 'next/navigation'
import { Product } from '@/types'
import { ProductPageProps } from '@/types/common'
import ProductPageClientRefactored from '@/app/products/[id]/ProductPageClientRefactored'
import type { Metadata } from 'next'
import { getProductByIdCached } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
import { safeJsonParse } from '@/lib/utils'

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
    return {
      title: 'المنتج غير موجود - GENOSYS',
      description: 'المنتج المطلوب غير موجود.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const images = product.images ? safeJsonParse<string[]>(product.images, [product.image]) : [product.image]
  const displayImages = images.length > 0 ? images : [product.image]
  
  // Enhanced product-specific meta tags in Arabic
  const productTitle = `${product.name} - مستحضرات التجميل الكورية المهنية الإمارات | GENOSYS`
  const productDescription = `${product.description.substring(0, 150)}... مستحضرات التجميل الكورية المهنية من GENOSYS. الموزع الرسمي في الإمارات. شحن مجاني لأكثر من 1000 درهم.`
  const productKeywords = [
    product.name,
    `GENOSYS ${product.category}`,
    'مستحضرات التجميل الكورية الإمارات',
    'العناية بالبشرة المهنية دبي',
    `${product.category.toLowerCase()} الإمارات`,
    'GENOSYS الشرق الأوسط',
    'الجمال الكوري دبي',
    'الجمال المهني الإمارات',
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
      url: `https://genosys.ae/ar/products/${product.id}`,
      siteName: 'GENOSYS',
      images: displayImages.map((img: string) => ({
        url: `https://genosys.ae${img}`,
        width: 800,
        height: 800,
        alt: `${product.name} - مستحضرات التجميل الكورية المهنية`,
      })),
      locale: 'ar_AE',
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
        alt: `${product.name} - مستحضرات التجميل الكورية المهنية`,
      })),
    },
    alternates: {
      canonical: `https://genosys.ae/ar/products/${product.id}`,
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

export default async function ArabicProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    notFound()
  }

  return <ProductPageClientRefactored product={product} />
}

