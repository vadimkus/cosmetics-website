import { SITE_URL } from '@/lib/siteConfig'

interface CollectionItem {
  name: string
  url: string
  image?: string
  price?: number
  currency?: string
  description?: string
}

interface CollectionPageSchemaProps {
  /** Name of the collection/category */
  name: string
  /** Description of the collection */
  description: string
  /** URL of the collection page */
  url: string
  /** Items in the collection (use this or products) */
  items?: CollectionItem[]
  /** Products to display (auto-converts to items format) */
  products?: Array<{ id: string; name: string; image: string; price: number; description: string; inStock?: boolean }>
  /** Number of items (if items array is truncated) */
  totalItems?: number
}

/**
 * CollectionPageSchema - Server Component
 * 
 * Renders JSON-LD for a CollectionPage with ItemList.
 * Google can show these as product carousels in search results.
 * 
 * Use on:
 * - Product listing pages (/products)
 * - Category pages (/products/category/serums)
 * - Brand pages
 * 
 * @see https://developers.google.com/search/docs/appearance/structured-data/carousel
 */
export default function CollectionPageSchema({
  name,
  description,
  url,
  items: rawItems,
  products,
  totalItems,
}: CollectionPageSchemaProps) {
  const baseUrl = SITE_URL
  const pageUrl = url.startsWith('http') ? url : `${baseUrl}${url}`

  // Convert products to items format if products prop is provided
  const items: CollectionItem[] = rawItems || (products || []).map(p => ({
    name: p.name,
    url: `/products/${p.id}`,
    image: p.image,
    price: p.price,
    currency: 'AED',
    description: p.description,
  }))

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": name,
    "description": description,
    "url": pageUrl,
    "numberOfItems": totalItems || items.length,
    "publisher": {
      "@type": "Organization",
      "name": "GENOSYS Middle East FZ-LLC",
      "url": baseUrl,
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": name,
      "description": description,
      "numberOfItems": totalItems || items.length,
      "itemListElement": items.map((item, index) => {
        const itemUrl = item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
        const listItem: Record<string, unknown> = {
          "@type": "ListItem",
          "position": index + 1,
          "url": itemUrl,
          "name": item.name,
        }

        // Include Product schema within the list item for richer results
        if (item.price || item.image) {
          const product: Record<string, unknown> = {
            "@type": "Product",
            "name": item.name,
            "url": itemUrl,
          }
          if (item.image) {
            product.image = item.image.startsWith('http') 
              ? item.image 
              : `${baseUrl}${item.image}`
          }
          if (item.description) {
            product.description = item.description
          }
          if (item.price) {
            product.offers = {
              "@type": "Offer",
              "price": item.price,
              "priceCurrency": item.currency || "AED",
              "availability": "https://schema.org/InStock",
            }
          }
          product.brand = {
            "@type": "Brand",
            "name": "GENOSYS",
          }
          listItem.item = product
        }

        return listItem
      }),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
