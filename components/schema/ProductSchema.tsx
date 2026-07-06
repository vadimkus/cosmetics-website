import { Product } from '@/types'
import { SITE_URL } from '@/lib/siteConfig'
import type { Locale } from '@/lib/i18n'
import {
  getLocalizedProductDescription,
  getLocalizedProductName,
  getProductImageUrls,
  parseStringArray,
} from '@/lib/seo'

interface ProductSchemaProps {
  product: Product
  locale?: Locale
  canonicalUrl?: string
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
 * - audience: single PeopleAudience (Merchant Center / Search expects suggestedGender + age — not generic Audience or arrays)
 */
export default function ProductSchema({ product, locale = 'en', canonicalUrl }: ProductSchemaProps) {
  // Skip Product schema entirely for products without a valid price.
  // Google requires "offers", "review", or "aggregateRating" for @type:Product.
  // Products with price = 0 or isPriceOnRequest generate invalid Product snippets.
  if (!product.price || product.price <= 0 || product.isPriceOnRequest) {
    return null
  }

  const productUrl = canonicalUrl ?? `${SITE_URL}/products/${product.id}`
  const productName = getLocalizedProductName(product, locale)
  const productDescription = getLocalizedProductDescription(product, locale)
  const targetConcerns = parseStringArray(product.targetConcerns)
  const productImages = getProductImageUrls(product)

  // NOTE: aggregateRating is intentionally NOT emitted because we don't have
  // a real review/rating system yet. Google requires reviewCount or ratingCount
  // alongside ratingValue for AggregateRating. Outputting ratingValue alone
  // triggers "Multiple reviews without aggregateRating" errors.
  // When a real review system is added, uncomment the aggregateRating block below.

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "description": productDescription,
    "image": productImages,
    "brand": {
      "@type": "Brand",
      "name": "GENOSYS",
      "url": "https://www.genosys.info/",
      "logo": `${SITE_URL}/images/genosys-logo.png`
    },
    "category": product.category,
    // https://support.google.com/merchants/answer/6386198 — Product.audience must be PeopleAudience with gender/age, not @type Audience.
    "audience": {
      "@type": "PeopleAudience",
      "suggestedGender": "unisex",
      "suggestedMinAge": 13,
    },
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
    ...(product.howToUse || product.directions ? { "usageInfo": product.howToUse || product.directions } : {}),
    ...(targetConcerns.length > 0 ? {
      "isRelatedTo": targetConcerns.map(concern => ({
        "@type": "Thing",
        "name": concern
      }))
    } : {}),
    "offers": {
      "@type": "Offer",
      // Price is intentionally NOT emitted — product prices are gated behind
      // login site-wide, so exposing them in JSON-LD (readable by any crawler/
      // scraper) would contradict that. Availability, seller, shipping and
      // returns are public and safe to keep. (Mirrors the OG-tag decision.)
      "priceCurrency": "AED",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
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
      "url": productUrl,
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "AE",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 14,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      },
      "shippingDetails": [
        {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "45",
            "currency": "AED"
          },
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "AE",
            "addressRegion": "Dubai"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "businessDays": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            },
            "cutoffTime": "14:00",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 1,
              "unitCode": "DAY"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 1,
              "unitCode": "DAY"
            }
          }
        },
        {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "70",
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
              "minValue": 0,
              "maxValue": 1,
              "unitCode": "DAY"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 1,
              "maxValue": 2,
              "unitCode": "DAY"
            }
          }
        }
      ]
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
      ...(targetConcerns.length > 0 ? [{
        "@type": "PropertyValue",
        "name": "Target Concerns",
        "value": targetConcerns.join(", ")
      }] : []),
      ...(product.usage ? [{
        "@type": "PropertyValue",
        "name": "Usage Timing",
        "value": product.usage
      }] : []),
    ],
    "sku": product.productNumber || product.id,
    "mpn": product.productNumber || product.id,
    // Multilingual product names (helps AI serve correct language)
    "alternateName": [product.name, product.nameAr, product.nameRu].filter(Boolean),
    "url": productUrl,
    "inLanguage": locale,
    "availableLanguage": ["English", "Arabic", "Russian"],
  }

  // When a real review system is implemented, enable this:
  // if (product.rating && product.rating > 0 && product.reviewCount > 0) {
  //   schema.aggregateRating = {
  //     "@type": "AggregateRating",
  //     "ratingValue": String(product.rating),
  //     "reviewCount": String(product.reviewCount),
  //     "bestRating": "5",
  //     "worstRating": "1"
  //   }
  // }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
