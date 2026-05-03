import { notFound } from 'next/navigation'
import { Product } from '@/types'
import { ProductPageProps } from '@/types/common'
import ProductPageClientRefactored from '@/app/products/[id]/ProductPageClientRefactored'
import type { Metadata } from 'next'
import { getProductByIdCached } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
import ProductSchema from '@/components/schema/ProductSchema'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import {
  getLocalizedProductDescription,
  getLocalizedProductName,
  getLocalizedProductUrl,
  getProductAlternates,
  getProductImageUrls,
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
    return {
      title: 'Продукт не найден - GENOSYS',
      description: 'Запрашиваемый продукт не найден.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const productName = getLocalizedProductName(product, 'ru')
  const productDescriptionText = getLocalizedProductDescription(product, 'ru')
  const productImages = getProductImageUrls(product)
  const productUrl = getLocalizedProductUrl(product.id, 'ru')
  
  const productTitle = `${productName} - Профессиональная корейская дерматокосметика ОАЭ | GENOSYS`
  const productDescription = `${truncateText(productDescriptionText, 150)} Профессиональная корейская дерматокосметика от GENOSYS. Официальный дистрибьютор в ОАЭ. Бесплатная доставка от 1000 AED.`
  const productKeywords = [
    productName,
    `GENOSYS ${product.category}`,
    'Корейская дерматокосметика ОАЭ',
    'Профессиональный уход за кожей Дубай',
    `${product.category.toLowerCase()} ОАЭ`,
    'GENOSYS Ближний Восток',
    'Корейская красота Дубай',
    'Профессиональная красота ОАЭ',
    'Продукты косметики',
    'Официальный дистрибьютор GENOSYS'
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
      images: productImages.map((img: string) => ({
        url: img,
        width: 800,
        height: 800,
        alt: `${productName} - Профессиональная корейская дерматокосметика`,
      })),
      locale: 'ru_AE',
      countryName: 'United Arab Emirates',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@genosys_official',
      creator: '@genosys_official',
      title: productTitle,
      description: productDescription,
      images: productImages.map((img: string) => ({
        url: img,
        alt: `${productName} - Профессиональная корейская дерматокосметика`,
      })),
    },
    alternates: {
      canonical: productUrl,
      languages: getProductAlternates(product.id),
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

export default async function RussianProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    notFound()
  }

  return (
    <>
      <ProductSchema product={product} locale="ru" canonicalUrl={getLocalizedProductUrl(product.id, 'ru')} />
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Продукты', url: '/ru/products' },
          { name: getLocalizedProductName(product, 'ru'), url: `/ru/products/${product.id}` },
        ]}
      />
      <ProductPageClientRefactored product={product} />
    </>
  )
}



