import { SITE_URL } from '@/lib/siteConfig'

/**
 * LocalBusinessSchema - Server Component
 * 
 * Renders JSON-LD structured data for local business information.
 * No client-side interactivity needed - pure data rendering.
 */
export default function LocalBusinessSchema() {
  const baseUrl = SITE_URL
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}#business`,
    "name": "GENOSYS Middle East FZ-LLC",
    "alternateName": "GENOSYS Dubai",
    "description": "Official distributor of GENOSYS professional Korean dermacosmetics in Dubai, UAE. Professional microneedling devices, skincare products, and beauty treatments.",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/images/genosys-logo.png`,
      "width": 200,
      "height": 200
    },
    "image": {
      "@type": "ImageObject",
      "url": `${baseUrl}/images/genosys-products.jpg`,
      "width": 1200,
      "height": 630
    },
    "address": [
      {
        "@type": "PostalAddress",
        "streetAddress": "Cordoba Residence, Villa E02",
        "addressLocality": "Dubai",
        "addressRegion": "Dubai",
        "addressCountry": "AE",
        "postalCode": "00000"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "MBAM0014 Compass Building, Al Shohada Road, AL Hamra Industrial Zone-FZ",
        "addressLocality": "Ras Al Khaimah",
        "addressRegion": "Ras Al Khaimah",
        "addressCountry": "AE",
        "postalCode": "00000"
      }
    ],
    "geo": [
      {
        "@type": "GeoCoordinates",
        "latitude": "25.2048",
        "longitude": "55.2708",
        "name": "Dubai Office"
      },
      {
        "@type": "GeoCoordinates",
        "latitude": "25.7895",
        "longitude": "55.9590",
        "name": "Ras Al Khaimah Office"
      }
    ],
    "telephone": "+971-58-548-7665",
    "email": "sales@genosys.ae",
    "openingHours": [
      "Mo-Fr 09:00-18:00"
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
    "currenciesAccepted": "AED",
    "areaServed": [
      {
        "@type": "Country",
        "name": "United Arab Emirates"
      },
      {
        "@type": "City",
        "name": "Dubai"
      },
      {
        "@type": "City", 
        "name": "Abu Dhabi"
      },
      {
        "@type": "City",
        "name": "Sharjah"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "GENOSYS Professional Korean Dermacosmetics",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Microneedling Devices",
          "description": "Professional microneedling devices and rollers"
        },
        {
          "@type": "OfferCatalog",
          "name": "Korean Skincare Products",
          "description": "Professional Korean dermacosmetics and skincare"
        },
        {
          "@type": "OfferCatalog",
          "name": "Professional Training",
          "description": "Skincare and beauty treatment training"
        }
      ]
    },
    // NOTE: aggregateRating intentionally removed — Google penalizes fabricated
    // ratings without real user reviews. When a real review system is implemented,
    // re-add aggregateRating here with actual data from the database.
    "sameAs": [
      "https://www.genosys.info/",
      "https://www.instagram.com/genosys.uae/",
      "https://wa.me/971585487665"
    ],
    "foundingDate": "2019",
    "slogan": "Professional Korean Dermacosmetics & Microneedling Devices in Dubai",
    "knowsAbout": [
      "Korean Skincare",
      "Dermacosmetics",
      "Professional Beauty Products",
      "Microneedling",
      "Skincare Training",
      "Korean Beauty Trends"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "certification",
        "recognizedBy": {
          "@type": "Organization",
          "name": "Dubai Municipality"
        },
        "name": "Montaji System Certification"
      }
    ],
    "memberOf": {
      "@type": "Organization",
      "name": "DTS MG Co., Ltd.",
      "url": "https://www.genosys.info/"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
