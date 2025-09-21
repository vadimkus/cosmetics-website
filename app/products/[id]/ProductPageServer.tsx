import type { Metadata } from 'next'
import { Product } from '@/types'
import ProductPageClient from './ProductPageClient'

interface ProductPageServerProps {
  product: Product
}

export default function ProductPageServer({ product }: ProductPageServerProps) {
  return <ProductPageClient product={product} />
}

export async function generateMetadata({ product }: { product: Product }): Promise<Metadata> {
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
