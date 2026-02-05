import { partnersData } from '@/lib/partners'
import { SITE_URL } from '@/lib/siteConfig'

/**
 * PartnersSchema - Server Component
 * 
 * Renders JSON-LD structured data for partners page.
 * No client-side interactivity needed - pure data rendering.
 */

function extractCity(location: string): string {
  // Extract city from location string
  const cities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah', 'Ajman', 'Fujairah', 'Umm Al Quwain']
  for (const city of cities) {
    if (location.includes(city)) {
      return city
    }
  }
  // Default to Dubai if no city found
  return 'Dubai'
}

export default function PartnersSchema() {
  const baseUrl = SITE_URL
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "GENOSYS Partners in UAE",
    "description": "Network of trusted partners and authorized distributors for GENOSYS professional Korean dermacosmetics across United Arab Emirates",
    "url": `${baseUrl}/partners`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": partnersData.length,
      "itemListElement": partnersData.map((partner, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": partner.name,
          "description": partner.description,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": partner.location,
            "addressLocality": extractCity(partner.location),
            "addressRegion": "UAE",
            "addressCountry": "AE"
          },
          "telephone": partner.phone,
          "url": partner.website,
          "image": partner.logo.startsWith('http') ? partner.logo : `${baseUrl}${partner.logo}`,
          "priceRange": "$$",
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "20:00"
          }
        }
      }))
    },
    "about": {
      "@type": "Organization",
      "name": "GENOSYS Middle East FZ-LLC",
      "url": baseUrl
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}

