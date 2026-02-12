import { SITE_URL } from '@/lib/siteConfig'

/**
 * OrganizationSchema - Server Component
 * 
 * Renders JSON-LD structured data for organization information.
 * No client-side interactivity needed - pure data rendering.
 * 
 * Enhanced with:
 * - inLanguage for multilingual support (EN/AR/RU)
 * - Russian added to availableLanguage
 * - Consistent sameAs links
 */
export default function OrganizationSchema() {
  const baseUrl = SITE_URL
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GENOSYS Middle East FZ-LLC",
    "alternateName": [
      "GENOSYS",
      "GENOSYS UAE",
      "جينوسيس الشرق الأوسط",
      "ГЕНОСИС Ближний Восток"
    ],
    "description": "Official distributor of GENOSYS professional Korean dermacosmetics in the United Arab Emirates. Providing high-quality skincare products for professional and home use.",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/favicon/genosys-logo.png`,
      "width": 200,
      "height": 200
    },
    "image": {
      "@type": "ImageObject",
      "url": `${baseUrl}/images/genosys-products.jpg`,
      "width": 1200,
      "height": 630
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AE",
      "addressRegion": "Dubai",
      "addressLocality": "Dubai"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+971-58-548-7665",
        "contactType": "sales",
        "availableLanguage": ["English", "Arabic", "Russian"],
        "areaServed": "AE"
      },
      {
        "@type": "ContactPoint",
        "email": "sales@genosys.ae",
        "contactType": "customer service",
        "availableLanguage": ["English", "Arabic", "Russian"]
      }
    ],
    "sameAs": [
      "https://www.instagram.com/genosys.uae/",
      "https://www.instagram.com/genosys.ae/",
      "https://wa.me/971585487665",
      "https://www.genosys.info/"
    ],
    "foundingDate": "2019",
    "slogan": "Professional Korean Dermacosmetics & Microneedling Devices",
    "inLanguage": ["en", "ar", "ru"],
    "knowsAbout": [
      "Korean Skincare",
      "Dermacosmetics",
      "Professional Beauty Products",
      "Skincare Solutions",
      "Beauty Devices",
      "Microneedling",
      "Professional Training",
      "Korean Beauty Trends",
      "K-Beauty",
      "Dermatological Skincare"
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
    },
    "makesOffer": {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "GENOSYS Professional Skincare Products",
        "description": "Complete range of professional Korean dermacosmetics"
      },
      "priceCurrency": "AED",
      "availability": "https://schema.org/InStock"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United Arab Emirates"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
