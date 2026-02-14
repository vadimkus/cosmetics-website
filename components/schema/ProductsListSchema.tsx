import { Product } from '@/types'
import { SITE_URL } from '@/lib/siteConfig'

interface ProductsListSchemaProps {
  products: Product[]
  category?: string
}

/**
 * ProductsListSchema - Server Component
 * 
 * Renders JSON-LD structured data for product collection pages.
 * No client-side interactivity needed - pure data rendering.
 */
export default function ProductsListSchema({ products, category }: ProductsListSchemaProps) {
  const baseUrl = SITE_URL
  
  // Filter to only products with valid prices — Google requires "offers", "review",
  // or "aggregateRating" for @type:Product. Products with price=0 or isPriceOnRequest
  // generate invalid Product snippets (GSC error: "Either offers, review, or aggregateRating should be specified").
  const validProducts = products.filter(p => p.price > 0 && !p.isPriceOnRequest)
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category ? `${category} Products - GENOSYS` : "GENOSYS Products",
    "description": category 
      ? `Professional ${category.toLowerCase()} products by GENOSYS Middle East FZ-LLC. Korean dermacosmetics for professional and home use.`
      : "Professional Korean dermacosmetics by GENOSYS Middle East FZ-LLC. Complete range of skincare products for professional and home use.",
    "url": `${baseUrl}/products${category ? `?category=${category}` : ''}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": validProducts.length,
      "itemListElement": validProducts.map((product, index) => {
        let images = [product.image]
        try {
          if (product.images) {
            const parsedImages = JSON.parse(product.images)
            images = Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages : [product.image]
          }
        } catch {
          // Silent fallback to main image if parsing fails
          images = [product.image]
        }
        const displayImages = images.length > 0 ? images : [product.image]
        
        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": displayImages.map((img: string) => `${baseUrl}${img}`),
            "brand": {
              "@type": "Brand",
              "name": "GENOSYS"
            },
            "category": product.category,
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "AED",
              "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "GENOSYS Middle East FZ-LLC",
                "url": baseUrl
              },
              "url": `${baseUrl}/products/${product.id}`,
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "AE",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                "merchantReturnDays": 14,
                "returnMethod": "https://schema.org/ReturnByMail",
                "returnFees": "https://schema.org/FreeReturn",
              },
            },
            "sku": product.id,
            "mpn": product.productNumber || product.id,
            "url": `${baseUrl}/products/${product.id}`
          }
        }
      })
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Products",
          "item": `${baseUrl}/products`
        },
        ...(category ? [{
          "@type": "ListItem",
          "position": 3,
          "name": category,
          "item": `${baseUrl}/products?category=${category}`
        }] : [])
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "GENOSYS Middle East FZ-LLC",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/favicon/genosys-logo.png`
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
