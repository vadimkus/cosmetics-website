import { SITE_URL } from '@/lib/siteConfig'

interface SpeakableSchemaProps {
  /** The page URL */
  url: string
  /** CSS selectors pointing to speakable content sections */
  cssSelectors?: string[]
  /** XPath selectors for speakable content (alternative to CSS) */
  xpathSelectors?: string[]
}

/**
 * SpeakableSchema - Server Component
 * 
 * Marks sections of a page as suitable for text-to-speech (TTS)
 * by voice assistants like Google Assistant.
 * 
 * This helps Google identify the most relevant content to read aloud
 * when users ask voice questions like:
 * - "What is GENOSYS?"
 * - "Where to buy Korean skincare in Dubai?"
 * - "Best professional skincare products UAE"
 * 
 * @see https://developers.google.com/search/docs/appearance/structured-data/speakable
 */
export default function SpeakableSchema({
  url,
  cssSelectors = ['h1', '[data-speakable="true"]', 'meta[name="description"]'],
}: SpeakableSchemaProps) {
  const pageUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": cssSelectors,
    },
    "url": pageUrl,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
