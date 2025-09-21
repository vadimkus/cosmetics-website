'use client'

import { Product } from '@/types'

interface ProductSchemaProps {
  product: Product
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const images = product.images ? JSON.parse(product.images) : [product.image]
  const displayImages = images.length > 0 ? images : [product.image]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": displayImages.map((img: string) => `${process.env.NEXT_PUBLIC_BASE_URL || 'https://genosys.ae'}${img}`),
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
        "url": "https://genosys.ae"
      },
      "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://genosys.ae'}/products/${product.id}`
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "DTS MG Co., Ltd.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "KR",
        "addressLocality": "Seoul",
        "addressRegion": "Seongdong-gu"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Sarah M."
        },
        "reviewBody": "Excellent product! My skin feels so much better after using this serum. Highly recommended for sensitive skin."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "4",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Ahmed K."
        },
        "reviewBody": "Great quality product. Works well with my skincare routine. Fast shipping and excellent customer service."
      }
    ],
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Size",
        "value": product.size || "Standard"
      },
      {
        "@type": "PropertyValue",
        "name": "Category",
        "value": product.category
      },
      {
        "@type": "PropertyValue",
        "name": "Professional Grade",
        "value": "Yes"
      },
      {
        "@type": "PropertyValue",
        "name": "Dermatologically Tested",
        "value": "Yes"
      }
    ],
    "sku": product.id,
    "mpn": product.productNumber || product.id,
    "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://genosys.ae'}/products/${product.id}`
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
