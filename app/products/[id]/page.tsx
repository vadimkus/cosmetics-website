import { notFound } from 'next/navigation'
import { Product } from '@/types'
import ProductPageClient from './ProductPageClient'
import type { Metadata } from 'next'
import { getProductById } from '@/lib/productsDb'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    // Use direct database access for better reliability
    return await getProductById(id)
  } catch (error) {
    console.error('Error fetching product:', error)
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
    }
  }

  const images = product.images ? JSON.parse(product.images) : [product.image]
  const displayImages = images.length > 0 ? images : [product.image]
  
  return {
    title: `${product.name} - GENOSYS Professional Korean Dermacosmetics | Genosys Middle East FZ-LLC`,
    description: `${product.description.substring(0, 155)}... Professional Korean dermacosmetics by GENOSYS. Available in UAE.`,
    keywords: `${product.name}, GENOSYS ${product.category}, Korean dermacosmetics, professional skincare, ${product.category.toLowerCase()}, UAE cosmetics`,
    openGraph: {
      title: `${product.name} - GENOSYS Professional Korean Dermacosmetics`,
      description: `${product.description.substring(0, 155)}... Professional Korean dermacosmetics by GENOSYS.`,
      type: 'website',
      images: displayImages.map((img: string) => ({
        url: `https://genosys.ae${img}`,
        width: 800,
        height: 800,
        alt: product.name,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - GENOSYS Professional Korean Dermacosmetics`,
      description: `${product.description.substring(0, 155)}... Professional Korean dermacosmetics by GENOSYS.`,
      images: displayImages.map((img: string) => `https://genosys.ae${img}`),
    },
    alternates: {
      canonical: `https://genosys.ae/products/${product.id}`,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    notFound()
  }

  return <ProductPageClient product={product} />
}
