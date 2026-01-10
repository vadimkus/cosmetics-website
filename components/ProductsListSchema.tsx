'use client'
import { warnLog } from '@/lib/logger'

import { Product } from '@/types'

interface ProductsListSchemaProps {
  products: Product[]
  category?: string
}

import { SITE_URL } from '@/lib/siteConfig'

export default function ProductsListSchema({ products, category }: ProductsListSchemaProps) {
  const baseUrl = SITE_URL
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category ? `${category} Products - GENOSYS` : "GENOSYS Products",
    "description": category 
      ? `Professional ${category.toLowerCase()} products by GENOSYS Middle East FZ-LLC. Korean dermacosmetics for professional and home use.`
      : "Professional Korean dermacosmetics by GENOSYS Middle East FZ-LLC. Complete range of skincare products for professional and home use.",
    "url": `${baseUrl}/products${category ? `?category=${category}` : ''}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.map((product, index) => {
        let images = [product.image]
        try {
          if (product.images) {
            const parsedImages = JSON.parse(product.images)
            images = Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages : [product.image]
          }
        } catch (error) {
          warnLog('Error parsing images for product:', product.id, error)
          images = [product.image]
        }
        const displayImages = images.length > 0 ? images : [product.image]
        
        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": displayImages.map((img: string) => `${baseUrl}${img}`),
            "brand": {
              "@type": "Brand",
              "name": "GENOSYS"
            },
            "category": product.category,
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "AED",
              "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "GENOSYS Middle East FZ-LLC",
                "url": baseUrl
              },
              "url": `${baseUrl}/products/${product.id}`
            },
            "sku": product.id,
            "mpn": product.productNumber || product.id,
            "url": `${baseUrl}/products/${product.id}`
          }
        }
      })
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Products",
          "item": `${baseUrl}/products`
        },
        ...(category ? [{
          "@type": "ListItem",
          "position": 3,
          "name": category,
          "item": `${baseUrl}/products?category=${category}`
        }] : [])
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "GENOSYS Middle East FZ-LLC",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/favicon/genosys-logo.png`
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
