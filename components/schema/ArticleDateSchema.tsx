/**
 * ArticleDateSchema - Server Component
 * 
 * Adds datePublished and dateModified signals that Google AI Overviews
 * and other AI systems use for citation eligibility.
 * 
 * 86% of AI Overview citations come from pages with clear date signals.
 * 
 * This component renders:
 * 1. JSON-LD WebPage schema with date properties
 * 2. HTML meta tags for datePublished/dateModified (for AI crawlers)
 * 
 * Use on: Blog posts, product pages, informational pages
 */

interface ArticleDateSchemaProps {
  /** When the content was first published */
  datePublished: string
  /** When the content was last modified */
  dateModified: string
  /** Page URL */
  url: string
  /** Author name (for E-E-A-T signals) */
  author?: string
  /** Author credential/title */
  authorTitle?: string
}

export default function ArticleDateSchema({
  datePublished,
  dateModified,
  url,
  author = 'GENOSYS Middle East FZ-LLC',
  authorTitle,
}: ArticleDateSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "datePublished": datePublished,
    "dateModified": dateModified,
    "url": url,
    "author": {
      "@type": authorTitle ? "Person" : "Organization",
      "name": author,
      ...(authorTitle ? { "jobTitle": authorTitle } : {}),
    },
    "publisher": {
      "@type": "Organization",
      "name": "GENOSYS Middle East FZ-LLC",
      "url": "https://genosys.ae",
      "logo": {
        "@type": "ImageObject",
        "url": "https://genosys.ae/favicon/genosys-logo.png",
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
      />
      {/* Meta tags for AI crawlers that read HTML meta instead of JSON-LD */}
      <meta name="datePublished" content={datePublished} />
      <meta name="dateModified" content={dateModified} />
      <meta name="lastModified" content={dateModified} />
      <meta name="article:published_time" content={datePublished} />
      <meta name="article:modified_time" content={dateModified} />
    </>
  )
}
