'use client'

export default function LocalBusinessSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://genosys.ae'
  
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
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Microneedling Devices",
            "description": "Professional microneedling devices and rollers"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Korean Skincare Products",
            "description": "Professional Korean dermacosmetics and skincare"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Professional Training",
            "description": "Skincare and beauty treatment training"
          }
        }
      ]
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
          "name": "Dr. Sarah Ahmed"
        },
        "reviewBody": "Excellent professional products and outstanding customer service. Highly recommended for dermatology clinics."
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
          "name": "Maria Santos"
        },
        "reviewBody": "Great quality Korean skincare products. Fast delivery and professional service."
      }
    ],
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
