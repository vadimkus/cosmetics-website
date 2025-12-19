import { notFound } from 'next/navigation'
import { Product } from '@/types'
import ProductPageClientRefactored from '@/app/products/[id]/ProductPageClientRefactored'
import type { Metadata } from 'next'
import { getProductById } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
import { safeJsonParse } from '@/lib/utils'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await getProductById(id)
    if (product) {
      if (product.noDiscount === undefined) {
        product.noDiscount = false
      }
    }
    return product
  } catch {
    errorLog('Error fetching product:', error)
    return null
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    return {
      title: 'Продукт не найден - GENOSYS Middle East FZ-LLC',
      description: 'Запрашиваемый продукт не найден.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const images = product.images ? safeJsonParse<string[]>(product.images, [product.image]) : [product.image]
  const displayImages = images.length > 0 ? images : [product.image]
  
  const productTitle = `${product.name} - Профессиональная корейская дерматокосметика ОАЭ | GENOSYS Middle East FZ-LLC`
  const productDescription = `${product.description.substring(0, 150)}... Профессиональная корейская дерматокосметика от GENOSYS. Официальный дистрибьютор в ОАЭ. Бесплатная доставка при заказе свыше 1000 дирхамов.`
  const productKeywords = [
    product.name,
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
      url: `https://genosys.ae/ru/products/${product.id}`,
      siteName: 'GENOSYS Middle East FZ-LLC',
      images: displayImages.map((img: string) => ({
        url: `https://genosys.ae${img}`,
        width: 800,
        height: 800,
        alt: `${product.name} - Профессиональная корейская дерматокосметика`,
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
      images: displayImages.map((img: string) => ({
        url: `https://genosys.ae${img}`,
        alt: `${product.name} - Профессиональная корейская дерматокосметика`,
      })),
    },
    alternates: {
      canonical: `https://genosys.ae/ru/products/${product.id}`,
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

export default async function RussianProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    notFound()
  }

  return <ProductPageClientRefactored product={product} />
}



