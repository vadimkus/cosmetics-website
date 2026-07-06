import { SITE_URL } from '@/lib/siteConfig'

/**
 * WebSiteSchema - Server Component
 * 
 * Renders JSON-LD structured data for the website itself.
 * Enables Google Sitelinks Search Box and helps search engines
 * understand the website's multilingual structure.
 * 
 * @see https://developers.google.com/search/docs/appearance/sitelinks-searchbox
 */
export default function WebSiteSchema() {
  const baseUrl = SITE_URL

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GENOSYS",
    "alternateName": [
      "GENOSYS UAE",
      "Genosys Middle East",
      "جينوسيس",
      "ГЕНОСИС"
    ],
    "url": baseUrl,
    "description": "Official distributor of GENOSYS professional Korean dermacosmetics in UAE. Microneedling devices, skincare products, and beauty treatments.",
    "inLanguage": [
      {
        "@type": "Language",
        "name": "English",
        "alternateName": "en"
      },
      {
        "@type": "Language",
        "name": "Arabic",
        "alternateName": "ar"
      },
      {
        "@type": "Language",
        "name": "Russian",
        "alternateName": "ru"
      }
    ],
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/products?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    ],
    "publisher": {
      "@type": "Organization",
      "name": "GENOSYS Middle East FZ-LLC",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/genosys-logo.png`,
        "width": 200,
        "height": 200
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
