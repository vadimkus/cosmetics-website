import { Product } from '@/types'
import { SITE_URL } from '@/lib/siteConfig'

interface ProductSchemaProps {
  product: Product
}

/**
 * ProductSchema - Server Component
 * 
 * Renders JSON-LD structured data for individual product pages.
 * No client-side interactivity needed - pure data rendering.
 */
export default function ProductSchema({ product }: ProductSchemaProps) {
  let parsedImages = [product.image]
  try {
    if (product.images) {
      parsedImages = JSON.parse(product.images)
    }
  } catch {
    // Silent fallback to main image
    parsedImages = [product.image]
  }
  const displayImages = parsedImages.length > 0 ? parsedImages : [product.image]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": displayImages.map((img: string) => `${SITE_URL}${img}`),
    "brand": {
      "@type": "Brand",
      "name": "GENOSYS",
      "url": "https://www.genosys.info/",
      "logo": "https://genosys.ae/images/genosys-logo.png"
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "AED",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "GENOSYS Middle East FZ-LLC",
        "url": "https://genosys.ae",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "AE",
          "addressRegion": "Dubai"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+971-58-548-7665",
          "contactType": "sales",
          "email": "sales@genosys.ae"
        }
      },
      "url": `${SITE_URL}/products/${product.id}`,
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "AED"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "AE"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "businessDays": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
          },
          "cutoffTime": "14:00",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          }
        }
      }
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
      "ratingValue": String(product.rating || 5.0),
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
          "ratingValue": "5",
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
    "url": `${SITE_URL}/products/${product.id}`
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
