import { SITE_URL } from '@/lib/siteConfig'

interface HowToStep {
  name: string
  text: string
  image?: string
  url?: string
}

interface HowToSupply {
  name: string
  url?: string
}

interface HowToSchemaProps {
  /** Title of the how-to guide */
  name: string
  /** Description of what this how-to achieves */
  description: string
  /** Steps in the guide */
  steps: HowToStep[]
  /** Total time to complete (ISO 8601 duration, e.g., "PT15M" for 15 min) */
  totalTime?: string
  /** Estimated cost */
  estimatedCost?: {
    value: string
    currency: string
  }
  /** Supplies/products needed */
  supply?: HowToSupply[]
  /** Featured image for the guide */
  image?: string
}

/**
 * HowToSchema - Server Component
 * 
 * Renders JSON-LD structured data for how-to/tutorial content.
 * Ideal for skincare routines, product application guides, and
 * treatment procedures.
 * 
 * Google can show these as rich results with step-by-step instructions,
 * images, and estimated time -- great for "how to" searches.
 * 
 * @see https://developers.google.com/search/docs/appearance/structured-data/how-to
 */
export default function HowToSchema({
  name,
  description,
  steps,
  totalTime,
  estimatedCost,
  supply,
  image,
}: HowToSchemaProps) {
  const baseUrl = SITE_URL

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, index) => {
      const stepObj: Record<string, unknown> = {
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.name,
        "text": step.text,
      }
      if (step.image) {
        stepObj.image = step.image.startsWith('http') 
          ? step.image 
          : `${baseUrl}${step.image}`
      }
      if (step.url) {
        stepObj.url = step.url.startsWith('http')
          ? step.url
          : `${baseUrl}${step.url}`
      }
      return stepObj
    }),
  }

  if (totalTime) {
    schema.totalTime = totalTime
  }

  if (estimatedCost) {
    schema.estimatedCost = {
      "@type": "MonetaryAmount",
      "currency": estimatedCost.currency,
      "value": estimatedCost.value,
    }
  }

  if (supply && supply.length > 0) {
    schema.supply = supply.map(s => {
      const supplyObj: Record<string, unknown> = {
        "@type": "HowToSupply",
        "name": s.name,
      }
      if (s.url) {
        supplyObj.url = s.url.startsWith('http') ? s.url : `${baseUrl}${s.url}`
      }
      return supplyObj
    })
  }

  if (image) {
    schema.image = image.startsWith('http') ? image : `${baseUrl}${image}`
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
