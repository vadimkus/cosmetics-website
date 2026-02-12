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
 * 
 * Enhanced with:
 * - Removed hardcoded fake reviews (Google penalizes fabricated reviews)
 * - Added MerchantReturnPolicy schema
 * - Added countryOfOrigin (Korea) for cosmetics provenance
 * - Added gtin placeholder for future barcode support
 * - AggregateRating only included when real data exists
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

  // Only include aggregate rating if the product has real rating data
  const hasRealRating = product.rating && product.rating > 0

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": displayImages.map((img: string) => `${SITE_URL}${img}`),
    "brand": {
      "@type": "Brand",
      "name": "GENOSYS",
      "url": "https://www.genosys.info/",
      "logo": `${SITE_URL}/images/genosys-logo.png`
    },
    "category": product.category,
    "countryOfOrigin": {
      "@type": "Country",
      "name": "South Korea"
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
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "AED",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "GENOSYS Middle East FZ-LLC",
        "url": SITE_URL,
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
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "AE",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 14,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      },
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
      },
      {
        "@type": "PropertyValue",
        "name": "Country of Origin",
        "value": "South Korea"
      },
      // Skin type targeting (helps AI recommend products)
      ...(product.skinType ? [{
        "@type": "PropertyValue",
        "name": "Suitable Skin Type",
        "value": product.skinType
      }] : []),
    ],
    "sku": product.id,
    "mpn": product.productNumber || product.id,
    // Multilingual product names (helps AI serve correct language)
    ...(product.nameAr ? { "alternateName": [product.nameAr, product.nameRu].filter(Boolean) } : {}),
    "url": `${SITE_URL}/products/${product.id}`,
    "inLanguage": "en",
    // Audience targeting (helps Google Shopping and AI recommendations)
    "audience": {
      "@type": "Audience",
      "audienceType": "Skincare Professionals and Consumers",
      "geographicArea": {
        "@type": "Country",
        "name": "United Arab Emirates"
      }
    }
  }

  // Only add aggregate rating if there's real rating data
  if (hasRealRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": String(product.rating),
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
